# Tabla de Mantenimiento

## Contexto

Clasificacion inicial de deuda tecnica detectada en el CRUD persistente de platos tipicos ecuatorianos. Esta tabla guia las siguientes fases del examen.

| Tipo de mantenimiento | Problema detectado | Archivo afectado | Intervencion propuesta | Impacto esperado |
| --- | --- | --- | --- | --- |
| Correctivo | El manejo de errores esta incompleto y no hay pruebas suficientes para casos como id inexistente, payload invalido o errores de eliminacion. | `src/modules/platos-tipicos/platos-tipicos.service.ts`, `src/modules/platos-tipicos/platos-tipicos.controller.ts`, `test/platos-tipicos.e2e-spec.ts` | Crear pruebas RED para errores 400 y 404, corregir respuestas inconsistentes y asegurar que las operaciones fallidas no devuelvan exito. | Mayor confiabilidad del CRUD y menor riesgo de respuestas incorrectas. |
| Adaptativo | Las respuestas no incluyen metadata para integracion, como `timestampISO`, `apiVersion`, `environment` o `integrationTarget`. | `src/modules/platos-tipicos/platos-tipicos.controller.ts`, `src/modules/platos-tipicos/platos-tipicos.service.ts` | Agregar metadata adaptativa en respuestas cuando la fase lo solicite, sin convertir timestamps en campos obligatorios de `PlatoTipico`. | API mas preparada para integraciones y auditoria contextual. |
| Perfectivo | No existe endpoint de estadisticas para total de platos, precio promedio, precio minimo, precio maximo, platos por region y platos por categoria. | `src/modules/platos-tipicos/platos-tipicos.controller.ts`, `src/modules/platos-tipicos/platos-tipicos.service.ts` | Crear endpoint de estadisticas con pruebas previas y calculos desde SQLite. | Mayor valor funcional para consulta y analisis de datos del CRUD. |
| Preventivo | Faltan validaciones robustas, sanitizacion, API Key, logs estructurados, trazabilidad y Swagger. | `src/modules/platos-tipicos/dto/create-plato-tipico.dto.ts`, `src/modules/platos-tipicos/dto/update-plato-tipico.dto.ts`, `src/modules/platos-tipicos/platos-tipicos.service.ts`, `src/main.ts`, `src/app.module.ts` | Aplicar validaciones declarativas, sanitizar textos, proteger endpoints con API Key, agregar logs estructurados, documentar con Swagger y probar entradas maliciosas. | Menor probabilidad de fallos futuros, mejor seguridad y mejor mantenibilidad. |

## Mantenimiento correctivo aplicado en Fase 6

| Antes | Despues | Justificacion | Impacto |
| --- | --- | --- | --- |
| El diagnostico marcaba riesgo de exito falso en `DELETE /platos-tipicos/:id` y falta de pruebas para confirmar eliminacion persistente. | Se agregaron pruebas e2e que verifican que `DELETE` elimina el registro, que el plato sigue eliminado tras reiniciar la aplicacion y que un id inexistente devuelve 404 sin `{ deleted: true }`. | El codigo actual ya usaba `findOne` antes de eliminar y `remove` de TypeORM, por lo que el fallo funcional no se reprodujo. La correccion minima fue fortalecer la prueba correctiva y confirmar GREEN. | Mayor confianza en el comportamiento de eliminacion y en el manejo controlado de errores sin cambiar contratos del CRUD. |

## Orden sugerido

1. Ampliar pruebas del CRUD y errores.
2. Aplicar mantenimiento correctivo.
3. Aplicar mantenimiento adaptativo.
4. Aplicar mantenimiento perfectivo.
5. Aplicar mantenimiento preventivo.
