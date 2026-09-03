
# Guía complementaria — Convertir TaskFlow en PWA

**Proyecto base:** `jwt-auth-demo` con React + TypeScript + Vite + Material UI  
**Punto de partida:** aplicación implementada hasta la Fase 5 de Projects  
**Publicación:** GitHub Pages  
**Referencia:** [Documentación oficial de Vite PWA](https://vite-pwa-org.netlify.app/guide/)  
**Tiempo estimado:** 1.5–2 horas

Esta fase convierte la misma aplicación de TaskFlow en una **Progressive Web App (PWA)**:

- Se puede instalar en computadora o celular.
- Tiene nombre, colores e iconos propios.
- Genera y registra un service worker.
- Guarda el shell de la aplicación en caché.
- Puede abrir la interfaz sin conexión después de la primera visita.
- Avisa cuando el contenido básico ya está disponible offline.
- Avisa cuando existe una nueva versión y permite actualizarla.
- Conserva el despliegue bajo `/jwt-auth-demo/` en GitHub Pages.

> **Alcance offline:** esta guía almacena el HTML, JavaScript, CSS e iconos de la aplicación, pero no almacena las respuestas autenticadas de TaskFlow API. Sin internet podrás abrir la interfaz; para iniciar sesión contra el servidor o ejecutar `GET`, `POST`, `PUT` y `DELETE` necesitarás conexión.

---

## Contenido

1. Qué cambia al convertirla en PWA
2. Arquitectura de la integración
3. Preparación y archivos
4. Configuración de `vite-plugin-pwa`
5. Iconos y manifest
6. Avisos de instalación y actualización
7. Integración con la app existente
8. Pruebas locales
9. Publicación en GitHub Pages
10. Checklist y errores comunes

---

## 1. Qué cambia al convertirla en PWA

Una PWA no es una aplicación distinta. Continúa siendo la misma app React, pero el navegador recibe tres piezas adicionales:

| Pieza | Función |
| --- | --- |
| Web App Manifest | Define nombre, iconos, colores y modo de apertura |
| Service worker | Guarda los recursos estáticos y permite abrir el shell offline |
| Registro del service worker | Conecta el navegador con el service worker generado |

El flujo queda así:

```text
Vite build
    → vite-plugin-pwa
        → genera manifest.webmanifest
        → genera sw.js
        → agrega recursos de dist/ al precache
    → GitHub Actions publica dist/
    → el navegador instala el service worker
```

### Qué significa “shell de la aplicación”

Es la parte necesaria para mostrar la interfaz:

- `index.html`
- JavaScript compilado
- CSS compilado
- Fuentes y recursos estáticos incluidos en el build
- Iconos de la PWA
- Manifest

La API está fuera del shell. Aunque React pueda abrir, una petición como esta sigue necesitando red:

```text
GET https://d3ujwk09smrk9z.cloudfront.net/projects
```

---

## 2. Decisiones de esta implementación

### Estrategia del service worker

Usaremos `generateSW`, la estrategia predeterminada de `vite-plugin-pwa`. Workbox genera automáticamente el service worker durante el build.

### Actualizaciones

Usaremos `registerType: 'prompt'`.

Cuando haya una versión nueva:

1. El nuevo service worker se descarga en segundo plano.
2. La aplicación muestra **Hay una nueva versión disponible**.
3. El usuario elige **Actualizar**.
4. El service worker nuevo toma el control y la página se recarga.

Esta estrategia es útil en TaskFlow porque evita recargar automáticamente mientras alguien llena un formulario.

### Caché de la API

No configuraremos `runtimeCaching` para `/projects` ni para `/auth`.

Motivos:

- Las respuestas dependen del JWT y del usuario.
- Los datos pueden cambiar con frecuencia.
- Un caché compartido podría mostrar información vieja después de cambiar de sesión.
- `POST`, `PUT` y `DELETE` requieren conexión de todas formas.

---

## 3. Qué ves al terminar

- El navegador reconoce TaskFlow como aplicación instalable.
- Al instalarla se abre en una ventana independiente, sin la barra normal del navegador.
- En la primera carga aparece el mensaje **La app ya puede abrirse sin conexión**.
- Cuando se despliega una versión nueva aparece el botón **Actualizar**.
- DevTools muestra un manifest válido y un service worker activo.
- Con DevTools en modo Offline, la interfaz sigue abriendo después de haberla visitado en línea.

---

## 4. Leyenda

| Símbolo | Significado |
| --- | --- |
| 📦 | Instalar dependencia |
| 🆕 | Crear archivo nuevo |
| ✏️ | Modificar archivo existente |
| ⚙️ | Configurar build o PWA |
| 🔌 | Conectar para verlo en pantalla |
| ✅ | Verificar resultado |
| ⚠️ | Consideración importante |

---

# FASE 6 — Convertir TaskFlow en PWA

> Si todavía no integraste la fase de PUT y DELETE, puedes usar esta misma guía después de la Fase 4. La configuración PWA no depende de esas operaciones.

**Pasos de esta fase:** 6.0 → 6.1 → 6.2 → 6.3 → 6.4 → 6.5 → 6.6 → 6.7 → 6.8 → 6.9 → 6.10 → 6.11

| Paso | Acción | Archivo o resultado |
| --- | --- | --- |
| 6.0 | Verificar el proyecto actual | App existente |
| 6.1 | 📦 Instalar dependencias | `package.json`, `package-lock.json` |
| 6.2 | 🆕 Crear carpetas y archivos | `public/`, `pwa-icon.svg`, `PwaStatus.tsx` |
| 6.3 | 🆕 Crear icono fuente | `public/pwa-icon.svg` |
| 6.4 | Generar iconos PWA | Archivos PNG, SVG e ICO en `public/` |
| 6.5 | ⚙️ ✏️ Configurar plugin | `vite.config.ts` |
| 6.6 | ✏️ Agregar tipos | `src/vite-env.d.ts` |
| 6.7 | 🆕 Crear aviso PWA | `src/components/PwaStatus.tsx` |
| 6.8 | 🔌 ✏️ Conectar aviso | `src/App.tsx` |
| 6.9 | ✏️ Completar metadatos | `index.html` |
| 6.10 | ✅ Probar build y modo offline | `dist/` y navegador |
| 6.11 | Publicar y verificar | GitHub Pages |

---

## Paso 6.0 — Verificar el punto de partida

> **¿Qué hace?** Comprueba que la aplicación compila y que su funcionalidad existente sigue operativa.
>
> **¿Por qué importa?** Conviene separar cualquier error previo de los cambios relacionados con la PWA.

Desde la raíz de `jwt-auth-demo`:

```bash
npm install
npm run build
npm run dev
```

Comprueba:

1. El login aparece correctamente.
2. Puedes iniciar sesión con `ana` / `ana123`.
3. El dashboard carga los proyectos.
4. Las rutas usan el `basename` de Vite.
5. El build termina sin errores.

Detén el servidor con `Ctrl+C`.

---

## Paso 6.1 — 📦 Instalar dependencias PWA

> **¿Qué hace?** Instala el plugin que genera el manifest y el service worker, el generador de iconos y la integración para manejar actualizaciones desde React.
>
> **¿Por qué importa?** Vite por sí solo genera una aplicación web, pero no crea el ciclo completo de una PWA.

Ejecuta:

```bash
npm install -D vite-plugin-pwa @vite-pwa/assets-generator workbox-window
```

Este comando modifica automáticamente:

```text
package.json       ← ✏️ agrega devDependencies
package-lock.json  ← ✏️ fija las versiones instaladas
```

### Para qué sirve cada paquete

| Paquete | Función |
| --- | --- |
| `vite-plugin-pwa` | Genera manifest, service worker y registro |
| `@vite-pwa/assets-generator` | Crea iconos desde un SVG fuente |
| `workbox-window` | Permite usar `useRegisterSW()` desde React |

> La integración oficial de React indica que `workbox-window` debe estar instalado cuando se usa `virtual:pwa-register/react`.

---

## Paso 6.2 — 🆕 Crear carpetas y archivos faltantes

> **¿Qué hace?** Crea el directorio público para los iconos y los archivos nuevos que se llenarán en los siguientes pasos.
>
> **¿Por qué importa?** Todo lo colocado en `public/` se copia a `dist/` sin cambiar su nombre.

Ejecuta desde la raíz:

```bash
mkdir -p public src/components

touch \
  public/pwa-icon.svg \
  src/components/PwaStatus.tsx
```

Los siguientes archivos ya existen y se van a **modificar**, no a crear:

```text
vite.config.ts
src/vite-env.d.ts
src/App.tsx
index.html
package.json
package-lock.json
```

> `mkdir -p` conserva las carpetas existentes. `touch` no borra el contenido de un archivo si ya existe.

---

## Paso 6.3 — 🆕 Crear `public/pwa-icon.svg`

> **¿Qué hace?** Define un icono vectorial de TaskFlow que servirá como fuente para generar todos los tamaños requeridos.
>
> **¿Por qué importa?** Una PWA instalable necesita como mínimo iconos de 192 × 192 y 512 × 512. Partir de SVG evita perder calidad al redimensionar.

Pega este contenido:

```svg
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="512"
  height="512"
  viewBox="0 0 512 512"
  role="img"
  aria-labelledby="title description"
>
  <title id="title">TaskFlow</title>
  <desc id="description">Lista de tareas con una marca de verificación</desc>

  <rect width="512" height="512" rx="112" fill="#1565c0" />

  <rect
    x="126"
    y="96"
    width="260"
    height="320"
    rx="40"
    fill="#ffffff"
  />

  <rect
    x="196"
    y="72"
    width="120"
    height="64"
    rx="28"
    fill="#90caf9"
  />

  <path
    d="M174 224l28 28 52-60"
    fill="none"
    stroke="#1565c0"
    stroke-width="22"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <path
    d="M174 318l28 28 52-60"
    fill="none"
    stroke="#1565c0"
    stroke-width="22"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <path
    d="M286 222h54M286 316h54"
    fill="none"
    stroke="#90caf9"
    stroke-width="20"
    stroke-linecap="round"
  />
</svg>
```

El dibujo deja margen alrededor de los elementos centrales para que funcione correctamente como icono maskable.

---

## Paso 6.4 — Generar los iconos PWA

> **¿Qué hace?** Convierte `pwa-icon.svg` en iconos transparentes, maskable, Apple Touch Icon y favicon.
>
> **¿Por qué importa?** Cada sistema operativo necesita tamaños y tratamientos diferentes.

Ejecuta:

```bash
npx pwa-assets-generator --preset minimal-2023 public/pwa-icon.svg
```

Verifica el resultado:

```bash
ls -1 public
```

Debes encontrar, entre otros, estos archivos:

```text
apple-touch-icon-180x180.png
favicon.ico
favicon.svg
maskable-icon-512x512.png
pwa-64x64.png
pwa-192x192.png
pwa-512x512.png
pwa-icon.svg
```

### Qué significa `maskable`

Android puede recortar un icono como círculo, cuadrado redondeado u otra forma. El icono maskable mantiene el contenido importante dentro de una zona segura para evitar que se corte.

> La documentación oficial recomienda declarar por separado el icono de uso general (`purpose: 'any'`) y el icono maskable (`purpose: 'maskable'`).

---

## Paso 6.5 — ⚙️ ✏️ Modificar `vite.config.ts`

> **¿Qué hace?** Conserva el `base` de GitHub Pages y el proxy de desarrollo, y agrega `VitePWA()` con manifest y precache.
>
> **¿Por qué importa?** Este archivo genera las piezas centrales de la PWA durante `vite build`.

Reemplaza todo el contenido por:

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const repoName = 'jwt-auth-demo'
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  base: isGitHubPages ? `/${repoName}/` : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'apple-touch-icon-180x180.png',
        'pwa-64x64.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'maskable-icon-512x512.png',
      ],
      manifest: {
        name: 'TaskFlow — Gestión de proyectos',
        short_name: 'TaskFlow',
        description: 'Gestiona proyectos y tareas desde una app instalable.',
        lang: 'es-MX',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1565c0',
        categories: ['productivity', 'business'],
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://d3ujwk09smrk9z.cloudfront.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

### Qué se conservó

```ts
base: isGitHubPages ? `/${repoName}/` : '/'
```

Esto permite que los recursos se publiquen bajo:

```text
https://TU_USUARIO.github.io/jwt-auth-demo/
```

También se conservó el proxy `/api` para desarrollo local.

### Qué agregó `VitePWA`

| Opción | Función |
| --- | --- |
| `registerType: 'prompt'` | Espera confirmación antes de activar una actualización |
| `injectRegister: 'auto'` | Registra automáticamente el service worker |
| `includeAssets` | Incluye iconos y favicons entre los recursos PWA |
| `manifest` | Define cómo se instala y presenta la app |
| `globPatterns` | Selecciona los archivos estáticos para precache |
| `cleanupOutdatedCaches` | Elimina cachés de versiones anteriores |

### Por qué usamos rutas relativas en el manifest

```ts
start_url: '.'
scope: '.'
```

El manifest se sirve dentro del `base` configurado. Las rutas relativas permiten que funcione tanto en `/` durante pruebas locales como en `/jwt-auth-demo/` dentro de GitHub Pages.

### ⚠️ Qué no se agrega

No agregues una regla como esta para la API autenticada:

```ts
// No usar en esta guía.
runtimeCaching: [
  {
    urlPattern: /\/projects/,
    handler: 'CacheFirst',
  },
]
```

`CacheFirst` podría servir proyectos desactualizados o pertenecientes a una sesión anterior.

---

## Paso 6.6 — ✏️ Modificar `src/vite-env.d.ts`

> **¿Qué hace?** Agrega los tipos del módulo virtual de React que proporciona `vite-plugin-pwa`.
>
> **¿Por qué importa?** Sin esta referencia, TypeScript puede mostrar `Cannot find module 'virtual:pwa-register/react'`.

Reemplaza todo el contenido por:

```ts
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### Qué cambió

Solo se agregó esta línea:

```ts
/// <reference types="vite-plugin-pwa/react" />
```

---

## Paso 6.7 — 🆕 Crear `src/components/PwaStatus.tsx`

> **¿Qué hace?** Usa el hook oficial `useRegisterSW()` para mostrar dos estados: aplicación preparada para uso offline y nueva versión disponible.
>
> **¿Por qué importa?** El service worker trabaja en segundo plano; este componente hace visible lo que está sucediendo.

Pega este contenido:

```tsx
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import { useRegisterSW } from 'virtual:pwa-register/react'

export function PwaStatus() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.error('No se pudo registrar el service worker:', error)
    },
  })

  const open = offlineReady || needRefresh

  function close() {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  function update() {
    void updateServiceWorker(true)
  }

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity={needRefresh ? 'info' : 'success'}
        variant="filled"
        sx={{ width: '100%' }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <span>
            {needRefresh
              ? 'Hay una nueva versión disponible.'
              : 'La app ya puede abrirse sin conexión.'}
          </span>

          {needRefresh && (
            <Button color="inherit" size="small" onClick={update}>
              Actualizar
            </Button>
          )}

          <Button color="inherit" size="small" onClick={close}>
            Cerrar
          </Button>
        </Stack>
      </Alert>
    </Snackbar>
  )
}
```

### Valores que devuelve `useRegisterSW()`

| Valor | Significado |
| --- | --- |
| `offlineReady` | El precache terminó y el shell puede abrirse offline |
| `needRefresh` | Hay un service worker nuevo esperando activarse |
| `updateServiceWorker(true)` | Activa la versión nueva y recarga la página |

### Por qué el registro no está escrito manualmente

No es necesario crear un `service-worker.js` a mano ni llamar directamente a:

```ts
navigator.serviceWorker.register(...)
```

`vite-plugin-pwa` genera el archivo durante el build y el módulo virtual administra el registro.

---

## Paso 6.8 — 🔌 ✏️ Modificar `src/App.tsx`

> **¿Qué hace?** Conserva Material UI, autenticación y rutas, y agrega `PwaStatus` para que los avisos estén disponibles en cualquier pantalla.
>
> **¿Por qué importa?** El estado del service worker no pertenece solo al login o al dashboard; corresponde a toda la aplicación.

Reemplaza todo el contenido por:

```tsx
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PwaStatus } from './components/PwaStatus'
import { AuthProvider } from './context/AuthContext'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { ProtectedRoute } from './ProtectedRoute'

