import { useEffect, useMemo, useState } from 'react'
import { IconEye, IconRefresh, IconX } from '@tabler/icons-react'
import {
  getConsultationRequests,
  updateConsultationRequestStatus,
  type ConsultationRequest,
} from '../services/adminConsultationService'
import styles from './ConsultationRequestsPage.module.css'

const STATUS_FILTERS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'new', label: 'Mới' },
  { value: 'contacted', label: 'Đã liên hệ' },
  { value: 'completed', label: 'Hoàn tất' },
  { value: 'cancelled', label: 'Đã hủy' },
]

const STATUS_OPTIONS = [
  { value: 'new', label: 'Mới', className: styles.statusNew },
  { value: 'contacted', label: 'Đã liên hệ', className: styles.statusContacted },
  { value: 'completed', label: 'Hoàn tất', className: styles.statusCompleted },
  { value: 'cancelled', label: 'Đã hủy', className: styles.statusCancelled },
]

const validStatuses = STATUS_OPTIONS.map((status) => status.value)

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStatusBadge(status: string) {
  return STATUS_OPTIONS.find((item) => item.value === status) ?? STATUS_OPTIONS[0]
}

export function ConsultationRequestsPage() {
  const [requests, setRequests] = useState<ConsultationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null)
  const [updating, setUpdating] = useState(false)

  async function loadRequests() {
    setLoading(true)
    setError('')

    try {
      const data = await getConsultationRequests()
      setRequests(data)
    } catch {
      setError('Không thể tải yêu cầu tư vấn.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function loadInitialRequests() {
      try {
        const data = await getConsultationRequests()

        if (!cancelled) {
          setRequests(data)
        }
      } catch {
        if (!cancelled) {
          setError('Không thể tải yêu cầu tư vấn.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadInitialRequests()

    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return requests.filter((request) => {
      const matchesStatus = filter === 'all' || request.status === filter
      const matchesSearch =
        keyword.length === 0 ||
        request.fullName.toLowerCase().includes(keyword) ||
        request.phone.toLowerCase().includes(keyword)

      return matchesStatus && matchesSearch
    })
  }, [filter, requests, search])

  async function handleStatusUpdate(id: number, newStatus: string, adminNote?: string) {
    if (!validStatuses.includes(newStatus)) {
      setError('Trạng thái không hợp lệ.')
      return
    }

    setUpdating(true)
    setError('')

    try {
      await updateConsultationRequestStatus(id, newStatus, adminNote)
      const updatedAt = new Date().toISOString()

      setRequests((prev) =>
        prev.map((request) =>
          request.id === id
            ? { ...request, status: newStatus, adminNote: adminNote ?? request.adminNote, updatedAt }
            : request,
        ),
      )
      setSelectedRequest((prev) =>
        prev && prev.id === id
          ? { ...prev, status: newStatus, adminNote: adminNote ?? prev.adminNote, updatedAt }
          : prev,
      )
    } catch {
      setError('Không thể cập nhật yêu cầu tư vấn.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Đang tải yêu cầu tư vấn...</div>
  }

  return (
    <div className={styles.page}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Tìm kiếm theo tên khách hoặc số điện thoại"
        />

        <div className={styles.filterGroup}>
          {STATUS_FILTERS.map((item) => (
            <button
              key={item.value}
              className={`${styles.filterBtn} ${filter === item.value ? styles.filterBtnActive : ''}`}
              type="button"
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button className={styles.filterBtn} type="button" onClick={loadRequests}>
          <IconRefresh size={14} />
          Làm mới
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>Không tìm thấy yêu cầu tư vấn phù hợp.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Khách hàng</th>
                <th>Điện thoại</th>
                <th>Sản phẩm</th>
                <th>Nội dung</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => {
                const badge = getStatusBadge(item.status)

                return (
                  <tr key={item.id}>
                    <td data-label="#">#{index + 1}</td>
                    <td className={styles.customerCell} data-label="Khách hàng">
                      <div className={styles.customerName}>{item.fullName}</div>
                      <div className={styles.customerMeta}>{item.phone}</div>
                    </td>
                    <td className={styles.phoneCell} data-label="Điện thoại">{item.phone}</td>
                    <td className={styles.productCell} data-label="Sản phẩm">{item.productName || '-'}</td>
                    <td className={styles.messageCell} data-label="Nội dung" title={item.message || ''}>
                      {item.message || '-'}
                    </td>
                    <td data-label="Trạng thái">
                      <span className={`${styles.statusBadge} ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className={styles.dateCell} data-label="Ngày tạo">{formatDate(item.createdAt)}</td>
                    <td data-label="Thao tác">
                      <button
                        className={styles.actionBtn}
                        type="button"
                        title="Xem chi tiết"
                        onClick={() => setSelectedRequest(item)}
                      >
                        <IconEye size={16} stroke={1.5} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedRequest && (
        <DetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onStatusUpdate={handleStatusUpdate}
          updating={updating}
        />
      )}
    </div>
  )
}

function DetailModal({
  request,
  onClose,
  onStatusUpdate,
  updating,
}: {
  request: ConsultationRequest
  onClose: () => void
  onStatusUpdate: (id: number, status: string, adminNote?: string) => Promise<void>
  updating: boolean
}) {
  const [note, setNote] = useState(request.adminNote ?? '')
  const [status, setStatus] = useState(request.status)
  const badge = getStatusBadge(request.status)

  async function handleSave() {
    await onStatusUpdate(request.id, status, note)
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Yêu cầu #{request.id}</h2>
          <button className={styles.modalClose} type="button" onClick={onClose}>
            <IconX size={18} stroke={1.5} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <Info label="Họ và tên" value={request.fullName} />
          <Info label="Điện thoại" value={request.phone} />
          <Info label="Sản phẩm" value={request.productName || 'Chưa chọn sản phẩm'} />
          <Info label="Nội dung" value={request.message || 'Không có nội dung'} />
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Trạng thái hiện tại</span>
            <span className={`${styles.statusBadge} ${badge.className}`}>{badge.label}</span>
          </div>
          <Info label="Ngày tạo" value={formatDate(request.createdAt)} />
          {request.updatedAt && <Info label="Cập nhật" value={formatDate(request.updatedAt)} />}

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Trạng thái</span>
            <select
              className={styles.selectInput}
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              disabled={updating}
            >
              {STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Ghi chú quản trị</span>
            <textarea
              className={styles.noteInput}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Nhập ghi chú xử lý"
              disabled={updating}
            />
          </label>
        </div>

        <div className={styles.modalFooter}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} type="button" onClick={onClose}>
            Đóng
          </button>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            type="button"
            disabled={updating}
            onClick={handleSave}
          >
            {updating ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldValue}>{value}</span>
    </div>
  )
}
