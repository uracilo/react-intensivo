# React Intensivo — TaskFlow

Curso de **1 semana** (5 días + fundamentos web) para construir el frontend de **TaskFlow**, alineado a la API Spring Boot que ya hicieron los alumnos.

Repo limpio: **una carpeta = un día**. Sin monorepo complejo.

**Demos en vivo:** https://uracilo.github.io/react-intensivo/

## Agenda

| Día | Carpeta | Qué construyen |
|-----|---------|----------------|
| 0 | [`demos/00-web-basica`](demos/00-web-basica/) | HTML + CSS + JS: lista de tareas (DOM) |
| 1 | [`demos/01-fundamentos`](demos/01-fundamentos/) | React + TypeScript: cards estáticas |
| 2 | [`demos/02-estado`](demos/02-estado/) | `useState`, formularios, validación |
| 3 | [`demos/03-datos`](demos/03-datos/) | `fetch`, `useEffect`, custom hooks |
| 4 | [`demos/04-crud-router`](demos/04-crud-router/) | React Router + CRUD |
| 5 | [`demos/05-taskflow`](demos/05-taskflow/) | Login JWT + API real (fallback demo) |

Guías paso a paso: [`docs/`](docs/) · Temario: [`docs/TEMARIO.md`](docs/TEMARIO.md) · API: [`docs/API.md`](docs/API.md)

## Requisitos

- Node.js 20+
- npm 10+
- Navegador moderno
- (Día 5, opcional) API Java en `localhost:8080`

## Cómo empezar

```bash
git clone git@github.com:uracilo/react-intensivo.git
cd react-intensivo
npm run install:demos
```

### Día 0 (sin Node)

Abrí `demos/00-web-basica/index.html` en el navegador (doble clic o Live Server).

### Días 1–5

```bash
npm run dev:01   # fundamentos
npm run dev:02   # estado
npm run dev:03   # datos
npm run dev:04   # router + CRUD
npm run dev:05   # TaskFlow final
```

### Día 5 con API Java

```bash
# demos/05-taskflow/.env.local
VITE_API_URL=http://localhost:8080
VITE_USE_API=true

npm run dev:05
# Login demo: ana / ana123
```

Sin API, la app usa **localStorage** (modo demo).

## Documentación

| Archivo | Para quién |
|---------|------------|
| [`docs/guia-dia-0.md`](docs/guia-dia-0.md) … [`guia-dia-5.md`](docs/guia-dia-5.md) | Alumnos e instructor (armar la demo) |
| [`docs/para-el-instructor.md`](docs/para-el-instructor.md) | Tiempos y checkpoints |
| [`slides/`](slides/) | Fuentes Markdown + PPTX |

## Autor

**uracilo** — React + TypeScript Intensivo · TaskFlow Frontend
