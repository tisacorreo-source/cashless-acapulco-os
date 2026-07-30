import type { AccessRole } from '../auth/access.ts'

export interface PilotMetric {
  label: string
  note: string
  value: string
}

export interface RoleNavigationItem {
  description: string
  id: string
  label: string
  nextStep: string
  title: string
}

export interface RoleNavigationConfig {
  description: string
  label: string
  metrics: readonly PilotMetric[]
  navigation: readonly RoleNavigationItem[]
}

export const roleNavigation = {
  admin: {
    label: 'Administración',
    description:
      'Control general del evento, participantes y trazabilidad del piloto.',
    metrics: [
      { label: 'Participantes', value: '5', note: 'registros ficticios' },
      { label: 'Negocios', value: '3', note: 'puntos demo' },
      { label: 'Evento', value: '1', note: 'simulación activa' },
    ],
    navigation: [
      {
        id: 'overview',
        label: 'Resumen',
        title: 'Centro de control del piloto',
        description:
          'Revisa el estado de la simulación y entra a cada módulo administrativo.',
        nextStep:
          'La información operativa se conectará conforme avance el plan.',
      },
      {
        id: 'clients',
        label: 'Clientes',
        title: 'Registro de clientes ficticios',
        description:
          'Alta, búsqueda y consulta de las identidades demo usadas en el piloto.',
        nextStep: 'Se implementa en la Tarea 2.1.',
      },
      {
        id: 'topups',
        label: 'Recargas',
        title: 'Recargas simuladas',
        description:
          'Captura de efectivo ficticio con evento, saldo anterior y posterior.',
        nextStep: 'Se implementa en la Tarea 2.2.',
      },
      {
        id: 'events',
        label: 'Eventos',
        title: 'Eventos y negocios participantes',
        description:
          'Configuración del evento demo y sus puntos de venta autorizados.',
        nextStep: 'Se implementa en la Tarea 2.3.',
      },
      {
        id: 'businesses',
        label: 'Negocios',
        title: 'Directorio de negocios demo',
        description:
          'Consulta de vendedores, participación y saldo simulado por evento.',
        nextStep: 'Se habilita junto con eventos y vendedores.',
      },
      {
        id: 'operations',
        label: 'Operaciones',
        title: 'Operaciones y reversiones',
        description:
          'Seguimiento de compras, cancelaciones, retiros y liquidaciones ficticias.',
        nextStep: 'Se completa durante la Entrega 2.',
      },
      {
        id: 'reports',
        label: 'Reportes',
        title: 'Reportes del piloto',
        description:
          'Vistas consolidadas y exportaciones CSV de la simulación.',
        nextStep: 'Se implementa en la Tarea 3.1.',
      },
    ],
  },
  seller: {
    label: 'Punto de venta',
    description:
      'Cobros QR y seguimiento del saldo ficticio del negocio por evento.',
    metrics: [
      { label: 'Cobros', value: '4', note: 'solicitudes demo' },
      { label: 'Saldo', value: '$1,280.00', note: 'MXN simulados' },
      { label: 'Evento', value: '1', note: 'asignación demo' },
    ],
    navigation: [
      {
        id: 'overview',
        label: 'Resumen',
        title: 'Resumen del punto de venta',
        description:
          'Consulta la simulación del negocio y accede a sus recorridos permitidos.',
        nextStep: 'Los valores son ilustrativos hasta conectar operaciones.',
      },
      {
        id: 'charge',
        label: 'Crear cobro',
        title: 'Generar un cobro QR',
        description:
          'Captura monto y descripción para crear una solicitud de cinco minutos.',
        nextStep: 'Se implementa en la Tarea 2.4.',
      },
      {
        id: 'sales',
        label: 'Ventas',
        title: 'Ventas del negocio',
        description:
          'Historial de cobros pagados, vencidos y cancelados del punto de venta.',
        nextStep: 'Se implementa en la Tarea 2.7.',
      },
      {
        id: 'balance',
        label: 'Saldo',
        title: 'Saldo por evento',
        description:
          'Detalle del saldo ficticio, deuda y liquidaciones del negocio.',
        nextStep: 'Se completa con ventas y liquidaciones.',
      },
    ],
  },
  client: {
    label: 'Cliente',
    description:
      'Saldo general, confirmación de compras y movimientos de la cuenta ficticia.',
    metrics: [
      { label: 'Saldo', value: '$780.00', note: 'MXN simulados' },
      { label: 'Movimientos', value: '6', note: 'registros demo' },
      { label: 'Compras', value: '2', note: 'confirmaciones demo' },
    ],
    navigation: [
      {
        id: 'overview',
        label: 'Mi saldo',
        title: 'Tu cuenta del piloto',
        description:
          'Consulta saldo, vigencia de acceso y atajos de la experiencia cliente.',
        nextStep: 'Los valores son ficticios y no representan dinero real.',
      },
      {
        id: 'scan',
        label: 'Escanear QR',
        title: 'Confirmar una compra',
        description:
          'Escanea una solicitud, revisa sus datos y decide si confirmas el pago.',
        nextStep: 'Se implementa en la Tarea 2.5.',
      },
      {
        id: 'movements',
        label: 'Movimientos',
        title: 'Historial de movimientos',
        description:
          'Recargas, compras, retiros y reversiones de la identidad ficticia.',
        nextStep: 'Se implementa en la Tarea 2.7.',
      },
      {
        id: 'withdrawal',
        label: 'Retiro',
        title: 'Solicitud de retiro presencial',
        description:
          'Consulta el recorrido para retirar saldo ficticio con un administrador.',
        nextStep: 'Se implementa en la Tarea 2.9.',
      },
    ],
  },
} as const satisfies Record<AccessRole, RoleNavigationConfig>
