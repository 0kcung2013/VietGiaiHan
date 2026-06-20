import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  IconCheck,
  IconClock,
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
  getConsultationRequests,
  markConsultationRequestViewed,
  markConsultationRequestsViewed,
  updateConsultationRequestStatus,
  type ConsultationRequest,
} from '../services/adminConsultationService'
import styles from './ConsultationRequestsPage.module.css'

type ConsultationTab = 'new' | 'viewed' | 'all'

const CONSULTATION_TABS: Array<{ value: ConsultationTab; label: string }> = [
  { value: 'new', label: 'Yêu cầu mới' },
  { value: 'viewed', label: 'Đã xem / Đã xuất' },
  { value: 'all', label: 'Tất cả' },
]

const STATUS_OPTIONS = [
  { value: 'new', label: 'Mới', className: styles.statusNew },
  { value: 'contacted', label: 'Đã liên hệ', className: styles.statusContacted },
  { value: 'completed', label: 'Hoàn tất', className: styles.statusCompleted },
  { value: 'cancelled', label: 'Đã hủy', className: styles.statusCancelled },
]

const validStatuses = STATUS_OPTIONS.map((status) => status.value)

function getTabFromSearchParams(searchParams: URLSearchParams): ConsultationTab {
  const tab = searchParams.get('tab') ?? searchParams.get('view')

  if (tab === 'viewed' || tab === 'all') {
    return tab
  }

  return 'new'
}

function getTabCount(
  tab: ConsultationTab,
  summary: { total: number; unviewed: number; viewed: number; new: number },
) {
  switch (tab) {
    case 'new':
      return summary.unviewed
    case 'viewed':
      return summary.viewed
    case 'all':
      return summary.total
    default:
      return 0
  }
}

function toLocalDate(dateStr: string) {
  const iso = dateStr.endsWith('Z') ? dateStr : `${dateStr}Z`
  return new Date(iso)
}

