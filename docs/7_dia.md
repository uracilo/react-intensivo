# Guía complementaria — Pruebas con Vitest en TaskFlow

**Proyecto base:** `jwt-auth-demo` con React + TypeScript + Vite + Material UI  
**Punto de partida:** CRUD de Projects + PWA  
**Herramientas:** Vitest + React Testing Library + jest-dom + user-event + jsdom  
**Referencia:** [Documentación oficial de Vitest](https://vitest.dev/guide/)  
**Tiempo estimado:** 2–3 horas

Esta fase agrega pruebas automatizadas a la misma aplicación TaskFlow.

Al terminar podrás comprobar automáticamente:

- Que `projectService` utiliza los métodos y rutas correctos de Axios.
- Que `useProjects` maneja loading, success, error y `refetch`.
- Que `useProjectActions` actualiza y elimina proyectos.
- Que `ProjectForm` valida y envía el formulario.
- Que `ProjectList` representa loading, error, empty y success.
- Que `ProtectedRoute` protege el dashboard.
- Que `PwaStatus` muestra disponibilidad offline y actualizaciones.
- Que las pruebas se ejecutan antes del build en GitHub Actions.
- Qué porcentaje del código fue ejecutado por las pruebas.

---

## Contenido

1. Qué es Vitest
2. Qué vamos a probar
3. Tipos de prueba utilizados
4. Preparación y estructura
5. Configuración de Vitest y jsdom
6. Factories y mocks
7. Pruebas de servicios
8. Pruebas de hooks
9. Pruebas de componentes
10. Pruebas de rutas
11. Coverage
12. Integración con GitHub Actions
13. Checklist y errores comunes

---

## 1. ¿Qué es Vitest?

Vitest es un test runner diseñado para trabajar con proyectos de Vite.

Se encarga de:

- Encontrar archivos `.test.ts`, `.test.tsx`, `.spec.ts` o `.spec.tsx`.
- Ejecutar cada prueba.
- Proporcionar `test`, `describe`, `expect`, `vi` y hooks como `beforeEach`.
- Crear mocks y spies.
- Mostrar resultados en modo interactivo o una sola vez.
- Generar reportes de cobertura.

Vitest no reemplaza React Testing Library:

| Herramienta | Responsabilidad |
| --- | --- |
| Vitest | Ejecuta pruebas, assertions y mocks |
| jsdom | Simula `window`, `document` y el DOM |
| React Testing Library | Renderiza componentes y los consulta como lo haría el usuario |
| jest-dom | Agrega assertions como `toBeInTheDocument()` |
| user-event | Simula clics y escritura de forma cercana al uso real |

La idea central será:

```text
Arrange → Act → Assert
Preparar → Ejecutar → Comprobar
```

Ejemplo:

```ts
test('suma dos números', () => {
  // Arrange
  const first = 2
  const second = 3

  // Act
  const result = first + second

  // Assert
  expect(result).toBe(5)
})
```

---

## 2. Qué vamos a probar

### Mapa de pruebas

| Archivo productivo | Archivo de prueba | Qué se comprueba |
| --- | --- | --- |
| `projectService.ts` | `projectService.test.ts` | GET, POST, PUT y DELETE |
| `useProjects.ts` | `useProjects.test.ts` | Loading, datos, error y refetch |
| `useProjectActions.ts` | `useProjectActions.test.ts` | PUT, DELETE, validación y error |
| `ProjectForm.tsx` | `ProjectForm.test.tsx` | Campos, error, validación y submit |
| `ProjectList.tsx` | `ProjectList.test.tsx` | Cuatro estados de UI |
| `ProtectedRoute.tsx` | `ProtectedRoute.test.tsx` | Acceso autorizado y redirección |
| `PwaStatus.tsx` | `PwaStatus.test.tsx` | Offline ready y actualización |

### Qué no se probará directamente con Vitest

Vitest con jsdom no instala realmente una PWA ni ejecuta un service worker completo en Chrome.

Estas comprobaciones siguen realizándose en navegador:

- Manifest válido.
- Service worker instalado y activo.
- Scope correcto en GitHub Pages.
- Instalación desde Chrome, Edge, Android o iOS.
- Navegación real en modo offline.

Sí podemos probar el componente React `PwaStatus`, porque su comportamiento depende de valores que podemos simular.

---

## 3. Tipos de prueba utilizados

### Prueba unitaria

Comprueba una pieza aislada:

```text
projectService.updateProject()
```

La petición real se sustituye por un mock de `httpClient.put`.

### Prueba de hook

Renderiza el hook sin crear manualmente un componente de prueba:

```text
renderHook(() => useProjects())
```

### Prueba de componente

Renderiza JSX dentro de jsdom y busca elementos por su rol, label o texto:

```text
render(<ProjectForm ... />)
screen.getByRole('button', { name: 'Crear proyecto' })
```

### Prueba de integración pequeña

Conecta varias piezas del frontend, por ejemplo React Router + `ProtectedRoute`, sin llamar al backend real.

---

## 4. Leyenda

| Símbolo | Significado |
| --- | --- |
| 📦 | Instalar dependencia |
| 🆕 | Crear archivo nuevo |
| ✏️ | Modificar archivo existente |
| 🧪 | Escribir una prueba |
| 🔌 | Integrar con el flujo existente |
| ✅ | Ejecutar y verificar |
| ⚠️ | Consideración importante |

---

# FASE 7 — Pruebas automatizadas con Vitest

**Pasos de esta fase:** 7.0 → 7.1 → 7.2 → 7.3 → 7.4 → 7.5 → 7.6 → 7.7 → 7.8 → 7.9 → 7.10 → 7.11 → 7.12 → 7.13

| Paso | Acción | Archivo o resultado |
| --- | --- | --- |
| 7.0 | Verificar versiones | Node, Vite y build actual |
| 7.1 | 📦 Instalar dependencias | `package.json`, `package-lock.json` |
| 7.2 | ✏️ Agregar scripts | `package.json` |
| 7.3 | 🆕 Crear carpetas y archivos | Configuración, setup y tests |
| 7.4 | ⚙️ Configurar Vitest | `vitest.config.ts` |
| 7.5 | 🆕 Configurar jsdom | `src/test/setup.ts` |
| 7.6 | 🆕 Crear factory | `src/test/factories.ts` |
| 7.7 | 🆕 Crear mock PWA | `src/test/pwaRegisterMock.ts` |
| 7.8 | 🧪 Probar servicio | `projectService.test.ts` |
| 7.9 | 🧪 Probar hooks | `useProjects.test.ts`, `useProjectActions.test.ts` |
| 7.10 | 🧪 Probar componentes | Form, List y PwaStatus |
| 7.11 | 🧪 Probar ruta protegida | `ProtectedRoute.test.tsx` |
| 7.12 | ✅ Ejecutar pruebas y coverage | Terminal + `coverage/` |
| 7.13 | 🔌 ✏️ Integrar con CI | `.github/workflows/ci.yml`, `.gitignore` |

---

## Paso 7.0 — Verificar el punto de partida

> **¿Qué hace?** Confirma versiones y que el proyecto compila antes de agregar pruebas.
>
> **¿Por qué importa?** La versión actual de Vitest requiere Node 20 o superior y Vite 6 o superior.

Ejecuta:

```bash
node --version
npm list vite
npm run build
```

Debes tener como mínimo:

```text
Node >= 20
Vite >= 6
```

El workflow original ya utiliza Node 20:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 20
```

Si localmente tienes una versión anterior de Node y utilizas `nvm`:

```bash
nvm install 20
nvm use 20
```

---

## Paso 7.1 — 📦 Instalar dependencias

> **¿Qué hace?** Instala el test runner, el entorno DOM, las utilidades de React y el proveedor de coverage.
>
> **¿Por qué importa?** Vitest por sí solo puede probar funciones de JavaScript, pero los componentes React necesitan un DOM simulado y herramientas para consultar la interfaz.

Ejecuta:

```bash
npm install -D \
  vitest \
  jsdom \
  @testing-library/react \
  @testing-library/dom \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @vitest/coverage-v8
```

Este comando modifica:

```text
package.json       ← ✏️ agrega devDependencies
package-lock.json  ← ✏️ fija las versiones instaladas
```

### Para qué sirve cada paquete

| Paquete | Función |
| --- | --- |
| `vitest` | Ejecuta tests, assertions y mocks |
| `jsdom` | Simula el navegador dentro de Node |
| `@testing-library/react` | Renderiza componentes y hooks |
| `@testing-library/dom` | Proporciona las consultas DOM que usa React Testing Library |
| `@testing-library/jest-dom` | Agrega matchers del DOM |
| `@testing-library/user-event` | Simula interacciones del usuario |
| `@vitest/coverage-v8` | Genera cobertura con el motor V8 |

---

## Paso 7.2 — ✏️ Agregar scripts a `package.json`

> **¿Qué hace?** Crea comandos separados para modo watch, ejecución única y coverage.
>
> **¿Por qué importa?** Localmente conviene usar watch; en CI necesitamos que las pruebas terminen y devuelvan un código de salida.

Ejecuta:

```bash
npm pkg set \
  "scripts.test=vitest" \
  "scripts.test:run=vitest run" \
  "scripts.test:coverage=vitest run --coverage"
```

La sección de scripts debe conservar lo anterior y agregar:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "build:pages": "tsc -b && GITHUB_PAGES=true vite build && cp dist/index.html dist/404.html",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Diferencia entre los comandos

| Comando | Comportamiento |
| --- | --- |
| `npm test` | Se queda observando cambios y vuelve a ejecutar |
| `npm run test:run` | Ejecuta una vez y termina |
| `npm run test:coverage` | Ejecuta una vez y genera cobertura |

---

## Paso 7.3 — 🆕 Crear carpetas y archivos faltantes

> **¿Qué hace?** Crea la estructura completa antes de comenzar a pegar código.
>
> **¿Por qué importa?** Los tests permanecen junto al código que prueban y las utilidades compartidas quedan dentro de `src/test/`.

Ejecuta desde la raíz del proyecto:

```bash
mkdir -p \
  src/test \
  src/services \
  src/hooks \
  src/components

touch \
  vitest.config.ts \
  src/test/setup.ts \
  src/test/factories.ts \
  src/test/pwaRegisterMock.ts \
  src/services/projectService.test.ts \
  src/hooks/useProjects.test.ts \
  src/hooks/useProjectActions.test.ts \
  src/components/ProjectForm.test.tsx \
  src/components/ProjectList.test.tsx \
  src/components/PwaStatus.test.tsx \
  src/ProtectedRoute.test.tsx
```

Estos archivos productivos ya existen y **no se modifican** en esta fase:

```text
src/services/projectService.ts
src/hooks/useProjects.ts
src/hooks/useProjectActions.ts
src/components/ProjectForm.tsx
src/components/ProjectList.tsx
src/components/PwaStatus.tsx
src/ProtectedRoute.tsx
```

Los archivos existentes que sí se modificarán al final son:

```text
package.json
package-lock.json
.gitignore
.github/workflows/ci.yml
```

---

## Paso 7.4 — 🆕 Configurar `vitest.config.ts`

> **¿Qué hace?** Configura React, jsdom, setup global, limpieza de mocks, coverage y un reemplazo del módulo virtual de la PWA.
>
> **¿Por qué importa?** Las pruebas deben usar un entorno parecido al navegador sin cargar el service worker real.

Pega este contenido:

```ts
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'virtual:pwa-register/react': fileURLToPath(
        new URL('./src/test/pwaRegisterMock.ts', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
})
```

### Por qué usamos un archivo separado

Vitest puede leer `vite.config.ts`, pero esta app contiene `VitePWA()`. Crear `vitest.config.ts` mantiene separadas estas responsabilidades:

```text
vite.config.ts    → build, proxy, manifest y service worker
vitest.config.ts  → entorno de pruebas, mocks y coverage
```

### Opciones principales

| Opción | Función |
| --- | --- |
| `environment: 'jsdom'` | Crea `window`, `document` y elementos HTML |
| `setupFiles` | Ejecuta el setup antes de cada archivo de tests |
| `css: true` | Permite importar componentes que usan CSS |
| `clearMocks` | Limpia llamadas registradas entre pruebas |
| `restoreMocks` | Restaura spies después de cada prueba |
| `coverage.provider: 'v8'` | Usa el proveedor recomendado de cobertura |

### Alias del módulo PWA

Durante el build, este import lo proporciona `vite-plugin-pwa`:

```ts
import { useRegisterSW } from 'virtual:pwa-register/react'
```

En jsdom no queremos instalar un service worker real. El alias dirige ese import hacia un mock controlable.

---

## Paso 7.5 — 🆕 Crear `src/test/setup.ts`

> **¿Qué hace?** Activa matchers de jest-dom, limpia el DOM después de cada test y simula `matchMedia`.
>
> **¿Por qué importa?** Evita que un componente renderizado contamine la siguiente prueba y proporciona APIs de navegador que Material UI puede consultar.

Pega:

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

Ahora puedes usar assertions como:

```ts
expect(element).toBeInTheDocument()
expect(button).toBeDisabled()
expect(alert).toHaveTextContent('Error')
```

---

## Paso 7.6 — 🆕 Crear `src/test/factories.ts`

> **¿Qué hace?** Crea proyectos válidos para las pruebas y permite sobrescribir solo lo necesario.
>
> **¿Por qué importa?** Evita copiar el mismo objeto completo en todos los archivos.

Pega:

```ts
import type { Project } from '../types'

export function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 1,
    name: 'Proyecto de prueba',
    description: 'Descripción de prueba',
    ownerId: 1,
    createdAt: '2026-09-03',
    ...overrides,
  }
}
```

Ejemplos:

```ts
const defaultProject = makeProject()

