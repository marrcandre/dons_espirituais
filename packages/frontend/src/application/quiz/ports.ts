export interface SubmitQuizInput {
  answers: Record<number, number>
  userInfo: { name: string; gp: string; age: string }
  userId: string
  userEmail: string
  questionOrder: number[]
}

export interface SubmitQuizResult {
  id: string
}
