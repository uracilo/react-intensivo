# Temario — React Intensivo (MUI + TypeScript)

**Duración:** 5 días · ~8 h/día (+ Día 0 opcional de fundamentos web)  
**Stack:** React 19 · TypeScript · Vite · MUI · React Router v6  
**Audiencia:** Desarrolladores junior / backend sin experiencia previa en React

## Estructura de cada día

1. **Topics** — teoría general del día  
2. **Mini-practices** — una por concepto, aisladas (10–25 min c/u)  
3. **Ejercicio integrador** — une los conceptos del día  
4. **Deliverable** — push al repo antes del día siguiente  

**Flujo por concepto:** Teoría → Demostración (instructor en vivo) → Práctica (alumno replica con la guía cerrada)

---

## Día 0 — Web básica (opcional, 4–6 h)

- HTML, CSS, JavaScript y DOM
- Lista de tareas vanilla (agregar / marcar / borrar)
- Puente conceptual hacia React

## Día 1 — Setup + Fundamentos + MUI (~8 h)

- Setup: Node, Git, VS Code, GitHub, Vite + repo, git flow
- React, SPA, CSR vs SSR (conceptual)
- TypeScript básico, JSX, componentes tipados
- Props, children, render condicional, listas + `key`
- MUI: `ThemeProvider`, `Box`, `Stack`, `Typography`, `Button`, `Card`, `Avatar`, `sx`
- **Entregable:** grid de 5 user cards con MUI

## Día 2 — Estado, formularios, refs, useEffect (~8 h)

- MUI Styled API (`styled()` vs `sx`)
- Reglas de Hooks, `useState<T>`, updater function
- Formularios controlados / no controlados, validación MUI
- Lifting state up, `useRef`, `useEffect` básico + cleanup
- **Entregable:** TODO list funcional con MUI

## Día 3 — Fetch, 4 estados UI, custom hooks (~8 h)

- Fetch + async/await, tipos de respuesta API
- 4 estados: loading / error / empty / success
- `AbortController`, paginación, búsqueda con debounce
- Custom hooks: `useToggle`, `useFetch<T>`
- **Entregable:** vistas `/users` y `/posts` con JSONPlaceholder

## Día 4 — API avanzada + Routing (~8 h)

- json-server (CRUD persistente), POST / PUT / DELETE
- Headers, errores HTTP, Axios, variables de entorno
- React Router v6: rutas dinámicas y protegidas
- **Entregable:** CRUD de users con routing y feedback inline

## Día 5 — Context, theme, toast, error boundaries, deploy (~8 h)

- `useContext`, Provider tipado, custom hook con guard
- MUI `ThemeProvider` + dark mode, `Snackbar` global
- Error boundaries, accesibilidad básica
- Extiende la app del Día 4 (no empezar de cero)
- **Entregable:** app desplegada en Vercel / Netlify
