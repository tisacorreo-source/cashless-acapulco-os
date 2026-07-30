# Estrategia de despliegue

## Entornos

### Local

Desarrollo y validación inicial. Los comandos exactos se añadirán al crear el proyecto. Las variables viven en archivos locales ignorados por Git.

### Preview de Vercel

Cada rama o pull request autorizados podrá producir un preview. Debe usar configuración controlada, distinguirse de producción y validarse antes de fusionar.

### Producción

Se promueve únicamente con aprobación explícita. Durante el MVP compartirá proyecto Supabase con desarrollo, decisión que obliga a usar datos demo identificados, políticas estrictas y procedimientos no destructivos.

## Flujo previsto

1. Validar lint, tipos, pruebas y build local.
2. Revisar diff, secretos y migraciones.
3. Publicar una rama en GitHub cuando esté autorizado.
4. Crear o inspeccionar preview de Vercel.
5. Probar mobile, escritorio, consola, red y flujos principales.
6. Corregir fallos antes de fusionar.
7. Solicitar aprobación para producción.
8. Desplegar, revisar logs y probar con datos demo.
9. Registrar URL, commit, migraciones y resultado en `docs/STATUS.md`.

## Variables

El frontend solo recibe valores públicos como `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`. Ninguna clave secreta usa el prefijo `VITE_`. Los valores reales se configuran en cada entorno y nunca se copian a Git, documentación o logs.

## Supabase

- Proyecto: `Cashless Acapulco`, referencia `ypeabqwaragnnavvmgyg`, región `us-east-1`.
- URL pública: `https://ypeabqwaragnnavvmgyg.supabase.co`.
- Todo cambio de esquema se origina en una migración versionada.
- Las tablas expuestas deben tener RLS y políticas probadas.
- El Data API expone únicamente `api`; `cashless` permanece interno.
- Antes de aplicar cambios se revisan compatibilidad, impacto y recuperación.
- Cambios destructivos requieren respaldo y aprobación explícita.
- El repositorio conserva el esquema reproducible; no se aceptan cambios manuales sin documentar.

## Configuración SPA

La preparación de Vercel deberá verificar build, directorio de salida y fallback de rutas del cliente. La configuración concreta se añadirá después de crear la aplicación y probar el build local.

## Rollback

- Código: volver a desplegar un commit previamente validado.
- Configuración: restaurar valores conocidos sin exponerlos.
- Datos: usar migración correctiva o respaldo; nunca reescribir o borrar movimientos financieros para “deshacer”.
- Cada despliegue registrará commit y migraciones para hacer trazable la recuperación.

## Criterios antes de producción

- Build local correcto.
- Suite completa aprobada.
- RLS y roles probados.
- Datos demo idempotentes.
- Sin secretos ni archivos locales en Git.
- URL de preview validada.
- Aprobación explícita del responsable.
