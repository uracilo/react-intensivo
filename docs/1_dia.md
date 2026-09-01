# Ejercicios de React + TypeScript paso a paso

Esta guía está pensada para practicar los fundamentos de **React con TypeScript** sin asumir que ya conoces todos los términos. Los ejercicios avanzan poco a poco y explican qué significa cada parte importante del código.

## Contenido

1. Preparar el proyecto
2. Tipos básicos
3. JSX simple
4. Componente con una prop
5. Prop opcional
6. `children`
7. Lista simple
8. Lista de objetos
9. Instalar Material UI
10. Layout con `Stack`
11. Imágenes con `Avatar`
12. Reto final
13. Glosario

---

## 1. Preparar el proyecto

Vamos a trabajar con:

- **JavaScript:** lenguaje de programación.
- **TypeScript:** JavaScript con tipos. Permite indicar si un dato debe ser texto, número, booleano, etc.
- **React:** biblioteca para construir interfaces mediante componentes.
- **JSX:** sintaxis parecida a HTML que se escribe dentro de JavaScript o TypeScript.
- **Vite:** herramienta para crear y ejecutar el proyecto.
- **MUI:** biblioteca de componentes visuales para React.

### Crear el proyecto

Abre una terminal y ejecuta:

```bash
npm create vite@latest ejercicios-react -- --template react-ts
cd ejercicios-react
npm install
npm run dev
```

Qué hace cada comando:

- `npm create vite@latest`: crea un proyecto nuevo con Vite.
- `ejercicios-react`: será el nombre de la carpeta.
- `--template react-ts`: indica que queremos React con TypeScript.
- `cd ejercicios-react`: entra en la carpeta del proyecto.
- `npm install`: instala las dependencias.
- `npm run dev`: inicia el servidor de desarrollo.

La terminal mostrará una dirección parecida a:

```text
http://localhost:5173
```

Ábrela en el navegador. Para detener el servidor, presiona `Ctrl + C` en la terminal.

Trabajaremos principalmente en:

```text
src/App.tsx
```

La extensión `.tsx` significa que el archivo contiene TypeScript y JSX.

---

## 2. Tipos básicos

### Objetivo

Crear variables tipadas, una función tipada y provocar un error de TypeScript intencionalmente.

Reemplaza el contenido de `src/App.tsx` con:

```tsx
function App() {
  const name: string = "Dalia";
  const age: number = 30;
  const isLearningReact: boolean = true;

  function greet(personName: string, personAge: number): string {
    return `Hola, soy ${personName} y tengo ${personAge} años`;
  }

  return (
    <div>
      <h1>{greet(name, age)}</h1>

      <p>
        ¿Está aprendiendo React?
        {isLearningReact ? " Sí" : " No"}
      </p>
    </div>
  );
}

export default App;
```

### ¿Qué es cada cosa?

```tsx
function App() {
```

- `function` declara una función.
- `App` es el nombre de la función.
- `()` es el lugar donde una función puede recibir información.
- `{}` contiene sus instrucciones.
- En React, una función que devuelve JSX es un **componente**.

```tsx
const name: string = "Dalia";
```

- `const` crea una variable que no será reasignada.
- `name` es el nombre de la variable.
- `:` introduce el tipo del dato.
- `string` significa texto.
- `=` asigna un valor.
- `"Dalia"` es el valor.
- `;` marca el final de la instrucción.

```tsx
const age: number = 30;
```

`number` indica que la variable solo debe contener un número.

```tsx
const isLearningReact: boolean = true;
```

`boolean` es un tipo que solo puede tener uno de estos dos valores:

```tsx
true
false
```

```tsx
function greet(personName: string, personAge: number): string {
```

La función recibe dos **parámetros**:

- `personName`, que debe ser texto.
- `personAge`, que debe ser un número.

El último `: string` indica que la función debe devolver texto.

```tsx
return `Hola, soy ${personName} y tengo ${personAge} años`;
```

