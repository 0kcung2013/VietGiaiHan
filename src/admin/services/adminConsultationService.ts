import { adminRequest } from './adminApi'

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
  isViewed: boolean
  viewedAt: string | null
  createdAt: string
  updatedAt: string | null
}

export async function getConsultationRequests(): Promise<ConsultationRequest[]> {
  return adminRequest<ConsultationRequest[]>('/consultation-requests')
}

export async function updateConsultationRequestStatus(
  id: number,
  status: string,
  adminNote?: string,
): Promise<void> {
  return adminRequest<void>(`/consultation-requests/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, adminNote: adminNote ?? null }),
  })
}

export async function markConsultationRequestViewed(id: number): Promise<void> {
  return adminRequest<void>(`/consultation-requests/${id}/viewed`, {
    method: 'PUT',
  })
}

export async function markConsultationRequestsViewed(ids: number[]): Promise<void> {
  return adminRequest<void>('/consultation-requests/mark-viewed', {
    method: 'PUT',
    body: JSON.stringify({ ids }),
  })
}
