<template>
  <AppPage class="mt-lg mb-lg">

    <!-- LOADING -->
    <LoadingState v-if="loading" class="py-8" :size="56" :thickness="5" />

    <template v-else>

      <!-- FILTERS -->
      <section class="mb-3 mb-sm-4">
        <AppCard variant="compact">
          <v-text-field
            v-model="search"
            label="Buscar..."
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            rounded="lg"
            clearable
            hide-details
          />
        </AppCard>
      </section>

      <!-- STATS -->
      <section class="mb-3 mb-sm-4">
        <AppCard variant="compact">
          <v-row dense>
            <v-col cols="6" sm="3">
              <div
                class="dashboard-item"
                :class="{ 'dashboard-active': quickFilter === 'all' }"
                @click="quickFilter = 'all'"
              >
                <div class="dashboard-item-meta d-flex align-center ga-2">
                  <v-icon size="16" color="primary">
                    mdi-counter
                  </v-icon>

                  <span class="text-caption text-medium-emphasis">Total</span>
                </div>

                <strong class="dashboard-item-value">{{ total }}</strong>
              </div>
            </v-col>

            <v-col cols="6" sm="3">
              <div
                class="dashboard-item"
                :class="{ 'dashboard-active': quickFilter === 'without-ai' }"
                @click="quickFilter = quickFilter === 'without-ai' ? 'all' : 'without-ai'"
              >
                <div class="dashboard-item-meta d-flex align-center ga-2">
                  <v-icon size="16" color="warning">
                    mdi-file-document-alert-outline
                  </v-icon>

                  <span class="text-caption text-medium-emphasis">Sem IA</span>
                </div>

                <strong class="dashboard-item-value">{{ totalWithoutAI }}</strong>
              </div>
            </v-col>

            <v-col cols="6" sm="3">
              <div
                class="dashboard-item"
                :class="{ 'dashboard-active': quickFilter === 'today' }"
                @click="quickFilter = quickFilter === 'today' ? 'all' : 'today'"
              >
                <div class="dashboard-item-meta d-flex align-center ga-2">
                  <v-icon size="16" color="primary">
                    mdi-calendar-today
                  </v-icon>

                  <span class="text-caption text-medium-emphasis">Hoje</span>
                </div>

                <strong class="dashboard-item-value">{{ totalToday }}</strong>
              </div>
            </v-col>

            <v-col cols="6" sm="3">
              <div
                class="dashboard-item"
                :class="{ 'dashboard-active': quickFilter === 'week' }"
                @click="quickFilter = quickFilter === 'week' ? 'all' : 'week'"
              >
                <div class="dashboard-item-meta d-flex align-center ga-2">
                  <v-icon size="16" color="primary">
                    mdi-calendar-week
                  </v-icon>

                  <span class="text-caption text-medium-emphasis">7 dias</span>
                </div>

                <strong class="dashboard-item-value">{{ totalWeek }}</strong>
              </div>
            </v-col>
          </v-row>
        </AppCard>
      </section>

      <!-- ERROR -->
      <section v-if="error" class="mb-3 mb-sm-4">
        <ErrorState
          title="Erro ao carregar painel admin"
          :description="error"
          button-label="Tentar novamente"
          @action="loadRows"
        />
      </section>

      <!-- TABLE -->
      <section class="mb-3 mb-sm-4">
        <AppCard variant="compact">
          <EmptyState
            v-if="!error && !filteredRows.length"
            class="pa-4"
            title="Nenhum resultado para os filtros atuais"
            description="Ajuste a busca ou os filtros rápidos para visualizar os registros."
            card-variant="compact"
          />

          <v-data-table
            v-else
            :headers="headers"
            :items="filteredRows"
            item-value="id"
            class="rounded-xl admin-table"
            :density="tableDensity"
            :items-per-page="25"
          >
            <template #item.status="{ item }">
              <v-icon
                size="18"
                class="status-icon clickable"
                :class="{ active: item.ai_analysis }"
                @click.stop="goToResult(item.id)"
              >
                mdi-file-document-outline
              </v-icon>
            </template>

            <!-- ACTIONS -->
            <template #item.name="{ item }">
              <div v-if="nameEditor.rowId === item.id" class="inline-cell-editor">
                <v-text-field
                  v-model="nameEditor.draft"
                  class="inline-edit-input"
                  density="compact"
                  variant="outlined"
                  hide-details
                  autofocus
                  :disabled="nameEditor.isSaving"
                  :error-messages="nameEditor.error"
                  @keyup.enter="saveName(item)"
                  @keyup.esc="cancelNameEdit"
                />

                <v-btn
                  icon="mdi-check"
                  color="success"
                  size="small"
                  :loading="nameEditor.isSaving"
                  @click="saveName(item)"
                />

                <v-btn
                  icon="mdi-close"
                  variant="text"
                  size="small"
                  :disabled="nameEditor.isSaving"
                  @click="cancelNameEdit"
                />
              </div>

              <span
                v-else
                :class="[
                  { 'text-grey': !item.name },
                  authStore.isAdmin ? 'hover-text is-editable' : ''
                ]"
                @click="startNameEdit(item)"
              >
                {{ item.name || '[sem nome]' }}
              </span>
            </template>

            <template #item.gp="{ item }">
              <div v-if="gpEditor.rowId === item.id" class="inline-cell-editor">
                <v-text-field
                  v-model="gpEditor.draft"
                  class="inline-edit-input"
                  density="compact"
                  variant="outlined"
                  hide-details
                  autofocus
                  :disabled="gpEditor.isSaving"
                  :error-messages="gpEditor.error"
                  @keyup.enter="saveGP(item)"
                  @keyup.esc="cancelGPEdit"
                />

                <v-btn
                  icon="mdi-check"
                  color="success"
                  size="small"
                  :loading="gpEditor.isSaving"
                  @click="saveGP(item)"
                />

                <v-btn
                  icon="mdi-close"
                  variant="text"
                  size="small"
                  :disabled="gpEditor.isSaving"
                  @click="cancelGPEdit"
                />
              </div>

              <span
                v-else
                :class="[
                  { 'text-grey': !item.gp },
                  authStore.isAdmin ? 'hover-text is-editable' : ''
                ]"
                @click="startGPEdit(item)"
              >
                {{ item.gp || '[sem GP]' }}
              </span>
            </template>

            <template #item.created_at="{ item }">
              {{ formatDateTime(item.created_at) }}
            </template>
          </v-data-table>
        </AppCard>
      </section>

      <!-- ACTIONS -->
      <section class="mb-3 mb-sm-4">
        <v-alert
          type="info"
          variant="tonal"
          density="compact"
          class="text-body-2"
          icon="mdi-information-outline"
        >
          Clique no nome ou GP para edição inline e no ícone de status para abrir o resultado.
        </v-alert>
      </section>

      <!-- DIALOGS -->

      <!-- SNACKBARS -->
    </template>
  </AppPage>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { useAuthStore } from '../stores/auth.js'
