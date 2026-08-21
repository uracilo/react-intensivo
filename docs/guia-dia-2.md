# Guía Día 2 — Estado y formularios

**Demo:** [`demos/02-estado/`](../demos/02-estado/)  
**Tiempo:** 8 h

## Qué explicar

1. `useState` guarda datos que, al cambiar, **re-renderizan** la UI.
2. No mutés arrays: usá `[...tasks, nueva]` / `filter`.
3. Formulario **controlado**: `value` + `onChange`.
4. Validación alineada a Java: título 3–120, fecha no pasada.

## Pasos

1. Partí de la demo del Día 1.
2. En `App`: `const [tasks, setTasks] = useState(MOCK_TASKS)`.
3. Creá `TaskForm` con campos título, descripción, prioridad, fecha, proyecto.
4. Al submit: validar → `onAdd(data)` → padre hace `setTasks`.
5. Agregá botón Borrar en cada card → `setTasks(prev => prev.filter(...))`.

## Checkpoint

Agregar una tarea actualiza el grid; título corto muestra error.

## Reto

Deshabilitar el botón Guardar mientras hay errores.
