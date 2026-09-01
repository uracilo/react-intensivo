# Proxy HTTPS → TaskFlow API (HTTP)

GitHub Pages es **HTTPS** y la API real solo responde por **HTTP** en `http://52.87.135.237:8080`.  
El certificado en `https://52.87.135.237:8080` **no funciona** (error TLS). Por eso hace falta un proxy HTTPS.

## Opción A — Cloudflare Worker (recomendado, gratis)

1. Cuenta en [Cloudflare](https://dash.cloudflare.com/sign-up)
2. [API Token](https://dash.cloudflare.com/profile/api-tokens) → **Edit Cloudflare Workers**
3. Copiá tu **Account ID** (panel derecho)
4. En GitHub → **Settings → Secrets and variables → Actions**:

| Secret | Valor |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | token |
| `CLOUDFLARE_ACCOUNT_ID` | account id |

5. **Actions → Deploy GitHub Pages → Run workflow**

El worker queda en `https://taskflow-proxy.<cuenta>.workers.dev` y el build lo usa automáticamente.

## Opción B — Render (gratis)

1. [render.com](https://render.com) → New → Blueprint → conectá el repo
2. Usa `render.yaml` (servicio `taskflow-proxy`)
3. Copiá la URL pública (ej. `https://taskflow-proxy.onrender.com`)
4. En GitHub → **Settings → Variables → Actions**:

| Variable | Valor |
|----------|-------|
| `TASKFLOW_PROXY_URL` | URL de Render |

5. **Actions → Deploy GitHub Pages → Run workflow**

## Opción C — Vercel

```bash
cd proxy
npx vercel --prod
```

Copiá la URL y ponela en `TASKFLOW_PROXY_URL`.

## Probar proxy local

```bash
cd proxy && node server.mjs
# POST http://localhost:3000/auth/login
```
