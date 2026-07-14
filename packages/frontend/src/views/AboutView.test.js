import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '../../vitest.setup'
import AboutView from './AboutView.vue'

function mountAboutView() {
  return mount(AboutView, {
    global: {
      plugins: [vuetify],
      stubs: { 'router-link': true },
    },
  })
}

describe('AboutView', () => {
  it('renders the page title', () => {
    const wrapper = mountAboutView()
    expect(wrapper.text()).toContain('Sobre o Projeto')
  })

  it('renders the objective section', () => {
    const wrapper = mountAboutView()
    expect(wrapper.text()).toContain('Objetivo')
    expect(wrapper.text()).toContain('Dons Espirituais')
    expect(wrapper.text()).toContain('autoconhecimento ministerial')
  })

  it('renders the test explanation section', () => {
    const wrapper = mountAboutView()
    expect(wrapper.text()).toContain('Como funciona o teste')
    expect(wrapper.text()).toContain('135 afirmações')
  })

  it('renders the methodology section', () => {
    const wrapper = mountAboutView()
    expect(wrapper.text()).toContain('Metodologia')
    expect(wrapper.text()).toContain('C. Peter Wagner')
    expect(wrapper.text()).toContain('27 dons espirituais')
  })

  it('renders the technologies section', () => {
    const wrapper = mountAboutView()
    expect(wrapper.text()).toContain('Tecnologias utilizadas')
    expect(wrapper.text()).toContain('Vue 3')
    expect(wrapper.text()).toContain('Supabase')
  })

  it('renders the authorship section', () => {
    const wrapper = mountAboutView()
    expect(wrapper.text()).toContain('Autoria')
    expect(wrapper.text()).toContain('Marco André')
  })

  it('renders the license section', () => {
    const wrapper = mountAboutView()
    expect(wrapper.text()).toContain('Licença')
    expect(wrapper.text()).toContain('MIT')
  })

  it('renders the contribution section with GitHub link', () => {
    const wrapper = mountAboutView()
    expect(wrapper.text()).toContain('Contribuição')
    expect(wrapper.text()).toContain('GitHub')
    expect(wrapper.text()).toContain('código aberto')
  })

  it('renders related projects section', () => {
    const wrapper = mountAboutView()
    expect(wrapper.text()).toContain('Projetos relacionados')
    expect(wrapper.text()).toContain('Cinco Ministérios')
  })
})