const theme = createTheme()
const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AuthProvider>
        <BrowserRouter basename={routerBasename}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>

      <PwaStatus />
    </ThemeProvider>
  )
}
```

### Qué cambió

Se agregó el import:

```tsx
import { PwaStatus } from './components/PwaStatus'
```

Y el componente global:

```tsx
<PwaStatus />
```

`BrowserRouter` continúa usando:

```ts
const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '')
```

Esto sigue siendo necesario para GitHub Pages.

---

## Paso 6.9 — ✏️ Modificar `index.html`

> **¿Qué hace?** Agrega color del navegador, favicons, Apple Touch Icon y metadatos móviles.
>
> **¿Por qué importa?** Mejora la presentación antes y después de instalar la PWA, especialmente en iPhone y iPad.

Reemplaza todo el contenido por:

```html
<!doctype html>
<html lang="es-MX">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <meta name="theme-color" content="#1565c0" />
    <meta name="description" content="TaskFlow: gestión de proyectos y tareas." />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="TaskFlow" />

    <link rel="icon" href="%BASE_URL%favicon.ico" sizes="48x48" />
    <link
      rel="icon"
      href="%BASE_URL%favicon.svg"
      sizes="any"
      type="image/svg+xml"
    />
    <link
      rel="apple-touch-icon"
      href="%BASE_URL%apple-touch-icon-180x180.png"
    />

    <title>TaskFlow</title>
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Por qué se usa `%BASE_URL%`

