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

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
      if (window.location.protocol === 'https:') {
        return 'No se puede conectar: la demo en HTTPS no puede llamar a la API HTTP. Ejecutá npm run dev:05 en tu máquina.'
      }
      return `No se pudo conectar con la API (${API_URL}). Verificá que el servidor esté activo.`
    }
    if (err.response?.status === 401) {
      return 'Usuario o contraseña incorrectos.'
    }
    const status = err.response?.status ?? 'network'
    return `Error HTTP ${status}: ${err.message}`
  }
  return err instanceof Error ? err.message : 'Error desconocido'
}

export async function loginRequest(username: string, password: string): Promise<string> {
  const { data } = await axios.post<{ token: string }>(`${API_URL}/auth/login`, {
    username: username.trim(),
    password,
  })
  return data.token
}
