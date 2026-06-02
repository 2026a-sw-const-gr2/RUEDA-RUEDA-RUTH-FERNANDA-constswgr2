# EPN Event Manager - Examen de Mantenimiento de Software

## Descripcion

Proyecto NestJS para sustentar un examen de mantenimiento de software.

El sistema primero construyo un CRUD inicial persistente de platos tipicos ecuatorianos. Despues, sobre ese CRUD base, se aplicaron actividades de diagnostico, TDD y mantenimiento correctivo, adaptativo, perfectivo y preventivo.

## Tema

Recurso principal: `PlatoTipico`.

Campos oficiales:

| Campo | Descripcion |
| --- | --- |
| `id` | Identificador unico |
| `nombre` | Nombre del plato tipico |
| `descripcion` | Descripcion del plato |
| `region` | Region del Ecuador |
| `ingredientes` | Ingredientes principales |
| `precio` | Precio referencial |
| `imagenUrl` | URL de imagen |
| `categoria` | Categoria gastronomica |

No son campos obligatorios del recurso: `provincia`, `disponible`, `createdAt`, `updatedAt`.

## Arquitectura

El backend NestJS es el proyecto principal. No existe carpeta `backend` separada.

```text
epn-event-manager/
├── .github/workflows/node-ci.yml
├── db/
│   └── platos-tipicos.sqlite
├── docs/
│   ├── DIAGNOSTICO_DEUDA_TECNICA.md
│   ├── PRUEBAS_MANUALES_API.md
│   └── TABLA_MANTENIMIENTO.md
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── main.js
│   │   └── styles.css
│   ├── index.html
│   └── package.json
├── src/
│   ├── database/
│   ├── modules/
│   │   ├── events/
│   │   ├── health/
│   │   ├── platos-tipicos/
│   │   └── stats/
│   ├── main.ts
│   └── swagger.ts
├── test/
├── CONTEXTO_PROYECTO.md
├── PLAN_TDD.md
└── README.md
```

Componentes principales:

- Backend: NestJS.
- Persistencia: TypeORM con SQLite.
- Base de datos: `db/platos-tipicos.sqlite`.
- Frontend: Vite con JavaScript simple.
- Seguridad: API Key por cabecera `X-FIS-EPN-KEY`.
- Documentacion API: Swagger en `/api/docs`.
- CI: GitHub Actions con Node.js 20.

## Instalacion

Backend:

```bash
npm install
```

Frontend:

```bash
cd frontend
npm install
```

## Variables de entorno

Existe `.env.example` y no se debe subir `.env` real.

Variable principal:

```text
FIS_EPN_API_KEY=clave-de-prueba
```

En PowerShell:

```powershell
$env:FIS_EPN_API_KEY="clave-de-prueba"; npm run start:dev
```

## Ejecucion

Backend en desarrollo:

```bash
npm run start:dev
```

Backend normal:

```bash
npm run start
```

Backend despues del build:

```bash
npm run start:prod
```

Frontend:

```bash
cd frontend
npm run dev
```

URLs locales:

- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`
- Frontend: `http://localhost:5173`

## Persistencia SQLite

El CRUD no usa arreglos en memoria como almacenamiento principal. Los platos se guardan en:

```text
db/platos-tipicos.sqlite
```

Evidencia de persistencia:

1. Crear un plato con `POST /platos-tipicos`.
2. Detener el backend.
3. Iniciar nuevamente el backend.
4. Consultar `GET /platos-tipicos`.
5. El plato creado sigue disponible.

La guia manual esta en:

```text
docs/PRUEBAS_MANUALES_API.md
```

## API Key

Los endpoints del CRUD requieren:

```text
X-FIS-EPN-KEY
```

Ejemplo:

```bash
curl http://localhost:3000/platos-tipicos \
  -H "X-FIS-EPN-KEY: clave-de-prueba"
```

Sin API Key o con API Key incorrecta, el sistema devuelve `401 Unauthorized`.

## Endpoints

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| `POST` | `/platos-tipicos` | Crear plato tipico |
| `GET` | `/platos-tipicos` | Listar platos tipicos |
| `GET` | `/platos-tipicos/:id` | Consultar plato por id |
| `PATCH` | `/platos-tipicos/:id` | Actualizar plato |
| `DELETE` | `/platos-tipicos/:id` | Eliminar plato |
| `GET` | `/platos-tipicos/stats` | Consultar estadisticas |
| `GET` | `/health` | Verificar salud del backend |

Ejemplo de creacion:

