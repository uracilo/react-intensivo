export interface User {
  id: number
  name: string
  role: string
  avatarUrl: string
}

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'Ana García',
    role: 'admin',
    avatarUrl: 'https://i.pravatar.cc/150?u=ana',
  },
  {
    id: 2,
    name: 'Bruno López',
    role: 'developer',
    avatarUrl: 'https://i.pravatar.cc/150?u=bruno',
  },
  {
    id: 3,
    name: 'Carla Ruiz',
    role: 'designer',
    avatarUrl: 'https://i.pravatar.cc/150?u=carla',
  },
  {
    id: 4,
    name: 'Diego Mora',
    role: 'admin',
    avatarUrl: 'https://i.pravatar.cc/150?u=diego',
  },
  {
    id: 5,
    name: 'Elena Paz',
    role: 'qa',
    avatarUrl: 'https://i.pravatar.cc/150?u=elena',
  },
]
