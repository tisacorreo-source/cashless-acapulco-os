# Registro de decisiones

Las decisiones confirmadas no deben reinterpretarse silenciosamente. Un cambio se registra aquí con fecha, motivo e impacto.

## Decisiones vigentes

| ID    | Fecha      | Decisión                                                               | Motivo e impacto                                                                                                                                                                   |
| ----- | ---------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-001 | 2026-07-29 | React + TypeScript + Vite para el frontend                             | Stack definido por el responsable del producto; prevalece sobre defaults de herramientas                                                                                           |
| D-002 | 2026-07-29 | Supabase/PostgreSQL como backend                                       | Centraliza datos, autenticación y transacciones; exige migraciones y RLS                                                                                                           |
| D-003 | 2026-07-29 | GitHub público será la fuente remota                                   | Facilita colaboración; eleva la exigencia de revisión de secretos                                                                                                                  |
| D-004 | 2026-07-29 | Vercel será la plataforma de despliegue                                | Se usarán previews antes de producción                                                                                                                                             |
| D-005 | 2026-07-29 | Un proyecto Supabase para desarrollo y producción durante el MVP       | Simplifica operación, pero exige separación estricta de datos demo y controles de cambio                                                                                           |
| D-006 | 2026-07-29 | El saldo del cliente es global y el del negocio se separa por evento   | Determina claves, reportes y reglas de liquidación                                                                                                                                 |
| D-007 | 2026-07-29 | Los movimientos financieros son permanentes                            | Correcciones mediante compensación, nunca edición o eliminación                                                                                                                    |
| D-008 | 2026-07-29 | Acceso de cliente por nombre y teléfono                                | Limitación aceptada del MVP; debe documentarse y contenerse mediante backend seguro                                                                                                |
| D-009 | 2026-07-29 | Ejecución secuencial con avance automático                             | Solo se pausa ante bloqueo, acceso, seguridad, destrucción o producción                                                                                                            |
| D-010 | 2026-07-29 | README y STATUS serán índices vivos                                    | Cada cambio estructural o de tarea debe mantener el contexto para relevos                                                                                                          |
| D-011 | 2026-07-29 | Node.js 24 LTS y pnpm 11.9 para la base local                          | Mantiene compatibilidad con Vite 8 y fija la resolución mediante lockfile                                                                                                          |
| D-012 | 2026-07-29 | Oxlint, Prettier y Vitest como herramientas iniciales                  | Sigue el template oficial actual de Vite y añade formato y pruebas reproducibles                                                                                                   |
| D-013 | 2026-07-29 | El repositorio público es `tisacorreo-source/cashless-acapulco-os`     | Coincide con el producto y la carpeta local; `main` es la rama predeterminada                                                                                                      |
| D-014 | 2026-07-29 | Teléfonos en E.164, con `+52` predeterminado                           | Evita duplicados por formato y permite números internacionales                                                                                                                     |
| D-015 | 2026-07-29 | Correo de cliente opcional y único cuando exista                       | Admite registros sin correo y evita reutilizar uno normalizado                                                                                                                     |
| D-016 | 2026-07-29 | UTC interno y presentación en `America/Mexico_City`                    | Evita instantes ambiguos y fija el contexto operativo de Acapulco                                                                                                                  |
| D-017 | 2026-07-29 | Dinero en centavos; cada operación entre $50 y $1,000 MXN              | Elimina punto flotante; los saldos acumulados no tienen ese tope                                                                                                                   |
| D-018 | 2026-07-29 | Toda recarga requiere seleccionar un evento                            | Conserva la clasificación exigida sin inferir un evento por estado o fecha                                                                                                         |
| D-019 | 2026-07-29 | Una reversión posliquidación genera deuda negocio–evento               | Mantiene la reversión completa y descuenta la deuda de ventas posteriores                                                                                                          |
| D-020 | 2026-07-29 | Libro inmutable con transacciones, asientos y saldos proyectados       | Permite auditoría y actualizaciones atómicas con invariantes comprobables                                                                                                          |
| D-021 | 2026-07-29 | Tablas internas en `cashless` y superficie explícita en `api`          | Reduce exposición y obliga a declarar RLS, vistas, funciones y privilegios mínimos                                                                                                 |
| D-022 | 2026-07-29 | `Cashless Acapulco` usa Supabase `ypeabqwaragnnavvmgyg` en `us-east-1` | Fija el backend compartido del MVP; el costo confirmado al crearlo fue USD 0 mensual                                                                                               |
| D-023 | 2026-07-29 | `TISA OS Pilot` permanece pausado temporalmente                        | Libera el cupo gratuito para Cashless; la pausa es reversible y fue solicitada expresamente                                                                                        |
| D-024 | 2026-07-29 | El administrador usa correo y contraseña con recuperación por correo   | Usa Supabase Auth nativo; la cuenta inicial corresponde a `tisacorreo@gmail.com`                                                                                                   |
| D-025 | 2026-07-29 | La sesión del cliente dura ocho horas y no se renueva automáticamente  | Al vencer exige presentar de nuevo nombre y teléfono; reduce la exposición del acceso débil                                                                                        |
| D-026 | 2026-07-30 | El producto comercial se cancela y continúa como primer piloto demo    | Todo participante, evento, saldo y movimiento será ficticio; se conserva la arquitectura para demostrar el flujo, sin dinero real, datos personales reales ni producción comercial |

## Decisiones pendientes

Permanecen abiertas y se resolverán antes de la tarea indicada.

| ID    | Decisión necesaria                                                   | Tarea límite | Por qué importa               |
| ----- | -------------------------------------------------------------------- | ------------ | ----------------------------- |
| P-008 | Política para cerrar eventos con QR pendientes o saldos por liquidar | 2.3          | Define consistencia operativa |

## Criterio para nuevas decisiones

Registrar una decisión si modifica alcance, datos, seguridad, finanzas, infraestructura, flujo de colaboración o comportamiento visible. Los supuestos reversibles menores pueden documentarse en el commit de la tarea.
