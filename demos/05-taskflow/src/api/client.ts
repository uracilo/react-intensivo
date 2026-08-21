const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const TOKEN_KEY = 'taskflow-token'
const USER_KEY = 'taskflow-user'

export interface AuthUser {
  username: string
  role: 'USER' | 'ADMIN'
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getAuthUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? (JSON.parse(raw) as AuthUser) : null
}

export function setAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isApiMode(): boolean {
  return import.meta.env.VITE_USE_API !== 'false'
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error((err as { message?: string }).message ?? `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

/** Login real o demo (ana/ana123) si la API no está */
export async function login(username: string, password: string): Promise<AuthUser> {
  if (isApiMode()) {
    try {
      const data = await request<{ token: string; username?: string; role?: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
      const user: AuthUser = {
        username: data.username ?? username,
        role: (data.role as AuthUser['role']) ?? 'USER',
      }
      setAuth(data.token, user)
      return user
    } catch {
      // fallback demo
    }
  }

  const demoUsers: Record<string, { password: string; role: AuthUser['role'] }> = {
    ana: { password: 'ana123', role: 'USER' },
    luis: { password: 'luis123', role: 'USER' },
    admin: { password: 'admin123', role: 'ADMIN' },
  }
  const found = demoUsers[username]
  if (!found || found.password !== password) {
    throw new Error('Credenciales inválidas')
  }
  const user: AuthUser = { username, role: found.role }
  setAuth(`demo-token-${username}`, user)
  return user
}

export { API_URL, request }
