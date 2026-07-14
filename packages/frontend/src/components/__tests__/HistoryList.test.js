import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '../../../vitest.setup'

const { mockAuthStore, mockResponsesStore } = vi.hoisted(() => ({
  mockAuthStore: { user: { id: 'user-1' } },
  mockResponsesStore: {
    loading: false,
    list: [],
    fetchByUserId: vi.fn(),
  },
}))

vi.mock('../../stores/auth', () => ({
  useAuthStore: () => mockAuthStore,
}))

vi.mock('../../stores/responses', () => ({
  useResponsesStore: () => mockResponsesStore,
}))

import HistoryList from '../HistoryList.vue'

function mountHistory(currentId = 'r1') {
  return mount(HistoryList, {
    global: { plugins: [vuetify] },
    props: { currentId },
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('HistoryList', () => {
  it('renders loading state', () => {
    mockResponsesStore.loading = true

    const wrapper = mountHistory()

    expect(wrapper.find('.v-progress-circular').exists()).toBe(true)
  })

  it('renders list of history items', () => {
    mockResponsesStore.loading = false
    mockResponsesStore.list = [
      { id: 'r1', created_at: new Date().toISOString(), scores: { 0: 15, 1: 10 } },
      { id: 'r2', created_at: new Date().toISOString(), scores: { 0: 12, 1: 8 } },
    ]

    const wrapper = mountHistory('r1')

    expect(wrapper.text()).toContain('Profecia')
    expect(wrapper.text()).toContain('atual')
  })

  it('renders empty state when no history', () => {
    mockResponsesStore.loading = false
    mockResponsesStore.list = []

    const wrapper = mountHistory()

    expect(wrapper.text()).toContain('Nenhum teste anterior.')
  })

  it('calls fetchByUserId on mount', () => {
    mountHistory('r1')

    expect(mockResponsesStore.fetchByUserId).toHaveBeenCalledWith('user-1', {
      fields: 'id, created_at, scores',
      limit: 10,
    })
  })
})
