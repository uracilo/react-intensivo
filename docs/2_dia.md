# Guía Día 2 — Estado, formularios, refs y `useEffect`

**Demo:** [`demos/02-estado/`](../demos/02-estado/)  
**Tiempo estimado:** 8 horas: aproximadamente 5.5 horas de contenido y 2.5 horas para pausas, dudas y práctica libre.

Esta guía continúa después de los fundamentos de React, TypeScript, props, listas y MUI. Hoy aprenderás a crear interfaces que **recuerdan información, reaccionan a eventos, validan formularios y ejecutan efectos**.

## Contenido

1. Preparación
2. Conceptos del día
3. Trece mini-prácticas
4. Integrador: TODO list con MUI
5. Checkpoint y entrega
6. Glosario

---

## 1. Preparación

Puedes partir de la demo del Día 1 o abrir:

```text
demos/02-estado/
```

Para crear un proyecto nuevo:

```bash
npm create vite@latest dia-2-estado -- --template react-ts
cd dia-2-estado
npm install
npm install @mui/material @emotion/react @emotion/styled
npm run dev
```

Trabajaremos principalmente en `src/App.tsx` y crearemos componentes adicionales cuando sea necesario.

---

## 2. Conceptos del día

### 2.1 Estado y `useState<T>`

El **estado** es información que un componente recuerda y que puede cambiar mientras usamos la aplicación: el número de un contador, el texto de un input o las tareas de una lista.

```tsx
import { useState } from "react";

const [count, setCount] = useState<number>(0);
```

- `useState` es un Hook de React.
- `<number>` indica que el estado guardará un número.
- `0` es el valor inicial.
- `count` contiene el valor actual.
- `setCount` es la función que lo actualiza.
- `[count, setCount]` usa desestructuración de un array.

Cuando llamamos a `setCount`, React guarda el valor nuevo y vuelve a renderizar el componente.

### 2.2 Reglas de los Hooks

Los Hooks son funciones especiales como `useState`, `useRef` y `useEffect`. Deben llamarse:

1. En el nivel superior del componente.
2. Dentro de un componente de React o un Hook personalizado.

Esto es correcto:

```tsx
function App() {
  const [count, setCount] = useState<number>(0);
  return <p>{count}</p>;
}
```

Esto es incorrecto:

```tsx
function App() {
  if (true) {
    const [count, setCount] = useState<number>(0);
  }
}
```

No coloques Hooks dentro de condiciones, ciclos, funciones internas ni eventos. React necesita que se ejecuten siempre en el mismo orden.

### 2.3 Updater: calcular desde el valor anterior

Cuando el estado nuevo depende del anterior, utiliza:

```tsx
setCount((prev) => prev + 1);
```

`prev` representa el valor anterior garantizado por React.

### 2.4 Eventos tipados

Para cambios en un input:

```tsx
import type { ChangeEvent } from "react";

function handleChange(event: ChangeEvent<HTMLInputElement>) {
  console.log(event.target.value);
}
```

- `ChangeEvent` representa un evento de cambio.
- `HTMLInputElement` indica que proviene de un input.
- `event.target.value` contiene el texto actual.

Para enviar un formulario:

```tsx
import type { FormEvent } from "react";

function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
}
```

`preventDefault()` evita que el navegador recargue la página.

### 2.5 Inmutabilidad

No modifiques directamente arrays u objetos guardados en estado.

Incorrecto:

```tsx
tasks.push("Nueva tarea");
setTasks(tasks);
```

Correcto:

```tsx
setTasks((prev) => [...prev, "Nueva tarea"]);
```

`...prev` es el operador spread. Copia los elementos anteriores en un array nuevo.

Para objetos:

```tsx
setUser((prev) => ({
  ...prev,
  name: "Dalia",
}));
```

Esto crea un objeto nuevo, copia sus propiedades y reemplaza únicamente `name`.

### 2.6 Formularios controlados y no controlados

Un input **controlado** obtiene su valor del estado:

```tsx
<TextField
  value={name}
  onChange={(event) => setName(event.target.value)}
/>
```

Un input **no controlado** conserva el valor en el DOM y podemos acceder a él con una ref:

```tsx
const inputRef = useRef<HTMLInputElement>(null);

<TextField inputRef={inputRef} />
```

Los controlados facilitan validación y botones habilitados o deshabilitados. Las refs sirven para focus, selección de texto o APIs del navegador.

