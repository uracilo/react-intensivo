import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../api/usersApi'
import type { NewUser } from '../types'

const empty: NewUser = { name: '', email: '', role: 'developer' }

export function NewUserPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<NewUser>(empty)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const valid = form.name.trim() && form.email.includes('@')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    setSubmitting(true)
    setError(null)
    try {
      const created = await createUser(form)
      setSuccess(`Usuario ${created.name} creado`)
      setTimeout(() => navigate(`/users/${created.id}`), 800)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Stack spacing={2} maxWidth={480}>
      <Typography variant="h5">Nuevo usuario</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Nombre"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            fullWidth
          />
          <TextField
            label="Rol"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={!valid || submitting}>
            Crear
          </Button>
        </Stack>
      </form>
    </Stack>
  )
}
