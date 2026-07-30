# Sistema Cashless Acapulco

Aplicación web mobile-first para operar saldo digital en eventos recurrentes. El MVP permitirá registrar clientes y negocios, administrar eventos, recibir recargas en efectivo, cobrar mediante QR, conservar un libro de movimientos financieros, efectuar reversiones, retiros y liquidaciones, y exportar información administrativa.

Este archivo es el índice vivo del repositorio. Si una persona llega por primera vez al proyecto, debe comenzar aquí y continuar con [`PROJECT.md`](PROJECT.md), [`docs/STATUS.md`](docs/STATUS.md) y [`docs/ACTION_PLAN.md`](docs/ACTION_PLAN.md).

## Estado actual

| Campo                  | Estado                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Fase                   | Entrega 1 — Base funcional local                                                                                          |
| Última tarea terminada | Tarea 1.5 — Implementar autenticación y acceso                                                                            |
| Tarea en curso         | Ninguna; la Tarea 1.5 quedó cerrada mediante el PR [#3](https://github.com/tisacorreo-source/cashless-acapulco-os/pull/3) |
| Próxima tarea          | Tarea 1.6 — Crear navegación y estructura visual                                                                          |
| Código funcional       | Portal de acceso por rol conectado y Auth alojado validado                                                                |
| Repositorio remoto     | [`tisacorreo-source/cashless-acapulco-os`](https://github.com/tisacorreo-source/cashless-acapulco-os)                     |
| Despliegue             | Aún no realizado                                                                                                          |
| Bloqueo conocido       | Ninguno                                                                                                                   |
| Acción del titular     | Ninguna                                                                                                                   |

El detalle y la bitácora se mantienen en [`docs/STATUS.md`](docs/STATUS.md).

## Índice de archivos

```text
.
├── .editorconfig                # Convenciones básicas de editores
├── .env.example                 # Variables públicas requeridas, sin secretos
├── .gitignore                   # Exclusiones de Git y protección de secretos
├── .npmrc                       # Instalación estricta y versiones exactas
├── .nvmrc                       # Línea Node.js 24 LTS
├── .oxlintrc.json               # Reglas de lint para React y TypeScript
├── .prettierignore              # Exclusiones del formateador
├── .prettierrc.json             # Estilo de formato compartido
├── AGENTS.md                    # Reglas persistentes para agentes y colaboradores
├── PROJECT.md                   # Contexto ejecutivo, alcance y arquitectura
├── README.md                    # Índice principal y guía de entrada
├── docs/
    ├── ACTION_PLAN.md           # Plan secuencial y estado por tarea
    ├── DATA_MODEL.md            # Esquema físico, transacciones, índices y RLS
    ├── DECISIONS.md             # Decisiones tomadas y asuntos pendientes
    ├── DEPLOYMENT.md            # Estrategia local, preview y producción
    ├── ENVIRONMENT.md           # Inventario verificado del entorno y conexiones
    ├── PRODUCT_REQUIREMENTS.md  # Requisitos funcionales y no funcionales
    ├── STATUS.md                # Bitácora, relevo y siguiente acción
    ├── TEST_PLAN.md             # Estrategia y casos de prueba obligatorios
    └── WORKFLOW.md              # Flujo Git y colaboración entre programadores
├── index.html                   # Documento raíz de la SPA
├── package.json                 # Scripts, motores y dependencias directas
├── pnpm-lock.yaml               # Resolución exacta de dependencias
├── pnpm-workspace.yaml          # Políticas de Node, supply chain y peers
├── src/
│   ├── App.test.tsx             # Prueba base de interfaz y accesibilidad
│   ├── App.tsx                  # Portada técnica y punto de entrada al acceso
│   ├── features/auth/
│   │   ├── AccessPortal.test.tsx # Pruebas de formularios y recorridos por rol
│   │   ├── AccessPortal.tsx     # Portal de personal, cliente y recuperación
│   │   ├── access.test.ts       # Pruebas de normalización y contraseña
│   │   └── access.ts            # Servicio de Supabase Auth y RPC de acceso
│   ├── lib/
│   │   ├── supabase.test.ts     # Pruebas de configuración pública segura
│   │   └── supabase.ts          # Cliente Supabase lazy, tipado y limitado a api
│   ├── main.tsx                 # Punto de montaje de React
│   ├── styles.css               # Sistema visual mobile-first inicial
│   ├── test/setup.ts            # Configuración de Testing Library
│   ├── types/database.ts        # Contrato TypeScript de la superficie Data API
│   └── vite-env.d.ts            # Tipos del entorno Vite
├── supabase/
│   ├── .gitignore               # Estado local de Supabase excluido de Git
│   ├── config.toml              # Configuración local; sólo api queda expuesto
│   ├── migrations/
│   │   ├── 20260730011421_create_cashless_schema.sql
│   │   │                           # Esquema físico, índices, RLS e invariantes
│   │   └── 20260730015644_implement_authentication_access.sql
│   │                               # Roles, sesiones de ocho horas, intentos y RPC
│   ├── seed.sql                 # Punto de entrada reservado para datos demo
│   └── tests/database/
│       ├── 0001_schema_contract.test.sql
│       │                           # Contrato pgTAP de estructura y privilegios
│       └── 0002_authentication_contract.test.sql
│                                   # Contrato pgTAP de autenticación y acceso
├── tsconfig.app.json            # TypeScript para la aplicación
├── tsconfig.json                # Referencias TypeScript del proyecto
├── tsconfig.node.json           # TypeScript para configuración y tooling
├── vite.config.ts               # Configuración de Vite y React
└── vitest.config.ts             # Configuración de pruebas unitarias
```

El índice debe actualizarse en el mismo commit que agregue, elimine o cambie el propósito de un archivo o directorio relevante.

## Alcance del MVP

- Un administrador con control operativo general.
- Clientes registrados por nombre, teléfono único y correo opcional único cuando exista.
- Negocios con un usuario vendedor por negocio.
- Eventos recurrentes y participación de negocios por evento.
- Saldo general del cliente, conservado entre eventos.
- Saldo de cada negocio separado por evento.
- Recargas, cobros QR con vigencia de cinco minutos y confirmación explícita.
- Historiales, cancelaciones compensatorias, retiros y liquidaciones.
- Exportaciones CSV y datos demo identificables y reversibles.

Los comprobantes de compra, retiro y liquidación; comisiones; porcentajes; múltiples administradores y autenticación avanzada quedan fuera del MVP inicial.

## Stack acordado

- React 19.2
- TypeScript 6
- Vite 8
- Node.js 24 LTS y pnpm 11.9
- Oxlint, Prettier, Vitest y Testing Library
- Supabase y PostgreSQL
- Supabase JS 2.111 y CLI 2.110
- Git y GitHub público
- Vercel
- Interfaz mobile-first en español
- Pesos mexicanos como moneda

## Requisitos locales

- Git.
- Node.js `>=24.14.0 <25`; `.nvmrc` fija la línea 24 LTS.
- pnpm `>=11.9.0 <12`.
- Acceso autorizado a GitHub, Supabase y Vercel cuando corresponda.

Estado verificado el 2026-07-29: Git y pnpm están disponibles; el entorno de trabajo incluye Node.js v24.14.0 LTS aunque no esté en el `PATH` general. Consultar [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md).

## Instalación y ejecución local

Con Node.js 24 y pnpm 11 instalados:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Vite sirve la aplicación en `http://localhost:5173` por defecto. Para revisar el build local:

```bash
pnpm build
pnpm preview
```

Quienes usan nvm pueden ejecutar `nvm use` para seleccionar la línea indicada en `.nvmrc`.

## Comandos de calidad

```bash
pnpm format:check  # Comprueba formato sin modificar archivos
pnpm lint          # Ejecuta Oxlint
pnpm typecheck     # Valida TypeScript
pnpm test          # Ejecuta Vitest una vez
pnpm check         # Ejecuta todas las validaciones y el build
```

## Variables de entorno

1. Copiar `.env.example` a `.env.local` cuando exista una instancia de Supabase autorizada.
2. Completar únicamente los valores públicos necesarios para el cliente web.
3. Nunca usar una clave `service_role` o secreta en variables con prefijo `VITE_`.
4. No confirmar archivos `.env*`; `.env.example` es la única excepción.

## Supabase, migraciones y datos demo

El proyecto remoto activo es `Cashless Acapulco` (`ypeabqwaragnnavvmgyg`). La aplicación sólo expone el esquema `api`; las tablas del esquema `cashless` se consumen mediante vistas y RPC revisadas conforme se implementen. Las dos migraciones del repositorio están aplicadas en el historial remoto.

Con Docker disponible, el flujo local reproducible es:

```bash
pnpm exec supabase start
pnpm exec supabase db reset
pnpm exec supabase test db
```

Crear una migración únicamente mediante `pnpm exec supabase migration new <nombre>`. Nunca editar una migración que ya fue aplicada; usar una migración correctiva. `supabase/seed.sql` queda reservado para la Tarea 3.2 y no inserta datos todavía.

## Pruebas

La base incluye 16 pruebas de interfaz, redirecciones Auth, normalización y configuración pública, además de contratos pgTAP para el esquema y la autenticación remotos. La estrategia y los escenarios financieros obligatorios están definidos en [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md). Cada tarea funcional deberá ampliar y ejecutar sus pruebas antes de cerrarse.

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

| Documento                                                      | Propósito                                             |
| -------------------------------------------------------------- | ----------------------------------------------------- |
| [`PROJECT.md`](PROJECT.md)                                     | Resumen ejecutivo del producto y su arquitectura      |
| [`AGENTS.md`](AGENTS.md)                                       | Reglas obligatorias de trabajo dentro del repositorio |
| [`docs/PRODUCT_REQUIREMENTS.md`](docs/PRODUCT_REQUIREMENTS.md) | Requisitos del MVP y reglas operativas                |
| [`docs/DECISIONS.md`](docs/DECISIONS.md)                       | Decisiones, motivos y preguntas aún abiertas          |
| [`docs/ACTION_PLAN.md`](docs/ACTION_PLAN.md)                   | Secuencia completa de ejecución y criterios de cierre |
| [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md)                     | Esquema físico, transacciones, índices y RLS          |
| [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md)                       | Pruebas funcionales, financieras y de seguridad       |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)                     | Entornos, variables, publicación y rollback           |
| [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md)                   | Herramientas y conexiones comprobadas                 |
| [`docs/WORKFLOW.md`](docs/WORKFLOW.md)                         | Ramas, commits, pull requests y relevo                |
| [`docs/STATUS.md`](docs/STATUS.md)                             | Estado vivo y bitácora de tareas                      |
