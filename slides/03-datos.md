# Día 3 — Datos y custom hooks

## Del array local a la red
En producción los datos vienen de `GET /tasks`.

---

## useEffect
Ejecuta código cuando montás el componente  
o cuando cambian las dependencias.

---

## fetch + async
```ts
const res = await fetch(url)
const data = await res.json()
```

---

## Cuatro estados de UI
Loading · Error · Empty · Success  
Nunca asumas que siempre hay datos.

---

## Custom hook
```ts
function useTasks(filters) {
  // loading, error, data
}
```
La página solo consume el hook.

---

## Práctica
Filtros + API mock con delay 400 ms
