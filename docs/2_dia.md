Guía Día 3 — CRUD con fetch, cuatro estados y custom hooks

Demo: [demos/03-datos/](../demos/03-datos/)
Tiempo estimado: 8 horas — ~5 h contenido + ~3 h pausas y práctica.

Construirás una app CRUD contra JSONPlaceholder: listar, crear, editar y eliminar usuarios y publicaciones.

Servicio → Hook → Página → App.tsx (conectás en cada fase)



Si querés construirlo desde cero, seguí la Guía paso a paso — desde cero.

Cómo ejecutarlo

cd demos/03-datos   # o dia-3-datos
npm install
npm run dev



Qué vas a construir







Ruta



CRUD



API





/users



Listar · Crear · Editar · Eliminar



GET/POST/PUT/DELETE /users





/posts



Listar · Crear · Editar · Eliminar



GET/POST/PUT/DELETE /posts



JSONPlaceholder no persiste en el servidor. Actualizás el estado local tras cada POST/PUT/DELETE.



Conceptos clave

Tres capas







Capa



Carpeta



Pregunta





Servicio



services/



¿Cómo hablo con la API?





Hook



hooks/



¿Cuándo pido datos y manejo loading/error?





Página



pages/



¿Qué ve el usuario?

Cuatro estados

if (loading) return <CircularProgress />;
if (error) return <Alert severity="error">{error}</Alert>;
if (items.length === 0) return <Alert severity="info">Sin resultados.</Alert>;
return <Lista items={items} />;



Guía paso a paso — desde cero

Cada fase termina modificando App.tsx para que el navegador muestre el avance. Corré npm run dev al cerrar cada una.

Regla de oro



Al final de cada fase modificás App.tsx (y en la Fase 5 también main.tsx). Si no ves cambio en pantalla, no avances.

Cómo va quedando la app







Fase



Título



Qué ves en el navegador (App.tsx renderiza…)





0



Proyecto + theme



Título “Día 3 — CRUD” con fondo y tipografía del theme





1



Listar usuarios



Spinner → tarjetas con avatar, nombre, @usuario, email





2



Crear usuario



Lo anterior + botón Nuevo usuario y diálogo





3



Editar / eliminar



Lo anterior + iconos lápiz y papelera en cada tarjeta





4



Posts CRUD



Pestañas Usuarios | Publicaciones con CRUD en ambas





5



Rutas finales



Nav con React Router: /users y /posts

FASE 0  ████░░░░░░  "Día 3 — CRUD" (theme)
FASE 1  ██████░░░░  Lista usuarios
FASE 2  ████████░░  + Crear
FASE 3  █████████░  + Editar/Eliminar
FASE 4  ██████████  + Posts (tabs en App)
FASE 5  ██████████  Router (misma app, mejor nav)

Leyenda







Símbolo



Significado





🆕



Crear archivo





✏️



Modificar archivo





🔌



Conectar — editar App.tsx para ver el avance

Resumen del orden

FASE 0  →  Vite, deps, theme                    → 🔌 App.tsx = título con theme
FASE 1  →  servicio + hook + UsersPage lectura  → 🔌 App.tsx = <UsersPage />
FASE 2  →  POST + UserFormDialog                → 🔌 App.tsx = <UsersPage /> (con crear)
FASE 3  →  PUT + DELETE                         → 🔌 App.tsx = <UsersPage /> (CRUD completo)
FASE 4  →  posts (mismo patrón)                 → 🔌 App.tsx = Tabs users | posts
FASE 5  →  Layout + Routes                      → 🔌 App.tsx = Routes · main.tsx = BrowserRouter

Mapa: qué archivo conectás en pantalla







Fase



Archivo que conectás



App.tsx muestra





0



🔌 App.tsx



Texto + theme





1



🔌 App.tsx



<UsersPage /> lista





2



🔌 App.tsx



<UsersPage /> con crear





3



🔌 App.tsx



<UsersPage /> CRUD





4



🔌 App.tsx



Tabs + <UsersPage /> + <PostsPage />





5



🔌 App.tsx + main.tsx



<Routes> con layout



FASE 0 — Proyecto base y theme

Qué ves al terminar: pantalla con título “Día 3 — CRUD”, fondo #f1f5f9, texto oscuro legible.

