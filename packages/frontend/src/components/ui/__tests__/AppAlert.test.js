import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '../../../../vitest.setup'
import AppAlert from '../AppAlert.vue'

function mountAlert(options = {}) {
  return mount(AppAlert, {
    global: { plugins: [vuetify] },
    ...options,
  })
}

describe('AppAlert', () => {
  it('renders slot content', () => {
    const wrapper = mountAlert({
      props: { type: 'info' },
      slots: { default: 'Alert message' },
    })
    expect(wrapper.text()).toContain('Alert message')
  })

  it('renders each type', () => {
    const types = ['info', 'success', 'warning', 'error']
    for (const type of types) {
      const wrapper = mountAlert({ props: { type } })
      expect(wrapper.props('type')).toBe(type)
    }
  })

  it('renders with custom variant', () => {
    const wrapper = mountAlert({
      props: { type: 'info', variant: 'outlined' },
    })
    expect(wrapper.props('variant')).toBe('outlined')
  })

  it('renders with icon', () => {
    const wrapper = mountAlert({
      props: { type: 'info', icon: 'mdi-information' },
    })
    expect(wrapper.props('icon')).toBe('mdi-information')
  })

  it('has default props', () => {
    const wrapper = mountAlert({ props: { type: 'info' } })
    expect(wrapper.props('variant')).toBe('tonal')
    expect(wrapper.props('density')).toBe('default')
    expect(wrapper.props('rounded')).toBe('lg')
    expect(wrapper.props('icon')).toBeUndefined()
  })
})
