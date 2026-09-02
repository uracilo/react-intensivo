# Guía Día 3 — Fetch, cuatro estados de UI y custom hooks

**Demo:** [`demos/03-datos/`](../demos/03-datos/)  
**Tiempo estimado:** 8 horas: aproximadamente 5 horas de contenido y 3 horas para pausas, dudas y práctica libre.

En este día aprenderás a consumir datos de una API sin dejar la interfaz en estados ambiguos. La idea central será:

```text
Petición → loading → error, empty o success
```

También extraerás lógica repetida a custom hooks y reutilizarás un hook genérico en las vistas de usuarios y publicaciones.

## Contenido

1. Preparación
2. Conceptos fundamentales
3. Nueve mini-prácticas
4. Integrador con `/users` y `/posts`
5. Checkpoint y entrega
6. Glosario
7. Referencias

---

## 1. Preparación

Puedes partir de:

```text
demos/03-datos/
```

Si necesitas un proyecto nuevo:

```bash
npm create vite@latest dia-3-datos -- --template react-ts
cd dia-3-datos
npm install
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install react-router-dom@7
npm run dev
```

### Nota sobre React Router

El temario usa `react-router-dom`, por eso esta guía fija la versión 7. React Router 8 retiró ese paquete y ahora utiliza importaciones desde `react-router` y `react-router/dom`. Fijar `@7` evita que el ejercicio cambie inesperadamente y conserva la sintaxis del curso.

### API de práctica

