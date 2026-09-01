import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth'
import { Layout } from './Layout'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { NewUserPage } from './pages/NewUserPage'
import { UserDetailPage } from './pages/UserDetailPage'
import { UserListPage } from './pages/UserListPage'

const theme = createTheme()

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
