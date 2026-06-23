import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  IconClipboardList,
  IconFolder,
  IconHome,
  IconMessageDots,
  IconPackage,
  IconPlus,
  IconRefresh,
  IconSend,
} from '@tabler/icons-react'
import {
  getAdminSummary,
  getDailyConsultationStats,
  type AdminSummary,
  type DailyConsultationStats,
} from '../services/adminSummaryService'
import { getConsultationRequests, type ConsultationRequest } from '../services/adminConsultationService'
import { getJobApplications, type JobApplication } from '../services/adminJobApplicationService'
import styles from './AdminDashboardPage.module.css'

function useRealtimeClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  return now
}

function formatClock(date: Date) {
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function formatDateFull(date: Date) {
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatDayLabel(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

function toRelativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr.endsWith('Z') ? dateStr : `${dateStr}Z`).getTime()
  const diffSec = Math.max(0, Math.floor((now - then) / 1000))

  if (diffSec < 60) return 'Vừa xong'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} phút trước`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} giờ trước`
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 7) return `${diffDay} ngày trước`
  const diffWeek = Math.floor(diffDay / 7)
  if (diffWeek < 4) return `${diffWeek} tuần trước`
  return new Date(dateStr.endsWith('Z') ? dateStr : `${dateStr}Z`).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const start = performance.now()
    let raf: number

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}

type ActivityItem = {
  id: string
  type: 'consultation' | 'job'
  name: string
  detail: string
  isViewed: boolean
  createdAt: string
  link: string
}

const emptySummary: AdminSummary = {
  totalProducts: 0,
  totalCategories: 0,
  totalConsultationRequests: 0,
  unviewedConsultationRequests: 0,
  newConsultationRequests: 0,
  contactedConsultationRequests: 0,
  completedConsultationRequests: 0,
  totalJobApplications: 0,
  unviewedJobApplications: 0,
}

