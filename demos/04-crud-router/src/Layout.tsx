import { Link, NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand" style={{ color: 'inherit', textDecoration: 'none' }}>
          <span className="brand-mark">TF</span>
          <div>
            <h1>TaskFlow</h1>
            <p className="tagline">Día 4 — Router + CRUD</p>
          </div>
        </Link>
        <nav className="nav">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/projects">Proyectos</NavLink>
          <NavLink to="/tasks">Tareas</NavLink>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
