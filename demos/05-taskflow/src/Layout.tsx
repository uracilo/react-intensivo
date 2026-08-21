import { Link, NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './auth'

export function RequireAuth() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

export function Layout() {
  const { user, logout } = useAuth()
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/dashboard" className="brand" style={{ color: 'inherit', textDecoration: 'none' }}>
          <span className="brand-mark">TF</span>
          <div>
            <h1>TaskFlow</h1>
            <p className="tagline">Día 5 — JWT + API · {user?.username}</p>
          </div>
        </Link>
        <nav className="nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/tasks">Tareas</NavLink>
          <button type="button" className="btn ghost" onClick={logout}>
            Salir
          </button>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
