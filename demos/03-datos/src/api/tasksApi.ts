import type { Priority, Task, TaskStatus } from '../types'
import { MOCK_TASKS } from '../types'

export type TaskFilters = {
  status: TaskStatus | 'all'
  priority: Priority | 'all'
  search: string
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Simula GET /tasks?status=&priority= con latencia de red */
export async function fetchTasks(filters: TaskFilters): Promise<Task[]> {
  await delay(400)
  let result = [...MOCK_TASKS]
  if (filters.status !== 'all') {
    result = result.filter((t) => t.status === filters.status)
  }
  if (filters.priority !== 'all') {
    result = result.filter((t) => t.priority === filters.priority)
  }
  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase()
    result = result.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    )
  }
  return result
}
