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
import { NewProjectPage } from './pages/NewProjectPage'
import { NewTaskPage } from './pages/NewTaskPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectListPage } from './pages/ProjectListPage'
import { TaskDetailPage } from './pages/TaskDetailPage'
import { TaskListPage } from './pages/TaskListPage'

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
                    <Route path="/" element={<Navigate to="/projects" replace />} />
                    <Route path="/projects" element={<ProjectListPage />} />
                    <Route path="/projects/new" element={<NewProjectPage />} />
                    <Route path="/projects/:id" element={<ProjectDetailPage />} />
                    <Route path="/tasks" element={<TaskListPage />} />
                    <Route path="/tasks/new" element={<NewTaskPage />} />
                    <Route path="/tasks/:id" element={<TaskDetailPage />} />
                  </Route>
                </Route>
                <Route path="*" element={<Navigate to="/projects" replace />} />
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
