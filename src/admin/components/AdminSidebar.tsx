import { NavLink } from 'react-router-dom'
import {
  IconLayoutDashboard,
  IconMessageDots,
  IconArrowLeft,
  IconMenu2,
} from '@tabler/icons-react'
import clsx from 'clsx'
import styles from './AdminSidebar.module.css'

interface AdminSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const navItems = [
  {
    section: 'Tổng quan',
    items: [
      { label: 'Dashboard', to: '/admin/dashboard', icon: IconLayoutDashboard },
    ],
  },
  {
    section: 'Quản lý',
    items: [
      { label: 'Yêu cầu tư vấn', to: '/admin/consultations', icon: IconMessageDots },
    ],
  },
]

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onToggle} />}

      <aside className={clsx(styles.sidebar, isOpen && styles.sidebarOpen)}>
        <NavLink to="/admin/dashboard" className={styles.logo}>
          <span className={styles.logoText}>Việt Giai Hân</span>
          <span className={styles.logoSub}>Quản trị hệ thống</span>
        </NavLink>

        <nav className={styles.nav}>
          {navItems.map((group) => (
            <div key={group.section}>
              <div className={styles.navSection}>{group.section}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(styles.navLink, isActive && styles.navLinkActive)
                  }
                >
                  <item.icon size={18} stroke={1.5} className={styles.navIcon} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <NavLink to="/" className={styles.backToSite}>
          <IconArrowLeft size={18} stroke={1.5} />
          Về trang chủ
        </NavLink>
      </aside>
    </>
  )
}

export function AdminMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className={styles.menuButton}
      type="button"
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <IconMenu2 size={22} stroke={1.5} />
    </button>
  )
}
