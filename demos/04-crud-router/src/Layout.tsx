import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, Outlet } from 'react-router-dom'
import { useAuth } from './auth'

export function Layout() {
  const { logout } = useAuth()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            TaskFlow — Día 4
          </Typography>
          <Button component={RouterLink} to="/projects">
            Proyectos
          </Button>
          <Button component={RouterLink} to="/tasks" sx={{ ml: 1 }}>
            Tareas
          </Button>
          <Button onClick={logout} sx={{ ml: 1 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
