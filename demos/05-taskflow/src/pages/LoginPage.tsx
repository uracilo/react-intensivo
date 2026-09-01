import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { getApiBaseUrl, setApiBaseUrl } from '../config/apiUrl'
import { useToast } from '../context/ToastContext'

const onGitHubPages = window.location.hostname.endsWith('github.io')

export function LoginPage() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [username, setUsername] = useState('ana')
  const [password, setPassword] = useState('ana123')
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setApiBaseUrl(apiUrl)
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
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="URL de la API (HTTPS)"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            fullWidth
            helperText={
              onGitHubPages
                ? 'Default: CloudFront HTTPS. Editá solo si usás otro endpoint.'
                : 'Local: /api (proxy Vite) o https://d3ujwk09smrk9z.cloudfront.net'
            }
          />
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
          <Button type="submit" variant="contained" disabled={loading || !apiUrl.trim()}>
            {loading ? 'Entrando…' : 'Entrar'}
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