### 2.7 `styled()` frente a `sx`

`sx` sirve para estilos locales:

```tsx
<Button sx={{ marginTop: 2, backgroundColor: "purple" }}>
  Guardar
</Button>
```

`styled()` crea un componente reutilizable:

```tsx
import ListItem from "@mui/material/ListItem";
import { styled } from "@mui/material/styles";

const StyledListItem = styled(ListItem)(({ theme }) => ({
  border: "1px solid",
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
}));
```

Regla práctica: usa `sx` para una modificación específica y `styled()` para un patrón visual que repetirás.

---

## 3. Mini-prácticas

Cada ejemplo puede colocarse temporalmente en `src/App.tsx`, salvo cuando se indique crear otro archivo.

### 3.1 Counter

**Tiempo:** 10 minutos  
**Objetivo:** crear estado numérico y actualizarlo.

```tsx
import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function App() {
  const [count, setCount] = useState<number>(0);

  function increment() {
    setCount((prev) => prev + 1);
  }

  return (
    <Stack spacing={2} sx={{ padding: 3, alignItems: "flex-start" }}>
      <Typography variant="h4">Contador: {count}</Typography>

      <Button variant="contained" onClick={increment}>
        Sumar 1
      </Button>
    </Stack>
  );
}

export default App;
```

`count` contiene el número actual. `setCount` lo actualiza y provoca un nuevo render. `onClick={increment}` ejecuta la función al hacer clic.

```tsx
setCount((prev) => prev + 1);
```

Esta es una función actualizadora: recibe el valor anterior y devuelve el nuevo.

**Prueba:** comienza en 10 y haz que el botón sume 5.

---

### 3.2 Counter positivo y negativo

**Tiempo:** 10 minutos  
**Objetivo:** modificar un estado con tres acciones.

```tsx
import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <Stack spacing={2} sx={{ padding: 3, alignItems: "flex-start" }}>
      <Typography variant="h4">{count}</Typography>

      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          disabled={count === 0}
          onClick={() => setCount((prev) => prev - 1)}
        >
          −
        </Button>

        <Button
          variant="contained"
          onClick={() => setCount((prev) => prev + 1)}
        >
          +
        </Button>

        <Button variant="text" onClick={() => setCount(0)}>
          Reiniciar
        </Button>
      </Stack>
    </Stack>
  );
}

export default App;
```

`() => ...` crea una función flecha que React ejecutará al hacer clic. Usamos `setCount(0)` para reiniciar porque el resultado no depende del valor anterior.

```tsx
disabled={count === 0}
```

`===` compara dos valores. El botón se deshabilita cuando el contador vale cero.

**Prueba:** agrega un botón que sume 10.

---

### 3.3 Toggle

**Tiempo:** 10 minutos  
**Objetivo:** alternar un booleano.

```tsx
import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function App() {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  function toggleVisibility() {
    setIsVisible((prev) => !prev);
  }

  return (
    <Stack spacing={2} sx={{ padding: 3, alignItems: "flex-start" }}>
      <Button variant="contained" onClick={toggleVisibility}>
        {isVisible ? "Ocultar" : "Mostrar"}
      </Button>

      {isVisible && (
        <Typography>Este texto puede mostrarse u ocultarse.</Typography>
      )}
    </Stack>
  );
}

export default App;
```

`!prev` invierte un booleano: `true` se convierte en `false` y viceversa. El operador `&&` renderiza el texto únicamente si `isVisible` es verdadero.

**Prueba:** haz que comience oculto.

---

### 3.4 Input controlado

**Tiempo:** 15 minutos  
**Objetivo:** sincronizar un `TextField` con el estado.

```tsx
import { useState } from "react";
import type { ChangeEvent } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

function App() {
  const [name, setName] = useState<string>("");

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  return (
    <Stack spacing={2} sx={{ padding: 3, maxWidth: 400 }}>
      <TextField
        label="Nombre"
        value={name}
        onChange={handleNameChange}
      />

      <Typography>Escribiste: {name}</Typography>

      <Button variant="outlined" onClick={() => setName("")}>
        Limpiar
      </Button>
    </Stack>
  );
}

export default App;
```

El flujo es:

```text
La persona escribe → onChange → setName → nuevo render → value actualizado
```

`event.target.value` contiene el texto actual. Como `value={name}` proviene del estado, el input es controlado.

**Prueba:** muestra también la cantidad de caracteres con `name.length`.

