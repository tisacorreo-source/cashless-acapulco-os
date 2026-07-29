# Requisitos de producto

## Objetivo

Construir un MVP web cashless para eventos recurrentes que conserve saldos, ejecute cobros atómicos, permita operación administrativa y mantenga trazabilidad permanente de cada cambio financiero.

## Roles y acceso

### Administrador

Durante el MVP existirá una sola cuenta. Accederá con usuario y contraseña o PIN; el mecanismo exacto se decidirá en la tarea de autenticación. Puede crear eventos y negocios, asignarlos, registrar clientes, recargar, consultar, cancelar ventas, retirar saldo, liquidar negocios y exportar información.

### Cliente

Se registra en un punto autorizado con nombre, teléfono y correo. El teléfono es único. Accede con nombre y teléfono como limitación aceptada del MVP. Puede consultar saldo e historial, escanear un QR, revisar el cobro, confirmar una compra y solicitar un retiro presencial.

### Negocio

Se registra con nombre y correo. Un usuario por negocio accede con correo y contraseña. Puede consultar sus ventas y saldos, capturar monto y descripción, generar un QR dinámico y consultar su estado. No puede recargar, cancelar, liquidar ni consultar otros negocios.

## Requisitos funcionales

### Registro y recarga

1. El administrador registra o localiza al cliente.
2. Captura el efectivo recibido y confirma la operación.
3. El sistema valida que el monto sea mayor que cero.
4. Registra saldo anterior, importe, saldo posterior, fecha, evento y responsable.
5. Aumenta el saldo general del cliente dentro de la misma transacción.

No existen límites mínimos o máximos para el MVP.

### Eventos

- Cada evento tiene nombre, fechas y estado `activo` o `cerrado`.
- Un negocio puede participar en varios eventos.
- Las operaciones guardan el evento aplicable.
- El saldo del cliente se conserva entre eventos.
- El saldo del negocio es independiente por evento.

### Cobro y compra

1. El vendedor captura monto positivo y descripción libre.
2. El sistema crea una solicitud con identificador, negocio, evento, creación, expiración y estado.
3. El QR vence aproximadamente cinco minutos después de su creación.
4. El cliente ve negocio, descripción, importe, evento y saldo disponible.
5. Solo una confirmación explícita intenta el pago.
6. El sistema valida vigencia, estado y saldo.
7. En una sola transacción descuenta al cliente, acredita al negocio, registra venta y movimientos, y marca el QR pagado.

Estados de solicitud: `pendiente`, `pagado`, `vencido`, `cancelado`.

### Cancelación administrativa

- Requiere motivo y administrador responsable.
- Devuelve saldo al cliente y reduce el saldo del negocio de forma atómica.
- Conserva la venta original y crea una reversión relacionada.
- No admite doble reversión.

### Retiro de cliente

- Solo lo procesa el administrador en el punto autorizado.
- Muestra saldo actual, monto y saldo restante antes de confirmar.
- No admite cero, negativos ni importes superiores al saldo.
- Registra saldos anterior y posterior.

### Liquidación de negocio

- Se seleccionan negocio y evento.
- Se muestran bruto vendido, cancelaciones, liquidaciones previas y saldo pendiente.
- El importe debe ser positivo y no superar el saldo pendiente.
- Una liquidación total deja el saldo en cero, sin impedir ventas posteriores.

### Historiales

- Cliente: recargas, compras, retiros y reversiones.
- Negocio: ventas, cancelaciones y liquidaciones propias.
- Administrador: todos los movimientos.

### Exportaciones CSV

- Transacciones.
- Ventas por negocio.
- Asistentes.
- Recargas.
- Retiros.
- Liquidaciones.

Los campos mínimos de cada archivo están enumerados en `docs/DATA_MODEL.md` y deberán validarse en la tarea de exportaciones.

### Datos demo

Un administrador, tres negocios, cinco clientes, un evento activo, recargas, ventas, una cancelación, un retiro y una liquidación. Los scripts deben ser idempotentes, identificar datos demo y limpiarlos sin afectar datos reales.

## Requisitos no funcionales

- Mobile-first, usable también en escritorio.
- Interfaz inicial en español y montos en pesos mexicanos.
- Operaciones financieras atómicas e idempotentes.
- Historial inmutable; no se eliminan movimientos.
- RLS y autorización por rol probadas.
- Sin secretos en frontend, documentación, logs o Git.
- Migraciones versionadas y reproducibles.
- Builds, pruebas y validación visual obligatorios antes de desplegar.

## Fuera de alcance

Comprobantes, comisiones, porcentajes, múltiples administradores, múltiples usuarios por negocio y autenticación robusta del cliente.
