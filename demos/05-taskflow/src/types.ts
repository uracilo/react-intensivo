export interface User {
  id: number
  name: string
  email: string
  role: string
}

export type NewUser = Omit<User, 'id'>

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export type PaletteMode = 'light' | 'dark'
