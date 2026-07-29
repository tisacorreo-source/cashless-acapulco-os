# Contexto del proyecto

## Producto

Sistema Cashless Acapulco es una aplicación web para operar dinero digital en eventos recurrentes. Reemplaza el intercambio directo de efectivo en negocios participantes con recargas administradas, cobros QR confirmados por el cliente y un historial financiero auditable.

## Usuarios

- **Administrador:** registra participantes, recibe efectivo, administra eventos y negocios, cancela ventas, procesa retiros y liquidaciones, consulta y exporta información.
- **Cliente:** accede con nombre y teléfono durante el MVP, consulta saldo e historial, escanea QR y confirma compras.
- **Negocio o vendedor:** accede con correo y contraseña, genera cobros QR y consulta ventas y saldo por evento.

## Resultado esperado del MVP

Un evento demo debe poder recorrerse de principio a fin: crear participantes, cargar saldo, generar y confirmar una compra, impedir cobros inválidos o duplicados, cancelar una venta mediante reversión, retirar saldo, liquidar un negocio y exportar los registros.

## Clasificación técnica

Producto complejo con datos financieros operativos. Requiere transacciones atómicas, autorización por rol, trazabilidad permanente, pruebas de concurrencia, migraciones versionadas, RLS, estrategia de recuperación y validación en local, preview y producción.

## Arquitectura acordada

- SPA React con TypeScript y Vite.
- Supabase para PostgreSQL, autenticación y lógica transaccional autorizada.
- GitHub público como fuente de verdad remota cuando se autorice su creación.
- Vercel para previews y producción.
- Interfaz mobile-first en español y moneda MXN.

El modelo físico, las políticas y las funciones transaccionales se diseñarán antes de crear tablas. Ver `docs/DATA_MODEL.md`.

## Alcance excluido

- Comprobantes de compra, retiro o liquidación.
- Comisiones y porcentajes.
- Múltiples administradores o usuarios por negocio.
- Métodos de pago distintos al efectivo recibido por el administrador.
- Autenticación robusta de clientes más allá de la limitación aceptada para el MVP.

## Criterio global de terminado

El MVP está terminado cuando todos los flujos definidos están implementados y probados, no hay saldos inconsistentes ni operaciones duplicables, las políticas de acceso impiden lecturas y escrituras indebidas, los CSV son correctos, los datos demo se pueden insertar y limpiar sin dañar datos reales, el build local pasa y la versión desplegada ha sido validada mediante navegador.

## Decisiones pendientes relevantes

Las decisiones abiertas no se resolverán por suposición cuando afecten finanzas, seguridad o infraestructura. La lista vigente se encuentra en `docs/DECISIONS.md` y se atenderá en la tarea donde se vuelva necesaria.
