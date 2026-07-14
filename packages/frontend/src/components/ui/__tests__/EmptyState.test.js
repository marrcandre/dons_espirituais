import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '../../../../vitest.setup'
import EmptyState from '../EmptyState.vue'

function mountEmpty(options = {}) {
  return mount(EmptyState, {
    global: { plugins: [vuetify] },
    ...options,
  })
}

describe('EmptyState', () => {
  it('renders default title', () => {
    const wrapper = mountEmpty()
    expect(wrapper.text()).toContain('Nenhum item encontrado')
  })

  it('renders custom icon, title and description', () => {
    const wrapper = mountEmpty({
      props: {
        icon: 'mdi-custom',
        title: 'Título customizado',
        description: 'Descrição personalizada',
      },
    })
    expect(wrapper.text()).toContain('Título customizado')
    expect(wrapper.text()).toContain('Descrição personalizada')
  })

  it('renders action button and emits event on click', async () => {
    const wrapper = mountEmpty({
      props: { actionLabel: 'Recarregar' },
    })
    const btn = wrapper.findComponent({ name: 'AppButton' })
    expect(btn.exists()).toBe(true)
    expect(wrapper.text()).toContain('Recarregar')

    await btn.trigger('click')
    expect(wrapper.emitted('action')).toBeTruthy()
    expect(wrapper.emitted('action')).toHaveLength(1)
  })

  it('does not render action button when no actionLabel', () => {
    const wrapper = mountEmpty()
    const btn = wrapper.findComponent({ name: 'AppButton' })
    expect(btn.exists()).toBe(false)
  })

  it('renders action slot content instead of default button', () => {
    const wrapper = mountEmpty({
      props: { actionLabel: 'Default' },
      slots: {
        action: '<button class="custom-action">Custom</button>',
      },
    })
    expect(wrapper.find('.custom-action').exists()).toBe(true)
    expect(wrapper.text()).toContain('Custom')
  })
})
