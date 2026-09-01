# Guía Día 5 — Context, theme, toast, error boundaries, deploy

**Demo:** [`demos/05-taskflow/`](../demos/05-taskflow/)  
**Tiempo:** ~8 h (~6.75 h contenido + ~1.25 h slack)

## Topics (~45 min)

- `useContext`, Provider tipado, custom hook con guard
- Cuándo NO usar Context
- MUI `ThemeProvider` + dark mode, `<Snackbar>` global
- Error boundaries (class component), a11y básica

## Mini-practices (~2 h)

1. Context mínimo (~15 min) 2. Provider con state (~20 min) 3. Tipar context (~15 min)
4. Hook con guard (~20 min) 5. Dark mode MUI (~25 min) 6. Toast Snackbar (~25 min)
7. Error boundary (~30 min)

## Integrador (~3.5 h)

**Continuidad:** extender la app del Día 4 (no empezar de cero).

Agregar:
1. `ThemeContext` + toggle dark/light en navbar
2. `ToastContext` — reemplazar `<Alert>` inline por toast global
3. `<ErrorBoundary>` envolviendo la app
4. a11y: `aria-label` en icon buttons, focus visible
5. Polish visual: `<Card>`, `<Stack>`, spacing consistente

Bonus: debounced search, paginación, theme en localStorage.

## Deploy (~30 min)

1. Push a GitHub
2. [Vercel](https://vercel.com) o [Netlify](https://netlify.com) → import repo
3. Variable `VITE_API_URL` en dashboard (prod puede apuntar a API mock o deshabilitada)

## Checkpoint

Toggle theme, toast en create/delete, fallback si hay error; app pública en Vercel/Netlify.

## Deliverable

```bash
git commit -m "feat: day 5 — context, theme, toast, error boundary"
git push
# Deploy desde Vercel/Netlify
```
