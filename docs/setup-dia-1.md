# Setup — Día 1 (~2.5 h)

## 1.1 Herramientas locales (~30 min)

- [Node.js 20+](https://nodejs.org/)
- [Git](https://git-scm.com/)
- VS Code + extensiones:
  - ES7+ React/Redux/React-Native snippets
  - Prettier
  - Error Lens (`usernamehw.errorlens`)
  - Pretty TypeScript Errors (`YoavBls.pretty-ts-errors`)

## 1.2 Git + GitHub (~30 min)

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

Creá cuenta en github.com con el mismo email. VS Code pedirá auth en el primer push.

## 1.3 Proyecto + repo (~30 min)

```bash
npm create vite@latest mi-app -- --template react-ts
cd mi-app && npm install && npm run dev
git init
git branch -M main
git add . && git commit -m "chore: initial Vite + TS setup"
git remote add origin https://github.com/<user>/react-course.git
git push -u origin main
```

## 1.4 Tour del proyecto + git flow diario (~30 min)

Archivos clave: `main.tsx`, `App.tsx`, `index.html`, `package.json`, `tsconfig.json`, `.gitignore`, `StrictMode`.

Flujo diario:

```bash
git status
git add .
git commit -m "feat: day X — topic"
git push
```

Convenciones: `feat:` / `fix:` / `chore:` / `docs:`
