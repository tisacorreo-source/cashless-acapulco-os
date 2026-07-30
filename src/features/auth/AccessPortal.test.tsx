import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  type AccessIdentity,
  type AccessService,
  readAuthRedirectState,
} from './access.ts'
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

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
})

describe('redirecciones de Auth', () => {
  it('lleva una invitación válida a la creación de contraseña', () => {
    expect(readAuthRedirectState({ hash: '#type=invite', search: '' })).toEqual(
      {
        error: '',
        mode: 'update-password',
        notice: 'Invitación aceptada. Crea tu contraseña para continuar.',
      },
    )
  })

  it('convierte un enlace vencido en una recuperación accionable', () => {
    const state = readAuthRedirectState({
      hash: '#error=access_denied&error_code=otp_expired',
      search: '',
    })

    expect(state.mode).toBe('recovery')
    expect(state.error).toMatch(/venció o fue utilizado/i)
  })
})

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
    expect(
      screen.getByRole('navigation', { name: 'Navegación de Administración' }),
    ).toBeInTheDocument()
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

  it('permite crear contraseña desde una invitación y conserva la sesión administrativa', async () => {
    window.history.replaceState(null, '', '/#type=invite')
    const user = userEvent.setup()
    const service = createFakeService({
      getCurrentAccess: vi.fn().mockResolvedValue(adminIdentity),
    })

    render(<AccessPortal service={service} />)

    expect(
      await screen.findByRole('heading', { name: /nueva contraseña/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/invitación aceptada/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText('Contraseña nueva'), 'segura123')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'segura123')
    await user.click(
      screen.getByRole('button', { name: /guardar contraseña/i }),
    )

    expect(service.updatePassword).toHaveBeenCalledWith('segura123')
    expect(
      await screen.findByRole('heading', { name: 'TISA' }),
    ).toBeInTheDocument()
  })
})
