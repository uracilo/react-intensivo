# Guía Día 1 — Fundamentos React + TypeScript

**Demo:** [`demos/01-fundamentos/`](../demos/01-fundamentos/)  
**Tiempo:** 8 h

## Qué explicar

1. Vite crea un servidor de desarrollo con recarga rápida.
2. Un **componente** es una función que devuelve JSX.
3. **Props** = datos de padre → hijo (solo lectura).
4. TypeScript modela el mismo dominio Java: `Task`, `Project`, `TaskStatus`, `Priority`.
5. Listas: `.map()` + `key={id}` (nunca uses el índice si la lista cambia).

## Pasos

1. `npm create vite@latest` → React + TypeScript (o cloná esta demo).
2. Creá `src/types.ts` con interfaces y `MOCK_TASKS` (ver [`docs/API.md`](API.md)).
3. Creá `TaskCard` que recibe `task: Task` y muestra título, descripción, badges.
4. Creá `TaskGrid` que hace `tasks.map(...)`.
5. En `App`, importá `MOCK_TASKS` y renderizá el grid.
6. Aplicá el CSS de la demo (mismas variables que el Día 0).

## Checkpoint

Abrí `npm run dev` y ves 5 tarjetas con estado/prioridad.

## Reto

Mostrar el nombre del proyecto (`projectId` → `MOCK_PROJECTS`).
