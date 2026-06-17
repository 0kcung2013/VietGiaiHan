import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  IconFolder,
  IconEye,
  IconEyeCheck,
  IconMessageDots,
  IconMessageReport,
  IconPackage,
} from '@tabler/icons-react'
import { getAdminSummary, type AdminSummary } from '../services/adminSummaryService'
import { getConsultationRequests, type ConsultationRequest } from '../services/adminConsultationService'
import styles from './AdminDashboardPage.module.css'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const emptySummary: AdminSummary = {
  totalProducts: 0,
  totalCategories: 0,
  totalConsultationRequests: 0,
  unviewedConsultationRequests: 0,
  newConsultationRequests: 0,
  contactedConsultationRequests: 0,
  completedConsultationRequests: 0,
}

export function AdminDashboardPage() {
  const [summary, setSummary] = useState<AdminSummary>(emptySummary)
  const [recentConsultations, setRecentConsultations] = useState<ConsultationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      try {
        const [summaryData, consultations] = await Promise.all([
          getAdminSummary(),
          getConsultationRequests(),
        ])

        if (!cancelled) {
          setSummary(summaryData)
          setRecentConsultations(consultations.slice(0, 5))
        }
      } catch {
        if (!cancelled) {
          setError('Không thể tải dữ liệu tổng quan.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return <div className={styles.loading}>Đang tải tổng quan...</div>
  }

  if (error) {
    return <div className={styles.empty}>{error}</div>
  }

  const viewedConsultationRequests =
    summary.totalConsultationRequests - summary.unviewedConsultationRequests

  return (
    <div>
      <div className={styles.stats}>
        <Link to="/admin/consultations?tab=all" className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconGold}`}>
            <IconMessageDots size={24} stroke={1.5} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Tổng yêu cầu</div>
            <div className={styles.statValue}>{summary.totalConsultationRequests}</div>
          </div>
        </Link>

        <Link to="/admin/consultations?tab=new" className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconAlert}`}>
            <IconEye size={24} stroke={1.5} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Chưa xem</div>
            <div className={styles.statValue}>{summary.unviewedConsultationRequests}</div>
          </div>
        </Link>

        <Link to="/admin/consultations?tab=new" className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconWood}`}>
            <IconMessageReport size={24} stroke={1.5} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Mới</div>
            <div className={styles.statValue}>{summary.newConsultationRequests}</div>
          </div>
        </Link>

        <Link to="/admin/consultations?tab=viewed" className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconGreen}`}>
            <IconEyeCheck size={24} stroke={1.5} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Đã xem</div>
            <div className={styles.statValue}>{viewedConsultationRequests}</div>
          </div>
        </Link>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconWood}`}>
            <IconPackage size={24} stroke={1.5} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Sản phẩm</div>
            <div className={styles.statValue}>{summary.totalProducts}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconGreen}`}>
            <IconFolder size={24} stroke={1.5} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Danh mục</div>
            <div className={styles.statValue}>{summary.totalCategories}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Yêu cầu tư vấn gần đây</div>
        {recentConsultations.length === 0 ? (
          <div className={styles.empty}>Chưa có yêu cầu tư vấn.</div>
        ) : (
          <div className={styles.recentList}>
            {recentConsultations.map((item) => (
              <div key={item.id} className={`${styles.recentItem} ${!item.isViewed ? styles.recentUnread : ''}`}>
                <div className={styles.recentMain}>
                  <div className={styles.recentName}>
                    {!item.isViewed && <span className={styles.unreadDot} />}
                    {item.fullName}
                  </div>
                  <div className={styles.recentPhone}>{item.phone}</div>
                  <div className={styles.recentProduct}>
                    {item.productName || 'Chưa chọn sản phẩm'}
                  </div>
                </div>
                <div className={styles.recentMeta}>
                  <span className={`${styles.viewBadge} ${item.isViewed ? styles.viewedBadge : styles.unviewedBadge}`}>
                    {item.isViewed ? 'Đã xem' : 'Chưa xem'}
                  </span>
                  <span className={styles.recentDate}>{formatDate(item.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {recentConsultations.length > 0 && (
          <Link to="/admin/consultations" className={styles.viewAll}>
            Xem tất cả
          </Link>
        )}
      </div>
    </div>
  )
}
