import { API_URL } from '../types'

const STORAGE_KEY = 'taskflow-api-url-v2'
const LEGACY_STORAGE_KEY = 'taskflow-api-url'

function isLegacyApiUrl(url: string): boolean {
  const normalized = url.trim().replace(/\/$/, '')
  if (normalized.includes('52.87.135.237')) return true
  if (window.location.protocol === 'https:' && normalized.startsWith('http://')) return true
  return false
}

export function getApiBaseUrl(): string {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && !isLegacyApiUrl(stored)) return stored
  return API_URL
}

export function setApiBaseUrl(url: string) {
  const normalized = url.trim().replace(/\/$/, '')
  localStorage.setItem(STORAGE_KEY, normalized)
}

export function clearApiBaseUrl() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(LEGACY_STORAGE_KEY)
}

function migrateLegacyStorage() {
  localStorage.removeItem(LEGACY_STORAGE_KEY)
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && isLegacyApiUrl(stored)) {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function applyApiUrlFromQuery() {
  const params = new URLSearchParams(window.location.search)
  const fromQuery = params.get('api')
  if (fromQuery) setApiBaseUrl(fromQuery)
}

export function initApiUrl() {
  migrateLegacyStorage()
  applyApiUrlFromQuery()
}
