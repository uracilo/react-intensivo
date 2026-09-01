import { API_URL } from '../types'

const STORAGE_KEY = 'taskflow-api-url'

export function getApiBaseUrl(): string {
  return localStorage.getItem(STORAGE_KEY) || API_URL
}

export function setApiBaseUrl(url: string) {
  const normalized = url.trim().replace(/\/$/, '')
  localStorage.setItem(STORAGE_KEY, normalized)
}

export function clearApiBaseUrl() {
  localStorage.removeItem(STORAGE_KEY)
}

/** Permite ?api=https://... en la URL al cargar la app */
export function applyApiUrlFromQuery() {
  const params = new URLSearchParams(window.location.search)
  const fromQuery = params.get('api')
  if (fromQuery) setApiBaseUrl(fromQuery)
}
