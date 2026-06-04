export interface ProductCategory {
  id: number
  name: string
  slug: string
  description: string
  sortOrder: number
  status: string
  createdAt: string
}

interface ProductCategoryApiResponse {
  id: number
  name: string
  slug: string
  description: string
  sortOrder: number
  status: string
  createdAt: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function getProductCategories() {
  return request<ProductCategoryApiResponse[]>('/product-categories')
}

export function getProductCategoryBySlug(slug: string) {
  return request<ProductCategoryApiResponse>(`/product-categories/${encodeURIComponent(slug)}`)
}
