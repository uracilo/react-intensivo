# Guía Día 4 — TaskFlow API + Axios + React Router

**Demo:** [`demos/04-crud-router/`](../demos/04-crud-router/)  
**API:** [Swagger UI](https://d3ujwk09smrk9z.cloudfront.net/swagger-ui/index.html) · [`docs/API.md`](API.md)  
**Tiempo:** ~8 h (~6 h contenido + ~2 h slack)

## Topics

- API REST TaskFlow (Spring Boot) vs json-server local
- JWT: `POST /auth/login`, header `Authorization: Bearer …`
- CRUD proyectos y tareas con Axios
- Errores HTTP, variables de entorno (`VITE_API_URL`)
- React Router v6: rutas dinámicas y protegidas

## Integrador (~1.25 h)

App contra `https://d3ujwk09smrk9z.cloudfront.net`:

- Login `ana` / `ana123`
- `/projects`, `/projects/:id`, `/projects/new`
- `/tasks`, `/tasks/:id`, `/tasks/new`
- POST crear, PATCH estado, DELETE tarea
- Feedback inline con `<Alert>`

## Pasos (demo final)

```bash
cd demos/04-crud-router
cp .env.example .env.local   # opcional — ya apunta a la API remota
npm run dev
```

1. `api/client.ts` — Axios + interceptor JWT
2. `api/taskflowApi.ts` — projects + tasks
3. Rutas CRUD + `<ProtectedRoute>`

## Checkpoint

Login → listar proyectos → crear tarea → cambiar estado → borrar. Token persiste en `localStorage`.

## Deliverable

```bash
git commit -m "feat: day 4 — TaskFlow CRUD with JWT and routing"
```
