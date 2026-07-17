<template>
  <div
    class="ai-analysis-text"
    v-html="parsedHtml"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
})

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const parsedHtml = computed(() => {
  if (!props.text) return ''

  const raw = props.text.trim().replace(/\r\n/g, '\n')

  const lines = raw.split('\n')
  const blocks = []
  let currentList = null

  function flushList() {
    if (currentList !== null && currentList.length > 0) {
      const items = currentList
        .map((item) => `<li>${item}</li>`)
        .join('')
      blocks.push(`<ul>${items}</ul>`)
      currentList = null
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed === '') {
      flushList()
      continue
    }

    const headingMatch = trimmed.match(/^##\s+(.+)$/)
    if (headingMatch) {
      flushList()
      const content = escapeHtml(headingMatch[1])
      blocks.push(`<h3>${content}</h3>`)
      continue
    }

    const listMatch = trimmed.match(/^[-*]\s+(.+)$/)
    if (listMatch) {
      const content = parseInline(escapeHtml(listMatch[1]))
      if (currentList === null) currentList = []
      currentList.push(content)
      continue
    }

    flushList()

    let paragraph = escapeHtml(trimmed)
    paragraph = parseInline(paragraph)
    blocks.push(`<p>${paragraph}</p>`)
  }

  flushList()

  return blocks.join('\n')
})

function parseInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}
</script>

<style scoped>
.ai-analysis-text {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 0.9375rem;
  line-height: var(--line-height-relaxed, 1.9);
  color: var(--color-text-primary, #1a1a1a);
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.ai-analysis-text :deep(p) {
  margin: 0 0 1.25em;
}

.ai-analysis-text :deep(p:last-child) {
  margin-bottom: 0;
}

.ai-analysis-text :deep(h3) {
  font-family: var(--font-family-heading, 'Inter', sans-serif);
  font-size: 1.0625rem;
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-primary, #1a4d2e);
  margin: 1.5em 0 0.5em;
  line-height: 1.4;
}

.ai-analysis-text :deep(h3:first-child) {
  margin-top: 0;
}

.ai-analysis-text :deep(ul) {
  margin: 0 0 1.25em;
  padding-left: 1.5em;
  list-style: disc;
}

.ai-analysis-text :deep(ul:last-child) {
  margin-bottom: 0;
}

.ai-analysis-text :deep(li) {
  margin-bottom: 0.35em;
  line-height: var(--line-height-body, 1.6);
}

.ai-analysis-text :deep(li:last-child) {
  margin-bottom: 0;
}

.ai-analysis-text :deep(strong) {
  font-weight: var(--font-weight-bold, 700);
  color: var(--color-text-primary, #1a1a1a);
}

.ai-analysis-text :deep(em) {
  font-style: italic;
}

@media (max-width: 430px) {
  .ai-analysis-text {
    font-size: 0.875rem;
  }
  .ai-analysis-text :deep(h3) {
    font-size: 1rem;
  }
  .ai-analysis-text :deep(ul) {
    padding-left: 1.25em;
  }
}
</style>
