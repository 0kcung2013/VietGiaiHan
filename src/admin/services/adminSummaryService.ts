import { adminRequest } from './adminApi'

export interface AdminSummary {
  totalProducts: number
  totalCategories: number
  totalConsultationRequests: number
  newConsultationRequests: number
  contactedConsultationRequests: number
  completedConsultationRequests: number
}

export function getAdminSummary() {
  return adminRequest<AdminSummary>('/admin/summary')
}
