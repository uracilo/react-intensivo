import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { MOCK_USERS } from './types'
import { UserGrid } from './UserGrid'

const theme = createTheme()

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>
            Día 1 — User Cards con MUI
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Componentes tipados, props, listas con key y layout con Stack / Card / Avatar
          </Typography>
          <UserGrid users={MOCK_USERS} />
        </Container>
      </Box>
    </ThemeProvider>
  )
}