- `return` devuelve el resultado de la función.
- Los backticks `` ` ` `` permiten construir un texto con variables.
- `${personName}` inserta el valor de una variable dentro del texto.

```tsx
{greet(name, age)}
```

Las llaves permiten ejecutar JavaScript dentro del JSX. Aquí llamamos a `greet` y le enviamos `name` y `age` como argumentos.

```tsx
{isLearningReact ? " Sí" : " No"}
```

Esto es un **operador ternario**:

```text
condición ? resultado_si_es_verdadera : resultado_si_es_falsa
```

```tsx
export default App;
```

Permite que `App` pueda importarse y utilizarse desde otro archivo.

### Forzar un error de TypeScript

Cambia temporalmente:

```tsx
const age: number = 30;
```

por:

```tsx
const age: number = "treinta";
```

TypeScript marcará un error porque `age` debe ser un número, pero `"treinta"` es texto. Después vuelve a dejarlo correctamente.

### Mini ejercicio

Crea una variable tipada para guardar tu ciudad y muéstrala en un párrafo.

```tsx
const city: string = "Ciudad de México";
```

---

## 3. JSX simple

### Objetivo

Mostrar una variable dentro de una etiqueta JSX.

Reemplaza `src/App.tsx` con:

```tsx
function App() {
  const courseName: string = "React con TypeScript";
  const studentName: string = "Dalia";

  return (
    <div>
      <h1>{studentName} está aprendiendo {courseName}</h1>
    </div>
  );
}

export default App;
```

### Explicación

Esto es JSX:

```tsx
<h1>Estoy aprendiendo React</h1>
```

Parece HTML, pero está escrito dentro de TypeScript. JSX describe lo que React debe mostrar en pantalla.

```tsx
{studentName}
```

Las llaves cambian momentáneamente de JSX a JavaScript para obtener el valor de la variable.

JSX usa `className` en vez de `class` para asignar clases de CSS:

```tsx
<h1 className="title">Hola</h1>
```

### Mini ejercicio

Crea una variable llamada `favoriteTechnology` y muéstrala en un segundo párrafo.

---

## 4. Componente con una prop

### Objetivo

Crear un componente reutilizable que reciba información desde otro componente.

Una **prop** es información que un componente padre envía a un componente hijo.

### Crear `Greeting.tsx`

Crea el archivo:

```text
src/Greeting.tsx
```

Escribe:

```tsx
type GreetingProps = {
  name: string;
};

function Greeting({ name }: GreetingProps) {
  return <h2>Hola, {name}</h2>;
}

export default Greeting;
```

### Explicación

```tsx
type GreetingProps = {
  name: string;
};
```

- `type` crea un tipo personalizado.
- `GreetingProps` es el nombre del tipo.
- `{}` describe la forma que debe tener el objeto de props.
- `name: string` significa que debe recibir una propiedad `name` de texto.

El objeto de props tendrá una forma parecida a:

```tsx
{
  name: "Dalia"
}
```

```tsx
function Greeting({ name }: GreetingProps) {
```

React entrega las props como un objeto. `{ name }` utiliza **desestructuración** para extraer `name` del objeto.

Sin desestructuración también se podría escribir:

```tsx
function Greeting(props: GreetingProps) {
  return <h2>Hola, {props.name}</h2>;
}
```

### Usarlo en `App.tsx`

```tsx
import Greeting from "./Greeting";

function App() {
  return (
    <div>
      <h1>Mis saludos</h1>

      <Greeting name="Dalia" />
      <Greeting name="Antonella" />
      <Greeting name="Benjamín" />
    </div>
  );
}

export default App;
```

```tsx
import Greeting from "./Greeting";
```

- `import` trae algo desde otro archivo.
- `Greeting` es el componente que importamos.
- `from` indica desde dónde.
- `"./Greeting"` significa que el archivo está en la misma carpeta.

```tsx
<Greeting name="Dalia" />
```

Usa el componente y le envía la prop `name`.

### Forzar un error

Prueba:

