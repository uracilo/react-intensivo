import DeleteIcon from '@mui/icons-material/Delete'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createTask, fetchProjects } from '../api/taskflowApi'
import type { NewTask, Priority } from '../types'
import { useFetch } from '../hooks/useFetch'

const empty: NewTask = {
  title: '',
  description: '',
  priority: 'MED',
  dueDate: '',
}

export function NewTaskPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialProjectId = searchParams.get('projectId') ?? ''
  const { data: projects } = useFetch(fetchProjects)

  const [projectId, setProjectId] = useState(initialProjectId)
  const [form, setForm] = useState<NewTask>(empty)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const valid = useMemo(
    () => form.title.trim().length >= 3 && Boolean(projectId),
    [form.title, projectId],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    setSubmitting(true)
    setError(null)
    try {
      const created = await createTask(Number(projectId), {
        title: form.title.trim(),
        description: form.description?.trim() || undefined,
        priority: form.priority,
        dueDate: form.dueDate || undefined,
      })
      setSuccess(`Tarea "${created.title}" creada`)
      setTimeout(() => navigate(`/tasks/${created.id}`), 800)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Stack spacing={2} maxWidth={480}>
      <Typography variant="h5">Nueva tarea</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            select
            label="Proyecto"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            fullWidth
          >
            {(projects ?? []).map((p) => (
              <MenuItem key={p.id} value={String(p.id)}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Título"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            fullWidth
            helperText="3–120 caracteres"
          />
          <TextField
            label="Descripción"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            select
            label="Prioridad"
            value={form.priority}
            onChange={(e) =>
              setForm((f) => ({ ...f, priority: e.target.value as Priority }))
            }
            fullWidth
          >
            <MenuItem value="LOW">LOW</MenuItem>
            <MenuItem value="MED">MED</MenuItem>
            <MenuItem value="HIGH">HIGH</MenuItem>
          </TextField>
          <TextField
            label="Fecha límite"
            type="date"
            value={form.dueDate ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <Button type="submit" variant="contained" disabled={!valid || submitting}>
            Crear
          </Button>
        </Stack>
      </form>
    </Stack>
  )
}
