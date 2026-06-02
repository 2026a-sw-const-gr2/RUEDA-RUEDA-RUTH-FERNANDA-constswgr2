# Plan TDD

## Metodologia

El proyecto usara TDD para desarrollar el mantenimiento de platos tipicos ecuatorianos.

## Ciclo Red, Green, Refactor

- Red: escribir una prueba automatizada antes de implementar la funcionalidad. La prueba debe fallar porque el comportamiento aun no existe.
- Green: implementar el minimo codigo necesario para que la prueba pase.
- Refactor: mejorar nombres, estructura o duplicacion manteniendo todas las pruebas en verde.

## Pruebas esperadas para PlatoTipico

### Crear plato tipico

- Debe crear un `PlatoTipico` con `nombre`, `descripcion`, `region`, `ingredientes`, `precio`, `imagenUrl` y `categoria` validos.
- Debe asignar o devolver un `id` para el plato creado.
- Debe responder correctamente al endpoint `POST /platos-tipicos`.

### Listar platos tipicos

- Debe listar todos los platos tipicos registrados.
- Debe devolver una lista vacia cuando no existan platos registrados.
- Debe responder correctamente al endpoint `GET /platos-tipicos`.

### Consultar plato tipico por id

- Debe devolver un plato tipico existente por su `id`.
- Debe manejar el caso de un `id` inexistente.
- Debe responder correctamente al endpoint `GET /platos-tipicos/:id`.

### Actualizar plato tipico

- Debe actualizar parcialmente los campos permitidos de un plato tipico existente.
- Debe conservar los campos que no se envien en la actualizacion.
- Debe manejar el caso de actualizar un `id` inexistente.
- Debe responder correctamente al endpoint `PATCH /platos-tipicos/:id`.

### Eliminar plato tipico

- Debe eliminar un plato tipico existente.
- Debe evitar que un plato eliminado aparezca en la lista posterior.
- Debe manejar el caso de eliminar un `id` inexistente.
- Debe responder correctamente al endpoint `DELETE /platos-tipicos/:id`.

## Pruebas para validaciones

- Debe rechazar un plato tipico sin `nombre`.
- Debe rechazar un plato tipico sin `descripcion`.
- Debe rechazar un plato tipico sin `region`.
- Debe rechazar un plato tipico sin `ingredientes`.
- Debe rechazar un plato tipico con `precio` vacio, negativo o no numerico.
- Debe validar que `imagenUrl` tenga formato de URL cuando se envie.
- Debe rechazar una `categoria` vacia.
- Debe validar datos invalidos tambien en actualizaciones parciales.

## Pruebas o validacion manual para interfaz web

Cuando exista la interfaz web, se debera validar como minimo:

- La pantalla permite listar platos tipicos ecuatorianos.
- El formulario permite crear un plato tipico con todos los campos requeridos.
- La interfaz muestra mensajes de validacion cuando faltan campos o el precio es invalido.
- La pantalla permite consultar o visualizar el detalle de un plato tipico.
- La pantalla permite actualizar datos de un plato tipico.
- La pantalla permite eliminar un plato tipico y actualizar la lista.
- La interfaz consume los endpoints esperados del backend.

Estas validaciones se automatizaran si la fase correspondiente lo permite; de lo contrario, quedaran registradas como validacion manual.