export function AdminDashboardPage() {
  const now = useRealtimeClock()
  const [summary, setSummary] = useState<AdminSummary>(emptySummary)
  const [dailyStats, setDailyStats] = useState<DailyConsultationStats[]>([])
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([])
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [summaryData, stats, cons, jobs] = await Promise.all([
          getAdminSummary(),
          getDailyConsultationStats(7),
          getConsultationRequests(),
          getJobApplications(),
        ])
        if (!cancelled) {
          setSummary(summaryData)
          setDailyStats(stats)
          setConsultations(cons)
          setJobApplications(jobs)
        }
      } catch {
        if (!cancelled) setError('Không thể tải dữ liệu tổng quan.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  function handleRefresh() {
    setLoading(true)
    setError('')
    Promise.all([
      getAdminSummary(),
      getDailyConsultationStats(7),
      getConsultationRequests(),
      getJobApplications(),
    ]).then(([summaryData, stats, cons, jobs]) => {
      setSummary(summaryData)
      setDailyStats(stats)
      setConsultations(cons)
      setJobApplications(jobs)
    }).catch(() => {
      setError('Không thể tải dữ liệu tổng quan.')
    }).finally(() => {
      setLoading(false)
    })
  }

  const maxDailyCount = useMemo(
    () => Math.max(1, ...dailyStats.map((d) => d.count)),
    [dailyStats],
  )

  const recentActivity = useMemo<ActivityItem[]>(() => {
    const consItems: ActivityItem[] = consultations.slice(0, 5).map((c) => ({
      id: `c-${c.id}`,
      type: 'consultation' as const,
      name: c.fullName,
      detail: c.productName || 'Tư vấn chung',
      isViewed: c.isViewed,
      createdAt: c.createdAt,
      link: '/admin/consultations',
    }))
    const jobItems: ActivityItem[] = jobApplications.slice(0, 5).map((j) => ({
      id: `j-${j.id}`,
      type: 'job' as const,
      name: j.fullName,
      detail: j.position,
      isViewed: j.isViewed,
      createdAt: j.createdAt,
      link: '/admin/job-applications',
    }))
    return [...consItems, ...jobItems]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
  }, [consultations, jobApplications])

  const totalProducts = useCountUp(summary.totalProducts)
  const totalConsultations = useCountUp(summary.totalConsultationRequests)
  const unviewedConsultations = useCountUp(summary.unviewedConsultationRequests)
  const totalJobs = useCountUp(summary.totalJobApplications)

  if (loading) {
    return <div className={styles.loading}>Đang tải tổng quan...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.greeting}>Xin chào, Quản trị viên</h1>
          <p className={styles.dateText}>{formatDateFull(now)}</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.clock}>{formatClock(now)}</div>
          <button className={styles.refreshBtn} type="button" onClick={handleRefresh} aria-label="Làm mới">
            <IconRefresh size={18} stroke={1.5} />
          </button>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <Link to="/admin/products" className={`${styles.statCard} ${styles.statWood}`}>
          <div className={styles.statIcon}>
            <IconPackage size={22} stroke={1.5} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Tổng sản phẩm</div>
            <div className={styles.statValue}>{totalProducts}</div>
          </div>
        </Link>

        <Link to="/admin/consultations?tab=all" className={`${styles.statCard} ${styles.statGold}`}>
          <div className={styles.statIcon}>
            <IconMessageDots size={22} stroke={1.5} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Yêu cầu tư vấn</div>
            <div className={styles.statValue}>{totalConsultations}</div>
          </div>
        </Link>

        <Link to="/admin/consultations?tab=new" className={`${styles.statCard} ${styles.statAlert}`}>
          <div className={styles.statIcon}>
            <IconSend size={22} stroke={1.5} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Chưa xem</div>
            <div className={styles.statValue}>{unviewedConsultations}</div>
          </div>
        </Link>

        <Link to="/admin/job-applications?tab=all" className={`${styles.statCard} ${styles.statGreen}`}>
          <div className={styles.statIcon}>
            <IconClipboardList size={22} stroke={1.5} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Đơn ứng tuyển</div>
            <div className={styles.statValue}>{totalJobs}</div>
          </div>
        </Link>
      </section>

      <div className={styles.body}>
        <div className={styles.left}>
          <section className={styles.chartSection}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Yêu cầu tư vấn — 7 ngày gần đây</h2>
            </div>
            <div className={styles.chart}>
              {dailyStats.map((d) => {
                const pct = maxDailyCount > 0 ? (d.count / maxDailyCount) * 100 : 0
                return (
                  <div key={d.date} className={styles.chartCol}>
                    <div className={styles.chartBarWrap}>
                      <div className={styles.chartBar} style={{ height: `${Math.max(pct, 2)}%` }}>
                        {d.count > 0 && <span className={styles.chartBarLabel}>{d.count}</span>}
                      </div>
                    </div>
                    <span className={styles.chartDayLabel}>{formatDayLabel(d.date)}</span>
                  </div>
                )
              })}
            </div>
          </section>

          <section className={styles.activitySection}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Hoạt động gần đây</h2>
            </div>
            {recentActivity.length === 0 ? (
              <div className={styles.empty}>Chưa có hoạt động nào.</div>
            ) : (
              <div className={styles.activityList}>
                {recentActivity.map((item) => (
                  <Link key={item.id} to={item.link} className={`${styles.activityItem} ${!item.isViewed ? styles.activityUnread : ''}`}>
                    <div className={styles.activityDot}>
                      {item.type === 'consultation' ? (
                        <IconMessageDots size={16} stroke={1.5} />
                      ) : (
                        <IconClipboardList size={16} stroke={1.5} />
                      )}
                    </div>
                    <div className={styles.activityMain}>
                      <div className={styles.activityName}>
                        {!item.isViewed && <span className={styles.unreadDot} />}
                        {item.name}
                      </div>
                      <div className={styles.activityDetail}>{item.detail}</div>
                    </div>
                    <div className={styles.activityMeta}>
                      <span className={`${styles.typeBadge} ${item.type === 'job' ? styles.typeJob : ''}`}>
                        {item.type === 'consultation' ? 'Tư vấn' : 'Ứng tuyển'}
                      </span>
                      <span className={styles.activityTime}>{toRelativeTime(item.createdAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className={styles.right}>
          <section className={styles.quickActions}>
            <h2 className={styles.sectionTitle}>Thao tác nhanh</h2>
            <div className={styles.actionsGrid}>
              <Link to="/admin/products" className={styles.actionBtn}>
                <IconPlus size={20} stroke={1.5} />
                <span>Thêm sản phẩm</span>
              </Link>
              <Link to="/admin/consultations" className={styles.actionBtn}>
                <IconMessageDots size={20} stroke={1.5} />
                <span>Tư vấn</span>
              </Link>
              <Link to="/admin/job-applications" className={styles.actionBtn}>
                <IconClipboardList size={20} stroke={1.5} />
                <span>Ứng tuyển</span>
              </Link>
              <Link to="/" className={styles.actionBtn}>
                <IconHome size={20} stroke={1.5} />
                <span>Trang chủ</span>
              </Link>
            </div>
          </section>

          <section className={styles.summarySection}>
            <h2 className={styles.sectionTitle}>Tóm tắt</h2>
            <div className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <IconFolder size={16} stroke={1.5} />
                <span>Danh mục</span>
                <strong>{summary.totalCategories}</strong>
              </div>
              <div className={styles.summaryRow}>
                <IconMessageDots size={16} stroke={1.5} />
                <span>Đã liên hệ</span>
                <strong>{summary.contactedConsultationRequests}</strong>
              </div>
              <div className={styles.summaryRow}>
                <IconMessageDots size={16} stroke={1.5} />
                <span>Hoàn thành</span>
                <strong>{summary.completedConsultationRequests}</strong>
              </div>
              <div className={styles.summaryRow}>
                <IconClipboardList size={16} stroke={1.5} />
                <span>Đơn chưa xem</span>
                <strong>{summary.unviewedJobApplications}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
