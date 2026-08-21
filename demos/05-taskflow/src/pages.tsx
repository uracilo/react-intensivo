import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  computeMetrics,
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from './api/taskflowApi'
import { getProjects } from './api/taskflowApi'
import type { NewTask, Priority, Project, Task, TaskStatus } from './types'
import { PRIORITY_LABELS, STATUS_LABELS } from './types'

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTasks().then(setTasks).finally(() => setLoading(false))
  }, [])

  const metrics = computeMetrics(tasks)

  return (
    <section className="panel">
      <h2>Dashboard</h2>
      {loading ? (
        <p className="status-msg">Cargando…</p>
      ) : (
        <div className="metrics">
          <div className="metric"><strong>{metrics.total}</strong><span>Total</span></div>
          <div className="metric"><strong>{metrics.todo}</strong><span>Por hacer</span></div>
          <div className="metric"><strong>{metrics.inProgress}</strong><span>En progreso</span></div>
          <div className="metric"><strong>{metrics.done}</strong><span>Hechas</span></div>
          <div className="metric"><strong>{metrics.overdue}</strong><span>Vencidas</span></div>
        </div>
      )}
      <div className="row" style={{ marginTop: '1rem' }}>
        <Link className="btn primary" to="/tasks">Ver tareas</Link>
        <Link className="btn ghost" to="/tasks/new">Nueva tarea</Link>
      </div>
    </section>
  )
}

export function TaskListPage() {
  const [status, setStatus] = useState('all')
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getTasks(status).then(setTasks).finally(() => setLoading(false))
  }, [status])

  return (
    <section className="panel">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
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
      {loading && <p className="status-msg">Cargando…</p>}
      {!loading && (
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
      )}
    </section>
  )
}

function TaskEditor({
  initial,
  onSave,
}: {
  initial?: Partial<NewTask> & { projectId?: number }
  onSave: (projectId: number, data: NewTask) => Promise<void>
}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? 'TODO')
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'MEDIUM')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? new Date().toISOString().slice(0, 10))
  const [projectId, setProjectId] = useState(initial?.projectId ?? 1)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getProjects().then((list) => {
      setProjects(list)
      if (!initial?.projectId && list[0]) setProjectId(list[0].id)
    })
  }, [initial?.projectId])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (trimmed.length < 3 || trimmed.length > 120) {
      setError('Título: 3–120 caracteres')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave(projectId, {
        title: trimmed,
        description: description.trim(),
        status,
        priority,
        dueDate,
        projectId,
        assigneeId: initial?.assigneeId ?? null,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
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
      <button className="btn primary" type="submit" disabled={saving}>
        {saving ? 'Guardando…' : 'Guardar'}
      </button>
    </form>
  )
}

export function NewTaskPage() {
  const navigate = useNavigate()
  return (
    <section className="panel">
      <h2>Nueva tarea</h2>
      <TaskEditor
        onSave={async (projectId, data) => {
          const task = await createTask(projectId, data)
          navigate(`/tasks/${task.id}`)
        }}
      />
    </section>
  )
}

export function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState<Task | null | undefined>(undefined)

  useEffect(() => {
    getTask(Number(id)).then((t) => setTask(t ?? null))
  }, [id])

  if (task === undefined) return <p className="status-msg">Cargando…</p>
  if (!task) return <p className="error-box">Tarea no encontrada</p>

  return (
    <section className="panel">
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <div className="badges" style={{ margin: '0.75rem 0' }}>
        <span className={`badge ${task.status}`}>{STATUS_LABELS[task.status]}</span>
        <span className={`badge ${task.priority}`}>{PRIORITY_LABELS[task.priority]}</span>
      </div>
      <div className="row">
        <Link className="btn ghost" to={`/tasks/${task.id}/edit`}>Editar</Link>
        <button
          type="button"
          className="btn danger"
          data-testid="delete-confirm"
          onClick={async () => {
            await deleteTask(task.id)
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
  const [task, setTask] = useState<Task | null | undefined>(undefined)

  useEffect(() => {
    getTask(Number(id)).then((t) => setTask(t ?? null))
  }, [id])

  if (task === undefined) return <p className="status-msg">Cargando…</p>
  if (!task) return <p className="error-box">Tarea no encontrada</p>

  return (
    <section className="panel">
      <h2>Editar tarea</h2>
      <TaskEditor
        initial={task}
        onSave={async (_projectId, data) => {
          await updateTask(task.id, data)
          navigate(`/tasks/${task.id}`)
        }}
      />
    </section>
  )
}
