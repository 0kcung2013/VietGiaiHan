import { Link } from 'react-router-dom'
import { IconMenu2, IconExternalLink } from '@tabler/icons-react'
import styles from './AdminHeader.module.css'

interface AdminHeaderProps {
  title: string
  onMenuToggle: () => void
}

export function AdminHeader({ title, onMenuToggle }: AdminHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          className={styles.menuBtn}
          type="button"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <IconMenu2 size={22} stroke={1.5} />
        </button>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.headerRight}>
        <Link to="/" className={styles.siteLink} target="_blank" rel="noopener noreferrer">
          <IconExternalLink size={16} stroke={1.5} />
          Xem trang chủ
        </Link>
      </div>
    </header>
  )
}
