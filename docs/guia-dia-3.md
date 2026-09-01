# Guía Día 3 — Fetch, 4 estados UI, custom hooks

**Demo:** [`demos/03-datos/`](../demos/03-datos/)  
**Tiempo:** ~8 h (~5 h contenido + ~3 h slack)

## Topics

- Fetch + async/await, 4 estados UI (loading / error / empty / success)
- Tipos para respuestas API, `AbortController`
- Paginación, debounce, MUI: `CircularProgress`, `Alert`, `Pagination`, `InputAdornment`
- Custom hooks: convención `use*`, `useToggle`, `useFetch<T>`

## Mini-practices (~2.5 h)

1. Fetch on mount (~25 min) 2. Tipar respuesta (~15 min) 3. Loading (~10 min)
4. Error (~15 min) 5. Empty (~10 min) 6. AbortController (~20 min)
7. Paginación (~25 min) 8. Debounced search (~25 min) 9. `useToggle` (~20 min)

## Integrador (~2 h)

App contra `jsonplaceholder.typicode.com`:

- **Parte A:** refactor a `useFetch<T>(url)` genérico
- **Parte B:** segunda vista `/posts` reutilizando el mismo hook

## Pasos (demo final)

1. `npm i react-router-dom` en demo 03
2. Creá `hooks/useFetch.ts` y `hooks/useToggle.ts`
3. Rutas `/users` y `/posts` con layout común
4. Paginación client-side + búsqueda con debounce

## Checkpoint

Spinner → datos; error con `<Alert>`; paginación y búsqueda funcionan en ambas vistas.

## Deliverable

```bash
git commit -m "feat: day 3 — useFetch generic hook + users and posts views"
```
