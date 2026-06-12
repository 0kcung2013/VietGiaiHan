const ADMIN_STORAGE_KEY = 'viet_giai_han_admin_logged_in'
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'

export function loginAdmin(username: string, password: string) {
  const isValid = username === ADMIN_USERNAME && password === ADMIN_PASSWORD

  if (isValid) {
    localStorage.setItem(ADMIN_STORAGE_KEY, 'true')
  }

  return isValid
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_STORAGE_KEY)
}

export function isAdminLoggedIn() {
  return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true'
}
