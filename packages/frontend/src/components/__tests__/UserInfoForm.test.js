import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '../../../vitest.setup'

const { mockGetUserProfile } = vi.hoisted(() => ({
  mockGetUserProfile: vi.fn(),
}))

vi.mock('../../application/auth/user-profile', () => ({
  getUserProfile: mockGetUserProfile,
}))

import UserInfoForm from '../UserInfoForm.vue'

function mountForm() {
  return mount(UserInfoForm, {
    global: { plugins: [vuetify] },
  })
}

function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('UserInfoForm', () => {
  it('renders form fields', () => {
    const wrapper = mountForm()
    expect(wrapper.text()).toContain('Nome completo')
    expect(wrapper.text()).toContain('Idade')
    expect(wrapper.text()).toContain('Começar o teste')
  })

  it('loads user profile on mount and pre-fills name', async () => {
    mockGetUserProfile.mockResolvedValue({ name: 'João', email: 'joao@test.com' })

    const wrapper = mountForm()
    await flushPromises()

    const nameInput = wrapper.find('input[type="text"]')
    expect(nameInput.element.value).toBe('João')
  })

  it('does not pre-fill name when profile has no name', async () => {
    mockGetUserProfile.mockResolvedValue({ name: '', email: '' })

    const wrapper = mountForm()
    await flushPromises()

    const nameInput = wrapper.find('input[type="text"]')
    expect(nameInput.element.value).toBe('')
  })

  it('handles getUserProfile error gracefully', async () => {
    mockGetUserProfile.mockRejectedValue(new Error('Network error'))

    const wrapper = mountForm()
    await flushPromises()

    const nameInput = wrapper.find('input[type="text"]')
    expect(nameInput.element.value).toBe('')
  })

  it('emits submit with form data on valid submission', async () => {
    mockGetUserProfile.mockResolvedValue({ name: '', email: '' })

    const wrapper = mountForm()
    await flushPromises()

    wrapper.vm.form.name = 'Maria'
    wrapper.vm.form.gp = 'Coordenador'
    wrapper.vm.form.age = '30'
    await wrapper.vm.$nextTick()

    const form = wrapper.find('form')
    await form.trigger('submit')
    await flushPromises()

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')[0]).toEqual([{ name: 'Maria', gp: 'Coordenador', age: '30' }])
  })
})
