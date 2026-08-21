import { useState } from 'react'
import type { Priority, TaskStatus } from './types'
import { useTasks } from './hooks/useTasks'
import { TaskCard } from './TaskCard'
import type { TaskFilters } from './api/tasksApi'

const initial: TaskFilters = { status: 'all', priority: 'all', search: '' }

export default function App() {
  const [filters, setFilters] = useState<TaskFilters>(initial)
  const { data, loading, error } = useTasks(filters)

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">TF</span>
          <div>
            <h1>TaskFlow</h1>
            <p className="tagline">Día 3 — fetch, useEffect y custom hooks</p>
          </div>
        </div>
      </header>

      <section className="panel">
        <h2>Filtros</h2>
        <div className="row">
          <label>
            Estado{' '}
            <select
              data-testid="status-filter"
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value as TaskStatus | 'all' }))
              }
            >
              <option value="all">Todos</option>
              <option value="TODO">Por hacer</option>
              <option value="IN_PROGRESS">En progreso</option>
              <option value="DONE">Hecho</option>
            </select>
          </label>
          <label>
            Prioridad{' '}
            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters((f) => ({ ...f, priority: e.target.value as Priority | 'all' }))
              }
            >
              <option value="all">Todas</option>
              <option value="HIGH">Alta</option>
              <option value="MEDIUM">Media</option>
              <option value="LOW">Baja</option>
            </select>
          </label>
          <label style={{ flex: 1 }}>
            Buscar{' '}
            <input
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="título o descripción"
            />
          </label>
        </div>
      </section>

      <section className="panel">
        <h2>Resultados</h2>
        {loading && <p className="status-msg">Cargando tareas…</p>}
        {error && <div className="error-box">{error}</div>}
        {!loading && !error && data.length === 0 && (
          <p className="empty">No hay tareas para estos filtros.</p>
        )}
        {!loading && !error && data.length > 0 && (
          <div className="grid">
            {data.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