function formatDate(dateStr: string) {
  return toLocalDate(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getExportDateSlug() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

function getExportFileName(activeTab: ConsultationTab, search: string) {
  const keywordPart = slugify(search.trim()).slice(0, 24)
  const tabPart = activeTab === 'all' ? '' : `-${activeTab}`

  return `yeu-cau-tu-van${tabPart}${keywordPart ? `-${keywordPart}` : ''}-${getExportDateSlug()}.xlsx`
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
    <col min="4" max="4" width="30" customWidth="1"/>
    <col min="5" max="5" width="48" customWidth="1"/>
    <col min="6" max="6" width="18" customWidth="1"/>
    <col min="7" max="7" width="16" customWidth="1"/>
    <col min="8" max="8" width="22" customWidth="1"/>
    <col min="9" max="9" width="40" customWidth="1"/>
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
    const localHeaderOffset = offset

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
  <sheets><sheet name="Yeu cau tu van" sheetId="1" r:id="rId1"/></sheets>
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

function buildExportRows(requests: ConsultationRequest[]) {
  return [
    ['STT', 'Khách hàng', 'Điện thoại', 'Sản phẩm', 'Nội dung', 'Trạng thái xử lý', 'Đã xem', 'Ngày tạo', 'Ghi chú quản trị'],
    ...requests.map((request, index) => [
      index + 1,
      request.fullName,
      request.phone,
      request.productName || '-',
      request.message || '-',
      getStatusBadge(request.status).label,
      request.isViewed ? 'Đã xem' : 'Chưa xem',
      formatDate(request.createdAt),
      request.adminNote || '-',
    ]),
  ]
}

export function ConsultationRequestsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [requests, setRequests] = useState<ConsultationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null)
  const [updating, setUpdating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const activeTab = getTabFromSearchParams(searchParams)

  function setActiveTab(tab: ConsultationTab) {
    setSearchParams(tab === 'new' ? {} : { tab })
  }

  async function loadRequests() {
    setLoading(true)
    setError('')

    try {
      const data = await getConsultationRequests()
      setRequests(data)
      return data
    } catch {
      setError('Không thể tải yêu cầu tư vấn.')
      return undefined
    } finally {
      setLoading(false)
    }
  }

  async function fetchRequests() {
    try {
      const data = await getConsultationRequests()
      setRequests(data)
    } catch {
      setError('Không thể tải yêu cầu tư vấn.')
    }
  }

  useEffect(() => {
    void loadRequests()
  }, [])

  useEffect(() => {
    const id = setInterval(() => void fetchRequests(), 5000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!toastMessage) {
      return undefined
    }

    const timer = window.setTimeout(() => setToastMessage(''), 3200)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

  const summary = useMemo(() => {
    return {
      total: requests.length,
      unviewed: requests.filter((request) => !request.isViewed).length,
      viewed: requests.filter((request) => request.isViewed).length,
      new: requests.filter((request) => request.status === 'new').length,
    }
  }, [requests])

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return requests.filter((request) => {
      const matchesSearch =
        keyword.length === 0 ||
        request.fullName.toLowerCase().includes(keyword) ||
        request.phone.toLowerCase().includes(keyword) ||
        request.productName.toLowerCase().includes(keyword)
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'viewed' && request.isViewed) ||
        (activeTab === 'new' && !request.isViewed)

      return matchesSearch && matchesTab
    })
  }, [requests, search, activeTab])

  const hasActiveFilters = activeTab !== 'new' || search.trim().length > 0
  const exportFileName = getExportFileName(activeTab, search)

  function applyViewedState(ids: number[]) {
    const viewedAt = new Date().toISOString()
    const idSet = new Set(ids)

    setRequests((prev) =>
      prev.map((request) =>
        idSet.has(request.id) ? { ...request, isViewed: true, viewedAt, updatedAt: viewedAt } : request,
      ),
    )
    setSelectedRequest((prev) =>
      prev && idSet.has(prev.id) ? { ...prev, isViewed: true, viewedAt, updatedAt: viewedAt } : prev,
    )
  }

  async function handleMarkViewed(request: ConsultationRequest, showToast = true) {
    if (request.isViewed) {
      return
    }

    try {
      await markConsultationRequestViewed(request.id)
      applyViewedState([request.id])
      if (showToast) {
        setToastMessage('Đã đánh dấu yêu cầu là đã xem.')
      }
    } catch {
      setError('Không thể đánh dấu đã xem.')
    }
  }

  async function handleOpenDetail(request: ConsultationRequest) {
    setSelectedRequest(request)
    if (!request.isViewed) {
      await handleMarkViewed(request, false)
    }
  }

  async function handleStatusUpdate(id: number, newStatus: string, adminNote?: string) {
    if (!validStatuses.includes(newStatus)) {
      setError('Trạng thái không hợp lệ.')
      throw new Error('Invalid status')
    }

    setUpdating(true)
    setError('')

    try {
      await updateConsultationRequestStatus(id, newStatus, adminNote)
      const updatedAt = new Date().toISOString()

      setRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: newStatus, adminNote: adminNote ?? request.adminNote, updatedAt } : request,
        ),
      )
      setSelectedRequest((prev) =>
        prev && prev.id === id ? { ...prev, status: newStatus, adminNote: adminNote ?? prev.adminNote, updatedAt } : prev,
      )
      setToastMessage('Đã cập nhật trạng thái xử lý.')
    } catch {
      setError('Không thể cập nhật yêu cầu tư vấn.')
      throw new Error('Update failed')
    } finally {
      setUpdating(false)
    }
  }

  function clearFilters() {
    setSearch('')
    setActiveTab('new')
  }

  async function handleExportExcel() {
    if (filtered.length === 0 || isExporting) {
      return
    }

    setIsExporting(true)
    setError('')

    try {
      exportRowsToExcel(buildExportRows(filtered), exportFileName)
      const ids = filtered.map((request) => request.id)
      await markConsultationRequestsViewed(ids)
      applyViewedState(ids)
      await loadRequests()
      setActiveTab('viewed')
      setToastMessage('Đã xuất Excel và chuyển các yêu cầu sang mục Đã xem / Đã xuất.')
    } catch {
      setError('Không thể xuất Excel hoặc đánh dấu danh sách đã xem.')
    } finally {
      setIsExporting(false)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Đang tải yêu cầu tư vấn...</div>
  }

  return (
    <div className={styles.page}>
      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.summaryGrid} aria-label="Tổng quan yêu cầu tư vấn">
        <SummaryCard icon={<IconMessageDots size={20} />} label="Tổng yêu cầu" value={summary.total} tone="wood" onClick={() => setActiveTab('all')} />
        <SummaryCard icon={<IconEye size={20} />} label="Chưa xem" value={summary.unviewed} tone="alert" onClick={() => setActiveTab('new')} />
        <SummaryCard icon={<IconClock size={20} />} label="Mới" value={summary.new} tone="gold" />
        <SummaryCard icon={<IconCheck size={20} />} label="Đã xem" value={summary.viewed} tone="green" onClick={() => setActiveTab('viewed')} />
      </section>

      <div className={styles.tabs} role="tablist" aria-label="Lọc yêu cầu tư vấn">
        {CONSULTATION_TABS.map((tab) => (
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
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tên, số điện thoại hoặc sản phẩm"
          />
        </div>

        <div className={styles.panelActions}>
          <span className={styles.recordCount}>{filtered.length} yêu cầu</span>
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
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Nội dung</th>
              <th>Đã xem</th>
              <th>Thời gian gửi</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td className={styles.emptyTableCell} colSpan={6}>
                  <div className={styles.emptyState}>
                    <IconSearchOff size={34} stroke={1.5} />
                    <div className={styles.emptyTitle}>Không tìm thấy yêu cầu phù hợp</div>
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
                    <td className={styles.customerCell} data-label="Khách hàng">
                      <div className={styles.customerLine}>
                        {!item.isViewed && <span className={styles.unreadDot} aria-label="Chưa xem" />}
                        <button className={styles.customerButton} type="button" onClick={() => void handleOpenDetail(item)}>
                          {item.fullName}
                        </button>
                      </div>
                      <a className={styles.phoneLink} href={`tel:${item.phone}`}>
                        {item.phone}
                      </a>
                    </td>
                    <td className={styles.productCell} data-label="Sản phẩm">
                      <span>{item.productName || 'Chưa chọn sản phẩm'}</span>
                      {item.productSlug && <small>Mã: {item.productSlug}</small>}
                    </td>
                    <td className={styles.messageCell} data-label="Nội dung" title={item.message || ''}>
                      {truncateText(item.message)}
                    </td>
                    <td data-label="Đã xem">
                      <span className={`${styles.viewBadge} ${item.isViewed ? styles.viewedBadge : styles.unviewedBadge}`}>
                        {item.isViewed ? 'Đã xem' : 'Chưa xem'}
                      </span>
                    </td>
                    <td className={styles.dateCell} data-label="Thời gian gửi">
                      <span className={styles.datePrimary}>{createdAt.date}</span>
                      <span className={styles.dateSecondary}>{createdAt.time}</span>
                    </td>
                    <td data-label="Thao tác">
                      <div className={styles.actions}>
                        <button className={styles.detailBtn} type="button" onClick={() => void handleOpenDetail(item)}>
                          <IconEye size={16} stroke={1.6} />
                          Xem chi tiết
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
          updating={updating}
        />
      )}
    </div>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  tone,
  onClick,
}: {
  icon: ReactNode
  label: string
  value: number
  tone: 'wood' | 'alert' | 'gold' | 'blue' | 'green'
  onClick?: () => void
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
  const [saveError, setSaveError] = useState('')
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)
  const badge = getStatusBadge(request.status)
  const hasUnsavedChanges = status !== request.status || note !== (request.adminNote ?? '')

  async function handleSave() {
    setSaveError('')

    try {
      await onStatusUpdate(request.id, status, note)
      onClose()
    } catch {
      setSaveError('Cập nhật thất bại. Vui lòng thử lại.')
    }
  }

  function handleRequestClose() {
    if (!hasUnsavedChanges) {
      onClose()
      return
    }

    setShowCloseConfirm(true)
  }

  return (
    <div className={styles.modalOverlay} onClick={handleRequestClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalEyebrow}>Yêu cầu tư vấn #{request.id}</div>
            <h2 className={styles.modalTitle}>{request.fullName}</h2>
          </div>
          <button className={styles.modalClose} type="button" onClick={handleRequestClose} aria-label="Đóng">
            <IconX size={18} stroke={1.6} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <section className={styles.modalSection}>
            <div className={styles.modalSectionTitle}>Thông tin khách</div>
            <div className={styles.infoGrid}>
              <Info label="Họ và tên" value={request.fullName} />
              <Info label="Điện thoại" value={request.phone} mono />
              <Info label="Ngày gửi" value={formatDate(request.createdAt)} />
              <Info label="Trạng thái xem" value={request.isViewed ? 'Đã xem' : 'Chưa xem'} />
            </div>
          </section>

          <section className={styles.modalSection}>
            <div className={styles.modalSectionTitle}>Sản phẩm quan tâm</div>
            <div className={styles.productDetailBlock}>
              <strong>{request.productName || 'Chưa chọn sản phẩm'}</strong>
              {request.productSlug && <span>Mã sản phẩm: {request.productSlug}</span>}
            </div>
          </section>

          <section className={styles.modalSection}>
            <div className={styles.modalSectionTitle}>Nhu cầu tư vấn</div>
            <p className={styles.messageBlock}>{request.message || 'Khách chưa nhập nội dung tư vấn.'}</p>
          </section>

          <section className={styles.modalSection}>
            <div className={styles.modalSectionTitle}>Xử lý nội bộ</div>
            <div className={styles.editGrid}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Trạng thái xử lý</span>
                <select className={styles.selectInput} value={status} onChange={(event) => setStatus(event.target.value)} disabled={updating}>
                  {STATUS_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>Hiện tại</span>
                <span className={`${styles.statusBadge} ${badge.className}`}>{badge.label}</span>
              </div>
            </div>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Ghi chú admin</span>
              <textarea
                className={styles.noteInput}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Nhập ghi chú xử lý, thời điểm đã gọi hoặc bước tiếp theo"
                disabled={updating}
              />
            </label>
          </section>

          {saveError && <div className={styles.modalError}>{saveError}</div>}

          {showCloseConfirm && (
            <div className={styles.closeConfirm}>
              <div>
                <div className={styles.closeConfirmTitle}>Bạn có thay đổi chưa lưu. Đóng?</div>
                <div className={styles.closeConfirmText}>Trạng thái xử lý hoặc ghi chú vừa chỉnh sẽ không được lưu.</div>
              </div>
              <div className={styles.closeConfirmActions}>
                <button className={`${styles.btn} ${styles.btnSecondary}`} type="button" onClick={() => setShowCloseConfirm(false)}>
                  Tiếp tục chỉnh sửa
                </button>
                <button className={`${styles.btn} ${styles.btnDanger}`} type="button" onClick={onClose}>
                  Đóng không lưu
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} type="button" onClick={handleRequestClose}>
            Đóng
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            type="button"
            onClick={() => {
              const params = new URLSearchParams({
                name: request.fullName,
                phone: request.phone,
                product: request.productName,
                message: request.message ?? '',
              })
              window.location.href = `/#contact?${params.toString()}`
            }}
          >
            Gửi yêu cầu
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} type="button" disabled={updating} onClick={handleSave}>
            {updating ? 'Đang lưu...' : 'Lưu thay đổi'}
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
