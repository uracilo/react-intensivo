export interface User {
  id: number
  name: string
  email: string
  username: string
}

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

export const JSONPLACEHOLDER = 'https://jsonplaceholder.typicode.com'
