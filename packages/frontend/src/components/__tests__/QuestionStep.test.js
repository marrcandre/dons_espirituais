import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '../../../vitest.setup'
import QuestionStep from '../QuestionStep.vue'
import { ANSWER_LABELS } from '../../constants/likert'

const sampleQuestion = { id: 1, text: 'Sinto que tenho facilidade para ensinar.' }

function mountQuestion({ props, ...rest } = {}) {
  return mount(QuestionStep, {
    global: { plugins: [vuetify] },
    props: {
      question: sampleQuestion,
      modelValue: undefined,
      isFirst: false,
      isLast: false,
      ...props,
    },
    ...rest,
  })
}

describe('QuestionStep', () => {
  it('renders the question text', () => {
    const wrapper = mountQuestion()
    expect(wrapper.text()).toContain(sampleQuestion.text)
  })

  it('renders answer options based on ANSWER_LABELS', () => {
    const wrapper = mountQuestion()
    for (const opt of ANSWER_LABELS) {
      expect(wrapper.text()).toContain(opt.label)
    }
  })

  it('emits update:modelValue when an option is clicked', async () => {
    const wrapper = mountQuestion()
    const options = wrapper.findAll('.v-btn')
    const firstOption = options.find((b) => b.text().includes(ANSWER_LABELS[0].label))
    expect(firstOption).toBeDefined()

    await firstOption.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([0])
  })

  it('emits prev when "Anterior" is clicked', async () => {
    const wrapper = mountQuestion()
    const prevBtn = wrapper.findAll('.v-btn').find((b) => b.text().includes('Anterior'))
    expect(prevBtn).toBeDefined()

    await prevBtn.trigger('click')
    expect(wrapper.emitted('prev')).toBeTruthy()
  })

  it('emits next when "Próxima" is clicked', async () => {
    const wrapper = mountQuestion({
      props: { modelValue: 1 },
    })
    const nextBtn = wrapper.findAll('.v-btn').find((b) => b.text().includes('Próxima'))
    expect(nextBtn).toBeDefined()

    await nextBtn.trigger('click')
    expect(wrapper.emitted('next')).toBeTruthy()
  })

  it('shows "Finalizar" when isLast is true', () => {
    const wrapper = mountQuestion({
      props: { isLast: true, modelValue: 1 },
    })
    expect(wrapper.text()).toContain('Finalizar')
    expect(wrapper.text()).not.toContain('Próxima')
  })

  it('disables "Anterior" when isFirst is true', () => {
    const wrapper = mountQuestion({
      props: { isFirst: true },
    })
    const prevBtn = wrapper.findAll('.v-btn').find((b) => b.text().includes('Anterior'))
    expect(prevBtn).toBeDefined()
    expect(prevBtn.attributes('disabled')).toBeDefined()
  })

  it('disables "Próxima" when no answer selected', () => {
    const wrapper = mountQuestion({
      props: { modelValue: undefined },
    })
    const nextBtn = wrapper.findAll('.v-btn').find((b) => b.text().includes('Próxima'))
    expect(nextBtn).toBeDefined()
    expect(nextBtn.attributes('disabled')).toBeDefined()
  })
})
