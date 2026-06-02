# EPN Event Manager - Examen de Mantenimiento de Software

## Descripción

Este proyecto corresponde al examen práctico de Mantenimiento de Software.

El objetivo es construir primero un CRUD inicial persistente de platos típicos ecuatorianos y luego aplicar sobre ese CRUD las actividades de mantenimiento de software:

- Mantenimiento correctivo
- Mantenimiento adaptativo
- Mantenimiento perfectivo
- Mantenimiento preventivo

El sistema usa NestJS para el backend, SQLite para persistencia, pruebas dirigidas por TDD, documentación, logs, seguridad por API Key, Swagger/OpenAPI, GitHub Actions y un frontend con Node.js para visualizar y gestionar los platos típicos.

---

## Tema funcional

Sistema de gestión de platos típicos ecuatorianos.

---

## Recurso principal

### PlatoTipico

Campos oficiales:

| Campo | Descripción |
|---|---|
| `id` | Identificador único del plato típico |
| `nombre` | Nombre del plato típico |
| `descripcion` | Descripción del plato |
| `region` | Región del Ecuador a la que pertenece |
| `ingredientes` | Ingredientes principales |
| `precio` | Precio referencial |
| `imagenUrl` | URL de imagen del plato |
| `categoria` | Categoría gastronómica |

Ejemplo:

```json
{
  "nombre": "Encebollado",
  "descripcion": "Plato tradicional de la Costa ecuatoriana preparado con pescado, yuca, cebolla y tomate.",
  "region": "Costa",
  "ingredientes": "Pescado, yuca, cebolla, tomate, cilantro y limón",
  "precio": 3.5,
  "imagenUrl": "https://via.placeholder.com/300x200",
  "categoria": "Sopa tradicional"
}
```

---

## Estructura del proyecto

```text
epn-event-manager/
├── db/
│   └── platos-tipicos.sqlite
├── src/
│   ├── database/
│   ├── modules/
│   │   └── platos-tipicos/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── frontend/
├── docs/
├── .github/
│   └── workflows/
├── AGENTS.md
├── CONTEXTO_PROYECTO.md
├── PLAN_TDD.md
├── README.md
├── package.json
└── package-lock.json
```

---

## Tecnologías usadas

- Node.js
- NestJS
- TypeScript
- SQLite
- TypeORM
- Jest
- Swagger / OpenAPI
- GitHub Actions
- Frontend con Node.js
- Vite con JavaScript

---

## Instalación del backend

Desde la carpeta del proyecto:

```bash
cd Examen/epn-event-manager
npm install
```

---

## Ejecución del backend

```bash
npm run start:dev
```

Por defecto, el backend se ejecuta en:

```text
http://localhost:3000
```

---

## Persistencia

El CRUD de platos típicos ecuatorianos usa SQLite.

La base de datos debe guardarse dentro de la carpeta:

```text
db/
```

Ejemplo:

```text
db/platos-tipicos.sqlite
```

Los platos típicos no deben guardarse únicamente en memoria RAM. Los datos deben mantenerse después de reiniciar el servidor.

---

## Endpoints del CRUD

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/platos-tipicos` | Crear un plato típico |
| `GET` | `/platos-tipicos` | Listar platos típicos |
| `GET` | `/platos-tipicos/:id` | Consultar un plato típico por ID |
| `PATCH` | `/platos-tipicos/:id` | Actualizar un plato típico |
| `DELETE` | `/platos-tipicos/:id` | Eliminar un plato típico |

---

## Endpoint perfectivo de estadísticas

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/platos-tipicos/stats` | Obtener estadísticas de platos típicos |

Este endpoint calcula:

- total de platos
- precio promedio
- precio mínimo
- precio máximo
- platos por región
- platos por categoría
- fecha de generación en formato ISO 8601

---

## Seguridad por API Key

Los endpoints protegidos deben recibir la cabecera:

```text
X-FIS-EPN-KEY
```

Ejemplo:

```http
X-FIS-EPN-KEY: clave-de-prueba
```

La clave debe configurarse mediante variables de entorno.

Archivo esperado:

```text
.env
```

Archivo que sí puede subirse al repositorio:

```text
.env.example
```

Ejemplo de `.env.example`:

```env
PORT=3000
NODE_ENV=development
FIS_EPN_API_KEY=clave-de-prueba
```

No se debe subir el archivo `.env` real.

---

## Swagger / OpenAPI

La documentación de la API estará disponible en:

```text
http://localhost:3000/api/docs
```

Swagger debe documentar:

- endpoints del CRUD
- endpoint de estadísticas
- DTOs
- respuestas de error
- cabecera `X-FIS-EPN-KEY`

---

## Pruebas

Ejecutar pruebas:

```bash
npm test
```

Ejecutar pruebas e2e si están configuradas:

```bash
npm run test:e2e
```

---

## Build

```bash
npm run build
```

---

## Frontend con Node.js

El frontend se encuentra en:

```text
frontend/
```

El frontend debe permitir:

