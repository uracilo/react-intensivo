import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth'
import { Layout, RequireAuth } from './Layout'
import { LoginPage } from './LoginPage'
import {
  DashboardPage,
  EditTaskPage,
  NewTaskPage,
  TaskDetailPage,
  TaskListPage,
} from './pages'

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tasks" element={<TaskListPage />} />
              <Route path="/tasks/new" element={<NewTaskPage />} />
              <Route path="/tasks/:id" element={<TaskDetailPage />} />
              <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
