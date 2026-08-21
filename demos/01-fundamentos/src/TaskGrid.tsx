import type { Task } from './types'
import { TaskCard } from './TaskCard'

interface TaskGridProps {
  tasks: Task[]
}

export function TaskGrid({ tasks }: TaskGridProps) {
  return (
    <div className="grid">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
