export interface ConsultationRequest {
  id: number
  fullName: string
  phone: string
  message: string | null
  productId: number | null
  productName: string
  productSlug: string
  status: string
  adminNote: string | null
  createdAt: string
  updatedAt: string | null
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'

export async function getConsultationRequests(): Promise<ConsultationRequest[]> {
  const response = await fetch(`${API_BASE_URL}/consultation-requests`)

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }

  return response.json() as Promise<ConsultationRequest[]>
}

export async function updateConsultationRequestStatus(
  id: number,
  status: string,
  adminNote?: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/consultation-requests/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, adminNote: adminNote ?? null }),
  })

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }
}
