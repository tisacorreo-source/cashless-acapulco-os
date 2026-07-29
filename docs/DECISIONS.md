# Registro de decisiones

Las decisiones confirmadas no deben reinterpretarse silenciosamente. Un cambio se registra aquí con fecha, motivo e impacto.

## Decisiones vigentes

| ID    | Fecha      | Decisión                                                             | Motivo e impacto                                                                         |
| ----- | ---------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| D-001 | 2026-07-29 | React + TypeScript + Vite para el frontend                           | Stack definido por el responsable del producto; prevalece sobre defaults de herramientas |
| D-002 | 2026-07-29 | Supabase/PostgreSQL como backend                                     | Centraliza datos, autenticación y transacciones; exige migraciones y RLS                 |
| D-003 | 2026-07-29 | GitHub público será la fuente remota                                 | Facilita colaboración; eleva la exigencia de revisión de secretos                        |
| D-004 | 2026-07-29 | Vercel será la plataforma de despliegue                              | Se usarán previews antes de producción                                                   |
| D-005 | 2026-07-29 | Un proyecto Supabase para desarrollo y producción durante el MVP     | Simplifica operación, pero exige separación estricta de datos demo y controles de cambio |
| D-006 | 2026-07-29 | El saldo del cliente es global y el del negocio se separa por evento | Determina claves, reportes y reglas de liquidación                                       |
| D-007 | 2026-07-29 | Los movimientos financieros son permanentes                          | Correcciones mediante compensación, nunca edición o eliminación                          |
| D-008 | 2026-07-29 | Acceso de cliente por nombre y teléfono                              | Limitación aceptada del MVP; debe documentarse y contenerse mediante backend seguro      |
| D-009 | 2026-07-29 | Ejecución secuencial con avance automático                           | Solo se pausa ante bloqueo, acceso, seguridad, destrucción o producción                  |
| D-010 | 2026-07-29 | README y STATUS serán índices vivos                                  | Cada cambio estructural o de tarea debe mantener el contexto para relevos                |
| D-011 | 2026-07-29 | Node.js 24 LTS y pnpm 11.9 para la base local                        | Mantiene compatibilidad con Vite 8 y fija la resolución mediante lockfile                |
| D-012 | 2026-07-29 | Oxlint, Prettier y Vitest como herramientas iniciales                | Sigue el template oficial actual de Vite y añade formato y pruebas reproducibles         |

## Decisiones pendientes

No bloquean la documentación inicial. Se resolverán antes de la tarea indicada.

| ID    | Decisión necesaria                                                   | Tarea límite | Por qué importa                                   |
| ----- | -------------------------------------------------------------------- | ------------ | ------------------------------------------------- |
| P-001 | Contraseña o PIN para el administrador y política de recuperación    | 1.5          | Define autenticación, UX y riesgo operativo       |
| P-002 | Normalización exacta de teléfonos mexicanos e internacionales        | 1.3/1.5      | Afecta unicidad, acceso y duplicados              |
| P-003 | Si el correo del cliente es obligatorio y único o solo informativo   | 1.3          | Afecta restricciones y registro                   |
| P-004 | Zona horaria canónica de eventos y reportes                          | 1.3          | Afecta expiración de QR, fechas y CSV             |
| P-005 | Precisión y límites técnicos de importes                             | 1.3          | Afecta tipos SQL, validaciones y pruebas          |
| P-006 | Qué evento se asocia a una recarga cuando no hay uno activo          | 1.3/2.2      | El saldo es global, pero el reporte exige evento  |
| P-007 | Política para cancelar una venta cuando el negocio ya fue liquidado  | 1.3/2.8      | Puede producir saldo negativo o deuda del negocio |
| P-008 | Política para cerrar eventos con QR pendientes o saldos por liquidar | 2.3          | Define consistencia operativa                     |
| P-009 | Nombre definitivo del repositorio público                            | 1.2          | Necesario para crear y vincular GitHub            |

## Criterio para nuevas decisiones

Registrar una decisión si modifica alcance, datos, seguridad, finanzas, infraestructura, flujo de colaboración o comportamiento visible. Los supuestos reversibles menores pueden documentarse en el commit de la tarea.
