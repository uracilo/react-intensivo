import type { Task } from './types'
import { PRIORITY_LABELS, STATUS_LABELS, projectName, MOCK_PROJECTS } from './types'

interface TaskCardProps {
  task: Task
  onDelete?: (id: number) => void
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  return (
    <article className="card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="badges">
        <span className={`badge ${task.status}`}>{STATUS_LABELS[task.status]}</span>
        <span className={`badge ${task.priority}`}>{PRIORITY_LABELS[task.priority]}</span>
      </div>
      <p className="meta">
        {projectName(MOCK_PROJECTS, task.projectId)} · vence {task.dueDate}
      </p>
      {onDelete && (
        <button type="button" className="btn danger" onClick={() => onDelete(task.id)}>
          Borrar
        </button>
      )}
    </article>
  )
}
