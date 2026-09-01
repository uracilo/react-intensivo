import { createContext, useContext, useState, type ReactNode } from 'react'
import { getApiErrorMessage, getAuthToken, loginRequest, setAuthToken } from './api/client'

interface LoginResult {
  success: boolean
  error?: string
}

interface AuthContextValue {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<LoginResult>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAuthToken()))

  async function login(username: string, password: string): Promise<LoginResult> {
    try {
      const token = await loginRequest(username, password)
      setAuthToken(token)
      setIsAuthenticated(true)
      return { success: true }
    } catch (err) {
      return { success: false, error: getApiErrorMessage(err) }
    }
  }

  function logout() {
    setAuthToken(null)
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
