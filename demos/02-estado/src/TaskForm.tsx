import { useState, type FormEvent } from 'react'
import { MOCK_PROJECTS, type NewTask, type Priority } from './types'

interface TaskFormProps {
  onAdd: (data: NewTask) => void
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [dueDate, setDueDate] = useState(todayISO())
  const [projectId, setProjectId] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const next: Record<string, string> = {}
    const trimmed = title.trim()
    if (trimmed.length < 3) next.title = 'Mínimo 3 caracteres'
    if (trimmed.length > 120) next.title = 'Máximo 120 caracteres'
    if (!dueDate) next.dueDate = 'La fecha es obligatoria'
    else if (dueDate < todayISO()) next.dueDate = 'La fecha no puede ser pasada'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    onAdd({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      projectId,
      assigneeId: null,
      status: 'TODO',
    })
    setTitle('')
    setDescription('')
    setPriority('MEDIUM')
    setDueDate(todayISO())
    setErrors({})
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label>
        Título
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </label>
      <label>
        Descripción
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <div className="row">
        <label style={{ flex: 1 }}>
          Prioridad
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            <option value="HIGH">Alta</option>
            <option value="MEDIUM">Media</option>
            <option value="LOW">Baja</option>
          </select>
        </label>
        <label style={{ flex: 1 }}>
          Fecha límite
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
        </label>
        <label style={{ flex: 1 }}>
          Proyecto
          <select value={projectId} onChange={(e) => setProjectId(Number(e.target.value))}>
            {MOCK_PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit" className="btn primary">
        Agregar tarea
      </button>
    </form>
  )
}
