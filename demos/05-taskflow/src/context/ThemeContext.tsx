import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { PaletteMode } from './types'

interface ThemeContextValue {
  mode: PaletteMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'app-theme-mode'

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'dark' ? 'dark' : 'light'
  })

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  const value = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider')
  return ctx
}
