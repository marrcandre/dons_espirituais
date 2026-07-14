import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '../../../../vitest.setup'
import AppCard from '../AppCard.vue'

function mountCard(options = {}) {
  return mount(AppCard, {
    global: { plugins: [vuetify] },
    ...options,
  })
}

describe('AppCard', () => {
  it('renders default variant with slot content', () => {
    const wrapper = mountCard({ slots: { default: 'Card content' } })
    expect(wrapper.text()).toContain('Card content')
    expect(wrapper.classes()).toContain('app-card')
  })

  it('renders outlined variant', () => {
    const wrapper = mountCard({ props: { variant: 'outlined' } })
    expect(wrapper.props('variant')).toBe('outlined')
  })

  it('renders flat variant', () => {
    const wrapper = mountCard({ props: { variant: 'flat' } })
    expect(wrapper.props('variant')).toBe('flat')
  })

  it('renders compact variant', () => {
    const wrapper = mountCard({
      props: { variant: 'compact' },
      slots: { default: 'Compact' },
    })
    expect(wrapper.text()).toContain('Compact')
  })

  it('renders interactive variant', () => {
    const wrapper = mountCard({ props: { variant: 'interactive' } })
    expect(wrapper.classes()).toContain('app-card--interactive')
  })

  it('renders flush variant', () => {
    const wrapper = mountCard({
      props: { variant: 'flush' },
      slots: { default: 'Flush' },
    })
    expect(wrapper.text()).toContain('Flush')
  })
})
