# Contexto del Proyecto

## Proyecto

`Examen/epn-event-manager`

## Tipo

Proyecto NestJS para examen de mantenimiento de software.

## Rama de trabajo

Los cambios se realizan en la rama `desarrollo`.

## Tema funcional

CRUD persistente de platos tipicos ecuatorianos.

## Situacion actual

El proyecto ya existe y es una aplicacion NestJS. En Fase 2 se creo el CRUD inicial persistente de platos tipicos ecuatorianos.

La revision de Fase 1 confirmo que el proyecto ya tenia estructura modular en `src/modules` y configuracion de TypeORM con SQLite mediante `better-sqlite3`. En Fase 2 la configuracion TypeORM quedo apuntando a `db/platos-tipicos.sqlite`.

## Objetivo general

Construir primero un CRUD inicial funcional y persistente de platos tipicos ecuatorianos. Despues se aplicara el examen de mantenimiento sobre ese CRUD.

## Objetivo por etapas

1. Crear primero el CRUD inicial.
2. Luego diagnosticar deuda tecnica.
3. Luego aplicar mantenimiento correctivo, adaptativo, perfectivo y preventivo.
4. Luego agregar pruebas, logs, seguridad, Swagger, GitHub Actions y documentacion final.

## Recurso principal

`PlatoTipico`.

Campos oficiales:

- `id`
- `nombre`
- `descripcion`
- `region`
- `ingredientes`
- `precio`
- `imagenUrl`
- `categoria`

No son campos obligatorios del recurso: `provincia`, `disponible`, `createdAt`, `updatedAt`.

Los timestamps ISO 8601 se usaran solo en logs, metadata adaptativa o auditoria cuando una fase lo solicite.

## Estructura real revisada en Fase 1

- `src`: codigo fuente NestJS.
- `src/app.module.ts`: importa `DatabaseModule`, `EventsModule`, `HealthModule`, `StatsModule` y `PlatosTipicosModule`.
- `src/database`: modulo de base de datos y entidades actuales.
- `src/database/database.module.ts`: configura TypeORM con `better-sqlite3`, base `db/platos-tipicos.sqlite` y `synchronize: true`.
- `src/database/entities`: contiene entidades de eventos existentes y `plato-tipico.entity.ts`.
- `src/modules`: estructura modular existente del proyecto.
- `src/modules/events`: modulo actual para eventos.
- `src/modules/health`: modulo actual de salud.
- `src/modules/stats`: modulo actual de estadisticas de eventos.
- `src/modules/platos-tipicos`: modulo CRUD inicial de platos tipicos ecuatorianos.
- `test`: contiene prueba e2e base `app.e2e-spec.ts`, prueba de persistencia `platos-tipicos.e2e-spec.ts` y configuracion `jest-e2e.json`.
- `db`: contiene `events.sqlite` y `platos-tipicos.sqlite`.
- `README.md`: documentacion principal.
- `PLAN_TDD.md`: plan de pruebas.
- `AGENTS.md`: reglas de Codex.

## Hallazgos de Fase 1

- Si existe estructura `src/modules`; por coherencia, el CRUD debe crearse ahi.
- Existe el modulo `src/modules/platos-tipicos`.
- No existe `src/platos-tipicos` todavia.
- Si existe configuracion TypeORM/SQLite.
- La configuracion actual usa `TypeOrmModule.forRoot` en `src/database/database.module.ts`.
- La base actual configurada es `db/platos-tipicos.sqlite`.
- `AppModule` ya tiene configuracion de base de datos indirecta porque importa `DatabaseModule`.
- El CRUD inicial debe ser persistente, no con arreglos en memoria.

## Ubicacion del CRUD inicial

El CRUD se creo en:

```text
src/modules/platos-tipicos
```

Motivo: el proyecto ya organiza sus funcionalidades en `src/modules` y `AGENTS.md` define esta ruta como obligatoria para el CRUD de platos tipicos ecuatorianos.

La persistencia usa TypeORM con SQLite en `db/platos-tipicos.sqlite`. No se usan arreglos en memoria como almacenamiento principal.

## Endpoints implementados en Fase 2

- `POST /platos-tipicos`
- `GET /platos-tipicos`
- `GET /platos-tipicos/:id`
- `PATCH /platos-tipicos/:id`
- `DELETE /platos-tipicos/:id`

## Validacion de persistencia

Se agrego `test/platos-tipicos.e2e-spec.ts` para crear un plato tipico, cerrar la aplicacion Nest, volver a iniciarla y verificar que `GET /platos-tipicos` conserva el registro desde SQLite.

## Comandos reales identificados

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

Pruebas unitarias:

```bash
npm test
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

## Registro de fases

| Fase | Descripcion | Estado |
| --- | --- | --- |
| Fase 0 | Crear documentacion base y ajustar contexto real del proyecto | Completada |
| Fase 1 | Revisar estructura real del proyecto y decidir ubicacion del CRUD | Completada |
| Fase 2 | Crear CRUD inicial persistente de platos tipicos ecuatorianos | Completada |
| Fase 3 | Probar CRUD inicial y persistencia | Pendiente |
| Fase 4 | Diagnosticar deuda tecnica del CRUD inicial | Pendiente |
| Fase 5 | Aplicar mantenimientos correctivo, adaptativo, perfectivo y preventivo | Pendiente |
| Fase 6 | Agregar pruebas, logs, seguridad, Swagger, GitHub Actions y documentacion final | Pendiente |