const projectWithoutDescription = makeProject({
  id: 2,
  name: 'Sin descripción',
  description: undefined,
})
```

---

## Paso 7.7 — 🆕 Crear `src/test/pwaRegisterMock.ts`

> **¿Qué hace?** Simula los valores devueltos por `useRegisterSW()`.
>
> **¿Por qué importa?** Permite probar `PwaStatus` sin instalar un service worker dentro de jsdom.

Pega:

```ts
import { vi } from 'vitest'

export const pwaRegisterMock = {
  offlineReady: false,
  needRefresh: false,
  setOfflineReady: vi.fn(),
  setNeedRefresh: vi.fn(),
  updateServiceWorker: vi.fn(),
}

export function resetPwaRegisterMock() {
  pwaRegisterMock.offlineReady = false
  pwaRegisterMock.needRefresh = false
  pwaRegisterMock.setOfflineReady.mockReset()
  pwaRegisterMock.setNeedRefresh.mockReset()
  pwaRegisterMock.updateServiceWorker.mockReset()
}

export function useRegisterSW() {
  return {
    offlineReady: [
      pwaRegisterMock.offlineReady,
      pwaRegisterMock.setOfflineReady,
    ],
    needRefresh: [
      pwaRegisterMock.needRefresh,
      pwaRegisterMock.setNeedRefresh,
    ],
    updateServiceWorker: pwaRegisterMock.updateServiceWorker,
  }
}
```

Este archivo solo se usa durante pruebas gracias al alias de `vitest.config.ts`.

---

## Paso 7.8 — 🧪 Probar `projectService.ts`

### Crear `src/services/projectService.test.ts`

> **¿Qué hace?** Sustituye `httpClient` por funciones mock y comprueba método, URL, body y resultado.
>
> **¿Por qué importa?** Detecta errores como llamar `/project` en singular, usar `patch` en lugar de `put` o olvidar el `id`.

Pega:

```ts
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { makeProject } from '../test/factories'
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from './projectService'

const httpMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('./httpClient', () => ({
  httpClient: httpMocks,
}))

describe('projectService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('getProjects llama GET /projects y devuelve la lista', async () => {
    const projects = [makeProject()]
    httpMocks.get.mockResolvedValue({ data: projects })

    const result = await getProjects()

    expect(httpMocks.get).toHaveBeenCalledWith('/projects')
    expect(result).toEqual(projects)
  })

  test('createProject llama POST /projects con el body', async () => {
    const body = {
      name: 'Proyecto nuevo',
      description: 'Creado desde Vitest',
    }
    const created = makeProject({ ...body, id: 10 })
    httpMocks.post.mockResolvedValue({ data: created })

    const result = await createProject(body)

    expect(httpMocks.post).toHaveBeenCalledWith('/projects', body)
    expect(result).toEqual(created)
  })

  test('updateProject llama PUT /projects/{id} con el body', async () => {
    const body = {
      name: 'Proyecto actualizado',
      description: 'Descripción actualizada',
    }
    const updated = makeProject({ ...body, id: 7 })
    httpMocks.put.mockResolvedValue({ data: updated })

    const result = await updateProject(7, body)

    expect(httpMocks.put).toHaveBeenCalledWith('/projects/7', body)
    expect(result).toEqual(updated)
  })

  test('deleteProject llama DELETE /projects/{id}', async () => {
    httpMocks.delete.mockResolvedValue({})

    await deleteProject(7)

    expect(httpMocks.delete).toHaveBeenCalledWith('/projects/7')
  })
})
```

### Qué significa `vi.hoisted()`

Vitest mueve `vi.mock()` antes de los imports. `vi.hoisted()` crea las funciones mock a tiempo para que estén disponibles dentro de la factory.

### Qué no sucede

Estas pruebas no llaman la API real:

```text
Test → projectService → httpClient mock
```

No crean ni eliminan proyectos reales.

---

## Paso 7.9 — 🧪 Probar los hooks

### Paso 7.9.1 — Crear `src/hooks/useProjects.test.ts`

> **¿Qué hace?** Simula la respuesta de `getProjects()` y observa cómo cambia el estado del hook.
>
> **¿Por qué importa?** Verifica el flujo asíncrono loading → success/error y que `refetch()` realiza una nueva carga.

Pega:

```ts
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { makeProject } from '../test/factories'
import { useProjects } from './useProjects'

