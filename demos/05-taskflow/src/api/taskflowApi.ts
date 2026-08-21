import type { NewTask, Project, Task } from '../types'
import { MOCK_PROJECTS, MOCK_TASKS } from '../types'
import { getToken, isApiMode, request } from './client'

const TASKS_KEY = 'taskflow-tasks'
const PROJECTS_KEY = 'taskflow-projects'

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

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T | Promise<T>): Promise<T> {
  if (!isApiMode() || !getToken()) return fallback()
  try {
    return await fn()
  } catch {
    return fallback()
  }
}

export async function getProjects(): Promise<Project[]> {
  return tryApi(
    () => request<Project[]>('/projects'),
    () => loadProjects(),
  )
}

export async function getTasks(status?: string): Promise<Task[]> {
  return tryApi(
    () => request<Task[]>(status && status !== 'all' ? `/tasks?status=${status}` : '/tasks'),
    () => {
      const all = loadTasks()
      return status && status !== 'all' ? all.filter((t) => t.status === status) : all
    },
  )
}

export async function getTask(id: number): Promise<Task | undefined> {
  return tryApi(
    () => request<Task>(`/tasks/${id}`),
    () => loadTasks().find((t) => t.id === id),
  )
}

export async function createTask(projectId: number, data: NewTask): Promise<Task> {
  return tryApi(
    () => request<Task>(`/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify(data) }),
    () => {
      const all = loadTasks()
      const id = Math.max(0, ...all.map((t) => t.id)) + 1
      const task: Task = { ...data, id, projectId }
      saveTasks([task, ...all])
      return task
    },
  )
}

export async function updateTask(id: number, data: Partial<NewTask>): Promise<Task> {
  return tryApi(
    () => request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    () => {
      const all = loadTasks()
      const idx = all.findIndex((t) => t.id === id)
      if (idx === -1) throw new Error('Tarea no encontrada')
      all[idx] = { ...all[idx], ...data }
      saveTasks(all)
      return all[idx]
    },
  )
}

export async function deleteTask(id: number): Promise<void> {
  return tryApi(
    () => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
    () => {
      saveTasks(loadTasks().filter((t) => t.id !== id))
    },
  )
}

export function computeMetrics(tasks: Task[]) {
  const today = new Date().toISOString().slice(0, 10)
  return {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'TODO').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    done: tasks.filter((t) => t.status === 'DONE').length,
    overdue: tasks.filter((t) => t.status !== 'DONE' && t.dueDate < today).length,
  }
}
