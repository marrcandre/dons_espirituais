import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { questions } from '../data/questions.js'
import { useAuthStore } from './auth.js'
import { shuffle } from '../helpers/array.js'
import { checkSavedSession, clearSession, saveSession } from '../application/quiz/quiz-session'

export const useQuizStore = defineStore('quiz', () => {
  const authStore = useAuthStore()

  // Estado
  const questionOrder = ref([])   // array de ids embaralhados
  const answers = ref({})         // { questionId: value (0–3) }
  const currentIndex = ref(0)
  const userInfo = ref({ name: '', gp: '', age: '' })
  const hasSavedState = ref(false)

  const totalQuestions = computed(() => questions.length)
  const currentQuestionId = computed(() => questionOrder.value[currentIndex.value])
  const currentQuestion = computed(() =>
    questions.find((q) => q.id === currentQuestionId.value)
  )
  const progress = computed(() =>
    Math.round((Object.keys(answers.value).length / totalQuestions.value) * 100)
  )
  const isComplete = computed(() =>
    Object.keys(answers.value).length === totalQuestions.value
  )

  /** Verifica se há estado salvo no localStorage para o usuário atual */
  function checkSavedState() {
    const userId = authStore.user?.id
    if (!userId) return false

    const saved = checkSavedSession(userId)

    if (saved) {
      hasSavedState.value = true
      return true
    }

    hasSavedState.value = false
    return false
  }

  /** Inicia um novo quiz, descartando qualquer estado salvo */
  function startFresh() {
    const order = shuffle(questions.map((q) => q.id))
    questionOrder.value = order
    answers.value = {}
    currentIndex.value = 0
    userInfo.value = { name: '', gp: '', age: '' }
    hasSavedState.value = false
    persistState()
  }

  /** Restaura o quiz a partir do localStorage */
  function restoreSaved() {
    const userId = authStore.user?.id
    if (!userId) return

    const saved = checkSavedSession(userId)
    if (!saved) return

    questionOrder.value = saved.questionOrder
    answers.value = saved.answers ?? {}
    currentIndex.value = saved.currentIndex ?? 0
    userInfo.value = saved.userInfo ?? { name: '', gp: '', age: '' }
    hasSavedState.value = false
  }

  /** Salva o estado atual no localStorage */
  function persistState() {
    const userId = authStore.user?.id
    if (!userId) return

    saveSession(userId, {
      questionOrder: questionOrder.value,
      answers: answers.value,
      currentIndex: currentIndex.value,
      userInfo: userInfo.value,
      savedAt: Date.now(),
    })
  }

  /** Registra a resposta de uma questão */
  function setAnswer(questionId, value) {
    answers.value = { ...answers.value, [questionId]: value }
    persistState()
  }

  /** Avança para a próxima questão */
  function nextQuestion() {
    if (currentIndex.value < totalQuestions.value - 1) {
      currentIndex.value++
      persistState()
    }
  }

  /** Volta para a questão anterior */
  function prevQuestion() {
    if (currentIndex.value > 0) {
      currentIndex.value--
      persistState()
    }
  }

  /** Atualiza os dados do usuário */
  function setUserInfo(info) {
    userInfo.value = { ...userInfo.value, ...info }
    persistState()
  }

  /** Limpa o estado após envio bem-sucedido */
  function clearState() {
    const userId = authStore.user?.id
    if (userId) clearSession(userId)

    questionOrder.value = []
    answers.value = {}
    currentIndex.value = 0
    userInfo.value = { name: '', gp: '', age: '' }
    hasSavedState.value = false
  }

  /** Retorna o número de respostas salvas (para exibir no dialog de retomada) */
  const savedAnswerCount = computed(() => {
    const userId = authStore.user?.id
    if (!userId) return 0

    const saved = checkSavedSession(userId)
    return saved ? Object.keys(saved.answers ?? {}).length : 0
  })

  return {
    questionOrder,
    answers,
    currentIndex,
    userInfo,
    hasSavedState,
    totalQuestions,
    currentQuestionId,
    currentQuestion,
    progress,
    isComplete,
    savedAnswerCount,
    checkSavedState,
    startFresh,
    restoreSaved,
    setAnswer,
    nextQuestion,
    prevQuestion,
    setUserInfo,
    clearState,
  }
})