const serviceMocks = vi.hoisted(() => ({
  getProjects: vi.fn(),
}))

vi.mock('../services/projectService', () => ({
  getProjects: serviceMocks.getProjects,
}))

describe('useProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('carga proyectos al montar', async () => {
    const projects = [makeProject()]
    serviceMocks.getProjects.mockResolvedValue(projects)

    const { result } = renderHook(() => useProjects())

    expect(result.current.loading).toBe(true)
    expect(result.current.projects).toEqual([])

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.projects).toEqual(projects)
    expect(result.current.error).toBeNull()
  })

  test('guarda un mensaje cuando la carga falla', async () => {
    serviceMocks.getProjects.mockRejectedValue(new Error('API no disponible'))

    const { result } = renderHook(() => useProjects())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.projects).toEqual([])
    expect(result.current.error).toBe('API no disponible')
  })

  test('refetch vuelve a llamar getProjects', async () => {
    serviceMocks.getProjects.mockResolvedValue([makeProject()])

    const { result } = renderHook(() => useProjects())

    await waitFor(() => {
      expect(serviceMocks.getProjects).toHaveBeenCalledTimes(1)
    })

    act(() => {
      result.current.refetch()
    })

    await waitFor(() => {
      expect(serviceMocks.getProjects).toHaveBeenCalledTimes(2)
    })
  })
})
```

### Paso 7.9.2 — Crear `src/hooks/useProjectActions.test.ts`

> **¿Qué hace?** Simula `updateProject()` y `deleteProject()` y comprueba los datos enviados, `onSuccess` y los errores.
>
> **¿Por qué importa?** La lógica de edición y eliminación vive en este hook, no en el componente.

Pega:

```ts
import { act, renderHook } from '@testing-library/react'
import type { FormEvent } from 'react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { makeProject } from '../test/factories'
import { useProjectActions } from './useProjectActions'

const serviceMocks = vi.hoisted(() => ({
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
}))

vi.mock('../services/projectService', () => ({
  updateProject: serviceMocks.updateProject,
  deleteProject: serviceMocks.deleteProject,
}))

function makeSubmitEvent(): FormEvent<HTMLFormElement> {
  return {
    preventDefault: vi.fn(),
  } as unknown as FormEvent<HTMLFormElement>
}

