const ADMIN_AUTH_KEY = 'ramen_admin_auth'

export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(ADMIN_AUTH_KEY) === '1'
}

export function loginAdmin(): void {
  localStorage.setItem(ADMIN_AUTH_KEY, '1')
}

export function logoutAdmin(): void {
  localStorage.removeItem(ADMIN_AUTH_KEY)
}
