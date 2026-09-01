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
import { JSONPLACEHOLDER, type User } from '../types'

const PAGE_SIZE = 3

export function UsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const url = `${JSONPLACEHOLDER}/users?_page=${page}&_limit=${PAGE_SIZE}`
  const { data, error, isLoading } = useFetch<User[]>(url)

  const filtered = useMemo(() => {
    if (!data) return []
    const q = debouncedSearch.toLowerCase()
    if (!q) return data
    return data.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    )
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
        <SearchField value={search} onChange={setSearch} />
        <Typography color="text.secondary">No hay usuarios.</Typography>
      </Stack>
    )
  }

  return (
    <Stack spacing={2}>
      <SearchField value={search} onChange={setSearch} />
      {filtered.map((user) => (
        <Box key={user.id} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="subtitle1">{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      ))}
      <Pagination
        count={4}
        page={page}
        onChange={(_, p) => setPage(p)}
        color="primary"
      />
    </Stack>
  )
}

function SearchField({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <TextField
      fullWidth
      label="Buscar usuarios"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  )
}
