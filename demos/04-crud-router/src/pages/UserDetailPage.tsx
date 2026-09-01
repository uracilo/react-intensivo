import DeleteIcon from '@mui/icons-material/Delete'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteUser, fetchUser } from '../api/usersApi'
import { useFetch } from '../hooks/useFetch'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const userId = Number(id)
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const { data, error, isLoading } = useFetch(
    () => fetchUser(userId),
    [userId],
  )

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteUser(userId)
      setFeedback('Usuario eliminado')
      setTimeout(() => navigate('/users'), 800)
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Error al eliminar')
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
      <Button onClick={() => navigate(-1)}>← Volver</Button>
      {feedback && <Alert severity="success">{feedback}</Alert>}
      <Typography variant="h5">{data.name}</Typography>
      <Typography>{data.email}</Typography>
      <Typography color="text.secondary">Rol: {data.role}</Typography>
      <Box>
        <IconButton
          color="error"
          aria-label="Eliminar usuario"
          onClick={handleDelete}
          disabled={deleting}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Stack>
  )
}