Pasos: 0.1 → 0.2 → 0.3 → 0.4 🔌

Paso 0.1 — Crear proyecto

npm create vite@latest dia-3-datos -- --template react-ts
cd dia-3-datos
npm install
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install react-router-dom@7

Paso 0.2 — Carpetas vacías

mkdir -p src/services src/hooks src/pages src/components

touch \
  src/theme.ts \
  src/services/api.ts \
  src/services/userService.ts \
  src/services/postService.ts \
  src/hooks/useUsers.ts \
  src/hooks/usePosts.ts \
  src/components/AsyncState.tsx \
  src/components/UserCard.tsx \
  src/components/UserFormDialog.tsx \
  src/components/PostCard.tsx \
  src/components/PostFormDialog.tsx \
  src/pages/UsersPage.tsx \
  src/pages/PostsPage.tsx \
  src/Layout.tsx

Paso 0.3 — 🆕 src/theme.ts



¿Qué hace? Colores con contraste: fondo claro, texto #0f172a, primary azul.
¿Por qué importa? Evita gris sobre gris donde no se leen nombres ni emails.

import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#475569' },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
    subtitle1: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15,23,42,0.08)' },
      },
    },
  },
})

Paso 0.4 — 🔌 ✏️ src/App.tsx



¿Qué hace? Aplica theme y muestra un título de prueba.
¿Por qué importa? Primera conexión en pantalla — confirmás que el theme funciona.

















Archivo



src/App.tsx





Origen



Template Vite (contador)





Acción



Reemplazá todo





Qué ves



👁️ Título “Día 3 — CRUD” sobre fondo gris claro

import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Día 3 — CRUD
        </Typography>
        <Typography color="text.secondary">
          Fase 0 — theme aplicado. En la Fase 1 acá irá la lista de usuarios.
        </Typography>
      </Box>
    </ThemeProvider>
  )
}

✅ Verificar Fase 0

npm run dev





Fondo #f1f5f9, texto legible.



Ya no ves el contador de Vite.



FASE 1 — Listar usuarios (GET)

Qué ves al terminar: App.tsx renderiza <UsersPage /> → spinner → tarjetas con avatar e iniciales.

Pasos: 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6 → 1.7 🔌

Paso 1.1 — 🆕 src/services/api.ts

