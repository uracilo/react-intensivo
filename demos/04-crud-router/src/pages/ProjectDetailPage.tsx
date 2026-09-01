import DeleteIcon from '@mui/icons-material/Delete'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { fetchProject, fetchProjectTasks } from '../api/taskflowApi'
import { useFetch } from '../hooks/useFetch'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const projectId = Number(id)
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState<string | null>(null)

  const projectQuery = useFetch(() => fetchProject(projectId), [projectId])
  const tasksQuery = useFetch(() => fetchProjectTasks(projectId), [projectId])

  if (projectQuery.isLoading || tasksQuery.isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (projectQuery.error || !projectQuery.data) {
    return <Alert severity="error">{projectQuery.error?.message ?? 'No encontrado'}</Alert>
  }

  const project = projectQuery.data
  const tasks = tasksQuery.data ?? []

  return (
    <Stack spacing={2} maxWidth={640}>
      <Button onClick={() => navigate(-1)}>← Volver</Button>
      {feedback && <Alert severity="info">{feedback}</Alert>}
      <Typography variant="h5">{project.name}</Typography>
      <Typography color="text.secondary">{project.description}</Typography>
      <Typography variant="body2">Creado: {project.createdAt}</Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Tareas ({tasks.length})</Typography>
        <Button
          component={RouterLink}
          to={`/tasks/new?projectId=${project.id}`}
          variant="outlined"
        >
          Nueva tarea
        </Button>
      </Stack>

      {!tasks.length && (
        <Typography color="text.secondary">Este proyecto no tiene tareas.</Typography>
      )}

      {tasks.map((task) => (
        <Box
          key={task.id}
          component={RouterLink}
          to={`/tasks/${task.id}`}
          sx={{
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              {task.title}
            </Typography>
            <Chip label={task.status} size="small" />
            <Chip label={task.priority} size="small" variant="outlined" />
          </Stack>
        </Box>
      ))}

      <IconButton
        aria-label="Placeholder delete project"
        onClick={() => setFeedback('Borrar proyecto: solo ADMIN o owner (403 si no aplica)')}
      >
        <DeleteIcon color="disabled" />
      </IconButton>
    </Stack>
  )
}
