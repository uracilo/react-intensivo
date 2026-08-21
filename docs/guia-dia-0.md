# Guía Día 0 — HTML, CSS y JavaScript

**Tiempo:** 4–6 horas  
**Demo final:** [`demos/00-web-basica/`](../demos/00-web-basica/)  
**Objetivo:** Que el alumno entienda qué es una página web y manipule el DOM antes de React.

---

## Qué explicar (30–45 min)

1. El navegador recibe **HTML** (estructura), **CSS** (apariencia) y **JS** (comportamiento).
2. HTML no “hace” nada solo: es un documento.
3. El **DOM** es el árbol de nodos que JS puede leer y cambiar.
4. En vanilla JS vos pintás la pantalla a mano. En React (Día 1) describís el resultado y React actualiza el DOM.

---

## Paso 1 — Crear los tres archivos

En una carpeta vacía (o en `demos/00-web-basica/`):

```
index.html
styles.css
app.js
```

Abrí `index.html` en el navegador. Deberías ver una página (aunque vacía).

**Checkpoint:** Si cambia el HTML y recargás (Cmd/Ctrl+R), se ve el cambio.

---

## Paso 2 — Esqueleto HTML

Escribí en `index.html`:

- `<!DOCTYPE html>`, `<html lang="es">`
- `<head>` con charset, viewport, título y `<link rel="stylesheet" href="styles.css">`
- `<body>` con:
  - un `<header>` con el nombre **TaskFlow**
  - un `<form id="task-form">` con input de título y botón Agregar
  - un `<ul id="task-list">`
  - `<script src="app.js"></script>` al final del body

**Checkpoint:** Se ve el formulario y el encabezado (sin estilo fino aún).

---

## Paso 3 — CSS básico

En `styles.css`:

1. `box-sizing: border-box` en `*`
2. Colores con variables `:root`
3. Layout del formulario y de cada ítem con **flexbox**
4. Clase `.done` con `text-decoration: line-through`

Compará con la demo de referencia si te trabás.

**Checkpoint:** La página se ve ordenada, no “documento Word crudo”.

---

## Paso 4 — Estado en memoria

En `app.js`:

```js
let tasks = [
  { id: 1, title: 'Definir modelo Task en Java', done: true },
  { id: 2, title: 'Exponer GET /tasks', done: false },
]
```

Explicá: **el array es la fuente de verdad**. El HTML se regenera a partir de él.

---

## Paso 5 — Función `render()`

1. Vaciar `#task-list` (`innerHTML = ''`)
2. Por cada tarea, crear un `<li>` con checkbox, título y botón Borrar
3. Actualizar el contador

**Checkpoint:** Al cargar la página se ven las 2 tareas seed.

---

## Paso 6 — Eventos

- `submit` del form → `preventDefault()` → `addTask(title)`
- `change` del checkbox → `toggleTask(id)`
- `click` en Borrar → `deleteTask(id)`

Después de cada cambio: llamar `render()`.

**Checkpoint:** Agregar / marcar / borrar funciona sin recargar la página.

---

## Paso 7 — Validación simple

Si el título tiene menos de 3 caracteres, mostrar un mensaje de error (misma regla que el backend Java).

---

## Reto (20 min)

- Filtrar: mostrar solo pendientes.
- O guardar en `localStorage` para que no se pierdan al recargar.

---

## Puente a React (5 min)

Mostrá este contraste:

| Vanilla JS | React (mañana) |
|------------|----------------|
| `innerHTML = ''` + crear nodos | `tasks.map(t => <TaskCard />)` |
| Actualizar a mano 3 lugares | Un solo `setTasks` re-renderiza |
| Fácil desincronizar UI y datos | UI = f(estado) |

No escriban jQuery: solo mencioná que `$('#x').append(...)` era el estilo 2006–2015.