```bash
curl -X POST http://localhost:3000/platos-tipicos \
  -H "Content-Type: application/json" \
  -H "X-FIS-EPN-KEY: clave-de-prueba" \
  -d "{\"nombre\":\"Encebollado\",\"descripcion\":\"Plato tradicional de la Costa ecuatoriana.\",\"region\":\"Costa\",\"ingredientes\":\"Pescado, yuca, cebolla, tomate y limon\",\"precio\":3.5,\"imagenUrl\":\"https://example.com/encebollado.jpg\",\"categoria\":\"Sopa tradicional\"}"
```

## Swagger

Swagger/OpenAPI esta disponible en:

```text
http://localhost:3000/api/docs
```

Documenta:

- endpoints del CRUD;
- endpoint de estadisticas;
- DTOs de creacion y actualizacion;
- errores `400`, `401` y `404`;
- cabecera `X-FIS-EPN-KEY`.

## Pruebas

Backend:

```bash
npm test
npm run test:e2e
npm run build
npm run lint
```

Frontend:

```bash
cd frontend
npm run build
```

Pruebas manuales:

```text
docs/PRUEBAS_MANUALES_API.md
```

Estado final:

- pruebas unitarias backend: pasan;
- pruebas e2e backend: pasan con 24 pruebas;
- build backend: pasa;
- lint backend: pasa;
- build frontend: pasa.

## GitHub Actions

Workflow:

```text
.github/workflows/node-ci.yml
```

Se ejecuta en:

- `push`
- `pull_request`

Usa Node.js 20 y valida:

- `npm ci`;
- `npm run lint`;
- `npm test`;
- `npm run build`;
- `cd frontend && npm ci`;
- `cd frontend && npm run build`.

## Frontend

El frontend esta en:

```text
frontend/
```

Funciones:

- listar platos en tarjetas;
- mostrar imagen, nombre, descripcion, region, ingredientes, precio y categoria;
- crear platos;
- ver detalle;
- editar platos;
- eliminar platos;
- mostrar estadisticas;
- enviar `X-FIS-EPN-KEY`;
- mostrar mensajes de exito y error.

## Tipos de mantenimiento aplicados

| Tipo | Resumen |
| --- | --- |
| Correctivo | Se fortalecio el comportamiento de eliminacion y errores controlados con pruebas e2e. |
| Adaptativo | Se agrego metadata estandarizada e integracion interna con eventos para EPN Event Manager. |
| Perfectivo | Se agrego `GET /platos-tipicos/stats` y frontend visual para demostrar el CRUD. |
| Preventivo | Se agregaron validaciones, sanitizacion, API Key, logs, Swagger y CI. |

La tabla para exposicion esta en:

```text
docs/TABLA_MANTENIMIENTO.md
```

## Evidencia TDD

El flujo aplicado fue:

1. Crear CRUD inicial persistente.
2. Diagnosticar deuda tecnica.
3. Crear o ajustar pruebas.
4. Confirmar RED cuando aplicaba.
5. Implementar el minimo cambio.
6. Confirmar GREEN.
7. Documentar la fase.

Plan y evidencia:

```text
PLAN_TDD.md
```

## Comandos para demo

Terminal 1, backend:

```powershell
$env:FIS_EPN_API_KEY="clave-de-prueba"; npm run start:dev
```

Terminal 2, frontend:

```bash
cd frontend
npm run dev
```

Abrir:

```text
http://localhost:5173
```

Swagger:

```text
http://localhost:3000/api/docs
```

Prueba rapida:

```bash
curl http://localhost:3000/platos-tipicos \
  -H "X-FIS-EPN-KEY: clave-de-prueba"
```

## Fases

| Fase | Descripcion | Estado |
| --- | --- | --- |
| Fase 0 | Documentacion base | Completada |
| Fase 1 | Revision de estructura real | Completada |
| Fase 2 | CRUD inicial persistente | Completada |
| Fase 3 | Prueba de CRUD y persistencia | Completada |
| Fase 4 | Diagnostico de deuda tecnica | Completada |
| Fase 5 | Pruebas TDD base | Completada |
| Fase 6 | Mantenimiento correctivo | Completada |
| Fase 7 | Mantenimiento adaptativo | Completada |
| Fase 8 | Mantenimiento perfectivo | Completada |
| Fase 9 | Mantenimiento preventivo | Completada |
| Fase 10 | Seguridad por API Key | Completada |
| Fase 11 | Logs y trazabilidad | Completada |
| Fase 12 | Swagger / OpenAPI | Completada |
| Fase 13 | Frontend Node.js | Completada |
| Fase 14 | GitHub Actions | Completada |
| Fase 15 | Pruebas manuales API | Completada |
| Fase 16 | Documentacion final | Completada |
