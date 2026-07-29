# Plan de acción secuencial

## Reglas de estado

- `Terminada`: criterios cumplidos y evidencia registrada.
- `En curso`: única tarea autorizada para cambios.
- `Pendiente`: no debe iniciarse todavía.
- `Bloqueada`: requiere decisión, acceso o corrección previa.

## Entrega 0 — Descubrimiento y preparación

| Tarea                                     | Estado    | Criterio de cierre                                                                                    |
| ----------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| 0.1 Revisar plugins, skills y capacidades | Terminada | GitHub, Supabase, Vercel y navegador inventariados; conexiones disponibles identificadas              |
| 0.2 Inspeccionar entorno local            | Terminada | Carpeta, Git, runtimes, CLI, conexiones y variables revisados sin exponer secretos                    |
| 0.3 Crear documentación inicial           | Terminada | Índice, requisitos, decisiones, plan, datos, pruebas, despliegue y entorno documentados y versionados |

## Entrega 1 — Base funcional local

| Tarea                                        | Estado    | Criterio de cierre                                                                      |
| -------------------------------------------- | --------- | --------------------------------------------------------------------------------------- |
| 1.1 Crear proyecto React + TypeScript + Vite | Terminada | App inicia, lint y build pasan, página inicial visible, comandos documentados           |
| 1.2 Crear repositorio GitHub público         | Pendiente | Remoto accesible, `main` funcional, README visible, sin secretos                        |
| 1.3 Diseñar modelo de datos físico           | Pendiente | Entidades, restricciones, transacciones, RLS y movimientos documentados antes de tablas |
| 1.4 Conectar Supabase                        | Pendiente | Migraciones versionadas aplicadas, tipos generados, RLS y conexión probados             |
| 1.5 Implementar autenticación y acceso       | Pendiente | Roles separados, teléfono único, acceso limitado y pruebas de permisos                  |
| 1.6 Crear navegación y estructura visual     | Pendiente | Vistas mobile-first funcionales para los tres roles                                     |

## Entrega 2 — Operación cashless

| Tarea                          | Estado    | Criterio de cierre resumido                                          |
| ------------------------------ | --------- | -------------------------------------------------------------------- |
| 2.1 Registro de clientes       | Pendiente | Alta, búsqueda, teléfono único, fecha y creador                      |
| 2.2 Recargas                   | Pendiente | Monto válido, movimiento y saldo atómicos                            |
| 2.3 Creación de eventos        | Pendiente | Fechas, estado y negocios; saldos con alcance correcto               |
| 2.4 Generación de cobros       | Pendiente | QR de cinco minutos, un solo uso, estados y datos seguros            |
| 2.5 Escaneo y confirmación     | Pendiente | Vista completa y cero movimientos sin confirmación válida            |
| 2.6 Procesamiento financiero   | Pendiente | Compra atómica y pruebas de concurrencia y fallo intermedio          |
| 2.7 Historiales                | Pendiente | Vistas filtradas correctamente para cliente, negocio y administrador |
| 2.8 Cancelación administrativa | Pendiente | Reversión única y atómica, venta original conservada                 |
| 2.9 Retiro de clientes         | Pendiente | Límites de saldo y saldos anterior/posterior registrados             |
| 2.10 Liquidación de negocios   | Pendiente | Cálculo por evento y ventas posteriores permitidas                   |

## Entrega 3 — Reportes, pruebas y despliegue

| Tarea                          | Estado    | Criterio de cierre resumido                                          |
| ------------------------------ | --------- | -------------------------------------------------------------------- |
| 3.1 Exportaciones CSV          | Pendiente | Seis exportaciones con campos, codificación y montos correctos       |
| 3.2 Datos demo                 | Pendiente | Inserción y limpieza idempotentes y seguras                          |
| 3.3 Pruebas integrales locales | Pendiente | Flujo completo sin errores, duplicados ni inconsistencias            |
| 3.4 Validación con navegador   | Pendiente | Mobile, escritorio, formularios, QR, consola y red verificados       |
| 3.5 Preparación para Vercel    | Pendiente | Build de producción, SPA, variables e integración revisados          |
| 3.6 Despliegue en Vercel       | Pendiente | URL obtenida, logs y Supabase verificados, documentación actualizada |
| 3.7 Prueba en producción       | Pendiente | Flujos completos con datos demo y errores registrados como issues    |

## Puerta entre tareas

No avanzar si hay errores activos, pruebas fallidas, documentación desactualizada, secretos, permisos incorrectos, inconsistencias de saldo o una decisión bloqueante. El avance no requiere confirmación rutinaria del responsable; sí la requiere para accesos, acciones sensibles o destructivas y promoción a producción.
