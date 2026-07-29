# Modelo de datos conceptual

Este documento define el modelo conceptual inicial. El esquema físico, tipos, claves, índices, funciones y políticas se cerrarán en la Tarea 1.3 antes de crear tablas.

## Entidades principales

| Entidad | Responsabilidad | Relaciones esenciales |
| --- | --- | --- |
| Administrador | Identidad y auditoría de operaciones administrativas | Registra clientes, recargas, retiros, cancelaciones y liquidaciones |
| Cliente | Identidad del asistente y titular de saldo general | Tiene movimientos, recargas, compras, retiros y reversiones |
| Negocio | Proveedor reutilizable entre eventos | Tiene usuario vendedor y participaciones por evento |
| Evento | Periodo operativo activo o cerrado | Agrupa participaciones, recargas, cobros, ventas y liquidaciones |
| Participación | Unión negocio–evento | Define alcance de ventas y balance del negocio por evento |
| Solicitud de cobro | Intención temporal de compra representada por QR | Pertenece a participación; puede originar una venta |
| Venta | Compra confirmada e inmutable | Relaciona cliente, negocio, evento, cobro y movimientos |
| Movimiento financiero | Libro permanente de cambios de valor | Referencia la operación origen y saldos anterior/posterior cuando aplique |
| Recarga | Efectivo recibido y crédito a cliente | Pertenece a cliente, evento y administrador |
| Retiro | Débito a cliente y efectivo entregado | Pertenece a cliente y administrador |
| Reversión | Compensación de una venta | Relaciona venta original, motivo y administrador |
| Liquidación | Pago al negocio y reducción de su balance | Pertenece a negocio, evento y administrador |

## Separación de saldos

- El cliente mantiene un saldo general entre eventos.
- El negocio mantiene un balance independiente para cada participación negocio–evento.
- Los saldos son proyecciones controladas del libro de movimientos; nunca se modifican sin insertar el movimiento correspondiente.

## Tipos conceptuales de movimiento

- Crédito de cliente por recarga.
- Débito de cliente por compra.
- Crédito de negocio por venta.
- Crédito de cliente por reversión.
- Débito de negocio por reversión.
- Débito de cliente por retiro.
- Débito de negocio por liquidación.

Cada operación puede producir más de un asiento relacionado por una referencia transaccional común.

## Invariantes

1. Los importes son positivos; la dirección se representa mediante tipo o lado del movimiento.
2. No se usa punto flotante binario para dinero.
3. El saldo de un cliente no puede quedar negativo.
4. Una solicitud de cobro produce como máximo una venta.
5. Una venta produce como máximo una reversión.
6. Toda compra, reversión, recarga, retiro o liquidación es atómica.
7. Los movimientos y operaciones concluidas no se eliminan.
8. Toda fila auditable incluye identificador, creación y actor o contexto de ejecución.
9. Las referencias de idempotencia y restricciones únicas protegen confirmaciones concurrentes.
10. La autorización se valida en servidor/base de datos, no solo en componentes React.

## Estados conceptuales

- Evento: `activo`, `cerrado`.
- Solicitud de cobro: `pendiente`, `pagado`, `vencido`, `cancelado`.
- Venta: activa o revertida mediante relación, sin borrar la venta.
- Operaciones administrativas: confirmadas; cualquier corrección futura usa compensación.

## Reportes y campos mínimos

- **Transacciones:** fecha, tipo, evento, cliente, negocio, importe, estado, referencia y motivo de cancelación.
- **Ventas por negocio:** evento, negocio, bruto, cancelado, liquidado y pendiente.
- **Asistentes:** nombre, teléfono, correo, total recargado, total gastado y saldo.
- **Recargas:** cliente, evento, monto, fecha y administrador.
- **Retiros:** cliente, monto, fecha, saldo anterior y posterior.
- **Liquidaciones:** negocio, evento, vendido, cancelaciones, monto liquidado y fecha.

## Asuntos por cerrar en el diseño físico

- Normalización de teléfonos.
- Precisión y límites de importes.
- Zona horaria y tipo de fecha.
- Asociación de recargas con eventos.
- Cancelaciones posteriores a una liquidación.
- Estrategia exacta de identidad y RLS para cada rol.
- Si los saldos se almacenan con triggers/funciones o se derivan con una proyección controlada.
