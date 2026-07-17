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

// ---------------------------------------------------------------------------
// Icon-only mode
// ---------------------------------------------------------------------------
describe('AppButton — icon-only', () => {
  it('renders icon element when no slot content', () => {
    const wrapper = mountButton({ attrs: { icon: 'mdi-home' } })
    expect(wrapper.find('.v-icon').exists()).toBe(true)
    expect(wrapper.find('.mdi-home').exists()).toBe(true)
  })

  it('has v-btn--icon class for icon-only mode', () => {
    const wrapper = mountButton({ attrs: { icon: 'mdi-home' } })
    expect(wrapper.classes('v-btn--icon')).toBe(true)
  })

  it('shows no text for icon-only button', () => {
    const wrapper = mountButton({ attrs: { icon: 'mdi-home' } })
    expect(wrapper.text()).toBe('')
  })

  it('renders with boolean icon prop', () => {
    const wrapper = mountButton({
      attrs: { icon: '' },
      slots: { default: 'A' },
    })
    // boolean icon + slot content → slot renders
    expect(wrapper.text()).toBe('A')
  })

  it('renders with string icon using prepend-icon', () => {
    const wrapper = mountButton({
      attrs: { prependIcon: 'mdi-check' },
      slots: { default: 'Save' },
    })
    expect(wrapper.text()).toContain('Save')
    expect(wrapper.find('.mdi-check').exists()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Text content mode
// ---------------------------------------------------------------------------
describe('AppButton — text content', () => {
  it('renders slot content', () => {
    const wrapper = mountButton({ slots: { default: 'Click me' } })
    expect(wrapper.text()).toContain('Click me')
  })

  it('does not have v-btn--icon class when only text', () => {
    const wrapper = mountButton({ slots: { default: 'Salvar' } })
    expect(wrapper.classes('v-btn--icon')).toBe(false)
  })

  it('renders block content via slot', () => {
    const wrapper = mountButton({
      slots: { default: '<span class="custom-text">Custom</span>' },
    })
    expect(wrapper.find('.custom-text').exists()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Text + icon prop — icon prop is reserved for icon-only mode in Vuetify
// ---------------------------------------------------------------------------
describe('AppButton — text + icon prop (reserved for icon-only)', () => {
  it('ignores icon prop when slot content exists', () => {
    const wrapper = mountButton({
      attrs: { icon: 'mdi-content-save' },
      slots: { default: 'Salvar' },
    })
    // Vuetify's v-btn checks: !slots.default && hasIcon
    // When slot exists, icon is NOT rendered — slot content wins
    expect(wrapper.text()).toContain('Salvar')
    expect(wrapper.find('.mdi-content-save').exists()).toBe(false)
  })

  it('keeps v-btn--icon class when icon prop + slot given (class tied to prop, not rendering)', () => {
    const wrapper = mountButton({
      attrs: { icon: 'mdi-content-save' },
      slots: { default: 'Salvar' },
    })
    // v-btn--icon class is controlled by !!props.icon, not by whether icon actually renders
    expect(wrapper.classes('v-btn--icon')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Props and $attrs forwarding
// ---------------------------------------------------------------------------
describe('AppButton — props and $attrs forwarding', () => {
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

  it('forwards arbitrary $attrs to v-btn', () => {
    const wrapper = mountButton({
      attrs: { 'data-testid': 'custom-btn' },
    })
    expect(wrapper.attributes('data-testid')).toBe('custom-btn')
  })

  it('forwards variant through $attrs', () => {
    const wrapper = mountButton({
      attrs: { variant: 'outlined' },
      slots: { default: 'Text' },
    })
    expect(wrapper.classes('v-btn--variant-outlined')).toBe(true)
  })

  it('forwards color through $attrs', () => {
    const wrapper = mountButton({
      attrs: { color: 'success' },
      slots: { default: 'Text' },
    })
    // default variant is elevated → Vuetify uses bg-{color}
    expect(wrapper.classes('bg-success')).toBe(true)
  })

  it('forwards disabled through $attrs', () => {
    const wrapper = mountButton({
      attrs: { disabled: true },
      slots: { default: 'Text' },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('forwards custom class through $attrs', () => {
    const wrapper = mountButton({
      attrs: { class: 'my-custom-class' },
      slots: { default: 'Text' },
    })
    expect(wrapper.classes('my-custom-class')).toBe(true)
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

  it('forwards variant through $attrs in icon-only mode', () => {
    const wrapper = mountButton({
      attrs: { icon: 'mdi-home', variant: 'text' },
    })
    expect(wrapper.classes('v-btn--variant-text')).toBe(true)
  })

  it('forwards color through $attrs in icon-only mode', () => {
    const wrapper = mountButton({
      attrs: { icon: 'mdi-delete', color: 'error' },
    })
    // default variant is elevated → bg-{color}
    expect(wrapper.classes('bg-error')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------
describe('AppButton — defaults', () => {
  it('has default props', () => {
    const wrapper = mountButton({ slots: { default: 'OK' } })
    expect(wrapper.props('size')).toBe('large')
    expect(wrapper.props('rounded')).toBe('lg')
    expect(wrapper.props('loading')).toBe(false)
  })

  it('uses rounded class from default', () => {
    const wrapper = mountButton({ slots: { default: 'OK' } })
    expect(wrapper.classes('rounded-lg')).toBe(true)
  })
})