Usaremos [JSONPlaceholder](https://jsonplaceholder.typicode.com/), una API REST falsa para ejemplos. Sus recursos incluyen:

- `/users`: 10 usuarios.
- `/posts`: 100 publicaciones.

Endpoints:

```text
https://jsonplaceholder.typicode.com/users
https://jsonplaceholder.typicode.com/posts
```

---

## 2. Conceptos fundamentales

### 2.1 ¿Qué es `fetch`?

`fetch` es una API del navegador para realizar peticiones HTTP:

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

El proceso tiene dos esperas:

1. `fetch(...)` espera la respuesta HTTP.
2. `response.json()` espera a convertir el cuerpo JSON en datos de JavaScript.

### 2.2 `response.ok`

`fetch` no lanza un error automáticamente por todos los estados HTTP problemáticos. Por ejemplo, un `404` sigue produciendo un objeto `Response`.

Por eso comprobamos:

```tsx
if (!response.ok) {
  throw new Error(`Error HTTP: ${response.status}`);
}
```

- `response.ok` es verdadero para respuestas exitosas.
- `!response.ok` significa que la respuesta no fue exitosa.
- `response.status` contiene el código HTTP.
- `throw new Error(...)` interrumpe la función y envía el control al `catch`.

### 2.3 `try`, `catch` y `finally`

```tsx
try {
  // Código que podría fallar.
} catch (error: unknown) {
  // Qué hacer si falla.
} finally {
  // Se ejecuta al final, haya éxito o error.
}
```

El error se tipa como `unknown` porque no debemos asumir que siempre será una instancia de `Error`:

```tsx
const message =
  error instanceof Error
    ? error.message
    : "Ocurrió un error desconocido";
```

### 2.4 Los cuatro estados de la interfaz

Una pantalla que obtiene datos debería distinguir:

| Estado | Qué significa | Componente MUI posible |
| --- | --- | --- |
| Loading | La petición sigue en curso. | `CircularProgress` |
| Error | La petición falló. | `Alert severity="error"` |
| Empty | Terminó correctamente, pero no hay datos. | `Alert severity="info"` |
| Success | Hay datos disponibles. | Lista, tarjetas o tabla |

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

- `null`: todavía no hay un resultado.
- `[]`: la petición terminó y devolvió una lista vacía.
- Un error: no sabemos si había resultados porque la petición falló.

### 2.5 Tipar respuestas de una API

Para usuarios:

```tsx
type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};
```

Para publicaciones:

```tsx
type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};
```

Después podemos declarar:

```tsx
const [users, setUsers] = useState<User[]>([]);
```

Y convertir la respuesta:

```tsx
const result = (await response.json()) as User[];
```

### Importante: TypeScript no valida JSON en tiempo de ejecución

`as User[]` le dice a TypeScript que confíe en nosotros. Si el servidor devuelve otra estructura, TypeScript no puede detectarlo mientras la aplicación está ejecutándose.

En una aplicación de producción podrías validar la respuesta con una biblioteca como Zod. En esta práctica nos concentraremos en los tipos estáticos.

### 2.6 `AbortController`

Una petición puede seguir activa cuando el componente desaparece, la URL cambia o comienza una búsqueda nueva.

`AbortController` permite cancelarla:

```tsx
const controller = new AbortController();

fetch(url, {
  signal: controller.signal,
});

return () => {
  controller.abort();
};
```

La señal conecta la petición con el controlador. El cleanup de `useEffect` llama a `abort()`.

Una cancelación no debe mostrarse como error:

```tsx
if (error instanceof DOMException && error.name === "AbortError") {
  return;
}
```

### 2.7 Paginación client-side

JSONPlaceholder tiene pocos usuarios y 100 posts, así que descargaremos el array completo y mostraremos una parte.

```tsx
const startIndex = (page - 1) * itemsPerPage;
const visibleItems = items.slice(
  startIndex,
  startIndex + itemsPerPage
);
```

Si estamos en la página 2 y mostramos 5 elementos:

```text
startIndex = (2 - 1) × 5 = 5
```

Número de páginas:

```tsx
const pageCount = Math.ceil(items.length / itemsPerPage);
```

`Math.ceil` redondea hacia arriba.

> En una API grande normalmente pediríamos una página al servidor. Esta práctica utiliza paginación client-side para concentrarse en React.

### 2.8 Debounce

Debounce espera un pequeño tiempo después de la última pulsación antes de aplicar una búsqueda.

```text
Escribe D → espera
Escribe Da → cancela la espera anterior
Escribe Dal → cancela otra vez
Deja de escribir → aplica "Dal"
```

```tsx
useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    setDebouncedSearch(search);
  }, 400);

  return () => {
    window.clearTimeout(timeoutId);
  };
}, [search]);
```

Cada cambio limpia el timeout anterior. Solo sobrevive el último.

### 2.9 Custom hooks

Un custom hook es una función que reutiliza lógica basada en Hooks.

Convenciones:

- Su nombre comienza con `use`.
- Puede llamar otros Hooks.
- Debe respetar las reglas de los Hooks.
- Comparte lógica, no una interfaz visual.

Ejemplos: `useToggle`, `useFetch` y `useDebouncedValue`.

### 2.10 Genéricos

Queremos que `useFetch` pueda devolver usuarios, posts u otros datos:

```tsx
function useFetch<T>(url: string) {
  // ...
}
```

`T` es un tipo pendiente de especificar.

Al usarlo:

```tsx
const usersRequest = useFetch<User[]>(usersUrl);
const postsRequest = useFetch<Post[]>(postsUrl);
```

En la primera llamada `T` equivale a `User[]` y en la segunda a `Post[]`.

---

## 3. Mini-prácticas

Cada mini-práctica puede reemplazar temporalmente `src/App.tsx`, salvo cuando se indique crear un archivo adicional.

### 3.1 Fetch on mount

**Tiempo:** 25 minutos  
**Objetivo:** pedir usuarios cuando el componente aparece.

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

### Explicación

```tsx
useEffect(() => {
  // ...
}, []);
```

El array vacío indica que el efecto se ejecuta al montar.

```tsx
async function loadUsers() {
```

La función interna puede usar `await`. No hacemos directamente async el callback de `useEffect` porque el efecto debe devolver nada o una función de cleanup, no una promesa.

```tsx
void loadUsers();
```

Ejecuta la función e indica explícitamente que no utilizaremos su promesa desde ese punto.

Esta primera versión todavía no maneja errores, loading ni cancelación. Los agregaremos gradualmente.

**Prueba:** muestra `username` en vez de `name`.

---

### 3.2 Tipar la respuesta

**Tiempo:** 15 minutos  
**Objetivo:** describir la estructura de un usuario.

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

`User[]` significa “array de objetos User”. Gracias al tipo, TypeScript conoce `user.id`, `user.name` y `user.email`.

**Error intencional:** escribe `user.emale`. TypeScript indicará que esa propiedad no existe. Corrígela después.

---

### 3.3 Loading

**Tiempo:** 10 minutos  
**Objetivo:** mostrar progreso mientras esperamos.

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

`loading` comienza en `true` porque la petición todavía no ha terminado. Al guardar los datos, cambia a `false`.

Esta versión tiene un problema: si `fetch` falla, nunca llega a `setLoading(false)`. Lo solucionaremos con `finally`.

**Prueba:** cambia temporalmente la velocidad de red desde las herramientas del navegador para observar el spinner.

---

### 3.4 Error

**Tiempo:** 15 minutos  
**Objetivo:** mostrar un error sin dejar el spinner activo.

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

`finally` siempre apaga loading, tanto después del éxito como después del error.

**Prueba:** cambia el endpoint a `/users-inexistentes` para provocar un `404` y observar `Alert`.

---

### 3.5 Empty

**Tiempo:** 10 minutos  
**Objetivo:** distinguir una respuesta vacía de un error.

Agrega esta condición después de loading y error:

```tsx
if (users.length === 0) {
  return (
    <Alert severity="info" sx={{ margin: 3 }}>
      No se encontraron usuarios.
    </Alert>
  );
}
```

El orden completo es:

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

return <UsersList users={users} />;
```

Una lista vacía es un resultado exitoso. No debe mostrarse como error.

**Prueba:** después de recibir la respuesta ejecuta temporalmente `setUsers([])` para comprobar el estado empty.

---

### 3.6 `AbortController`

**Tiempo:** 20 minutos  
**Objetivo:** cancelar la petición en el cleanup.

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

La opción `signal` conecta el fetch con el controlador. El cleanup cancela la petición:

```tsx
return () => {
  controller.abort();
};
```

`AbortError` es una cancelación esperada, no un fallo que debamos enseñar a la persona usuaria.

En `finally` comprobamos `signal.aborted` para no actualizar el estado de un efecto que ya fue limpiado.

**Prueba:** observa la pestaña Network con `StrictMode` activo. En desarrollo podrías ver una primera petición cancelada y la siguiente completada.

---

### 3.7 Paginación

**Tiempo:** 25 minutos  
**Objetivo:** mostrar cinco publicaciones por página.

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

`slice(inicio, fin)` crea una porción del array sin modificarlo.

En `onChange` no necesitamos el primer argumento, por eso lo llamamos `_event`. `newPage` contiene la página seleccionada.

**Prueba:** cambia `itemsPerPage` a 10.

---

### 3.8 Debounced search

**Tiempo:** 25 minutos  
**Objetivo:** retrasar el filtrado hasta que la persona deje de escribir.

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

`search` cambia con cada tecla. `debouncedSearch` cambia solo después de 400 ms sin nuevas pulsaciones.

`InputAdornment` coloca el icono dentro del campo. La API moderna de MUI lo pasa mediante `slotProps.input`.

`toLocaleLowerCase()` permite comparar sin importar mayúsculas y `includes()` comprueba si el nombre contiene el texto.

**Prueba:** cambia el retraso a 800 ms y observa la diferencia.

---

### 3.9 `useToggle`

**Tiempo:** 20 minutos  
**Objetivo:** extraer la lógica de un booleano a un custom hook.

#### `src/hooks/useToggle.ts`

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

El hook empieza con `use` y puede llamar `useState`.

El tipo de retorno:

```tsx
[boolean, () => void]
```

significa que devuelve un array con un booleano y una función sin argumentos ni resultado.

`useCallback` conserva la misma referencia de `toggle` entre renders. No es imprescindible para un toggle tan pequeño, pero resulta útil cuando devolvemos funciones desde hooks reutilizables.

#### `src/App.tsx`

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

El componente no necesita conocer cómo se implementa la alternancia. Solo recibe el valor y la acción.

**Prueba:** utiliza dos instancias de `useToggle` para controlar dos secciones independientes.

---

## 4. Integrador — Usuarios y publicaciones

**Tiempo:** aproximadamente 2 horas

Construiremos:

- Un hook genérico `useFetch<T>(url)`.
- Un hook `useToggle`.
- Un layout común.
- Rutas `/users` y `/posts`.
- Cuatro estados de UI en ambas vistas.
- Búsqueda con debounce.
- Paginación client-side.

### 4.1 Estructura final

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

### 4.2 Tipos

#### `src/types/User.ts`

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

#### `src/types/Post.ts`

```tsx
export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};
```

Mantener los tipos en archivos separados permite compartirlos sin duplicarlos.

### 4.3 Hook genérico `useFetch<T>`

#### `src/hooks/useFetch.ts`

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

#### ¿Qué está generalizado?

El hook no sabe si `T` representa:

- `User[]`.
- `Post[]`.
- Un solo objeto.
- Cualquier otra respuesta.

Solo administra:

```text
URL → petición → loading / error / data → cleanup
```

La dependencia `[url]` provoca una petición nueva cuando cambia la URL y el cleanup cancela la anterior.

### 4.4 Hook `useToggle`

Conserva el archivo de la mini-práctica 9:

#### `src/hooks/useToggle.ts`

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

### 4.5 Layout común

El layout contiene el encabezado y un `Outlet`. React Router coloca dentro del `Outlet` la página correspondiente a la URL.

#### `src/layouts/AppLayout.tsx`

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

`NavLink` conoce la ruta activa. Su función hija recibe `isActive` y cambia la variante del botón.

`Outlet` es el espacio reservado para `UsersPage` o `PostsPage`.

### 4.6 Vista de usuarios

#### `src/pages/UsersPage.tsx`

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

### ¿Qué sucede al buscar?

1. `search` cambia inmediatamente.
2. El efecto inicia un timeout.
3. Una nueva tecla cancela el timeout anterior.
4. Después de 400 ms, cambia `debouncedSearch`.
5. Otro efecto devuelve la página a 1.
6. Se filtran y paginan los resultados.

Hay dos estados empty diferentes:

- La API devolvió `[]`.
- La API tiene datos, pero ningún usuario coincide con la búsqueda.

### 4.7 Vista de publicaciones

Reutilizaremos exactamente el mismo `useFetch<T>`, ahora con `Post[]`. También usaremos `useToggle` para mostrar u ocultar el contenido de las publicaciones.

#### `src/pages/PostsPage.tsx`

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

La diferencia principal está en el tipo genérico:

```tsx
useFetch<User[]>(usersUrl);
useFetch<Post[]>(postsUrl);
```

La lógica de red no se duplicó.

### 4.8 Configurar las rutas

#### `src/App.tsx`

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

`Routes` agrupa las rutas. Cada `Route` relaciona un path con un elemento.

La ruta sin `path` contiene el layout común. Sus rutas hijas se muestran en el `Outlet`.

```tsx
<Route index element={<Navigate to="/users" replace />} />
```

Cuando la URL es `/`, `Navigate` envía a `/users`. `replace` sustituye la entrada actual del historial en vez de agregar otra.

```tsx
<Route path="*" ... />
```

`*` captura cualquier ruta no reconocida.

### 4.9 Activar `BrowserRouter`

#### `src/main.tsx`

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

`BrowserRouter` observa la URL y utiliza la History API del navegador para cambiar de vista sin recargar toda la página.

El signo `!` después de `getElementById("root")` le dice a TypeScript que sabemos que el elemento existe en `index.html`.

### 4.10 Cómo se conectan las piezas

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

El hook `useFetch` administra la petición. Las páginas deciden cómo presentar los cuatro estados y cómo filtrar o paginar los datos.

### 4.11 Cómo probar los cuatro estados

#### Loading

En las herramientas de desarrollo del navegador:

1. Abre Network.
2. Selecciona una velocidad lenta, como Slow 3G.
3. Recarga la página.
4. Observa `CircularProgress`.

#### Error

Cambia temporalmente:

```tsx
const usersUrl =
  "https://jsonplaceholder.typicode.com/users";
