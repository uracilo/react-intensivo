# API — json-server (Días 4 y 5)

Base URL por defecto: `http://localhost:3001` (configurable con `VITE_API_URL`).

## Arrancar

```bash
cd demos/04-crud-router   # o demos/05-taskflow
npm run api
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users` | Lista todos los usuarios |
| GET | `/users/:id` | Detalle de un usuario |
| POST | `/users` | Crear usuario (body JSON) |
| PUT | `/users/:id` | Actualizar usuario |
| DELETE | `/users/:id` | Eliminar usuario |

## Body ejemplo (POST)

```json
{
  "name": "Nuevo Usuario",
  "email": "nuevo@example.com",
  "role": "developer"
}
```

Los datos persisten en `db.json`.

## Variables de entorno

Copiá `.env.example` a `.env.local`:

```
VITE_API_URL=http://localhost:3001
```

En deploy (Vercel/Netlify), configurá la misma variable en el dashboard si la API está expuesta.
