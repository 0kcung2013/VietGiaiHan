export interface Product {
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

interface ProductApiResponse {
  id: number
  name: string
  slug: string
  description: string
  categoryId?: number | null
  CategoryId?: number | null
  category: string
  categoryName?: string
  CategoryName?: string
  categorySlug?: string
  CategorySlug?: string
  imageUrl?: string
  ImageUrl?: string
  isFeatured: boolean
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

export function getProducts() {
  return request<ProductApiResponse[]>('/products').then((products) =>
    products.map(normalizeProduct),
  )
}

export function getFeaturedProducts() {
  return request<ProductApiResponse[]>('/products/featured').then((products) =>
    products.map(normalizeProduct),
  )
}

export function getProductBySlug(slug: string) {
  return request<ProductApiResponse>(`/products/${encodeURIComponent(slug)}`).then(normalizeProduct)
}

function normalizeProduct(product: ProductApiResponse): Product {
  return {
    ...product,
    categoryId: product.categoryId ?? product.CategoryId ?? null,
    categoryName: product.categoryName ?? product.CategoryName ?? product.category,
    categorySlug: product.categorySlug ?? product.CategorySlug ?? '',
    imageUrl: product.imageUrl ?? product.ImageUrl ?? '',
  }
}
