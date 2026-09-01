# Guía Día 2 — Estado, formularios, refs, useEffect

**Demo:** [`demos/02-estado/`](../demos/02-estado/)  
**Tiempo:** ~8 h (~5.5 h contenido + ~2.5 h slack)

## Topics (~1 h)

- MUI Styled API: `styled()` vs `sx`
- Reglas de Hooks, `useState<T>`, updater `setX(prev => ...)`
- Eventos tipados, inmutabilidad
- Forms controlados (`<TextField>`) y no controlados (`ref`)
- Validación: required, regex, `helperText` + `error`, submit deshabilitado
- Lifting state up, `useRef`, `useEffect` (3 casos) + cleanup

## Mini-practices (~3.25 h)

1. Counter (~10 min) 2. Counter ± (~10 min) 3. Toggle (~10 min)
4. Input controlado (~15 min) 5. Add to list (~20 min) 6. Delete (~15 min)
7. Update object (~20 min) 8. Validación form (~20 min) 9. Lifting state (~25 min)
10. useRef focus (~15 min) 11. useEffect 3 casos (~25 min) 12. Cleanup interval (~15 min)
13. MUI `styled(ListItem)` (~20 min)

## Integrador (~1.25 h)

TODO list MUI: `<TextField>` + `<Button>` add, `<List>` con `<Checkbox>` + delete. Validación: no agregar vacíos. Bonus: focus al cargar (`useRef` + `useEffect([])`). Usar `StyledListItem` de mini-practice 13.

## Pasos (demo final)

1. Partí de la demo del Día 1 o abrí `demos/02-estado`
2. `useState<TodoItem[]>` para la lista
3. `StyledListItem` con `styled(ListItem)`
4. Input ref + `useEffect` para autofocus

## Checkpoint

Agregar / completar / borrar tareas; botón deshabilitado si input vacío; focus al cargar.

## Deliverable

```bash
git commit -m "feat: day 2 — MUI todo list with refs and effects"
```
