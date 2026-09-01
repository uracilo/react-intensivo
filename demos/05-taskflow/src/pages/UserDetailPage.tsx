import DeleteIcon from '@mui/icons-material/Delete'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteUser, fetchUser } from '../api/usersApi'
import { useToast } from '../context/ToastContext'
import { useFetch } from '../hooks/useFetch'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const userId = Number(id)
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [deleting, setDeleting] = useState(false)

  const { data, error, isLoading } = useFetch(
    () => fetchUser(userId),
    [userId],
  )

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteUser(userId)
      showToast('Usuario eliminado')
      navigate('/users')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al eliminar')
    } finally {
      setDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !data) {
    return <Alert severity="error">{error?.message ?? 'No encontrado'}</Alert>
  }

  return (
    <Stack spacing={2} maxWidth={480}>
      <Button onClick={() => navigate(-1)} aria-label="Volver atrás">
        ← Volver
      </Button>
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="start">
            <Box>
              <Typography variant="h5">{data.name}</Typography>
              <Typography sx={{ mt: 1 }}>{data.email}</Typography>
              <Typography color="text.secondary">Rol: {data.role}</Typography>
            </Box>
            <IconButton
              color="error"
              aria-label="Eliminar usuario"
              onClick={handleDelete}
              disabled={deleting}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
