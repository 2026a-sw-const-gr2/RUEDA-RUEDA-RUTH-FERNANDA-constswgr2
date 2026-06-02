# EPN Event Manager - Examen de Mantenimiento de Software

## Descripcion

Proyecto NestJS para el examen de mantenimiento de software.

El objetivo es construir primero un CRUD inicial persistente de platos tipicos ecuatorianos y luego aplicar sobre ese CRUD actividades de mantenimiento correctivo, adaptativo, perfectivo y preventivo.

## Estado actual

Fase 15 completada: se creo evidencia de pruebas manuales para la API.

El CRUD funciona con NestJS, TypeORM y SQLite. La base de datos se guarda en `db/platos-tipicos.sqlite`, por lo que los platos no se pierden al reiniciar el servidor.

## GitHub Actions

La integracion continua esta configurada en:

```text
.github/workflows/node-ci.yml
```

Se ejecuta en:

- `push`
- `pull_request`

Usa Node.js 20 y valida:

- backend NestJS con `npm ci`;
- lint del backend con `npm run lint`;
- pruebas del backend con `npm test`;
- build del backend con `npm run build`;
- frontend Vite con `npm ci`;
- build del frontend con `npm run build`.

El workflow usa como directorio de trabajo principal:

```text
Examen/epn-event-manager
```

No ejecuta pruebas de frontend porque el frontend no tiene script de pruebas configurado.

No ejecuta scripts inventados.

## Frontend

El hub visual esta en:

```text
frontend/
```

Usa Vite con JavaScript simple. Permite listar platos tipicos en tarjetas, crear, ver detalle, editar, eliminar y consultar estadisticas.

El frontend consume el backend NestJS y envia la cabecera:

```text
X-FIS-EPN-KEY
```

Comandos del frontend:

```bash
cd frontend
npm install
npm run dev
npm run build
```

URL local de Vite:

```text
http://localhost:5173
```

Antes de usar la interfaz, ejecutar el backend en otra terminal:

```bash
npm run start:dev
```

El backend tiene CORS habilitado para permitir el consumo desde el frontend.

## Swagger / OpenAPI

La documentacion interactiva de la API esta disponible en:

```text
http://localhost:3000/api/docs
```

Swagger documenta:

- Endpoints del CRUD de platos tipicos.
- Endpoint `GET /platos-tipicos/stats`.
- DTOs de creacion y actualizacion.
- Respuestas de error `400`, `401` y `404`.
- Cabecera de seguridad `X-FIS-EPN-KEY`.

Para probar endpoints protegidos desde Swagger, usar la autorizacion `X-FIS-EPN-KEY` con el valor configurado en `FIS_EPN_API_KEY`.

## Seguridad por API Key

Los endpoints del CRUD de platos tipicos requieren la cabecera:

```text
X-FIS-EPN-KEY
```

La clave se lee desde la variable de entorno:

```text
FIS_EPN_API_KEY
```

Existe un archivo de ejemplo que si se puede versionar:

```text
.env.example
```

No se debe subir `.env` real.

Ejemplo:

```bash
curl http://localhost:3000/platos-tipicos \
  -H "X-FIS-EPN-KEY: clave-de-prueba"
```

Sin API Key o con una API Key incorrecta, el CRUD responde `401 Unauthorized`.

El endpoint `GET /health` queda libre para verificacion basica del servicio.

## Pruebas manuales de API

La evidencia manual para probar la API esta en:

```text
docs/PRUEBAS_MANUALES_API.md
```

Incluye pruebas con `curl` para:

- crear plato tipico;
- listar platos;
- consultar por id;
- actualizar;
- eliminar;
- consultar estadisticas;
- usar API Key correcta;
- usar API Key incorrecta;
- enviar datos invalidos;
- enviar script malicioso;
- enviar precio negativo;
- verificar persistencia en SQLite despues de reiniciar.

Todas las pruebas protegidas documentan la cabecera:

```text
X-FIS-EPN-KEY
```

## Logs y trazabilidad

El CRUD registra logs estructurados usando `Logger` de NestJS.

Cada log usa formato JSON e incluye:

