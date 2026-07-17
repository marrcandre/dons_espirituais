import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '../../../vitest.setup'

const { mockAuthStore } = vi.hoisted(() => ({
  mockAuthStore: {
    canAccessAdminPanel: false,
    user: {
      id: 'user-1',
      email: 'user@test.com',
      user_metadata: {
        full_name: 'Test User',
        avatar_url: null,
      },
    },
    profile: null,
    signOut: vi.fn(),
  },
}))

vi.mock('../../stores/auth', () => ({
  useAuthStore: () => mockAuthStore,
}))

import AppHeader from '../AppHeader.vue'

function mountHeader() {
  return mount({
    template: '<v-app><AppHeader /></v-app>',
    components: { AppHeader },
  }, {
    global: {
      plugins: [vuetify],
      stubs: { 'router-link': { template: '<a><slot /></a>' } },
    },
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AppHeader', () => {
  it('renders when user is authenticated', () => {
    const wrapper = mountHeader()
    expect(wrapper.find('.v-app-bar').exists()).toBe(true)
  })

  it('renders navigation links', () => {
    const wrapper = mountHeader()
    const sobreBtn = wrapper.find('[title="Sobre o projeto"]')
    expect(sobreBtn.exists()).toBe(true)
  })

  it('renders admin button when user has admin access', () => {
    mockAuthStore.canAccessAdminPanel = true
    const wrapper = mountHeader()
    const adminBtn = wrapper.find('[title="Painel Admin"]')
    expect(adminBtn.exists()).toBe(true)
    mockAuthStore.canAccessAdminPanel = false
  })

  it('does not render admin button without admin access', () => {
    const wrapper = mountHeader()
    const adminBtn = wrapper.find('[title="Painel Admin"]')
    expect(adminBtn.exists()).toBe(false)
  })

  it('renders history button', () => {
    const wrapper = mountHeader()
    const historyBtn = wrapper.find('[title="Meus resultados"]')
    expect(historyBtn.exists()).toBe(true)
  })

  it('renders theme toggle button', () => {
    const wrapper = mountHeader()
    const themeBtn = wrapper.find('[title*="Modo"]')
    expect(themeBtn.exists()).toBe(true)
  })

  it('renders user menu with avatar', () => {
    const wrapper = mountHeader()
    const avatar = wrapper.find('.v-avatar')
    expect(avatar.exists()).toBe(true)
  })

  it('renders user initials in avatar', () => {
    const wrapper = mountHeader()
    expect(wrapper.text()).toContain('TU')
  })

  it('renders Sobre button link', () => {
    const wrapper = mountHeader()
    const sobreBtn = wrapper.find('[title="Sobre o projeto"]')
    expect(sobreBtn.exists()).toBe(true)
  })

  it('renders the AppLogo', () => {
    const wrapper = mountHeader()
    expect(wrapper.find('.app-logo').exists()).toBe(true)
  })
})
