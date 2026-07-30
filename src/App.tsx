import { AccessPortal } from './features/auth/AccessPortal.tsx'

const foundations = [
  {
    label: 'Interfaz',
    value: 'React + TypeScript',
    description: 'Base tipada para construir los recorridos por rol.',
  },
  {
    label: 'Desarrollo',
    value: 'Vite',
    description: 'Entorno rápido con build reproducible para producción.',
  },
  {
    label: 'Experiencia',
    value: 'Mobile-first',
    description: 'Diseñada desde el inicio para operar durante eventos.',
  },
] as const

function App() {
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
        <span className="phase-pill">MVP · Base técnica</span>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">Infraestructura inicial lista</p>
          <h1 aria-label="Sistema Cashless Acapulco">
            Sistema Cashless
            <span> Acapulco</span>
          </h1>
          <p className="hero-description">
            Una plataforma para operar recargas, compras y liquidaciones con
            trazabilidad completa en eventos recurrentes.
          </p>

          <div className="status-card" role="status">
            <span className="status-dot" aria-hidden="true" />
            <span>
              <strong>Autenticación base conectada</strong>
              <small>Acceso separado y autorizado desde PostgreSQL.</small>
            </span>
          </div>
        </div>

        <aside className="signal-card" aria-label="Estado de la entrega">
          <span className="signal-card__label">Entrega 1</span>
          <strong>01</strong>
          <p>Base funcional local</p>
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
          <p className="eyebrow">Fundamentos</p>
          <h2 id="foundations-title">Preparada para crecer por etapas</h2>
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
