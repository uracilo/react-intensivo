import { useEffect, useState } from 'react'

interface UseFetchResult<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
}

export function useFetch<T>(url: string | null): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(url))

  useEffect(() => {
    if (!url) {
      setData(null)
      setError(null)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<T>
      })
      .then((json) => {
        if (!controller.signal.aborted) setData(json)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err : new Error('Fetch failed'))
        setData(null)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [url])

  return { data, error, isLoading }
}