import { useResponsesStore } from '../stores/responses.js'
import { formatDateTime } from '../helpers/date.js'
import AppPage from "../components/ui/AppPage.vue";
import LoadingState from "../components/ui/LoadingState.vue";
import EmptyState from "../components/ui/EmptyState.vue";
import ErrorState from "../components/ui/ErrorState.vue";

// =========================================================
// ROUTE / STORE
// =========================================================
const authStore = useAuthStore()
const responseStore = useResponsesStore()
const router = useRouter();
const { mobile } = useDisplay()
const tableDensity = computed(() => mobile.value ? 'compact' : 'comfortable')

// =========================================================
// STATE
// =========================================================
const loading = computed(() => responseStore.loading);
const error = computed(() => responseStore.error);
const rows = computed(() => responseStore.list);

const search = ref("");
const quickFilter = ref('all');

const nameEditor = reactive({
  rowId: null,
  draft: '',
  isSaving: false,
  error: '',
});
const gpEditor = reactive({
  rowId: null,
  draft: '',
  isSaving: false,
  error: '',
});

// =========================================================
// COMPUTED
// =========================================================
const total = computed(() => rows.value.length);

const totalToday = computed(() => {
  const today = new Date().toDateString();

  return rows.value.filter((r) => new Date(r.created_at).toDateString() === today).length;
});

const totalWeek = computed(() => {
  const last7Days = new Date();

  last7Days.setDate(last7Days.getDate() - 7);

  return rows.value.filter((r) => new Date(r.created_at) >= last7Days).length;
});

const totalWithoutAI = computed(() => rows.value.filter((r) => !r.ai_analysis).length);

