# Contexto del proyecto

## Producto

Sistema Cashless Acapulco es un piloto web para demostrar la operación de dinero digital en eventos recurrentes. Simula recargas administradas, cobros QR confirmados por el cliente y un historial financiero auditable sin vender el sistema ni operar dinero o datos personales reales.

## Usuarios

- **Administrador:** registra participantes, recibe efectivo, administra eventos y negocios, cancela ventas, procesa retiros y liquidaciones, consulta y exporta información.
- **Cliente:** accede con nombre y teléfono durante el MVP, consulta saldo e historial, escanea QR y confirma compras.
- **Negocio o vendedor:** accede con correo y contraseña, genera cobros QR y consulta ventas y saldo por evento.

## Resultado esperado del piloto

Un evento ficticio debe poder recorrerse de principio a fin: crear participantes demo, cargar saldo simulado, generar y confirmar una compra, impedir cobros inválidos o duplicados, cancelar una venta mediante reversión, retirar saldo, liquidar un negocio y exportar los registros.

## Clasificación técnica

Piloto técnico complejo con lógica financiera simulada. Conserva transacciones atómicas, autorización por rol, trazabilidad permanente, pruebas de concurrencia, migraciones versionadas, RLS y recuperación para demostrar un comportamiento correcto, aunque no procesará dinero real ni se promoverá como producto comercial.

## Arquitectura acordada

- SPA React con TypeScript y Vite.
- Supabase para PostgreSQL, autenticación y lógica transaccional autorizada.
- GitHub público como fuente de verdad remota.
- Vercel para previews y producción.
- Interfaz mobile-first en español y moneda MXN.

El modelo físico, las políticas y las funciones transaccionales están definidos antes de crear tablas. Ver `docs/DATA_MODEL.md`.

## Alcance excluido

- Comprobantes de compra, retiro o liquidación.
- Comisiones y porcentajes.
- Múltiples administradores o usuarios por negocio.
- Métodos de pago distintos al efectivo recibido por el administrador.
- Autenticación robusta de clientes más allá de la limitación aceptada para el MVP.
- Comercialización, operación pública en producción, datos personales reales y dinero real.

## Criterio global de terminado

El primer piloto está terminado cuando los flujos definidos pueden demostrarse con datos ficticios, no hay saldos inconsistentes ni operaciones duplicables, las políticas de acceso impiden lecturas y escrituras indebidas, los CSV son correctos, los datos demo son idempotentes, el build local pasa y un preview controlado ha sido validado mediante navegador.

## Decisiones pendientes relevantes

Las decisiones abiertas no se resolverán por suposición cuando afecten finanzas, seguridad o infraestructura. La lista vigente se encuentra en `docs/DECISIONS.md` y se atenderá en la tarea donde se vuelva necesaria.
