export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type Priority = 'LOW' | 'MED' | 'HIGH'
export type UserRole = 'USER' | 'ADMIN'

export interface Project {
  id: number
  name: string
  description?: string
  ownerId: number
  createdAt: string
}

export interface Task {
  id: number
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  projectId: number
  assigneeId?: number | null
  dueDate?: string
}

export interface NewTask {
  title: string
  description?: string
  priority: Priority
  assigneeId?: number | null
  dueDate?: string
}

export interface NewProject {
  name: string
  description?: string
}

export interface AuthResponse {
  token: string
}

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api' : 'https://d3ujwk09smrk9z.cloudfront.net')

export const TOKEN_KEY = 'taskflow-token'
