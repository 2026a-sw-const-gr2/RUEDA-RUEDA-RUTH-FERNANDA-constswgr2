# PLAN TDD

## Metodologia

Cada mantenimiento del examen debe seguir:

1. RED: crear una prueba que falle.
2. GREEN: implementar el codigo minimo.
3. REFACTOR: mejorar sin cambiar comportamiento.

## Comandos reales de testing

Pruebas unitarias:

```bash
npm test
```

Pruebas unitarias en modo watch:

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

Prueba debug disponible:

```bash
npm run test:debug
```

## Configuracion real de pruebas identificada

- Jest unitario esta configurado en `package.json` con `rootDir: "src"` y patron `*.spec.ts`.
- Las pruebas e2e usan `test/jest-e2e.json`.
- Actualmente existe `src/app.controller.spec.ts`.
- Actualmente existe `test/app.e2e-spec.ts`.
- Actualmente existe `test/platos-tipicos.e2e-spec.ts`.
- El CRUD inicial de `PlatoTipico` usa TypeORM con SQLite en `db/platos-tipicos.sqlite`.
- La prueba e2e de platos tipicos valida persistencia despues de reiniciar la aplicacion Nest.

## Pruebas esperadas del CRUD inicial

El CRUD inicial persistente ya incluye pruebas e2e para:

- Crear plato tipico.
- Listar platos tipicos.
- Consultar plato tipico existente.
- Consultar plato tipico inexistente.
- Actualizar plato tipico existente.
- Actualizar plato tipico inexistente.
- Eliminar plato tipico existente.
- Eliminar plato tipico inexistente.
- Verificar persistencia SQLite despues de reiniciar.

Estado TDD Fase 5: GREEN.

Resultado documentado:

- `npm run test:e2e`: 2 suites pasaron, 10 pruebas pasaron.
- `npm test`: 1 suite paso, 1 prueba paso.
- No fue necesario corregir logica del CRUD para pasar estas pruebas base.

## Checklist TDD Fase 5

- [x] Crear prueba para crear plato tipico.
- [x] Crear prueba para listar platos tipicos.
- [x] Crear prueba para consultar plato tipico existente.
- [x] Crear prueba para consultar plato tipico inexistente.
- [x] Crear prueba para actualizar plato tipico existente.
- [x] Crear prueba para actualizar plato tipico inexistente.
- [x] Crear prueba para eliminar plato tipico existente.
- [x] Crear prueba para eliminar plato tipico inexistente.
- [x] Crear prueba para verificar persistencia en SQLite.
- [x] Ejecutar pruebas.
- [x] Documentar resultado RED/GREEN.

## Checklist de persistencia Fase 3

- [x] Ejecutar backend real desde `dist/main.js`.
- [x] Probar `POST /platos-tipicos`.
- [x] Probar `GET /platos-tipicos`.
- [x] Probar `GET /platos-tipicos/:id`.
- [x] Probar `PATCH /platos-tipicos/:id`.
- [x] Probar `DELETE /platos-tipicos/:id`.
- [x] Crear un plato tipico para persistencia.
- [x] Reiniciar el servidor.
- [x] Ejecutar `GET /platos-tipicos` despues del reinicio.
- [x] Confirmar que el plato creado sigue existiendo en `db/platos-tipicos.sqlite`.

## Pruebas de validaciones

- `nombre` vacio falla.
- `descripcion` vacia falla.
- `region` vacia falla.
- `ingredientes` vacio falla.
- `categoria` vacia falla.
- `precio` negativo falla.
- `precio` no numerico falla.
- `imagenUrl` invalida falla.

## Pruebas de mantenimiento correctivo

- [x] `DELETE /platos-tipicos/:id` elimina realmente en SQLite.
- [x] `DELETE /platos-tipicos/:id` mantiene el plato eliminado despues de reiniciar la aplicacion Nest.
- [x] `DELETE /platos-tipicos/:id` con id inexistente devuelve error controlado.
- [x] No se retorna exito falso en operaciones fallidas.
- `GET /platos-tipicos/:id` con id inexistente devuelve 404.
- `PATCH /platos-tipicos/:id` con id inexistente devuelve 404.
- `PATCH /platos-tipicos/:id` con datos invalidos devuelve 400.

Estado TDD Fase 6: GREEN.

Resultado documentado:

- Se agregaron pruebas correctivas para `DELETE`.
- `npm run test:e2e`: 2 suites pasaron, 11 pruebas pasaron.
- `npm test`: 1 suite paso, 1 prueba paso.
- No fue necesario modificar logica del CRUD porque el fallo funcional no se reprodujo.

## Pruebas de mantenimiento adaptativo

- [x] CREATE genera metadata adaptativa.
- [x] UPDATE genera metadata adaptativa.
- [x] DELETE genera metadata adaptativa.
- [x] QUERY genera metadata adaptativa.
- [x] `timestampISO` tiene formato ISO 8601 solo como metadata, log o auditoria, no como campo obligatorio de `PlatoTipico`.
- [x] Las respuestas mantienen los campos oficiales de `PlatoTipico` separados de la metadata.
- [x] La metadata incluye `source`, `system`, `apiVersion`, `timezone`, `environment` e `integrationTarget`.
- [x] El CRUD se integra con `EventsService` del modulo `events`.

Estado TDD Fase 7: RED -> GREEN.

Resultado documentado:

