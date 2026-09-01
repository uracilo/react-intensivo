# Guía Día 1 — Setup, TypeScript, JSX, MUI

**Demo:** [`demos/01-fundamentos/`](../demos/01-fundamentos/)  
**Tiempo:** ~8 h (~2.5 h setup + ~4 h contenido + ~1.5 h slack)

## Estructura del día

| Bloque | Duración | Contenido |
|--------|----------|-----------|
| Setup | ~2.5 h | Ver [`setup-dia-1.md`](setup-dia-1.md) |
| Topics | ~30 min | React, SPA, TS, JSX, styling overview |
| Mini-practices | ~2 h | 10 ejercicios aislados |
| Integrador | ~1.5 h | 5 user cards con MUI |
| Deliverable | — | Push al repo |

## Topics (~30 min)

- Qué es React, SPA, CSR vs SSR (conceptual)
- TypeScript: primitivos, interfaces, `?`, union types
- JSX: `{}`, `className`, fragments
- Styling en React (teoría): CSS global vs CSS Modules — **no se practica**; la semana usa MUI
- Componentes funcionales tipados, props, `children`, render condicional, listas + `key`
- MUI: instalación, `ThemeProvider`, `Box`, `Stack`, `Typography`, `Button`, `Card`, `Avatar`, `sx`

## Mini-practices (~2 h)

1. **Tipos básicos** (~10 min): variables tipadas, función tipada, forzar error TS
2. **JSX simple** (~10 min): `<h1>` con variable interpolada
3. **Componente con prop** (~15 min): `<Greeting name="..." />`
4. **Prop opcional** (~10 min): `age?: number`, render con `&&`
5. **children** (~15 min): `<Box>` con borde que envuelve children
6. **Lista simple** (~10 min): array de strings → `<ul><li>`
7. **Lista de objetos** (~15 min): `[{id, name}]` con `key={item.id}`
8. **MUI install** (~20 min): `@mui/material @emotion/react @emotion/styled`, primer `<Button>`
9. **MUI layout** (~15 min): `<Stack direction="row">`, `sx` para padding/margin
10. **Imágenes** (~15 min): `<Avatar src={...} />` (URL o import)

## Integrador (~1.5 h)

Lista de 5 user cards desde `User[]`. Cada card: `<Card>`, `<Avatar>`, `<Typography>` name/role, `<Stack>`. Si `role === 'admin'`, nombre en **bold**.

## Pasos (demo final)

1. Seguí [`setup-dia-1.md`](setup-dia-1.md) o cloná esta demo
2. `npm i @mui/material @emotion/react @emotion/styled`
3. Creá `src/types.ts` con `User` y `MOCK_USERS`
4. Creá `UserCard` y `UserGrid`
5. En `App`, envolvé con `<ThemeProvider theme={createTheme()}>`

## Checkpoint

`npm run dev:01` → 5 cards MUI; admins en negrita.

## Deliverable

```bash
git add . && git commit -m "feat: day 1 — user cards with MUI" && git push
```
