import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '../../../../vitest.setup'
import {
  APP_DESCRIPTION,
  APP_VERSION,
  APP_COPYRIGHT_OWNER,
  APP_CONTACT_EMAIL,
  APP_REPOSITORY_URL,
} from '../../../config/app'
import AppFooter from '../AppFooter.vue'

function mountFooter() {
  return mount(AppFooter, {
    global: {
      plugins: [vuetify],
      stubs: {
        'router-link': { template: '<a><slot /></a>' },
      },
    },
  })
}

describe('AppFooter', () => {
  it('renders without crashing', () => {
    const wrapper = mountFooter()
    expect(wrapper.find('.app-footer').exists()).toBe(true)
  })

  it('renders the AppLogo', () => {
    const wrapper = mountFooter()
    expect(wrapper.find('.app-logo').exists()).toBe(true)
  })

  it('renders the description text', () => {
    const wrapper = mountFooter()
    expect(wrapper.text()).toContain(APP_DESCRIPTION)
  })

  it('renders Início navigation link', () => {
    const wrapper = mountFooter()
    expect(wrapper.text()).toContain('Início')
  })

  it('renders Sobre navigation link', () => {
    const wrapper = mountFooter()
    expect(wrapper.text()).toContain('Sobre')
  })

  it('renders GitHub link with correct URL', () => {
    const wrapper = mountFooter()
    const githubLink = wrapper.find('a[href="' + APP_REPOSITORY_URL + '"]')
    expect(githubLink.exists()).toBe(true)
    expect(githubLink.text()).toContain('GitHub')
  })

  it('renders GitHub link with external attributes', () => {
    const wrapper = mountFooter()
    const githubLink = wrapper.find('a[href="' + APP_REPOSITORY_URL + '"]')
    expect(githubLink.attributes('target')).toBe('_blank')
    expect(githubLink.attributes('rel')).toBe('noopener noreferrer')
  })

  it('renders Contato link with mailto', () => {
    const wrapper = mountFooter()
    const contactLink = wrapper.find('a[href="mailto:' + APP_CONTACT_EMAIL + '"]')
    expect(contactLink.exists()).toBe(true)
    expect(contactLink.text()).toContain('Contato')
  })

  it('renders the support section', () => {
    const wrapper = mountFooter()
    expect(wrapper.text()).toContain('Apoie este projeto')
  })

  it('displays the application version', () => {
    const wrapper = mountFooter()
    expect(wrapper.text()).toContain('v' + APP_VERSION)
  })

  it('displays the copyright owner', () => {
    const wrapper = mountFooter()
    expect(wrapper.text()).toContain(APP_COPYRIGHT_OWNER)
  })

  it('has a copyright section with border-top', () => {
    const wrapper = mountFooter()
    const copy = wrapper.find('.app-footer__copy')
    expect(copy.exists()).toBe(true)
  })

  it('does not depend on authentication', () => {
    const wrapper = mountFooter()
    expect(wrapper.find('.app-footer').exists()).toBe(true)
    expect(wrapper.text()).toContain('Início')
    expect(wrapper.text()).toContain('Sobre')
  })
})
