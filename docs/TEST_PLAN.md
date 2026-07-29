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

| Flujo        | Caso esperado                               | Casos de rechazo o recuperación                  |
| ------------ | ------------------------------------------- | ------------------------------------------------ |
| Registro     | Crea cliente y registra responsable         | Teléfono duplicado, campos inválidos             |
| Recarga      | Aumenta saldo e inserta movimiento          | Cero, negativo, error intermedio, doble envío    |
| QR           | Crea cobro pendiente con expiración         | Monto inválido, negocio fuera del evento         |
| Compra       | Débito, crédito, venta y QR pagado atómicos | Saldo insuficiente, vencido, usado, cancelado    |
| Concurrencia | Solo una confirmación gana                  | Dos confirmaciones simultáneas no duplican venta |
| Cancelación  | Compensa ambos saldos y conserva venta      | Doble reversión, permisos incorrectos            |
| Retiro       | Reduce saldo y registra anterior/posterior  | Superior al saldo, cero, negativo                |
| Liquidación  | Reduce pendiente por evento                 | Superior al pendiente, negocio/evento incorrecto |
| CSV          | Campos, totales y codificación correctos    | Sin datos, caracteres especiales, filtros        |
| Demo         | Inserta una sola vez y limpia solo demo     | Ejecución repetida y datos reales coexistentes   |

## Pruebas de permisos

- Cliente no lee ni modifica datos de otros clientes.
- Vendedor solo opera su negocio y eventos asignados.
- Administrador autorizado ejecuta operaciones administrativas.
- Usuario anónimo no consulta tablas operativas directamente salvo la superficie explícitamente diseñada.
- Frontend no contiene ni utiliza claves secretas.
- Las políticas se prueban con roles distintos; no basta revisar SQL.

## Validación visual

En mobile y escritorio verificar navegación, estados vacíos, formularios, mensajes claros, escaneo/lectura de QR, confirmaciones, carga y errores. Revisar consola y red. El código por sí solo no constituye validación visual.

## Evidencia por tarea

Registrar en `docs/STATUS.md`:

- Comandos ejecutados y resultado.
- Pruebas manuales realizadas.
- URL o entorno probado cuando aplique.
- Errores conocidos.
- Commit de cierre.

## Puerta de despliegue

No desplegar con pruebas fallidas, permisos sin verificar, saldos inconsistentes, duplicación posible, migraciones no versionadas, secretos detectados o build de producción fallido.
