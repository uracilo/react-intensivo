# Día 1 — Fundamentos React + TypeScript

## De HTML a componentes
Ayer: archivos separados.  
Hoy: un componente agrupa marcado + lógica + props.

---

## Vite
Herramienta que sirve el proyecto en desarrollo.  
`npm run dev` → http://localhost:5173

---

## JSX
Parece HTML dentro de JavaScript.  
Reglas: un padre, `className`, tags cerrados.

---

## TypeScript = contrato
```ts
interface Task {
  id: number
  title: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
}
```
Mismo dominio que el backend Java.

---

## Props
Padre pasa datos → hijo los muestra.  
Las props no se mutan.

---

## Listas y key
```tsx
tasks.map(task => <TaskCard key={task.id} task={task} />)
```
La key ayuda a React a reconciliar.

---

## Práctica
Grid de cards con MOCK_TASKS (seed ana/luis)
