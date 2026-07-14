import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '../../../../vitest.setup'
import LoadingState from '../LoadingState.vue'

function mountLoading(options = {}) {
  return mount(LoadingState, {
    global: { plugins: [vuetify] },
    ...options,
  })
}

describe('LoadingState', () => {
  it('renders spinner without message', () => {
    const wrapper = mountLoading()
    expect(wrapper.find('.loading-state').exists()).toBe(true)
    expect(wrapper.find('.loading-state__spinner').exists()).toBe(true)
  })

  it('renders message when provided', () => {
    const wrapper = mountLoading({ props: { message: 'Carregando...' } })
    expect(wrapper.text()).toContain('Carregando...')
  })

  it('does not show message when not provided', () => {
    const wrapper = mountLoading()
    expect(wrapper.find('.helper-text').exists()).toBe(false)
  })

  it('accepts custom size and thickness', () => {
    const wrapper = mountLoading({
      props: { size: 48, thickness: 4 },
    })
    expect(wrapper.props('size')).toBe(48)
    expect(wrapper.props('thickness')).toBe(4)
  })

  it('has accessible aria-label on spinner', () => {
    const wrapper = mountLoading()
    const spinner = wrapper.find('.loading-state__spinner')
    expect(spinner.attributes('aria-label')).toBe('Carregando')
  })
})