- `level`: `INFO`, `WARN` o `ERROR`.
- `timestampISO`: fecha en formato ISO 8601.
- `route`: ruta relacionada.
- `action`: `CREATE`, `READ`, `UPDATE`, `DELETE`, `VALIDATION` o `API_KEY_VALIDATION`.
- `platoId`: id del plato cuando aplica.
- `message`: descripcion corta del evento.

Se registran:

- Operaciones exitosas del CRUD con nivel `INFO`.
- Intentos fallidos, ids inexistentes, validaciones y API Key invalida con nivel `WARN`.
- Errores no controlados con nivel `ERROR`.

Para evidenciar la trazabilidad, ejecutar el backend y realizar operaciones con `curl`. Los logs aparecen en consola:

```bash
npm run start:dev
```

Ejemplo de log:

```json
{"level":"INFO","timestampISO":"2026-06-02T01:50:00.000Z","route":"/platos-tipicos","action":"CREATE","platoId":1,"message":"Operacion CREATE ejecutada"}
```

## Recurso principal

`PlatoTipico`.

Campos oficiales:

| Campo | Descripcion |
| --- | --- |
| `id` | Identificador unico del plato tipico |
| `nombre` | Nombre del plato tipico |
| `descripcion` | Descripcion del plato |
| `region` | Region del Ecuador a la que pertenece |
| `ingredientes` | Ingredientes principales |
| `precio` | Precio referencial |
| `imagenUrl` | URL de imagen del plato |
| `categoria` | Categoria gastronomica |

No se deben agregar como campos obligatorios del recurso: `provincia`, `disponible`, `createdAt`, `updatedAt`.

Los timestamps ISO 8601 se usaran solo en logs, metadata adaptativa o auditoria cuando una fase lo solicite.

## Validaciones preventivas

El CRUD valida y sanitiza datos antes de guardar:

- `nombre`: obligatorio, maximo 100 caracteres.
- `descripcion`: obligatoria, maximo 500 caracteres.
- `region`: obligatoria.
- `ingredientes`: obligatorio.
- `precio`: mayor o igual a 0.
- `imagenUrl`: URL valida con protocolo `http` o `https`.
- `categoria`: obligatoria, maximo 80 caracteres.
- Se aplica `trim` a textos.
- Se rechazan cadenas vacias o con solo espacios.
- Se bloquea `<script>`.
- Se bloquean `SELECT`, `DROP`, `INSERT` y comentarios SQL `--`.
- Se rechazan textos demasiado largos.

## Metadata adaptativa

Las respuestas de `POST`, `GET`, `PATCH` y `DELETE` usan esta estructura:

```json
{
  "data": {},
  "metadata": {
    "source": "platos-tipicos-crud",
    "system": "Sistema de Platos Típicos Ecuatorianos",
    "apiVersion": "v1",
    "timestampISO": "2026-06-02T01:40:00.000Z",
    "timezone": "America/Guayaquil",
    "environment": "development",
    "integrationTarget": "EPN Event Manager"
  }
}
```

La metadata no forma parte del modelo `PlatoTipico`; el plato se mantiene dentro de `data`.

## Estructura real del proyecto

```text
epn-event-manager/
├── db/
│   ├── events.sqlite
│   └── platos-tipicos.sqlite
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── main.js
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── package-lock.json
├── src/
│   ├── database/
│   │   ├── database.module.ts
│   │   └── entities/
│   ├── modules/
│   │   ├── events/
│   │   ├── health/
│   │   ├── platos-tipicos/
│   │   └── stats/
│   ├── app.controller.ts
│   ├── app.controller.spec.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts
│   ├── platos-tipicos.e2e-spec.ts
│   └── jest-e2e.json
├── AGENTS.md
├── CONTEXTO_PROYECTO.md
├── PLAN_TDD.md
├── README.md
├── package.json
└── package-lock.json
```

## Hallazgos tecnicos

- El proyecto ya usa estructura `src/modules`.
- `AppModule` importa `DatabaseModule`, `EventsModule`, `HealthModule`, `StatsModule` y `PlatosTipicosModule`.
- `DatabaseModule` configura TypeORM con `better-sqlite3`.
- La base actual configurada para TypeORM es `db/platos-tipicos.sqlite`.
- Existe carpeta `db` para persistencia.
- Existen pruebas Jest unitarias en `src` y e2e en `test`.
- Existe `src/modules/platos-tipicos` con controller, service y DTOs.
- Existe frontend Vite en `frontend`.
- Existe integracion continua en `.github/workflows/node-ci.yml`.

