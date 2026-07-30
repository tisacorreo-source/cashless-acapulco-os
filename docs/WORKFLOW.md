# Flujo de colaboración

## Principios

- GitHub es la fuente remota de verdad: `tisacorreo-source/cashless-acapulco-os`.
- `main` debe permanecer funcional y desplegable.
- Cada tarea se ejecuta y valida de forma aislada.
- La documentación cambia junto con el código que describe.
- Los servicios externos reflejan cambios versionados, no acciones manuales invisibles.

## Antes de trabajar

1. Leer README, PROJECT, STATUS y ACTION_PLAN.
2. Ejecutar `git status --short --branch`.
3. Revisar remoto y cambios recientes cuando exista GitHub.
4. Confirmar la única tarea activa y sus criterios.
5. Identificar decisiones bloqueantes antes de editar.

## Ramas

- `main`: estable.
- `feature/<descripcion>`: funcionalidades y tareas planificadas.
- `fix/<descripcion>`: correcciones aisladas.

Cuando exista un remoto, crear la rama desde una `main` actualizada. No reutilizar ramas para tareas no relacionadas ni reescribir historial compartido.

## Commits

Usar mensajes específicos y en modo imperativo. Ejemplos:

```text
docs: establish project handoff documentation
feat: scaffold React Vite application
fix: prevent duplicate QR confirmation
```

Antes de confirmar:

- Revisar `git diff --check` y el diff completo.
- Ejecutar validaciones aplicables.
- Confirmar que no haya secretos ni `.env` reales.
- Actualizar README, STATUS y documentos relacionados.

## Pull requests

Cada PR debe declarar objetivo, alcance, criterios de aceptación, pruebas, archivos principales y riesgos. Preferir PR en borrador mientras falte validación. No fusionar con checks fallidos o preguntas bloqueantes.

## Migraciones

- Una tarea de datos produce migraciones versionadas y revisables.
- Nunca modificar una migración ya aplicada en un entorno compartido; crear una correctiva.
- Registrar orden, prueba y recuperación.
- No ejecutar cambios destructivos sin respaldo y aprobación.

## Relevo entre programadores

Al terminar una sesión o tarea, `docs/STATUS.md` debe indicar:

- Qué tarea se trabajó y su estado.
- Qué cambió y en qué archivos.
- Qué pruebas pasaron.
- Commit o rama.
- Decisiones y bloqueos.
- Siguiente acción exacta.

Una persona nueva no debería depender de mensajes privados o memoria del autor para continuar.

## Publicación y producción

Publicar código y crear previews se hace en la tarea correspondiente. Producción, dominios, recursos de pago, borrado de datos y migraciones irreversibles requieren aprobación explícita. Ver `docs/DEPLOYMENT.md`.
