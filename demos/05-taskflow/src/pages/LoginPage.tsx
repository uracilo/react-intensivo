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
import { API_URL } from '../types'

export function LoginPage() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [username, setUsername] = useState('ana')
  const [password, setPassword] = useState('ana123')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await login(username, password)
    setLoading(false)
    if (result.success) {
      showToast('Bienvenido a TaskFlow')
      navigate('/projects')
    } else {
      setError(result.error ?? 'No se pudo iniciar sesión.')
    }
  }

  return (
    <Box maxWidth={440} mx="auto" mt={8}>
      <Typography variant="h5" gutterBottom>
        TaskFlow — Login
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        API: {API_URL}
      </Typography>
      {window.location.protocol === 'https:' && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Estás en HTTPS (ej. GitHub Pages). El navegador bloquea llamadas a la API HTTP.
          Ejecutá localmente: <code>npm run dev:05</code>
        </Alert>
      )}
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
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
