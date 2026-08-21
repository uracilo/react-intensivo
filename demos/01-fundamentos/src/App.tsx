import { MOCK_TASKS } from './types'
import { TaskGrid } from './TaskGrid'

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">TF</span>
          <div>
            <h1>TaskFlow</h1>
            <p className="tagline">Día 1 — Componentes y TypeScript (UI estática)</p>
          </div>
        </div>
      </header>

      <section className="panel">
        <h2>Tareas seed ({MOCK_TASKS.length})</h2>
        <TaskGrid tasks={MOCK_TASKS} />
      </section>
    </div>
  )
}