---

### 3.5 Add to list

**Tiempo:** 20 minutos  
**Objetivo:** agregar valores a un array de forma inmutable.

```tsx
import { useState } from "react";
import type { FormEvent } from "react";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

function App() {
  const [newItem, setNewItem] = useState<string>("");
  const [items, setItems] = useState<string[]>([]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanItem = newItem.trim();

    if (cleanItem === "") {
      return;
    }

    setItems((prev) => [...prev, cleanItem]);
    setNewItem("");
  }

  return (
    <Stack spacing={2} sx={{ padding: 3, maxWidth: 500 }}>
      <Stack
        component="form"
        direction="row"
        spacing={1}
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          label="Nuevo elemento"
          value={newItem}
          onChange={(event) => setNewItem(event.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={newItem.trim() === ""}
        >
          Agregar
        </Button>
      </Stack>

      <List>
        {items.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List>

      <Typography>Total: {items.length}</Typography>
    </Stack>
  );
}

export default App;
```

`event.preventDefault()` evita que el formulario recargue la página. `trim()` elimina espacios al principio y al final. `[...prev, cleanItem]` crea un array nuevo.

`component="form"` hace que `Stack` se comporte como formulario y `type="submit"` permite enviarlo con el botón o Enter.

> Aquí usamos el índice como `key` solo para concentrarnos en agregar. En el integrador cada tarea tendrá un `id` estable.

**Prueba:** agrega un botón para vaciar toda la lista.

---

### 3.6 Delete

**Tiempo:** 15 minutos  
**Objetivo:** borrar un elemento sin modificar directamente el array.

```tsx
import { useState } from "react";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

type Item = {
  id: number;
  name: string;
};

const initialItems: Item[] = [
  { id: 1, name: "Aprender useState" },
  { id: 2, name: "Practicar eventos" },
  { id: 3, name: "Aprender formularios" },
];

function App() {
  const [items, setItems] = useState<Item[]>(initialItems);

  function deleteItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <List sx={{ maxWidth: 500 }}>
      {items.length === 0 && (
        <Typography sx={{ padding: 2 }}>La lista está vacía.</Typography>
      )}

      {items.map((item) => (
        <ListItem
          key={item.id}
          secondaryAction={
            <Button color="error" onClick={() => deleteItem(item.id)}>
              Borrar
            </Button>
          }
        >
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </List>
  );
}

export default App;
```

`filter()` crea un array nuevo y conserva los elementos cuya condición sea verdadera:

```tsx
prev.filter((item) => item.id !== id)
```

El elemento con el `id` indicado produce `false` y queda fuera.

**Prueba:** agrega un botón “Restaurar” que ejecute `setItems(initialItems)`.

---

### 3.7 Update object

**Tiempo:** 20 minutos  
**Objetivo:** actualizar propiedades sin perder el resto del objeto.

```tsx
import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

type User = {
  name: string;
  city: string;
  isStudent: boolean;
};

function App() {
  const [user, setUser] = useState<User>({
    name: "Dalia",
    city: "Ciudad de México",
    isStudent: true,
  });

  function changeCity() {
    setUser((prev) => ({
      ...prev,
      city: "Coyoacán",
    }));
  }

  function toggleStudent() {
    setUser((prev) => ({
      ...prev,
      isStudent: !prev.isStudent,
    }));
  }

  return (
    <Stack spacing={2} sx={{ padding: 3, maxWidth: 450 }}>
      <TextField
        label="Nombre"
        value={user.name}
        onChange={(event) =>
          setUser((prev) => ({
            ...prev,
            name: event.target.value,
          }))
        }
      />

      <Typography>Nombre: {user.name}</Typography>
      <Typography>Ciudad: {user.city}</Typography>
      <Typography>
        Estudiante: {user.isStudent ? "Sí" : "No"}
      </Typography>

      <Button variant="outlined" onClick={changeCity}>
        Cambiar ciudad
      </Button>

      <Button variant="outlined" onClick={toggleStudent}>
        Cambiar estado de estudiante
      </Button>
    </Stack>
  );
}

export default App;
```

`...prev` copia todas las propiedades. La propiedad escrita después reemplaza únicamente su valor:

```tsx
{
  ...prev,
  city: "Coyoacán",
}
```

No hagas `user.city = "Coyoacán"` porque modificaría directamente el objeto anterior.

**Prueba:** agrega una propiedad `age: number` y un botón para aumentarla.

