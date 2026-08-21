# Guía Día 5 — TaskFlow + JWT + API

**Demo:** [`demos/05-taskflow/`](../demos/05-taskflow/)  
**Tiempo:** 8 h

## Qué explicar

1. `POST /auth/login` → token JWT.
2. Header `Authorization: Bearer …` en cada request.
3. `AuthContext` + rutas protegidas (`RequireAuth`).
4. Fallback demo si la API Spring no está arriba.

## Pasos

1. Copiá la estructura del Día 4.
2. Creá `api/client.ts` (`login`, `request`, token en localStorage).
3. Creá `api/taskflowApi.ts` con `tryApi(fn, fallback)`.
4. `AuthProvider` + página `/login` (`data-testid="login-form"`).
5. Envolvé rutas privadas con `RequireAuth`.
6. `.env.local`:
   ```
   VITE_API_URL=http://localhost:8080
   VITE_USE_API=true
   ```

## Checkpoint

Login `ana` / `ana123` entra al dashboard. Sin API, igual funciona en modo demo.

## Reto

Mostrar un banner “Modo demo” cuando el token empieza con `demo-token-`.