- RED: `npm run test:e2e` fallo porque las respuestas aun no tenian `data.metadata`.
- GREEN: `npm run test:e2e` paso con 2 suites y 11 pruebas.
- `npm test`: 1 suite paso, 1 prueba paso.
- `npm run build`: paso correctamente.

## Pruebas de mantenimiento perfectivo

- [x] Endpoint de estadisticas devuelve total de platos.
- [x] Calcula precio promedio.
- [x] Calcula precio minimo.
- [x] Calcula precio maximo.
- [x] Agrupa platos por region.
- [x] Agrupa platos por categoria.
- [x] Incluye `generatedAt` en formato ISO 8601.
- [x] No calcula `platosDisponibles`.
- [x] No calcula `platosNoDisponibles`.

Estado TDD Fase 8: RED -> GREEN.

Resultado documentado:

- RED: `npm run test:e2e` fallo porque `GET /platos-tipicos/stats` aun no existia y caia en `:id`.
- GREEN: `npm run test:e2e` paso con 2 suites y 12 pruebas.
- `npm test`: 1 suite paso, 1 prueba paso.
- `npm run build`: paso correctamente.

## Pruebas de mantenimiento preventivo

- [x] Rechaza campos obligatorios vacios.
- [x] Rechaza campos con solo espacios en blanco.
- [x] Rechaza precio negativo.
- [x] Rechaza `imagenUrl` sin formato URL.
- [x] Rechaza texto con `<script>`.
- [x] Rechaza patrones peligrosos como `SELECT`, `DROP`, `INSERT` o `--`.
- [x] Rechaza textos demasiado largos.
- [x] Aplica `trim` a textos antes de guardar.

Estado TDD Fase 9: RED -> GREEN.

Resultado documentado:

- RED: `npm run test:e2e` fallo porque se aceptaban espacios, URL invalida, `<script>`, patrones SQL, textos largos y textos sin trim.
- GREEN: `npm run test:e2e` paso con 2 suites y 19 pruebas.
- `npm test`: 1 suite paso, 1 prueba paso.
- `npm run build`: paso correctamente.

## Pruebas de seguridad por API Key

- [x] Permite `GET /health` sin API Key.
- [x] Rechaza endpoints del CRUD sin `X-FIS-EPN-KEY`.
- [x] Rechaza endpoints del CRUD con API Key incorrecta.
- [x] Permite endpoints del CRUD con API Key correcta.
- [x] La clave se lee desde `FIS_EPN_API_KEY`.

Estado TDD Fase 10: RED -> GREEN.

Resultado documentado:

- RED: `npm run test:e2e` fallo porque sin API Key e incorrecta devolvian 200.
- GREEN: `npm run test:e2e` paso con 2 suites y 23 pruebas.
- `npm test`: 1 suite paso, 1 prueba paso.
- `npm run build`: paso correctamente.

## Pruebas de logs y trazabilidad

- [x] Registra log `INFO` para operacion `CREATE`.
- [x] Registra `timestampISO`, `route`, `action` y `platoId` cuando aplica.
- [x] Registra log `WARN` cuando falta API Key.
- [x] Registra log `WARN` cuando falla una validacion.
- [x] Mantiene pruebas del CRUD pasando.

Estado TDD Fase 11: GREEN.

Resultado documentado:

- `npm run build`: paso correctamente.
- `npm test`: 1 suite paso, 1 prueba paso.
- `npm run test:e2e`: 2 suites pasaron, 23 pruebas pasaron.
- La evidencia manual se obtiene observando la consola con `npm run start:dev`.

## Pruebas de Swagger / OpenAPI

- [x] Configura Swagger en el backend.
- [x] Expone documentacion en `/api/docs`.
- [x] Documenta endpoints del CRUD de platos tipicos.
- [x] Documenta `GET /platos-tipicos/stats`.
- [x] Documenta DTOs de creacion y actualizacion.
- [x] Documenta errores `400`, `401` y `404`.
- [x] Documenta cabecera `X-FIS-EPN-KEY`.
- [x] Mantiene pruebas del CRUD pasando.

Estado TDD Fase 12: GREEN.

Resultado documentado:

- `npm run build`: paso correctamente.
- `npm test`: 1 suite paso, 1 prueba paso.
- `npm run test:e2e`: 2 suites pasaron, 24 pruebas pasaron.
- La evidencia manual se obtiene abriendo `http://localhost:3000/api/docs`.

## Diagnostico Fase 4

La Fase 4 no corrige codigo. Registra la deuda tecnica en:

- `docs/DIAGNOSTICO_DEUDA_TECNICA.md`
- `docs/TABLA_MANTENIMIENTO.md`

Las pruebas de las siguientes fases deben nacer de ese diagnostico y seguir RED, GREEN, REFACTOR.

## Checklist manual del frontend con Node.js

El frontend debe validarse manualmente o con pruebas si se configura entorno frontend.

Checklist:

- El frontend inicia con npm run dev.
- El frontend consume GET /platos-tipicos.
- Muestra tarjetas de platos típicos.
- Muestra imagen, nombre, descripción, región, ingredientes, precio y categoría.
- Permite crear un plato típico.
- Permite ver un plato típico.
- Permite editar un plato típico.
- Permite eliminar un plato típico.
- Muestra estadísticas desde GET /platos-tipicos/stats.
- Envía la cabecera X-FIS-EPN-KEY.
- Muestra errores si el backend no responde.