```tsx
<Greeting name={123} />
```

TypeScript marcará un error porque `name` debe ser texto. Después vuelve a colocar un nombre.

### Mini ejercicio

Agrega una prop obligatoria `message: string` y úsala para mostrar un mensaje distinto en cada saludo.

---

## 5. Prop opcional

### Objetivo

Crear una prop que pueda enviarse o no y renderizar contenido con una condición.

Modifica `src/Greeting.tsx`:

```tsx
type GreetingProps = {
  name: string;
  age?: number;
};

function Greeting({ name, age }: GreetingProps) {
  return (
    <div>
      <h2>Hola, {name}</h2>

      {age !== undefined && <p>Tienes {age} años</p>}
    </div>
  );
}

export default Greeting;
```

### Explicación

```tsx
age?: number;
```

El signo `?` significa que `age` es opcional. Estos dos usos son válidos:

```tsx
<Greeting name="Dalia" age={30} />
<Greeting name="Antonella" />
```

`name` sigue siendo obligatorio porque no tiene `?`.

```tsx
{age !== undefined && <p>Tienes {age} años</p>}
```

- `undefined` significa que no existe un valor asignado.
- `!==` significa “es diferente de”.
- `&&` significa “y”, pero React también lo usa para renderizado condicional.

La instrucción completa significa: si `age` tiene un valor, muestra el párrafo.

### Usarlo en `App.tsx`

```tsx
import Greeting from "./Greeting";

function App() {
  return (
    <div>
      <Greeting name="Dalia" age={30} />
      <Greeting name="Antonella" />
    </div>
  );
}

export default App;
```

Los números se envían con llaves:

```tsx
age={30}
```

Si escribiéramos `age="30"`, estaríamos enviando texto y TypeScript marcaría un error.

### Mini ejercicio

Agrega una prop opcional:

```tsx
city?: string;
```

Muestra la ciudad únicamente cuando haya sido enviada.

---

## 6. `children`

### Objetivo

Crear un componente que pueda envolver texto, etiquetas u otros componentes.

`children` es el contenido colocado entre la etiqueta de apertura y la etiqueta de cierre de un componente.

### Crear `Box.tsx`

Crea:

```text
src/Box.tsx
```

Escribe:

```tsx
import type { ReactNode } from "react";

type BoxProps = {
  children: ReactNode;
};

function Box({ children }: BoxProps) {
  return (
    <div
      style={{
        border: "2px solid purple",
        borderRadius: "10px",
        padding: "16px",
        margin: "12px",
      }}
    >
      {children}
    </div>
  );
}

export default Box;
```

### Explicación

```tsx
import type { ReactNode } from "react";
```

`ReactNode` es un tipo de React que representa cualquier contenido que React pueda mostrar, como texto, números, JSX o componentes.

```tsx
children: ReactNode;
```

Indica que el componente recibirá contenido en su interior.

```tsx
style={{
  border: "2px solid purple",
  padding: "16px",
}}
```

`style` recibe un objeto de JavaScript. Por eso aparecen dos pares de llaves:

- Las primeras `{}` permiten usar JavaScript dentro de JSX.
- Las segundas `{}` crean el objeto de estilos.

En React, algunas propiedades CSS se escriben con **camelCase**:

```tsx
borderRadius
```

En CSS normal se escribiría `border-radius`.

### Usarlo en `App.tsx`

```tsx
import Box from "./Box";

function App() {
  return (
    <div>
      <Box>
        <h2>Primera caja</h2>
        <p>Estoy dentro del componente Box.</p>
      </Box>

      <Box>
        <button>Haz clic</button>
      </Box>
    </div>
  );
}

export default App;
```

Todo lo que aparece entre `<Box>` y `</Box>` es recibido como `children`. Después, `Box` lo muestra aquí:

```tsx
{children}
```

### Mini ejercicio

Agrega al tipo `BoxProps` una prop opcional llamada `title` y muéstrala antes de `children`.

---

## 7. Lista simple

