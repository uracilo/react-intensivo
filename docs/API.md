# API — TaskFlow (Spring Boot)

**Base URL:** `https://52.87.135.237:8080`  
**Swagger UI:** [https://52.87.135.237:8080/swagger-ui/index.html](https://52.87.135.237:8080/swagger-ui/index.html)

## Autenticación (JWT)

1. `POST /auth/login` con body `{ "username", "password" }` → `{ "token" }`
2. Enviar `Authorization: Bearer <token>` en el resto de endpoints

Usuarios sembrados:

| Usuario | Password |
|---------|----------|
| `ana` | `ana123` |
| `luis` | `luis123` |
| `admin` | `admin123` |

## Endpoints principales (Días 4 y 5)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/info` | Público — nombre y versión |
| POST | `/auth/login` | Login → JWT |
| GET | `/projects` | Lista proyectos |
| POST | `/projects` | Crear proyecto |
| GET | `/projects/{id}` | Detalle proyecto |
| GET | `/projects/{id}/tasks` | Tareas del proyecto |
| DELETE | `/projects/{id}` | Borrar proyecto (ADMIN o owner) |
| GET | `/tasks` | Lista tareas (`?status=` / `?priority=`) |
| GET | `/tasks/{id}` | Detalle tarea |
| POST | `/projects/{projectId}/tasks` | Crear tarea |
| PUT | `/tasks/{id}` | Reemplazar tarea |
| PATCH | `/tasks/{id}/status` | Cambiar estado |
| DELETE | `/tasks/{id}` | Borrar tarea |

## Variables de entorno (frontend)

Copiá `.env.example` a `.env.local` en `demos/04-crud-router` o `demos/05-taskflow`:

```
VITE_API_URL=https://52.87.135.237:8080
```

## Body ejemplo — crear tarea

```json
{
  "title": "Maquetar la portada",
  "description": "Primera versión desktop",
  "priority": "HIGH",
  "assigneeId": 2,
  "dueDate": "2030-12-31"
}
```

Reglas: título 3–120 chars; al crear, `dueDate` no puede ser pasada; pasar a `DONE` sin `assigneeId` → 422.