- listar platos típicos
- mostrar tarjetas con imagen, nombre, descripción, región, ingredientes, precio y categoría
- crear platos típicos
- ver detalle
- editar platos típicos
- eliminar platos típicos
- visualizar estadísticas
- consumir la API protegida con `X-FIS-EPN-KEY`

### Instalación del frontend

```bash
cd frontend
npm install
```

### Ejecución del frontend

```bash
npm run dev
```

### Build del frontend

```bash
npm run build
```

---

## Mantenimientos aplicados

El proyecto se desarrolla en dos etapas:

1. Construcción del CRUD inicial persistente.
2. Aplicación del examen de mantenimiento sobre el CRUD.

### Mantenimiento correctivo

Objetivo: corregir fallos funcionales del CRUD.

Ejemplos:

- asegurar que `DELETE /platos-tipicos/:id` elimine realmente en SQLite
- evitar respuestas de éxito falsas
- manejar errores cuando el ID no existe

### Mantenimiento adaptativo

Objetivo: adaptar el sistema a nuevas necesidades de integración.

Ejemplos:

- metadata estandarizada
- `timestampISO`
- `apiVersion`
- `timezone`
- `environment`
- `integrationTarget`
- integración con EPN Event Manager

### Mantenimiento perfectivo

Objetivo: mejorar el sistema agregando nuevas capacidades.

Ejemplo:

```text
GET /platos-tipicos/stats
```

### Mantenimiento preventivo

Objetivo: prevenir errores futuros y entradas peligrosas.

Validaciones:

- campos obligatorios
- precio mayor o igual a 0
- URL de imagen válida
- límites de caracteres
- bloqueo de `<script>`
- bloqueo de patrones como `SELECT`, `DROP`, `INSERT` o `--`

---

## TDD

El desarrollo de mantenimientos se realiza con TDD:

1. **RED:** crear una prueba que falle.
2. **GREEN:** implementar el código mínimo para que pase.
3. **REFACTOR:** mejorar el código sin cambiar el comportamiento.

El detalle de pruebas se encuentra en:

```text
PLAN_TDD.md
```

---

## Logs y trazabilidad

El sistema debe registrar operaciones importantes:

- creación
- consulta
- actualización
- eliminación
- errores de validación
- errores de API Key
- errores internos

Los logs deben incluir:

- nivel `INFO`, `WARN` o `ERROR`
- fecha en formato ISO 8601
- acción realizada
- ruta o endpoint
- ID del plato típico cuando aplique

---

## GitHub Actions

El proyecto incluye integración continua con GitHub Actions.

El workflow debe ejecutar:

- instalación de dependencias
- lint si está configurado
- pruebas
- build del backend
- build del frontend si existe

Archivo esperado:

```text
.github/workflows/node-ci.yml
```

---

## Documentación del examen

Archivos principales:

| Archivo | Propósito |
|---|---|
| `AGENTS.md` | Reglas para Codex |
| `CONTEXTO_PROYECTO.md` | Contexto, estructura y avance por fases |
| `PLAN_TDD.md` | Plan de pruebas y metodología TDD |
| `docs/DIAGNOSTICO_DEUDA_TECNICA.md` | Diagnóstico inicial |
| `docs/TABLA_MANTENIMIENTO.md` | Clasificación de mantenimientos |
| `docs/PRUEBAS_MANUALES_API.md` | Evidencia de pruebas manuales |

---

## Fases del proyecto

| Fase | Descripción |
|---|---|
| Fase 0 | Actualizar documentación base |
| Fase 1 | Revisar estructura real |
| Fase 2 | Crear CRUD inicial persistente con SQLite |
| Fase 3 | Probar CRUD inicial y persistencia |
| Fase 4 | Diagnóstico de deuda técnica |
| Fase 5 | TDD base del CRUD |
| Fase 6 | Mantenimiento correctivo |
| Fase 7 | Mantenimiento adaptativo |
| Fase 8 | Mantenimiento perfectivo |
| Fase 9 | Mantenimiento preventivo |
| Fase 10 | Seguridad por API Key |
| Fase 11 | Logs y trazabilidad |
| Fase 12 | Swagger / OpenAPI |
| Fase 13 | Frontend con Node.js |
| Fase 14 | GitHub Actions |
| Fase 15 | Pruebas manuales o Postman |
| Fase 16 | Documentación final |
| Fase 17 | Revisión final |

---

## Comandos útiles de Git

Los cambios se realizan en la rama:

```bash
git switch desarrollo
```

Después de completar cada fase:

```bash
git status
git add .
git commit -m "Mensaje de la fase"
git push origin desarrollo
```

Ejemplo:

```bash
git add .
git commit -m "Crear CRUD inicial persistente de platos tipicos"
git push origin desarrollo
```

---

## Estado del proyecto

El proyecto debe quedar listo para demostrar:

- CRUD persistente de platos típicos ecuatorianos
- pruebas con TDD
- mantenimiento correctivo
- mantenimiento adaptativo
- mantenimiento perfectivo
- mantenimiento preventivo
- seguridad con API Key
- logs y trazabilidad
- documentación Swagger
- frontend con Node.js
- GitHub Actions
- documentación final para sustentar el examen