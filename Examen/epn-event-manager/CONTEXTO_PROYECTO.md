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

El proyecto ya existe y es una aplicacion NestJS. En Fase 2 se creo el CRUD inicial persistente de platos tipicos ecuatorianos y en Fase 3 se probo su funcionamiento con el backend real.

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

## Frontend

El frontend fue creado con Node.js usando Vite y JavaScript.

Ubicación:

frontend/

Objetivo:

Crear un hub visual para platos típicos ecuatorianos que permita:

- listar platos típicos
- mostrar tarjetas con imagen, nombre, descripción, región, ingredientes, precio y categoría
- crear platos típicos
- ver detalle
- editar
- eliminar
- visualizar estadísticas
- consumir la API protegida con X-FIS-EPN-KEY
- manejar errores cuando el backend no responde

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
- `frontend`: interfaz web con Vite y JavaScript simple.
- `frontend/src/api.js`: cliente HTTP que envia `X-FIS-EPN-KEY`.
- `frontend/src/main.js`: renderizado de tarjetas, formulario, detalle y estadisticas.
- `frontend/src/styles.css`: estilos de la interfaz.
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

En Fase 3 tambien se ejecuto una prueba funcional manual contra `http://localhost:3000`:

- `POST /platos-tipicos` creo un plato de prueba.
- `GET /platos-tipicos` listo los platos guardados.
- `GET /platos-tipicos/:id` consulto el plato creado.
- `PATCH /platos-tipicos/:id` actualizo precio y categoria.
- `DELETE /platos-tipicos/:id` elimino el plato usado para CRUD basico.
- Se creo un segundo plato para persistencia.
- Se reinicio el backend.
- `GET /platos-tipicos` confirmo que el segundo plato seguia existiendo en `db/platos-tipicos.sqlite`.

Resultado: el proyecto base persistente esta listo para iniciar el diagnostico de deuda tecnica y las fases de mantenimiento.

## Diagnostico de deuda tecnica Fase 4

En Fase 4 se diagnostico el CRUD inicial persistente sin modificar su comportamiento. Se identificaron deudas en:

- pruebas insuficientes para todos los endpoints y errores;
- validaciones robustas pendientes en DTOs;
- ausencia de API Key;
- ausencia de logs estructurados;
- ausencia de trazabilidad;
- ausencia de metadata adaptativa;
- ausencia de Swagger;
- ausencia de endpoint de estadisticas;
- falta de sanitizacion de textos;
- manejo de errores incompleto;
- riesgos con textos maliciosos;
- riesgos con precio negativo, campos vacios o campos con solo espacios.

Documentos creados:

- `docs/DIAGNOSTICO_DEUDA_TECNICA.md`
- `docs/TABLA_MANTENIMIENTO.md`

## Pruebas TDD base Fase 5

En Fase 5 se ampliaron las pruebas e2e del CRUD inicial persistente en `test/platos-tipicos.e2e-spec.ts`.

Pruebas agregadas o confirmadas:

- Crear plato tipico.
- Listar platos tipicos.
- Consultar plato tipico existente.
- Consultar plato tipico inexistente.
- Actualizar plato tipico existente.
- Actualizar plato tipico inexistente.
- Eliminar plato tipico existente.
- Eliminar plato tipico inexistente.
- Verificar persistencia en SQLite despues de reiniciar la aplicacion Nest.

Resultado de ejecucion:

- `npm run test:e2e`: 2 suites pasaron, 10 pruebas pasaron.
- `npm test`: 1 suite paso, 1 prueba paso.
- Estado TDD de Fase 5: GREEN.

No fue necesario modificar logica del CRUD para que las pruebas pasen.

## Mantenimiento correctivo Fase 6

En Fase 6 se reviso el comportamiento funcional de `DELETE /platos-tipicos/:id`.

Antes:

- Existia deuda documentada sobre posible exito falso al eliminar.
- Faltaba una prueba que confirmara que la eliminacion persistia despues de reiniciar la aplicacion.
- Faltaba una prueba explicita para confirmar que eliminar un id inexistente no devuelve exito.

Despues:

- Se agrego prueba e2e para confirmar que un plato eliminado sigue inexistente despues de reiniciar la aplicacion Nest.
- Se reforzo la prueba de eliminacion inexistente para confirmar 404 y ausencia de `{ deleted: true }`.
- Las pruebas quedaron en GREEN.

Justificacion:

- El codigo actual ya usaba `findOne` y `remove` de TypeORM, por lo que el fallo no se reprodujo.
- No fue necesario modificar logica del CRUD; la intervencion correctiva fue fortalecer pruebas automatizadas.

Impacto:

- `DELETE` queda verificado contra SQLite.
- El sistema no retorna exito si la eliminacion no se realiza.
- Las pruebas del CRUD se mantienen pasando.

## Mantenimiento adaptativo Fase 7

En Fase 7 se adapto el CRUD para integrarse con el hub de eventos EPN Event Manager.

Antes:

- Las respuestas devolvian directamente entidades o arreglos de `PlatoTipico`.
- No existia metadata estandarizada para integracion.
- El CRUD de platos tipicos no estaba conectado al modulo `events`.

Despues:

- Las operaciones CREATE, UPDATE, DELETE y QUERY devuelven `{ data, metadata }`.
- La metadata incluye `source`, `system`, `apiVersion`, `timestampISO`, `timezone`, `environment` e `integrationTarget`.
- `timestampISO` se genera con `new Date().toISOString()`.
- `environment` se obtiene desde `process.env.NODE_ENV` y usa `development` como valor por defecto.
- `PlatosTipicosModule` importa `EventsModule`.
- `PlatosTipicosService` integra `EventsService.registerEvent` para registrar operaciones internas.

Justificacion:

- El cambio adapta el CRUD a un contrato util para integracion sin agregar campos al modelo principal `PlatoTipico`.
- Los campos oficiales del plato siguen siendo `id`, `nombre`, `descripcion`, `region`, `ingredientes`, `precio`, `imagenUrl` y `categoria`.

Impacto:

- El CRUD queda preparado para integracion con EPN Event Manager.
- Las respuestas tienen contexto operativo uniforme.
- Las pruebas validan metadata en CREATE, UPDATE, DELETE y QUERY.
- Estado TDD Fase 7: RED confirmado al fallar por ausencia de metadata; GREEN confirmado despues de implementar.

## Mantenimiento perfectivo Fase 8

En Fase 8 se agrego una mejora funcional al CRUD: `GET /platos-tipicos/stats`.

Antes:

- No existia un endpoint para analizar los platos registrados.
- La informacion de total, precios y agrupaciones debia calcularse fuera de la API.

Despues:

- `GET /platos-tipicos/stats` devuelve `totalPlatos`, `precioPromedio`, `precioMinimo`, `precioMaximo`, `platosPorRegion`, `platosPorCategoria` y `generatedAt`.
- `generatedAt` usa formato ISO 8601.
- La respuesta conserva el wrapper adaptativo `{ data, metadata }`.
- No se calculan `platosDisponibles` ni `platosNoDisponibles`, porque `PlatoTipico` no tiene campo `disponible`.

Justificacion:

- Es mantenimiento perfectivo porque agrega una capacidad de analisis sin corregir un error critico.

Impacto:

- El CRUD ofrece informacion agregada util para reportes y consultas.
- Las pruebas validan que el endpoint calcula estadisticas desde SQLite.
- Estado TDD Fase 8: RED confirmado por ausencia del endpoint; GREEN confirmado despues de implementar.

## Mantenimiento preventivo Fase 9

En Fase 9 se agregaron validaciones y sanitizacion para prevenir datos invalidos y entradas maliciosas.

Antes:

- Se aceptaban textos con solo espacios.
- Se aceptaban URLs invalidas.
- Se aceptaban textos con `<script>`.
- Se aceptaban patrones SQL textuales como `SELECT`, `DROP`, `INSERT` y `--`.
- Se aceptaban textos demasiado largos.
- Los textos no se guardaban con `trim`.

Despues:

- `nombre` es obligatorio y maximo 100 caracteres.
- `descripcion` es obligatoria y maximo 500 caracteres.
- `region` es obligatoria.
- `ingredientes` es obligatorio.
- `precio` debe ser mayor o igual a 0.
- `imagenUrl` debe ser una URL valida `http` o `https`.
- `categoria` es obligatoria y maximo 80 caracteres.
- Se aplica `trim` a textos.
- Se bloquean `<script>`, `SELECT`, `DROP`, `INSERT` y `--`.

Justificacion:

- Es mantenimiento preventivo porque reduce la probabilidad de fallos futuros, datos inconsistentes y riesgos por entradas maliciosas.

Impacto:

- El CRUD rechaza datos invalidos antes de persistirlos en SQLite.
- Las pruebas preventivas quedan automatizadas.
- Estado TDD Fase 9: RED confirmado por fallos de validacion; GREEN confirmado despues de implementar.

## Seguridad por API Key Fase 10

En Fase 10 se agrego seguridad por API Key para proteger los endpoints del CRUD.

Antes:

- Los endpoints de `platos-tipicos` estaban abiertos.
- No se validaba la cabecera `X-FIS-EPN-KEY`.
- No existia `.env.example`.

Despues:

- Se creo `.env.example` con `FIS_EPN_API_KEY`.
- Se agrego `ApiKeyGuard` en `src/modules/platos-tipicos/api-key.guard.ts`.
- `PlatosTipicosController` usa `@UseGuards(ApiKeyGuard)`.
- Los endpoints del CRUD devuelven 401 si falta la cabecera o si la clave es incorrecta.
- Los endpoints del CRUD funcionan con `X-FIS-EPN-KEY` correcta.
- `GET /health` queda permitido sin API Key.
- No se creo ni se subio `.env` real.

Justificacion:

- El cambio protege operaciones de creacion, consulta, actualizacion y eliminacion sin bloquear health checks.