const filteredRows = computed(() => {
  return rows.value.filter((r) => {
    const term = search.value?.toLowerCase() ?? "";

    const matchSearch =
      !term ||
      r.name?.toLowerCase().includes(term) ||
      r.gp?.toLowerCase().includes(term);

    let matchQuickFilter = true;

    if (quickFilter.value === "without-ai") {
      matchQuickFilter = !r.ai_analysis;
    }

    if (quickFilter.value === "today") {
      matchQuickFilter =
        new Date(r.created_at).toDateString() === new Date().toDateString();
    }

    if (quickFilter.value === "week") {
      const last7Days = new Date();

      last7Days.setDate(last7Days.getDate() - 7);

      matchQuickFilter = new Date(r.created_at) >= last7Days;
    }

    return matchSearch && matchQuickFilter;
  });
});

// =========================================================
// DATA
// =========================================================
const headers = [
  { title: "", key: "status", sortable: false, width: 24 },
  { title: "Nome", key: "name", sortable: true },
  { title: "GP", key: "gp", sortable: true },
  { title: "Respondido em", key: "created_at", sortable: true },
  { title: "Idade", key: "age", sortable: true, width: 40 },
];

// =========================================================
// ACTIONS
// =========================================================
function goToResult(id) {
  router.push({ name: "results", params: { id } });
}

async function updateField(id, field, value) {
  return responseStore.updateField(id, field, value)
}

function startNameEdit(item) {
  if (!authStore.isAdmin) return

  nameEditor.rowId = item.id
  nameEditor.draft = item.name || ''
  nameEditor.error = ''
}

function cancelNameEdit() {
  if (nameEditor.isSaving) return

  nameEditor.rowId = null
  nameEditor.draft = ''
  nameEditor.error = ''
}

async function saveName(item) {
  if (!authStore.isAdmin) return

  const name = nameEditor.draft.trim()

  if (!name) {
    nameEditor.error = 'Informe um nome.'
    return
  }

  nameEditor.isSaving = true
  nameEditor.error = ''

  try {
    const updated = await updateField(item.id, "name", name)

    if (!updated) {
      nameEditor.error = 'Não foi possível salvar.'
      return
    }

    item.name = name
    nameEditor.rowId = null
    nameEditor.draft = ''
  } finally {
    nameEditor.isSaving = false
  }
}

function startGPEdit(item) {
  if (!authStore.isAdmin) return

  gpEditor.rowId = item.id
  gpEditor.draft = item.gp || ''
  gpEditor.error = ''
}

function cancelGPEdit() {
  if (gpEditor.isSaving) return

  gpEditor.rowId = null
  gpEditor.draft = ''
  gpEditor.error = ''
}

async function saveGP(item) {
  if (!authStore.isAdmin) return

  const gp = gpEditor.draft.trim();

  gpEditor.isSaving = true
  gpEditor.error = ''

  try {
    const updated = await updateField(item.id, "gp", gp);

    if (!updated) {
      gpEditor.error = 'Não foi possível salvar.'
      return
    }

    item.gp = gp;
    gpEditor.rowId = null
    gpEditor.draft = ''
  } finally {
    gpEditor.isSaving = false
  }
}

async function loadRows() {
  await responseStore.fetchAll("id, name, gp, age, created_at, ai_analysis")
}

// =========================================================
// =========================================================
// LIFECYCLE
// =========================================================
onMounted(loadRows);
</script>

<style scoped>
.status-icon {
  cursor: default;
  transition: transform var(--duration-fast) var(--easing-standard),
    color var(--duration-fast) var(--easing-standard);
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.status-icon:hover {
  transform: scale(1.15);
}

.status-icon.active {
  color: rgb(var(--v-theme-primary));
}

.clickable {
  cursor: pointer;
}

.hover-text:hover {
  color: rgb(var(--v-theme-primary));
}

.is-editable {
  cursor: pointer;
}

.inline-cell-editor {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: nowrap;
}

.inline-edit-input {
  width: 320px;
  max-width: min(320px, calc(100vw - 100px));
}

.admin-table :deep(td) {
  vertical-align: middle;
}

.admin-table :deep(th) {
  white-space: nowrap;
}

.dashboard-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  cursor: pointer;

  min-height: 40px;
  transition: background-color var(--duration-fast) var(--easing-standard),
    color var(--duration-fast) var(--easing-standard);
}

@media (max-width: 599px) {
  .dashboard-item {
    padding: var(--space-xs);
    min-height: 36px;
  }

  .dashboard-item-value {
    font-size: 11px;
  }

  .dashboard-item-meta span {
    font-size: 10px;
  }
}

.dashboard-item-value {
  font-size: var(--font-size-helper);
  font-weight: 600;
}

.dashboard-item:hover {
  background: rgba(var(--v-theme-on-surface), 0.05);
}

.dashboard-active {
  background: rgba(var(--v-theme-primary), 0.12);
  font-weight: 600;
}
</style>
