import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import styles from './AdminLayout.module.css'

const routeTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/consultations': 'Yêu cầu tư vấn',
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentPath = window.location.pathname
  const title = routeTitles[currentPath] ?? 'Quản trị'

  return (
    <div className={styles.layout}>
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      <div className={styles.main}>
        <AdminHeader title={title} onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
