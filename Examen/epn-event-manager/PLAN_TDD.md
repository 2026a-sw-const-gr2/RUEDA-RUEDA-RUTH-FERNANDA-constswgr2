# PLAN TDD

## Metodología

Cada mantenimiento debe seguir:

1. RED: crear prueba que falle.
2. GREEN: implementar código mínimo.
3. REFACTOR: mejorar sin cambiar comportamiento.

## Pruebas del CRUD inicial

- Crear plato típico.
- Listar platos típicos.
- Consultar plato típico existente.
- Consultar plato típico inexistente.
- Actualizar plato típico existente.
- Actualizar plato típico inexistente.
- Eliminar plato típico existente.
- Eliminar plato típico inexistente.
- Verificar persistencia SQLite después de reiniciar.

## Pruebas de mantenimiento correctivo

- DELETE elimina realmente en SQLite.
- DELETE con id inexistente devuelve error controlado.
- No se retorna éxito falso.

## Pruebas de mantenimiento adaptativo

- CREATE genera metadata.
- UPDATE genera metadata.
- DELETE genera metadata.
- QUERY genera metadata.
- timestampISO tiene formato ISO 8601.

## Pruebas de mantenimiento perfectivo

- GET /platos-tipicos/stats devuelve totalPlatos.
- Calcula precioPromedio.
- Calcula precioMinimo.
- Calcula precioMaximo.
- Agrupa platosPorRegion.
- Agrupa platosPorCategoria.

## Pruebas de mantenimiento preventivo

- nombre vacío falla.
- descripcion vacía falla.
- region vacía falla.
- ingredientes vacío falla.
- categoria vacía falla.
- precio negativo falla.
- imagenUrl inválida falla.
- texto con <script> falla.
- texto con SELECT, DROP, INSERT o -- falla.
- textos demasiado largos fallan.

## Pruebas de API Key

- Sin X-FIS-EPN-KEY devuelve 401.
- API Key incorrecta devuelve 401.
- API Key correcta permite acceder.

## Checklist manual de frontend

- Lista platos típicos.
- Muestra imagen.
- Muestra nombre.
- Muestra descripción.
- Muestra región.
- Muestra ingredientes.
- Muestra precio.
- Muestra categoría.
- Permite crear.
- Permite ver.
- Permite editar.
- Permite eliminar.
- Muestra estadísticas.