Vite reemplaza `%BASE_URL%` durante el build:

```text
Desarrollo local → /
GitHub Pages     → /jwt-auth-demo/
```

Así los iconos funcionan en ambos entornos sin escribir dos configuraciones.

### ¿Dónde está el link al manifest?

`vite-plugin-pwa` lo inyecta automáticamente durante el build. No necesitas escribir manualmente:

```html
<link rel="manifest" href="..." />
```

---

## Paso 6.10 — ✅ Probar el build y el modo offline

### 6.10.1 Generar el build local

El service worker normalmente se valida sobre un build, no sobre `npm run dev`.

Ejecuta:

```bash
npm run build
npm run preview
```

Abre la URL que muestre Vite, normalmente:

```text
http://localhost:4173/
```

> No habilitamos el service worker durante `npm run dev` porque un caché activo puede confundir la depuración. `npm run preview` prueba el resultado real de `dist/`.

### 6.10.2 Revisar los archivos generados

En otra terminal:

```bash
find dist -maxdepth 2 -type f | sort
```

Debes encontrar:

```text
dist/index.html
dist/manifest.webmanifest
dist/sw.js
dist/workbox-*.js
dist/pwa-192x192.png
dist/pwa-512x512.png
dist/maskable-icon-512x512.png
```

Los nombres con hash dentro de `dist/assets/` cambian en cada build y eso es normal.

