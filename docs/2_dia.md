# Guía Día 3 — CRUD con fetch, cuatro estados y custom hooks

**Demo:** [`demos/02-datos/`](../demos/02-datos/)  
**Tiempo estimado:** 8 horas — ~5 h contenido + ~3 h pausas y práctica.

Construirás una app CRUD completa contra [JSONPlaceholder](https://jsonplaceholder.typicode.com/): listar, crear, editar y eliminar **usuarios** y **publicaciones**, con cuatro estados de UI claros y hooks reutilizables.

```text
Servicio → Hook → Página
GET/POST/PUT/DELETE → loading / error / empty / success → formulario + lista
```

> Si querés construirlo desde cero, seguí la [Guía paso a paso — desde cero](#guía-paso-a-paso--desde-cero).

## Cómo ejecutarlo

```bash
cd demos/02-datos   # o tu proyecto dia-3-datos
npm install
npm run dev
```

Abrí http://localhost:5173 → `/users` y `/posts` con CRUD completo.

---

## Qué vas a construir

Una app con dos secciones:

| Ruta | CRUD | API |
| --- | --- | --- |
| `/users` | Listar · Crear · Editar · Eliminar | `GET/POST/PUT/DELETE /users` |
| `/posts` | Listar · Crear · Editar · Eliminar | `GET/POST/PUT/DELETE /posts` |

> JSONPlaceholder **no persiste** cambios en el servidor. Tras POST/PUT/DELETE la API responde OK, pero al recargar volvés a los datos originales. Por eso actualizamos el estado **local** después de cada operación.

---

## Conceptos clave

### Tres capas (mismo patrón que el demo JWT)

| Capa | Carpeta | Pregunta que responde |
| --- | --- | --- |
| **Servicio** | `services/` | ¿Cómo hablo con la API? (fetch puro, sin React) |
| **Hook** | `hooks/` | ¿Cuándo pido datos y cómo manejo loading/error/acciones? |
| **Página** | `pages/` | ¿Qué ve el usuario? (spinner, error, vacío, lista, formulario) |

```
┌──────────┐    usa    ┌───────────┐    llama    ┌─────────────┐
│ UsersPage│ ────────► │ useUsers  │ ──────────► │ userService │
└──────────┘           └───────────┘             └─────────────┘
      ▲                       │                          │
      └── { users, loading } ─┘                          ▼
                                              GET /users (JSONPlaceholder)
```

### Los cuatro estados

| Estado | Cuándo | MUI |
| --- | --- | --- |
| Loading | Petición en curso | `CircularProgress` |
| Error | Falló la red o HTTP 4xx/5xx | `Alert severity="error"` |
| Empty | Éxito pero sin registros | `Alert severity="info"` |
| Success | Hay datos | Cards + botones Editar/Eliminar |

Orden en la página:

```tsx
if (loading) return <CircularProgress />;
if (error) return <Alert severity="error">{error}</Alert>;
if (items.length === 0) return <Alert severity="info">No hay usuarios.</Alert>;
return <UserList users={items} />;
```

### CRUD en fetch

| Operación | Método | Ejemplo |
| --- | --- | --- |
| Leer lista | `GET` | `fetch('/users')` |
| Crear | `POST` | `fetch('/users', { method: 'POST', body: JSON.stringify(data) })` |
| Actualizar | `PUT` | `fetch('/users/1', { method: 'PUT', body: ... })` |
| Eliminar | `DELETE` | `fetch('/users/1', { method: 'DELETE' })` |

Siempre comprobá `response.ok` y usá `Content-Type: application/json` en POST/PUT.

---

## Guía paso a paso — desde cero

Cada fase termina con algo visible. Corré `npm run dev` al cerrar cada una.

### Regla de oro

> No acumules archivos sin conectar. Al final de **cada fase** algo nuevo funciona en el navegador.

### Cómo va quedando la app

| Fase | Título | Qué ves |
| --- | --- | --- |
| **0** | Proyecto + theme | Pantalla con colores legibles (no gris plano) |
| **1** | Listar usuarios | Spinner → tarjetas con nombre, @usuario y email |
| **2** | Crear usuario | Botón "Nuevo" → diálogo → usuario en la lista |
| **3** | Editar y eliminar | Lápiz y papelera funcionan |
| **4** | Posts CRUD | Misma app en `/posts` |
| **5** | Rutas + layout | Nav Usuarios / Publicaciones |

```
FASE 0  ████░░░░░░  Theme + estructura
FASE 1  ██████░░░░  GET + 4 estados
FASE 2  ████████░░  POST (crear)
FASE 3  █████████░  PUT + DELETE
FASE 5  ██████████  App CRUD completa
```

### Leyenda

| Símbolo | Significado |
| --- | --- |
| 🆕 | Crear archivo |
| ✏️ | Modificar archivo |
| 🔌 | Conectar en pantalla |

### Resumen del orden

```
FASE 0  →  Vite, deps, theme, carpetas
FASE 1  →  userService + useUsers + UsersPage (solo lectura)  → 🔌
FASE 2  →  UserFormDialog + POST                               → 🔌
FASE 3  →  PUT + DELETE en useUsers                            → 🔌
FASE 4  →  postService + usePosts + PostsPage (CRUD completo)  → 🔌
FASE 5  →  Layout + rutas App.tsx + main.tsx
```

---

## FASE 0 — Proyecto base y theme

**Qué ves al terminar:** app con fondo claro, AppBar oscuro y tipografía legible (nada de gris sobre gris).

#### Paso 0.1 — Crear proyecto

> **¿Qué hace?** Proyecto React + TypeScript con Vite.  
> **¿Por qué importa?** Base mínima para correr la app.

```bash
npm create vite@latest dia-3-datos -- --template react-ts
cd dia-3-datos
npm install
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install react-router-dom@7
```

#### Paso 0.2 — 🆕 Carpetas y archivos vacíos

> **¿Qué hace?** Estructura lista para servicios, hooks y páginas.  
> **¿Por qué importa?** Separás responsabilidades desde el inicio.

```bash
mkdir -p src/services src/hooks src/pages src/components src/utils

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
```

| Archivo | Lo llenás en |
| --- | --- |
| `src/theme.ts` | 0.3 |
| `src/services/api.ts` | 1.1 |
| `src/services/userService.ts` | 1.2 |
| `src/hooks/useUsers.ts` | 1.3 |
| `src/components/AsyncState.tsx` | 1.4 |
| `src/components/UserCard.tsx` | 1.5 |
| `src/pages/UsersPage.tsx` | 1.6 |
| `src/components/UserFormDialog.tsx` | 2.1 |
| `src/services/postService.ts` | 4.1 |
| `src/hooks/usePosts.ts` | 4.2 |
| `src/pages/PostsPage.tsx` | 4.3 |
| `src/Layout.tsx` | 5.1 |

#### Paso 0.3 — 🆕 Theme legible

> **¿Qué hace?** Paleta con contraste real: fondo `#f1f5f9`, texto oscuro `#0f172a`, primary azul `#2563eb`, AppBar slate oscuro.  
> **¿Por qué importa?** El demo anterior usaba `grey.50` + `color="default"` — nombres y emails casi no se leían.

**`src/theme.ts`**

```tsx
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
    subtitle1: { fontWeight: 600, color: '#0f172a' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
        },
      },
    },
  },
})
```

#### Paso 0.4 — ✏️ `App.tsx` con ThemeProvider

> **¿Qué hace?** Aplica el theme en toda la app.  
> **¿Por qué importa?** Sin esto seguís con colores default de MUI.

```tsx
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Fase 5: rutas acá */}
    </ThemeProvider>
  )
}
```

---

## FASE 1 — Listar usuarios (GET + cuatro estados)

**Qué ves al terminar:** lista de usuarios con **avatar + nombre grande + @username + email** (no cajas grises con texto apagado).

#### Paso 1.1 — 🆕 Cliente HTTP base

> **¿Qué hace?** Función `request` que envuelve `fetch`, comprueba `response.ok` y parsea JSON.  
> **¿Por qué importa?** Un solo lugar para errores HTTP; servicios no repiten lógica.

**`src/services/api.ts`**

```tsx
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
```

#### Paso 1.2 — 🆕 Servicio de usuarios (solo GET por ahora)

> **¿Qué hace?** `getUsers()` — una función, sin React.  
> **¿Por qué importa?** Capa servicio: fácil de testear y reutilizar.

**`src/services/userService.ts`**

```tsx
import { request } from './api'

export type User = {
  id: number
  name: string
  username: string
  email: string
  phone?: string
}

export function getUsers() {
  return request<User[]>('/users')
}
```

#### Paso 1.3 — 🆕 Hook `useUsers`

> **¿Qué hace?** Al montar llama `getUsers()`, expone `{ users, loading, error, reload }`.  
> **¿Por qué importa?** La página no llama fetch directo; solo consume el hook.

**`src/hooks/useUsers.ts`**

```tsx
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
```

#### Paso 1.4 — 🆕 `AsyncState`

> **¿Qué hace?** Componente que renderiza loading, error, empty o `children`.  
> **¿Por qué importa?** No repetís los cuatro `if` en UsersPage y PostsPage.

**`src/components/AsyncState.tsx`**

```tsx
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import type { ReactNode } from 'react'

export function AsyncState({
  loading, error, empty, emptyMessage = 'Sin resultados.', children,
}: {
  loading: boolean
  error: string | null
  empty: boolean
  emptyMessage?: string
  children: ReactNode
}) {
  if (loading) return <Box py={6} textAlign="center"><CircularProgress /></Box>
  if (error) return <Alert severity="error">{error}</Alert>
  if (empty) return <Alert severity="info">{emptyMessage}</Alert>
  return <>{children}</>
}
```

#### Paso 1.5 — 🆕 `UserCard` (nombres legibles)

> **¿Qué hace?** Tarjeta con `Avatar` (iniciales), nombre en negrita, `@username` y email con color secundario **oscuro** (`#475569`), no gris claro.  
> **¿Por qué importa?** Resuelve el problema de “no se ven los nombres”.

**`src/components/UserCard.tsx`**

```tsx
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
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
            <Typography variant="body2">{user.email}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
```

#### Paso 1.6 — 🔌 🆕 `UsersPage` + conectar en `App.tsx`

> **¿Qué hace?** Página que usa hook + AsyncState + lista de UserCard.  
> **¿Por qué importa?** Primer resultado visible: usuarios bien presentados.

**`src/pages/UsersPage.tsx`**

```tsx
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
```

En `App.tsx` importá y renderizá `<UsersPage />` dentro del `ThemeProvider`.

#### ✅ Verificar Fase 1

- Spinner breve → 10 tarjetas con avatar e iniciales.
- Nombre legible en negro (`#0f172a`), email en gris oscuro (`#475569`).

---

## FASE 2 — Crear usuario (POST)

**Qué ves al terminar:** botón **Nuevo usuario** → diálogo → usuario aparece al final de la lista.

#### Paso 2.1 — Ampliar servicio y hook

> **¿Qué hace?** `createUser(body)` en servicio; `addUser` en hook actualiza estado local.  
> **¿Por qué importa?** JSONPlaceholder devuelve el objeto creado pero no lo guarda — el estado local es la fuente de verdad en la sesión.

**En `userService.ts`**, agregá:

```tsx
export type NewUser = Omit<User, 'id'>

export function createUser(body: NewUser) {
  return request<User>('/users', { method: 'POST', body: JSON.stringify(body) })
}
```

**En `useUsers.ts`**, agregá:

```tsx
async function addUser(body: NewUser) {
  const created = await createUser(body)
  setUsers((prev) => [...prev, { ...body, id: created.id }])
}
// return { ..., addUser }
```

#### Paso 2.2 — 🆕 `UserFormDialog`

> **¿Qué hace?** Diálogo MUI con campos name, username, email; al guardar llama `onSubmit`.  
> **¿Por qué importa?** Formulario controlado separado de la lista.

Campos mínimos: **Nombre**, **Usuario**, **Email**. Botones Cancelar / Guardar.

#### Paso 2.3 — 🔌 Conectar en `UsersPage`

> **¿Qué hace?** Botón `variant="contained"` arriba a la derecha abre el diálogo.  
> **¿Por qué importa?** Flujo crear completo en pantalla.

```tsx
<Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpen(true)}>
  Nuevo usuario
</Button>
```

---

## FASE 3 — Editar y eliminar (PUT + DELETE)

**Qué ves al terminar:** cada tarjeta tiene iconos Editar y Eliminar.

#### Paso 3.1 — Servicio

```tsx
export function updateUser(id: number, body: NewUser) {
  return request<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify({ ...body, id }) })
}

export function deleteUser(id: number) {
  return request<void>(`/users/${id}`, { method: 'DELETE' })
}
```

#### Paso 3.2 — Hook

```tsx
async function editUser(id: number, body: NewUser) {
  await updateUser(id, body)
  setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...body } : u)))
}

async function removeUser(id: number) {
  await deleteUser(id)
  setUsers((prev) => prev.filter((u) => u.id !== id))
}
```

#### Paso 3.3 — 🔌 `UserCard` con acciones

> **¿Qué hace?** Botones `IconButton` con `EditIcon` y `DeleteIcon`.  
> **¿Por qué importa?** CRUD completo en una entidad.

- **Editar:** reutilizá `UserFormDialog` con valores iniciales.
- **Eliminar:** `window.confirm` antes de `removeUser(id)`.

#### ✅ Verificar Fase 3

- Crear, editar y eliminar usuarios sin recargar.
- Tras F5 los datos vuelven a los 10 originales (limitación de JSONPlaceholder).

---

## FASE 4 — Posts CRUD (reutilizar patrón)

**Qué ves al terminar:** `/posts` con el mismo CRUD — título, cuerpo, userId.

> **¿Qué hace?** Copiás el patrón servicio → hook → página.  
> **¿Por qué importa?** Demostrás reutilización; no repetís 9 mini-prácticas de fetch.

| Archivo | Equivalente users |
| --- | --- |
| `postService.ts` | `userService.ts` |
| `usePosts.ts` | `useUsers.ts` |
| `PostCard.tsx` | `UserCard.tsx` |
| `PostFormDialog.tsx` | `UserFormDialog.tsx` |
| `PostsPage.tsx` | `UsersPage.tsx` |

Campos del post: **userId** (number), **title**, **body**.

---

## FASE 5 — Layout y rutas

**Qué ves al terminar:** nav **Usuarios | Publicaciones**, redirect `/` → `/users`.

#### Paso 5.1 — 🆕 `Layout.tsx`

> **¿Qué hace?** AppBar oscuro (del theme), botones `NavLink`, `Outlet`.  
> **¿Por qué importa?** Una sola cabecera; rutas hijas en el contenido.

#### Paso 5.2 — ✏️ `App.tsx` + `main.tsx`

```tsx
// App.tsx
<Routes>
  <Route element={<Layout />}>
    <Route index element={<Navigate to="/users" replace />} />
    <Route path="users" element={<UsersPage />} />
    <Route path="posts" element={<PostsPage />} />
  </Route>
</Routes>

// main.tsx — BrowserRouter envolviendo App
```

#### ✅ Verificar final

- [ ] `/users` — CRUD completo, nombres legibles con avatar
- [ ] `/posts` — CRUD completo
- [ ] Loading, error y empty en ambas rutas
- [ ] Colores con contraste (no gris sobre gris)
- [ ] `npm run build` sin errores TypeScript

---

## Checkpoint y entrega

```bash
npm run build
git add .
git commit -m "feat: day 3 — CRUD users and posts with JSONPlaceholder"
```

---

## Errores comunes

| Problema | Causa | Solución |
| --- | --- | --- |
| Nombres no se leen | `color="text.secondary"` sobre fondo gris claro | Theme con `text.primary` `#0f172a` y cards blancas |
| Spinner eterno | Sin `finally` al cargar | Siempre `setLoading(false)` en `finally` |
| Empty mientras carga | `length === 0` antes de `loading` | Orden: loading → error → empty → success |
| POST no persiste al F5 | JSONPlaceholder es fake | Normal; estado local en la sesión |
| Olvidar `response.ok` | 404 tratado como éxito | Lanzar error en `request()` |

---

## Glosario breve

| Término | Significado |
| --- | --- |
| CRUD | Create, Read, Update, Delete |
| Servicio | Funciones fetch sin React |
| Hook | Lógica con estado y efectos |
| Optimistic / local | Actualizar UI sin esperar persistencia real |
| `AsyncState` | Wrapper de loading / error / empty / success |

---

## Referencias

- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- [JSONPlaceholder Guide](https://jsonplaceholder.typicode.com/guide/)
- [React Router v7](https://reactrouter.com/start/declarative/routing)

---

## Regla práctica

> **Servicio** = qué pedir a la API · **Hook** = cuándo y con qué estado · **Página** = cómo se ve

```text
La red es incierta; la interfaz debe representar cada resultado posible.
```
