import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '../../../../vitest.setup'
import AppLogo from '../AppLogo.vue'

function mountLogo(options = {}) {
  return mount(AppLogo, {
    global: {
      plugins: [vuetify],
      stubs: { 'router-link': { template: '<a><slot /></a>' } },
    },
    ...options,
  })
}

describe('AppLogo', () => {
  it('renders full variant with icon and text', () => {
    const wrapper = mountLogo({
      props: { variant: 'full' },
    })
    expect(wrapper.find('.app-logo--full').exists()).toBe(true)
    expect(wrapper.text()).toContain('Dons Espirituais')
  })

  it('renders compact variant with icon only', () => {
    const wrapper = mountLogo({
      props: { variant: 'compact' },
    })
    expect(wrapper.find('.app-logo--compact').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Dons Espirituais')
  })

  it('accepts custom size prop', () => {
    const wrapper = mountLogo({
      props: { size: 40 },
    })
    expect(wrapper.find('.app-logo').attributes('style')).toContain('gap: 10px')
  })

  it('accepts custom color prop', () => {
    const wrapper = mountLogo({
      props: { color: '#ff0000' },
    })
    expect(wrapper.find('.app-logo').attributes('style')).toContain('color: #ff0000')
  })

  it('has default props', () => {
    const wrapper = mountLogo()
    expect(wrapper.find('.app-logo--full').exists()).toBe(true)
    const icon = wrapper.find('.v-icon')
    expect(icon.exists()).toBe(true)
  })
})