const BASE = 'https://jsonplaceholder.typicode.com'

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`)
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

Paso 1.2 — 🆕 src/services/userService.ts

import { request } from './api'

export type User = {
  id: number
  name: string
  username: string
  email: string
}

export function getUsers() {
  return request<User[]>('/users')
}

Paso 1.3 — 🆕 src/hooks/useUsers.ts

import { useCallback, useEffect, useState } from 'react'
import { getUsers, type User } from '../services/userService'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setUsers(await getUsers())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void reload() }, [reload])

  return { users, loading, error, reload }
}

Paso 1.4 — 🆕 src/components/AsyncState.tsx

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import type { ReactNode } from 'react'

export function AsyncState({
  loading, error, empty, emptyMessage = 'Sin resultados.', children,
}: {
  loading: boolean; error: string | null; empty: boolean
  emptyMessage?: string; children: ReactNode
}) {
  if (loading) return <Box py={6} textAlign="center"><CircularProgress /></Box>
  if (error) return <Alert severity="error">{error}</Alert>
  if (empty) return <Alert severity="info">{emptyMessage}</Alert>
  return <>{children}</>
}

Paso 1.5 — 🆕 src/components/UserCard.tsx

import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { User } from '../services/userService'

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

export function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            {initials(user.name)}
          </Avatar>
          <Stack spacing={0.25}>
            <Typography variant="subtitle1">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">@{user.username}</Typography>
            <Typography variant="body2">{user.email}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

Paso 1.6 — 🆕 src/pages/UsersPage.tsx

import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { AsyncState } from '../components/AsyncState'
import { UserCard } from '../components/UserCard'
import { useUsers } from '../hooks/useUsers'

export function UsersPage() {
  const { users, loading, error } = useUsers()
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Usuarios</Typography>
      <AsyncState loading={loading} error={error} empty={!users.length}>
        <Stack spacing={2}>
          {users.map((u) => <UserCard key={u.id} user={u} />)}
        </Stack>
      </AsyncState>
    </Stack>
  )
}

Paso 1.7 — 🔌 ✏️ src/App.tsx



¿Qué hace? Reemplaza el título de la Fase 0 por la lista real de usuarios.
¿Por qué importa? Conectás servicio + hook + página en pantalla.

















Qué ves



👁️ Spinner → 10 tarjetas con avatar, nombre y email legibles

import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import { ThemeProvider } from '@mui/material/styles'
import { UsersPage } from './pages/UsersPage'
import { theme } from './theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="md">
          <UsersPage />
        </Container>
      </Box>
    </ThemeProvider>
  )
}

✅ Verificar Fase 1





App.tsx muestra la lista (no el texto “Fase 0”).



Nombres en negro, emails legibles.



FASE 2 — Crear usuario (POST)

Qué ves al terminar: mismo App.tsx, pero <UsersPage /> ahora tiene botón Nuevo usuario y diálogo.

Pasos: 2.1 → 2.2 → 2.3 → 2.4 🔌

Paso 2.1 — ✏️ userService.ts + useUsers.ts



¿Qué hace? Agrega createUser al servicio y addUser al hook.
¿Por qué importa? POST a la API + actualizar la lista en memoria (JSONPlaceholder no persiste al recargar).

En src/services/userService.ts, agregá al final:

export type NewUser = Omit<User, 'id'>

export function createUser(body: NewUser) {
  return request<User>('/users', { method: 'POST', body: JSON.stringify(body) })
}

Reemplazá src/hooks/useUsers.ts por:

import { useCallback, useEffect, useState } from 'react'
import {
  createUser,
  getUsers,
  type NewUser,
  type User,
} from '../services/userService'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setUsers(await getUsers())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  async function addUser(body: NewUser) {
    setSaving(true)
    setError(null)
    try {
      const created = await createUser(body)
      setUsers((prev) => [...prev, { ...body, id: created.id }])
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear el usuario')
      return false
    } finally {
      setSaving(false)
    }
  }

  return { users, loading, error, saving, reload, addUser }
}







Bloque



¿Qué hace?



¿Por qué importa?





saving



Indica que el POST está en curso



Deshabilita el botón Guardar del diálogo





addUser devuelve boolean



true si OK, false si error



La página cierra el diálogo solo si tuvo éxito





setUsers((prev) => [...prev, ...])



Agrega al array local



Ves el usuario nuevo sin recargar

Paso 2.2 — 🆕 src/components/UserFormDialog.tsx



¿Qué hace? Diálogo MUI con campos Nombre, Usuario y Email; al guardar llama onSubmit.
¿Por qué importa? Formulario controlado separado — la página solo abre/cierra el diálogo.

















Archivo



src/components/UserFormDialog.tsx





Origen



Vacío (Paso 0.2)





Acción



Pegá el código completo





Qué ves



👁️ Sin cambio hasta el Paso 2.3

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import type { NewUser } from '../services/userService'

type UserFormDialogProps = {
  open: boolean
  title: string
  initial?: NewUser
  saving?: boolean
  onClose: () => void
  onSubmit: (data: NewUser) => void | Promise<void>
}

const emptyForm: NewUser = { name: '', username: '', email: '' }

export function UserFormDialog({
  open,
  title,
  initial,
  saving = false,
  onClose,
  onSubmit,
}: UserFormDialogProps) {
  const [form, setForm] = useState<NewUser>(emptyForm)

  useEffect(() => {
    if (open) {
      setForm(initial ?? emptyForm)
    }
  }, [open, initial])

  function handleChange(field: keyof NewUser) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    await onSubmit({
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
    })
  }

  const valid =
    form.name.trim().length >= 2 &&
    form.username.trim().length >= 2 &&
    form.email.includes('@')

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Nombre"
              value={form.name}
              onChange={handleChange('name')}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Usuario"
              value={form.username}
              onChange={handleChange('username')}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              required
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={!valid || saving}>
            {saving ? 'Guardando…' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}







Bloque



¿Qué hace?



¿Por qué importa?





initial?



Valores precargados



Reutilizarás el mismo diálogo para editar en Fase 3





useEffect al abrir



Resetea o precarga el form



Evita ver datos viejos al abrir de nuevo





valid



Comprueba campos mínimos



No envía POST con formulario vacío





event.preventDefault()



Evita recarga de página



Submit clásico de HTML dentro del diálogo

Paso 2.3 — ✏️ src/pages/UsersPage.tsx



¿Qué hace? Botón Nuevo usuario, estado open y llama addUser al guardar.
¿Por qué importa? La creación vive en la página; App.tsx sigue renderizando <UsersPage />.

















Archivo



src/pages/UsersPage.tsx





Origen



Versión de la Fase 1





Acción



Reemplazá todo el contenido





Qué ves



👁️ Botón arriba a la derecha + diálogo al hacer clic

import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { AsyncState } from '../components/AsyncState'
import { UserCard } from '../components/UserCard'
import { UserFormDialog } from '../components/UserFormDialog'
import { useUsers } from '../hooks/useUsers'
import type { NewUser } from '../services/userService'

export function UsersPage() {
  const { users, loading, error, saving, addUser } = useUsers()
  const [open, setOpen] = useState(false)

  async function handleCreate(data: NewUser) {
    const ok = await addUser(data)
    if (ok) setOpen(false)
  }

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Usuarios</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Nuevo usuario
          </Button>
        </Stack>

        <AsyncState loading={loading} error={error} empty={!users.length}>
          <Stack spacing={2}>
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </Stack>
        </AsyncState>
      </Stack>

      <UserFormDialog
        open={open}
        title="Nuevo usuario"
        saving={saving}
        onClose={() => setOpen(false)}
        onSubmit={handleCreate}
      />
    </>
  )
}







Bloque



¿Qué hace?



¿Por qué importa?





useState(false) para open



Controla si el diálogo está visible



Patrón open/close sin librerías extra





handleCreate



Llama addUser y cierra si OK



La lista se actualiza sola vía el hook





startIcon={<AddIcon />}



Icono + en el botón



Acción crear reconocible visualmente





<UserFormDialog /> al final



Hermano del contenido principal



MUI Dialog se renderiza en portal — no afecta el layout

Paso 2.4 — 🔌 ✏️ src/App.tsx



¿Qué hace? Actualiza el subtítulo visible para confirmar la fase (el CRUD está en UsersPage).
¿Por qué importa? Cada fase tocás App.tsx y verificás el avance.

















Qué ves



👁️ Lista + botón Nuevo usuario arriba a la derecha

import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material/styles'
import { UsersPage } from './pages/UsersPage'
import { theme } from './theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="md">
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Fase 2 — Crear usuarios (POST)
          </Typography>
          <UsersPage />
        </Container>
      </Box>
    </ThemeProvider>
  )
}

✅ Verificar Fase 2

npm run dev





Ves el botón Nuevo usuario arriba a la derecha.



Clic → se abre el diálogo con tres campos.



Completás Nombre, Usuario, Email → Guardar.



El diálogo se cierra y el usuario aparece al final de la lista.



Si dejás campos vacíos, Guardar permanece deshabilitado.



FASE 3 — Editar y eliminar (PUT + DELETE)

Qué ves al terminar: tarjetas con iconos Editar y Eliminar.

Pasos: 3.1 → 3.2 → 3.3 → 3.4 🔌

Paso 3.1 — ✏️ userService.ts

export function updateUser(id: number, body: NewUser) {
  return request<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify({ ...body, id }) })
}

export function deleteUser(id: number) {
  return request<void>(`/users/${id}`, { method: 'DELETE' })
}

Paso 3.2 — ✏️ useUsers.ts

async function editUser(id: number, body: NewUser) {
  await updateUser(id, body)
  setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...body } : u)))
}

async function removeUser(id: number) {
  await deleteUser(id)
  setUsers((prev) => prev.filter((u) => u.id !== id))
}

Paso 3.3 — ✏️ UserCard.tsx + UsersPage.tsx



¿Qué hace? IconButton Editar (reabre diálogo con datos) y Eliminar (confirm + removeUser).

Paso 3.4 — 🔌 ✏️ src/App.tsx

















Qué ves



👁️ CRUD usuarios completo — crear, editar, eliminar

import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material/styles'
import { UsersPage } from './pages/UsersPage'
import { theme } from './theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="md">
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Fase 3 — CRUD usuarios completo (GET · POST · PUT · DELETE)
          </Typography>
          <UsersPage />
        </Container>
      </Box>
    </ThemeProvider>
  )
}

✅ Verificar Fase 3





Editar nombre → tarjeta se actualiza.



Eliminar → desaparece de la lista.



FASE 4 — Posts CRUD

Qué ves al terminar: App.tsx con pestañas Usuarios | Publicaciones; cada pestaña con su CRUD.

Pasos: 4.1 → 4.2 → 4.3 → 4.4 → 4.5 🔌

Paso 4.1 — 🆕 postService.ts (GET/POST/PUT/DELETE)

Mismo patrón que userService.ts. Tipo Post: id, userId, title, body.

Paso 4.2 — 🆕 usePosts.ts

Mismo patrón que useUsers.ts.

Paso 4.3 — 🆕 PostCard.tsx + PostFormDialog.tsx

Tarjeta con título destacado y cuerpo truncado. Formulario: userId, title, body.

Paso 4.4 — 🆕 src/pages/PostsPage.tsx

Copiá la estructura de UsersPage.tsx adaptada a posts.

Paso 4.5 — 🔌 ✏️ src/App.tsx



¿Qué hace? Tabs MUI alternan <UsersPage /> y <PostsPage />.
¿Por qué importa? Dos CRUD en una sola app antes de React Router — cambio visible inmediato.

















Qué ves



👁️ Pestañas Usuarios / Publicaciones, cada una con su CRUD

import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { ThemeProvider } from '@mui/material/styles'
import { useState } from 'react'
import { PostsPage } from './pages/PostsPage'
import { UsersPage } from './pages/UsersPage'
import { theme } from './theme'

export default function App() {
  const [tab, setTab] = useState(0)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="md">
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
            <Tab label="Usuarios" />
            <Tab label="Publicaciones" />
          </Tabs>
          {tab === 0 ? <UsersPage /> : <PostsPage />}
        </Container>
      </Box>
    </ThemeProvider>
  )
}

✅ Verificar Fase 4





Pestaña Usuarios → CRUD usuarios.



Pestaña Publicaciones → CRUD posts.



FASE 5 — Layout y rutas (versión final)

Qué ves al terminar: misma funcionalidad, nav con URLs /users y /posts.

Pasos: 5.1 → 5.2 → 5.3 🔌 → 5.4 🔌

Paso 5.1 — 🆕 src/Layout.tsx

AppBar oscuro, NavLink a /users y /posts, <Outlet />.

Paso 5.2 — ✏️ UsersPage.tsx / PostsPage.tsx



¿Qué hace? Quitá subtítulos “Fase X” si los agregaste; las páginas quedan limpias.
¿Por qué importa? El layout y las rutas reemplazan las tabs de App.tsx.

Paso 5.3 — 🔌 ✏️ src/App.tsx



¿Qué hace? Reemplaza Tabs por <Routes>.
¿Por qué importa? Versión final de la app.

















Qué ves



👁️ Nav Usuarios / Publicaciones; URL cambia al navegar

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './Layout'
import { PostsPage } from './pages/PostsPage'
import { UsersPage } from './pages/UsersPage'
import { theme } from './theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/users" replace />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="posts" element={<PostsPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

Paso 5.4 — 🔌 ✏️ src/main.tsx



¿Qué hace? Envuelve <App /> con <BrowserRouter>.
¿Por qué importa? Sin esto las rutas no observan la URL.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

✅ Verificar Fase 5





/ → /users



CRUD usuarios y posts funcionan



Loading, error, empty en ambas rutas



Nombres legibles con avatar



npm run build sin errores



Checkpoint y entrega

npm run build
git add .
git commit -m "feat: day 3 — CRUD users and posts with JSONPlaceholder"



Errores comunes







Problema



Solución





Fase sin cambio visible



Siempre cerrá con 🔌 App.tsx





Nombres ilegibles



Theme + cards blancas + text.primary oscuro





Spinner eterno



setLoading(false) en finally





Empty mientras carga



Orden: loading → error → empty → success



Regla práctica



Servicio = qué pedir · Hook = cuándo y con qué estado · Página = cómo se ve · App.tsx = conectás cada fase

La red es incierta; la interfaz debe representar cada resultado posible.

