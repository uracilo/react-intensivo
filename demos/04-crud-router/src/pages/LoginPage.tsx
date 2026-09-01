import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { API_URL } from '../types'

export function LoginPage() {
  const { login } = useAuth()
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
      {window.location.protocol === 'https:' && !API_URL.startsWith('/api') && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Estás en HTTPS (GitHub Pages). El navegador bloquea la API HTTP directa.
          <br />
          <strong>Opción 1 — local (recomendado):</strong>
          <Box component="pre" sx={{ mt: 1, p: 1, bgcolor: 'grey.100', fontSize: 12, overflow: 'auto' }}>
            {`cd react-intensivo\nnpm run install:demos\nnpm run dev:04`}
          </Box>
          Abrí: <code>http://localhost:5173/react-intensivo/04/</code>
          <br />
          <strong>Opción 2:</strong> deploy en Vercel (usa proxy /api automático).
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
