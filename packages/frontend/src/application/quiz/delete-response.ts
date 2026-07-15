import { deleteResponse } from '../../repositories/responseRepository'

export interface DeleteResponseInput {
  responseId: string
}

export interface DeleteResponseResult {
  success: boolean
}

export async function deleteResponseUseCase(input: DeleteResponseInput): Promise<DeleteResponseResult> {
  await deleteResponse(input.responseId)
  return { success: true }
}
