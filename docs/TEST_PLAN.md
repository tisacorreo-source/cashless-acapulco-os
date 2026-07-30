# Plan de pruebas

## Objetivo

Demostrar que los flujos funcionan, los permisos separan roles y ninguna combinación de error o concurrencia deja saldos parciales, movimientos huérfanos o cobros duplicados.

## Capas

1. **Estáticas:** formato, lint y TypeScript.
2. **Unitarias:** validadores, cálculos, formato monetario y reglas de estados.
3. **Base de datos:** restricciones, RLS, funciones transaccionales e idempotencia.
4. **Integración:** React–Supabase y recorridos por rol.
5. **Extremo a extremo:** flujo operativo completo en navegador.
6. **Build y seguridad:** producción local, secretos, dependencias y configuración.

## Casos financieros obligatorios

| Flujo        | Caso esperado                                    | Casos de rechazo o recuperación                                |
| ------------ | ------------------------------------------------ | -------------------------------------------------------------- |
| Registro     | Crea cliente y registra responsable              | Teléfono o correo duplicado, campos inválidos                  |
| Recarga      | Aumenta saldo, exige evento e inserta movimiento | Fuera de $50–$1,000, sin evento, error intermedio, doble envío |
| QR           | Crea cobro pendiente con expiración              | Fuera de $50–$1,000, negocio fuera del evento                  |
| Compra       | Débito, crédito, venta y QR pagado atómicos      | Saldo insuficiente, vencido, usado, cancelado                  |
| Concurrencia | Solo una confirmación gana                       | Dos confirmaciones simultáneas no duplican venta               |
| Cancelación  | Compensa saldos; admite deuda posliquidación     | Doble reversión, permisos incorrectos                          |
| Retiro       | Reduce saldo y registra anterior/posterior       | Fuera de $50–$1,000 o superior al saldo                        |
| Liquidación  | Reduce pendiente positivo por evento             | Fuera de límites, deuda o superior al pendiente                |
| CSV          | Campos, totales y codificación correctos         | Sin datos, caracteres especiales, filtros                      |
| Demo         | Inserta una sola vez y limpia solo demo          | Ejecución repetida y datos reales coexistentes                 |

## Pruebas de permisos

- Personal permanente accede únicamente con correo y contraseña; la recuperación no permite enumerar cuentas.
- Una invitación o recuperación válida abre la creación de contraseña; un enlace vencido muestra una explicación segura y ofrece solicitar otro correo.
- Cliente requiere un usuario Auth anónimo más nombre y teléfono válidos; una cuenta permanente no puede reclamar ese acceso.
- La sesión del cliente vence exactamente a las ocho horas, un reingreso activo no la renueva y cerrar sesión la revoca antes de eliminar la sesión local.
- Cinco intentos inválidos bloquean el acceso durante quince minutos y devuelven mensajes que no identifican cuál dato falló.
- Cliente no lee ni modifica datos de otros clientes.
- Vendedor solo opera su negocio y eventos asignados.
- Administrador autorizado ejecuta operaciones administrativas.
- Usuario anónimo no consulta tablas operativas directamente salvo la superficie explícitamente diseñada.
- Frontend no contiene ni utiliza claves secretas.
- Las políticas se prueban con roles distintos; no basta revisar SQL.

## Casos físicos y de frontera

- Teléfonos nacionales e internacionales se normalizan a E.164; equivalentes nacionales colisionan con la misma clave única.
- Correos de cliente nulos se aceptan; correos equivalentes por mayúsculas o espacios se rechazan como duplicados.
- Para cada operación: 4999 centavos se rechaza, 5000 se acepta, 100000 se acepta y 100001 se rechaza.
- Varias operaciones válidas pueden elevar el saldo acumulado por encima de $1,000 MXN.
- Una recarga sin `event_id` se rechaza y nunca selecciona el evento automáticamente.
- Dos confirmaciones simultáneas del mismo QR producen una venta; dos débitos simultáneos nunca sobregiran al cliente.
- Un reintento con la misma idempotencia devuelve el resultado original; cambiar la carga con la misma clave falla.
- Cancelar una venta ya liquidada puede dejar deuda negocio–evento, que ventas nuevas amortizan antes de permitir otra liquidación.
- Operaciones, transacciones y asientos rechazan actualización y borrado directo.

## Validación visual

En mobile y escritorio verificar navegación, estados vacíos, formularios, mensajes claros, escaneo/lectura de QR, confirmaciones, carga y errores. Revisar consola y red. El código por sí solo no constituye validación visual.

La Tarea 1.6 validó los espacios de administrador, vendedor y cliente a 1440×1000 y 390×844. En cada perfil se activó al menos un módulo, se comprobó `aria-current`, ausencia de desbordamiento horizontal, ausencia de la pantalla de error de Vite y consola sin errores ni advertencias.

## Evidencia por tarea

Registrar en `docs/STATUS.md`:

- Comandos ejecutados y resultado.
- Pruebas manuales realizadas.
- URL o entorno probado cuando aplique.
- Errores conocidos.
- Commit de cierre.

## Base de datos reproducible

`supabase/tests/database/` contiene pruebas pgTAP versionadas. Con el stack local de Supabase activo:

```bash
pnpm exec supabase db reset
pnpm exec supabase test db
```

La Tarea 1.4 verificó además en el proyecto remoto, siempre con datos efímeros y `ROLLBACK`: 16/16 tablas con RLS, ausencia de escrituras directas, límites de monto, ledger inmutable, forma de recarga y visibilidad de administrador, vendedor y cliente.

La Tarea 1.5 añadió nueve comprobaciones pgTAP y una prueba funcional remota reversible para creación, no renovación y revocación del acceso limitado. La configuración alojada de Auth, el usuario administrativo, las redirecciones de invitación/recuperación y el envío real de correo quedaron validados después de resolver B-006.

## Puerta de despliegue

No desplegar con pruebas fallidas, permisos sin verificar, saldos inconsistentes, duplicación posible, migraciones no versionadas, secretos detectados o build de producción fallido.
