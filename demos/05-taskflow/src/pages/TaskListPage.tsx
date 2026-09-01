import AddIcon from '@mui/icons-material/Add'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import { fetchTasks } from '../api/taskflowApi'
import { useFetch } from '../hooks/useFetch'

export function TaskListPage() {
  const { data, error, isLoading } = useFetch(fetchTasks)

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

  if (!data?.length) {
    return <Typography color="text.secondary">No hay tareas.</Typography>
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Tareas</Typography>
        <Button
          component={RouterLink}
          to="/tasks/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Nueva
        </Button>
      </Stack>
      {data.map((task) => (
        <Card
          key={task.id}
          component={RouterLink}
          to={`/tasks/${task.id}`}
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                {task.title}
              </Typography>
              <Chip label={task.status} size="small" />
              <Chip label={`P${task.projectId}`} size="small" variant="outlined" />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
