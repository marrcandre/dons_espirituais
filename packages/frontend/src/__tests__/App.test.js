import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '../../vitest.setup'

const { mockAuthStore } = vi.hoisted(() => ({
  mockAuthStore: {
    user: { id: 'user-1' },
    initialized: true,
    init: vi.fn(),
  },
}))

vi.mock('../stores/auth', () => ({
  useAuthStore: () => mockAuthStore,
}))

import App from '../App.vue'

function mountApp() {
  return mount(App, {
    global: {
      plugins: [vuetify],
      stubs: {
        'router-view': { template: '<div class="router-view-stub" />' },
        'router-link': { template: '<a><slot /></a>' },
      },
    },
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('App — Layout Global', () => {
  it('renders header when user is authenticated', () => {
    mockAuthStore.user = { id: 'user-1' }
    const wrapper = mountApp()
    const header = wrapper.find('.v-app-bar')
    expect(header.exists()).toBe(true)
  })

  it('does not render header when user is not authenticated', () => {
    mockAuthStore.user = null
    const wrapper = mountApp()
    const header = wrapper.find('.v-app-bar')
    expect(header.exists()).toBe(false)
  })

  it('renders footer regardless of authentication', () => {
    mockAuthStore.user = { id: 'user-1' }
    const wrapper = mountApp()
    expect(wrapper.find('.app-footer').exists()).toBe(true)
  })

  it('renders footer even without authenticated user', () => {
    mockAuthStore.user = null
    const wrapper = mountApp()
    expect(wrapper.find('.app-footer').exists()).toBe(true)
  })

  it('renders main content area', () => {
    const wrapper = mountApp()
    expect(wrapper.find('.v-main').exists()).toBe(true)
  })

  it('renders router-view inside main', () => {
    const wrapper = mountApp()
    const main = wrapper.find('.v-main')
    expect(main.find('.router-view-stub').exists()).toBe(true)
  })

  it('has correct layout structure: v-app > header + main + footer', () => {
    mockAuthStore.user = { id: 'user-1' }
    const wrapper = mountApp()
    expect(wrapper.findComponent({ name: 'VApp' }).exists()).toBe(true)
    expect(wrapper.find('.v-app-bar').exists()).toBe(true)
    expect(wrapper.find('.v-main').exists()).toBe(true)
    expect(wrapper.find('.app-footer').exists()).toBe(true)
  })

  it('has correct layout structure without auth: v-app > main + footer', () => {
    mockAuthStore.user = null
    const wrapper = mountApp()
    expect(wrapper.find('.v-main').exists()).toBe(true)
    expect(wrapper.find('.app-footer').exists()).toBe(true)
  })
})
