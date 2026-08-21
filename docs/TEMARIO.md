# Temario — React Intensivo · TaskFlow

**Duración:** 5 días · ~8 h/día (+ Día 0 de fundamentos web)  
**Proyecto:** Frontend TaskFlow alineado a Spring Boot REST + JWT  
**Audiencia:** Backend / QE sin experiencia previa en HTML/CSS/JS

## Día 0 — La web básica (HTML, CSS, JS)

- Qué es un documento HTML: estructura, etiquetas semánticas
- CSS: box model, flexbox, clases
- JavaScript: variables, funciones, DOM (`querySelector`, eventos)
- Práctica: lista de tareas (agregar / marcar hecha)
- Teoría corta: por qué jQuery existió y por qué React lo reemplazó

## Día 1 — Fundamentos React + TypeScript

- Vite: crear y correr un proyecto
- JSX/TSX, componentes, props
- Tipos `Task`, `Project`, enums de estado/prioridad
- Listas con `.map()` y `key`
- Entregable: grid de cards con datos seed

## Día 2 — Estado y formularios

- `useState` e inmutabilidad
- Formularios controlados
- Validación: título 3–120, fecha no pasada
- Entregable: alta y borrado de tareas en memoria

## Día 3 — Datos asíncronos y hooks

- `useEffect`, `fetch`, promesas / async-await
- Estados loading / error / empty / success
- Custom hook `useTasks`
- Entregable: lista con filtros contra API mock

## Día 4 — SPA, Router y CRUD

- React Router (HashRouter para GitHub Pages)
- Rutas: dashboard, projects, tasks
- CRUD completo + localStorage
- Entregable: SPA navegable

## Día 5 — TaskFlow + JWT + API real

- `POST /auth/login`, Bearer token
- Cliente API + fallback demo
- Guards de rutas (login requerido)
- Entregable: app conectada a Spring (o demo offline)

## Bonus (opcional, no bloquea)

- PWA, tema claro/oscuro, más `data-testid` para Selenium