### 6.10.3 Verificar el manifest

En Chrome o Edge:

1. Abre DevTools.
2. Ve a **Application**.
3. Abre **Manifest**.
4. Confirma nombre, iconos, `start_url`, `display` y colores.
5. Revisa que no aparezcan errores de iconos.

### 6.10.4 Verificar el service worker

En **Application → Service Workers** comprueba:

- Status: `activated and is running`.
- Scope: corresponde a la URL actual.
- Source: `sw.js`.

Después revisa **Application → Cache Storage**. Debe existir un caché creado por Workbox.

### 6.10.5 Probar sin conexión

1. Visita la app una vez con conexión.
2. Espera el mensaje **La app ya puede abrirse sin conexión**.
3. En DevTools → **Network**, selecciona **Offline**.
4. Recarga la página.
5. Confirma que React, Material UI y las rutas cargan.

Resultado esperado en el dashboard:

```text
Shell de React                  → carga
Rutas                           → cargan
Iconos y estilos                → cargan
GET /projects                   → falla sin red
POST, PUT y DELETE              → requieren red
```

Vuelve a seleccionar **No throttling** al terminar.

### 6.10.6 Probar instalación

Con la app servida por `localhost` o HTTPS:

- Chrome/Edge de escritorio: utiliza el icono **Instalar** de la barra de direcciones.
- Android: menú del navegador → **Instalar aplicación** o **Agregar a pantalla principal**.
- iPhone/iPad: Safari → **Compartir** → **Agregar a pantalla de inicio**.

