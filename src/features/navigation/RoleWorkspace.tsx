import { useState } from 'react'

import type { AccessIdentity } from '../auth/access.ts'
import { roleNavigation } from './role-navigation.ts'

interface RoleWorkspaceProps {
  identity: AccessIdentity
  onSignOut: () => void
  pending: boolean
}

function formatExpiry(value: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Mexico_City',
  }).format(new Date(value))
}

export function RoleWorkspace({
  identity,
  onSignOut,
  pending,
}: RoleWorkspaceProps) {
  const config = roleNavigation[identity.role]
  const [activeId, setActiveId] = useState<string>(config.navigation[0].id)
  const activeItem =
    config.navigation.find((item) => item.id === activeId) ??
    config.navigation[0]
  const isOverview = activeItem.id === 'overview'

  return (
    <div className="role-workspace">
      <header className="role-workspace__header">
        <div>
          <span className="pilot-badge">Piloto · Datos ficticios</span>
          <p className="role-workspace__role">{config.label}</p>
          <h3>{identity.displayName}</h3>
          <p>{config.description}</p>
        </div>
        <button
          className="secondary-button"
          disabled={pending}
          onClick={onSignOut}
          type="button"
        >
          {pending ? 'Cerrando…' : 'Cerrar sesión'}
        </button>
      </header>

      <div className="pilot-disclaimer" role="note">
        <span aria-hidden="true">i</span>
        <p>
          Esta vista utiliza información simulada para probar recorridos. No
          representa personas, operaciones ni dinero real.
        </p>
      </div>

      <div className="role-workspace__layout">
        <nav
          className="role-navigation"
          aria-label={`Navegación de ${config.label}`}
        >
          {config.navigation.map((item, index) => {
            const isActive = item.id === activeItem.id

            return (
              <button
                aria-current={isActive ? 'page' : undefined}
                className={isActive ? 'is-active' : ''}
                key={item.id}
                onClick={() => setActiveId(item.id)}
                type="button"
              >
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.label}
              </button>
            )
          })}
        </nav>

        <section
          className="role-module"
          aria-labelledby={`role-module-${activeItem.id}`}
        >
          <div className="role-module__heading">
            <div>
              <p className="eyebrow">{config.label}</p>
              <h4 id={`role-module-${activeItem.id}`}>{activeItem.title}</h4>
            </div>
            <span className="module-status">Estructura lista</span>
          </div>

          <p className="role-module__description">{activeItem.description}</p>

          {isOverview ? (
            <div className="pilot-metrics" aria-label="Resumen ficticio">
              {config.metrics.map((metric) => (
                <article key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <small>{metric.note}</small>
                </article>
              ))}
            </div>
          ) : (
            <div className="module-placeholder">
              <span aria-hidden="true">→</span>
              <div>
                <strong>Recorrido preparado para implementación</strong>
                <p>{activeItem.nextStep}</p>
              </div>
            </div>
          )}

          {isOverview && identity.sessionExpiresAt ? (
            <p className="session-expiry">
              Sesión temporal vigente hasta el{' '}
              <strong>{formatExpiry(identity.sessionExpiresAt)}</strong>.
            </p>
          ) : null}

          {isOverview ? (
            <div className="module-placeholder module-placeholder--subtle">
              <span aria-hidden="true">✓</span>
              <div>
                <strong>Navegación disponible</strong>
                <p>{activeItem.nextStep}</p>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}
