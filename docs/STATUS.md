# Estado y bitácora del proyecto

Última actualización: 2026-07-29.

## Resumen para relevo

- El directorio comenzó vacío.
- No existía repositorio Git, código, documentación ni configuración.
- GitHub, Supabase y Vercel están conectados mediante integraciones autorizadas.
- Git y pnpm están disponibles localmente.
- Node.js no está en el `PATH` del sistema, pero existe un runtime LTS utilizable en el entorno de trabajo.
- El repositorio Git local está inicializado en `main` y vinculado al remoto público de GitHub.
- La documentación inicial está preparada, validada y versionada.
- La aplicación React/Vite funciona localmente y tiene pruebas, herramientas de calidad y build de producción validados.
- El proyecto Supabase `Cashless Acapulco` está activo y contiene el esquema físico versionado.
- La autenticación por rol, la migración, el portal y la configuración alojada de Auth están implementados y validados.
- `TISA OS Pilot` está pausado temporalmente por indicación expresa del responsable.

## Tarea activa

Ninguna. La Tarea 1.5 está publicada para revisión en el PR borrador [#3](https://github.com/tisacorreo-source/cashless-acapulco-os/pull/3); la siguiente tarea autorizada será 1.6 después de integrar este cambio.

## Bitácora

### Tarea 0.1 — Revisar plugins, skills y capacidades

Estado: terminada.

Evidencia:

- GitHub conectado a TISA (`tisacorreo-source`).
- Supabase conectado a la organización SomosTisa.
- Vercel conectado al equipo SomosTisa.
- Capacidad de navegador disponible para pruebas visuales.
- Se identificaron guías especializadas para GitHub, Supabase, Vercel y navegador.

No se crearon archivos ni commit porque la tarea precedía expresamente a la creación de documentación.

### Tarea 0.2 — Inspeccionar entorno local

Estado: terminada.

Evidencia:

- Ruta comprobada: `/Users/luisadriandel/Desktop/cashless_acapulco_os`.
- Carpeta vacía y sin repositorio Git.
- Git 2.50.1 y pnpm 11.9.0 disponibles.
- Node.js, npm, Bun, GitHub CLI, Supabase CLI y Vercel CLI ausentes del `PATH`.
- Variables relevantes ausentes; solo se comprobó presencia, nunca valores.

### Tarea 0.3 — Crear documentación inicial

Estado: terminada.

Evidencia:

- README creado como índice vivo con estructura, estado y guía de entrada.
- AGENTS y PROJECT creados para reglas persistentes y contexto ejecutivo.
- Requisitos, decisiones, plan, datos, pruebas, despliegue, entorno, flujo y bitácora documentados en `docs/`.
- `.env.example` contiene solo marcadores públicos y `.gitignore` protege archivos locales y secretos.
- Se verificaron los 14 archivos esperados.
- La búsqueda de patrones de credenciales no encontró coincidencias.
- Repositorio Git local inicializado en `main`.
- `git diff --cached --check` y la validación de enlaces locales terminaron correctamente.
- Identidad de autor configurada localmente para este repositorio.
- Commit de cierre: `docs: establish project handoff documentation`.

### Tarea 1.1 — Crear proyecto React + TypeScript + Vite

Estado: terminada.

Evidencia:

- Node.js v24.14.0 LTS y pnpm 11.9 fijados mediante motores, `.nvmrc`, workspace y lockfile.
- React 19.2, TypeScript 6 y Vite 8 configurados con Oxlint y Prettier.
- Vitest, jsdom y Testing Library configurados; una prueba de interfaz aprobada.
- `pnpm peers check` terminó sin incidencias.
- `pnpm check` aprobó formato, lint, tipos, prueba y build de producción.
- Build generado: HTML 0.56 kB, CSS 4.15 kB y JavaScript 193.34 kB antes de gzip.
- Portada técnica mobile-first sin datos operativos falsos.
- Navegador validado en 390×844 y 1440×1000 sin desbordamiento horizontal.
- DOM accesible comprobado y consola sin errores ni advertencias.
- Revisión React: componentes estáticos, sin hooks innecesarios, waterfalls ni dependencias pesadas.
- Rama de trabajo: `feature/scaffold-react-vite`.
- Commit de cierre: `feat: scaffold React Vite application`.

### Tarea 1.2 — Crear repositorio GitHub público

Estado: terminada.

Evidencia:

- Repositorio público creado: [`tisacorreo-source/cashless-acapulco-os`](https://github.com/tisacorreo-source/cashless-acapulco-os).
- `origin` usa HTTPS y apunta al repositorio esperado.
- `main` se publicó y quedó configurada como rama predeterminada y de seguimiento.
- La API de GitHub confirmó que `README.md` está visible en `main`.
- El repositorio local conserva únicamente `.env.example`; los demás archivos `.env*` y `.tools/` están ignorados.
- Se verificaron alcance de archivos, patrones de credenciales, formato, lint, tipos, pruebas y build antes del cierre.
- GitHub CLI 2.94.0 se instaló de forma local y descartable dentro de `.tools/`, sin incorporarlo al repositorio.

### Tarea 1.3 — Diseñar modelo de datos físico

Estado: terminada.

Evidencia:

- Las decisiones P-002 a P-007 fueron respondidas por el responsable y registradas como D-014 a D-019.
- `docs/DATA_MODEL.md` define esquemas, tablas, columnas, tipos, restricciones, índices, relaciones y reglas de borrado.
- El libro financiero separa transacciones, asientos inmutables y saldos proyectados.
- Se documentaron forma exacta de asientos, idempotencia, orden de bloqueos y funciones atómicas para los cinco tipos de operación.
- La deuda negocio–evento por reversión posliquidación y su amortización quedaron explícitas.
- Se diseñó una superficie `api` mínima sobre tablas internas `cashless`, con RLS, privilegios explícitos y funciones endurecidas.
- Requisitos y plan de pruebas incorporan E.164, correo opcional único, UTC, zona local y fronteras monetarias de $50–$1,000 MXN.
- Se revisaron el changelog y la documentación vigente de Supabase sobre Data API, RLS y funciones de base de datos.
- `pnpm check`, la validación estructural del contrato y los enlaces de 12 documentos terminaron correctamente.
- No se crearon tablas, migraciones ni recursos remotos durante esta tarea.
- Rama: `feature/physical-data-model`.
- Pull request fusionado: [#1 — docs: define physical data model](https://github.com/tisacorreo-source/cashless-acapulco-os/pull/1).
- Commit en `main`: `dbc6ea4 docs: define physical data model`.

### Tarea 1.4 — Conectar Supabase

Estado: terminada.

Evidencia:

- `TISA OS Pilot` (`sgvjpuzazumhlxrbaffg`) se pausó de forma reversible por solicitud expresa para liberar el cupo del plan gratuito.
- Se confirmó un costo de USD 0 mensual y se creó `Cashless Acapulco` (`ypeabqwaragnnavvmgyg`) en `us-east-1`; estado final `ACTIVE_HEALTHY`.
- Supabase JS 2.111.0 y CLI 2.110.0 quedaron fijados en `package.json` y el lockfile.
- La migración `20260730011421_create_cashless_schema.sql` crea 16 tablas internas, índices de relaciones y consulta, ledger inmutable, validador diferido, RLS y privilegios explícitos.
- El Data API queda limitado a `api`; `public` no contiene tablas de aplicación y `cashless` no está expuesto.
- La migración completa pasó primero dentro de una transacción con `ROLLBACK` y después se aplicó mediante el historial remoto de migraciones.
- El contrato pgTAP ejecutó 39 comprobaciones de esquemas, tablas, RLS, funciones y privilegios.
- Catálogos remotos confirmaron 16/16 tablas con RLS, 0 privilegios para `anon`, 0 escrituras directas para `authenticated`, 0 claves foráneas sin índice y 3/3 helpers endurecidos.
- Pruebas efímeras con `ROLLBACK` aprobaron fronteras de 5000 y 100000 centavos, rechazo exterior, recarga con forma válida, ledger append-only y visibilidad diferenciada de administrador, vendedor y cliente.
- El asesor de seguridad devolvió cero hallazgos. El asesor de rendimiento sólo marcó índices sin uso, resultado esperado con todas las tablas vacías.
- Se generó el contrato TypeScript de la superficie Data API y se añadió un cliente lazy que rechaza configuración ausente o HTTP remoto.
- `pnpm check` aprobó formato, lint, tipos, 5 pruebas y build de producción.
- No se conservaron datos de prueba ni secretos en el proyecto o el repositorio.
- Rama: `feature/connect-supabase`.
- GitHub CLI reautenticado correctamente como `tisacorreo-source` antes de publicar.

### Tarea 1.5 — Implementar autenticación y acceso

Estado: terminada.

Evidencia acumulada:

- D-024 y D-025 fijan correo/contraseña con recuperación para el personal y una sesión de cliente de ocho horas sin renovación.
- La migración remota `20260730015644_implement_authentication_access.sql` añade control de intentos, claim anónimo, sesión exacta, revocación, bootstrap del administrador y tres RPC con privilegios mínimos.
- El contrato pgTAP ejecutó nueve comprobaciones estructurales y de privilegios.
- Una prueba funcional remota con `ROLLBACK` confirmó credenciales válidas, identidad visible, vencimiento inmutable, revocación efectiva y desaparición posterior del acceso.
- Los asesores finales de seguridad y rendimiento no reportan hallazgos activos; los logs de Auth confirman invitación y alta anónima con HTTP 200, sin errores del flujo.
- El frontend incorpora formularios separados para personal y cliente, recuperación/cambio de contraseña, mensajes genéricos y cierre seguro de sesión.
- TypeScript, Oxlint, 13 pruebas y el build de producción están aprobados.
- La interfaz fue validada en escritorio y 390×844 sin desbordamiento horizontal; personal, cliente y recuperación son navegables y accesibles.
- `.env.local` contiene únicamente URL y llave publicable del proyecto y permanece ignorado por Git.
- No se conservaron los usuarios o clientes temporales usados por las pruebas.
- Auth alojado permite usuarios anónimos y exige confirmación de correo, cambio seguro de contraseña, mínimo de ocho caracteres y letras con números.
- `http://localhost:5173` es el Site URL local y `http://127.0.0.1:5173/**` está en la lista de redirecciones permitidas.
- Una llamada real con la llave publicable creó una sesión anónima válida; su usuario técnico exacto fue eliminado inmediatamente después de la prueba.
- La invitación a `tisacorreo@gmail.com` creó un usuario Auth y el trigger generó el perfil único `admin`, activo y con nombre `Administrador TISA`.
- El titular debe aceptar la invitación desde su correo y elegir la contraseña personal; esa acción no requiere almacenar ni compartir la credencial con el proyecto.
- Rama publicada: `feature/authentication-access`.
- Commit funcional: `9787fbb` (`feat: implement authentication access`).
- Revisión abierta: PR borrador [#3 — feat: implement authentication access](https://github.com/tisacorreo-source/cashless-acapulco-os/pull/3).

## Bloqueos activos

Ninguno.

## Bloqueos resueltos

### B-001 — Runtime Node.js no disponible

Impacto: la Tarea 1.1 no puede crear ni ejecutar una aplicación React/Vite de forma verificable.

Resolución: se localizó Node.js v24.14.0 LTS dentro del runtime de trabajo. Se utilizará sin instalar herramientas globales ni modificar el equipo anfitrión.

### B-002 — Autorización OAuth de GitHub CLI

Impacto original: impedía crear y publicar el repositorio remoto.

Resolución: el titular completó el flujo OAuth; se verificó la cuenta `tisacorreo-source`, se creó el repositorio público y se publicó `main`.

### B-003 — Definiciones previas al modelo de datos físico

Impacto original: impedía elegir restricciones de identidad, fechas y dinero sin inventar decisiones del producto.

Resolución: el responsable confirmó E.164, correo opcional único, zona horaria, centavos y límites, selección obligatoria de evento y deuda por reversión posliquidación.

### B-004 — Capacidad gratuita de proyectos Supabase

Impacto original: la organización no permitía crear otro proyecto activo en el plan gratuito.

Resolución: el responsable pidió pausar temporalmente `TISA OS Pilot`; se verificó el objetivo exacto, se pausó y se creó `Cashless Acapulco` sin costo mensual.

### B-005 — Decisiones de autenticación

Impacto original: P-001 y P-009 impedían definir credenciales administrativas y vigencia del acceso limitado del cliente.

Resolución: el responsable confirmó correo/contraseña con recuperación para `tisacorreo@gmail.com` y una sesión de cliente de ocho horas sin renovación automática.

### B-006 — Sesión autorizada de Supabase Dashboard

Impacto original: impedía activar usuarios anónimos, configurar contraseñas y URLs, y crear al administrador inicial.

Resolución: el titular inició sesión en el Dashboard; se activó y verificó Auth alojado, se registraron las URLs locales y se envió la invitación administrativa.

## Próxima acción

Revisar e integrar el PR [#3](https://github.com/tisacorreo-source/cashless-acapulco-os/pull/3) y, solo después, iniciar la Tarea 1.6 para navegación y estructura visual por rol.
