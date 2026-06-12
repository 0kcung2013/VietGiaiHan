import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { loginAdmin, isAdminLoggedIn } from '../services/adminAuthService'
import styles from './AdminLoginPage.module.css'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAdminLoggedIn()) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const fromPath =
    typeof location.state === 'object' &&
    location.state !== null &&
    'from' in location.state &&
    typeof location.state.from === 'object' &&
    location.state.from !== null &&
    'pathname' in location.state.from &&
    typeof location.state.from.pathname === 'string'
      ? location.state.from.pathname
      : '/admin/dashboard'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!loginAdmin(username.trim(), password)) {
      setError('Tên đăng nhập hoặc mật khẩu chưa đúng.')
      return
    }

    navigate(fromPath, { replace: true })
  }

  return (
    <main className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div>
          <p className={styles.eyebrow}>Khu vực quản trị</p>
          <h1 className={styles.title}>Viet Giai Han</h1>
          <p className={styles.subtitle}>Đăng nhập để quản lý sản phẩm, danh mục và yêu cầu tư vấn.</p>
        </div>

        <label className={styles.field}>
          <span>Tên đăng nhập</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            autoFocus
          />
        </label>

        <label className={styles.field}>
          <span>Mật khẩu</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.submit} type="submit">
          Đăng nhập
        </button>

        <p className={styles.hint}>Tài khoản tạm: admin / admin123</p>
      </form>
    </main>
  )
}
