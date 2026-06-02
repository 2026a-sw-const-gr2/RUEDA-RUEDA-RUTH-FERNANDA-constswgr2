# Diagnostico de Deuda Tecnica

## Contexto

El diagnostico se realizo despues de crear el CRUD inicial persistente de platos tipicos ecuatorianos. La intencion fue identificar deuda tecnica antes de aplicar mantenimiento.

Proyecto:

```text
Examen/epn-event-manager
```

Backend:

```text
NestJS + TypeORM + SQLite
```

Base de datos:

```text
db/platos-tipicos.sqlite
```

## Resumen

| Area | Antes | Riesgo | Solucion aplicada | Despues |
| --- | --- | --- | --- | --- |
| Pruebas | Solo habia cobertura limitada del CRUD. | Regresiones no detectadas en crear, listar, consultar, actualizar, eliminar y persistencia. | Se ampliaron pruebas e2e en `test/platos-tipicos.e2e-spec.ts`. | CRUD cubierto por pruebas automatizadas y persistencia verificada. |
| Correctivo | Existia riesgo de exito falso en eliminacion o errores no controlados. | El sistema podia reportar exito sin eliminar o no responder correctamente ante ids inexistentes. | Se reforzaron pruebas de `DELETE`, `404` y persistencia tras reinicio. | Eliminacion y errores controlados verificados. |
| Adaptativo | Las respuestas no tenian metadata ni contexto de integracion. | Integraciones futuras tendrian que cambiar contrato o inferir contexto. | Se agrego metadata con `timestampISO`, `timezone`, `apiVersion`, `environment` e `integrationTarget`. | API preparada para EPN Event Manager sin agregar campos al modelo `PlatoTipico`. |
| Perfectivo | No habia estadisticas ni frontend visual. | Menor valor funcional y demostracion limitada. | Se agrego `GET /platos-tipicos/stats` y frontend Vite. | API y frontend permiten analisis y demostracion del CRUD. |
| Preventivo - validaciones | El CRUD podia aceptar datos invalidos, textos vacios o entradas maliciosas. | Datos inconsistentes o peligrosos podian persistirse en SQLite. | Se agregaron validaciones, `trim`, bloqueo de `<script>`, `SELECT`, `DROP`, `INSERT` y `--`. | Entradas invalidas se rechazan con errores controlados. |
| Preventivo - seguridad | Los endpoints estaban abiertos. | Cualquier cliente podia crear, modificar o eliminar platos. | Se agrego `ApiKeyGuard` con `X-FIS-EPN-KEY` y `FIS_EPN_API_KEY`. | CRUD protegido por API Key; `health` queda libre. |
| Preventivo - logs | No habia logs estructurados. | Baja capacidad de diagnostico y trazabilidad. | Se agregaron logs `INFO`, `WARN` y `ERROR` con JSON. | Operaciones, intentos fallidos y validaciones quedan trazables. |
| Preventivo - documentacion API | No habia Swagger. | Integracion y prueba manual mas lenta. | Se configuro Swagger en `/api/docs`. | Endpoints, DTOs, errores y API Key documentados. |
| Preventivo - CI | No habia GitHub Actions. | Errores podian llegar a rama remota sin validacion automatica. | Se creo `.github/workflows/node-ci.yml`. | Push y pull request validan backend y frontend. |
| Evidencia manual | No habia guia manual unificada. | Sustentacion dependia de memoria o pruebas dispersas. | Se creo `docs/PRUEBAS_MANUALES_API.md`. | API puede probarse con pasos reproducibles. |

## Antes

El CRUD inicial persistente funcionaba, pero tenia deuda tecnica esperada para el examen:

- pruebas insuficientes;
- validaciones incompletas;
- ausencia de API Key;
- ausencia de logs estructurados;
- falta de trazabilidad;
- ausencia de metadata adaptativa;
- ausencia de Swagger;
- ausencia de endpoint de estadisticas;
- falta de frontend;
- ausencia de GitHub Actions;
- falta de evidencia manual consolidada.

## Riesgos

- Regresiones funcionales en operaciones CRUD.
- Datos invalidos guardados en SQLite.
- Entradas maliciosas persistidas o mostradas en frontend.
- Acceso no autorizado a endpoints protegidos.
- Dificultad para diagnosticar errores.
- Dificultad para integrar o probar la API.
- Falta de validacion automatica al subir cambios.

## Soluciones

- TDD con pruebas e2e para CRUD, errores, persistencia, metadata, stats, seguridad, validaciones, logs y Swagger.
- Validaciones y sanitizacion en `PlatosTipicosService`.
- Seguridad con `ApiKeyGuard`.
- Metadata adaptativa e integracion con eventos internos.
- Endpoint perfectivo de estadisticas.
- Logs estructurados con `Logger` de NestJS.
- Swagger/OpenAPI en `/api/docs`.
- Frontend Vite para demostracion visual.
- GitHub Actions para backend y frontend.
- Guia manual de pruebas API.

## Despues

El proyecto queda listo para sustentar:

- CRUD persistente en SQLite.
- API protegida con `X-FIS-EPN-KEY`.
- Documentacion Swagger.
- Frontend funcional.
- CI para backend y frontend.
- Evidencia TDD en `PLAN_TDD.md`.
- Evidencia manual en `docs/PRUEBAS_MANUALES_API.md`.
- Tabla de mantenimiento lista en `docs/TABLA_MANTENIMIENTO.md`.