describe('useProjectActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('abre la edición con los datos del proyecto', () => {
    const project = makeProject()
    const { result } = renderHook(() =>
      useProjectActions({ project }),
    )

    act(() => {
      result.current.startEditing()
    })

    expect(result.current.editing).toBe(true)
    expect(result.current.name).toBe(project.name)
    expect(result.current.description).toBe(project.description)
  })

  test('actualiza el proyecto y llama onSuccess', async () => {
    const project = makeProject({ id: 9 })
    const onSuccess = vi.fn()
    serviceMocks.updateProject.mockResolvedValue(
      makeProject({ id: 9, name: 'Nombre actualizado' }),
    )

    const { result } = renderHook(() =>
      useProjectActions({ project, onSuccess }),
    )

    act(() => {
      result.current.startEditing()
      result.current.setName('Nombre actualizado')
      result.current.setDescription('Descripción nueva')
    })

    await act(async () => {
      await result.current.handleUpdate(makeSubmitEvent())
    })

    expect(serviceMocks.updateProject).toHaveBeenCalledWith(9, {
      name: 'Nombre actualizado',
      description: 'Descripción nueva',
    })
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(result.current.editing).toBe(false)
    expect(result.current.error).toBeNull()
  })

  test('elimina el proyecto y llama onSuccess', async () => {
    const project = makeProject({ id: 12 })
    const onSuccess = vi.fn()
    serviceMocks.deleteProject.mockResolvedValue(undefined)

    const { result } = renderHook(() =>
      useProjectActions({ project, onSuccess }),
    )

    await act(async () => {
      await result.current.handleDelete()
    })

    expect(serviceMocks.deleteProject).toHaveBeenCalledWith(12)
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(result.current.error).toBeNull()
  })

  test('muestra error cuando PUT falla', async () => {
    const project = makeProject()
    serviceMocks.updateProject.mockRejectedValue(new Error('Forbidden'))

    const { result } = renderHook(() =>
      useProjectActions({ project }),
    )

    act(() => {
      result.current.setName('Nombre válido')
    })

    await act(async () => {
      await result.current.handleUpdate(makeSubmitEvent())
    })

    expect(result.current.error).toBe('Forbidden')
    expect(result.current.saving).toBe(false)
  })
})
```

### Por qué usamos `act()`

`act()` agrupa cambios de estado de React y espera a que la interfaz quede consistente antes de hacer assertions.

---

## Paso 7.10 — 🧪 Probar los componentes

### Paso 7.10.1 — Crear `src/components/ProjectForm.test.tsx`

> **¿Qué hace?** Comprueba labels, validación, propagación de cambios, error y submit.
>
> **¿Por qué importa?** Prueba el contrato de props sin depender del hook ni de la API.

Pega:

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { ProjectForm } from './ProjectForm'

function makeProps() {
  return {
    name: '',
    setName: vi.fn(),
    description: '',
    setDescription: vi.fn(),
    submitting: false,
    error: null,
    valid: false,
    handleSubmit: vi.fn(),
  }
}

describe('ProjectForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('deshabilita crear cuando el formulario no es válido', () => {
    render(<ProjectForm {...makeProps()} />)

    expect(
      screen.getByRole('button', { name: 'Crear proyecto' }),
    ).toBeDisabled()
  })

  test('envía los cambios de los inputs a sus setters', () => {
    const props = makeProps()
    render(<ProjectForm {...props} />)

    fireEvent.change(screen.getByLabelText('Nombre'), {
      target: { value: 'Proyecto nuevo' },
    })
    fireEvent.change(screen.getByLabelText('Descripción'), {
      target: { value: 'Descripción nueva' },
    })

    expect(props.setName).toHaveBeenCalledWith('Proyecto nuevo')
    expect(props.setDescription).toHaveBeenCalledWith('Descripción nueva')
  })

  test('muestra el error recibido', () => {
    render(<ProjectForm {...makeProps()} error="No se pudo crear" />)

    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo crear')
  })

  test('llama handleSubmit cuando el formulario es válido', () => {
    const props = makeProps()
    props.name = 'Proyecto válido'
    props.valid = true

    render(<ProjectForm {...props} />)

    const button = screen.getByRole('button', { name: 'Crear proyecto' })
    const form = button.closest('form')

    expect(form).not.toBeNull()
    fireEvent.submit(form!)

    expect(props.handleSubmit).toHaveBeenCalledTimes(1)
  })

  test('muestra Creando… durante el envío', () => {
    render(
      <ProjectForm
        {...makeProps()}
        name="Proyecto válido"
        valid
        submitting
      />,
    )

    expect(screen.getByRole('button', { name: 'Creando…' })).toBeDisabled()
  })
})
```

### Paso 7.10.2 — Crear `src/components/ProjectList.test.tsx`

> **¿Qué hace?** Prueba por separado loading, error, empty y success.
>
> **¿Por qué importa?** Conserva la regla central del proyecto: nunca dejar la interfaz en un estado ambiguo.

Pega:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { makeProject } from '../test/factories'
import { ProjectList } from './ProjectList'

const baseProps = {
  projects: [],
  loading: false,
  error: null,
  onChanged: vi.fn(),
}

