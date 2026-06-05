import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import SanPham from './pages/SanPham.jsx'
import { AdminLayout } from './admin/components/AdminLayout'
import { AdminDashboardPage } from './admin/pages/AdminDashboardPage'
import { ConsultationRequestsPage } from './admin/pages/ConsultationRequestsPage'

function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const id = location.hash.slice(1)
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [location.pathname, location.hash])

  return null
}

function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/san-pham" element={<SanPham />} />
        <Route path="/san-pham/:slug" element={<ProductDetailPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="consultations" element={<ConsultationRequestsPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
