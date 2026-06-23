import { adminRequest } from './adminApi'

export interface JobApplication {
  id: number
  fullName: string
  phone: string
  email: string
  position: string
  cvUrl: string | null
  cvFileName: string | null
  message: string | null
  status: string
  isViewed: boolean
  viewedAt: string | null
  createdAt: string
  updatedAt: string | null
}

export function getJobApplications() {
  return adminRequest<JobApplication[]>('/job-applications')
}

export function updateJobApplicationStatus(id: number, status: string) {
  return adminRequest<void>(`/job-applications/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}

export function markJobApplicationViewed(id: number) {
  return adminRequest<void>(`/job-applications/${id}/viewed`, {
    method: 'PUT',
  })
}

export function markJobApplicationsViewed(ids: number[]) {
  return adminRequest<void>('/job-applications/mark-viewed', {
    method: 'PUT',
    body: JSON.stringify({ ids }),
  })
}
