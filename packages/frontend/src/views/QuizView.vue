<template>
  <AppPage layout="reading">
    <PageHeader
      title="Descubra seus dons espirituais"
      subtitle="Responda com sinceridade. Seu progresso e respostas continuam sendo salvos normalmente."
    />

    <!-- Dialog: retomar ou recomeçar -->
    <v-dialog v-model="showResumeDialog" max-width="440" persistent>
      <AppCard variant="compact">
        <SectionTitle title="Teste em andamento" />

        <p>
          Você tem <strong>{{ quizStore.savedAnswerCount }} de 135</strong> respostas salvas.
          Deseja continuar de onde parou?
        </p>

        <div class="d-flex justify-end ga-2">
          <AppButton variant="outlined" color="grey" @click="handleStartFresh">Recomeçar</AppButton>
          <AppButton color="primary" variant="flat" @click="handleResume">Continuar</AppButton>
        </div>
      </AppCard>
    </v-dialog>

    <!-- Etapa 1: Dados do usuário -->
    <AppCard v-if="step === 'userInfo'" variant="compact">
      <UserInfoForm @submit="handleUserInfoSubmit" />
    </AppCard>

    <!-- Etapa 2: Teste -->
    <template v-else-if="step === 'quiz'">
      <QuizProgress :progress="quizStore.progress" :current="quizStore.currentIndex + 1"
        :total="quizStore.totalQuestions" />

      <div v-if="authStore.isAdmin" class="quiz-controls d-flex justify-end mb-2">
        <AppButton color="warning" variant="outlined" size="small" prepend-icon="mdi-lightning-bolt" @click="finishTestNow">
          Finalizar teste
        </AppButton>
      </div>

      <QuestionStep v-if="quizStore.currentQuestion" :question="quizStore.currentQuestion"
        :model-value="quizStore.answers[quizStore.currentQuestionId]" @update:model-value="handleAnswer"
        @next="handleNext" @prev="handlePrev" :is-first="quizStore.currentIndex === 0"
        :is-last="quizStore.currentIndex === quizStore.totalQuestions - 1" />
    </template>


    <!-- Etapa 3: Enviando -->
    <AppCard v-else-if="step === 'submitting'" variant="compact">
      <LoadingState message="Salvando seus resultados..." :size="64" :thickness="6" />
    </AppCard>
  </AppPage>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz.js'
import { useAuthStore } from '../stores/auth.js'
import { submitQuiz as submitQuizUseCase } from '../application/quiz/submit-quiz'
import { checkSavedSession } from '../application/quiz/quiz-session'
import UserInfoForm from '../components/UserInfoForm.vue'
import QuizProgress from '../components/QuizProgress.vue'
import QuestionStep from '../components/QuestionStep.vue'
import AppPage from '../components/ui/AppPage.vue'
import PageHeader from '../components/ui/PageHeader.vue'
import AppButton from '../components/ui/AppButton.vue'
import AppCard from '../components/ui/AppCard.vue'
import SectionTitle from '../components/ui/SectionTitle.vue'
import LoadingState from '../components/ui/LoadingState.vue'

const router = useRouter()
const quizStore = useQuizStore()
const authStore = useAuthStore()

const step = ref('loading')
const showResumeDialog = ref(false)
const autoAdvancing = ref(false)

function preMarkZeroIfBlank() {
  const id = quizStore.currentQuestionId
  if (quizStore.answers[id] === undefined) {
    quizStore.setAnswer(id, 0)
  }
}

onMounted(() => {
  const saved = authStore.user ? checkSavedSession(authStore.user.id) : null
  if (saved) {
    showResumeDialog.value = true
  } else {
    quizStore.startFresh()
    step.value = 'userInfo'
  }
})

function handleResume() {
  showResumeDialog.value = false
  quizStore.restoreSaved()
  // Se ainda não tem userInfo preenchido, voltar para essa etapa
  step.value = quizStore.userInfo.name ? 'quiz' : 'userInfo'
}

function handleStartFresh() {
  showResumeDialog.value = false
  quizStore.startFresh()
  step.value = 'userInfo'
}

function handleUserInfoSubmit(info) {
  quizStore.setUserInfo(info)
  step.value = 'quiz'
  preMarkZeroIfBlank()
}

function handleAnswer(val) {
  const isLast = quizStore.currentIndex === quizStore.totalQuestions - 1
  quizStore.setAnswer(quizStore.currentQuestionId, val)

  // Auto-avanço após 350ms para o usuário ver a seleção
  if (!autoAdvancing.value) {
    autoAdvancing.value = true
    setTimeout(async () => {
      autoAdvancing.value = false
      if (isLast) {
        await submitQuiz()
      } else {
        quizStore.nextQuestion()
        preMarkZeroIfBlank()
      }
    }, 350)
  }
}

function handlePrev() {
  quizStore.prevQuestion()
  preMarkZeroIfBlank()
}

async function handleNext() {
  if (!quizStore.isComplete) {
    quizStore.nextQuestion()
    preMarkZeroIfBlank()
    return
  }
  await submitQuiz()
}

async function finishTestNow() {
  for (let i = 0; i < quizStore.totalQuestions; i++) {
    if (quizStore.answers[i] === undefined) {
      quizStore.setAnswer(
        i,
        Math.floor(Math.random() * 4)
      )
    }
  }

  await submitQuiz()
}

async function submitQuiz() {
  step.value = 'submitting'

  try {
    const result = await submitQuizUseCase({
      answers: quizStore.answers,
      userInfo: quizStore.userInfo,
      userId: authStore.user.id,
      userEmail: authStore.user.email,
      questionOrder: quizStore.questionOrder,
    })

    quizStore.clearState()
    router.push({ name: 'results', params: { id: result.id } })
  } catch (err) {
    console.error('Erro ao salvar respostas:', err)
    step.value = 'quiz'
  }
}
</script>
