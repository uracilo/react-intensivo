import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextValue {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('auth') === 'true',
  )

  function login(username: string, password: string) {
    const ok = username === 'demo' && password === 'demo123'
    if (ok) {
      sessionStorage.setItem('auth', 'true')
      setIsAuthenticated(true)
    }
    return ok
  }

  function logout() {
    sessionStorage.removeItem('auth')
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