---

## Paso 6.11 — Publicar en GitHub Pages

> **¿Qué hace?** Ejecuta el mismo workflow existente. El plugin genera los archivos PWA dentro de `dist/` y Actions los publica con el resto de la app.
>
> **¿Por qué importa?** Los service workers requieren un origen seguro; GitHub Pages sirve el sitio mediante HTTPS.

### El workflow existente no necesita cambiar

La guía original ya ejecuta:

```yaml
- name: Build
  run: npm run build:pages
  env:
    VITE_API_URL: https://d3ujwk09smrk9z.cloudfront.net

- name: Upload Pages artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: dist
```

Cuando `vite build` se ejecuta, `VitePWA()` agrega automáticamente a `dist/`:

```text
manifest.webmanifest
sw.js
workbox-*.js
iconos
```

El script existente también continúa generando `404.html` para las rutas SPA:

```json
"build:pages": "tsc -b && GITHUB_PAGES=true vite build && cp dist/index.html dist/404.html"
```

### Publicar los cambios

```bash
git status
git add -A
git commit -m "feat: convert TaskFlow to PWA"
git push origin main
```

### Verificar el deploy

1. Abre GitHub → **Actions**.
2. Espera que el workflow `CI` termine correctamente.
3. Abre:

```text
https://TU_USUARIO.github.io/jwt-auth-demo/
```

