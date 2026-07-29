# Reglas de trabajo del repositorio

Estas reglas aplican a agentes automatizados y colaboradores humanos. Las instrucciones explícitas del responsable del proyecto prevalecen cuando no contradigan seguridad, integridad financiera o protección de datos.

## Fuente de verdad

Antes de modificar el proyecto, leer como mínimo:

1. `README.md`.
2. `PROJECT.md`.
3. `docs/STATUS.md`.
4. `docs/ACTION_PLAN.md`.
5. La documentación específica de la tarea.

El código, las migraciones y la documentación versionada en este repositorio son la fuente de verdad. No hacer cambios manuales en servicios externos sin reflejarlos aquí.

## Ejecución secuencial

- Trabajar una sola tarea del plan a la vez.
- No comenzar una nueva tarea hasta terminar, probar, documentar y registrar la actual.
- Se puede avanzar automáticamente entre tareas cerradas.
- Solicitar intervención cuando falte una decisión funcional indispensable, se requiera acceso o autorización externa, exista una acción sensible o destructiva, o se vaya a promover a producción.
- No mezclar correcciones o funcionalidades no relacionadas.

## Ciclo obligatorio por tarea

1. Revisar documentación, archivos, `git status` y contexto remoto disponible.
2. Identificar preguntas bloqueantes, contradicciones y riesgos.
3. Definir alcance, archivos y criterios de aceptación.
4. Implementar solo esa tarea.
5. Ejecutar lint, tipos, pruebas y build que correspondan.
6. Validar con navegador cuando exista una interfaz o flujo navegable.
7. Revisar secretos, permisos, errores de consola y red cuando aplique.
8. Actualizar README, `docs/STATUS.md` y los documentos afectados.
9. Revisar el diff y crear un commit específico.

## Reglas financieras no negociables

- Ningún saldo cambia sin un movimiento financiero registrado.
- Ningún movimiento financiero se elimina.
- Las cancelaciones crean movimientos compensatorios y conservan la venta original.
- Una operación financiera se aplica completa o no se aplica.
- Un QR vence en cinco minutos, no se reutiliza y no puede pagarse dos veces.
- El cliente debe confirmar explícitamente el pago.
- Un saldo insuficiente nunca genera movimientos parciales.
- Solo el administrador cancela ventas y procesa liquidaciones.
- El saldo del cliente es general; el del negocio se separa por evento.
- Todas las cantidades monetarias deben representarse sin errores de punto flotante.

## Seguridad y datos

- Nunca registrar, imprimir, documentar o confirmar secretos.
- Nunca exponer claves secretas o `service_role` en el frontend.
- Todos los archivos `.env*` se ignoran salvo `.env.example`.
- Las tablas expuestas por Supabase requieren RLS y políticas probadas.
- No basar autorización en metadatos editables por el usuario.
- Documentar expresamente las limitaciones de autenticación aceptadas para el MVP.
- Usar datos demo claramente identificados en pruebas de producción.

## Git y colaboración

- Mantener `main` funcional.
- Usar `feature/<descripcion>` o `fix/<descripcion>` cuando exista colaboración remota.
- No sobrescribir cambios ajenos ni reescribir historial compartido.
- Revisar cambios remotos antes de publicar.
- Un commit debe representar una tarea o unidad verificable.
- Actualizar el índice del README al cambiar la estructura relevante.
- Consultar `docs/WORKFLOW.md` para el flujo completo.

## Límites operativos

- Trabajar únicamente dentro de este repositorio salvo autorización explícita o lectura obligatoria de instrucciones de herramientas.
- No crear recursos cloud, publicar repositorios, desplegar, configurar dominios ni promover a producción sin el punto de autorización correspondiente.
- Preferir operaciones reversibles y no destructivas.
- No instalar herramientas globales ni modificar el equipo anfitrión sin autorización.

## Definición de terminado

Una tarea está terminada solo si cumple sus criterios, no deja errores activos, tiene evidencia de validación, documentación sincronizada y un estado de Git comprensible. Si algo impide cumplirlo, registrar el bloqueo en `docs/STATUS.md`.
