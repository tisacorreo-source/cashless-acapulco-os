# Sistema Cashless Acapulco

Aplicación web mobile-first para operar saldo digital en eventos recurrentes. El MVP permitirá registrar clientes y negocios, administrar eventos, recibir recargas en efectivo, cobrar mediante QR, conservar un libro de movimientos financieros, efectuar reversiones, retiros y liquidaciones, y exportar información administrativa.

Este archivo es el índice vivo del repositorio. Si una persona llega por primera vez al proyecto, debe comenzar aquí y continuar con [`PROJECT.md`](PROJECT.md), [`docs/STATUS.md`](docs/STATUS.md) y [`docs/ACTION_PLAN.md`](docs/ACTION_PLAN.md).

## Estado actual

| Campo | Estado |
| --- | --- |
| Fase | Entrega 0 — Descubrimiento y preparación |
| Última tarea terminada | Tarea 0.3 — Crear documentación inicial |
| Tarea en curso | Ninguna; la siguiente tarea está bloqueada por el entorno |
| Próxima tarea | Resolver Node.js e iniciar la Tarea 1.1 — Crear proyecto React + TypeScript + Vite |
| Código funcional | Aún no creado |
| Repositorio remoto | Aún no creado ni vinculado |
| Despliegue | Aún no realizado |
| Bloqueo conocido | Node.js y npm no están disponibles en el `PATH` |

El detalle y la bitácora se mantienen en [`docs/STATUS.md`](docs/STATUS.md).

## Índice de archivos

```text
.
├── .env.example                 # Variables públicas requeridas, sin secretos
├── .gitignore                   # Exclusiones de Git y protección de secretos
├── AGENTS.md                    # Reglas persistentes para agentes y colaboradores
├── PROJECT.md                   # Contexto ejecutivo, alcance y arquitectura
├── README.md                    # Índice principal y guía de entrada
└── docs/
    ├── ACTION_PLAN.md           # Plan secuencial y estado por tarea
    ├── DATA_MODEL.md            # Modelo conceptual e invariantes financieras
    ├── DECISIONS.md             # Decisiones tomadas y asuntos pendientes
    ├── DEPLOYMENT.md            # Estrategia local, preview y producción
    ├── ENVIRONMENT.md           # Inventario verificado del entorno y conexiones
    ├── PRODUCT_REQUIREMENTS.md  # Requisitos funcionales y no funcionales
    ├── STATUS.md                # Bitácora, relevo y siguiente acción
    ├── TEST_PLAN.md             # Estrategia y casos de prueba obligatorios
    └── WORKFLOW.md              # Flujo Git y colaboración entre programadores
```

El índice debe actualizarse en el mismo commit que agregue, elimine o cambie el propósito de un archivo o directorio relevante.

## Alcance del MVP

- Un administrador con control operativo general.
- Clientes registrados por nombre, teléfono único y correo.
- Negocios con un usuario vendedor por negocio.
- Eventos recurrentes y participación de negocios por evento.
- Saldo general del cliente, conservado entre eventos.
- Saldo de cada negocio separado por evento.
- Recargas, cobros QR con vigencia de cinco minutos y confirmación explícita.
- Historiales, cancelaciones compensatorias, retiros y liquidaciones.
- Exportaciones CSV y datos demo identificables y reversibles.

Los comprobantes de compra, retiro y liquidación; comisiones; porcentajes; múltiples administradores y autenticación avanzada quedan fuera del MVP inicial.

## Stack acordado

- React
- TypeScript
- Vite
- Supabase y PostgreSQL
- Git y GitHub público
- Vercel
- Interfaz mobile-first en español
- Pesos mexicanos como moneda

## Requisitos locales

- Git.
- Node.js en una versión LTS compatible con la versión de Vite que se seleccione.
- Gestor de paquetes definido y fijado por lockfile en la Tarea 1.1.
- Acceso autorizado a GitHub, Supabase y Vercel cuando corresponda.

Estado verificado el 2026-07-29: Git y pnpm están disponibles; Node.js y npm no están en el `PATH`. Consultar [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md).

## Instalación y ejecución local

Los comandos exactos se incorporarán en la Tarea 1.1, después de crear y validar el proyecto Vite. No se publican comandos especulativos.

## Variables de entorno

1. Copiar `.env.example` a `.env.local` cuando exista una instancia de Supabase autorizada.
2. Completar únicamente los valores públicos necesarios para el cliente web.
3. Nunca usar una clave `service_role` o secreta en variables con prefijo `VITE_`.
4. No confirmar archivos `.env*`; `.env.example` es la única excepción.

## Migraciones y datos demo

Las migraciones versionadas vivirán en `supabase/migrations/` cuando se complete el diseño de datos y se conecte Supabase. Los datos demo tendrán scripts de inserción y limpieza idempotentes, claramente marcados para no afectar información real.

## Pruebas

Todavía no existe código ejecutable. La estrategia, las capas y los escenarios financieros obligatorios están definidos en [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md). Cada tarea funcional deberá agregar y ejecutar sus pruebas antes de cerrarse.

## Despliegue

El flujo será local → rama de trabajo → GitHub → preview de Vercel → producción aprobada. No se desplegará mientras existan fallas de build, pruebas, permisos, saldos, secretos o idempotencia. Consultar [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Cómo retomar el trabajo

1. Leer este README.
2. Leer [`PROJECT.md`](PROJECT.md) y [`AGENTS.md`](AGENTS.md).
3. Revisar [`docs/STATUS.md`](docs/STATUS.md), [`docs/DECISIONS.md`](docs/DECISIONS.md) y [`docs/ACTION_PLAN.md`](docs/ACTION_PLAN.md).
4. Ejecutar `git status --short --branch` y revisar cambios locales antes de editar.
5. Trabajar solo en la tarea marcada como activa.
6. Probar, documentar y hacer un commit específico antes de avanzar.

## Documentación

| Documento | Propósito |
| --- | --- |
| [`PROJECT.md`](PROJECT.md) | Resumen ejecutivo del producto y su arquitectura |
| [`AGENTS.md`](AGENTS.md) | Reglas obligatorias de trabajo dentro del repositorio |
| [`docs/PRODUCT_REQUIREMENTS.md`](docs/PRODUCT_REQUIREMENTS.md) | Requisitos del MVP y reglas operativas |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Decisiones, motivos y preguntas aún abiertas |
| [`docs/ACTION_PLAN.md`](docs/ACTION_PLAN.md) | Secuencia completa de ejecución y criterios de cierre |
| [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) | Modelo conceptual y restricciones financieras |
| [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) | Pruebas funcionales, financieras y de seguridad |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Entornos, variables, publicación y rollback |
| [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md) | Herramientas y conexiones comprobadas |
| [`docs/WORKFLOW.md`](docs/WORKFLOW.md) | Ramas, commits, pull requests y relevo |
| [`docs/STATUS.md`](docs/STATUS.md) | Estado vivo y bitácora de tareas |
