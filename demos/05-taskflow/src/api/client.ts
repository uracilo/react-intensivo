import axios from 'axios'
import { API_URL, TOKEN_KEY } from '../types'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export async function loginRequest(username: string, password: string): Promise<string> {
  const { data } = await axios.post<{ token: string }>(`${API_URL}/auth/login`, {
    username,
    password,
  })
  return data.token
}
