import SearchIcon from '@mui/icons-material/Search'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { useFetch } from '../hooks/useFetch'
import { JSONPLACEHOLDER, type Post } from '../types'

const PAGE_SIZE = 5

export function PostsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const url = `${JSONPLACEHOLDER}/posts?_page=${page}&_limit=${PAGE_SIZE}`
  const { data, error, isLoading } = useFetch<Post[]>(url)

  const filtered = useMemo(() => {
    if (!data) return []
    const q = debouncedSearch.toLowerCase()
    if (!q) return data
    return data.filter((p) => p.title.toLowerCase().includes(q))
  }, [data, debouncedSearch])

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>
  }

  if (!filtered.length) {
    return (
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Buscar posts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Typography color="text.secondary">No hay posts.</Typography>
      </Stack>
    )
  }

  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Buscar posts"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      {filtered.map((post) => (
        <Box key={post.id} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="subtitle1">{post.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {post.body}
          </Typography>
        </Box>
      ))}
      <Pagination
        count={20}
        page={page}
        onChange={(_, p) => setPage(p)}
        color="primary"
      />
    </Stack>
  )
}
