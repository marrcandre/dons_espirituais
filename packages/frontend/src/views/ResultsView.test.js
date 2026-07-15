import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '../../vitest.setup'

vi.stubGlobal('visualViewport', {
  offsetLeft: 0,
  offsetTop: 0,
  width: 1024,
  height: 768,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
})

const mockRoutePush = vi.fn()
const mockRouteReplace = vi.fn()

const mockAuthStore = vi.hoisted(() => ({
  user: { id: 'u1' },
  isAdmin: false,
}))

const mockResponsesStore = vi.hoisted(() => ({
  current: null,
  loading: false,
  error: null,
  fetchById: vi.fn(),
  deleteItem: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ params: { id: 'r1' } })),
  useRouter: vi.fn(() => ({ push: mockRoutePush, replace: mockRouteReplace })),
}))

vi.mock('../stores/auth', () => ({
  useAuthStore: vi.fn(() => mockAuthStore),
}))

vi.mock('../stores/responses', () => ({
  useResponsesStore: vi.fn(() => mockResponsesStore),
}))

import ResultsView from './ResultsView.vue'

function mountResultsView() {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const wrapper = mount(ResultsView, {
    attachTo: div,
    global: {
      plugins: [vuetify],
      stubs: {
        'router-link': true,
        AppPage: { template: '<div><slot /></div>' },
        LoadingState: { template: '<div>Loading...</div>' },
        GiftBadges: { template: '<div />' },
        ResultsChart: { template: '<div />' },
        AiAnalysis: { template: '<div />' },
        GrowthSection: { template: '<div />' },
        ResourcesSection: { template: '<div />' },
        CollapsibleCard: { template: '<div><slot /></div>' },
        PageHeader: { template: '<div><slot /></div>' },
      },
    },
  })
  return { wrapper, div }
}

describe('ResultsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockResponsesStore.current = null
    mockResponsesStore.loading = false
    mockResponsesStore.error = null
    mockAuthStore.user = { id: 'u1' }
    mockAuthStore.isAdmin = false
    mockResponsesStore.deleteItem.mockResolvedValue(true)
  })

  function setResponse() {
    mockResponsesStore.current = { id: 'r1', name: 'Test', scores: {}, created_at: '2026-01-01' }
  }

  function getDeleteBtn() {
    return document.querySelector('[data-testid="delete-button"]')
  }

  function getConfirmBtn() {
    return document.querySelector('[data-testid="confirm-delete"]')
  }

  it('calls fetchById on mount', async () => {
    setResponse()
    const { wrapper, div } = mountResultsView()
    await wrapper.vm.$nextTick()
    expect(mockResponsesStore.fetchById).toHaveBeenCalledWith('r1')
    div.remove()
  })

  it('hides delete button for non-admin user', async () => {
    setResponse()
    mockAuthStore.isAdmin = false
    const { wrapper, div } = mountResultsView()
    await wrapper.vm.$nextTick()
    expect(getDeleteBtn()).toBeNull()
    div.remove()
  })

  it('shows delete button for admin user', async () => {
    setResponse()
    mockAuthStore.isAdmin = true
    const { wrapper, div } = mountResultsView()
    await wrapper.vm.$nextTick()
    expect(getDeleteBtn()).not.toBeNull()
    div.remove()
  })

  it('opens confirmation dialog when delete button is clicked', async () => {
    setResponse()
    mockAuthStore.isAdmin = true
    const { wrapper, div } = mountResultsView()
    await wrapper.vm.$nextTick()

    getDeleteBtn().click()
    await wrapper.vm.$nextTick()

    expect(document.body.textContent).toContain('Excluir este resultado?')
    div.remove()
  })

  it('calls deleteItem and navigates to my-results after confirmation', async () => {
    setResponse()
    mockAuthStore.isAdmin = true
    mockAuthStore.user = { id: 'u1' }
    mockResponsesStore.deleteItem.mockResolvedValue(true)
    const { wrapper, div } = mountResultsView()
    await wrapper.vm.$nextTick()

    getDeleteBtn().click()
    await wrapper.vm.$nextTick()

    getConfirmBtn().click()
    await wrapper.vm.$nextTick()

    expect(mockResponsesStore.deleteItem).toHaveBeenCalledWith('r1')
    await new Promise((r) => setTimeout(r, 1600))
    expect(mockRouteReplace).toHaveBeenCalledWith({ name: 'my-results' })
    div.remove()
  })

  it('navigates to home when user is not authenticated after deletion', async () => {
    setResponse()
    mockAuthStore.isAdmin = true
    mockAuthStore.user = null
    mockResponsesStore.deleteItem.mockResolvedValue(true)
    const { wrapper, div } = mountResultsView()
    await wrapper.vm.$nextTick()

    getDeleteBtn().click()
    await wrapper.vm.$nextTick()

    getConfirmBtn().click()
    await wrapper.vm.$nextTick()

    await new Promise((r) => setTimeout(r, 1600))
    expect(mockRouteReplace).toHaveBeenCalledWith({ name: 'home' })
    div.remove()
  })

  it('shows error snackbar when deletion fails', async () => {
    setResponse()
    mockAuthStore.isAdmin = true
    mockResponsesStore.deleteItem.mockRejectedValue(new Error('fail'))
    const { wrapper, div } = mountResultsView()
    await wrapper.vm.$nextTick()

    getDeleteBtn().click()
    await wrapper.vm.$nextTick()

    getConfirmBtn().click()
    await wrapper.vm.$nextTick()

    expect(mockResponsesStore.deleteItem).toHaveBeenCalledWith('r1')
    expect(mockRouteReplace).not.toHaveBeenCalled()
    div.remove()
  })
})
