export interface CreateConsultationRequestPayload {
  fullName: string
  phone: string
  message: string
  productId: number
  productName: string
  productSlug: string
}

interface ConsultationRequestResponse {
  success: boolean
  message: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'

export async function createConsultationRequest(
  payload: CreateConsultationRequestPayload,
): Promise<ConsultationRequestResponse> {
  const response = await fetch(`${API_BASE_URL}/consultation-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }

  return response.json() as Promise<ConsultationRequestResponse>
}
