# Proxy HTTPS → TaskFlow API

GitHub Pages es **HTTPS** y no puede llamar a `http://52.87.135.237:8080` directamente.

Este proxy en Vercel expone la API por **HTTPS**.

## Deploy (una sola vez)

```bash
cd proxy
npx vercel --prod
```

Copiá la URL que te da (ej. `https://react-intensivo-proxy.vercel.app`).

## Configurar el frontend

En `demos/04-crud-router/.env.production` y `demos/05-taskflow/.env.production`:

```
VITE_API_URL=https://TU-PROXY.vercel.app
```

Rebuild y redeploy GitHub Pages.
