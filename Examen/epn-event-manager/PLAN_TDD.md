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
- Todavia no existen pruebas para `PlatoTipico`.

## Pruebas esperadas del CRUD inicial

Cuando se cree el CRUD inicial persistente, se esperan pruebas para:

- Crear plato tipico.
- Listar platos tipicos.
- Consultar plato tipico existente.
- Consultar plato tipico inexistente.
- Actualizar plato tipico existente.
- Actualizar plato tipico inexistente.
- Eliminar plato tipico existente.
- Eliminar plato tipico inexistente.
- Verificar persistencia SQLite despues de reiniciar.

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

- `DELETE /platos-tipicos/:id` elimina realmente en SQLite.
- `DELETE /platos-tipicos/:id` con id inexistente devuelve error controlado.
- No se retorna exito falso en operaciones fallidas.

## Pruebas de mantenimiento adaptativo

- CREATE genera metadata adaptativa cuando la fase lo solicite.
- UPDATE genera metadata adaptativa cuando la fase lo solicite.
- DELETE genera metadata adaptativa cuando la fase lo solicite.
- QUERY genera metadata adaptativa cuando la fase lo solicite.
- `timestampISO` tiene formato ISO 8601 solo como metadata, log o auditoria, no como campo obligatorio de `PlatoTipico`.

## Pruebas de mantenimiento perfectivo

- Endpoint de estadisticas devuelve total de platos.
- Calcula precio promedio.
- Calcula precio minimo.
- Calcula precio maximo.
- Agrupa platos por region.
- Agrupa platos por categoria.

## Pruebas de mantenimiento preventivo

- Rechaza texto con `<script>`.
- Rechaza patrones peligrosos como `SELECT`, `DROP`, `INSERT` o `--` cuando la fase preventiva lo solicite.
- Rechaza textos demasiado largos cuando se definan limites.

## Checklist manual futuro de frontend

- Lista platos tipicos.
- Muestra imagen.
- Muestra nombre.
- Muestra descripcion.
- Muestra region.
- Muestra ingredientes.
- Muestra precio.
- Muestra categoria.
- Permite crear.
- Permite ver detalle.
- Permite editar.
- Permite eliminar.
- Muestra estadisticas cuando existan.
