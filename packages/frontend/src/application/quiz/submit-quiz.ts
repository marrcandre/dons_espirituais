/**
 * Use Case
 *
 * Submit Spiritual Gifts Test
 *
 * Responsibilities
 * 1. Calculate scores
 * 2. Build payload
 * 3. Persist response
 * 4. Clear saved session
 * 5. Notify administrators
 * 6. Trigger AI analysis
 * 7. Return response id
 */

import { calculateScores } from '../../domain/scoring'
import { insert } from '../../repositories/responseRepository'
import { invokeNotifyAdmin, invokeGenerateAI } from '../../repositories/aiRepository'
import { clearSession } from './quiz-session'
import type { SubmitQuizInput, SubmitQuizResult } from './ports'

export async function submitQuiz(input: SubmitQuizInput): Promise<SubmitQuizResult> {
  const scores = calculateScores(input.answers as unknown as number[])

  const payload = {
    user_id: input.userId,
    name: input.userInfo.name.trim(),
    email: input.userEmail,
    gp: input.userInfo.gp.trim(),
    age: parseInt(input.userInfo.age) || null,
    question_order: input.questionOrder,
    answers: Object.values(input.answers),
    scores,
  }

  const data = await insert(payload)

  clearSession(input.userId)

  invokeNotifyAdmin(data.id).catch(() => {})
  invokeGenerateAI(data.id).catch(() => {})

  return { id: data.id }
}
