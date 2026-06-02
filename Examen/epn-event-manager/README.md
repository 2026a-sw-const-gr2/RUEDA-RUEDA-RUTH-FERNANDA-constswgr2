# EPN Event Manager - Examen de Mantenimiento de Software

## Descripcion

Proyecto NestJS para el examen de mantenimiento de software.

El objetivo es construir primero un CRUD inicial persistente de platos tipicos ecuatorianos y luego aplicar sobre ese CRUD actividades de mantenimiento correctivo, adaptativo, perfectivo y preventivo.

## Estado actual

Fase 5 completada: se crearon y ejecutaron pruebas TDD base para el CRUD inicial persistente de platos tipicos ecuatorianos.

El CRUD funciona con NestJS, TypeORM y SQLite. La base de datos se guarda en `db/platos-tipicos.sqlite`, por lo que los platos no se pierden al reiniciar el servidor.

No existe frontend, API Key, Swagger, endpoint de estadisticas ni GitHub Actions en esta fase.

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
│   ├── events.sqlite
│   └── platos-tipicos.sqlite
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
- No existe configuracion de frontend ni GitHub Actions en esta fase.

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
  -d "{\"nombre\":\"Encebollado\",\"descripcion\":\"Plato tradicional de la Costa ecuatoriana.\",\"region\":\"Costa\",\"ingredientes\":\"Pescado, yuca, cebolla, tomate y limon\",\"precio\":3.5,\"imagenUrl\":\"https://example.com/encebollado.jpg\",\"categoria\":\"Sopa tradicional\"}"
```

Listar platos:

```bash
curl http://localhost:3000/platos-tipicos
```

Consultar por id:

```bash
curl http://localhost:3000/platos-tipicos/1
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
  -d "{\"precio\":4,\"categoria\":\"Sopa\"}"
```

Eliminar:

```bash
curl -X DELETE http://localhost:3000/platos-tipicos/1
```

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
curl http://localhost:3000/platos-tipicos
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

Resultado Fase 5:

```text
Test Suites: 2 passed, 2 total
Tests: 10 passed, 10 total
Estado TDD: GREEN
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
| Fase 6 | Mantenimientos correctivo, adaptativo, perfectivo y preventivo | Pendiente |
| Fase 7 | Logs, seguridad, Swagger, GitHub Actions y documentacion final | Pendiente |

## Git

Rama de trabajo:

```bash
desarrollo
```

Despues de cada fase se debe registrar el cambio en la rama `desarrollo`.
