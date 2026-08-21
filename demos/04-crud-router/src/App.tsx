import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './Layout'
import {
  DashboardPage,
  EditTaskPage,
  NewTaskPage,
  NotFoundPage,
  ProjectDetailPage,
  ProjectListPage,
  TaskDetailPage,
  TaskListPage,
} from './pages'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/tasks/new" element={<NewTaskPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/home" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
