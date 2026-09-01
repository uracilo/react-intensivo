# Para el instructor

## Ritmo sugerido (40 h)

| Bloque | Horas | Foco |
|--------|------:|------|
| Día 0 | 4–6 | HTML/CSS/JS (opcional) |
| Día 1 | 8 | Setup + MUI + user cards |
| Día 2 | 8 | useState + forms + refs + effects |
| Día 3 | 8 | useFetch<T> + JSONPlaceholder |
| Día 4 | 8 | json-server + Axios + Router |
| Día 5 | 8 | Context + theme + toast + deploy |

## Metodología por concepto

1. **Teoría** — qué es, por qué existe, cuándo usarlo  
2. **Demostración** — instructor codea en vivo paso a paso  
3. **Práctica** — alumno replica desde cero con la guía cerrada  

Mini-practices: **10–25 min** (demo + práctica). El slack del día absorbe breaks, Q&A y trabas de nivel junior.

## Checkpoints por día

- **D0:** Agregar / marcar / borrar sin recargar.
- **D1:** 5 user cards MUI; admins en negrita.
- **D2:** TODO add/toggle/delete; input con focus al cargar; submit deshabilitado si vacío.
- **D3:** `/users` y `/posts` con spinner, error, paginación y búsqueda; mismo `useFetch<T>`.
- **D4:** CRUD persistente json-server; rutas protegidas; env vars.
- **D5:** Dark mode, toast global, error boundary; deploy público.

## Cómo usar las demos

Cada carpeta en `demos/` es el **resultado final** del día.  
Las guías enseñan a reconstruirla vía mini-practices.

En clase: proyectá la demo, codeáis juntos siguiendo la guía del integrador.

## Tip

- Día 1: reservar ~2.5 h para setup; es inversión que evita fricción toda la semana.
- Día 4: json-server en terminal separada **siempre**.
- Día 5: no reintroducir auth JWT — el temario usa Context para theme/toast, no login.
