# Guía complementaria — PUT y DELETE de Projects

**Proyecto base:** `jwt-auth-demo` implementado hasta la Fase 4  
**API:** [TaskFlow API — Swagger UI](https://d3ujwk09smrk9z.cloudfront.net/swagger-ui/index.html)  
**Ubicación en la guía original:** después de la **Fase 4 — Formulario para crear proyectos** y antes de la fase de limpieza.

> Si incorporas esta fase dentro del Markdown completo, la antigua **Fase 5 — Limpieza y pruebas finales** pasa a ser la Fase 6, y la antigua **Fase 6 — CI y GitHub Pages** pasa a ser la Fase 7.

Esta fase completa las operaciones que la API realmente ofrece para proyectos:

```text
GET /projects          → listar
POST /projects         → crear
PUT /projects/{id}     → reemplazar nombre y descripción
DELETE /projects/{id}  → eliminar el proyecto y sus tareas
```

> **Importante sobre PATCH:** la especificación actual de TaskFlow API **no publica `PATCH /projects/{id}`**. El único endpoint PATCH disponible es `PATCH /tasks/{id}/status`, que pertenece al recurso **Tasks**, no a **Projects**. Por eso esta guía no inventa un `patchProject()`: esa llamada fallaría contra la API actual.

---

## Qué aprenderás

- Agregar `PUT` y `DELETE` al servicio de proyectos.
- Crear un hook para manejar edición, eliminación, loading y errores.
- Editar un proyecto desde la lista.
- Pedir confirmación antes de eliminar.
- Recargar la lista después de una operación exitosa.
- Distinguir entre `PUT` y `PATCH` según el contrato real de la API.

## Qué ves al terminar

Cada proyecto de la lista tendrá los botones **Editar** y **Eliminar**.

- **Editar** abre un formulario con el nombre y la descripción actuales.
- **Guardar cambios** llama a `PUT /projects/{id}`.
- **Eliminar** solicita confirmación y llama a `DELETE /projects/{id}`.
- Cuando una operación termina correctamente, la lista se actualiza sin recargar la página completa.
- Si la API responde `401`, `403`, `404` u otro error, se muestra un `Alert` en el proyecto correspondiente.

---

## Endpoints confirmados en Swagger

| Método | Endpoint | Cuerpo | Resultado |
| --- | --- | --- | --- |
| `GET` | `/projects` | No | Lista de proyectos |
| `POST` | `/projects` | `{ name, description? }` | Proyecto creado |
| `PUT` | `/projects/{id}` | `{ name, description? }` | Proyecto actualizado |
| `DELETE` | `/projects/{id}` | No | Elimina el proyecto y sus tareas |
| `PATCH` | `/projects/{id}` | — | **No existe en la API actual** |

### Semántica del PUT

Según Swagger, `PUT /projects/{id}` conserva:

- `id`
- `ownerId`
- `createdAt`

El cliente envía nuevamente los campos editables:

```json
{
  "name": "Nuevo nombre",
  "description": "Nueva descripción"
}
```

El nombre es obligatorio y debe tener entre 3 y 80 caracteres. La descripción es opcional.

### Regla de eliminación

`DELETE /projects/{id}` solamente puede ejecutarlo:

- El usuario propietario del proyecto.
- Un usuario con rol `ADMIN`.

Si un usuario `USER` intenta eliminar un proyecto ajeno, la API responde `403`. Además, al eliminar el proyecto también se eliminan sus tareas asociadas.

---

## Cómo se conectan las piezas nuevas

```text
ProjectItem
    → useProjectActions
        → projectService.updateProject()  → PUT /projects/{id}
        → projectService.deleteProject()  → DELETE /projects/{id}
    → onSuccess()
        → useProjects.refetch()
            → ProjectList recibe la lista actualizada
```

## Leyenda

| Símbolo | Significado |
| --- | --- |
| 🆕 | Crear archivo nuevo |
| ✏️ | Modificar un archivo existente |
| 🔌 | Conectar la funcionalidad para verla en pantalla |
| ⚠️ | Consideración importante |

---

# FASE 5 — Editar y eliminar proyectos

**Pasos de esta fase:** 5.0 → 5.1 → 5.2 → 5.3 → 5.4 → 5.5 → 5.6 → 5.7 → 5.8

| Paso | Acción | Archivo |
| --- | --- | --- |
| 5.0 | Verificar el punto de partida | Proyecto actual |
| 5.1 | 🆕 Crear archivos vacíos | `useProjectActions.ts`, `ProjectItem.tsx` |
| 5.2 | ✏️ Modificar tipos | `src/types.ts` |
| 5.3 | ✏️ Modificar servicio | `src/services/projectService.ts` |
| 5.4 | 🆕 Llenar hook | `src/hooks/useProjectActions.ts` |
| 5.5 | 🆕 Llenar componente | `src/components/ProjectItem.tsx` |
| 5.6 | ✏️ Modificar lista | `src/components/ProjectList.tsx` |
| 5.7 | 🔌 ✏️ Modificar dashboard | `src/pages/DashboardPage.tsx` |
| 5.8 | Probar | Navegador y build |

---

## Paso 5.0 — Verificar el punto de partida

> **¿Qué hace?** Confirma que la aplicación existente funciona antes de agregar más operaciones.
>
> **¿Por qué importa?** Si la lista o la creación ya fallan, conviene resolver ese problema antes de añadir edición y eliminación.

Desde la raíz de `jwt-auth-demo`:

```bash
npm install
npm run dev
```

Comprueba:

1. Puedes iniciar sesión con `ana` / `ana123`.
2. El dashboard carga la lista mediante `GET /projects`.
3. El formulario crea un proyecto mediante `POST /projects`.
4. Al crear, la lista se actualiza.

Detén el servidor con `Ctrl+C` antes de continuar si necesitas volver a usar la terminal.

---

## Paso 5.1 — 🆕 Crear carpetas y archivos faltantes

> **¿Qué hace?** Garantiza que existan las carpetas y crea los dos archivos nuevos de esta fase.
>
> **¿Por qué importa?** El servicio ya existe y se modificará; el hook de acciones y el componente de cada proyecto todavía no existen en el código base.

Ejecuta desde la raíz del proyecto:

```bash
mkdir -p src/hooks src/components

touch \
  src/hooks/useProjectActions.ts \
  src/components/ProjectItem.tsx
```

> `mkdir -p` no borra carpetas existentes. `touch` tampoco reemplaza el contenido si el archivo ya existe, pero en este proyecto ambos archivos deberían ser nuevos.

No uses `touch` para los siguientes archivos porque ya existen y se van a **modificar**:

```text
src/types.ts
src/services/projectService.ts
src/components/ProjectList.tsx
src/pages/DashboardPage.tsx
```

---

## Paso 5.2 — ✏️ Modificar `src/types.ts`

> **¿Qué hace?** Agrega el tipo `UpdateProject`, que representa el cuerpo enviado por el `PUT`.
>
> **¿Por qué importa?** Aunque crear y reemplazar usan los mismos campos, los nombres `NewProject` y `UpdateProject` comunican la intención de cada llamada.

Reemplaza el contenido de `src/types.ts` por:

```ts
export interface AuthResponse {
  token: string
}

export interface Project {
  id: number
  name: string
  description?: string
  ownerId: number
  createdAt: string
}

export interface NewProject {
  name: string
  description?: string
}

// PUT /projects/{id} recibe los mismos campos editables que POST /projects.
export type UpdateProject = NewProject

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api' : 'https://d3ujwk09smrk9z.cloudfront.net')

export const TOKEN_KEY = 'jwt-auth-demo-token'
```

### Qué cambió

Solo se añadió:

```ts
export type UpdateProject = NewProject
```

No incluimos `id`, `ownerId` ni `createdAt` en el cuerpo porque esos valores los conserva el backend.

---

## Paso 5.3 — ✏️ Modificar `src/services/projectService.ts`

> **¿Qué hace?** Conserva `GET` y `POST`, y agrega las funciones `updateProject()` y `deleteProject()`.
>
> **¿Por qué importa?** Todas las llamadas HTTP de Projects permanecen en una capa sin React. El interceptor de `httpClient` agrega el JWT automáticamente.

Reemplaza todo el contenido por:

```ts
import type { NewProject, Project, UpdateProject } from '../types'
import { httpClient } from './httpClient'

export async function getProjects(): Promise<Project[]> {
  const { data } = await httpClient.get<Project[]>('/projects')
  return data
}

export async function createProject(body: NewProject): Promise<Project> {
  const { data } = await httpClient.post<Project>('/projects', body)
  return data
}

export async function updateProject(
  id: number,
  body: UpdateProject,
): Promise<Project> {
  const { data } = await httpClient.put<Project>(`/projects/${id}`, body)
  return data
}

export async function deleteProject(id: number): Promise<void> {
  await httpClient.delete(`/projects/${id}`)
}
```

### Qué cambió

| Función | Método Axios | Endpoint |
| --- | --- | --- |
| `getProjects()` | `httpClient.get` | `GET /projects` |
| `createProject()` | `httpClient.post` | `POST /projects` |
| `updateProject()` | `httpClient.put` | `PUT /projects/{id}` |
| `deleteProject()` | `httpClient.delete` | `DELETE /projects/{id}` |

### Por qué `deleteProject()` devuelve `Promise<void>`

La interfaz no necesita datos del cuerpo de la respuesta. Solo necesita saber si la promesa:

- Se resolvió: la eliminación terminó y se puede recargar la lista.
- Fue rechazada: se muestra el error de la API.

### ⚠️ Por qué no agregamos `patchProject()`

Este código sería sintácticamente válido en Axios:

```ts
// No agregar: la API actual no ofrece este endpoint.
httpClient.patch(`/projects/${id}`, body)
```

Pero el servidor no publica esa ruta. El método HTTP debe existir en el contrato del backend; Axios no puede crearlo desde el frontend.

---

## Paso 5.4 — 🆕 Llenar `src/hooks/useProjectActions.ts`

> **¿Qué hace?** Maneja el modo edición, los campos controlados, la validación, el estado de guardado, el estado de eliminación y los errores.
>
> **¿Por qué importa?** Mantiene la lógica fuera del componente visual y sigue el patrón servicio → hook → componente del proyecto base.

Pega este contenido:

```ts
import { useState, type FormEvent } from 'react'
import { deleteProject, updateProject } from '../services/projectService'
import type { Project } from '../types'

interface UseProjectActionsOptions {
  project: Project
  onSuccess?: () => void
}

export function useProjectActions({
  project,
  onSuccess,
}: UseProjectActionsOptions) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState(project.description ?? '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const valid = name.trim().length >= 3 && name.trim().length <= 80
  const busy = saving || deleting

  function startEditing() {
    setName(project.name)
    setDescription(project.description ?? '')
    setError(null)
    setEditing(true)
  }

  function cancelEditing() {
    setName(project.name)
    setDescription(project.description ?? '')
    setError(null)
    setEditing(false)
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!valid || busy) return

    setSaving(true)
    setError(null)

    try {
      await updateProject(project.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      })
      setEditing(false)
      onSuccess?.()
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Error al actualizar el proyecto',
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (busy) return

    setDeleting(true)
    setError(null)

    try {
      await deleteProject(project.id)
      onSuccess?.()
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Error al eliminar el proyecto',
      )
    } finally {
      setDeleting(false)
    }
  }

  return {
    editing,
    name,
    setName,
    description,
    setDescription,
    saving,
    deleting,
    error,
    valid,
    busy,
    startEditing,
    cancelEditing,
    handleUpdate,
    handleDelete,
  }
}
```

### Estados que administra el hook

| Estado | Para qué sirve |
| --- | --- |
| `editing` | Decide si se muestra el proyecto o el formulario de edición |
| `name` | Nombre editable y controlado |
| `description` | Descripción editable y controlada |
| `saving` | Evita guardar dos veces y cambia el texto del botón |
| `deleting` | Evita eliminar dos veces y cambia el texto del botón |
| `error` | Muestra errores HTTP o inesperados |
| `valid` | Exige un nombre de 3 a 80 caracteres |
| `busy` | Bloquea acciones simultáneas |

### Flujo de actualización

```text
submit del formulario
    → handleUpdate()
    → updateProject(project.id, body)
    → PUT /projects/{id}
    → onSuccess()
    → refetch()
```

### Flujo de eliminación

```text
confirmación del usuario
    → handleDelete()
    → deleteProject(project.id)
    → DELETE /projects/{id}
    → onSuccess()
    → refetch()
```

---

## Paso 5.5 — 🆕 Llenar `src/components/ProjectItem.tsx`

> **¿Qué hace?** Renderiza un proyecto individual. Alterna entre modo lectura y modo edición, muestra los botones y solicita confirmación antes de eliminar.
>
> **¿Por qué importa?** `ProjectList` conserva la responsabilidad de mostrar la colección, mientras `ProjectItem` se ocupa de las acciones de un solo proyecto.

Pega este contenido:

```tsx
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useProjectActions } from '../hooks/useProjectActions'
import type { Project } from '../types'

interface ProjectItemProps {
  project: Project
  onChanged: () => void
}

export function ProjectItem({ project, onChanged }: ProjectItemProps) {
  const actions = useProjectActions({
    project,
    onSuccess: onChanged,
  })

  function confirmDelete() {
    const confirmed = window.confirm(
      `¿Eliminar el proyecto "${project.name}"? También se eliminarán sus tareas.`,
    )

    if (confirmed) {
      void actions.handleDelete()
    }
  }

  if (actions.editing) {
    return (
      <Paper
        variant="outlined"
        component="form"
        onSubmit={actions.handleUpdate}
        sx={{ p: 2 }}
      >
        <Stack spacing={2}>
          <Typography variant="subtitle1">Editar proyecto #{project.id}</Typography>

          {actions.error && <Alert severity="error">{actions.error}</Alert>}

          <TextField
            label="Nombre"
            value={actions.name}
            onChange={(event) => actions.setName(event.target.value)}
            required
            fullWidth
            helperText="Entre 3 y 80 caracteres"
            inputProps={{ minLength: 3, maxLength: 80 }}
          />

          <TextField
            label="Descripción"
            value={actions.description}
            onChange={(event) => actions.setDescription(event.target.value)}
            fullWidth
            multiline
            rows={2}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={!actions.valid || actions.busy}
            >
              {actions.saving ? 'Guardando…' : 'Guardar cambios'}
            </Button>

            <Button
              type="button"
              startIcon={<CloseIcon />}
              onClick={actions.cancelEditing}
              disabled={actions.busy}
            >
              Cancelar
            </Button>
          </Stack>
        </Stack>
      </Paper>
    )
  }

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        {actions.error && <Alert severity="error">{actions.error}</Alert>}

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'flex-start' }}
          spacing={2}
        >
          <Stack spacing={0.5}>
            <Typography variant="subtitle1">{project.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {project.description || 'Sin descripción'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID {project.id} · Owner {project.ownerId} · Creado {project.createdAt}
            </Typography>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={actions.startEditing}
              disabled={actions.busy}
            >
              Editar
            </Button>

            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={confirmDelete}
              disabled={actions.busy}
            >
              {actions.deleting ? 'Eliminando…' : 'Eliminar'}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  )
}
```

### Por qué la confirmación está en el componente

`window.confirm()` es una decisión de interfaz. El hook solo expone `handleDelete()`; el componente decide cuándo llamarlo.

### ⚠️ Qué sucede con un `403`

Los botones pueden aparecer para todos porque el frontend no tiene que adivinar permisos. La API es la autoridad final:

```text
Owner o ADMIN → eliminación exitosa
USER no-owner → 403 Forbidden → Alert con error
```

Ocultar un botón puede mejorar la experiencia, pero nunca reemplaza la autorización del backend.

---

## Paso 5.6 — ✏️ Modificar `src/components/ProjectList.tsx`

> **¿Qué hace?** Conserva los cuatro estados de UI y delega cada proyecto a `ProjectItem`.
>
> **¿Por qué importa?** La lista sigue sin llamar directamente a la API. Recibe `onChanged`, que permitirá solicitar el `refetch` después de editar o eliminar.

Reemplaza todo el contenido por:

```tsx
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Project } from '../types'
import { ProjectItem } from './ProjectItem'

interface ProjectListProps {
  projects: Project[]
  loading: boolean
  error: string | null
  onChanged: () => void
}

export function ProjectList({
  projects,
  loading,
  error,
  onChanged,
}: ProjectListProps) {
  if (loading) {
    return (
      <Stack alignItems="center" py={4}>
        <CircularProgress />
      </Stack>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (projects.length === 0) {
    return <Typography color="text.secondary">No hay proyectos.</Typography>
  }

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">
        Proyectos ({projects.length})
      </Typography>

      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          onChanged={onChanged}
        />
      ))}
    </Stack>
  )
}
```

### Qué cambió respecto a la Fase 3

- Se quitaron `List`, `ListItem` y `ListItemText`.
- Se importó `ProjectItem`.
- Se agregó la prop `onChanged`.
- Cada elemento ahora puede editarse o eliminarse.
- `loading`, `error`, `empty` y `success` siguen diferenciados.

---

## Paso 5.7 — 🔌 ✏️ Modificar `src/pages/DashboardPage.tsx`

> **¿Qué hace?** Conecta `useProjects().refetch` tanto con el formulario de creación como con cada `ProjectItem`.
>
> **¿Por qué importa?** Este es el punto donde la nueva funcionalidad aparece en pantalla. Sin `onChanged={refetch}`, el servidor se actualizaría, pero la lista visible conservaría temporalmente datos viejos.

Reemplaza todo el contenido por:

```tsx
import LogoutIcon from '@mui/icons-material/Logout'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { ProjectForm } from '../components/ProjectForm'
import { ProjectList } from '../components/ProjectList'
import { useAuth } from '../hooks/useAuth'
import { useProjectForm } from '../hooks/useProjectForm'
import { useProjects } from '../hooks/useProjects'

export function DashboardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { projects, loading, error, refetch } = useProjects()
  const projectForm = useProjectForm({ onSuccess: refetch })

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <Box maxWidth={720} mx="auto" mt={6} px={2}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fase 5 — crear, listar, editar y eliminar proyectos.
          </Typography>
        </Box>

        <Button startIcon={<LogoutIcon />} onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Stack>

      <Paper sx={{ p: 3, mb: 3 }}>
        <ProjectForm {...projectForm} />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <ProjectList
          projects={projects}
          loading={loading}
          error={error}
          onChanged={refetch}
        />
      </Paper>
    </Box>
  )
}
```

### La conexión importante

```tsx
<ProjectList
  projects={projects}
  loading={loading}
  error={error}
  onChanged={refetch}
/>
```

La misma función `refetch` ahora se reutiliza después de:

- `POST`: crear.
- `PUT`: editar.
- `DELETE`: eliminar.

---

## Paso 5.8 — Verificar la Fase 5

Primero valida que TypeScript y Vite puedan generar el build:

```bash
npm run build
```

Después ejecuta la aplicación:

```bash
npm run dev
```

### Prueba completa recomendada

Para evitar un `403` durante la primera prueba puedes iniciar sesión como administrador:

```text
usuario: admin
contraseña: admin123
```

También puedes usar `ana` / `ana123`, crear un proyecto nuevo con esa sesión y trabajar sobre ese proyecto, porque `ana` será su propietaria.

Realiza estos pasos:

1. Inicia sesión.
2. Crea un proyecto llamado `Proyecto CRUD`.
3. Localízalo en la lista.
4. Pulsa **Editar**.
5. Cambia el nombre a `Proyecto CRUD actualizado`.
6. Pulsa **Guardar cambios**.
7. Confirma que la lista muestra el nombre nuevo.
8. Abre DevTools → **Network** y confirma una petición `PUT /projects/{id}` con estado `200`.
9. Pulsa **Eliminar**.
10. Lee la advertencia y acepta la confirmación.
11. Confirma que el proyecto desaparece de la lista.
12. En **Network**, confirma la petición `DELETE /projects/{id}`.

> ⚠️ La eliminación es real y en cascada. Haz la prueba con un proyecto creado específicamente para practicar, no con un proyecto que necesites conservar.

---

# Checklist de entrega

- [ ] Se crearon `useProjectActions.ts` y `ProjectItem.tsx`.
- [ ] `types.ts` exporta `UpdateProject`.
- [ ] `projectService.ts` conserva `GET` y `POST`.
- [ ] `projectService.ts` implementa `PUT /projects/{id}`.
- [ ] `projectService.ts` implementa `DELETE /projects/{id}`.
- [ ] No se llama a un `PATCH /projects/{id}` inexistente.
- [ ] La edición valida un nombre de 3 a 80 caracteres.
- [ ] Los botones se bloquean mientras una operación está en progreso.
- [ ] La eliminación solicita confirmación.
- [ ] Los errores se muestran con `Alert`.
- [ ] Crear, editar y eliminar ejecutan `refetch()`.
- [ ] Los cuatro estados de la lista siguen funcionando.
- [ ] `npm run build` termina sin errores.

---

# Mapa de archivos actualizado

```text
jwt-auth-demo/
└── src/
    ├── types.ts                         ← Fase 5 ✏️
    ├── services/
    │   └── projectService.ts            ← Fase 3 🆕 · Fase 5 ✏️
    ├── hooks/
    │   ├── useProjects.ts               ← Fase 3 🆕
    │   ├── useProjectForm.ts             ← Fase 4 🆕
    │   └── useProjectActions.ts          ← Fase 5 🆕
    ├── components/
    │   ├── ProjectForm.tsx               ← Fase 4 🆕
    │   ├── ProjectList.tsx               ← Fase 3 🆕 · Fase 5 ✏️
    │   └── ProjectItem.tsx               ← Fase 5 🆕
    └── pages/
        └── DashboardPage.tsx             ← Fases 2, 3, 4 y 5 ✏️ 🔌
```

## Mapa por capa

| Capa | Archivo | Responsabilidad |
| --- | --- | --- |
| Tipos | `types.ts` | Define `Project`, `NewProject` y `UpdateProject` |
| Servicio | `projectService.ts` | Ejecuta GET, POST, PUT y DELETE |
| Hook de lista | `useProjects.ts` | Carga proyectos y expone `refetch` |
| Hook de creación | `useProjectForm.ts` | Maneja el POST y el formulario nuevo |
| Hook de acciones | `useProjectActions.ts` | Maneja PUT, DELETE y sus estados |
| Componente de formulario | `ProjectForm.tsx` | Presenta la creación |
| Componente de lista | `ProjectList.tsx` | Presenta loading, error, vacío o colección |
| Componente de elemento | `ProjectItem.tsx` | Presenta edición y eliminación |
| Página | `DashboardPage.tsx` | Conecta todos los hooks y componentes |

---

# Diferencia entre PUT y PATCH en este proyecto

| Concepto | PUT | PATCH |
| --- | --- | --- |
| Intención | Reemplazar la representación editable | Modificar solo una parte |
| Projects en TaskFlow | `PUT /projects/{id}` sí existe | No existe un PATCH de Projects |
| Cuerpo para Projects | `name` obligatorio y `description` opcional | No definido por el backend |
| Implementación frontend | `updateProject()` | No se implementa |

El frontend no decide qué endpoints existen. Primero se revisa Swagger y después se usa el método indicado por el backend.

El PATCH real de TaskFlow es:

```text
PATCH /tasks/{id}/status
```

Recibe:

```json
{
  "status": "IN_PROGRESS"
}
```

Sus valores válidos son `TODO`, `IN_PROGRESS` y `DONE`. Esa funcionalidad debe añadirse en una fase separada de **Tasks**, junto con sus tipos, servicio, hook y componente; no pertenece al CRUD de Projects de esta guía.

---

# Errores comunes

## Intentar enviar solo `description` con PUT

Esto no cumple el `ProjectRequest` porque `name` es obligatorio:

```ts
// Incorrecto para el PUT definido por esta API.
await httpClient.put(`/projects/${id}`, {
  description: 'Descripción nueva',
})
```

Envía ambos campos editables:

```ts
await updateProject(id, {
  name: project.name,
  description: 'Descripción nueva',
})
```

## Usar PATCH solo porque cambia un campo

La intención semántica no crea una ruta en el servidor. Si Swagger no expone `PATCH /projects/{id}`, la aplicación debe usar el `PUT` definido por la API.

## Mandar `id`, `ownerId` o `createdAt`

No es necesario. El backend conserva esos valores. El cuerpo correcto contiene únicamente:

```ts
{
  name: string
  description?: string
}
```

## No hacer `refetch()`

La operación puede terminar correctamente en el servidor, pero la pantalla continuará mostrando el estado anterior hasta volver a cargar. Por eso `onSuccess` llama a `refetch`.

## Eliminar un proyecto ajeno con un usuario normal

La API responde `403`. Prueba con el owner o con `admin`.

## Olvidar que DELETE elimina las tareas

La API aplica eliminación en cascada. La confirmación lo advierte antes de continuar.

---

# Resumen final

```text
GET     /projects       → getProjects()       → useProjects()
POST    /projects       → createProject()     → useProjectForm()
PUT     /projects/{id}  → updateProject()     → useProjectActions()
DELETE  /projects/{id}  → deleteProject()     → useProjectActions()
PATCH   /projects/{id}  → no existe en Swagger
```

> **Servicio** = cómo se llama a la API · **Hook** = estado y flujo · **Componente** = lo que ve y activa el usuario
