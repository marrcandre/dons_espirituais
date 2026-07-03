import * as aiRepository from '../repositories/aiRepository.js'
import * as responseRepository from '../repositories/responseRepository.js'

export async function regenerateAiAnalysis(responseId, name) {
  if (!responseId) {
    throw new Error('responseId obrigatório')
  }

  if (!name?.trim()) {
    throw new Error('name obrigatório')
  }

  await aiRepository.invokeGenerateAI(responseId, name, true)

  return responseRepository.selectField(responseId, 'ai_analysis')
}
