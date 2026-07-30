import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { AccessIdentity, AccessService } from './access.ts'
import { AccessPortal } from './AccessPortal.tsx'

const adminIdentity: AccessIdentity = {
  businessPublicId: 'business-1',
  clientPublicId: null,
  displayName: 'TISA',
  role: 'admin',
  sessionExpiresAt: null,
}

function createFakeService(
  overrides: Partial<AccessService> = {},
): AccessService {
  return {
    getCurrentAccess: vi.fn().mockResolvedValue(null),
    onPasswordRecovery: vi.fn().mockReturnValue(() => undefined),
    requestPasswordReset: vi.fn().mockResolvedValue(undefined),
    signInClient: vi.fn(),
    signInStaff: vi.fn().mockResolvedValue(adminIdentity),
    signOut: vi.fn().mockResolvedValue(undefined),
    updatePassword: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

describe('AccessPortal', () => {
  it('separa el acceso de personal y cliente e informa la vigencia temporal', async () => {
    const user = userEvent.setup()
    render(<AccessPortal service={createFakeService()} />)

    expect(
      await screen.findByRole('heading', { name: /administración y venta/i }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: /cliente/i }))

    expect(
      screen.getByRole('heading', { name: /consulta de cliente/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/dura exactamente 8 horas/i)).toBeInTheDocument()
    expect(screen.getByText(/5 intentos fallidos/i)).toBeInTheDocument()
  })

  it('autentica al personal y presenta su identidad autorizada', async () => {
    const user = userEvent.setup()
    const service = createFakeService()
    render(<AccessPortal service={service} />)

    await user.type(await screen.findByLabelText(/correo/i), 'Admin@Tisa.mx')
    await user.type(screen.getByLabelText(/contraseña/i), 'segura123')
    await user.click(
      screen.getByRole('button', { name: /entrar como personal/i }),
    )

    expect(service.signInStaff).toHaveBeenCalledWith({
      email: 'Admin@Tisa.mx',
      password: 'segura123',
    })
    expect(
      await screen.findByRole('heading', { name: 'TISA' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/administración/i)).toBeInTheDocument()
  })

  it('mantiene genérica la respuesta de recuperación de contraseña', async () => {
    const user = userEvent.setup()
    const service = createFakeService()
    render(<AccessPortal service={service} />)

    await user.click(
      await screen.findByRole('button', { name: /olvidé mi contraseña/i }),
    )
    await user.type(screen.getByLabelText(/correo/i), 'nadie@example.com')
    await user.click(
      screen.getByRole('button', { name: /enviar instrucciones/i }),
    )

    expect(
      await screen.findByText(/si el correo está registrado/i),
    ).toBeInTheDocument()
  })
})
