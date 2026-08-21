import { useState } from 'react'
import type { NewTask, Task } from './types'
import { MOCK_TASKS } from './types'
import { TaskCard } from './TaskCard'
import { TaskForm } from './TaskForm'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS)

  function handleAdd(data: NewTask) {
    setTasks((prev) => {
      const id = Math.max(0, ...prev.map((t) => t.id)) + 1
      return [{ ...data, id }, ...prev]
    })
  }

  function handleDelete(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">TF</span>
          <div>
            <h1>TaskFlow</h1>
            <p className="tagline">Día 2 — useState, formularios y validación</p>
          </div>
        </div>
      </header>

      <section className="panel">
        <h2>Nueva tarea</h2>
        <TaskForm onAdd={handleAdd} />
      </section>

      <section className="panel">
        <h2>Tareas ({tasks.length})</h2>
        <div className="grid">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={handleDelete} />
          ))}
        </div>
      </section>
    </div>
  )
}