describe('ProjectList', () => {
  test('muestra loading', () => {
    render(<ProjectList {...baseProps} loading />)

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  test('muestra error', () => {
    render(<ProjectList {...baseProps} error="API no disponible" />)

    expect(screen.getByRole('alert')).toHaveTextContent('API no disponible')
  })

  test('muestra empty cuando no hay proyectos', () => {
    render(<ProjectList {...baseProps} />)

    expect(screen.getByText('No hay proyectos.')).toBeInTheDocument()
  })

  test('muestra la lista de proyectos', () => {
    const projects = [
      makeProject({ id: 1, name: 'Proyecto Alpha' }),
      makeProject({ id: 2, name: 'Proyecto Beta' }),
    ]

    render(<ProjectList {...baseProps} projects={projects} />)

    expect(screen.getByText('Proyectos (2)')).toBeInTheDocument()
    expect(screen.getByText('Proyecto Alpha')).toBeInTheDocument()
    expect(screen.getByText('Proyecto Beta')).toBeInTheDocument()
  })
})
```

### Orden de los estados

El componente evalúa:

```text
loading → error → empty → success
```

Por eso cada test activa solamente el estado que quiere comprobar.

### Paso 7.10.3 — Crear `src/components/PwaStatus.test.tsx`

> **¿Qué hace?** Cambia el estado del mock de la PWA y comprueba el mensaje y el botón de actualización.
>
> **¿Por qué importa?** Verifica la interfaz de actualización sin intentar ejecutar un service worker real.

Pega:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test } from 'vitest'
import {
  pwaRegisterMock,
  resetPwaRegisterMock,
} from '../test/pwaRegisterMock'
import { PwaStatus } from './PwaStatus'

describe('PwaStatus', () => {
  beforeEach(() => {
    resetPwaRegisterMock()
  })

  test('no muestra aviso cuando no hay eventos PWA', () => {
    render(<PwaStatus />)

    expect(
      screen.queryByText('La app ya puede abrirse sin conexión.'),
    ).not.toBeInTheDocument()
  })

  test('muestra que la app está disponible offline', () => {
    pwaRegisterMock.offlineReady = true

    render(<PwaStatus />)

    expect(
      screen.getByText('La app ya puede abrirse sin conexión.'),
    ).toBeInTheDocument()
  })

  test('activa la actualización cuando el usuario pulsa Actualizar', async () => {
    const user = userEvent.setup()
    pwaRegisterMock.needRefresh = true

    render(<PwaStatus />)

    expect(
      screen.getByText('Hay una nueva versión disponible.'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Actualizar' }))

    expect(pwaRegisterMock.updateServiceWorker).toHaveBeenCalledWith(true)
  })

  test('cierra el aviso', async () => {
    const user = userEvent.setup()
    pwaRegisterMock.offlineReady = true

    render(<PwaStatus />)

    await user.click(screen.getByRole('button', { name: 'Cerrar' }))

    expect(pwaRegisterMock.setOfflineReady).toHaveBeenCalledWith(false)
    expect(pwaRegisterMock.setNeedRefresh).toHaveBeenCalledWith(false)
  })
})
```

> Estas pruebas no sustituyen la verificación del manifest y del service worker en DevTools.

---

## Paso 7.11 — 🧪 Probar `ProtectedRoute`

### Crear `src/ProtectedRoute.test.tsx`

> **¿Qué hace?** Simula el resultado de `useAuth()` y monta rutas en memoria.
>
> **¿Por qué importa?** Comprueba que un usuario sin token no vea contenido privado y que una sesión autenticada sí pueda entrar.

Pega:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { ProtectedRoute } from './ProtectedRoute'

const authState = vi.hoisted(() => ({
  isAuthenticated: false,
}))

vi.mock('./hooks/useAuth', () => ({
  useAuth: () => authState,
}))

function renderRoutes() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/login" element={<div>Página de login</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Contenido privado</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    authState.isAuthenticated = false
  })

  test('redirige al login cuando no hay sesión', () => {
    renderRoutes()

    expect(screen.getByText('Página de login')).toBeInTheDocument()
    expect(screen.queryByText('Contenido privado')).not.toBeInTheDocument()
  })

  test('muestra la ruta privada cuando hay sesión', () => {
    authState.isAuthenticated = true

    renderRoutes()

    expect(screen.getByText('Contenido privado')).toBeInTheDocument()
  })
})
```

### Por qué usamos `MemoryRouter`

`MemoryRouter` administra rutas en memoria. No necesita modificar la URL real de jsdom y permite iniciar directamente en `/dashboard`.

---

## Paso 7.12 — ✅ Ejecutar pruebas y coverage

### Ejecutar en modo watch

```bash
npm test
```

Vitest permanece abierto. Cuando guardas un archivo vuelve a ejecutar las pruebas relacionadas.

Comandos útiles dentro del modo watch:

```text
a → ejecutar todas
f → ejecutar solo fallidas
q → salir
```

### Ejecutar una sola vez

```bash
npm run test:run
```

Este es el comando apropiado para CI.

### Ejecutar un archivo específico

```bash
npx vitest run src/services/projectService.test.ts
```

### Filtrar por nombre

```bash
npx vitest run -t "updateProject"
```

### Generar coverage

```bash
npm run test:coverage
```

La terminal muestra una tabla parecida a:

```text
File                    | % Stmts | % Branch | % Funcs | % Lines
------------------------|---------|----------|---------|--------
All files               |   78.00 |    70.00 |   82.00 |   78.00
```

También se crea:

```text
coverage/index.html
```

Puedes abrirlo en macOS con:

```bash
open coverage/index.html
```

### Qué significa cada columna

| Métrica | Qué mide |
| --- | --- |
| Statements | Sentencias ejecutadas |
| Branches | Caminos de `if`, ternarios y condiciones |
| Functions | Funciones llamadas |
| Lines | Líneas ejecutadas |

> Un porcentaje alto no garantiza buenas pruebas. Lo importante es probar comportamiento relevante, errores y decisiones.

---

## Paso 7.13 — 🔌 ✏️ Integrar pruebas con GitHub Actions

### Paso 7.13.1 — ✏️ Modificar `.gitignore`

> **¿Qué hace?** Evita subir el reporte HTML de coverage al repositorio.

Agrega al final:

```gitignore
# Vitest coverage
coverage/
```

### Paso 7.13.2 — ✏️ Modificar `.github/workflows/ci.yml`

> **¿Qué hace?** Ejecuta los tests después de instalar dependencias y antes de generar el build.
>
> **¿Por qué importa?** Si una prueba falla, el workflow se detiene y no publica una versión incorrecta en GitHub Pages.

Dentro del job `build`, agrega este paso después de `npm ci`:

```yaml
      - name: Test
        run: npm run test:run
