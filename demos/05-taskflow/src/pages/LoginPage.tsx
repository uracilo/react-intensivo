import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { useToast } from '../context/ToastContext'

export function LoginPage() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [username, setUsername] = useState('demo')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = login(username, password)
    if (ok) {
      showToast('Bienvenido')
      navigate('/users')
    } else {
      setError('Credenciales inválidas (demo / demo123)')
    }
  }

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button type="submit" variant="contained">
            Entrar
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