### Objetivo

Convertir un array de textos en una lista JSX utilizando `.map()`.

En `src/App.tsx`:

```tsx
function App() {
  const technologies: string[] = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "TypeScript",
  ];

  return (
    <div>
      <h1>Tecnologías</h1>

      <ul>
        {technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

### Explicación

```tsx
const technologies: string[] = [];
```

- `[]` representa un array o lista.
- `string[]` significa “array de textos”.
- Todos sus elementos deben ser `string`.

Esto provocaría un error:

```tsx
const technologies: string[] = ["React", 50];
```

`50` no es texto.

```tsx
technologies.map((technology) => (
  <li key={technology}>{technology}</li>
))
```

`.map()` recorre el array y transforma cada elemento.

`(technology) => (...)` es una **función flecha**:

- `technology` representa el elemento actual.
- `=>` indica lo que la función producirá.
- En cada recorrido produce un `<li>`.

Conceptualmente sucede esto:

```text
"HTML"       → <li>HTML</li>
"CSS"        → <li>CSS</li>
"JavaScript" → <li>JavaScript</li>
```

```tsx
key={technology}
```

React necesita una `key` única para identificar cada elemento de una lista.

### Mini ejercicio

Crea un array de tus comidas favoritas y conviértelo en una lista.

---

## 8. Lista de objetos

### Objetivo

Tipar un array de objetos y usar un identificador como `key`.

```tsx
type Person = {
  id: number;
  name: string;
};

