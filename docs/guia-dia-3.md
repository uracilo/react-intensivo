# Guía Día 3 — Datos asíncronos y custom hooks

**Demo:** [`demos/03-datos/`](../demos/03-datos/)  
**Tiempo:** 8 h

## Qué explicar

1. `useEffect` sincroniza React con el “mundo exterior” (API, timers).
2. Los 4 estados de UI: loading / error / empty / success.
3. Un **custom hook** (`useTasks`) encapsula fetch + estados.
4. Cleanup: flag `cancelled` para evitar setState tras desmontar.

## Pasos

1. Creá `api/tasksApi.ts` con `fetchTasks(filters)` que filtra `MOCK_TASKS` tras `await delay(400)`.
2. Creá `hooks/useTasks.ts` que llama a la API cuando cambian los filtros.
3. En `App`, controles de estado / prioridad / búsqueda.
4. Render condicional según loading / error / data.length.

## Checkpoint

Al cambiar filtros ves “Cargando…” y luego la lista filtrada.

## Reto

Botón “Reintentar” cuando hay error (simulá un error aleatorio en la API).
