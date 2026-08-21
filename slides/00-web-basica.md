# Día 0 — HTML, CSS y JavaScript

## Bienvenida
Curso React Intensivo · TaskFlow  
Primero: entender la web sin frameworks

---

## ¿Qué es una página web?
Tres lenguajes, un solo documento en el navegador:
- HTML → estructura
- CSS → apariencia
- JavaScript → comportamiento

---

## HTML: el esqueleto
```html
<!DOCTYPE html>
<html lang="es">
  <head>…</head>
  <body>…</body>
</html>
```
Etiquetas semánticas: header, main, form, ul, button

---

## CSS: box model y flexbox
Cada caja: content + padding + border + margin  
`display: flex` alinea en una fila o columna

---

## JavaScript y el DOM
El DOM es el árbol de nodos de la página.  
JS puede: buscar nodos, crear elementos, escuchar eventos.

---

## Estado en memoria
```js
let tasks = [{ id: 1, title: '…', done: false }]
```
La UI se pinta a partir del array (función render)

---

## Eventos
- submit del form → agregar
- change del checkbox → toggle
- click → borrar  
Siempre: preventDefault + render()

---

## El dolor de pintar a mano
Si el estado cambia en 3 lugares, actualizás 3 rutinas.  
Fácil desincronizar lo que ves y lo que “sabés”.

---

## ¿Y jQuery?
En 2006 unificó el DOM entre navegadores: `$('#x').append(...)`.  
Hoy el problema no es el selector: es **el estado**.

---

## Mañana: React
UI = f(estado)  
Vos describís el resultado; React actualiza el DOM.

---

## Práctica de hoy
TaskFlow mínimo: listar / agregar / marcar hecha  
Archivos: index.html · styles.css · app.js