```

La sección completa queda así:

```yaml
      - name: Install dependencies
        run: npm ci

      - name: Test
        run: npm run test:run

      - name: Build
        run: npm run build:pages
        env:
          VITE_API_URL: https://d3ujwk09smrk9z.cloudfront.net
```

El flujo ahora es:

```text
npm ci
    → npm run test:run
        → si falla: detener workflow
        → si pasa: continuar
    → npm run build:pages
    → subir dist/
    → desplegar GitHub Pages
```

### Publicar los cambios

```bash
git status
git add -A
git commit -m "test: add Vitest coverage for TaskFlow"
git push origin main
```

---

# Resultado esperado

Al ejecutar:

```bash
npm run test:run
```

Debes obtener siete archivos exitosos:

```text
✓ src/services/projectService.test.ts
✓ src/hooks/useProjects.test.ts
✓ src/hooks/useProjectActions.test.ts
✓ src/components/ProjectForm.test.tsx
✓ src/components/ProjectList.test.tsx
✓ src/components/PwaStatus.test.tsx
✓ src/ProtectedRoute.test.tsx
```

Cantidad inicial de pruebas de esta guía:

| Archivo | Pruebas |
| --- | ---: |
| `projectService.test.ts` | 4 |
| `useProjects.test.ts` | 3 |
| `useProjectActions.test.ts` | 4 |
| `ProjectForm.test.tsx` | 5 |
| `ProjectList.test.tsx` | 4 |
| `PwaStatus.test.tsx` | 4 |
| `ProtectedRoute.test.tsx` | 2 |
| **Total** | **26** |

---

# Mapa de archivos actualizado

```text
jwt-auth-demo/
├── vitest.config.ts                         ← Fase 7 🆕
├── package.json                             ← Fase 7 ✏️
├── package-lock.json                        ← Fase 7 ✏️
├── .gitignore                               ← Fase 7 ✏️
├── .github/
│   └── workflows/
│       └── ci.yml                           ← Fase 7 ✏️ 🔌
└── src/
    ├── ProtectedRoute.tsx
    ├── ProtectedRoute.test.tsx              ← Fase 7 🆕
    ├── test/
    │   ├── setup.ts                         ← Fase 7 🆕
    │   ├── factories.ts                     ← Fase 7 🆕
    │   └── pwaRegisterMock.ts               ← Fase 7 🆕
    ├── services/
    │   ├── projectService.ts
    │   └── projectService.test.ts           ← Fase 7 🆕
    ├── hooks/
    │   ├── useProjects.ts
    │   ├── useProjects.test.ts              ← Fase 7 🆕
    │   ├── useProjectActions.ts
    │   └── useProjectActions.test.ts        ← Fase 7 🆕
    └── components/
        ├── ProjectForm.tsx
        ├── ProjectForm.test.tsx             ← Fase 7 🆕
        ├── ProjectList.tsx
        ├── ProjectList.test.tsx             ← Fase 7 🆕
        ├── PwaStatus.tsx
        └── PwaStatus.test.tsx               ← Fase 7 🆕
```

---

# Checklist de entrega

## Configuración

- [ ] Node es 20 o superior.
- [ ] Vite es 6 o superior.
- [ ] Vitest y jsdom están instalados.
- [ ] React Testing Library, DOM Testing Library, jest-dom y user-event están instalados.
- [ ] `@vitest/coverage-v8` está instalado.
- [ ] Existen los scripts `test`, `test:run` y `test:coverage`.
- [ ] `vitest.config.ts` utiliza `environment: 'jsdom'`.
- [ ] `setup.ts` importa `@testing-library/jest-dom/vitest`.
- [ ] El módulo virtual PWA tiene un alias de prueba.

## Pruebas

- [ ] El servicio prueba GET, POST, PUT y DELETE.
- [ ] Ningún test del servicio llama la API real.
- [ ] `useProjects` prueba success, error y refetch.
- [ ] `useProjectActions` prueba PUT, DELETE y error.
- [ ] `ProjectForm` prueba campos, error, validación y submit.
- [ ] `ProjectList` prueba loading, error, empty y success.
- [ ] `ProtectedRoute` prueba sesión y redirección.
- [ ] `PwaStatus` prueba offline ready y actualización.
- [ ] `npm run test:run` termina correctamente.
- [ ] `npm run test:coverage` genera `coverage/index.html`.

## CI

- [ ] `coverage/` está en `.gitignore`.
- [ ] GitHub Actions ejecuta tests antes del build.
- [ ] Un test fallido detiene el deploy.

---

# Errores comunes

## `document is not defined`

Vitest está usando el entorno Node predeterminado.

Confirma en `vitest.config.ts`:

```ts
test: {
  environment: 'jsdom',
}
```

Y que `jsdom` esté instalado:

```bash
npm install -D jsdom
```

## `Invalid Chai property: toBeInTheDocument`

Falta jest-dom. Confirma en `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

