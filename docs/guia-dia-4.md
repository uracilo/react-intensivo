# Guía Día 4 — json-server, Axios, React Router CRUD

**Demo:** [`demos/04-crud-router/`](../demos/04-crud-router/)  
**Tiempo:** ~8 h (~6 h contenido + ~2 h slack)

## Topics

- json-server vs JSONPlaceholder (CRUD persistente)
- POST / PUT / DELETE, headers `Content-Type`
- Errores HTTP, Axios, `.env.local` + `import.meta.env.VITE_*`
- React Router v6: rutas dinámicas, `useParams`, `useNavigate`, rutas protegidas

## Mini-practices — API (~2 h)

1. json-server setup (~10 min) 2. POST (~25 min) 3. PUT (~20 min) 4. DELETE (~15 min)
5. HTTP errors (~20 min) 6. Env vars (~15 min) 7. Axios (~20 min)

## Mini-practices — Router (~1.2 h)

8. Router mínimo (~15 min) 9. Ruta dinámica (~15 min) 10. `useNavigate(-1)` (~15 min)
11. Ruta protegida (~25 min)

## Integrador (~1.25 h)

Extender Día 3: `/users`, `/users/:id`, `/users/new`. POST create, DELETE en detalle. Reutilizar `useFetch<T>`. Feedback inline con `<Alert>`.

## Pasos (demo final)

```bash
cd demos/04-crud-router
npm run api    # terminal 1 — :3001
npm run dev    # terminal 2
```

1. `db.json` con users seed
2. `api/usersApi.ts` con Axios + `VITE_API_URL`
3. Rutas CRUD + `<ProtectedRoute>` (login hardcodeado)

## Checkpoint

Crear → ver detalle → borrar; datos persisten en `db.json`; redirect a `/login` sin auth.

## Deliverable

```bash
git commit -m "feat: day 4 — json-server CRUD with routing"
```
