# EPN Event Manager - Examen de Mantenimiento de Software

## Descripcion

Proyecto NestJS para el examen de mantenimiento de software.

El objetivo es construir primero un CRUD inicial persistente de platos tipicos ecuatorianos y luego aplicar sobre ese CRUD actividades de mantenimiento correctivo, adaptativo, perfectivo y preventivo.

## Estado actual

Fase 1 completada: se reviso la estructura real del proyecto.

Todavia no existe el CRUD inicial de platos tipicos ecuatorianos. No existe frontend y no existe GitHub Actions en esta fase.

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

## Estructura real del proyecto

```text
epn-event-manager/
├── db/
│   └── events.sqlite
├── src/
│   ├── database/
│   │   ├── database.module.ts
│   │   └── entities/
│   ├── modules/
│   │   ├── events/
│   │   ├── health/
│   │   └── stats/
│   ├── app.controller.ts
│   ├── app.controller.spec.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts
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
- `AppModule` importa `DatabaseModule`, `EventsModule`, `HealthModule` y `StatsModule`.
- `DatabaseModule` configura TypeORM con `better-sqlite3`.
- La base actual configurada es `db/events.sqlite`.
- Existe carpeta `db` para persistencia.
- Existen pruebas Jest unitarias en `src` y e2e en `test`.
- No existe todavia `src/modules/platos-tipicos`.
- No existe configuracion de frontend ni GitHub Actions en esta fase.

## Ubicacion del CRUD inicial

El CRUD inicial de platos tipicos ecuatorianos se creara en:

```text
src/modules/platos-tipicos
```

Se usa esta ubicacion porque el proyecto ya organiza los modulos dentro de `src/modules` y `AGENTS.md` define esa ruta para el CRUD.

La persistencia debera usar SQLite dentro de `db/`, aprovechando la configuracion TypeORM existente.

## Endpoints esperados

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| `POST` | `/platos-tipicos` | Crear un plato tipico |
| `GET` | `/platos-tipicos` | Listar platos tipicos |
| `GET` | `/platos-tipicos/:id` | Consultar un plato tipico por ID |
| `PATCH` | `/platos-tipicos/:id` | Actualizar un plato tipico |
| `DELETE` | `/platos-tipicos/:id` | Eliminar un plato tipico |

Estos endpoints aun no estan implementados.

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
| Fase 2 | Crear CRUD inicial persistente | Pendiente |
| Fase 3 | Probar CRUD inicial y persistencia | Pendiente |
| Fase 4 | Diagnostico de deuda tecnica | Pendiente |
| Fase 5 | Mantenimientos correctivo, adaptativo, perfectivo y preventivo | Pendiente |
| Fase 6 | Pruebas, logs, seguridad, Swagger, GitHub Actions y documentacion final | Pendiente |

## Git

Rama de trabajo:

```bash
desarrollo
```

Despues de cada fase se debe registrar el cambio en la rama `desarrollo`.