## `Cannot find module 'virtual:pwa-register/react'`

Confirma el alias:

```ts
resolve: {
  alias: {
    'virtual:pwa-register/react': fileURLToPath(
      new URL('./src/test/pwaRegisterMock.ts', import.meta.url),
    ),
  },
}
```

## `React state update was not wrapped in act(...)`

Los cambios directos del hook deben envolverse:

```ts
act(() => {
  result.current.setName('Nuevo nombre')
})
```

Para resultados asíncronos usa `waitFor` o `await act(...)`.

## La prueba hace una petición real

Revisa que `vi.mock()` apunte exactamente al mismo módulo que importa el archivo productivo.

Ejemplo desde un hook:

```ts
vi.mock('../services/projectService', () => ({
  getProjects: serviceMocks.getProjects,
}))
```

## Las llamadas del test anterior siguen registradas

Usa:

```ts
beforeEach(() => {
  vi.clearAllMocks()
})
```

La configuración también tiene `clearMocks: true`, pero mantenerlo visible en pruebas con mocks importantes hace explícito el aislamiento.

## Vitest se queda abierto en CI

`vitest` sin `run` inicia modo watch. En GitHub Actions usa:

```bash
npm run test:run
```

## Coverage es bajo aunque todas las pruebas pasan

“Todas pasan” significa que los casos escritos funcionan. No significa que todo el código tenga pruebas.

Revisa:

```text
coverage/index.html
```

Busca ramas y archivos sin ejecutar y agrega pruebas por comportamiento, no solo para subir el porcentaje.

## Un test falla solamente en CI

Comprueba:

- La misma versión de Node.
- Que `package-lock.json` esté actualizado.
- Que no dependa de zona horaria o fecha actual.
- Que no llame una API externa.
- Que espere correctamente resultados asíncronos.

---

# Buenas prácticas aplicadas

## Buscar como lo haría el usuario

Preferimos:

```ts
screen.getByRole('button', { name: 'Crear proyecto' })
screen.getByLabelText('Nombre')
```

En lugar de depender de clases CSS o estructura interna.

## Probar comportamiento, no implementación

Una prueba debe responder preguntas como:

- ¿Se muestra el error?
- ¿Se deshabilita el botón?
- ¿Se llamó la URL correcta?
- ¿Se redirige a login?

No debe depender de nombres de variables internas que el usuario nunca observa.

## No compartir estado

Cada prueba crea sus propios datos con `makeProject()` y limpia los mocks.

## No llamar servicios externos

Las pruebas son rápidas, repetibles y no eliminan datos reales.

---

# Comandos completos de la fase

```bash
# 1. Instalar dependencias
npm install -D \
  vitest \
  jsdom \
  @testing-library/react \
  @testing-library/dom \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @vitest/coverage-v8

# 2. Agregar scripts
npm pkg set \
  "scripts.test=vitest" \
  "scripts.test:run=vitest run" \
  "scripts.test:coverage=vitest run --coverage"

# 3. Crear estructura
mkdir -p src/test src/services src/hooks src/components

touch \
  vitest.config.ts \
  src/test/setup.ts \
  src/test/factories.ts \
  src/test/pwaRegisterMock.ts \
  src/services/projectService.test.ts \
  src/hooks/useProjects.test.ts \
  src/hooks/useProjectActions.test.ts \
  src/components/ProjectForm.test.tsx \
  src/components/ProjectList.test.tsx \
  src/components/PwaStatus.test.tsx \
  src/ProtectedRoute.test.tsx

# 4. Después de pegar el contenido, ejecutar una vez
npm run test:run

# 5. Generar coverage
npm run test:coverage

# 6. Confirmar que build y tests pasan juntos
npm run test:run && npm run build
```

---

# Resumen final

```text
Vitest
    → ejecuta archivos *.test.ts y *.test.tsx
    → proporciona expect, vi, mocks y hooks

jsdom
    → simula window y document

React Testing Library
    → renderiza hooks y componentes
    → busca elementos como lo haría el usuario

Mocks
    → sustituyen Axios, Auth y el registro PWA
    → evitan efectos externos y datos reales

Coverage V8
    → muestra líneas, funciones y ramas ejecutadas

GitHub Actions
    → npm ci
    → npm run test:run
    → npm run build:pages
    → deploy
```

> **Test runner** = ejecuta · **Testing Library** = interactúa · **Mock** = sustituye dependencias · **Coverage** = mide ejecución

---

# Referencias oficiales

- [Vitest — Getting Started](https://vitest.dev/guide/)
- [Vitest — Test Environment](https://vitest.dev/config/environment)
- [Vitest — Setup Files](https://vitest.dev/config/setupfiles)
- [Vitest — Coverage](https://vitest.dev/guide/coverage.html)
- [React Testing Library — Introduction](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library — Queries](https://testing-library.com/docs/queries/about/)
- [Testing Library — Setup](https://testing-library.com/docs/react-testing-library/setup/)
