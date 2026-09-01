import { useEffect, useState } from 'react'

interface UseFetchResult<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  refetch: () => void
}

export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tick, setTick] = useState(0)

  const refetch = () => setTick((t) => t + 1)

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    fetcher()
      .then((result) => {
        if (!controller.signal.aborted) setData(result)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps])

  return { data, error, isLoading, refetch }
}
