import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '../../../../vitest.setup'
import AppButton from '../AppButton.vue'

function mountButton(options = {}) {
  return mount(AppButton, {
    global: { plugins: [vuetify] },
    ...options,
  })
}

describe('AppButton', () => {
  it('renders slot content', () => {
    const wrapper = mountButton({ slots: { default: 'Click me' } })
    expect(wrapper.text()).toContain('Click me')
  })

  it('applies loading state', () => {
    const wrapper = mountButton({
      props: { loading: true },
      slots: { default: 'Loading' },
    })
    expect(wrapper.props('loading')).toBe(true)
  })

  it('passes custom size and rounded', () => {
    const wrapper = mountButton({
      props: { size: 'small', rounded: 'xl' },
    })
    expect(wrapper.props('size')).toBe('small')
    expect(wrapper.props('rounded')).toBe('xl')
  })

  it('forwards $attrs to v-btn', () => {
    const wrapper = mountButton({
      attrs: { 'data-testid': 'custom-btn' },
    })
    expect(wrapper.attributes('data-testid')).toBe('custom-btn')
  })

  it('triggers click handler passed via $attrs', async () => {
    const onClick = vi.fn()
    const wrapper = mountButton({
      attrs: { onClick },
      slots: { default: 'Click' },
    })
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalled()
  })

  it('has default props', () => {
    const wrapper = mountButton({ slots: { default: 'OK' } })
    expect(wrapper.props('size')).toBe('large')
    expect(wrapper.props('rounded')).toBe('lg')
    expect(wrapper.props('loading')).toBe(false)
  })
})
