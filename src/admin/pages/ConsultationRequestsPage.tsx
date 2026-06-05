import { useEffect, useState } from 'react'
import {
  IconEye,
  IconRefresh,
  IconX,
} from '@tabler/icons-react'
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
  { value: 'cancelled', label: 'Hủy' },
]

const STATUS_OPTIONS = [
  { value: 'new', label: 'Mới', className: styles.statusNew },
  { value: 'contacted', label: 'Đã liên hệ', className: styles.statusContacted },
  { value: 'completed', label: 'Hoàn tất', className: styles.statusCompleted },
  { value: 'cancelled', label: 'Hủy', className: styles.statusCancelled },
]

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
  const found = STATUS_OPTIONS.find((s) => s.value === status)
  return found ?? STATUS_OPTIONS[0]
}

export function ConsultationRequestsPage() {
  const [requests, setRequests] = useState<ConsultationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getConsultationRequests()
        if (!cancelled) {
          setRequests(data)
        }
      } catch {
        if (!cancelled) {
          setError('Không thể tải danh sách yêu cầu tư vấn')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  const filtered = filter === 'all'
    ? requests
    : requests.filter((r) => r.status === filter)

  const handleStatusUpdate = async (id: number, newStatus: string, adminNote?: string) => {
    setUpdating(true)
    try {
      await updateConsultationRequestStatus(id, newStatus, adminNote)
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: newStatus, adminNote: adminNote ?? r.adminNote, updatedAt: new Date().toISOString() }
            : r,
        ),
      )
      setSelectedRequest((prev) =>
        prev && prev.id === id
          ? { ...prev, status: newStatus, adminNote: adminNote ?? prev.adminNote, updatedAt: new Date().toISOString() }
          : prev,
      )
    } catch {
      alert('Cập nhật trạng thái thất bại')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Đang tải dữ liệu...</div>
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button className={styles.retryBtn} onClick={() => window.location.reload()}>
          Thử lại
        </button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`${styles.filterBtn} ${filter === f.value ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              {f.value !== 'all' && (
                <span style={{ marginLeft: 6, opacity: 0.7 }}>
                  ({requests.filter((r) => r.status === f.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <button className={styles.filterBtn} onClick={() => window.location.reload()}>
          <IconRefresh size={14} style={{ marginRight: 4 }} />
          Làm mới
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          {filter === 'all'
            ? 'Chưa có yêu cầu tư vấn nào'
            : `Không có yêu cầu ở trạng thái "${getStatusBadge(filter).label}"`}
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Khách hàng</th>
                <th>SĐT</th>
                <th>Sản phẩm</th>
                <th>Nội dung</th>
                <th>Trạng thái</th>
                <th>Ngày gửi</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => {
                const badge = getStatusBadge(item.status)
                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td className={styles.customerCell}>{item.fullName}</td>
                    <td className={styles.phoneCell}>{item.phone}</td>
                    <td className={styles.productCell}>{item.productName || '-'}</td>
                    <td className={styles.messageCell} title={item.message || ''}>
                      {item.message || '-'}
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className={styles.dateCell}>{formatDate(item.createdAt)}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          title="Xem chi tiết"
                          onClick={() => setSelectedRequest(item)}
                        >
                          <IconEye size={16} stroke={1.5} />
                        </button>
                      </div>
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

  const badge = getStatusBadge(request.status)

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Chi tiết yêu cầu #{request.id}</h2>
          <button className={styles.modalClose} onClick={onClose}>
            <IconX size={18} stroke={1.5} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Họ tên</span>
            <span className={styles.fieldValue}>{request.fullName}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Số điện thoại</span>
            <span className={styles.fieldValue}>{request.phone}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Sản phẩm quan tâm</span>
            <span className={styles.fieldValue}>
              {request.productName || 'Không có sản phẩm cụ thể'}
            </span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Nội dung</span>
            <span className={styles.fieldValue}>
              {request.message || <em className={styles.fieldValueMuted}>Không có nội dung</em>}
            </span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Trạng thái hiện tại</span>
            <span className={`${styles.statusBadge} ${badge.className}`}>{badge.label}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Ngày gửi</span>
            <span className={styles.fieldValue}>{formatDate(request.createdAt)}</span>
          </div>

          {request.updatedAt && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Cập nhật lần cuối</span>
              <span className={styles.fieldValue}>{formatDate(request.updatedAt)}</span>
            </div>
          )}

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Ghi chú admin</span>
            <textarea
              className={styles.noteInput}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú..."
              disabled={updating}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Chuyển trạng thái</span>
            <div className={styles.statusActions}>
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`${styles.statusActionBtn} ${
                    request.status === opt.value
                      ? styles.statusActionBtnActive
                      : styles.statusActionBtnInactive
                  }`}
                  style={{
                    borderColor: request.status === opt.value ? 'currentColor' : 'var(--color-border)',
                    background: request.status === opt.value ? 'currentColor' : 'transparent',
                    color: request.status === opt.value ? '#fff' : 'var(--color-text-secondary)',
                  }}
                  disabled={updating || request.status === opt.value}
                  onClick={() => onStatusUpdate(request.id, opt.value, note)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onClose}>
            Đóng
          </button>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={updating}
            onClick={() => onStatusUpdate(request.id, request.status, note)}
          >
            {updating ? 'Đang lưu...' : 'Lưu ghi chú'}
          </button>
        </div>
      </div>
    </div>
  )
}
