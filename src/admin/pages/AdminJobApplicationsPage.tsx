import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  IconCheck,
  IconDownload,
  IconEye,
  IconFileSpreadsheet,
  IconLoader2,
  IconMessageDots,
  IconRefresh,
  IconSearch,
  IconSearchOff,
  IconX,
} from '@tabler/icons-react'
import {
  getJobApplications,
  markJobApplicationViewed,
  markJobApplicationsViewed,
  updateJobApplicationStatus,
  type JobApplication,
} from '../services/adminJobApplicationService'
import styles from './AdminJobApplicationsPage.module.css'

type JobTab = 'new' | 'viewed' | 'all'

const JOB_TABS: Array<{ value: JobTab; label: string }> = [
  { value: 'new', label: 'Đơn mới' },
  { value: 'viewed', label: 'Đã xem' },
  { value: 'all', label: 'Tất cả' },
]

const STATUS_OPTIONS = [
  { value: 'new', label: 'Mới', className: styles.statusNew },
  { value: 'reviewed', label: 'Đã xem', className: styles.statusReviewed },
  { value: 'accepted', label: 'Đã duyệt', className: styles.statusAccepted },
  { value: 'rejected', label: 'Từ chối', className: styles.statusRejected },
]

function getTabFromSearchParams(searchParams: URLSearchParams): JobTab {
  const tab = searchParams.get('tab')
  if (tab === 'viewed' || tab === 'all') return tab
  return 'new'
}

function getTabCount(tab: JobTab, summary: { total: number; unviewed: number; viewed: number }) {
  switch (tab) {
    case 'new': return summary.unviewed
    case 'viewed': return summary.viewed
    case 'all': return summary.total
    default: return 0
  }
}

function toLocalDate(dateStr: string) {
  const iso = dateStr.endsWith('Z') ? dateStr : `${dateStr}Z`
  return new Date(iso)
}