function App() {
  const people: Person[] = [
    { id: 1, name: "Dalia" },
    { id: 2, name: "Antonella" },
    { id: 3, name: "Benjamín" },
  ];

  return (
    <div>
      <h1>Personas</h1>

      <ul>
        {people.map((person) => (
          <li key={person.id}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

### Explicación

```tsx
{ id: 1, name: "Dalia" }
```

Esto es un **objeto**. Un objeto agrupa información mediante propiedades:

- `id` contiene `1`.
- `name` contiene `"Dalia"`.

```tsx
const people: Person[] = [];
```

`Person[]` significa que es un array y que cada elemento debe cumplir con el tipo `Person`.

```tsx
person.name
```

El punto `.` permite acceder a una propiedad del objeto.

```tsx
key={person.id}
```

Usamos el identificador como `key`. Es preferible al nombre porque dos personas podrían llamarse igual.

### Forzar un error

Agrega temporalmente un objeto sin `id`:

```tsx
{ name: "Ana" }
```

TypeScript indicará que falta la propiedad obligatoria `id`.

### Mini ejercicio

Agrega `favoriteColor: string` al tipo `Person`, completa ese dato en cada objeto y muéstralo en la lista.

---

## 9. Instalar Material UI

### Objetivo

Instalar MUI y mostrar el primer botón.

Si el servidor está funcionando, detenlo con `Ctrl + C`. Después ejecuta:

```bash
npm install @mui/material @emotion/react @emotion/styled
```

- `npm install` instala paquetes.
- `@mui/material` contiene los componentes de MUI.
- `@emotion/react` y `@emotion/styled` permiten aplicar estilos.

Reinicia el servidor:

```bash
npm run dev
```

En `src/App.tsx`:

```tsx
import Button from "@mui/material/Button";

function App() {
  function showMessage() {
    alert("¡Hola, Dalia!");
  }

  return (
    <div>
      <h1>Mi primer botón de MUI</h1>

      <Button variant="contained" onClick={showMessage}>
        Haz clic
      </Button>
    </div>
  );
}

export default App;
```

### Explicación

```tsx
import Button from "@mui/material/Button";
```

Importa el componente `Button` desde MUI.

```tsx
<Button variant="contained">
```

`variant` es una prop que determina la apariencia del botón. Algunas opciones son:

```tsx
<Button variant="text">Texto</Button>
<Button variant="outlined">Contorno</Button>
<Button variant="contained">Relleno</Button>
```

```tsx
onClick={showMessage}
```

`onClick` es un evento. Indica qué debe pasar cuando la persona hace clic.

Le pasamos `showMessage` sin paréntesis porque queremos que React la ejecute al hacer clic. Si escribiéramos `showMessage()`, se ejecutaría inmediatamente al renderizar.

```tsx
alert("¡Hola, Dalia!");
```

`alert` abre una pequeña ventana del navegador con un mensaje.

### Mini ejercicio

Agrega tres botones con las variantes `text`, `outlined` y `contained`.

---

## 10. Layout con `Stack`

### Objetivo

Acomodar componentes en una fila y aplicar estilos con `sx`.

```tsx
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

function App() {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        padding: 3,
        margin: 2,
        border: "1px solid #cccccc",
      }}
    >
      <Button variant="contained">Aceptar</Button>
      <Button variant="outlined">Editar</Button>
      <Button variant="text">Cancelar</Button>
    </Stack>
  );
}

export default App;
```

### Explicación

`Stack` es un componente de MUI que acomoda elementos en una fila o columna.

```tsx
direction="row"
```

`row` coloca los elementos horizontalmente. Para colocarlos verticalmente utiliza:

```tsx
direction="column"
```

```tsx
spacing={2}
```

Agrega separación entre los elementos.

```tsx
sx={{
  padding: 3,
  margin: 2,
}}
```

`sx` es una prop especial de MUI para agregar estilos.

- `padding`: espacio interior.
- `margin`: espacio exterior.
- `border`: borde.

En MUI, los números de espaciado normalmente se multiplican por 8 píxeles. Por ejemplo, `padding: 3` suele equivaler a 24 píxeles.

### Mini ejercicio

Cambia la dirección a `column`, agrega un color de fondo con `backgroundColor` y observa el resultado.

---

## 11. Imágenes con `Avatar`

### Objetivo

Mostrar una imagen circular desde una URL y desde un archivo local.

### Imagen desde una URL

```tsx
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

function App() {
  const imageUrl: string =
    "https://images.unsplash.com/photo-1574158622682-e40e69881006";

  return (
    <Stack direction="row" spacing={2}>
      <Avatar
        alt="Una gata"
        src={imageUrl}
        sx={{
          width: 100,
          height: 100,
        }}
      />
    </Stack>
  );
}

export default App;
```

### Explicación

`Avatar` es un componente de MUI para mostrar una imagen circular, normalmente una foto de perfil.

```tsx
src={imageUrl}
```

`src` indica la ubicación de la imagen. Usamos llaves porque `imageUrl` es una variable de JavaScript.

Una URL directa usaría comillas:

```tsx
src="https://ejemplo.com/imagen.jpg"
```

```tsx
alt="Una gata"
```

`alt` describe la imagen. Es importante para accesibilidad y lectores de pantalla.

```tsx
sx={{
  width: 100,
  height: 100,
}}
```

El avatar tendrá 100 píxeles de ancho y 100 píxeles de alto.

### Imagen local

Guarda una imagen en:

```text
src/assets/gata.jpg
```

Después impórtala y úsala:

```tsx
import Avatar from "@mui/material/Avatar";
import catImage from "./assets/gata.jpg";

function App() {
  return (
    <Avatar
      alt="Mi gata"
      src={catImage}
      sx={{ width: 100, height: 100 }}
    />
  );
}

export default App;
```

`catImage` es una variable que contiene la ruta de la imagen procesada por Vite.

### Mini ejercicio

Crea un `Stack` con tres avatares de diferente tamaño.

---

## 12. Reto final: lista de perfiles

Este ejercicio combina tipos, objetos, arrays, `.map()`, props opcionales, renderizado condicional, MUI, botones, `Stack`, `Avatar` y `sx`.

En `src/App.tsx`:

```tsx
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

type Person = {
  id: number;
  name: string;
  age?: number;
  image: string;
};

function App() {
  const people: Person[] = [
    {
      id: 1,
      name: "Dalia",
      age: 30,
      image: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: 2,
      name: "Antonella",
      image: "https://i.pravatar.cc/150?img=10",
    },
  ];

  function viewProfile(name: string) {
    alert(`Abrir el perfil de ${name}`);
  }

  return (
    <Stack spacing={2} sx={{ padding: 3 }}>
      <h1>Perfiles</h1>

      {people.map((person) => (
        <Stack
          key={person.id}
          direction="row"
          spacing={2}
          sx={{
            border: "1px solid #cccccc",
            borderRadius: 2,
            padding: 2,
            alignItems: "center",
          }}
        >
          <Avatar src={person.image} alt={person.name} />

          <div>
            <strong>{person.name}</strong>

            {person.age !== undefined && (
              <p>Edad: {person.age}</p>
            )}
          </div>

          <Button
            variant="outlined"
            onClick={() => viewProfile(person.name)}
          >
            Ver perfil
          </Button>
        </Stack>
      ))}
    </Stack>
  );
}

export default App;
```

### Lo nuevo: función flecha en `onClick`

```tsx
onClick={() => viewProfile(person.name)}
```

Necesitamos enviar el nombre de la persona a `viewProfile`. Creamos una función flecha que React ejecutará al hacer clic.

No usamos directamente:

```tsx
onClick={viewProfile(person.name)}
```

porque eso ejecutaría la función durante el renderizado, antes de hacer clic.

### Desafíos adicionales

1. Agrega una tercera persona.
2. Añade una prop `city?: string`.
3. Muestra la ciudad solo cuando exista.
4. Cambia los colores utilizando `sx`.
5. Añade un botón para cada perfil.
6. Provoca un error de tipo y después corrígelo.

---

## 13. Glosario

| Concepto | Significado |
| --- | --- |
| Variable | Espacio con nombre donde se guarda un valor. |
| `const` | Declara una variable que no será reasignada. |
| Tipo | Describe qué clase de dato se permite. |
| `string` | Texto. |
| `number` | Número. |
| `boolean` | Valor `true` o `false`. |
| Función | Bloque de instrucciones reutilizable. |
| Parámetro | Nombre de la información que una función espera recibir. |
| Argumento | Valor concreto que enviamos al llamar una función. |
| `return` | Devuelve el resultado de una función. |
| Componente | Función de React que devuelve una parte de la interfaz. |
| JSX | Sintaxis parecida a HTML utilizada por React. |
| Prop | Información enviada de un componente a otro. |
| Prop opcional | Prop que puede enviarse o no; se marca con `?`. |
| Desestructuración | Forma de extraer propiedades de un objeto. |
| `children` | Contenido colocado dentro de un componente. |
| `ReactNode` | Tipo para contenido que React puede renderizar. |
| Array | Lista de elementos. |
| Objeto | Grupo de propiedades relacionadas. |
| `.map()` | Recorre y transforma los elementos de un array. |
| `key` | Identificador único de un elemento renderizado en una lista. |
| Función flecha | Forma corta de escribir una función utilizando `=>`. |
| Renderizado condicional | Mostrar contenido únicamente cuando se cumple una condición. |
| `import` | Trae código desde otro archivo o paquete. |
| `export` | Permite que otro archivo importe nuestro código. |
| MUI | Biblioteca de componentes visuales para React. |
| `sx` | Prop de MUI utilizada para aplicar estilos. |

---

## Orden recomendado de práctica

No intentes memorizar todo de inmediato. Practica en este orden:

1. Escribe el ejercicio sin copiar y pegar, aunque consultes la guía.
2. Ejecuta el proyecto y observa el resultado.
3. Cambia nombres, números, textos y estilos.
4. Provoca al menos un error de TypeScript.
5. Lee el mensaje del error e intenta explicar por qué apareció.
6. Corrige el error.
7. Realiza el mini ejercicio antes de avanzar.

Lo importante al terminar es poder reconocer esta relación:

```text
Datos tipados → componentes → props → JSX → listas → componentes de MUI
```
