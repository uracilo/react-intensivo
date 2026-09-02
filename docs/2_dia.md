# Guía Día 3 — Fetch, cuatro estados de UI y custom hooks

**Demo:** [`demos/03-datos/`](./)  
**Tiempo estimado:** 8 horas — aproximadamente 5 horas de contenido y 3 horas para pausas, dudas y práctica libre.

Proyecto educativo que muestra cómo consumir datos de una API sin dejar la interfaz en estados ambiguos. La idea central:

```text
Petición → loading → error, empty o success
```

También extraerás lógica repetida a custom hooks y reutilizarás un hook genérico en las vistas de usuarios y publicaciones.

> Si querés construirlo desde cero, seguí la [Guía paso a paso — desde cero](#guía-paso-a-paso--desde-cero).

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abrí http://localhost:5173 → redirige a `/users` con navegación a `/posts`.

---

## Conceptos clave

### ¿Qué es `fetch`?

`fetch` es una API del navegador para realizar peticiones HTTP. No depende de React: es JavaScript puro del navegador.

**Responsabilidad:** *hablar con el servidor* — pedir datos y recibir una respuesta.

```tsx
const response = await fetch(
  "https://jsonplaceholder.typicode.com/users"
);
```

La palabra `await` espera a que termine una promesa. Solo puede utilizarse dentro de una función marcada con `async`:

```tsx
async function loadUsers() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users"
  );

  const data = await response.json();
  console.log(data);
}
```

El proceso tiene **dos esperas**:

1. `fetch(...)` espera la respuesta HTTP.
2. `response.json()` espera a convertir el cuerpo JSON en datos de JavaScript.

---

### ¿Qué es `response.ok`?

`fetch` **no lanza un error automáticamente** por todos los estados HTTP problemáticos. Por ejemplo, un `404` sigue produciendo un objeto `Response`.

Por eso comprobamos:

```tsx
if (!response.ok) {
  throw new Error(`Error HTTP: ${response.status}`);
}
```

| Expresión | Significado |
| --- | --- |
| `response.ok` | Verdadero para respuestas exitosas (2xx). |
| `!response.ok` | La respuesta no fue exitosa. |
| `response.status` | Código HTTP (404, 500, etc.). |
| `throw new Error(...)` | Interrumpe la función y envía el control al `catch`. |

---

### Los cuatro estados de la interfaz

Una pantalla que obtiene datos debería distinguir cuatro resultados posibles:

| Estado | Qué significa | Componente MUI posible |
| --- | --- | --- |
| **Loading** | La petición sigue en curso. | `CircularProgress` |
| **Error** | La petición falló. | `Alert severity="error"` |
| **Empty** | Terminó correctamente, pero no hay datos. | `Alert severity="info"` |
| **Success** | Hay datos disponibles. | Lista, tarjetas o tabla |

Un orden común es:

```tsx
if (loading) {
  return <CircularProgress />;
}

if (error) {
  return <Alert severity="error">{error}</Alert>;
}

if (!data || data.length === 0) {
  return <Alert severity="info">No hay resultados.</Alert>;
}

return <DataList data={data} />;
```

No confundas:

- `null` → todavía no hay un resultado.
- `[]` → la petición terminó y devolvió una lista vacía.
- Un **error** → no sabemos si había resultados porque la petición falló.

---

### ¿Qué es un custom hook?

Un **custom hook** es una función que empieza con `use` y reutiliza lógica basada en Hooks de React.

**Responsabilidad:** *orquestar* — cuándo pedir datos, manejar loading/error, exponer una API simple al componente.

```
src/hooks/
├── useFetch.ts      # petición genérica con AbortController
├── useToggle.ts     # alternar un booleano
└── useDebounce.ts   # retrasar un valor (opcional en integrador)
```

Convenciones:

- Su nombre comienza con `use`.
- Puede llamar otros Hooks.
- Debe respetar las reglas de los Hooks.
- Comparte **lógica**, no una interfaz visual.

---

### ¿Qué es un genérico `<T>`?

Queremos que `useFetch` pueda devolver usuarios, posts u otros datos:

```tsx
function useFetch<T>(url: string) {
  // ...
}
```

`T` es un tipo pendiente de especificar. Al usarlo:

```tsx
const usersRequest = useFetch<User[]>(usersUrl);
const postsRequest = useFetch<Post[]>(postsUrl);
```

En la primera llamada `T` equivale a `User[]` y en la segunda a `Post[]`.

> **Importante:** `as User[]` le dice a TypeScript que confíe en nosotros. TypeScript **no valida JSON en tiempo de ejecución**. En producción podrías validar con Zod; en esta práctica nos concentramos en tipos estáticos.

---

### Cómo se conectan las piezas (integrador final)

```
┌─────────────┐     usa      ┌──────────────┐     llama     ┌─────────────────┐
│   Página    │  ─────────►  │   useFetch   │  ──────────►  │  fetch (API)    │
│ UsersPage   │              │   <T>        │               │ JSONPlaceholder │
└─────────────┘              └──────────────┘               └─────────────────┘
       ▲                            │
       │    { data, loading, error }│
       └────────────────────────────┘
```

| Capa | Archivo ejemplo | Pregunta que responde |
| --- | --- | --- |
| Hook | `useFetch.ts` | ¿Cuándo pido datos y cómo manejo loading/error/cancelación? |
| Página | `UsersPage.tsx` | ¿Qué ve el usuario? (spinner, error, vacío, lista) |
| Layout | `AppLayout.tsx` | ¿Cómo navego entre `/users` y `/posts`? |

---

## API de práctica

Usaremos [JSONPlaceholder](https://jsonplaceholder.typicode.com/), una API REST falsa para ejemplos:

| Recurso | Cantidad | Endpoint |
| --- | --- | --- |
| Usuarios | 10 | `https://jsonplaceholder.typicode.com/users` |
| Publicaciones | 100 | `https://jsonplaceholder.typicode.com/posts` |

---

## Guía paso a paso — desde cero

Cada **fase** termina conectando algo en pantalla. No acumules archivos sin renderizar: al cerrar cada fase corrés `npm run dev` y verificás lo que dice **Qué ves**.

### Regla de oro

> Al final de **cada mini-práctica (Fases 1–9)** reemplazás `src/App.tsx` para ver el avance. En la **Fase 10** armás la estructura final con rutas y archivos separados.

### Cómo va quedando la app

| Fase | Título | Qué ves en el navegador |
| --- | --- | --- |
| **0** | Proyecto base | Logo de Vite + contador (plantilla default) |
| **1** | Fetch on mount | Lista de nombres de usuarios (sin loading ni error) |
| **2** | Tipar respuesta | Lista con nombre + email tipados |
| **3** | Loading | Spinner breve → lista de usuarios |
| **4** | Error | Spinner → `Alert` rojo si falla la petición |
| **5** | Empty | Distingue lista vacía de error |
| **6** | AbortController | Igual que Fase 5, pero cancela fetch al desmontar |
| **7** | Paginación | 5 posts por página con `Pagination` |
| **8** | Debounced search | Campo de búsqueda con retraso de 400 ms |
| **9** | useToggle | Botón Mostrar/Ocultar contenido |
| **10** | Integrador | `/users` y `/posts` con layout, búsqueda y paginación |

```
FASE 0   ████░░░░░░  Vite default
FASE 1   █████░░░░░  Lista de nombres
FASE 2   ██████░░░░  Lista tipada
FASE 3   ███████░░░  Spinner + lista
FASE 4   ████████░░  Spinner + error
FASE 5   █████████░  Cuatro estados completos
FASE 10  ██████████  App final con rutas
```

### Leyenda

| Símbolo | Significado |
| --- | --- |
| 🆕 | Crear archivo nuevo |
| ✏️ | Modificar archivo existente |
| 🗑️ | Eliminar (opcional) |
| 🔌 | **Conectar** — editar `App.tsx` (o rutas en Fase 10) para ver el avance |

Debajo de cada paso verás **¿Qué hace?** y **¿Por qué importa?** para entender el código antes de pegarlo.

### Resumen del orden

```
FASE 0   →  Vite, deps MUI + react-router-dom@7
FASE 1   →  fetch on mount                    → 🔌 App.tsx
FASE 2   →  tipar User[]                      → 🔌 App.tsx
FASE 3   →  estado loading                    → 🔌 App.tsx
FASE 4   →  try/catch/finally + error         → 🔌 App.tsx
FASE 5   →  estado empty                      → 🔌 App.tsx
FASE 6   →  AbortController                   → 🔌 App.tsx
FASE 7   →  paginación client-side            → 🔌 App.tsx
FASE 8   →  debounce                          → 🔌 App.tsx
FASE 9   →  useToggle                         → 🆕 hook + 🔌 App.tsx
FASE 10  →  integrador: useFetch, rutas, páginas
```

### Nota sobre React Router

El temario usa `react-router-dom`, por eso esta guía fija la versión 7:

```bash
npm install react-router-dom@7
```

React Router 8 retiró ese paquete y ahora utiliza importaciones desde `react-router` y `react-router/dom`. Fijar `@7` evita que el ejercicio cambie inesperadamente y conserva la sintaxis del curso.

---

## FASE 0 — Proyecto base

**Qué ves al terminar:** pantalla default de Vite (logo React + contador).

**Pasos de esta fase:** 0.1 → 0.2 → 0.3

| Paso | Acción | Archivo |
| --- | --- | --- |
| 0.1 | Crear | proyecto Vite |
| 0.2 | Instalar | MUI + react-router-dom@7 |
| 0.3 | Probar | `npm run dev` |

#### Paso 0.1 — Crear app con Vite

> **¿Qué hace?** Genera un proyecto React + TypeScript con Vite.
> **¿Por qué importa?** Es la base: sin esto no tenés `package.json`, `index.html`, ni la estructura mínima.

```bash
cd ~/Desktop/react-intensivo
npm create vite@latest dia-3-datos -- --template react-ts
cd dia-3-datos
```

#### Paso 0.2 — Instalar dependencias

> **¿Qué hace?** Agrega Material UI (interfaz) y React Router 7 (rutas, al final del día).
> **¿Por qué importa?** Vite solo trae React; estas deps son necesarias para spinner, alertas, listas y navegación.

```bash
npm install
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install react-router-dom@7
```

#### Paso 0.3 — Probar

> **¿Qué hace?** Levanta el servidor de desarrollo y confirmás que compila.
> **¿Por qué importa?** Si algo falla en Fase 0, es más fácil arreglarlo ahora.

```bash
npm run dev
```

Abrí http://localhost:5173 → logo de Vite. Ctrl+C para parar.

---

## FASE 1 — Fetch on mount

**Qué ves al terminar:** lista de nombres de usuarios de JSONPlaceholder.

**Tiempo:** 25 minutos

#### Paso 1.1 — 🔌 ✏️ Reemplazar `src/App.tsx`

> **¿Qué hace?** Al montar el componente, pide usuarios con `fetch` y muestra sus nombres en una lista MUI.
> **¿Por qué importa?** Es el primer contacto con datos remotos: sin loading, sin error, sin cancelación — solo la petición básica.

**Archivo:** `src/App.tsx` — reemplazá todo el contenido.

```tsx
import { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const usersUrl =
  "https://jsonplaceholder.typicode.com/users";

function App() {
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    async function loadUsers() {
      const response = await fetch(usersUrl);
      const data = (await response.json()) as Array<{
        name: string;
      }>;

      setNames(data.map((user) => user.name));
    }

    void loadUsers();
  }, []);

  return (
    <List>
      {names.map((name) => (
        <ListItem key={name}>
          <ListItemText primary={name} />
        </ListItem>
      ))}
    </List>
  );
}

export default App;
```

#### Explicación línea por línea

| Línea / bloque | ¿Qué hace? | ¿Por qué importa? |
| --- | --- | --- |
| `useState<string[]>([])` | Estado inicial: array vacío de nombres. | Antes de cargar, no hay nombres que mostrar. |
| `useEffect(() => { ... }, [])` | Efecto que corre **una vez al montar**. | El `[]` vacío significa “sin dependencias → solo al aparecer”. |
| `async function loadUsers()` | Función interna que puede usar `await`. | El callback de `useEffect` **no puede ser async** directamente (debe devolver cleanup o nada, no una promesa). |
| `await fetch(usersUrl)` | Pide la URL y espera la respuesta HTTP. | Primera espera: la red. |
| `await response.json()` | Convierte el cuerpo a JavaScript. | Segunda espera: parsear JSON. |
| `as Array<{ name: string }>` | Le dice a TypeScript la forma esperada. | Sin esto, `data` sería `unknown`. |
| `setNames(data.map(...))` | Extrae solo el campo `name` de cada usuario. | La UI solo necesita nombres por ahora. |
| `void loadUsers()` | Ejecuta la función e ignora la promesa. | Indica explícitamente que no awaitamos desde afuera. |

> Esta versión **todavía no** maneja errores, loading ni cancelación. Los agregaremos gradualmente.

#### ✅ Verificar Fase 1

```bash
npm run dev
```

- Ves una lista de 10 nombres.
- Abrí DevTools → pestaña **Network** → confirmá la petición a `/users`.

**Prueba:** cambiá `user.name` por `user.username` y observá la diferencia.

---

## FASE 2 — Tipar la respuesta

**Qué ves al terminar:** lista con nombre **y** email de cada usuario.

**Tiempo:** 15 minutos

#### Paso 2.1 — 🔌 ✏️ Reemplazar `src/App.tsx`

> **¿Qué hace?** Define un tipo `User` completo y guarda objetos tipados en el estado.
> **¿Por qué importa?** TypeScript conoce `user.id`, `user.email`, etc. y te avisa si escribís mal una propiedad.

```tsx
import { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
};

const usersUrl =
  "https://jsonplaceholder.typicode.com/users";

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function loadUsers() {
      const response = await fetch(usersUrl);
      const result = (await response.json()) as User[];
      setUsers(result);
    }

    void loadUsers();
  }, []);

  return (
    <List>
      {users.map((user) => (
        <ListItem key={user.id}>
          <ListItemText
            primary={user.name}
            secondary={user.email}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default App;
```

#### Explicación línea por línea

| Línea / bloque | ¿Qué hace? | ¿Por qué importa? |
| --- | --- | --- |
| `type User = { ... }` | Describe la forma de un usuario. | Documentación viva: el editor autocompleta campos. |
| `useState<User[]>([])` | Estado tipado como array de `User`. | `User[]` = “array de objetos User”. |
| `key={user.id}` | Identificador único en la lista. | React necesita keys estables para reconciliar elementos. |
| `primary` / `secondary` | Título y subtítulo del ítem. | MUI muestra nombre grande y email debajo. |

**Error intencional:** escribí `user.emale`. TypeScript indicará que esa propiedad no existe. Corregila después.

---

## FASE 3 — Loading

**Qué ves al terminar:** spinner centrado → luego la lista de usuarios.

**Tiempo:** 10 minutos

#### Paso 3.1 — 🔌 ✏️ Reemplazar `src/App.tsx`

> **¿Qué hace?** Agrega estado `loading` que empieza en `true` y pasa a `false` cuando llegan los datos.
> **¿Por qué importa?** Sin loading, la pantalla vacía parece un bug. El spinner comunica “esperá, estoy trabajando”.

```tsx
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

type User = {
  id: number;
  name: string;
  email: string;
};

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUsers() {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const result = (await response.json()) as User[];
      setUsers(result);
      setLoading(false);
    }

    void loadUsers();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", padding: 5 }}>
        <CircularProgress aria-label="Cargando usuarios" />
      </Box>
    );
  }

  return (
    <List>
      {users.map((user) => (
        <ListItem key={user.id}>
          <ListItemText primary={user.name} secondary={user.email} />
        </ListItem>
      ))}
    </List>
  );
}

export default App;
```

#### Explicación línea por línea

| Línea / bloque | ¿Qué hace? | ¿Por qué importa? |
| --- | --- | --- |
| `useState<boolean>(true)` | Loading empieza activo. | La petición aún no terminó al primer render. |
| `if (loading) return ...` | Sale temprano con spinner. | Patrón “guard clause”: evita anidar el resto. |
| `setLoading(false)` | Apaga loading tras recibir datos. | Solo se ejecuta si `fetch` tuvo éxito — **problema que arreglamos en Fase 4**. |
| `aria-label="Cargando usuarios"` | Accesibilidad para lectores de pantalla. | El spinner solo no describe su propósito. |

**Prueba:** en DevTools → Network → throttling **Slow 3G** → recargá y observá el spinner más tiempo.

---

## FASE 4 — Error

**Qué ves al terminar:** spinner → lista **o** `Alert` rojo si la petición falla.

**Tiempo:** 15 minutos

#### Paso 4.1 — 🔌 ✏️ Reemplazar `src/App.tsx`

> **¿Qué hace?** Envuelve la petición en `try/catch/finally` y comprueba `response.ok`.
> **¿Por qué importa?** `finally` siempre apaga loading — incluso si hay error. Sin eso, un fallo deja el spinner girando para siempre.

```tsx
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

type User = {
  id: number;
  name: string;
};

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = (await response.json()) as User[];
        setUsers(result);
      } catch (caughtError: unknown) {
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : "No fue posible cargar los usuarios";

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    void loadUsers();
  }, []);

  if (loading) {
    return <CircularProgress sx={{ margin: 4 }} />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <List>
      {users.map((user) => (
        <ListItem key={user.id}>
          <ListItemText primary={user.name} />
        </ListItem>
      ))}
    </List>
  );
}

export default App;
```

#### Explicación línea por línea

| Línea / bloque | ¿Qué hace? | ¿Por qué importa? |
| --- | --- | --- |
| `try { ... }` | Código que podría fallar. | Agrupa la lógica de red. |
| `if (!response.ok) throw ...` | Convierte HTTP 4xx/5xx en error. | `fetch` no lanza por 404 automáticamente. |
| `catch (caughtError: unknown)` | Recibe cualquier error. | No asumimos que siempre es `Error`. |
| `instanceof Error` | Comprueba si tiene `.message`. | Forma segura de leer el mensaje. |
| `finally { setLoading(false) }` | Siempre apaga loading. | Éxito o error — el spinner debe desaparecer. |
| `if (error) return <Alert>` | Segundo guard clause. | Orden: loading → error → datos. |

**Prueba:** cambiá el endpoint a `/users-inexistentes` → deberías ver `Alert severity="error"`.

---

## FASE 5 — Empty

**Qué ves al terminar:** distingue “sin usuarios” (éxito vacío) de un error de red.

**Tiempo:** 10 minutos

#### Paso 5.1 — 🔌 ✏️ Agregar estado empty en `src/App.tsx`

> **¿Qué hace?** Después de loading y error, comprueba si el array está vacío.
> **¿Por qué importa?** Una lista vacía es un **resultado exitoso**, no un fallo. Mostrarlo como error confunde al usuario.

Agregá esta condición **después** de loading y error:

```tsx
if (users.length === 0) {
  return (
    <Alert severity="info" sx={{ margin: 3 }}>
      No se encontraron usuarios.
    </Alert>
  );
}
```

El orden completo queda:

```tsx
if (loading) {
  return <CircularProgress />;
}

if (error) {
  return <Alert severity="error">{error}</Alert>;
}

if (users.length === 0) {
  return <Alert severity="info">No hay usuarios.</Alert>;
}

return ( /* lista */ );
```

**Prueba:** después de recibir la respuesta, ejecutá temporalmente `setUsers([])` para comprobar el estado empty.

---

## FASE 6 — AbortController

**Qué ves al terminar:** igual que Fase 5, pero cancela la petición si el componente desaparece.

**Tiempo:** 20 minutos

#### Paso 6.1 — 🔌 ✏️ Reemplazar `src/App.tsx`

> **¿Qué hace?** Crea un `AbortController`, pasa su `signal` a `fetch`, y llama `abort()` en el cleanup del efecto.
> **¿Por qué importa?** Evita actualizar estado de un componente ya desmontado (memory leak, warnings en consola).

```tsx
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

type User = {
  id: number;
  name: string;
};

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = (await response.json()) as User[];
        setUsers(result);
      } catch (caughtError: unknown) {
        if (
          caughtError instanceof DOMException &&
          caughtError.name === "AbortError"
        ) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "No fue posible cargar los usuarios"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadUsers();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading) {
    return <CircularProgress sx={{ margin: 4 }} />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (users.length === 0) {
    return <Alert severity="info">No hay usuarios.</Alert>;
  }

  return (
    <List>
      {users.map((user) => (
        <ListItem key={user.id}>
          <ListItemText primary={user.name} />
        </ListItem>
      ))}
    </List>
  );
}

export default App;
```

#### Explicación línea por línea

| Línea / bloque | ¿Qué hace? | ¿Por qué importa? |
| --- | --- | --- |
| `new AbortController()` | Crea un controlador de cancelación. | Uno por efecto / petición. |
| `{ signal: controller.signal }` | Conecta fetch con el controlador. | Sin signal, no se puede cancelar. |
| `AbortError` → `return` | Ignora cancelaciones. | Cancelar no es un error para el usuario. |
| `if (!controller.signal.aborted)` | Solo actualiza si no fue cancelado. | Evita `setState` en componente desmontado. |
| `return () => controller.abort()` | Cleanup del efecto. | React lo ejecuta al desmontar o antes de re-ejecutar. |

**Prueba:** con `StrictMode` activo, en Network podés ver una petición cancelada y la siguiente completada.

---

## FASE 7 — Paginación

**Qué ves al terminar:** 5 publicaciones por página con controles de `Pagination`.

**Tiempo:** 25 minutos

#### Paso 7.1 — 🔌 ✏️ Reemplazar `src/App.tsx`

> **¿Qué hace?** Descarga todos los posts y muestra una porción con `slice`. `Pagination` cambia qué porción se ve.
> **¿Por qué importa?** Aprendés paginación client-side. En APIs grandes pedirías página al servidor; acá nos concentramos en React.

```tsx
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const itemsPerPage = 5;

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        setPosts((await response.json()) as Post[]);
      } catch (caughtError: unknown) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "No fue posible cargar las publicaciones"
        );
      } finally {
        setLoading(false);
      }
    }

    void loadPosts();
  }, []);

  if (loading) {
    return <CircularProgress sx={{ margin: 4 }} />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (posts.length === 0) {
    return <Alert severity="info">No hay publicaciones.</Alert>;
  }

  const pageCount = Math.ceil(posts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const visiblePosts = posts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Stack spacing={2} sx={{ padding: 3 }}>
      <List>
        {visiblePosts.map((post) => (
          <ListItem key={post.id}>
            <ListItemText
              primary={post.title}
              secondary={post.body}
            />
          </ListItem>
        ))}
      </List>

      <Pagination
        count={pageCount}
        page={page}
        onChange={(_event, newPage) => setPage(newPage)}
        color="primary"
      />
    </Stack>
  );
}

export default App;
```

#### Explicación línea por línea

| Línea / bloque | ¿Qué hace? | ¿Por qué importa? |
| --- | --- | --- |
| `const itemsPerPage = 5` | Cuántos ítems por página. | Constante configurable. |
| `Math.ceil(posts.length / itemsPerPage)` | Número total de páginas. | `ceil` redondea hacia arriba (ej. 101 items ÷ 5 = 21 páginas). |
| `(page - 1) * itemsPerPage` | Índice de inicio. | Página 2 → `(2-1) × 5 = 5` → empieza en el ítem 5. |
| `posts.slice(inicio, fin)` | Porción del array **sin modificarlo**. | Paginación client-side pura. |
| `onChange={(_event, newPage) => ...}` | Recibe la página seleccionada. | `_event` se ignora con guión bajo. |

**Prueba:** cambiá `itemsPerPage` a 10.

---

## FASE 8 — Debounced search

**Qué ves al terminar:** campo de búsqueda que filtra nombres con 400 ms de retraso.

**Tiempo:** 25 minutos

#### Paso 8.1 — 🔌 ✏️ Reemplazar `src/App.tsx`

> **¿Qué hace?** `search` cambia con cada tecla; `debouncedSearch` solo cambia 400 ms después de dejar de escribir.
> **¿Por qué importa?** Evita filtrar en cada pulsación — menos trabajo y mejor UX en búsquedas costosas.

```tsx
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const names = [
  "Dalia",
  "Antonella",
  "Benjamín",
  "Ana",
  "Daniel",
  "Laura",
];

function App() {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] =
    useState<string>("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  const normalizedSearch = debouncedSearch
    .trim()
    .toLocaleLowerCase();

  const filteredNames = names.filter((name) =>
    name.toLocaleLowerCase().includes(normalizedSearch)
  );

  return (
    <Stack spacing={2} sx={{ padding: 3, maxWidth: 500 }}>
      <TextField
        label="Buscar"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      <Typography color="text.secondary">
        Búsqueda aplicada: {debouncedSearch || "ninguna"}
      </Typography>

      <List>
        {filteredNames.map((name) => (
          <ListItem key={name}>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

export default App;
```

#### Explicación línea por línea

| Línea / bloque | ¿Qué hace? | ¿Por qué importa? |
| --- | --- | --- |
| `setTimeout(..., 400)` | Programa actualización en 400 ms. | Espera a que el usuario deje de escribir. |
| `clearTimeout` en cleanup | Cancela el timeout anterior. | Cada tecla reinicia la espera — solo sobrevive el último. |
| `toLocaleLowerCase()` | Comparación sin importar mayúsculas. | "Ana" coincide con "ana". |
| `includes(normalizedSearch)` | ¿El nombre contiene el texto? | Filtrado parcial, no exacto. |
| `slotProps.input.startAdornment` | Icono dentro del campo. | API moderna de MUI v6+. |

**Prueba:** cambiá el retraso a 800 ms y observá la diferencia en el texto “Búsqueda aplicada”.

---

## FASE 9 — useToggle

**Qué ves al terminar:** botón Mostrar/Ocultar que controla un bloque de texto.

**Tiempo:** 20 minutos

#### Paso 9.1 — 🆕 Crear `src/hooks/useToggle.ts`

> **¿Qué hace?** Encapsula un booleano y una función para alternarlo.
> **¿Por qué importa?** Primer custom hook: extrae lógica repetible fuera del componente.

```tsx
import { useCallback, useState } from "react";

export function useToggle(
  initialValue = false
): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle];
}
```

| Línea / bloque | ¿Qué hace? | ¿Por qué importa? |
| --- | --- | --- |
| `[boolean, () => void]` | Tipo de retorno: tupla. | Mismo patrón que `useState`. |
| `useCallback(..., [])` | Función estable entre renders. | Útil cuando se pasa a componentes hijos. |
| `setValue((prev) => !prev)` | Invierte el valor anterior. | Forma segura de actualizar según el previo. |

#### Paso 9.2 — 🔌 ✏️ Reemplazar `src/App.tsx`

> **¿Qué hace?** Usa `useToggle` para mostrar u ocultar contenido.
> **¿Por qué importa?** El componente no sabe *cómo* se implementa la alternancia — solo recibe valor y acción.

```tsx
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useToggle } from "./hooks/useToggle";

function App() {
  const [isVisible, toggleVisibility] = useToggle(true);

  return (
    <Stack spacing={2} sx={{ padding: 3, alignItems: "flex-start" }}>
      <Button variant="contained" onClick={toggleVisibility}>
        {isVisible ? "Ocultar" : "Mostrar"}
      </Button>

      {isVisible && (
        <Typography>Contenido controlado por useToggle.</Typography>
      )}
    </Stack>
  );
}

export default App;
```

**Prueba:** usá dos instancias de `useToggle` para controlar dos secciones independientes.

---

## FASE 10 — Integrador: usuarios y publicaciones

**Qué ves al terminar:** app con rutas `/users` y `/posts`, layout compartido, búsqueda con debounce, paginación y `useFetch<T>` reutilizado.

**Tiempo:** aproximadamente 2 horas

**Pasos de esta fase:** 10.1 → 10.2 → … → 10.10

| Paso | Acción | Archivo |
| --- | --- | --- |
| 10.1 | 🆕 Crear | `src/types/User.ts`, `src/types/Post.ts` |
| 10.2 | 🆕 Crear | `src/hooks/useFetch.ts` |
| 10.3 | 🆕 Crear | `src/layouts/AppLayout.tsx` |
| 10.4 | 🆕 Crear | `src/pages/UsersPage.tsx` |
| 10.5 | 🆕 Crear | `src/pages/PostsPage.tsx` |
| 10.6 | ✏️ Modificar | `src/App.tsx` (rutas) |
| 10.7 | ✏️ Modificar | `src/main.tsx` (`BrowserRouter`) |

### Estructura final

```text
src/
├── hooks/
│   ├── useFetch.ts
│   └── useToggle.ts
├── layouts/
│   └── AppLayout.tsx
├── pages/
│   ├── PostsPage.tsx
│   └── UsersPage.tsx
├── types/
│   ├── Post.ts
│   └── User.ts
├── App.tsx
└── main.tsx
```

#### Paso 10.1 — 🆕 Tipos

> **¿Qué hace?** Define interfaces compartidas para usuarios y publicaciones.
> **¿Por qué importa?** Un solo lugar para tipos — las páginas y el hook los importan sin duplicar.

**`src/types/User.ts`**

```tsx
export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
};
```

**`src/types/Post.ts`**

```tsx
export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};
```

#### Paso 10.2 — 🆕 Hook genérico `useFetch<T>`

> **¿Qué hace?** Centraliza fetch + loading + error + AbortController en un hook reutilizable.
> **¿Por qué importa?** `UsersPage` y `PostsPage` comparten la misma lógica de red — solo cambian URL y tipo.

**`src/hooks/useFetch.ts`**

```tsx
import { useEffect, useState } from "react";

type UseFetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = (await response.json()) as T;
        setData(result);
      } catch (caughtError: unknown) {
        if (
          caughtError instanceof DOMException &&
          caughtError.name === "AbortError"
        ) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "No fue posible cargar los datos"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      controller.abort();
    };
  }, [url]);

  return {
    data,
    loading,
    error,
  };
}
```

| Línea / bloque | ¿Qué hace? | ¿Por qué importa? |
| --- | --- | --- |
| `useFetch<T>(url: string)` | Tipo genérico configurable. | Misma función para `User[]` y `Post[]`. |
| `setData(null)` al inicio | Limpia datos viejos. | Al cambiar URL no ves datos de la petición anterior. |
| `[url]` como dependencia | Re-fetch cuando cambia la URL. | Cleanup cancela la petición anterior. |

#### Paso 10.3 — 🆕 Layout común

> **¿Qué hace?** AppBar con navegación y un `Outlet` donde React Router renderiza la página activa.
> **¿Por qué importa?** Header compartido sin duplicarlo en cada página.

**`src/layouts/AppLayout.tsx`**

```tsx
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { NavLink, Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Explorador de datos
          </Typography>

          <Stack direction="row" spacing={1}>
            <NavLink to="/users" style={{ textDecoration: "none" }}>
              {({ isActive }) => (
                <Button
                  color="inherit"
                  variant={isActive ? "outlined" : "text"}
                >
                  Usuarios
                </Button>
              )}
            </NavLink>

            <NavLink to="/posts" style={{ textDecoration: "none" }}>
              {({ isActive }) => (
                <Button
                  color="inherit"
                  variant={isActive ? "outlined" : "text"}
                >
                  Publicaciones
                </Button>
              )}
            </NavLink>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ paddingY: 4 }}>
        <Container maxWidth="md">
          <Outlet />
        </Container>
      </Box>
    </>
  );
}

export default AppLayout;
```

| Línea / bloque | ¿Qué hace? | ¿Por qué importa? |
| --- | --- | --- |
| `NavLink` + `isActive` | Enlace que conoce si su ruta está activa. | Cambia variante del botón según la URL. |
| `<Outlet />` | Espacio para rutas hijas. | Aquí aparece `UsersPage` o `PostsPage`. |

#### Paso 10.4 — 🆕 Vista de usuarios

> **¿Qué hace?** Usa `useFetch<User[]>`, debounce, filtrado y paginación client-side.
> **¿Por qué importa?** Primera página real: cuatro estados + búsqueda + paginación.

**`src/pages/UsersPage.tsx`**

```tsx
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFetch } from "../hooks/useFetch";
import type { User } from "../types/User";

const usersUrl =
  "https://jsonplaceholder.typicode.com/users";
const usersPerPage = 4;

function UsersPage() {
  const {
    data: users,
    loading,
    error,
  } = useFetch<User[]>(usersUrl);

  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] =
    useState<string>("");
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ padding: 5 }}>
        <CircularProgress aria-label="Cargando usuarios" />
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!users || users.length === 0) {
    return (
      <Alert severity="info">
        La API no devolvió usuarios.
      </Alert>
    );
  }

  const normalizedSearch = debouncedSearch
    .trim()
    .toLocaleLowerCase();

  const filteredUsers = users.filter((user) => {
    const searchableText =
      `${user.name} ${user.username} ${user.email}`
        .toLocaleLowerCase();

    return searchableText.includes(normalizedSearch);
  });

  const pageCount = Math.ceil(
    filteredUsers.length / usersPerPage
  );
  const startIndex = (page - 1) * usersPerPage;
  const visibleUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h1">
        Usuarios
      </Typography>

      <TextField
        label="Buscar por nombre, usuario o correo"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      {filteredUsers.length === 0 ? (
        <Alert severity="info">
          No hay usuarios que coincidan con la búsqueda.
        </Alert>
      ) : (
        <>
          <Stack spacing={2}>
            {visibleUsers.map((user) => (
              <Card key={user.id} variant="outlined">
                <CardContent>
                  <Typography variant="h6">
                    {user.name}
                  </Typography>

                  <Typography color="text.secondary">
                    @{user.username}
                  </Typography>

                  <Typography>{user.email}</Typography>
                  <Typography>{user.phone}</Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>

          {pageCount > 1 && (
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_event, newPage) => setPage(newPage)}
              color="primary"
            />
          )}
        </>
      )}
    </Stack>
  );
}

export default UsersPage;
```

**¿Qué sucede al buscar?**

1. `search` cambia inmediatamente.
2. El efecto inicia un timeout de 400 ms.
3. Una nueva tecla cancela el timeout anterior.
4. Cambia `debouncedSearch`.
5. Otro efecto devuelve la página a 1.
6. Se filtran y paginan los resultados.

**Dos estados empty diferentes:**

- La API devolvió `[]`.
- La API tiene datos, pero ningún usuario coincide con la búsqueda.

#### Paso 10.5 — 🆕 Vista de publicaciones

> **¿Qué hace?** Reutiliza `useFetch<Post[]>` y agrega `useToggle` para mostrar/ocultar el cuerpo de cada post.
> **¿Por qué importa?** Demuestra que el hook genérico no duplica lógica — solo cambia el tipo.

**`src/pages/PostsPage.tsx`**

```tsx
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFetch } from "../hooks/useFetch";
import { useToggle } from "../hooks/useToggle";
import type { Post } from "../types/Post";

const postsUrl =
  "https://jsonplaceholder.typicode.com/posts";
const postsPerPage = 10;

function PostsPage() {
  const {
    data: posts,
    loading,
    error,
  } = useFetch<Post[]>(postsUrl);

  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] =
    useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [showBodies, toggleBodies] = useToggle(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ padding: 5 }}>
        <CircularProgress aria-label="Cargando publicaciones" />
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!posts || posts.length === 0) {
    return (
      <Alert severity="info">
        La API no devolvió publicaciones.
      </Alert>
    );
  }

  const normalizedSearch = debouncedSearch
    .trim()
    .toLocaleLowerCase();

  const filteredPosts = posts.filter((post) => {
    const searchableText =
      `${post.title} ${post.body}`.toLocaleLowerCase();

    return searchableText.includes(normalizedSearch);
  });

  const pageCount = Math.ceil(
    filteredPosts.length / postsPerPage
  );
  const startIndex = (page - 1) * postsPerPage;
  const visiblePosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h1">
        Publicaciones
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
      >
        <TextField
          fullWidth
          label="Buscar en título o contenido"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button variant="outlined" onClick={toggleBodies}>
          {showBodies ? "Ocultar textos" : "Mostrar textos"}
        </Button>
      </Stack>

      {filteredPosts.length === 0 ? (
        <Alert severity="info">
          No hay publicaciones que coincidan con la búsqueda.
        </Alert>
      ) : (
        <>
          <Stack spacing={2}>
            {visiblePosts.map((post) => (
              <Card key={post.id} variant="outlined">
                <CardContent>
                  <Typography variant="h6">
                    {post.title}
                  </Typography>

                  {showBodies && (
                    <Typography color="text.secondary">
                      {post.body}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>

          {pageCount > 1 && (
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_event, newPage) => setPage(newPage)}
              color="primary"
            />
          )}
        </>
      )}
    </Stack>
  );
}

export default PostsPage;
```

La diferencia principal con usuarios:

```tsx
useFetch<User[]>(usersUrl);
useFetch<Post[]>(postsUrl);
```

La lógica de red **no se duplicó**.

#### Paso 10.6 — ✏️ Configurar rutas en `src/App.tsx`

> **¿Qué hace?** Declara rutas anidadas: layout común + páginas hijas + redirección y 404.
> **¿Por qué importa?** Conecta layout, usuarios y publicaciones en una sola app navegable.

```tsx
import Alert from "@mui/material/Alert";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import PostsPage from "./pages/PostsPage";
import UsersPage from "./pages/UsersPage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          index
          element={<Navigate to="/users" replace />}
        />

        <Route path="users" element={<UsersPage />} />
        <Route path="posts" element={<PostsPage />} />

        <Route
          path="*"
          element={
            <Alert severity="warning">
              La página solicitada no existe.
            </Alert>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
```

| Línea / bloque | ¿Qué hace? | ¿Por qué importa? |
| --- | --- | --- |
| `<Route element={<AppLayout />}>` | Ruta padre sin path. | Envuelve hijas con el layout. |
| `index` + `Navigate` | `/` redirige a `/users`. | `replace` no agrega entrada extra al historial. |
| `path="*"` | Captura rutas desconocidas. | 404 amigable en vez de pantalla en blanco. |

#### Paso 10.7 — ✏️ Activar `BrowserRouter` en `src/main.tsx`

> **¿Qué hace?** Envuelve la app con `BrowserRouter` para que las rutas observen la URL.
> **¿Por qué importa?** Sin router, `<Routes>` no funciona.

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

| Línea / bloque | ¿Qué hace? | ¿Por qué importa? |
| --- | --- | --- |
| `BrowserRouter` | Usa History API del navegador. | Cambia de vista sin recargar la página. |
| `getElementById("root")!` | Non-null assertion. | TypeScript confía en que existe en `index.html`. |

### Cómo se conectan las piezas

```text
main.tsx
└── BrowserRouter
    └── App.tsx
        └── AppLayout
            ├── navegación
            └── Outlet
                ├── UsersPage → useFetch<User[]>
                └── PostsPage → useFetch<Post[]> + useToggle
```

### Cómo probar los cuatro estados

#### Loading

1. DevTools → Network → **Slow 3G**.
2. Recargá `/users` o `/posts`.
3. Observá `CircularProgress`.

#### Error

Cambiá temporalmente la URL a `/users-inexistentes` → `Alert severity="error"`. Restaurá después.

#### Empty

Modificá temporalmente dentro del hook: `setData([] as T)`. Solo para probar.

#### Success

Endpoints correctos → tarjetas, búsqueda y paginación.

### Errores comunes

| Error | Problema | Solución |
| --- | --- | --- |
| Olvidar `response.ok` | Un 404 se trata como éxito. | `if (!response.ok) throw ...` |
| `useEffect(async () => ...)` | El efecto devuelve una promesa. | Función async interna + `void load()`. |
| Sin `clearTimeout` | Búsquedas antiguas se aplican. | Cleanup en el efecto de debounce. |
| Empty antes de loading | “Sin resultados” mientras carga. | Orden: loading → error → empty → success. |
| No reiniciar página al buscar | Página 8 con 1 página de resultados → vacío. | `useEffect(() => setPage(1), [debouncedSearch])`. |

### ✅ Verificar Fase 10

```bash
npm run dev
```

- `/users` → spinner → tarjetas de usuarios.
- `/posts` → spinner → publicaciones.
- Búsqueda espera 400 ms antes de filtrar.
- Paginación funciona sobre resultados filtrados.
- Botón “Ocultar textos” en posts funciona.

---

## Checkpoint y entrega

Verifica:

- [ ] Al abrir `/users` aparece un spinner y después los usuarios.
- [ ] Al abrir `/posts` aparece un spinner y después los posts.
- [ ] Una respuesta HTTP incorrecta produce un `Alert` de error.
- [ ] Una respuesta vacía produce el estado empty.
- [ ] La búsqueda espera antes de filtrar.
- [ ] Una búsqueda nueva cancela el timeout anterior.
- [ ] La paginación funciona con los datos filtrados.
- [ ] La página vuelve a 1 al cambiar la búsqueda.
- [ ] `useFetch<T>` se reutiliza con `User[]` y `Post[]`.
- [ ] El fetch se cancela en el cleanup.
- [ ] `useToggle` controla la visibilidad del contenido.
- [ ] Las rutas comparten el mismo layout.
- [ ] TypeScript no muestra errores.

Ejecuta:

```bash
npm run build
```

Si compila correctamente:

```bash
git add .
git commit -m "feat: day 3 — useFetch generic hook + users and posts views"
```

---

## Mapa de archivos por fase

| Fase | Archivos nuevos | Archivo que conectás en pantalla |
| --- | --- | --- |
| 0 | — | — (Vite default) |
| 1–8 | — | ✏️ `App.tsx` (cada mini-práctica) |
| 9 | `hooks/useToggle.ts` | ✏️ `App.tsx` |
| 10 | types, useFetch, layout, pages | ✏️ `App.tsx` + ✏️ `main.tsx` |

---

## Estructura del proyecto (integrador final)

```text
dia-3-datos/
├── package.json
├── vite.config.ts
└── src/
    ├── main.tsx              ← Fase 10 ✏️
    ├── App.tsx               ← Fases 1–9 🔌 · Fase 10 ✏️
    ├── hooks/
    │   ├── useFetch.ts       ← Fase 10 🆕
    │   └── useToggle.ts      ← Fase 9 🆕
    ├── layouts/
    │   └── AppLayout.tsx     ← Fase 10 🆕
    ├── pages/
    │   ├── UsersPage.tsx     ← Fase 10 🆕
    │   └── PostsPage.tsx     ← Fase 10 🆕
    └── types/
        ├── User.ts           ← Fase 10 🆕
        └── Post.ts           ← Fase 10 🆕
```

🔌 = se modifica en esa fase para que algo nuevo aparezca en pantalla.

---

## Glosario

| Concepto | Significado |
| --- | --- |
| API | Interfaz mediante la cual un programa obtiene o envía datos. |
| HTTP | Protocolo utilizado para comunicar clientes y servidores web. |
| `fetch` | API del navegador para hacer peticiones HTTP. |
| Promesa | Objeto que representa un resultado futuro. |
| `async` | Marca una función que trabaja con promesas. |
| `await` | Espera el resultado de una promesa dentro de una función async. |
| `Response` | Objeto que representa la respuesta HTTP. |
| JSON | Formato de texto utilizado para intercambiar datos. |
| `response.ok` | Indica si la respuesta HTTP fue exitosa. |
| `try` / `catch` / `finally` | Manejo de errores: intentar, capturar, siempre ejecutar. |
| Loading | Estado en el que la petición continúa pendiente. |
| Error | Estado en el que la petición falló. |
| Empty | Estado exitoso sin datos. |
| Success | Estado exitoso con datos. |
| `AbortController` | Controlador utilizado para cancelar operaciones como fetch. |
| `signal` | Señal que conecta el controlador con la petición. |
| Cleanup | Función que limpia un efecto. |
| Paginación | División de resultados en páginas. |
| Client-side | Operación realizada en el navegador. |
| `slice` | Obtiene una porción de un array sin modificarlo. |
| Debounce | Retraso que espera a que cesen eventos rápidos. |
| `setTimeout` / `clearTimeout` | Programar / cancelar una función diferida. |
| Custom hook | Función `use*` que reutiliza lógica basada en Hooks. |
| Genérico `<T>` | Tipo configurable y reutilizable. |
| `BrowserRouter` | Router que utiliza la URL y el historial del navegador. |
| `Routes` / `Route` | Contenedor y relación path → interfaz. |
| `NavLink` | Enlace que conoce si su ruta está activa. |
| `Outlet` | Lugar donde se renderiza una ruta hija. |

---

## Referencias

- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- [Guía oficial de JSONPlaceholder](https://jsonplaceholder.typicode.com/guide/)
- [React Router: rutas declarativas](https://reactrouter.com/start/declarative/routing)
- [React Router: navegación](https://reactrouter.com/start/declarative/navigating)
- [React Router: actualización de v7 a v8](https://reactrouter.com/upgrading/v7)

---

## Orden recomendado de práctica

Para cada mini-práctica:

1. Escribe el ejemplo.
2. Observa la pestaña Network.
3. Identifica qué estados existen.
4. Provoca un error deliberadamente.
5. Prueba una respuesta vacía.
6. Cambia el tipo de un dato para provocar un error de TypeScript.
7. Corrige todo antes de avanzar.

La idea principal del Día 3 es:

```text
La red es incierta; la interfaz debe representar cada resultado posible.
```
