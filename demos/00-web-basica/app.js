/**
 * Día 0 — TaskFlow con JavaScript vanilla
 * Ideas clave: estado en memoria + pintar el DOM a mano
 */

const form = document.querySelector('#task-form')
const titleInput = document.querySelector('#task-title')
const formError = document.querySelector('#form-error')
const taskList = document.querySelector('#task-list')
const taskCount = document.querySelector('#task-count')
const emptyState = document.querySelector('#empty-state')

/** @type {{ id: number, title: string, done: boolean }[]} */
let tasks = [
  { id: 1, title: 'Definir modelo Task en Java', done: true },
  { id: 2, title: 'Exponer GET /tasks', done: false },
]

let nextId = 3

function render() {
  taskList.innerHTML = ''

  tasks.forEach((task) => {
    const li = document.createElement('li')
    li.className = `task-item${task.done ? ' done' : ''}`
    li.dataset.id = String(task.id)

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = task.done
    checkbox.setAttribute('aria-label', `Marcar "${task.title}"`)
    checkbox.addEventListener('change', () => toggleTask(task.id))

    const title = document.createElement('p')
    title.className = 'task-title'
    title.textContent = task.title

    const removeBtn = document.createElement('button')
    removeBtn.type = 'button'
    removeBtn.className = 'btn ghost'
    removeBtn.textContent = 'Borrar'
    removeBtn.addEventListener('click', () => deleteTask(task.id))

    li.append(checkbox, title, removeBtn)
    taskList.append(li)
  })

  taskCount.textContent = `${tasks.length} tarea${tasks.length === 1 ? '' : 's'}`
  emptyState.hidden = tasks.length > 0
}

function addTask(title) {
  const trimmed = title.trim()
  if (trimmed.length < 3) {
    showError('El título debe tener al menos 3 caracteres.')
    return
  }
  if (trimmed.length > 120) {
    showError('El título no puede superar 120 caracteres.')
    return
  }

  tasks = [{ id: nextId++, title: trimmed, done: false }, ...tasks]
  hideError()
  titleInput.value = ''
  titleInput.focus()
  render()
  console.log('Tarea agregada. Estado actual:', tasks)
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task,
  )
  render()
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id)
  render()
}

function showError(message) {
  formError.textContent = message
  formError.hidden = false
}

function hideError() {
  formError.hidden = true
  formError.textContent = ''
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  addTask(titleInput.value)
})

render()
