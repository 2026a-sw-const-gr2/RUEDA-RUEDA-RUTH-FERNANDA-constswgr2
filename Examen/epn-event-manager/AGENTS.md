# AGENTS.md

## Reglas generales

- El proyecto está ubicado en Examen/epn-event-manager.
- Los cambios se realizan en la rama desarrollo.
- Trabajar con la estructura actual del proyecto NestJS.
- No crear carpeta backend, porque este proyecto ya es el backend.
- El CRUD de platos típicos ecuatorianos debe crearse dentro de src/modules/platos-tipicos.
- El CRUD debe usar persistencia en SQLite, no arreglos en memoria.
- La base de datos debe guardarse en db/.
- No subir node_modules.
- No subir .env.
- Sí subir .env.example.
- Después de cada fase se debe actualizar la documentación correspondiente.
- Después de cada fase se debe hacer commit en la rama desarrollo.

## Recurso principal

PlatoTipico.

Campos oficiales:

- id
- nombre
- descripcion
- region
- ingredientes
- precio
- imagenUrl
- categoria

## Metodología

Primero se construye el CRUD inicial persistente.

Después se aplica el examen de mantenimiento:

- diagnóstico de deuda técnica
- TDD
- mantenimiento correctivo
- mantenimiento adaptativo
- mantenimiento perfectivo
- mantenimiento preventivo
- API Key
- logs
- Swagger
- frontend
- GitHub Actions
- documentación final