Impacto:

- El CRUD queda protegido por una clave configurable desde entorno.
- Las pruebas de seguridad quedan automatizadas.
- Estado TDD Fase 10: RED confirmado por acceso sin clave; GREEN confirmado despues de implementar.

## Logs y trazabilidad Fase 11

En Fase 11 se agregaron logs estructurados para observar el comportamiento del CRUD.

Antes:

- Las operaciones del CRUD no generaban logs estructurados.
- Los errores de API Key y validacion no quedaban registrados.
- No habia trazabilidad por accion, ruta o id del plato.

Despues:

- `PlatosTipicosService` registra `CREATE`, `QUERY`, `UPDATE` y `DELETE`.
- `ApiKeyGuard` registra intentos fallidos de API Key.
- Las validaciones registran logs `WARN`.
- Los errores no controlados se registran con nivel `ERROR`.
- Cada log incluye `level`, `timestampISO`, `route`, `action`, `platoId` cuando aplica y `message`.
- Se agregaron pruebas e2e para validar logs principales.

Justificacion:

- El cambio mejora la observabilidad del CRUD sin agregar dependencias pesadas.

Impacto:

- El proyecto permite evidenciar trazabilidad desde consola con `npm run start:dev`.
- Las pruebas del backend se mantienen en GREEN.
- Estado TDD Fase 11: GREEN.

## Swagger / OpenAPI Fase 12

En Fase 12 se documento la API usando Swagger/OpenAPI.

Antes:

- No existia documentacion interactiva de endpoints.
- Los DTOs no tenian metadata para OpenAPI.
- La cabecera `X-FIS-EPN-KEY` no estaba documentada en Swagger.

Despues:

- Se agrego `src/swagger.ts`.
- `main.ts` configura Swagger al iniciar la aplicacion.
- La documentacion queda disponible en `/api/docs`.
- `CreatePlatoTipicoDto` y `UpdatePlatoTipicoDto` tienen decoradores Swagger.
- `PlatosTipicosController` documenta endpoints, parametros, body, errores y API Key.
- Se agrego prueba e2e para confirmar disponibilidad de `/api/docs`.

Justificacion:

- El cambio facilita probar e integrar la API sin modificar la logica del CRUD.

Impacto:

- La API queda documentada con OpenAPI.
- La cabecera `X-FIS-EPN-KEY` queda visible para consumo seguro.
- Las pruebas del backend se mantienen en GREEN con 24 pruebas e2e.
- Estado TDD Fase 12: GREEN.

## Frontend con Node.js Fase 13

En Fase 13 se creo una interfaz web para demostrar el CRUD de platos tipicos ecuatorianos.

Antes:

- No existia frontend.
- El CRUD solo se podia probar con curl, Swagger o pruebas automatizadas.

Despues:

- Se creo `frontend/` con Vite y JavaScript simple.
- Se creo `frontend/package.json` con scripts `dev`, `build` y `preview`.
- Se creo `frontend/src/api.js` para consumir el backend y enviar `X-FIS-EPN-KEY`.
- Se creo una interfaz con formulario de creacion/edicion, tarjetas, detalle, eliminacion y estadisticas.
- Se habilito CORS en `src/main.ts` para permitir consumo desde Vite.
- Se documenta validacion manual en `PLAN_TDD.md`.

Justificacion:

- El cambio agrega un hub visual para demostrar el CRUD sin usar librerias pesadas.

Impacto:

- El CRUD puede probarse desde navegador en `http://localhost:5173`.
- El frontend muestra mensajes de exito y error.
- El backend se mantiene en GREEN con 24 pruebas e2e.
- El build del frontend pasa correctamente.
- Estado Fase 13: GREEN.

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

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run build
```

## Registro de fases

| Fase | Descripcion | Estado |
| --- | --- | --- |
| Fase 0 | Crear documentacion base y ajustar contexto real del proyecto | Completada |
| Fase 1 | Revisar estructura real del proyecto y decidir ubicacion del CRUD | Completada |
| Fase 2 | Crear CRUD inicial persistente de platos tipicos ecuatorianos | Completada |
| Fase 3 | Probar CRUD inicial y persistencia | Completada |
| Fase 4 | Diagnosticar deuda tecnica del CRUD inicial | Completada |
| Fase 5 | Crear pruebas TDD base del CRUD inicial | Completada |
| Fase 6 | Aplicar mantenimiento correctivo | Completada |
| Fase 7 | Aplicar mantenimiento adaptativo | Completada |
| Fase 8 | Aplicar mantenimiento perfectivo | Completada |
| Fase 9 | Aplicar mantenimiento preventivo | Completada |
| Fase 10 | Agregar seguridad por API Key | Completada |
| Fase 11 | Agregar logs y trazabilidad | Completada |
| Fase 12 | Agregar Swagger / OpenAPI | Completada |
| Fase 13 | Agregar frontend con Node.js y Vite | Completada |
| Fase 14 | Agregar GitHub Actions y documentacion final | Pendiente |
