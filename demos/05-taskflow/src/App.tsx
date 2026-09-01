import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useMemo } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth'
import { ThemeModeProvider, useThemeMode } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { ErrorBoundary } from './ErrorBoundary'
import { Layout } from './Layout'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { NewUserPage } from './pages/NewUserPage'
import { UserDetailPage } from './pages/UserDetailPage'
import { UserListPage } from './pages/UserListPage'

function ThemedApp() {
  const { mode } = useThemeMode()
  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
      }),
    [mode],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/users" replace />} />
                    <Route path="/users" element={<UserListPage />} />
                    <Route path="/users/new" element={<NewUserPage />} />
                    <Route path="/users/:id" element={<UserDetailPage />} />
                  </Route>
                </Route>
                <Route path="*" element={<Navigate to="/users" replace />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <ThemeModeProvider>
      <ThemedApp />
    </ThemeModeProvider>
  )
}