```

por:

```tsx
const usersUrl =
  "https://jsonplaceholder.typicode.com/users-inexistentes";
```

Deberías ver `Alert severity="error"`. Restaura la URL.

#### Empty

Para probarlo sin cambiar el hook, sustituye temporalmente la URL por un endpoint o filtro que produzca un array vacío. También puedes modificar temporalmente el resultado dentro del hook:

```tsx
setData([] as T);
```

Hazlo únicamente para probar y después recupera `setData(result)`.

#### Success

Usa los endpoints correctos. Deben aparecer tarjetas, búsqueda y paginación.

### 4.12 Errores comunes

#### Olvidar `response.ok`

```tsx
const response = await fetch(url);
const result = await response.json();
```

Así podrías intentar tratar un `404` como éxito.

#### Hacer async directamente el callback del efecto

Evita:

```tsx
useEffect(async () => {
  // ...
}, []);
```

Crea una función async interna y ejecútala.

#### No limpiar el timeout

Sin `clearTimeout` podrían ejecutarse búsquedas antiguas.

#### Mostrar empty durante loading

Si el array comienza vacío y verificas `data.length === 0` antes de `loading`, mostrarás “sin resultados” mientras la petición sigue en curso.

#### No reiniciar la página al buscar

Si estás en la página 8 y el filtro solo tiene una página, podrías ver un espacio vacío. Por eso hacemos:

```tsx
useEffect(() => {
  setPage(1);
}, [debouncedSearch]);
```

#### Olvidar que el tipo genérico no valida la respuesta

`useFetch<User[]>` ayuda a programar, pero no garantiza que el servidor haya enviado usuarios válidos.

---

## 5. Checkpoint y entrega

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

## 6. Glosario

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
| `try` | Contiene código que podría fallar. |
| `catch` | Recibe un error ocurrido dentro de try. |
| `finally` | Se ejecuta al final, exista éxito o error. |
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
| `setTimeout` | Programa una función para ejecutarse después. |
| `clearTimeout` | Cancela un timeout pendiente. |
| InputAdornment | Elemento decorativo dentro de un input de MUI. |
| Custom hook | Función `use*` que reutiliza lógica basada en Hooks. |
| Genérico `<T>` | Tipo configurable y reutilizable. |
| `BrowserRouter` | Router que utiliza la URL y el historial del navegador. |
| `Routes` | Contenedor declarativo de rutas. |
| `Route` | Relación entre un path y una interfaz. |
| `NavLink` | Enlace que conoce si su ruta está activa. |
| `Outlet` | Lugar donde se renderiza una ruta hija. |

---

## 7. Referencias

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

