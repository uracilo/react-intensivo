import { useEffect, useState } from 'react'
import { fetchTasks, type TaskFilters } from '../api/tasksApi'
import type { Task } from '../types'

export function useTasks(filters: TaskFilters) {
  const [data, setData] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchTasks(filters)
      .then((tasks) => {
        if (!cancelled) setData(tasks)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [filters.status, filters.priority, filters.search])

  return { data, loading, error }
}
