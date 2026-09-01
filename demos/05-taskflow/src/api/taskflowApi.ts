import axios from 'axios'
import { apiClient } from './client'
import type { NewProject, NewTask, Project, Task, TaskStatus } from '../types'

function handleError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status ?? 'network'
    const detail =
      typeof err.response?.data === 'object' && err.response.data !== null
        ? JSON.stringify(err.response.data)
        : err.message
    throw new Error(`HTTP ${status}: ${detail}`)
  }
  throw err instanceof Error ? err : new Error('Unknown error')
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const { data } = await apiClient.get<Project[]>('/projects')
    return data
  } catch (err) {
    handleError(err)
  }
}

export async function fetchProject(id: number): Promise<Project> {
  try {
    const { data } = await apiClient.get<Project>(`/projects/${id}`)
    return data
  } catch (err) {
    handleError(err)
  }
}

export async function createProject(body: NewProject): Promise<Project> {
  try {
    const { data } = await apiClient.post<Project>('/projects', body)
    return data
  } catch (err) {
    handleError(err)
  }
}

export async function deleteProject(id: number): Promise<void> {
  try {
    await apiClient.delete(`/projects/${id}`)
  } catch (err) {
    handleError(err)
  }
}

export async function fetchProjectTasks(projectId: number): Promise<Task[]> {
  try {
    const { data } = await apiClient.get<Task[]>(`/projects/${projectId}/tasks`)
    return data
  } catch (err) {
    handleError(err)
  }
}

export async function fetchTasks(params?: {
  status?: TaskStatus
  priority?: string
}): Promise<Task[]> {
  try {
    const { data } = await apiClient.get<Task[]>('/tasks', { params })
    return data
  } catch (err) {
    handleError(err)
  }
}

export async function fetchTask(id: number): Promise<Task> {
  try {
    const { data } = await apiClient.get<Task>(`/tasks/${id}`)
    return data
  } catch (err) {
    handleError(err)
  }
}

export async function createTask(projectId: number, body: NewTask): Promise<Task> {
  try {
    const { data } = await apiClient.post<Task>(`/projects/${projectId}/tasks`, body)
    return data
  } catch (err) {
    handleError(err)
  }
}

export async function deleteTask(id: number): Promise<void> {
  try {
    await apiClient.delete(`/tasks/${id}`)
  } catch (err) {
    handleError(err)
  }
}

export async function patchTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  try {
    const { data } = await apiClient.patch<Task>(`/tasks/${id}/status`, { status })
    return data
  } catch (err) {
    handleError(err)
  }
}

export async function fetchInfo(): Promise<Record<string, string>> {
  try {
    const { data } = await apiClient.get<Record<string, string>>('/info')
    return data
  } catch (err) {
    handleError(err)
  }
}