4. DevTools → **Application → Manifest**.
5. Confirma el scope:

```text
https://TU_USUARIO.github.io/jwt-auth-demo/
```

6. Instala la aplicación.
7. Ábrela desde el icono instalado.

---

# Cómo probar una actualización PWA

La primera versión debe estar instalada o abierta con su service worker activo.

Después:

1. Cambia un texto visible, por ejemplo el subtítulo del dashboard.
2. Genera y publica un nuevo build.
3. Mantén abierta o vuelve a abrir la versión anterior.
4. El navegador detectará el nuevo service worker.
5. Debe aparecer **Hay una nueva versión disponible**.
6. Pulsa **Actualizar**.
7. La página se recarga con el nuevo contenido.

> La detección no siempre es instantánea. Puedes usar DevTools → Application → Service Workers → **Update** para forzar la revisión durante una prueba.

---

# Mapa de archivos actualizado

```text
jwt-auth-demo/
├── index.html                         ← Fase 6 ✏️
├── vite.config.ts                     ← Fase 0 ✏️ · Fase 6 ✏️ ⚙️
├── package.json                       ← Fase 6 ✏️
├── package-lock.json                  ← Fase 6 ✏️
├── public/
│   ├── pwa-icon.svg                   ← Fase 6 🆕 fuente
│   ├── favicon.ico                    ← Fase 6 generado
│   ├── favicon.svg                    ← Fase 6 generado
│   ├── apple-touch-icon-180x180.png  ← Fase 6 generado
│   ├── pwa-64x64.png                  ← Fase 6 generado
│   ├── pwa-192x192.png                ← Fase 6 generado
│   ├── pwa-512x512.png                ← Fase 6 generado
│   └── maskable-icon-512x512.png      ← Fase 6 generado
└── src/
    ├── App.tsx                        ← Fase 6 ✏️ 🔌
    ├── vite-env.d.ts                  ← Fase 6 ✏️
    └── components/
        └── PwaStatus.tsx              ← Fase 6 🆕
```

> `manifest.webmanifest`, `sw.js` y `workbox-*.js` no se crean dentro de `src/`. Se generan automáticamente en `dist/` durante el build.

---

# Checklist de entrega

## Dependencias y archivos

- [ ] `vite-plugin-pwa` está instalado.
- [ ] `@vite-pwa/assets-generator` está instalado.
- [ ] `workbox-window` está instalado.
- [ ] Existe `public/pwa-icon.svg`.
- [ ] Se generaron los iconos PNG, SVG e ICO.
- [ ] Existe `src/components/PwaStatus.tsx`.

## Configuración

- [ ] `vite.config.ts` conserva el `base` de GitHub Pages.
- [ ] `vite.config.ts` conserva el proxy `/api`.
- [ ] `VitePWA()` define manifest, iconos y Workbox.
- [ ] `start_url` y `scope` son relativos.
- [ ] `src/vite-env.d.ts` incluye los tipos de `vite-plugin-pwa/react`.
- [ ] `index.html` usa `%BASE_URL%` para iconos.
- [ ] `App.tsx` renderiza `<PwaStatus />`.

## Seguridad y datos

- [ ] No se usa `CacheFirst` para `/auth`.
- [ ] No se cachean respuestas autenticadas de `/projects`.
- [ ] El JWT mantiene el mismo manejo del proyecto original.
- [ ] La UI aclara que las operaciones de API requieren conexión.

