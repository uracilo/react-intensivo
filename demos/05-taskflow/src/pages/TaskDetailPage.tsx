import DeleteIcon from '@mui/icons-material/Delete'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteTask, fetchTask, patchTaskStatus } from '../api/taskflowApi'
import { useToast } from '../context/ToastContext'
import type { TaskStatus } from '../types'
import { useFetch } from '../hooks/useFetch'

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const taskId = Number(id)
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [deleting, setDeleting] = useState(false)

  const { data, error, isLoading, refetch } = useFetch(
    () => fetchTask(taskId),
    [taskId],
  )

  async function handleStatusChange(status: TaskStatus) {
    try {
      await patchTaskStatus(taskId, status)
      showToast(`Estado: ${status}`)
      refetch()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al actualizar')
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteTask(taskId)
      showToast('Tarea eliminada')
      navigate('/tasks')
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
    return <Alert severity="error">{error?.message ?? 'No encontrada'}</Alert>
  }

  return (
    <Stack spacing={2} maxWidth={520}>
      <Button onClick={() => navigate(-1)} aria-label="Volver atrás">
        ← Volver
      </Button>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5">{data.title}</Typography>
            <Typography>{data.description}</Typography>
            <Stack direction="row" spacing={1}>
              <Chip label={data.status} />
              <Chip label={data.priority} variant="outlined" />
              <Chip label={`Proyecto ${data.projectId}`} variant="outlined" />
            </Stack>
            {data.dueDate && (
              <Typography variant="body2" color="text.secondary">
                Vence: {data.dueDate}
              </Typography>
            )}
            <TextField
              select
              label="Cambiar estado"
              value={data.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              size="small"
              sx={{ maxWidth: 240 }}
            >
              <MenuItem value="TODO">TODO</MenuItem>
              <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
              <MenuItem value="DONE">DONE</MenuItem>
            </TextField>
            <Box>
              <IconButton
                color="error"
                aria-label="Eliminar tarea"
                onClick={handleDelete}
                disabled={deleting}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
