import { AccessPortal } from './features/auth/AccessPortal.tsx'
import type { AccessIdentity, AccessRole } from './features/auth/access.ts'
import { RoleWorkspace } from './features/navigation/RoleWorkspace.tsx'

const foundations = [
  {
    label: 'Recorridos',
    value: 'Tres perfiles',
    description: 'Administrador, punto de venta y cliente bien separados.',
  },
  {
    label: 'Información',
    value: 'Datos ficticios',
    description: 'Una simulación identificada, reversible y sin dinero real.',
  },
  {
    label: 'Objetivo',
    value: 'Piloto verificable',
    description: 'Un evento demo completo antes de cualquier uso operativo.',
  },
] as const

const pilotPreviewNames: Record<AccessRole, string> = {
  admin: 'Administrador TISA',
  client: 'Cliente Piloto',
  seller: 'Mar Azul Demo',
}

function readPilotPreviewIdentity(): AccessIdentity | null {
  if (!import.meta.env.DEV) return null

  const candidate = new URLSearchParams(window.location.search).get('pilotRole')

  if (!candidate || !['admin', 'client', 'seller'].includes(candidate)) {
    return null
  }

  const role = candidate as AccessRole

  return {
    businessPublicId: role === 'seller' ? 'business-preview' : null,
    clientPublicId: role === 'client' ? 'client-preview' : null,
    displayName: pilotPreviewNames[role],
    role,
    sessionExpiresAt:
      role === 'client'
        ? new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
        : null,
  }
}

function App() {
  const pilotPreviewIdentity = readPilotPreviewIdentity()

  if (pilotPreviewIdentity) {
    return (
      <main className="app-shell app-shell--pilot-preview">
        <RoleWorkspace
          identity={pilotPreviewIdentity}
          onSignOut={() => window.location.assign('/')}
          pending={false}
        />
      </main>
    )
  }

  return (
    <main className="app-shell">
      <header className="site-header" aria-label="Identidad del producto">
        <a className="brand" href="#inicio" aria-label="Ir al inicio">
          <span className="brand-mark" aria-hidden="true">
            T
          </span>
          <span className="brand-copy">
            <strong>TISA</strong>
            <span>Cashless</span>
          </span>
        </a>
        <span className="phase-pill">Piloto · Datos ficticios</span>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">Primer piloto en construcción</p>
          <h1 aria-label="Piloto Cashless Acapulco">
            Piloto Cashless
            <span> Acapulco</span>
          </h1>
          <p className="hero-description">
            Una simulación para recorrer recargas, compras y liquidaciones con
            trazabilidad completa, sin dinero ni datos personales reales.
          </p>

          <div className="status-card" role="status">
            <span className="status-dot" aria-hidden="true" />
            <span>
              <strong>Acceso por rol listo</strong>
              <small>Navegación separada para los tres perfiles.</small>
            </span>
          </div>
        </div>

        <aside className="signal-card" aria-label="Estado de la entrega">
          <span className="signal-card__label">Piloto 01</span>
          <strong>01</strong>
          <p>Navegación por rol</p>
          <div className="signal-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </aside>
      </section>

      <AccessPortal />

      <section className="foundations" aria-labelledby="foundations-title">
        <div className="section-heading">
          <p className="eyebrow">Alcance controlado</p>
          <h2 id="foundations-title">Diseñado para aprender con el piloto</h2>
        </div>

        <div className="foundation-grid">
          {foundations.map((foundation, index) => (
            <article className="foundation-card" key={foundation.label}>
              <span className="foundation-number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p>{foundation.label}</p>
              <h3>{foundation.value}</h3>
              <small>{foundation.description}</small>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <span>Sistema Cashless Acapulco</span>
        <span>Construido por TISA</span>
      </footer>
    </main>
  )
}

export default App