## Pruebas

- [ ] `npm run build` termina sin errores.
- [ ] `npm run preview` sirve la aplicación.
- [ ] `dist/manifest.webmanifest` existe.
- [ ] `dist/sw.js` existe.
- [ ] El manifest aparece sin errores en DevTools.
- [ ] El service worker está activado.
- [ ] La app abre el shell en modo Offline.
- [ ] La aplicación se puede instalar.
- [ ] El deploy de GitHub Pages conserva el scope `/jwt-auth-demo/`.

---

# Errores comunes

## `Cannot find module 'virtual:pwa-register/react'`

Confirma:

```bash
npm install -D vite-plugin-pwa workbox-window
```

Y agrega en `src/vite-env.d.ts`:

```ts
/// <reference types="vite-plugin-pwa/react" />
```

## No aparece `sw.js` con `npm run dev`

Es esperado en esta configuración. Prueba el build:

```bash
npm run build
npm run preview
```

## Los iconos dan 404 en GitHub Pages

No escribas rutas absolutas como:

```html
<link rel="icon" href="/favicon.svg" />
```

Usa:

```html
<link rel="icon" href="%BASE_URL%favicon.svg" />
```

Y conserva iconos relativos dentro del manifest.

## El scope aparece en `/` y no en `/jwt-auth-demo/`

Confirma que el build de Pages utiliza:

```bash
GITHUB_PAGES=true vite build
```

Y que `vite.config.ts` contiene:

```ts
base: isGitHubPages ? `/${repoName}/` : '/'
```

## La app abre offline, pero no muestra proyectos

Es el comportamiento intencional de esta guía. El shell está en caché; la API autenticada no.

Cuando no hay red:

```text
React + rutas + estilos → disponibles
TaskFlow API           → no disponible
```

## Continúa apareciendo una versión vieja

1. Abre DevTools → Application → Service Workers.
2. Pulsa **Update**.
3. Si aparece el aviso, pulsa **Actualizar**.
4. Para una prueba desde cero, usa **Clear site data** y vuelve a cargar.

> No borres los datos del sitio en una sesión real sin considerar que también se eliminará el token guardado en `localStorage`.

## El build falla por un recurso demasiado grande

Workbox tiene un límite predeterminado para los archivos individuales del precache. Revisa si agregaste imágenes, videos o bundles innecesariamente grandes. Para esta app, los recursos normales deberían quedar por debajo del límite sin modificarlo.

---

# Comandos completos de la fase

```bash
# 1. Instalar dependencias
npm install -D vite-plugin-pwa @vite-pwa/assets-generator workbox-window

# 2. Crear archivos nuevos
mkdir -p public src/components
touch public/pwa-icon.svg src/components/PwaStatus.tsx

# 3. Después de pegar el SVG, generar iconos
npx pwa-assets-generator --preset minimal-2023 public/pwa-icon.svg

# 4. Validar build y PWA local
npm run build
npm run preview

# 5. Publicar
git status
git add -A
git commit -m "feat: convert TaskFlow to PWA"
git push origin main
```

---

# Resumen final

```text
vite-plugin-pwa
    → genera manifest.webmanifest
    → genera sw.js con Workbox
    → guarda el shell de React en precache

PwaStatus
    → informa que la app está lista offline
    → informa que hay una actualización
    → activa el nuevo service worker con permiso del usuario

GitHub Pages
    → publica dist/ bajo /jwt-auth-demo/
    → proporciona HTTPS
    → permite instalar la aplicación

TaskFlow API
    → no se almacena en caché
    → requiere internet y JWT
```

> **Manifest** = cómo se presenta e instala · **Service worker** = qué recursos controla · **Precache** = qué puede abrir sin conexión

---

# Referencias oficiales

- [Vite PWA — Getting Started](https://vite-pwa-org.netlify.app/guide/)
- [Vite PWA — React](https://vite-pwa-org.netlify.app/frameworks/react)
- [Vite PWA — Service Worker Precache](https://vite-pwa-org.netlify.app/guide/service-worker-precache)
- [Vite PWA — PWA Assets Generator](https://vite-pwa-org.netlify.app/assets-generator/)
- [Vite — Deploying a Static Site en GitHub Pages](https://vite.dev/guide/static-deploy)
