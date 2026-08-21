# Día 5 — JWT y API real

## El eslabón final
El frontend habla con el mismo backend que construyeron en Java.

---

## Login
```
POST /auth/login { username, password }
→ { token }
```

---

## Bearer token
```
Authorization: Bearer eyJhbGciOi…
```
En cada request protegido.

---

## AuthContext
Guarda usuario/token  
Protege rutas privadas  
Logout limpia localStorage

---

## Fallback demo
Sin API: ana/ana123 sigue funcionando  
Ideal para proyectar en clase

---

## Variables
```
VITE_API_URL=http://localhost:8080
VITE_USE_API=true
```

---

## Práctica final
TaskFlow usable: login + CRUD contra Spring o demo
