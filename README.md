# React Intensivo — Curso MUI + TypeScript

Curso de **1 semana** (5 días + Día 0 opcional) alineado al temario con **MUI**, mini-prácticas, json-server y deploy.

Repo limpio: **una carpeta = un día**. Sin monorepo complejo.

**Demos en vivo:** https://uracilo.github.io/react-intensivo/

## Agenda

| Día | Carpeta | Qué construyen |
|-----|---------|----------------|
| 0 | [`demos/00-web-basica`](demos/00-web-basica/) | HTML + CSS + JS: lista de tareas (DOM) |
| 1 | [`demos/01-fundamentos`](demos/01-fundamentos/) | React + TS + MUI: user cards |
| 2 | [`demos/02-estado`](demos/02-estado/) | `useState`, forms, `useRef`, `useEffect`, TODO MUI |
| 3 | [`demos/03-datos`](demos/03-datos/) | `useFetch<T>`, JSONPlaceholder, paginación, búsqueda |
| 4 | [`demos/04-crud-router`](demos/04-crud-router/) | TaskFlow API + Axios + React Router CRUD |
| 5 | [`demos/05-taskflow`](demos/05-taskflow/) | Context, dark mode, toast + TaskFlow final |

Guías paso a paso: [`docs/`](docs/) · Temario: [`docs/TEMARIO.md`](docs/TEMARIO.md)

## Requisitos

- Node.js 20+
- npm 10+
- Navegador moderno
- (Días 4–5) API TaskFlow en `http://52.87.135.237:8080` — ver [Swagger](http://52.87.135.237:8080/swagger-ui/index.html)

## Cómo empezar

```bash
git clone https://github.com/uracilo/react-intensivo.git
cd react-intensivo
npm run install:demos
```

### Día 0 (sin Node)

Abrí `demos/00-web-basica/index.html` en el navegador.

### Días 1–5

```bash
npm run dev:01   # user cards + MUI
npm run dev:02   # TODO list
npm run dev:03   # users + posts (JSONPlaceholder)
npm run dev:04   # CRUD TaskFlow + router
npm run dev:05   # app final + theme + toast
```

### Login TaskFlow (Días 4 y 5)

```
Usuario: ana
Password: ana123
```

API: `http://52.87.135.237:8080` — [Swagger UI](http://52.87.135.237:8080/swagger-ui/index.html)

## Documentación

| Archivo | Para quién |
|---------|------------|
| [`docs/guia-dia-0.md`](docs/guia-dia-0.md) … [`guia-dia-5.md`](docs/guia-dia-5.md) | Alumnos e instructor |
| [`docs/para-el-instructor.md`](docs/para-el-instructor.md) | Tiempos, checkpoints y mini-practices |
| [`docs/setup-dia-1.md`](docs/setup-dia-1.md) | Setup Node, Git, VS Code, GitHub |

## Autor

**uracilo** — React + TypeScript Intensivo · MUI