---

### 3.8 Validación de formulario

**Tiempo:** 20 minutos  
**Objetivo:** usar `required`, regex, `error`, `helperText` y un submit deshabilitado.

```tsx
import { useState } from "react";
import type { FormEvent } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function App() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const nameHasError = name.length > 0 && cleanName === "";
  const emailHasError =
    email.length > 0 && !emailRegex.test(cleanEmail);
  const formIsValid =
    cleanName !== "" && emailRegex.test(cleanEmail);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    alert(`Registro correcto: ${cleanName}`);
  }

  return (
    <Stack
      component="form"
      spacing={2}
      onSubmit={handleSubmit}
      noValidate
      sx={{ padding: 3, maxWidth: 450 }}
    >
      <TextField
        required
        label="Nombre"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={nameHasError}
        helperText={nameHasError ? "El nombre es obligatorio" : " "}
      />

      <TextField
        required
        label="Correo"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={emailHasError}
        helperText={emailHasError ? "Escribe un correo válido" : " "}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={!formIsValid}
      >
        Enviar
      </Button>
    </Stack>
  );
}

export default App;
```

`required` indica que el campo es obligatorio. `emailRegex.test(cleanEmail)` devuelve `true` si el texto coincide con el patrón.

La regex:

```tsx
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

exige texto, una arroba, más texto, un punto y una terminación. Es una comprobación didáctica, no una validación perfecta de todos los correos posibles.

`error` activa el aspecto de error y `helperText` explica el problema. `disabled={!formIsValid}` impide enviar mientras el formulario sea inválido.

> La validación del frontend mejora la experiencia, pero no sustituye la validación del servidor.

**Prueba:** agrega una contraseña de al menos ocho caracteres.

---

### 3.9 Lifting state up

**Tiempo:** 25 minutos  
**Objetivo:** compartir estado entre componentes hermanos.

Lifting state up significa mover el estado al ancestro común más cercano. El padre conserva el dato y lo distribuye mediante props.

#### `src/NameInput.tsx`

```tsx
import type { ChangeEvent } from "react";
import TextField from "@mui/material/TextField";

type NameInputProps = {
  value: string;
  onNameChange: (newName: string) => void;
};

function NameInput({ value, onNameChange }: NameInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onNameChange(event.target.value);
  }

  return (
    <TextField
      label="Nombre"
      value={value}
      onChange={handleChange}
    />
  );
}

export default NameInput;
```

#### `src/NamePreview.tsx`

```tsx
import Typography from "@mui/material/Typography";

type NamePreviewProps = {
  name: string;
};

function NamePreview({ name }: NamePreviewProps) {
  return (
    <Typography>
      Vista previa: {name || "Todavía no hay un nombre"}
    </Typography>
  );
}

export default NamePreview;
```

#### `src/App.tsx`

```tsx
import { useState } from "react";
import Stack from "@mui/material/Stack";
import NameInput from "./NameInput";
import NamePreview from "./NamePreview";

function App() {
  const [name, setName] = useState<string>("");

  return (
    <Stack spacing={2} sx={{ padding: 3, maxWidth: 450 }}>
      <NameInput value={name} onNameChange={setName} />
      <NamePreview name={name} />
    </Stack>
  );
}

export default App;
```

`App` posee el estado. `NameInput` recibe el valor y una función para solicitar cambios. `NamePreview` recibe el mismo valor para mostrarlo.

```tsx
onNameChange: (newName: string) => void;
```

Significa “una función que recibe texto y no devuelve un resultado”.

**Prueba:** crea un tercer componente que muestre `name.length`.

---

### 3.10 Focus con `useRef`

**Tiempo:** 15 minutos  
**Objetivo:** obtener una referencia al input y enfocarlo.

```tsx
import { useRef } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  function focusInput() {
    inputRef.current?.focus();
  }

  return (
    <Stack spacing={2} sx={{ padding: 3, maxWidth: 450 }}>
      <TextField label="Nombre" inputRef={inputRef} />

      <Button variant="contained" onClick={focusInput}>
        Enfocar input
      </Button>

      <Button
        variant="outlined"
        onClick={() => inputRef.current?.select()}
      >
        Seleccionar texto
      </Button>
    </Stack>
  );
}

