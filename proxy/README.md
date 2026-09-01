# Proxy HTTPS para GitHub Pages

GitHub Pages es **HTTPS** y no puede llamar a `http://52.87.135.237:8080` directamente.

Este **Cloudflare Worker** expone la API por HTTPS (gratis).

## Setup (una sola vez, ~3 min)

1. Creá cuenta en [Cloudflare](https://dash.cloudflare.com/sign-up)
2. [API Tokens](https://dash.cloudflare.com/profile/api-tokens) → **Create Token** → plantilla **Edit Cloudflare Workers**
3. Copiá tu **Account ID** (dashboard derecha)
4. En GitHub repo → **Settings → Secrets and variables → Actions**:

| Secret | Valor |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | el token |
| `CLOUDFLARE_ACCOUNT_ID` | tu account id |

5. Push a `main` o ejecutá **Actions → Deploy GitHub Pages**

El workflow despliega el worker y rebuilda las demos 04/05 con la URL HTTPS del proxy.

## Deploy manual

```bash
cd proxy
npm install
npx wrangler login
npx wrangler deploy
```

Copiá la URL `https://taskflow-proxy.<tu-cuenta>.workers.dev` y agregala como variable de repo `TASKFLOW_PROXY_URL`.
