import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
  type AdminCategory,
  type SaveCategoryPayload,
} from '../services/adminCategoryService'
import styles from './AdminCrudPage.module.css'

const emptyCategory: SaveCategoryPayload = {
  name: '',
  slug: '',
  description: '',
  sortOrder: 0,
  status: 'Active',
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  async function loadCategories() {
    setLoading(true)
    setError('')

    try {
      setCategories(await getAdminCategories())
    } catch {
      setError('Không thể tải danh mục.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function loadInitialCategories() {
      try {
        const data = await getAdminCategories()

        if (!cancelled) {
          setCategories(data)
        }
      } catch {
        if (!cancelled) {
          setError('Không thể tải danh mục.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadInitialCategories()

    return () => {
      cancelled = true
    }
  }, [])

  function openCreateForm() {
    setEditingCategory(null)
    setIsFormOpen(true)
  }

  function openEditForm(category: AdminCategory) {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  async function handleDelete(category: AdminCategory) {
    if (!window.confirm(`Xóa danh mục "${category.name}"?`)) {
      return
    }

    try {
      await deleteAdminCategory(category.id)
      setCategories((prev) => prev.filter((item) => item.id !== category.id))
    } catch {
      setError('Không thể xóa danh mục. Danh mục này có thể vẫn đang được sản phẩm sử dụng.')
    }
  }

  async function handleToggleStatus(category: AdminCategory) {
    const payload = toPayload(category)
    payload.status = category.status === 'Active' ? 'Inactive' : 'Active'

    try {
      await updateAdminCategory(category.id, payload)
      setCategories((prev) =>
        prev.map((item) => (item.id === category.id ? { ...item, status: payload.status } : item)),
      )
    } catch {
      setError('Không thể cập nhật trạng thái danh mục.')
    }
  }

  async function handleSave(payload: SaveCategoryPayload) {
    try {
      if (editingCategory) {
        await updateAdminCategory(editingCategory.id, payload)
      } else {
        await createAdminCategory(payload)
      }

      setIsFormOpen(false)
      await loadCategories()
    } catch {
      setError('Không thể lưu danh mục. Vui lòng kiểm tra đường dẫn tĩnh và các trường bắt buộc.')
    }
  }

  if (loading) {
    return <div className={styles.loading}>Đang tải danh mục...</div>
  }

  return (
    <div className={styles.page}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <span className={styles.mutedCell}>{categories.length} danh mục</span>
        </div>
        <button className={`${styles.button} ${styles.primaryButton}`} type="button" onClick={openCreateForm}>
          Thêm danh mục
        </button>
      </div>

      {categories.length === 0 ? (
        <div className={styles.empty}>Chưa có danh mục.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tên danh mục</th>
                <th>Đường dẫn tĩnh</th>
                <th>Trạng thái</th>
                <th>Thứ tự</th>
                <th>Mô tả</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className={styles.nameCell}>{category.name}</td>
                  <td className={styles.mutedCell}>{category.slug}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        category.status === 'Active' ? styles.activeBadge : styles.inactiveBadge
                      }`}
                    >
                      {category.status === 'Active' ? 'Đang hiển thị' : 'Tạm ẩn'}
                    </span>
                  </td>
                  <td className={styles.numericCell}>{category.sortOrder}</td>
                  <td className={styles.descriptionCell}>{category.description}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.button} ${styles.actionPrimary}`}
                        type="button"
                        onClick={() => openEditForm(category)}
                      >
                        Sửa
                      </button>
                      <button
                        className={`${styles.button} ${styles.actionSubtle}`}
                        type="button"
                        onClick={() => handleToggleStatus(category)}
                      >
                        Trạng thái
                      </button>
                      <button
                        className={`${styles.button} ${styles.actionDanger}`}
                        type="button"
                        onClick={() => handleDelete(category)}
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
        <CategoryForm
          initialCategory={editingCategory}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function CategoryForm({
  initialCategory,
  onClose,
  onSave,
}: {
  initialCategory: AdminCategory | null
  onClose: () => void
  onSave: (payload: SaveCategoryPayload) => Promise<void>
}) {
  const [form, setForm] = useState<SaveCategoryPayload>(
    initialCategory ? toPayload(initialCategory) : emptyCategory,
  )
  const [saving, setSaving] = useState(false)

  function updateField<K extends keyof SaveCategoryPayload>(key: K, value: SaveCategoryPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
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
          <h2 className={styles.modalTitle}>{initialCategory ? 'Sửa danh mục' : 'Thêm danh mục'}</h2>
          <button className={styles.button} type="button" onClick={onClose}>
            Đóng
          </button>
        </div>

        <div className={styles.formGrid}>
          <label className={styles.field}>
            Tên danh mục
            <input className={styles.input} value={form.name} onChange={(event) => updateField('name', event.target.value)} required />
          </label>
          <label className={styles.field}>
            Đường dẫn tĩnh
            <input className={styles.input} value={form.slug} onChange={(event) => updateField('slug', event.target.value)} required />
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

function toPayload(category: AdminCategory): SaveCategoryPayload {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description,
    sortOrder: category.sortOrder,
    status: category.status,
  }
}