function formatDate(dateStr: string) {
  return toLocalDate(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatDateParts(dateStr: string) {
  const date = toLocalDate(dateStr)
  return {
    date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  }
}

function getStatusBadge(status: string) {
  return STATUS_OPTIONS.find((item) => item.value === status) ?? STATUS_OPTIONS[0]
}

function truncateText(value: string | null | undefined, maxLength = 72) {
  const text = value?.trim() || '-'
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text
}

function xmlEscape(value: string | number | null | undefined) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function columnName(index: number) {
  let name = ''
  let value = index
  while (value >= 0) {
    name = String.fromCharCode((value % 26) + 65) + name
    value = Math.floor(value / 26) - 1
  }
  return name
}

function createWorksheetXml(rows: Array<Array<string | number>>) {
  const sheetRows = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((cell, columnIndex) => {
          const ref = `${columnName(columnIndex)}${rowIndex + 1}`
          return `<c r="${ref}" t="inlineStr"><is><t>${xmlEscape(cell)}</t></is></c>`
        })
        .join('')
      return `<row r="${rowIndex + 1}">${cells}</row>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="18"/>
  <cols>
    <col min="1" max="1" width="8" customWidth="1"/>
    <col min="2" max="2" width="24" customWidth="1"/>
    <col min="3" max="3" width="18" customWidth="1"/>
    <col min="4" max="4" width="22" customWidth="1"/>
    <col min="5" max="5" width="20" customWidth="1"/>
    <col min="6" max="6" width="24" customWidth="1"/>
    <col min="7" max="7" width="16" customWidth="1"/>
    <col min="8" max="8" width="22" customWidth="1"/>
  </cols>
  <sheetData>${sheetRows}</sheetData>
</worksheet>`
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff
  for (const byte of bytes) {
    crc ^= byte
    for (let index = 0; index < 8; index += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function writeUint16(buffer: number[], value: number) {
  buffer.push(value & 0xff, (value >>> 8) & 0xff)
}

function writeUint32(buffer: number[], value: number) {
  buffer.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff)
}

function getDosDateTime(date = new Date()) {
  return {
    dosTime: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    dosDate: ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  }
}

function createZip(files: Array<{ name: string; content: string }>) {
  const encoder = new TextEncoder()
  const chunks: number[] = []
  const centralDirectory: number[] = []
  const { dosDate, dosTime } = getDosDateTime()
  let offset = 0

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name)
    const contentBytes = encoder.encode(file.content)
    const checksum = crc32(contentBytes)

    writeUint32(chunks, 0x04034b50)
    writeUint16(chunks, 20)
    writeUint16(chunks, 0)
    writeUint16(chunks, 0)
    writeUint16(chunks, dosTime)
    writeUint16(chunks, dosDate)
    writeUint32(chunks, checksum)
    writeUint32(chunks, contentBytes.length)
    writeUint32(chunks, contentBytes.length)
    writeUint16(chunks, nameBytes.length)
    writeUint16(chunks, 0)
    chunks.push(...nameBytes, ...contentBytes)
    offset = chunks.length

    writeUint32(centralDirectory, 0x02014b50)
    writeUint16(centralDirectory, 20)
    writeUint16(centralDirectory, 20)
    writeUint16(centralDirectory, 0)
    writeUint16(centralDirectory, 0)
    writeUint16(centralDirectory, dosTime)
    writeUint16(centralDirectory, dosDate)
    writeUint32(centralDirectory, checksum)
    writeUint32(centralDirectory, contentBytes.length)
    writeUint32(centralDirectory, contentBytes.length)
    writeUint16(centralDirectory, nameBytes.length)
    writeUint16(centralDirectory, 0)
    writeUint16(centralDirectory, 0)
    writeUint16(centralDirectory, 0)
    writeUint16(centralDirectory, 0)
    writeUint32(centralDirectory, 0)
    writeUint32(centralDirectory, localHeaderOffset)
    centralDirectory.push(...nameBytes)
  })

  const centralDirectoryOffset = chunks.length
  chunks.push(...centralDirectory)
  writeUint32(chunks, 0x06054b50)
  writeUint16(chunks, 0)
  writeUint16(chunks, 0)
  writeUint16(chunks, files.length)
  writeUint16(chunks, files.length)
  writeUint32(chunks, centralDirectory.length)
  writeUint32(chunks, centralDirectoryOffset)
  writeUint16(chunks, 0)

  return new Uint8Array(chunks)
}

function createExcelBlob(rows: Array<Array<string | number>>) {
  const files = [
    {
      name: '[Content_Types].xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`,
    },
    {
      name: '_rels/.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
    },
    {
      name: 'xl/workbook.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Don ung tuyen" sheetId="1" r:id="rId1"/></sheets>
</workbook>`,
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`,
    },
    { name: 'xl/worksheets/sheet1.xml', content: createWorksheetXml(rows) },
  ]

  return new Blob([createZip(files)], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

function exportRowsToExcel(rows: Array<Array<string | number>>, fileName: string) {
  const blob = createExcelBlob(rows)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function buildExportRows(requests: JobApplication[]) {
  return [
    ['STT', 'Họ tên', 'Điện thoại', 'Email', 'Vị trí', 'Trạng thái', 'Đã xem', 'Ngày nộp'],
    ...requests.map((request, index) => [
      index + 1,
      request.fullName,
      request.phone,
      request.email,
      request.position,
      getStatusBadge(request.status).label,
      request.isViewed ? 'Đã xem' : 'Chưa xem',
      formatDate(request.createdAt),
    ]),
  ]
}

function getExportDateSlug() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function AdminJobApplicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [requests, setRequests] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<JobApplication | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const activeTab = getTabFromSearchParams(searchParams)

  function setActiveTab(tab: JobTab) {
    setSearchParams(tab === 'new' ? {} : { tab })
  }

  async function loadRequests() {
    setLoading(true)
    setError('')
    try {
      const data = await getJobApplications()
      setRequests(data)
      return data
    } catch {
      setError('Không thể tải đơn ứng tuyển.')
      return undefined
    } finally {
      setLoading(false)
    }
  }

  async function fetchRequests() {
    try {
      const data = await getJobApplications()
      setRequests(data)
    } catch {
      setError('Không thể tải đơn ứng tuyển.')
    }
  }

  useEffect(() => { void loadRequests() }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      void fetchRequests()
    }, 10000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleFocus() { void fetchRequests() }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  useEffect(() => {
    if (!toastMessage) return undefined
    const timer = window.setTimeout(() => setToastMessage(''), 3200)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

  const summary = useMemo(() => ({
    total: requests.length,
    unviewed: requests.filter((r) => !r.isViewed).length,
    viewed: requests.filter((r) => r.isViewed).length,
  }), [requests])

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return requests.filter((request) => {
      const matchesSearch =
        keyword.length === 0 ||
        request.fullName.toLowerCase().includes(keyword) ||
        request.phone.toLowerCase().includes(keyword) ||
        request.email.toLowerCase().includes(keyword) ||
        request.position.toLowerCase().includes(keyword)
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'viewed' && request.isViewed) ||
        (activeTab === 'new' && !request.isViewed)
      return matchesSearch && matchesTab
    })
  }, [requests, search, activeTab])

  const hasActiveFilters = activeTab !== 'new' || search.trim().length > 0

  function applyViewedState(ids: number[]) {
    const viewedAt = new Date().toISOString()
    const idSet = new Set(ids)
    setRequests((prev) =>
      prev.map((r) => idSet.has(r.id) ? { ...r, isViewed: true, viewedAt } : r),
    )
    setSelectedRequest((prev) =>
      prev && idSet.has(prev.id) ? { ...prev, isViewed: true, viewedAt } : prev,
    )
  }

  async function handleMarkViewed(request: JobApplication, showToast = true) {
    if (request.isViewed) return
    try {
      await markJobApplicationViewed(request.id)
      applyViewedState([request.id])
      if (showToast) setToastMessage('Đã đánh dấu là đã xem.')
    } catch {
      setError('Không thể đánh dấu đã xem.')
    }
  }

  async function handleOpenDetail(request: JobApplication) {
    setSelectedRequest(request)
    if (!request.isViewed) await handleMarkViewed(request, false)
  }

  async function handleStatusUpdate(id: number, newStatus: string) {
    try {
      await updateJobApplicationStatus(id, newStatus)
      setRequests((prev) =>
        prev.map((r) => r.id === id ? { ...r, status: newStatus, updatedAt: new Date().toISOString() } : r),
      )
      setSelectedRequest((prev) =>
        prev && prev.id === id ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() } : prev,
      )
      setToastMessage('Đã cập nhật trạng thái.')
    } catch {
      setError('Không thể cập nhật trạng thái.')
    }
  }

  function clearFilters() {
    setSearch('')
    setActiveTab('new')
  }

  async function handleExportExcel() {
    if (filtered.length === 0 || isExporting) return
    setIsExporting(true)
    setError('')
    try {
      const fileName = `don-ung-tuyen${activeTab !== 'all' ? `-${activeTab}` : ''}${search.trim() ? `-${search.trim()}` : ''}-${getExportDateSlug()}.xlsx`
      exportRowsToExcel(buildExportRows(filtered), fileName)
      const ids = filtered.map((r) => r.id)
      await markJobApplicationsViewed(ids)
      applyViewedState(ids)
      await loadRequests()
      setActiveTab('viewed')
      setToastMessage('Đã xuất Excel và chuyển sang mục Đã xem.')
    } catch {
      setError('Không thể xuất Excel.')
    } finally {
      setIsExporting(false)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Đang tải đơn ứng tuyển...</div>
  }

  return (
    <div className={styles.page}>
      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.summaryGrid} aria-label="Tổng quan đơn ứng tuyển">
        <SummaryCard icon={<IconMessageDots size={20} />} label="Tổng đơn" value={summary.total} tone="wood" onClick={() => setActiveTab('all')} />
        <SummaryCard icon={<IconEye size={20} />} label="Chưa xem" value={summary.unviewed} tone="alert" onClick={() => setActiveTab('new')} />
        <SummaryCard icon={<IconCheck size={20} />} label="Đã xem" value={summary.viewed} tone="green" onClick={() => setActiveTab('viewed')} />
      </section>

      <div className={styles.tabs} role="tablist">
        {JOB_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`${styles.tabBtn} ${activeTab === tab.value ? styles.tabBtnActive : ''}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.value}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
            <span className={styles.tabCount}>{getTabCount(tab.value, summary)}</span>
          </button>
        ))}
      </div>

      <section className={styles.commandPanel}>
        <div className={styles.searchBox}>
          <IconSearch size={17} stroke={1.7} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, SĐT, email hoặc vị trí"
          />
        </div>
        <div className={styles.panelActions}>
          <span className={styles.recordCount}>{filtered.length} đơn</span>
          <button className={`${styles.btn} ${styles.btnExport}`} type="button" onClick={handleExportExcel} disabled={filtered.length === 0 || isExporting}>
            {isExporting ? <IconLoader2 size={15} className={styles.spinner} /> : <IconFileSpreadsheet size={15} />}
            {isExporting ? 'Đang xuất...' : `Xuất Excel (${filtered.length})`}
          </button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} type="button" onClick={loadRequests}>
            <IconRefresh size={15} />
            Làm mới
          </button>
        </div>
      </section>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ứng viên</th>
              <th>Vị trí</th>
              <th>CV</th>
              <th>Trạng thái</th>
              <th>Ngày nộp</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td className={styles.emptyTableCell} colSpan={6}>
                  <div className={styles.emptyState}>
                    <IconSearchOff size={34} stroke={1.5} />
                    <div className={styles.emptyTitle}>Không tìm thấy đơn phù hợp</div>
                    <div className={styles.emptySubtitle}>Thử đổi từ khóa hoặc chọn tab khác.</div>
                    {hasActiveFilters && (
                      <button className={styles.clearFilterBtn} type="button" onClick={clearFilters}>
                        Xóa bộ lọc
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const createdAt = formatDateParts(item.createdAt)
                return (
                  <tr key={item.id} className={!item.isViewed ? styles.unviewedRow : undefined}>
                    <td className={styles.customerCell} data-label="Ứng viên">
                      <div className={styles.customerLine}>
                        {!item.isViewed && <span className={styles.unreadDot} />}
                        <button className={styles.customerButton} type="button" onClick={() => handleOpenDetail(item)}>
                          {item.fullName}
                        </button>
                      </div>
                      <div className={styles.contactLines}>
                        <a className={styles.phoneLink} href={`tel:${item.phone}`}>{item.phone}</a>
                        <span className={styles.emailText}>{item.email}</span>
                      </div>
                    </td>
                    <td className={styles.productCell} data-label="Vị trí">
                      <span>{item.position}</span>
                    </td>
                    <td data-label="CV">
                      {item.cvUrl ? (
                        <a className={styles.cvLink} href={item.cvUrl} target="_blank" rel="noopener noreferrer">
                          <IconDownload size={14} />
                          {item.cvFileName || 'Xem CV'}
                        </a>
                      ) : (
                        <span className={styles.noCv}>Chưa nộp</span>
                      )}
                    </td>
                    <td data-label="Trạng thái">
                      <span className={`${styles.statusBadge} ${getStatusBadge(item.status).className}`}>
                        {getStatusBadge(item.status).label}
                      </span>
                    </td>
                    <td className={styles.dateCell} data-label="Ngày nộp">
                      <span className={styles.datePrimary}>{createdAt.date}</span>
                      <span className={styles.dateSecondary}>{createdAt.time}</span>
                    </td>
                    <td data-label="Thao tác">
                      <div className={styles.actions}>
                        <button className={styles.detailBtn} type="button" onClick={() => handleOpenDetail(item)}>
                          <IconEye size={16} stroke={1.6} />
                          Chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {toastMessage && (
        <div className={styles.toast} role="status">
          <IconCheck size={16} stroke={2} />
          {toastMessage}
        </div>
      )}

      {selectedRequest && (
        <DetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  )
}

function SummaryCard({ icon, label, value, tone, onClick }: {
  icon: ReactNode; label: string; value: number; tone: string; onClick?: () => void
}) {
  const Component = onClick ? 'button' : 'article'
  return (
    <Component
      className={`${styles.summaryCard} ${onClick ? styles.summaryButton : ''} ${styles[`summary_${tone}`]}`}
      type={onClick ? 'button' : undefined}
      onClick={onClick}
    >
      <div className={styles.summaryIcon}>{icon}</div>
      <div>
        <div className={styles.summaryLabel}>{label}</div>
        <div className={styles.summaryValue}>{value}</div>
      </div>
    </Component>
  )
}

function DetailModal({ request, onClose, onStatusUpdate }: {
  request: JobApplication
  onClose: () => void
  onStatusUpdate: (id: number, status: string) => Promise<void>
}) {
  const [status, setStatus] = useState(request.status)
  const [saving, setSaving] = useState(false)
  const badge = getStatusBadge(request.status)
  const hasChanges = status !== request.status

  async function handleSave() {
    setSaving(true)
    try {
      await onStatusUpdate(request.id, status)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalEyebrow}>Đơn ứng tuyển #{request.id}</div>
            <h2 className={styles.modalTitle}>{request.fullName}</h2>
          </div>
          <button className={styles.modalClose} type="button" onClick={onClose} aria-label="Đóng">
            <IconX size={18} stroke={1.6} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <section className={styles.modalSection}>
            <div className={styles.modalSectionTitle}>Thông tin ứng viên</div>
            <div className={styles.infoGrid}>
              <Info label="Họ và tên" value={request.fullName} />
              <Info label="Điện thoại" value={request.phone} mono />
              <Info label="Email" value={request.email} />
              <Info label="Ngày nộp" value={formatDate(request.createdAt)} />
            </div>
          </section>

          <section className={styles.modalSection}>
            <div className={styles.modalSectionTitle}>Vị trí ứng tuyển</div>
            <div className={styles.productDetailBlock}>
              <strong>{request.position}</strong>
            </div>
          </section>

          {request.message && (
            <section className={styles.modalSection}>
              <div className={styles.modalSectionTitle}>Thông tin bổ sung</div>
              <p className={styles.messageBlock}>{request.message}</p>
            </section>
          )}

          {request.cvUrl && (
            <section className={styles.modalSection}>
              <div className={styles.modalSectionTitle}>CV đính kèm</div>
              <a className={styles.cvLink} href={request.cvUrl} target="_blank" rel="noopener noreferrer">
                <IconDownload size={16} />
                {request.cvFileName || 'Tải CV'}
              </a>
            </section>
          )}

          <section className={styles.modalSection}>
            <div className={styles.modalSectionTitle}>Cập nhật trạng thái</div>
            <div className={styles.editGrid}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Trạng thái hiện tại</span>
                <span className={`${styles.statusBadge} ${badge.className}`}>{badge.label}</span>
              </div>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Chuyển sang</span>
                <select className={styles.selectInput} value={status} onChange={(e) => setStatus(e.target.value)}>
                  {STATUS_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        </div>

        <div className={styles.modalFooter}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} type="button" onClick={onClose}>Đóng</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} type="button" disabled={saving || !hasChanges} onClick={handleSave}>
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={`${styles.fieldValue} ${mono ? styles.monoValue : ''}`}>{value}</span>
    </div>
  )
}

function useSearchParams() {
  const [params, setParams] = useState(() => new URLSearchParams(window.location.search))

  useEffect(() => {
    const handlePopState = () => setParams(new URLSearchParams(window.location.search))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const setSearchParams = (newParams: URLSearchParams | Record<string, string>) => {
    const sp = newParams instanceof URLSearchParams ? newParams : new URLSearchParams(newParams)
    const url = new URL(window.location.href)
    url.search = ''
    sp.forEach((v, k) => url.searchParams.set(k, v))
    window.history.pushState({}, '', url.toString())
    setParams(new URLSearchParams(url.search))
  }

  return [params, setSearchParams] as const
}
