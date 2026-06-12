import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import styles from './AdminLayout.module.css'

const routeTitles: Record<string, string> = {
  '/admin/dashboard': 'Tổng quan',
  '/admin/consultations': 'Yêu cầu tư vấn',
  '/admin/products': 'Sản phẩm',
  '/admin/categories': 'Danh mục',
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = routeTitles[location.pathname] ?? 'Quản trị'

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
