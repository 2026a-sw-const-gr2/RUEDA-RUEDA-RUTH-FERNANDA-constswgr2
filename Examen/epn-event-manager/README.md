# EPN Event Manager

## Descripcion general

Proyecto de examen construido con Node.js para el mantenimiento de platos tipicos ecuatorianos. El sistema se desarrollara usando TDD, una interfaz web y, en fases posteriores, automatizacion con GitHub Actions.

El proyecto parte desde una base inicial y evolucionara por fases. En esta Fase 0 solo se crea la documentacion base del proyecto.

## Recurso principal

El recurso principal del sistema es `PlatoTipico`, que representa un plato tipico ecuatoriano registrado para mantenimiento.

## Campos de PlatoTipico

- `id`: identificador unico del plato tipico.
- `nombre`: nombre del plato tipico ecuatoriano.
- `descripcion`: descripcion breve del plato.
- `region`: region del Ecuador a la que pertenece o con la que se asocia.
- `ingredientes`: lista o descripcion de ingredientes principales.
- `precio`: precio referencial del plato.
- `imagenUrl`: URL de una imagen representativa.
- `categoria`: categoria del plato, por ejemplo sopa, plato fuerte, bebida, postre o entrada.

## Metodologia TDD

El desarrollo del proyecto seguira TDD en cada mantenimiento:

1. Red: escribir primero una prueba que falle.
2. Green: implementar el minimo codigo necesario para que la prueba pase.
3. Refactor: mejorar el codigo sin cambiar el comportamiento cubierto por pruebas.

No se debe implementar funcionalidad nueva sin pruebas previas.

## Endpoints esperados

Los endpoints esperados para el mantenimiento de platos tipicos ecuatorianos son:

- `POST /platos-tipicos`: crear un plato tipico.
- `GET /platos-tipicos`: listar platos tipicos.
- `GET /platos-tipicos/:id`: consultar un plato tipico por id.
- `PATCH /platos-tipicos/:id`: actualizar parcialmente un plato tipico.
- `DELETE /platos-tipicos/:id`: eliminar un plato tipico.

Estos endpoints aun no estan implementados en la Fase 0.

## Fases del proyecto

- Fase 0: crear documentacion base del proyecto. Estado: completada.
- Fase 1: preparar pruebas iniciales para el mantenimiento de platos tipicos. Estado: pendiente.
- Fase 2: implementar CRUD de platos tipicos usando TDD. Estado: pendiente.
- Fase 3: crear interfaz web para el mantenimiento. Estado: pendiente.
- Fase 4: configurar GitHub Actions para pruebas automaticas. Estado: pendiente.
- Fase 5: ajustes finales, validaciones y documentacion de cierre. Estado: pendiente.

## Instalacion, ejecucion y pruebas

Pendiente de completar cuando la fase correspondiente defina los comandos oficiales del proyecto.

- Instalacion: pendiente.
- Ejecucion: pendiente.
- Pruebas: pendiente.
