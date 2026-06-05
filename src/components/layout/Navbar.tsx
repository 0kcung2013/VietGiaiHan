import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useWindowScroll } from '@mantine/hooks'
import { IconMenu2, IconX } from '@tabler/icons-react'
import clsx from 'clsx'
import styles from './Navbar.module.css'

const navLinks = [
  { label: 'Trang chủ', to: '/#hero' },
  { label: 'Giới thiệu', to: '/#about' },
  { label: 'Sản phẩm', to: '/san-pham' },
  { label: 'Quy trình', to: '/#process' },
  { label: 'Liên hệ', to: '/#contact' },
]

export function Navbar() {
  const [scroll] = useWindowScroll()
  const location = useLocation()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const isScrolled = scroll.y > 0

  useEffect(() => {
    if (!isDrawerOpen) {
      return undefined
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isDrawerOpen])

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsDrawerOpen(false)
      }
    }

    desktopQuery.addEventListener('change', closeOnDesktop)

    return () => {
      desktopQuery.removeEventListener('change', closeOnDesktop)
    }
  }, [])

  const closeDrawer = () => setIsDrawerOpen(false)
  const normalizePathname = (pathname: string) => (pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname)
  const getIsActiveLink = (to: string) => {
    const currentPathname = normalizePathname(location.pathname)

    if (to === '/san-pham') {
      return currentPathname === '/san-pham' || currentPathname.startsWith('/san-pham/')
    }

    const [pathname, hash = ''] = to.split('#')
    const targetPathname = normalizePathname(pathname)

    if (to === '/#hero') {
      return currentPathname === targetPathname && (location.hash === `#${hash}` || location.hash === '')
    }

    return currentPathname === targetPathname && location.hash === `#${hash}`
  }

  return (
    <header className={clsx(styles.navbar, isScrolled && styles.isScrolled)}>
      <div className={styles.inner}>
        <NavLink to="/#hero" className={styles.logo} onClick={closeDrawer}>
          <span className={styles.logoPrimary}>Việt Giai Hân</span>
          <span className={styles.logoSecondary}>Đồ gỗ mỹ nghệ</span>
        </NavLink>

        <nav className={styles.desktopNav} aria-label="Điều hướng chính">
          {navLinks.map((link) => {
            const isActiveLink = getIsActiveLink(link.to)

            return (
              <NavLink
                key={link.to}
                to={link.to}
                data-active={isActiveLink ? 'true' : undefined}
                className={clsx(styles.navLink, isActiveLink && styles.active)}
              >
                {link.label}
              </NavLink>
            )
          })}
        </nav>

        <NavLink to="/#contact" className={styles.cta}>
          Liên hệ
        </NavLink>

        <button
          className={styles.menuButton}
          type="button"
          aria-label="Mở menu"
          aria-expanded={isDrawerOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsDrawerOpen(true)}
        >
          <IconMenu2 size={24} stroke={1.5} />
        </button>
      </div>

      {isDrawerOpen && (
        <>
          <div className={styles.drawerOverlay} aria-hidden="true" onClick={closeDrawer} />

          <aside id="mobile-navigation" className={styles.drawer} aria-modal="true" role="dialog">
            <div className={styles.drawerHeader}>
              <NavLink to="/#hero" className={styles.logo} onClick={closeDrawer}>
                <span className={styles.logoPrimary}>Việt Giai Hân</span>
                <span className={styles.logoSecondary}>Đồ gỗ mỹ nghệ</span>
              </NavLink>
              <button className={styles.closeButton} type="button" aria-label="Đóng menu" onClick={closeDrawer}>
                <IconX size={22} stroke={1.5} />
              </button>
            </div>

            <nav className={styles.mobileNav} aria-label="Điều hướng di động">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  data-active={getIsActiveLink(link.to) ? 'true' : undefined}
                  className={() => `${styles.mobileLink} ${getIsActiveLink(link.to) ? styles.active : ''}`}
                  onClick={closeDrawer}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <NavLink to="/#contact" className={styles.mobileCta} onClick={closeDrawer}>
              Liên hệ
            </NavLink>
          </aside>
        </>
      )}
    </header>
  )
}