## Ubicacion del CRUD inicial

El CRUD inicial de platos tipicos ecuatorianos esta creado en:

```text
src/modules/platos-tipicos
```

Se usa esta ubicacion porque el proyecto ya organiza los modulos dentro de `src/modules` y `AGENTS.md` define esa ruta para el CRUD.

La persistencia usa SQLite dentro de `db/platos-tipicos.sqlite`, aprovechando la configuracion TypeORM existente.

## Endpoints iniciales

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| `POST` | `/platos-tipicos` | Crear un plato tipico |
| `GET` | `/platos-tipicos` | Listar platos tipicos |
| `GET` | `/platos-tipicos/:id` | Consultar un plato tipico por ID |
| `PATCH` | `/platos-tipicos/:id` | Actualizar un plato tipico |
| `DELETE` | `/platos-tipicos/:id` | Eliminar un plato tipico |
| `GET` | `/platos-tipicos/stats` | Consultar estadisticas del CRUD |

Ejemplo de creacion:

```json
{
  "nombre": "Encebollado",
  "descripcion": "Plato tradicional de la Costa ecuatoriana preparado con pescado y yuca.",
  "region": "Costa",
  "ingredientes": "Pescado, yuca, cebolla, tomate, cilantro y limon",
  "precio": 3.5,
  "imagenUrl": "https://example.com/encebollado.jpg",
  "categoria": "Sopa tradicional"
}
```

```bash
curl -X POST http://localhost:3000/platos-tipicos \
  -H "Content-Type: application/json" \
  -H "X-FIS-EPN-KEY: clave-de-prueba" \
  -d "{\"nombre\":\"Encebollado\",\"descripcion\":\"Plato tradicional de la Costa ecuatoriana.\",\"region\":\"Costa\",\"ingredientes\":\"Pescado, yuca, cebolla, tomate y limon\",\"precio\":3.5,\"imagenUrl\":\"https://example.com/encebollado.jpg\",\"categoria\":\"Sopa tradicional\"}"
```

Respuesta esperada:

```json
{
  "data": {
    "id": 1,
    "nombre": "Encebollado",
    "descripcion": "Plato tradicional de la Costa ecuatoriana.",
    "region": "Costa",
    "ingredientes": "Pescado, yuca, cebolla, tomate y limon",
    "precio": 3.5,
    "imagenUrl": "https://example.com/encebollado.jpg",
    "categoria": "Sopa tradicional"
  },
  "metadata": {
    "source": "platos-tipicos-crud",
    "system": "Sistema de Platos Típicos Ecuatorianos",
    "apiVersion": "v1",
    "timestampISO": "2026-06-02T01:40:00.000Z",
    "timezone": "America/Guayaquil",
    "environment": "development",
    "integrationTarget": "EPN Event Manager"
  }
}
```

Listar platos:

```bash
curl http://localhost:3000/platos-tipicos \
  -H "X-FIS-EPN-KEY: clave-de-prueba"
```

Consultar por id:

```bash
curl http://localhost:3000/platos-tipicos/1 \
  -H "X-FIS-EPN-KEY: clave-de-prueba"
```

Actualizar parcialmente:

```json
{
  "precio": 4,
  "categoria": "Sopa"
}
```

```bash
curl -X PATCH http://localhost:3000/platos-tipicos/1 \
  -H "Content-Type: application/json" \
  -H "X-FIS-EPN-KEY: clave-de-prueba" \
  -d "{\"precio\":4,\"categoria\":\"Sopa\"}"
```

Eliminar:

```bash
curl -X DELETE http://localhost:3000/platos-tipicos/1 \
  -H "X-FIS-EPN-KEY: clave-de-prueba"
```

## Endpoint de estadisticas

El mantenimiento perfectivo de Fase 8 agrega:

```bash
curl http://localhost:3000/platos-tipicos/stats \
  -H "X-FIS-EPN-KEY: clave-de-prueba"
```

Respuesta esperada:

