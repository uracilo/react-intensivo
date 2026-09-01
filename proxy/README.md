# Proxy HTTPS (opcional)

La API oficial ya está en **HTTPS** vía CloudFront:

**https://d3ujwk09smrk9z.cloudfront.net**  
Swagger: [swagger-ui/index.html](https://d3ujwk09smrk9z.cloudfront.net/swagger-ui/index.html)

GitHub Pages y las demos 04/05 usan esa URL por defecto — **no hace falta proxy** en condiciones normales.

Esta carpeta queda por si necesitás un proxy alternativo (otro backend HTTP, entorno aislado, etc.).

## Opción A — Cloudflare Worker

1. Cuenta en [Cloudflare](https://dash.cloudflare.com/sign-up)
2. [API Token](https://dash.cloudflare.com/profile/api-tokens) → **Edit Cloudflare Workers**
3. Copiá tu **Account ID** (panel derecho)
4. En GitHub → **Settings → Secrets and variables → Actions**:

| Secret | Valor |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | token |
| `CLOUDFLARE_ACCOUNT_ID` | account id |

5. **Actions → Deploy GitHub Pages → Run workflow**

## Opción B — Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/uracilo/react-intensivo)

Copiá la URL y ponela en `TASKFLOW_PROXY_URL` (GitHub Variables) para override en el build.

## Probar proxy local

```bash
cd proxy && node server.mjs
# POST http://localhost:3000/auth/login
```
