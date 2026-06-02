# Pruebas Manuales de API

## Contexto

Evidencia manual para probar la API del CRUD de platos tipicos ecuatorianos.

Backend:

```text
http://localhost:3000
```

Cabecera obligatoria para endpoints protegidos:

```text
X-FIS-EPN-KEY
```

Valor de ejemplo:

```text
clave-de-prueba
```

Antes de ejecutar las pruebas, iniciar el backend:

```bash
npm run start:dev
```

Si no existe `.env`, usar una variable de entorno con:

```bash
FIS_EPN_API_KEY=clave-de-prueba
```

En PowerShell:

```powershell
$env:FIS_EPN_API_KEY="clave-de-prueba"; npm run start:dev
```

## 1. Crear plato tipico

```bash
curl -X POST http://localhost:3000/platos-tipicos \
  -H "Content-Type: application/json" \
  -H "X-FIS-EPN-KEY: clave-de-prueba" \
  -d "{\"nombre\":\"Encebollado\",\"descripcion\":\"Plato tradicional de la Costa ecuatoriana.\",\"region\":\"Costa\",\"ingredientes\":\"Pescado, yuca, cebolla, tomate y limon\",\"precio\":3.5,\"imagenUrl\":\"https://example.com/encebollado.jpg\",\"categoria\":\"Sopa tradicional\"}"
```

Resultado esperado:

- HTTP `201`.
- Respuesta con `data.id`.
- Respuesta con `metadata`.

Guardar el `id` devuelto para las siguientes pruebas.

## 2. Listar platos

```bash
curl http://localhost:3000/platos-tipicos \
  -H "X-FIS-EPN-KEY: clave-de-prueba"
```

Resultado esperado:

- HTTP `200`.
- Arreglo en `data`.
- El plato creado aparece en la lista.

## 3. Consultar por id

Reemplazar `1` por el id creado.

```bash
curl http://localhost:3000/platos-tipicos/1 \
  -H "X-FIS-EPN-KEY: clave-de-prueba"
```

Resultado esperado:

- HTTP `200`.
- `data.id` coincide con el id consultado.

## 4. Actualizar plato tipico

Reemplazar `1` por el id creado.

```bash
curl -X PATCH http://localhost:3000/platos-tipicos/1 \
  -H "Content-Type: application/json" \
  -H "X-FIS-EPN-KEY: clave-de-prueba" \
  -d "{\"precio\":4.25,\"categoria\":\"Sopa ecuatoriana\"}"
```

Resultado esperado:

- HTTP `200`.
- `data.precio` cambia a `4.25`.
- `data.categoria` cambia a `Sopa ecuatoriana`.

## 5. Estadisticas

```bash
curl http://localhost:3000/platos-tipicos/stats \
  -H "X-FIS-EPN-KEY: clave-de-prueba"
```

Resultado esperado:

- HTTP `200`.
- Respuesta con `totalPlatos`.
- Respuesta con `precioPromedio`, `precioMinimo`, `precioMaximo`.
- Respuesta con `platosPorRegion`.
- Respuesta con `platosPorCategoria`.
- Respuesta con `generatedAt`.

## 6. API Key correcta

```bash
curl http://localhost:3000/platos-tipicos \
  -H "X-FIS-EPN-KEY: clave-de-prueba"
```

Resultado esperado:

- HTTP `200`.

## 7. API Key incorrecta

```bash
curl http://localhost:3000/platos-tipicos \
  -H "X-FIS-EPN-KEY: clave-incorrecta"
```

Resultado esperado:

- HTTP `401`.
- Mensaje de API Key invalida o ausente.

## 8. Datos invalidos

Campo obligatorio vacio:

```bash
curl -X POST http://localhost:3000/platos-tipicos \
  -H "Content-Type: application/json" \
  -H "X-FIS-EPN-KEY: clave-de-prueba" \
  -d "{\"nombre\":\"\",\"descripcion\":\"Descripcion valida\",\"region\":\"Costa\",\"ingredientes\":\"Pescado y yuca\",\"precio\":3.5,\"imagenUrl\":\"https://example.com/plato.jpg\",\"categoria\":\"Sopa\"}"
```

Resultado esperado:

- HTTP `400`.
- Mensaje de validacion.

## 9. Script malicioso

```bash
curl -X POST http://localhost:3000/platos-tipicos \
  -H "Content-Type: application/json" \
  -H "X-FIS-EPN-KEY: clave-de-prueba" \
  -d "{\"nombre\":\"Prueba script\",\"descripcion\":\"<script>alert(1)</script>\",\"region\":\"Costa\",\"ingredientes\":\"Pescado y yuca\",\"precio\":3.5,\"imagenUrl\":\"https://example.com/plato.jpg\",\"categoria\":\"Sopa\"}"
```

Resultado esperado:

- HTTP `400`.
- El texto malicioso no se guarda.

## 10. Precio negativo

```bash
curl -X POST http://localhost:3000/platos-tipicos \
  -H "Content-Type: application/json" \
  -H "X-FIS-EPN-KEY: clave-de-prueba" \
  -d "{\"nombre\":\"Precio invalido\",\"descripcion\":\"Descripcion valida\",\"region\":\"Sierra\",\"ingredientes\":\"Papa y queso\",\"precio\":-1,\"imagenUrl\":\"https://example.com/plato.jpg\",\"categoria\":\"Entrada\"}"
```

Resultado esperado:

- HTTP `400`.
- Mensaje indicando que el precio debe ser mayor o igual a `0`.

## 11. Eliminar plato tipico

Reemplazar `1` por el id creado.

```bash
curl -X DELETE http://localhost:3000/platos-tipicos/1 \
  -H "X-FIS-EPN-KEY: clave-de-prueba"
```

Resultado esperado:

- HTTP `200`.
- `data.deleted` es `true`.

Luego consultar el mismo id:

```bash
curl http://localhost:3000/platos-tipicos/1 \
  -H "X-FIS-EPN-KEY: clave-de-prueba"
```

Resultado esperado:

- HTTP `404`.

## 12. Persistencia SQLite despues de reiniciar

1. Crear un plato tipico con el paso 1.
2. Guardar el `id` devuelto.
3. Detener el backend.
4. Volver a iniciar el backend con `npm run start:dev`.
5. Consultar el id creado:

```bash
curl http://localhost:3000/platos-tipicos/1 \
  -H "X-FIS-EPN-KEY: clave-de-prueba"
```

Resultado esperado:

- HTTP `200`.
- El plato sigue existiendo porque se persiste en `db/platos-tipicos.sqlite`.

## Checklist de evidencia

- [ ] Crear plato tipico.
- [ ] Listar platos.
- [ ] Consultar por id.
- [ ] Actualizar plato.
- [ ] Eliminar plato.
- [ ] Consultar estadisticas.
- [ ] Probar API Key correcta.
- [ ] Probar API Key incorrecta.
- [ ] Probar datos invalidos.
- [ ] Probar script malicioso.
- [ ] Probar precio negativo.
- [ ] Probar persistencia SQLite despues de reiniciar.