```json
{
  "data": {
    "totalPlatos": 2,
    "precioPromedio": 4.625,
    "precioMinimo": 3.5,
    "precioMaximo": 5.75,
    "platosPorRegion": {
      "Costa": 1,
      "Sierra": 1
    },
    "platosPorCategoria": {
      "Sopa tradicional": 1,
      "Sopa andina": 1
    },
    "generatedAt": "2026-06-02T01:45:00.000Z"
  },
  "metadata": {
    "source": "platos-tipicos-crud",
    "system": "Sistema de Platos Típicos Ecuatorianos",
    "apiVersion": "v1",
    "timestampISO": "2026-06-02T01:45:00.000Z",
    "timezone": "America/Guayaquil",
    "environment": "development",
    "integrationTarget": "EPN Event Manager"
  }
}
```

No se calculan `platosDisponibles` ni `platosNoDisponibles`, porque `PlatoTipico` no tiene campo `disponible`.

## Como probar persistencia

1. Ejecutar el backend:

```bash
npm run start:dev
```

2. Crear un plato con `POST /platos-tipicos`.
3. Detener el servidor.
4. Volver a ejecutar el backend con `npm run start:dev`.
5. Consultar:

```bash
curl http://localhost:3000/platos-tipicos \
  -H "X-FIS-EPN-KEY: clave-de-prueba"
```

El plato creado debe seguir apareciendo porque se guarda en `db/platos-tipicos.sqlite`.

Resultado de Fase 3: se creo un plato, se reinicio el backend y `GET /platos-tipicos` confirmo que el registro seguia existiendo en SQLite.

## Comandos reales

Instalacion:

```bash
npm install
```

Ejecucion en desarrollo:

```bash
npm run start:dev
```

Ejecucion normal:

```bash
npm run start
```

Ejecucion en produccion despues del build:

```bash
npm run start:prod
```

Pruebas unitarias:

```bash
npm test
```

Pruebas en modo watch:

```bash
npm run test:watch
```

Pruebas e2e:

```bash
npm run test:e2e
```

Resultado Fase 12:

```text
Test Suites: 2 passed, 2 total
Tests: 24 passed, 24 total
Estado TDD: GREEN
```

Resultado Fase 13:

```text
Frontend build: npm run build paso correctamente dentro de frontend
Backend unit: 1 passed
Backend e2e: 24 passed
Estado: GREEN
```

Resultado Fase 14:

```text
Backend npm ci: paso
Backend lint: paso
Backend test: 1 passed
Backend build: paso
Frontend npm ci: paso
Frontend build: paso
Estado CI: configurado
```

Resultado Fase 15:

```text
Evidencia manual creada en docs/PRUEBAS_MANUALES_API.md
Incluye X-FIS-EPN-KEY y escenarios CRUD, seguridad, validacion y persistencia
```

Cobertura:

```bash
npm run test:cov
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Formato:

```bash
npm run format
```

## TDD

Los mantenimientos del examen se realizaran con TDD:

1. RED: crear una prueba que falle.
2. GREEN: implementar el codigo minimo para que pase.
3. REFACTOR: mejorar sin cambiar el comportamiento.

El plan de pruebas se mantiene en `PLAN_TDD.md`.

## Fases del proyecto

| Fase | Descripcion | Estado |
| --- | --- | --- |
| Fase 0 | Documentacion base y contexto real | Completada |
| Fase 1 | Revision de estructura real | Completada |
| Fase 2 | Crear CRUD inicial persistente | Completada |
| Fase 3 | Probar CRUD inicial y persistencia | Completada |
| Fase 4 | Diagnostico de deuda tecnica | Completada |
| Fase 5 | Crear pruebas TDD base del CRUD inicial | Completada |
| Fase 6 | Mantenimiento correctivo | Completada |
| Fase 7 | Mantenimiento adaptativo | Completada |
| Fase 8 | Mantenimiento perfectivo | Completada |
| Fase 9 | Mantenimiento preventivo | Completada |
| Fase 10 | Seguridad por API Key | Completada |
| Fase 11 | Logs y trazabilidad | Completada |
| Fase 12 | Swagger / OpenAPI | Completada |
| Fase 13 | Frontend con Node.js y Vite | Completada |
| Fase 14 | GitHub Actions para backend y frontend | Completada |
| Fase 15 | Coleccion o pruebas manuales de API | Completada |
| Fase 16 | Documentacion final | Pendiente |

## Git

Rama de trabajo:

```bash
desarrollo
```

Despues de cada fase se debe registrar el cambio en la rama `desarrollo`.
