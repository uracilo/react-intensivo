# TaskFlow — Contrato API

El frontend consume la **misma API** que construyen en Backend (Spring Boot).

- **Base URL local:** `http://localhost:8080`
- **Swagger:** `http://localhost:8080/swagger-ui.html`

## Dominio

Entidades: **User**, **Project**, **Task**.

### Usuarios seed

| username | role  | password |
|----------|-------|----------|
| `ana`    | USER  | `ana123` |
| `luis`   | USER  | `luis123` |
| `admin`  | ADMIN | `admin123` |

### Proyectos seed

- Plataforma TaskFlow (owner: ana)
- App Móvil (owner: luis)
- Migración Legacy (owner: ana)

## Modelos TypeScript

```typescript
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
type Role = 'USER' | 'ADMIN'

interface User { id: number; username: string; role: Role }
interface Project { id: number; name: string; ownerId: number }
interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  dueDate: string
  projectId: number
  assigneeId: number | null
}
```

### Reglas de negocio (validar también en UI)

- Título: **3–120** caracteres → 400
- `dueDate` no puede ser pasada al **crear** → 400
- No marcar `DONE` sin `assigneeId` → 422

## Endpoints

### Auth

```
POST /auth/login   { username, password }  →  { token, ... }
```

Header: `Authorization: Bearer {token}`

### Projects

```
GET    /projects
GET    /projects/{id}
POST   /projects
PUT    /projects/{id}
DELETE /projects/{id}
```

### Tasks

```
GET    /tasks?status=TODO|IN_PROGRESS|DONE
GET    /tasks/{id}
GET    /projects/{id}/tasks
POST   /projects/{id}/tasks
PUT    /tasks/{id}
PATCH  /tasks/{id}/status
DELETE /tasks/{id}
```

## Variables de entorno (Día 5)

```bash
VITE_API_URL=http://localhost:8080
VITE_USE_API=true
```

Si la API no responde, la demo final usa **fallback localStorage**.

## data-testid (QE)

| Elemento | test id |
|----------|---------|
| Login form | `login-form` |
| Projects list | `projects-list` |
| Status filter | `status-filter` |
