import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  updateAdminProduct,
  type AdminProduct,
  type SaveProductPayload,
} from '../services/adminProductService'
import { getAdminCategories, type AdminCategory } from '../services/adminCategoryService'
import styles from './AdminCrudPage.module.css'

const emptyProduct: SaveProductPayload = {
  name: '',
  slug: '',
  description: '',
  categoryId: null,
  category: '',
  imageUrl: '/images/product/binh-hoa.jpg',
  isFeatured: false,
  sortOrder: 0,
  status: 'Active',
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  async function loadData() {
    setLoading(true)
    setError('')

    try {
      const [productData, categoryData] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
      ])
      setProducts(productData)
      setCategories(categoryData)
    } catch {
      setError('Không thể tải danh sách sản phẩm.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function loadInitialData() {
      try {
        const [productData, categoryData] = await Promise.all([
          getAdminProducts(),
          getAdminCategories(),
        ])

        if (!cancelled) {
          setProducts(productData)
          setCategories(categoryData)
        }
      } catch {
        if (!cancelled) {
          setError('Không thể tải danh sách sản phẩm.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadInitialData()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesSearch = keyword.length === 0 || product.name.toLowerCase().includes(keyword)
      const matchesCategory =
        categoryFilter === 'all' || String(product.categoryId ?? '') === categoryFilter
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [categoryFilter, products, search, statusFilter])

  function openCreateForm() {
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  function openEditForm(product: AdminProduct) {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  async function handleDelete(product: AdminProduct) {
    if (!window.confirm(`Xóa sản phẩm "${product.name}"?`)) {
      return
    }

    try {
      await deleteAdminProduct(product.id)
      setProducts((prev) => prev.filter((item) => item.id !== product.id))
    } catch {
      setError('Không thể xóa sản phẩm.')
    }
  }

  async function handleToggleStatus(product: AdminProduct) {
    const payload = toPayload(product)
    payload.status = product.status === 'Active' ? 'Inactive' : 'Active'

    try {
      await updateAdminProduct(product.id, payload)
      setProducts((prev) =>
        prev.map((item) => (item.id === product.id ? { ...item, status: payload.status } : item)),
      )
    } catch {
      setError('Không thể cập nhật trạng thái sản phẩm.')
    }
  }

  async function handleToggleFeatured(product: AdminProduct) {
    const payload = toPayload(product)
    payload.isFeatured = !product.isFeatured

    try {
      await updateAdminProduct(product.id, payload)
      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, isFeatured: payload.isFeatured } : item,
        ),
      )
    } catch {
      setError('Không thể cập nhật trạng thái nổi bật.')
    }
  }

  async function handleSave(payload: SaveProductPayload) {
    try {
      if (editingProduct) {
        await updateAdminProduct(editingProduct.id, payload)
      } else {
        await createAdminProduct(payload)
      }

      setIsFormOpen(false)
      await loadData()
    } catch {
      setError('Không thể lưu sản phẩm. Vui lòng kiểm tra đường dẫn tĩnh và các trường bắt buộc.')
    }
  }

  if (loading) {
    return <div className={styles.loading}>Đang tải sản phẩm...</div>
  }

  return (
    <div className={styles.page}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <input
            className={`${styles.input} ${styles.searchInput}`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm kiếm sản phẩm theo tên"
          />
          <select
            className={styles.select}
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            className={styles.select}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Active">Đang hiển thị</option>
            <option value="Inactive">Tạm ẩn</option>
          </select>
        </div>

        <button className={`${styles.button} ${styles.primaryButton}`} type="button" onClick={openCreateForm}>
          Thêm sản phẩm
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <div className={styles.empty}>Không tìm thấy sản phẩm phù hợp.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Nổi bật</th>
                <th>Thứ tự</th>
                <th>Mô tả</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className={styles.primaryStack}>
                      <div className={styles.nameCell}>{product.name}</div>
                      <div className={styles.mutedCell}>{product.slug}</div>
                    </div>
                  </td>
                  <td className={styles.secondaryCell}>{product.categoryName || product.category}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        product.status === 'Active' ? styles.activeBadge : styles.inactiveBadge
                      }`}
                    >
                      {product.status === 'Active' ? 'Đang hiển thị' : 'Tạm ẩn'}
                    </span>
                  </td>
                  <td>
                    {product.isFeatured ? (
                      <span className={`${styles.badge} ${styles.featuredBadge}`}>Nổi bật</span>
                    ) : (
                      <span className={styles.mutedCell}>Không</span>
                    )}
                  </td>
                  <td className={styles.numericCell}>{product.sortOrder}</td>
                  <td className={styles.descriptionCell}>{product.description}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.button} ${styles.actionPrimary}`}
                        type="button"
                        onClick={() => openEditForm(product)}
                      >
                        Sửa
                      </button>
                      <button
                        className={`${styles.button} ${styles.actionSubtle}`}
                        type="button"
                        onClick={() => handleToggleFeatured(product)}
                      >
                        Nổi bật
                      </button>
                      <button
                        className={`${styles.button} ${styles.actionSubtle}`}
                        type="button"
                        onClick={() => handleToggleStatus(product)}
                      >
                        Trạng thái
                      </button>
                      <button
                        className={`${styles.button} ${styles.actionDanger}`}
                        type="button"
                        onClick={() => handleDelete(product)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <ProductForm
          categories={categories}
          initialProduct={editingProduct}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function ProductForm({
  categories,
  initialProduct,
  onClose,
  onSave,
}: {
  categories: AdminCategory[]
  initialProduct: AdminProduct | null
  onClose: () => void
  onSave: (payload: SaveProductPayload) => Promise<void>
}) {
  const [form, setForm] = useState<SaveProductPayload>(
    initialProduct ? toPayload(initialProduct) : emptyProduct,
  )
  const [saving, setSaving] = useState(false)

  function updateField<K extends keyof SaveProductPayload>(key: K, value: SaveProductPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleCategoryChange(value: string) {
    const category = categories.find((item) => String(item.id) === value)
    updateField('categoryId', category ? category.id : null)
    updateField('category', category ? category.name : '')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)

    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <form className={styles.modal} onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{initialProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
          <button className={styles.button} type="button" onClick={onClose}>
            Đóng
          </button>
        </div>

        <div className={styles.formGrid}>
          <label className={styles.field}>
            Tên sản phẩm
            <input className={styles.input} value={form.name} onChange={(event) => updateField('name', event.target.value)} required />
          </label>
          <label className={styles.field}>
            Đường dẫn tĩnh
            <input className={styles.input} value={form.slug} onChange={(event) => updateField('slug', event.target.value)} required />
          </label>
          <label className={styles.field}>
            Danh mục
            <select
              className={styles.select}
              value={form.categoryId ?? ''}
              onChange={(event) => handleCategoryChange(event.target.value)}
            >
              <option value="">Chưa chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            Tên danh mục
            <input className={styles.input} value={form.category} onChange={(event) => updateField('category', event.target.value)} required />
          </label>
          <label className={styles.field}>
            Đường dẫn ảnh
            <input className={styles.input} value={form.imageUrl} onChange={(event) => updateField('imageUrl', event.target.value)} required />
          </label>
          <label className={styles.field}>
            Thứ tự sắp xếp
            <input
              className={styles.input}
              type="number"
              value={form.sortOrder}
              onChange={(event) => updateField('sortOrder', Number(event.target.value))}
            />
          </label>
          <label className={styles.field}>
            Trạng thái
            <select className={styles.select} value={form.status} onChange={(event) => updateField('status', event.target.value)}>
              <option value="Active">Đang hiển thị</option>
              <option value="Inactive">Tạm ẩn</option>
            </select>
          </label>
          <label className={styles.checkboxField}>
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(event) => updateField('isFeatured', event.target.checked)}
            />
            Sản phẩm nổi bật
          </label>
          <label className={styles.wideField}>
            Mô tả
            <textarea className={styles.textarea} value={form.description} onChange={(event) => updateField('description', event.target.value)} required />
          </label>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.button} type="button" onClick={onClose}>
            Hủy
          </button>
          <button className={`${styles.button} ${styles.primaryButton}`} type="submit" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  )
}

function toPayload(product: AdminProduct): SaveProductPayload {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description,
    categoryId: product.categoryId,
    category: product.category,
    imageUrl: product.imageUrl,
    isFeatured: product.isFeatured,
    sortOrder: product.sortOrder,
    status: product.status,
  }
}
