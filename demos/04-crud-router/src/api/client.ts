import axios from 'axios'
import { getApiBaseUrl } from '../config/apiUrl'
import { TOKEN_KEY } from '../types'

export const apiClient = axios.create({
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl()
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
  const api = getApiBaseUrl()
  if (axios.isAxiosError(err)) {
    if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
      if (api.startsWith('http://') && window.location.protocol === 'https:') {
        return `No se pudo conectar. GitHub Pages (HTTPS) no puede llamar a una API HTTP (${api}). Usá una URL HTTPS válida abajo o desplegá el proxy (proxy/README.md).`
      }
      return `No se pudo conectar con la API (${api}). Verificá la URL y que el servidor esté activo.`
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
  const { data } = await axios.post<{ token: string }>(
    `${getApiBaseUrl()}/auth/login`,
    { username: username.trim(), password },
  )
  return data.token
}
