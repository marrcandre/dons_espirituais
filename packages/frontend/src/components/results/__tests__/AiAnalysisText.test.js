import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiAnalysisText from '../AiAnalysisText.vue'

function mountText(text) {
  return mount(AiAnalysisText, {
    props: { text },
  })
}

describe('AiAnalysisText', () => {
  it('renders plain text as paragraph', () => {
    const wrapper = mountText('Olá mundo')
    const p = wrapper.find('p')
    expect(p.exists()).toBe(true)
    expect(p.text()).toBe('Olá mundo')
  })

  it('renders heading as h3', () => {
    const wrapper = mountText('## Seu dom principal')
    const h3 = wrapper.find('h3')
    expect(h3.exists()).toBe(true)
    expect(h3.text()).toBe('Seu dom principal')
  })

  it('renders bold text as strong', () => {
    const wrapper = mountText('Dom de **liderança**')
    const strong = wrapper.find('strong')
    expect(strong.exists()).toBe(true)
    expect(strong.text()).toBe('liderança')
  })

  it('renders italic text as em', () => {
    const wrapper = mountText('Dom de *liderança*')
    const em = wrapper.find('em')
    expect(em.exists()).toBe(true)
    expect(em.text()).toBe('liderança')
  })

  it('renders list items as ul > li', () => {
    const wrapper = mountText('- item 1\n- item 2')
    const ul = wrapper.find('ul')
    expect(ul.exists()).toBe(true)
    const items = ul.findAll('li')
    expect(items).toHaveLength(2)
    expect(items[0].text()).toBe('item 1')
    expect(items[1].text()).toBe('item 2')
  })

  it('renders asterisk list items as ul > li', () => {
    const wrapper = mountText('* item A\n* item B')
    const ul = wrapper.find('ul')
    expect(ul.exists()).toBe(true)
    const items = ul.findAll('li')
    expect(items).toHaveLength(2)
  })

  it('renders multiple paragraphs separated by blank line', () => {
    const wrapper = mountText('Primeiro parágrafo.\n\nSegundo parágrafo.')
    const paragraphs = wrapper.findAll('p')
    expect(paragraphs).toHaveLength(2)
    expect(paragraphs[0].text()).toBe('Primeiro parágrafo.')
    expect(paragraphs[1].text()).toBe('Segundo parágrafo.')
  })

  it('renders mixed content correctly', () => {
    const text = '## Análise\n\nSeu dom principal é **liderança**.\n\nSeus pontos fortes:\n- Comunicação\n- Empatia\n\n*Persista* nos estudos.'
    const wrapper = mountText(text)

    expect(wrapper.find('h3').text()).toBe('Análise')
    // 3 paragraphs: intro, "Seus pontos fortes:", and italic line
    expect(wrapper.findAll('p')).toHaveLength(3)
    expect(wrapper.find('strong').text()).toBe('liderança')
    expect(wrapper.findAll('li')).toHaveLength(2)
    expect(wrapper.find('em').text()).toBe('Persista')
  })

  it('handles empty text gracefully', () => {
    const wrapper = mountText('')
    expect(wrapper.find('.ai-analysis-text').exists()).toBe(true)
    expect(wrapper.find('.ai-analysis-text').text()).toBe('')
  })

  it('handles whitespace-only text gracefully', () => {
    const wrapper = mountText('   \n\n  ')
    expect(wrapper.find('.ai-analysis-text').text()).toBe('')
  })

  it('escapes HTML in plain text', () => {
    const wrapper = mountText('<script>alert("xss")</script>')
    const p = wrapper.find('p')
    expect(p.exists()).toBe(true)
    expect(p.text()).toBe('<script>alert("xss")</script>')
    // Ensure the HTML is escaped, not rendered as elements
    expect(wrapper.find('script').exists()).toBe(false)
  })

  it('escapes HTML in headings', () => {
    const wrapper = mountText('## <b>heading</b>')
    const h3 = wrapper.find('h3')
    expect(h3.text()).toBe('<b>heading</b>')
    expect(wrapper.find('b').exists()).toBe(false)
  })

  it('normalizes \\r\\n to \\n', () => {
    const wrapper = mountText('Linha um.\r\n\r\nLinha dois.')
    const paras = wrapper.findAll('p')
    expect(paras).toHaveLength(2)
    expect(paras[0].text()).toBe('Linha um.')
    expect(paras[1].text()).toBe('Linha dois.')
  })

  it('renders inline formatting inside list items', () => {
    const wrapper = mountText('- **negrito** na lista\n- *itálico* na lista')
    const items = wrapper.findAll('li')
    expect(items[0].find('strong').exists()).toBe(true)
    expect(items[0].find('strong').text()).toBe('negrito')
    expect(items[1].find('em').exists()).toBe(true)
    expect(items[1].find('em').text()).toBe('itálico')
  })
})
