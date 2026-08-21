# Día 2 — Estado y formularios

## El problema
UI estática no alcanza: hay que agregar y borrar tareas.

---

## useState
```tsx
const [tasks, setTasks] = useState(MOCK_TASKS)
```
Cambiar estado → React vuelve a dibujar.

---

## Inmutabilidad
Mal: `tasks.push(x)`  
Bien: `setTasks([...tasks, x])`

---

## Formularios controlados
El estado es la fuente de verdad del input:  
`value={title}` + `onChange={…}`

---

## Validación (igual que Java)
- Título 3–120 caracteres  
- Fecha no pasada al crear

---

## Lifting state up
Formulario dispara `onAdd`  
Padre actualiza `tasks`  
Grid se re-renderiza solo

---

## Práctica
CRUD en memoria: alta + borrado con mensajes de error
