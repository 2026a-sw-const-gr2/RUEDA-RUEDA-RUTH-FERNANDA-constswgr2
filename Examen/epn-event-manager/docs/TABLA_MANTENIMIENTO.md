# Tabla de Mantenimiento

Tabla final para exposicion. El proyecto primero creo un CRUD inicial persistente de platos tipicos ecuatorianos y luego aplico mantenimiento sobre ese CRUD.

| Tipo | Problema inicial | Archivo afectado | Cambio realizado | Justificacion | Impacto |
| --- | --- | --- | --- | --- | --- |
| Correctivo | Existia riesgo de que `DELETE /platos-tipicos/:id` devolviera exito falso o no manejara ids inexistentes de forma controlada. | `src/modules/platos-tipicos/platos-tipicos.service.ts`, `src/modules/platos-tipicos/platos-tipicos.controller.ts`, `test/platos-tipicos.e2e-spec.ts` | Se reforzaron pruebas e2e para confirmar eliminacion real en SQLite, error `404` en id inexistente y ausencia de `{ deleted: true }` cuando no se elimina. | El mantenimiento correctivo busca corregir o confirmar fallos funcionales del sistema. El codigo ya usaba `findOne` y `remove`, por lo que el cambio minimo fue blindar el comportamiento con pruebas. | Mayor confianza en la eliminacion persistente y en el manejo controlado de errores. |
| Adaptativo | El CRUD no generaba metadata para integrarse con EPN Event Manager. | `src/modules/platos-tipicos/platos-tipicos.service.ts`, `src/modules/platos-tipicos/platos-tipicos.module.ts`, `src/modules/events/*`, `test/platos-tipicos.e2e-spec.ts` | Se agrego respuesta `{ data, metadata }`, metadata con `source`, `apiVersion`, `timestampISO`, `timezone`, `environment`, `integrationTarget` y registro interno de eventos. | El mantenimiento adaptativo ajusta el sistema a un nuevo contexto de integracion sin cambiar el modelo principal. | API preparada para integraciones, trazabilidad contextual y respuestas uniformes. |
| Perfectivo | No habia una capacidad de analisis ni una interfaz visual para demostrar el CRUD. | `src/modules/platos-tipicos/platos-tipicos.controller.ts`, `src/modules/platos-tipicos/platos-tipicos.service.ts`, `frontend/src/*`, `test/platos-tipicos.e2e-spec.ts` | Se agrego `GET /platos-tipicos/stats` con totales, precios y agrupaciones. Luego se creo frontend Vite con tarjetas, formulario, detalle, edicion, eliminacion y estadisticas. | El mantenimiento perfectivo agrega valor funcional sin corregir un error critico. | Mejor capacidad de analisis y demostracion visual del sistema para sustentacion. |
| Preventivo | Faltaban validaciones robustas, sanitizacion, seguridad, logs, Swagger, CI y evidencia manual. | `src/modules/platos-tipicos/platos-tipicos.service.ts`, `src/modules/platos-tipicos/api-key.guard.ts`, `src/swagger.ts`, `src/main.ts`, `.github/workflows/node-ci.yml`, `docs/*`, `test/platos-tipicos.e2e-spec.ts` | Se agregaron validaciones, `trim`, bloqueo de `<script>` y patrones SQL, API Key, logs estructurados, Swagger, GitHub Actions y pruebas manuales documentadas. | El mantenimiento preventivo reduce fallos futuros, entradas maliciosas, problemas de integracion y regresiones. | Mayor seguridad, mejor observabilidad, documentacion API, validacion automatica en CI y evidencia reproducible. |

## Evidencia por fase

| Fase | Tipo | Evidencia |
| --- | --- | --- |
| Fase 6 | Correctivo | Pruebas e2e de eliminacion real, id inexistente y persistencia tras reinicio. |
| Fase 7 | Adaptativo | Pruebas e2e de metadata en CREATE, READ, UPDATE y DELETE. |
| Fase 8 | Perfectivo | Prueba e2e de `GET /platos-tipicos/stats`. |
| Fase 9 | Preventivo | Pruebas e2e de campos vacios, URL invalida, precio negativo, textos largos, `<script>` y patrones SQL. |
| Fase 10 | Preventivo | Pruebas e2e de API Key ausente, incorrecta y correcta. |
| Fase 11 | Preventivo | Pruebas e2e de logs `INFO` y `WARN`. |
| Fase 12 | Preventivo | Prueba e2e de Swagger en `/api/docs`. |
| Fase 13 | Perfectivo | Frontend Vite y checklist manual. |
| Fase 14 | Preventivo | GitHub Actions para backend y frontend. |
| Fase 15 | Preventivo | `docs/PRUEBAS_MANUALES_API.md`. |
