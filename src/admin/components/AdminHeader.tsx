import { Link, useNavigate } from 'react-router-dom'
import { IconExternalLink, IconLogout, IconMenu2 } from '@tabler/icons-react'
import { logoutAdmin } from '../services/adminAuthService'
import styles from './AdminHeader.module.css'

interface AdminHeaderProps {
  title: string
  onMenuToggle: () => void
}

export function AdminHeader({ title, onMenuToggle }: AdminHeaderProps) {
  const navigate = useNavigate()

  function handleLogout() {
    logoutAdmin()
    navigate('/admin/login', { replace: true })
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          className={styles.menuBtn}
          type="button"
          onClick={onMenuToggle}
          aria-label="Mở menu quản trị"
        >
          <IconMenu2 size={22} stroke={1.5} />
        </button>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.headerRight}>
        <Link to="/" className={styles.siteLink} target="_blank" rel="noopener noreferrer">
          <IconExternalLink size={16} stroke={1.5} />
          Xem website
        </Link>
        <button className={styles.logoutBtn} type="button" onClick={handleLogout}>
          <IconLogout size={16} stroke={1.5} />
          Đăng xuất
        </button>
      </div>
    </header>
  )
}
