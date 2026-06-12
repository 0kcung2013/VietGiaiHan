import { adminRequest } from './adminApi'

export interface AdminCategory {
  id: number
  name: string
  slug: string
  description: string
  sortOrder: number
  status: string
  createdAt: string
}

export type SaveCategoryPayload = Omit<AdminCategory, 'id' | 'createdAt'>

export function getAdminCategories() {
  return adminRequest<AdminCategory[]>('/admin/categories')
}

export function createAdminCategory(payload: SaveCategoryPayload) {
  return adminRequest<AdminCategory>('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateAdminCategory(id: number, payload: SaveCategoryPayload) {
  return adminRequest<void>(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteAdminCategory(id: number) {
  return adminRequest<void>(`/admin/categories/${id}`, {
    method: 'DELETE',
  })
}
