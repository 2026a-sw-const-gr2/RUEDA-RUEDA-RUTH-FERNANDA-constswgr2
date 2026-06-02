# Diagnostico de Deuda Tecnica

## Contexto

Fase 4 del examen de mantenimiento de software. El proyecto ya cuenta con un CRUD inicial persistente de platos tipicos ecuatorianos en NestJS, usando TypeORM y SQLite en `db/platos-tipicos.sqlite`.

Este documento diagnostica deuda tecnica antes de intervenir el codigo. No se corrige nada en esta fase.

## Alcance revisado

- `src/modules/platos-tipicos/platos-tipicos.controller.ts`
- `src/modules/platos-tipicos/platos-tipicos.service.ts`
- `src/modules/platos-tipicos/dto/create-plato-tipico.dto.ts`
- `src/modules/platos-tipicos/dto/update-plato-tipico.dto.ts`
- `src/database/entities/plato-tipico.entity.ts`
- `src/database/database.module.ts`
- `test/platos-tipicos.e2e-spec.ts`

## Hallazgos principales

### 1. Falta de pruebas suficientes

Existe una prueba e2e de persistencia, pero todavia no hay cobertura completa para consultar por id, actualizar, eliminar, errores 400, errores 404, precio invalido, campos vacios o payloads maliciosos.

Riesgo: regresiones funcionales pueden pasar desapercibidas durante mantenimientos correctivos o preventivos.

### 2. Falta de validaciones robustas

El servicio valida campos obligatorios y precio negativo de forma manual, pero los DTOs no usan `class-validator`. No hay validacion declarativa de tipos, longitudes, URL, formatos, trims ni listas permitidas.

Riesgo: datos inconsistentes pueden persistirse en SQLite.

### 3. Falta de API Key

Los endpoints del CRUD estan abiertos y no usan guard, middleware ni cabecera `X-FIS-EPN-KEY`.

Riesgo: cualquier cliente puede crear, modificar o eliminar platos.

### 4. Falta de logs estructurados

No se registran operaciones de creacion, consulta, actualizacion, eliminacion ni errores con estructura consistente.

Riesgo: baja capacidad de soporte y depuracion cuando ocurra una falla.

### 5. Falta de trazabilidad

No existe un mecanismo para relacionar una operacion con su request, accion, endpoint, id del plato o resultado.

Riesgo: no se puede reconstruir con claridad que ocurrio en una operacion del CRUD.

### 6. Falta de metadata adaptativa

Las respuestas del CRUD devuelven directamente la entidad o un objeto simple. No incluyen metadata como `apiVersion`, `timestampISO`, `environment` o `integrationTarget`.

Riesgo: futuras integraciones tendran que inferir contexto o cambiar contratos de respuesta de forma tardia.

### 7. Falta de Swagger

No existe documentacion OpenAPI para endpoints, DTOs, respuestas ni errores.

Riesgo: mayor dificultad para probar, integrar y revisar la API.

### 8. Falta de endpoint de estadisticas

El CRUD no cuenta con endpoint para total de platos, precio promedio, minimo, maximo, agrupacion por region o categoria.

Riesgo: no se cubre la mejora perfectiva esperada para explotar informacion del recurso.

### 9. Falta de sanitizacion

No se limpian entradas de texto ni se bloquean patrones peligrosos como `<script>`, `SELECT`, `DROP`, `INSERT` o `--`.

Riesgo: textos maliciosos pueden quedar almacenados y afectar futuras vistas, logs o integraciones.

### 10. Manejo de errores incompleto

Se manejan algunos errores con `BadRequestException` y `NotFoundException`, pero no hay formato de error estandarizado, filtros globales ni pruebas suficientes para respuestas de error.

Riesgo: respuestas inconsistentes para clientes y mayor costo de diagnostico.

### 11. Posibles riesgos al recibir textos maliciosos

Los campos `nombre`, `descripcion`, `region`, `ingredientes`, `imagenUrl` y `categoria` aceptan texto sin sanitizacion avanzada.

Riesgo: almacenamiento de contenido peligroso que luego podria mostrarse en un frontend o exportarse a logs.

### 12. Posibles errores con precio negativo o campos vacios

El precio negativo se rechaza en el servicio, pero faltan pruebas directas. Los campos vacios se validan solo contra cadena vacia exacta, no contra espacios en blanco.

Riesgo: entradas como `"   "` podrian aceptarse como datos validos.

## Observaciones adicionales

- `src/database/database.module.ts` usa `synchronize: true`, util para examen y desarrollo, pero riesgoso para ambientes productivos.
- La base `db/platos-tipicos.sqlite` esta versionada como evidencia de persistencia. Esto puede ser util para el examen, pero debe revisarse si se requiere una base limpia por ambiente.
- Las entidades de eventos siguen registradas en la misma conexion TypeORM aunque la base actual apunta a `db/platos-tipicos.sqlite`.

