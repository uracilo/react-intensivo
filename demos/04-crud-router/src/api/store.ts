import type { NewTask, Project, Task } from '../types'
import { MOCK_PROJECTS, MOCK_TASKS } from '../types'

const TASKS_KEY = 'tf-demo04-tasks'
const PROJECTS_KEY = 'tf-demo04-projects'

function loadTasks(): Task[] {
  const raw = localStorage.getItem(TASKS_KEY)
  if (raw) return JSON.parse(raw) as Task[]
  localStorage.setItem(TASKS_KEY, JSON.stringify(MOCK_TASKS))
  return [...MOCK_TASKS]
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

function loadProjects(): Project[] {
  const raw = localStorage.getItem(PROJECTS_KEY)
  if (raw) return JSON.parse(raw) as Project[]
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(MOCK_PROJECTS))
  return [...MOCK_PROJECTS]
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

export function getProjects(): Project[] {
  return loadProjects()
}

export function getProject(id: number): Project | undefined {
  return loadProjects().find((p) => p.id === id)
}

export function getTasks(status?: string): Task[] {
  const all = loadTasks()
  return status && status !== 'all' ? all.filter((t) => t.status === status) : all
}

export function getTasksByProject(projectId: number): Task[] {
  return loadTasks().filter((t) => t.projectId === projectId)
}

export function getTask(id: number): Task | undefined {
  return loadTasks().find((t) => t.id === id)
}

export function createTask(projectId: number, data: NewTask): Task {
  const all = loadTasks()
  const id = Math.max(0, ...all.map((t) => t.id)) + 1
  const task: Task = { ...data, id, projectId }
  saveTasks([task, ...all])
  return task
}

export function updateTask(id: number, data: Partial<NewTask>): Task {
  const all = loadTasks()
  const idx = all.findIndex((t) => t.id === id)
  if (idx === -1) throw new Error('Tarea no encontrada')
  all[idx] = { ...all[idx], ...data }
  saveTasks(all)
  return all[idx]
}

export function deleteTask(id: number): void {
  saveTasks(loadTasks().filter((t) => t.id !== id))
}

export function createProject(name: string): Project {
  const all = loadProjects()
  const id = Math.max(0, ...all.map((p) => p.id)) + 1
  const project: Project = { id, name, ownerId: 1 }
  saveProjects([...all, project])
  return project
}

export function computeMetrics(tasks: Task[]) {
  return {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'TODO').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    done: tasks.filter((t) => t.status === 'DONE').length,
    overdue: tasks.filter((t) => t.status !== 'DONE' && t.dueDate < new Date().toISOString().slice(0, 10)).length,
  }
}
