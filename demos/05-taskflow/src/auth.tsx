import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  clearAuth,
  getAuthUser,
  getToken,
  login as apiLogin,
  type AuthUser,
} from './api/client'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => (getToken() ? getAuthUser() : null))

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      async login(username, password) {
        const next = await apiLogin(username, password)
        setUser(next)
      },
      logout() {
        clearAuth()
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