export default App;
```

`HTMLInputElement` es el tipo del elemento. Comienza en `null` porque todavía no existe al iniciar el render.

`inputRef.current` contiene el input una vez conectado. `?.` llama a `focus()` solamente si no es `null`.

Con `TextField` usamos `inputRef` porque queremos acceder a su `<input>` interno.

**Prueba:** crea un botón que borre el contenido de un input no controlado mediante `inputRef.current.value = ""`, solo para comparar este enfoque con un input controlado.

---

### 3.11 `useEffect` en tres casos

**Tiempo:** 25 minutos  
**Objetivo:** comprender cuándo se ejecuta un efecto.

`useEffect` sirve para sincronizar un componente con algo externo a React, por ejemplo el título del documento, temporizadores, suscripciones, peticiones o APIs del navegador.

```tsx
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

function App() {
  const [count, setCount] = useState<number>(0);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    console.log("Caso 1: después de cada render");
  });

  useEffect(() => {
    console.log("Caso 2: al montar el componente");
  }, []);

  useEffect(() => {
    console.log("Caso 3: count cambió", count);
    document.title = `Contador: ${count}`;
  }, [count]);

  return (
    <Stack spacing={2} sx={{ padding: 3, maxWidth: 450 }}>
      <Typography variant="h4">{count}</Typography>

      <Button
        variant="contained"
        onClick={() => setCount((prev) => prev + 1)}
      >
        Incrementar
      </Button>

      <TextField
        label="Nombre"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
    </Stack>
  );
}

export default App;
```

#### Caso 1: sin array

```tsx
useEffect(() => {
  console.log("Después de cada render");
});
```

Se ejecuta después de todos los renders. No actualices estado sin una condición dentro de este efecto porque podrías crear un ciclo infinito.

#### Caso 2: array vacío

```tsx
useEffect(() => {
  console.log("Al montar");
}, []);
```

Se ejecuta después del primer render del montaje.

En desarrollo puede parecer que se ejecuta dos veces debido a `StrictMode`. React lo hace para ayudar a detectar efectos inseguros.

#### Caso 3: con dependencias

```tsx
useEffect(() => {
  document.title = `Contador: ${count}`;
}, [count]);
```

Se ejecuta al montar y cada vez que cambia `count`. El array `[count]` contiene las dependencias del efecto.

Observa que escribir en `name` produce renders, pero el tercer efecto no se repite porque `name` no es una dependencia.

**Prueba:** crea otro efecto que se ejecute únicamente cuando cambie `name`.

---

### 3.12 Cleanup de un intervalo

**Tiempo:** 15 minutos  
**Objetivo:** crear un intervalo y cancelarlo correctamente.

```tsx
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function App() {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <Stack spacing={2} sx={{ padding: 3, alignItems: "flex-start" }}>
      <Typography variant="h4">Segundos: {seconds}</Typography>

      <Button variant="outlined" onClick={() => setSeconds(0)}>
        Reiniciar
      </Button>
    </Stack>
  );
}

export default App;
```

`setInterval` ejecuta una función cada 1000 milisegundos. La función devuelta por `useEffect` es el **cleanup**:

```tsx
return () => {
  window.clearInterval(intervalId);
};
```

React la ejecuta al desmontar el componente y antes de repetir el efecto cuando cambian sus dependencias. Sin cleanup, el intervalo podría seguir activo después de que el componente desaparezca.

**Prueba:** agrega un estado `isRunning` para pausar y reanudar el temporizador. Si el efecto depende de `isRunning`, limpia el intervalo antes de crear otro.

---

### 3.13 MUI `styled(ListItem)`

**Tiempo:** 20 minutos  
**Objetivo:** crear un componente estilizado reutilizable.

#### `src/StyledListItem.tsx`

```tsx
import ListItem from "@mui/material/ListItem";
import { styled } from "@mui/material/styles";

