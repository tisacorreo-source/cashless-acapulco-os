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
- La aplicación React/Vite funciona localmente y tiene una prueba base, herramientas de calidad y build de producción validados.

## Tarea activa

**Entrega 1 — Tarea 1.3: Diseñar modelo de datos físico.**

Estado: bloqueada antes de implementación por las decisiones P-002 a P-007. No se crearán tablas ni migraciones hasta definir normalización de teléfonos, correo, zona horaria, importes, asociación de recargas y cancelaciones posteriores a una liquidación.

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

## Bloqueos activos

### B-003 — Definiciones previas al modelo de datos físico

Impacto: elegir tipos, restricciones y transacciones sin estas respuestas podría introducir duplicados de clientes, fechas ambiguas o inconsistencias financieras.

Resolución esperada: confirmar las decisiones P-002 a P-007 registradas en `docs/DECISIONS.md` antes de implementar la Tarea 1.3.

## Bloqueos resueltos

### B-001 — Runtime Node.js no disponible

Impacto: la Tarea 1.1 no puede crear ni ejecutar una aplicación React/Vite de forma verificable.

Resolución: se localizó Node.js v24.14.0 LTS dentro del runtime de trabajo. Se utilizará sin instalar herramientas globales ni modificar el equipo anfitrión.

### B-002 — Autorización OAuth de GitHub CLI

Impacto original: impedía crear y publicar el repositorio remoto.

Resolución: el titular completó el flujo OAuth; se verificó la cuenta `tisacorreo-source`, se creó el repositorio público y se publicó `main`.

## Próxima acción

Obtener las definiciones P-002 a P-007 y, solo después, diseñar el modelo físico, sus invariantes, transacciones y políticas RLS en la Tarea 1.3.
