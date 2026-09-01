import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { NavLink, Outlet } from 'react-router-dom'
import { useToggle } from './hooks/useToggle'

export function Layout() {
  const [showHint, toggleHint] = useToggle(true)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Día 3 — useFetch&lt;T&gt;
          </Typography>
          <Button component={NavLink} to="/users" sx={{ mr: 1 }}>
            Users
          </Button>
          <Button component={NavLink} to="/posts">
            Posts
          </Button>
          <Button onClick={toggleHint} sx={{ ml: 1 }} size="small">
            Hint
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
        {showHint && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Mismo hook <code>useFetch&lt;T&gt;</code> — solo cambia URL y tipo.
          </Typography>
        )}
        <Outlet />
      </Container>
    </Box>
  )
}