const StyledListItem = styled(ListItem)(({ theme }) => ({
  border: "1px solid",
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create("background-color"),

  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default StyledListItem;
```

`styled(ListItem)` toma `ListItem` y crea una versión nueva. La función recibe el tema de MUI y devuelve estilos.

- `theme.spacing(1)` usa el sistema de espaciado.
- `theme.palette.divider` usa el color definido para divisores.
- `theme.shape.borderRadius` usa el radio de borde del tema.
- `&` representa el componente actual.
- `&:hover` aplica estilos cuando el cursor está encima.

#### Usarlo en `App.tsx`

```tsx
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import StyledListItem from "./StyledListItem";

function App() {
  return (
    <List sx={{ maxWidth: 500, padding: 2 }}>
      <StyledListItem>
        <ListItemText primary="Aprender styled()" />
      </StyledListItem>

      <StyledListItem>
        <ListItemText primary="Compararlo con sx" />
      </StyledListItem>
    </List>
  );
}

export default App;
```

`StyledListItem` centraliza el patrón visual y evita repetir el mismo `sx`.

**Prueba:** agrega `boxShadow: theme.shadows[1]`.

---

## 4. Integrador — TODO list con MUI

**Tiempo:** 1 hora y 15 minutos

La aplicación debe permitir:

- Agregar tareas.
- Impedir tareas vacías.
- Completar o descompletar tareas.
- Borrar tareas.
- Deshabilitar el botón cuando el input esté vacío.
- Enfocar el input al cargar.
- Reutilizar `StyledListItem`.

Cada tarea tendrá este tipo:

```tsx
type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
};
```

Conserva `src/StyledListItem.tsx` de la mini-práctica 13.

### Instalar iconos

El integrador utiliza un icono para borrar:

```bash
npm install @mui/icons-material
```

### `src/App.tsx` completo

```tsx
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import StyledListItem from "./StyledListItem";

type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

function App() {
  const [newTodo, setNewTodo] = useState<string>("");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const cleanTodo = newTodo.trim();
  const inputIsEmpty = cleanTodo === "";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (inputIsEmpty) {
      return;
    }

    const todo: TodoItem = {
      id: crypto.randomUUID(),
      text: cleanTodo,
      completed: false,
    };

    setTodos((prev) => [...prev, todo]);
    setNewTodo("");
    inputRef.current?.focus();
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) =>
      prev.filter((todo) => todo.id !== id)
    );
  }

  const completedCount = todos.filter(
    (todo) => todo.completed
  ).length;

  return (
    <Box sx={{ maxWidth: 650, margin: "0 auto", padding: 3 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Mis tareas
      </Typography>

      <Stack
        component="form"
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        onSubmit={addTodo}
      >
        <TextField
          fullWidth
          required
          label="Nueva tarea"
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
          inputRef={inputRef}
          error={newTodo.length > 0 && inputIsEmpty}
          helperText={
            newTodo.length > 0 && inputIsEmpty
              ? "La tarea no puede contener solo espacios"
              : " "
          }
        />

        <Button
          type="submit"
          variant="contained"
          disabled={inputIsEmpty}
          sx={{ alignSelf: "flex-start", minHeight: 56 }}
        >
          Agregar
        </Button>
      </Stack>

      <Typography sx={{ marginY: 2 }}>
        Completadas: {completedCount} de {todos.length}
      </Typography>

      {todos.length === 0 ? (
        <Typography color="text.secondary">
          Todavía no hay tareas. Agrega la primera.
        </Typography>
      ) : (
        <List disablePadding>
          {todos.map((todo) => (
            <StyledListItem
              key={todo.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  color="error"
                  aria-label={`Borrar ${todo.text}`}
                  onClick={() => deleteTodo(todo.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <Checkbox
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                inputProps={{
                  "aria-label": `Completar ${todo.text}`,
                }}
              />

              <ListItemText
                primary={todo.text}
                sx={{
                  textDecoration: todo.completed
                    ? "line-through"
                    : "none",
                  color: todo.completed
                    ? "text.secondary"
                    : "text.primary",
                }}
              />
            </StyledListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default App;
```

### Explicación paso a paso

#### Estado tipado

```tsx
const [todos, setTodos] = useState<TodoItem[]>([]);
```

El estado contiene un array de objetos `TodoItem` y empieza vacío. TypeScript comprobará que cada objeto tenga `id`, `text` y `completed`.

#### Autofocus

```tsx
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  inputRef.current?.focus();
}, []);
```

Después del primer render, el efecto coloca el focus en el input. El array vacío indica que este efecto pertenece al montaje.

#### Validación

```tsx
const cleanTodo = newTodo.trim();
const inputIsEmpty = cleanTodo === "";
```

Una cadena de espacios se considera vacía.

Usamos la validación en el botón:

```tsx
disabled={inputIsEmpty}
```

y también dentro de `addTodo`:

```tsx
if (inputIsEmpty) {
  return;
}
```

La segunda comprobación es importante: no debemos depender únicamente del aspecto deshabilitado del botón.

#### Crear un identificador

```tsx
id: crypto.randomUUID()
```

La API del navegador crea un identificador único. React puede usarlo como `key` estable.

#### Agregar sin mutar

```tsx
setTodos((prev) => [...prev, todo]);
```

Crea un array nuevo con las tareas anteriores y la nueva.

#### Completar una tarea

```tsx
prev.map((todo) =>
  todo.id === id
    ? { ...todo, completed: !todo.completed }
    : todo
)
```

`map()` recorre todas las tareas:

- Si el `id` coincide, crea una copia e invierte `completed`.
- Si no coincide, conserva la tarea sin cambios.

#### Borrar una tarea

```tsx
prev.filter((todo) => todo.id !== id)
```

`filter()` crea un array sin la tarea seleccionada.

#### Estilo condicional

```tsx
textDecoration: todo.completed
  ? "line-through"
  : "none"
```

El operador ternario aplica una línea al texto cuando la tarea está completada.

#### Accesibilidad

```tsx
aria-label={`Borrar ${todo.text}`}
```

Los botones que solo contienen iconos necesitan un nombre accesible para lectores de pantalla.

### Flujo completo

```text
Escribir → validar → enviar → crear objeto → agregar al estado → renderizar
```

Al completar:

```text
Checkbox → localizar por id → copiar objeto → invertir completed → renderizar
```

Al borrar:

```text
Botón → filtrar por id → guardar array nuevo → renderizar
```

### Bonus

1. Agrega un botón “Borrar completadas”.
2. Crea filtros: todas, pendientes y completadas.
3. Evita tareas duplicadas.
4. Guarda las tareas en `localStorage` con `useEffect`.
5. Separa cada tarea en un componente `TodoListItem`.

---

## 5. Checkpoint y entrega

Verifica:

- [ ] Puedo agregar una tarea.
- [ ] No puedo agregar texto vacío ni solo espacios.
- [ ] El botón está deshabilitado cuando corresponde.
- [ ] Puedo completar y descompletar tareas.
- [ ] Puedo borrar tareas.
- [ ] Cada elemento tiene una `key` estable.
- [ ] No uso `push` ni modifico objetos directamente.
- [ ] El input recibe focus al cargar.
- [ ] El intervalo de la práctica 12 tiene cleanup.
- [ ] `StyledListItem` se reutiliza en el integrador.
- [ ] TypeScript no muestra errores.

Ejecuta:

```bash
npm run build
```

Si compila correctamente:

```bash
git add .
git commit -m "feat: day 2 — MUI todo list with refs and effects"
```

---

## 6. Glosario

| Concepto | Significado |
| --- | --- |
| Estado | Información que el componente recuerda y puede cambiar. |
| Hook | Función especial de React. |
| `useState<T>` | Crea estado tipado. |
| Setter | Función que actualiza un estado. |
| Updater | Función que calcula el estado nuevo a partir del anterior. |
| Evento | Acción como escribir, hacer clic o enviar. |
| Inmutabilidad | Crear arrays u objetos nuevos en vez de modificar los anteriores. |
| Spread `...` | Copia elementos de un array o propiedades de un objeto. |
| Input controlado | Input cuyo valor proviene del estado. |
| Input no controlado | Input cuyo valor principal permanece en el DOM. |
| Regex | Patrón para comprobar texto. |
| `error` | Prop de MUI que muestra un campo con error. |
| `helperText` | Texto de apoyo debajo de un `TextField`. |
| Lifting state up | Mover el estado al ancestro común. |
| `useRef` | Conserva una referencia sin causar renders. |
| `current` | Contiene el valor actual de una ref. |
| `useEffect` | Ejecuta efectos después del render. |
| Dependencia | Valor que determina cuándo se repite un efecto. |
| Cleanup | Función que cancela o limpia un efecto. |
| Montaje | Momento en que un componente aparece. |
| Desmontaje | Momento en que un componente desaparece. |
| `sx` | Prop de MUI para estilos locales. |
| `styled()` | API para crear componentes estilizados reutilizables. |

---

## Orden recomendado de práctica

Para cada ejercicio:

1. Escribe el ejemplo.
2. Comprueba que funciona.
3. Explica qué estado existe.
4. Identifica qué evento lo modifica.
5. Cambia algo sin consultar la solución.
6. Provoca un error de TypeScript.
7. Corrígelo antes de continuar.

La idea principal del día es:

```text
Evento → actualización inmutable del estado → nuevo render → interfaz actualizada
```
