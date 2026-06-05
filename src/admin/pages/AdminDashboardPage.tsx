import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  IconPackage,
  IconFolder,
  IconMessageDots,
  IconMessageReport,
} from '@tabler/icons-react'
import { getConsultationRequests, type ConsultationRequest } from '../services/adminConsultationService'
import styles from './AdminDashboardPage.module.css'

interface Stats {
  totalProducts: number
  totalCategories: number
  newConsultations: number
  totalConsultations: number
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function getStatusClass(status: string) {
  switch (status) {
    case 'new': return styles.statusNew
    case 'contacted': return styles.statusContacted
    case 'completed': return styles.statusCompleted
    case 'cancelled': return styles.statusCancelled
    default: return styles.statusNew
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'new': return 'Mới'
    case 'contacted': return 'Đã liên hệ'
    case 'completed': return 'Hoàn tất'
    case 'cancelled': return 'Hủy'
    default: return status
  }
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    newConsultations: 0,
    totalConsultations: 0,
  })
  const [recentConsultations, setRecentConsultations] = useState<ConsultationRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const consultations = await getConsultationRequests()
        const newCount = consultations.filter((c) => c.status === 'new').length

        setStats({
          totalProducts: 0,
          totalCategories: 0,
          newConsultations: newCount,
          totalConsultations: consultations.length,
        })

        setRecentConsultations(consultations.slice(0, 5))
      } catch {
        console.error('Failed to load stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className={styles.loading}>Đang tải dữ liệu...</div>
  }

  return (
    <div>
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconGold}`}>
            <IconMessageDots size={24} stroke={1.5} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Yêu cầu mới</div>
            <div className={styles.statValue}>{stats.newConsultations}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconBlue}`}>
            <IconMessageReport size={24} stroke={1.5} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Tổng yêu cầu</div>
            <div className={styles.statValue}>{stats.totalConsultations}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconWood}`}>
            <IconPackage size={24} stroke={1.5} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Sản phẩm</div>
            <div className={styles.statValue}>{stats.totalProducts}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconGreen}`}>
            <IconFolder size={24} stroke={1.5} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Danh mục</div>
            <div className={styles.statValue}>{stats.totalCategories}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Yêu cầu tư vấn gần đây</div>
        {recentConsultations.length === 0 ? (
          <div className={styles.empty}>Chưa có yêu cầu tư vấn nào</div>
        ) : (
          <div className={styles.recentList}>
            {recentConsultations.map((item) => (
              <div key={item.id} className={styles.recentItem}>
                <div>
                  <div className={styles.recentName}>{item.fullName}</div>
                  <div className={styles.recentProduct}>
                    {item.productName || 'Không có sản phẩm'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span className={`${styles.statusBadge} ${getStatusClass(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                  <span className={styles.recentDate}>{formatDate(item.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {recentConsultations.length > 0 && (
          <Link
            to="/admin/consultations"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: 'var(--space-4)',
              color: 'var(--color-gold)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Xem tất cả →
          </Link>
        )}
      </div>
    </div>
  )
}
