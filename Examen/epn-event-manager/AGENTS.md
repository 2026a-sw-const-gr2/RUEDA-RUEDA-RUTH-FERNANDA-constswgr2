# AGENTS.md

Reglas de trabajo para Codex en este proyecto.

## Alcance del proyecto

- Trabajar solo dentro de `Examen/epn-event-manager`.
- No modificar archivos fuera de `Examen/epn-event-manager`.
- No crear, editar ni eliminar archivos externos al proyecto.
- No agregar ni versionar `node_modules`.
- No agregar dependencias sin una fase o solicitud explicita.

## Metodologia obligatoria

- Usar TDD en cada mantenimiento del sistema.
- No implementar funcionalidades sin pruebas previas.
- Para cada cambio funcional, primero crear o actualizar pruebas que fallen en fase Red.
- Luego implementar el minimo codigo necesario para pasar a fase Green.
- Finalmente refactorizar solo si mejora claridad sin cambiar comportamiento.

## Documentacion viva

- Actualizar `CONTEXTO_PROYECTO.md` al finalizar cada fase.
- Actualizar `README.md` cuando cambien comandos, endpoints o forma de ejecucion.
- Actualizar `PLAN_TDD.md` cuando cambien, se agreguen o se eliminen pruebas.

## Restricciones de implementacion

- Mantener codigo simple y entendible para examen.
- Evitar abstracciones innecesarias.
- Priorizar nombres claros y estructura facil de revisar.
- No crear CRUD, interfaz web ni GitHub Actions hasta que la fase correspondiente lo solicite.
