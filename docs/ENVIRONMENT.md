# Estado verificado del entorno

Verificación realizada el 2026-07-29 en `/Users/luisadriandel/Desktop/cashless_acapulco_os`. No se imprimieron valores de variables ni credenciales.

## Carpeta y Git

| Elemento              | Resultado                                                                  |
| --------------------- | -------------------------------------------------------------------------- |
| Carpeta de trabajo    | Existe y estaba vacía al iniciar                                           |
| Repositorio Git local | Inicializado en la rama `main` durante la documentación 0.3                |
| Remoto Git            | `origin` → `https://github.com/tisacorreo-source/cashless-acapulco-os.git` |
| Visibilidad remota    | Pública; `main` predeterminada y README visible                            |
| Historial             | Documentación 0.3, scaffold 1.1 y cierre de publicación 1.2                |

## Herramientas locales

| Herramienta  | Resultado                                            |
| ------------ | ---------------------------------------------------- |
| Git          | 2.50.1 (Apple Git-155)                               |
| pnpm         | 11.9.0                                               |
| Node.js      | v24.14.0 LTS en el runtime de trabajo; no global     |
| npm          | No disponible en `PATH`                              |
| Bun          | No disponible en `PATH`                              |
| GitHub CLI   | 2.94.0 local en `.tools/`; no disponible globalmente |
| Supabase CLI | 2.110.0 como dependencia local; no disponible global |
| Vercel CLI   | No disponible en `PATH`                              |

La Tarea 1.1 usó el runtime Node.js incluido sin instalar herramientas globales. El repositorio exige Node.js `>=24.14.0 <25`, fija pnpm 11.9 y conserva un lockfile. `pnpm-workspace.yaml` aplica comprobación estricta de motores, espera mínima de 24 horas para publicaciones nuevas y una excepción de peer transitiva limitada al fallback WASM de Vite. Para la Tarea 1.2 se verificó el archivo oficial de checksums y se instaló GitHub CLI de forma local en `.tools/`; este directorio es descartable y está ignorado por Git. La Tarea 1.4 añadió Supabase JS 2.111.0 y Supabase CLI 2.110.0 como dependencias exactas del proyecto.

No se encontró Docker, OrbStack, Colima ni Podman. Por ello la migración se probó primero dentro de una transacción con `ROLLBACK` y después se aplicó al proyecto remoto; el contrato pgTAP queda listo para `supabase test db` cuando un colaborador disponga de Docker.

## Conectores disponibles

| Servicio  | Estado               | Contexto comprobado                              |
| --------- | -------------------- | ------------------------------------------------ |
| GitHub    | Conectado            | Cuenta TISA (`tisacorreo-source`)                |
| Supabase  | Conectado            | SomosTisa; proyecto Cashless Acapulco activo     |
| Vercel    | Conectado            | Equipo SomosTisa                                 |
| Navegador | Capacidad disponible | Reservada para configuración y validación visual |

Los conectores evitan solicitar tokens ya autorizados. GitHub CLI quedó autenticado como `tisacorreo-source` y guarda su credencial fuera del repositorio. Crear proyectos, despliegues o cambios externos se hará únicamente en su tarea y con los controles de autorización aplicables.

## Variables relevantes

Durante la inspección no estaban definidas:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_ACCESS_TOKEN`
- `VERCEL_TOKEN`
- `GITHUB_TOKEN`
- `GH_TOKEN`

Esto no bloquea la documentación. Los conectores usan autorización administrada y los valores de aplicación se configurarán cuando exista el proyecto correspondiente.

## Proyectos Supabase

| Proyecto          | Referencia             | Región      | Estado                   |
| ----------------- | ---------------------- | ----------- | ------------------------ |
| Cashless Acapulco | `ypeabqwaragnnavvmgyg` | `us-east-1` | `ACTIVE_HEALTHY`         |
| TISA OS Pilot     | `sgvjpuzazumhlxrbaffg` | `us-east-2` | `INACTIVE`, pausa manual |

`TISA OS Pilot` se pausó de forma reversible por indicación expresa del responsable para liberar el cupo gratuito y crear `Cashless Acapulco`. El costo confirmado del proyecto nuevo fue de USD 0 mensuales.
