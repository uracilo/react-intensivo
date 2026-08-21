# Guía Día 4 — React Router y CRUD

**Demo:** [`demos/04-crud-router/`](../demos/04-crud-router/)  
**Tiempo:** 8 h

## Qué explicar

1. SPA: cambia la URL sin recargar el documento.
2. `HashRouter` funciona bien en GitHub Pages (`#/tasks`).
3. Rutas con params: `/tasks/:id`.
4. Persistencia con `localStorage` simulando REST.

## Pasos

1. `npm i react-router-dom`
2. Definí rutas: `/`, `/projects`, `/projects/:id`, `/tasks`, `/tasks/new`, `/tasks/:id`, `/tasks/:id/edit`
3. `Layout` con `<Outlet />` y links de navegación.
4. Módulo `api/store.ts`: get/create/update/delete sobre localStorage.
5. Páginas dashboard (métricas), listados y formularios de alta/edición.

## Checkpoint

Crear tarea → ver detalle → editar → borrar → lista actualizada. Recargar la página: datos siguen.

## Reto

No permitir `DONE` sin `assigneeId` (regla 422 del backend).
