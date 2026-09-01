import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useEffect, useRef, useState } from 'react'
import { StyledListItem } from './StyledListItem'
import type { TodoItem } from './types'

const theme = createTheme()

export default function App() {
  const [items, setItems] = useState<TodoItem[]>([
    { id: 1, text: 'Instalar MUI', done: true },
    { id: 2, text: 'Practicar useState', done: false },
  ])
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const trimmed = text.trim()
  const canAdd = trimmed.length > 0

  function handleAdd() {
    if (!canAdd) return
    setItems((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, done: false },
    ])
    setText('')
    inputRef.current?.focus()
  }

  function handleToggle(id: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    )
  }

  function handleDelete(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom>
            Día 2 — TODO con MUI
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            useState, formularios controlados, useRef (autofocus) y styled()
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <TextField
              inputRef={inputRef}
              fullWidth
              label="Nueva tarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={!canAdd}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Agregar
            </Button>
          </Stack>

          <List disablePadding>
            {items.map((item) => (
              <StyledListItem
                key={item.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label={`Eliminar ${item.text}`}
                    onClick={() => handleDelete(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Checkbox
                  checked={item.done}
                  onChange={() => handleToggle(item.id)}
                  inputProps={{ 'aria-label': `Marcar ${item.text}` }}
                />
                <ListItemText
                  primary={item.text}
                  sx={{
                    textDecoration: item.done ? 'line-through' : 'none',
                    color: item.done ? 'text.secondary' : 'text.primary',
                  }}
                />
              </StyledListItem>
            ))}
          </List>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
