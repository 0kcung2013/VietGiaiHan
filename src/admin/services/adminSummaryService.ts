import { adminRequest } from './adminApi'

export interface AdminSummary {
  totalProducts: number
  totalCategories: number
  totalConsultationRequests: number
  unviewedConsultationRequests: number
  newConsultationRequests: number
  contactedConsultationRequests: number
  completedConsultationRequests: number
  totalJobApplications: number
  unviewedJobApplications: number
}

export interface DailyConsultationStats {
  date: string
  count: number
}

export function getAdminSummary() {
  return adminRequest<AdminSummary>('/admin/summary')
}

export function getDailyConsultationStats(days = 7) {
  return adminRequest<DailyConsultationStats[]>(`/admin/consultation-stats?days=${days}`)
}