## Conclusion

El CRUD base persistente esta listo para mantenimiento, pero tiene deuda tecnica intencional o pendiente en pruebas, validacion, seguridad, trazabilidad, documentacion API y capacidades perfectivas. La siguiente fase debe priorizar TDD antes de corregir o mejorar el comportamiento.

## Actualizacion Fase 6: mantenimiento correctivo

### Antes

El diagnostico inicial identifico riesgo de que `DELETE /platos-tipicos/:id` devolviera exito sin eliminar realmente, o que un id inexistente no tuviera error controlado.

### Prueba correctiva

Se agregaron pruebas e2e para confirmar:

- `DELETE /platos-tipicos/:id` elimina un plato existente.
- El plato eliminado no vuelve a aparecer despues de reiniciar la aplicacion Nest.
- `DELETE /platos-tipicos/:id` con id inexistente devuelve 404.
- Una eliminacion inexistente no devuelve `{ deleted: true }`.

### Despues

Las pruebas pasaron en GREEN. El comportamiento correctivo ya estaba implementado en `src/modules/platos-tipicos/platos-tipicos.service.ts` mediante `findOne` y `remove` de TypeORM, asi que no fue necesario modificar la logica del CRUD.

### Justificacion

No se cambio codigo funcional porque el fallo no se reprodujo. La intervencion correctiva se limito a blindar el comportamiento con pruebas automatizadas.

### Impacto

El CRUD queda respaldado por pruebas contra exito falso, errores 404 y persistencia de la eliminacion en SQLite.

## Actualizacion Fase 7: mantenimiento adaptativo

### Antes

El CRUD devolvia entidades directas o arreglos de entidades. No generaba metadata adaptativa y no integraba las operaciones de platos tipicos con el modulo `events`.

### Prueba adaptativa

Se agregaron pruebas e2e para confirmar:

- CREATE genera metadata.
- UPDATE genera metadata.
- DELETE genera metadata.
- QUERY genera metadata.
- `timestampISO` cumple formato ISO 8601.
- La metadata se mantiene separada de `data`.

### Despues

Las operaciones del CRUD devuelven `{ data, metadata }`. La metadata contiene `source`, `system`, `apiVersion`, `timestampISO`, `timezone`, `environment` e `integrationTarget`.

### Justificacion

El cambio adapta la API para integracion con EPN Event Manager sin modificar el modelo oficial `PlatoTipico`.

### Impacto

El CRUD queda listo para integraciones que necesitan contexto operativo estandarizado. Las pruebas quedaron en GREEN y el build compila correctamente.

## Actualizacion Fase 8: mantenimiento perfectivo

### Antes

El CRUD no tenia endpoint de estadisticas. Para conocer totales, precios o agrupaciones era necesario consultar todos los platos y calcular fuera de la API.

### Prueba perfectiva

Se agrego una prueba e2e para `GET /platos-tipicos/stats` que confirma:

- `totalPlatos`.
- `precioPromedio`.
- `precioMinimo`.
- `precioMaximo`.
- `platosPorRegion`.
- `platosPorCategoria`.
- `generatedAt` en formato ISO 8601.
- Ausencia de `platosDisponibles` y `platosNoDisponibles`.

### Despues

El endpoint `GET /platos-tipicos/stats` devuelve estadisticas calculadas desde SQLite y mantiene la estructura adaptativa `{ data, metadata }`.

### Justificacion

Este cambio es perfectivo porque agrega una capacidad de analisis sin corregir un error critico.

### Impacto

La API ofrece informacion agregada del CRUD y las pruebas quedaron en GREEN con 12 pruebas e2e pasando.

## Actualizacion Fase 9: mantenimiento preventivo

### Antes

El CRUD aceptaba algunos datos invalidos o riesgosos: textos con solo espacios, URLs invalidas, `<script>`, patrones SQL textuales, textos demasiado largos y valores sin `trim`.

### Prueba preventiva

Se agregaron pruebas e2e para confirmar:

- campos obligatorios vacios;
- campos con solo espacios;
- precio negativo;
- `imagenUrl` invalida;
- texto con `<script>`;
- patrones `SELECT`, `DROP`, `INSERT` y `--`;
- textos demasiado largos;
- aplicacion de `trim`.

### Despues

El servicio sanitiza textos con `trim`, valida longitudes, bloquea patrones peligrosos y valida URL antes de persistir.

### Justificacion

Este cambio es preventivo porque evita errores futuros, datos inconsistentes y entradas maliciosas antes de que lleguen a SQLite.

### Impacto

El CRUD rechaza datos invalidos y las pruebas quedaron en GREEN con 19 pruebas e2e pasando.
