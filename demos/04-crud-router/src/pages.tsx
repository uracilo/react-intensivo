import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  computeMetrics,
  createProject,
  createTask,
  deleteTask,
  getProject,
  getProjects,
  getTask,
  getTasks,
  getTasksByProject,
  updateTask,
} from './api/store'
import type { NewTask, Priority, TaskStatus } from './types'
import { PRIORITY_LABELS, STATUS_LABELS } from './types'

export function DashboardPage() {
  const tasks = getTasks()
  const metrics = computeMetrics(tasks)
  return (
    <>
      <section className="panel">
        <h2>Dashboard</h2>
        <div className="metrics">
          <div className="metric"><strong>{metrics.total}</strong><span>Total</span></div>
          <div className="metric"><strong>{metrics.todo}</strong><span>Por hacer</span></div>
          <div className="metric"><strong>{metrics.inProgress}</strong><span>En progreso</span></div>
          <div className="metric"><strong>{metrics.done}</strong><span>Hechas</span></div>
          <div className="metric"><strong>{metrics.overdue}</strong><span>Vencidas</span></div>
        </div>
      </section>
      <section className="panel">
        <h2>Accesos</h2>
        <div className="row">
          <Link className="btn primary" to="/tasks">Ver tareas</Link>
          <Link className="btn ghost" to="/projects">Ver proyectos</Link>
          <Link className="btn ghost" to="/tasks/new">Nueva tarea</Link>
        </div>
      </section>
    </>
  )
}

export function ProjectListPage() {
  const [projects, setProjects] = useState(getProjects())
  const [name, setName] = useState('')

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (name.trim().length < 3) return
    createProject(name.trim())
    setName('')
    setProjects(getProjects())
  }

  return (
    <section className="panel">
      <h2>Proyectos</h2>
      <form className="form" onSubmit={handleAdd} style={{ marginBottom: '1rem' }}>
        <label>
          Nuevo proyecto
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
        </label>
        <button className="btn primary" type="submit">Crear</button>
      </form>
      <ul className="list" data-testid="projects-list">
        {projects.map((p) => (
          <li key={p.id} className="list-item">
            <div>
              <strong>{p.name}</strong>
              <p className="meta">{getTasksByProject(p.id).length} tareas</p>
            </div>
            <Link to={`/projects/${p.id}`}>Abrir</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ProjectDetailPage() {
  const { id } = useParams()
  const project = getProject(Number(id))
  if (!project) return <p className="error-box">Proyecto no encontrado</p>
  const tasks = getTasksByProject(project.id)
  return (
    <section className="panel">
      <h2>{project.name}</h2>
      <p className="meta">Owner #{project.ownerId}</p>
      <ul className="list" style={{ marginTop: '1rem' }}>
        {tasks.map((t) => (
          <li key={t.id} className="list-item">
            <span>{t.title}</span>
            <Link to={`/tasks/${t.id}`}>Detalle</Link>
          </li>
        ))}
      </ul>
      {tasks.length === 0 && <p className="empty">Sin tareas en este proyecto.</p>}
    </section>
  )
}

export function TaskListPage() {
  const [status, setStatus] = useState('all')
  const tasks = useMemo(() => getTasks(status), [status])

  return (
    <section className="panel">
      <div className="list-header row" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Tareas</h2>
        <Link className="btn primary" to="/tasks/new">Nueva</Link>
      </div>
      <label>
        Estado{' '}
        <select data-testid="status-filter" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Todos</option>
          <option value="TODO">Por hacer</option>
          <option value="IN_PROGRESS">En progreso</option>
          <option value="DONE">Hecho</option>
        </select>
      </label>
      <ul className="list" style={{ marginTop: '1rem' }}>
        {tasks.map((t) => (
          <li key={t.id} className="list-item">
            <div>
              <strong>{t.title}</strong>
              <div className="badges" style={{ marginTop: 6 }}>
                <span className={`badge ${t.status}`}>{STATUS_LABELS[t.status]}</span>
                <span className={`badge ${t.priority}`}>{PRIORITY_LABELS[t.priority]}</span>
              </div>
            </div>
            <Link to={`/tasks/${t.id}`}>Abrir</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function TaskFormFields({
  initial,
  onSubmit,
}: {
  initial?: Partial<NewTask>
  onSubmit: (data: NewTask) => void
}) {
  const projects = getProjects()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? 'TODO')
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'MEDIUM')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? new Date().toISOString().slice(0, 10))
  const [projectId, setProjectId] = useState(initial?.projectId ?? projects[0]?.id ?? 1)
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (trimmed.length < 3 || trimmed.length > 120) {
      setError('Título: 3–120 caracteres')
      return
    }
    if (!dueDate || ( !initial && dueDate < new Date().toISOString().slice(0, 10))) {
      setError('Fecha inválida')
      return
    }
    onSubmit({
      title: trimmed,
      description: description.trim(),
      status,
      priority,
      dueDate,
      projectId,
      assigneeId: initial?.assigneeId ?? null,
    })
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <div className="error-box">{error}</div>}
      <label>Título<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
      <label>Descripción<textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></label>
      <div className="row">
        <label style={{ flex: 1 }}>Estado
          <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
            <option value="TODO">Por hacer</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="DONE">Hecho</option>
          </select>
        </label>
        <label style={{ flex: 1 }}>Prioridad
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            <option value="HIGH">Alta</option>
            <option value="MEDIUM">Media</option>
            <option value="LOW">Baja</option>
          </select>
        </label>
        <label style={{ flex: 1 }}>Fecha
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>
        <label style={{ flex: 1 }}>Proyecto
          <select value={projectId} onChange={(e) => setProjectId(Number(e.target.value))}>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
      </div>
      <button className="btn primary" type="submit">Guardar</button>
    </form>
  )
}

export function NewTaskPage() {
  const navigate = useNavigate()
  return (
    <section className="panel">
      <h2>Nueva tarea</h2>
      <TaskFormFields
        onSubmit={(data) => {
          const task = createTask(data.projectId, data)
          navigate(`/tasks/${task.id}`)
        }}
      />
    </section>
  )
}

export function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const task = getTask(Number(id))
  if (!task) return <p className="error-box">Tarea no encontrada</p>

  return (
    <section className="panel">
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <div className="badges" style={{ margin: '0.75rem 0' }}>
        <span className={`badge ${task.status}`}>{STATUS_LABELS[task.status]}</span>
        <span className={`badge ${task.priority}`}>{PRIORITY_LABELS[task.priority]}</span>
      </div>
      <p className="meta">Vence {task.dueDate}</p>
      <div className="row" style={{ marginTop: '1rem' }}>
        <Link className="btn ghost" to={`/tasks/${task.id}/edit`}>Editar</Link>
        <button
          type="button"
          className="btn danger"
          data-testid="delete-confirm"
          onClick={() => {
            deleteTask(task.id)
            navigate('/tasks')
          }}
        >
          Borrar
        </button>
      </div>
    </section>
  )
}

export function EditTaskPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const task = getTask(Number(id))
  if (!task) return <p className="error-box">Tarea no encontrada</p>

  return (
    <section className="panel">
      <h2>Editar tarea</h2>
      <TaskFormFields
        initial={task}
        onSubmit={(data) => {
          updateTask(task.id, data)
          navigate(`/tasks/${task.id}`)
        }}
      />
    </section>
  )
}

export function NotFoundPage() {
  return (
    <section className="panel">
      <h2>404</h2>
      <p className="empty">Ruta no encontrada.</p>
      <Link to="/">Volver al dashboard</Link>
    </section>
  )
}
