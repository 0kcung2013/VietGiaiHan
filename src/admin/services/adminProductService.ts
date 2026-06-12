import { adminRequest } from './adminApi'

export interface AdminProduct {
  id: number
  name: string
  slug: string
  description: string
  categoryId: number | null
  category: string
  categoryName: string
  categorySlug: string
  imageUrl: string
  isFeatured: boolean
  sortOrder: number
  status: string
  createdAt: string
}

export type SaveProductPayload = Omit<AdminProduct, 'id' | 'categoryName' | 'categorySlug' | 'createdAt'>

export function getAdminProducts() {
  return adminRequest<AdminProduct[]>('/admin/products')
}

export function createAdminProduct(payload: SaveProductPayload) {
  return adminRequest<AdminProduct>('/admin/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateAdminProduct(id: number, payload: SaveProductPayload) {
  return adminRequest<void>(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteAdminProduct(id: number) {
  return adminRequest<void>(`/admin/products/${id}`, {
    method: 'DELETE',
  })
}
