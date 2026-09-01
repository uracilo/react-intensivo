import AddIcon from '@mui/icons-material/Add'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import { fetchUsers } from '../api/usersApi'
import { useFetch } from '../hooks/useFetch'

export function UserListPage() {
  const { data, error, isLoading } = useFetch(fetchUsers)

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        {error.message} — ¿Está corriendo <code>npm run api</code>?
      </Alert>
    )
  }

  if (!data?.length) {
    return <Typography color="text.secondary">No hay usuarios.</Typography>
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Usuarios</Typography>
        <Button
          component={RouterLink}
          to="/users/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Nuevo
        </Button>
      </Stack>
      <Stack spacing={1}>
        {data.map((user) => (
          <Card
            key={user.id}
            component={RouterLink}
            to={`/users/${user.id}`}
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            <CardContent>
              <Typography variant="subtitle1">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email} · {user.role}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}
