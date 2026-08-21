export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  dueDate: string
  projectId: number
  assigneeId: number | null
}

export interface Project {
  id: number
  name: string
  ownerId: number
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'Por hacer',
  IN_PROGRESS: 'En progreso',
  DONE: 'Hecho',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  HIGH: 'Alta',
  MEDIUM: 'Media',
  LOW: 'Baja',
}

export const MOCK_PROJECTS: Project[] = [
  { id: 1, name: 'Plataforma TaskFlow', ownerId: 1 },
  { id: 2, name: 'App Móvil', ownerId: 2 },
  { id: 3, name: 'Migración Legacy', ownerId: 1 },
]

export const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: 'Definir modelo de dominio Task',
    description: 'Implementar Task.crear() con validaciones de título y fecha.',
    status: 'DONE',
    priority: 'HIGH',
    dueDate: '2026-08-15',
    projectId: 1,
    assigneeId: 1,
  },
  {
    id: 2,
    title: 'Endpoints GET /projects y /tasks',
    description: 'Exponer lectura REST con MockMvc y Postman.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2026-08-20',
    projectId: 1,
    assigneeId: 2,
  },
  {
    id: 3,
    title: 'Pantalla de login en React',
    description: 'Formulario JWT contra POST /auth/login.',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '2026-08-25',
    projectId: 1,
    assigneeId: null,
  },
  {
    id: 4,
    title: 'Integrar push notifications',
    description: 'Spike de Firebase para alertas de tareas asignadas.',
    status: 'TODO',
    priority: 'LOW',
    dueDate: '2026-09-01',
    projectId: 2,
    assigneeId: 2,
  },
  {
    id: 5,
    title: 'Migrar esquema legacy a JPA',
    description: 'Mapear entidades antiguas del cliente bancario.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2026-08-18',
    projectId: 3,
    assigneeId: 1,
  },
]

export function projectName(projects: Project[], id: number): string {
  return projects.find((p) => p.id === id)?.name ?? `Proyecto #${id}`
}
