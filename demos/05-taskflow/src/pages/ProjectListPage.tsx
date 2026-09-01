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
import { fetchProjects } from '../api/taskflowApi'
import { useFetch } from '../hooks/useFetch'

export function ProjectListPage() {
  const { data, error, isLoading } = useFetch(fetchProjects)

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
    return <Typography color="text.secondary">No hay proyectos.</Typography>
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Proyectos</Typography>
        <Button
          component={RouterLink}
          to="/projects/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Nuevo
        </Button>
      </Stack>
      {data.map((project) => (
        <Card
          key={project.id}
          component={RouterLink}
          to={`/projects/${project.id}`}
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          <CardContent>
            <Typography variant="subtitle1">{project.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {project.description ?? 'Sin descripción'} · {project.createdAt}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
