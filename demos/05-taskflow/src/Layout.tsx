import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, Outlet } from 'react-router-dom'
import { useAuth } from './auth'
import { useThemeMode } from './context/ThemeContext'

export function Layout() {
  const { logout } = useAuth()
  const { mode, toggleTheme } = useThemeMode()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Día 5 — Users App
          </Typography>
          <Button component={RouterLink} to="/users" color="inherit">
            Users
          </Button>
          <IconButton
            color="inherit"
            aria-label={mode === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
            onClick={toggleTheme}
          >
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <Button color="inherit" onClick={logout} sx={{ ml: 1 }}>
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
