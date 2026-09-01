import axios from 'axios'
import type { NewUser, User } from '../types'
import { API_URL } from '../types'

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

function handleAxiosError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status ?? 'network'
    throw new Error(`HTTP ${status}: ${err.message}`)
  }
  throw err instanceof Error ? err : new Error('Unknown error')
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const { data } = await client.get<User[]>('/users')
    return data
  } catch (err) {
    handleAxiosError(err)
  }
}

export async function fetchUser(id: number): Promise<User> {
  try {
    const { data } = await client.get<User>(`/users/${id}`)
    return data
  } catch (err) {
    handleAxiosError(err)
  }
}

export async function createUser(user: NewUser): Promise<User> {
  try {
    const { data } = await client.post<User>('/users', user)
    return data
  } catch (err) {
    handleAxiosError(err)
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await client.delete(`/users/${id}`)
  } catch (err) {
    handleAxiosError(err)
  }
}
