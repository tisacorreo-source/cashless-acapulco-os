import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { AccessIdentity, AccessRole } from '../auth/access.ts'
import { RoleWorkspace } from './RoleWorkspace.tsx'

function createIdentity(role: AccessRole): AccessIdentity {
  return {
    businessPublicId: role === 'seller' ? 'business-demo' : null,
    clientPublicId: role === 'client' ? 'client-demo' : null,
    displayName:
      role === 'admin'
        ? 'Administrador TISA'
        : role === 'seller'
          ? 'Mar Azul Demo'
          : 'Cliente Piloto',
    role,
    sessionExpiresAt: role === 'client' ? '2026-07-30T18:00:00.000Z' : null,
  }
}

afterEach(cleanup)

describe('RoleWorkspace', () => {
  it.each([
    ['admin', 'Administración', 'Clientes'],
    ['seller', 'Punto de venta', 'Crear cobro'],
    ['client', 'Cliente', 'Escanear QR'],
  ] as const)(
    'presenta navegación específica para %s',
    async (role, roleLabel, targetModule) => {
      const user = userEvent.setup()
      render(
        <RoleWorkspace
          identity={createIdentity(role)}
          onSignOut={vi.fn()}
          pending={false}
        />,
      )

      expect(
        screen.getByRole('navigation', {
          name: `Navegación de ${roleLabel}`,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/información simulada/i)).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: targetModule }))

      expect(screen.getByText(/recorrido preparado/i)).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: targetModule }),
      ).toHaveAttribute('aria-current', 'page')
    },
  )

  it('cierra la sesión desde el encabezado del espacio de trabajo', async () => {
    const user = userEvent.setup()
    const onSignOut = vi.fn()

    render(
      <RoleWorkspace
        identity={createIdentity('admin')}
        onSignOut={onSignOut}
        pending={false}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(onSignOut).toHaveBeenCalledOnce()
  })
})
