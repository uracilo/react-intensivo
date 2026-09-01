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
| 4 | [`demos/04-crud-router`](demos/04-crud-router/) | json-server + Axios + React Router CRUD |
| 5 | [`demos/05-taskflow`](demos/05-taskflow/) | Context, dark mode, toast, error boundary + deploy |

Guías paso a paso: [`docs/`](docs/) · Temario: [`docs/TEMARIO.md`](docs/TEMARIO.md)

## Requisitos

- Node.js 20+
- npm 10+
- Navegador moderno
- (Día 4) json-server en `:3001` — `npm run api` en demo 04/05

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
npm run dev:04   # CRUD + router (requiere npm run api en otra terminal)
npm run dev:05   # app final + theme + toast
```

### Día 4/5 — json-server

```bash
cd demos/04-crud-router   # o demos/05-taskflow
npm run api               # http://localhost:3001
npm run dev               # en otra terminal
```

## Documentación

| Archivo | Para quién |
|---------|------------|
| [`docs/guia-dia-0.md`](docs/guia-dia-0.md) … [`guia-dia-5.md`](docs/guia-dia-5.md) | Alumnos e instructor |
| [`docs/para-el-instructor.md`](docs/para-el-instructor.md) | Tiempos, checkpoints y mini-practices |
| [`docs/setup-dia-1.md`](docs/setup-dia-1.md) | Setup Node, Git, VS Code, GitHub |

## Autor

**uracilo** — React + TypeScript Intensivo · MUI
