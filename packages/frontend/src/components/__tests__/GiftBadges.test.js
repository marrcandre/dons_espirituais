import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '../../../vitest.setup'
import { gifts } from '../../domain/spiritual-gifts'
import GiftBadges from '../GiftBadges.vue'

function mountBadges(scores) {
  return mount(GiftBadges, {
    global: { plugins: [vuetify] },
    props: { scores },
  })
}

describe('GiftBadges', () => {
  it('renders top 3 gifts based on scores', () => {
    const scores = { 0: 15, 1: 14, 2: 13, 3: 10, 4: 5 }
    const wrapper = mountBadges(scores)

    expect(wrapper.text()).toContain(gifts[0].name)
    expect(wrapper.text()).toContain(gifts[1].name)
    expect(wrapper.text()).toContain(gifts[2].name)
  })

  it('orders gifts by score descending', () => {
    const scores = { 0: 5, 1: 10, 2: 15, 3: 8 }
    const wrapper = mountBadges(scores)
    const text = wrapper.text()

    const idx2 = text.indexOf(gifts[2].name)
    const idx1 = text.indexOf(gifts[1].name)
    const idx3 = text.indexOf(gifts[3].name)

    expect(idx2).toBeLessThan(idx1)
    expect(idx1).toBeLessThan(idx3)
  })

  it('renders without crashing when all scores are zero', () => {
    const scores = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }
    const wrapper = mountBadges(scores)
    expect(wrapper.find('.app-card').exists()).toBe(true)
  })
})
