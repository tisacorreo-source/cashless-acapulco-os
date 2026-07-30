import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

import { getSupabaseClient } from '../../lib/supabase.ts'

export type AccessRole = 'admin' | 'client' | 'seller'

export interface AccessIdentity {
  businessPublicId: string | null
  clientPublicId: string | null
  displayName: string
  role: AccessRole
  sessionExpiresAt: string | null
}

export interface ClientCredentials {
  accessName: string
  phone: string
}

export interface StaffCredentials {
  email: string
  password: string
}

export interface AccessService {
  getCurrentAccess: () => Promise<AccessIdentity | null>
  onPasswordRecovery: (callback: () => void) => () => void
  requestPasswordReset: (email: string) => Promise<void>
  signInClient: (credentials: ClientCredentials) => Promise<AccessIdentity>
  signInStaff: (credentials: StaffCredentials) => Promise<AccessIdentity>
  signOut: (identity: AccessIdentity) => Promise<void>
  updatePassword: (password: string) => Promise<void>
}

const genericCredentialsMessage =
  'No pudimos validar los datos. Revisa la información e inténtalo de nuevo.'

export class AccessError extends Error {
  readonly code: 'configuration' | 'credentials' | 'rate_limit' | 'unknown'

  constructor(
    message: string,
    code: 'configuration' | 'credentials' | 'rate_limit' | 'unknown',
  ) {
    super(message)
    this.name = 'AccessError'
    this.code = code
  }
}

export function normalizeAccessName(value: string): string {
  return value.trim().replace(/\s+/gu, ' ').toLocaleLowerCase('es-MX')
}

export function normalizeEmail(value: string): string {
  return value.trim().toLocaleLowerCase('en-US')
}

export function normalizePhoneE164(value: string): string {
  const trimmed = value.trim()
  const digits = trimmed.replace(/\D/gu, '')
  let normalized: string

  if (trimmed.startsWith('+')) {
    normalized = `+${digits}`
  } else if (digits.length === 10) {
    normalized = `+52${digits}`
  } else if (digits.length === 12 && digits.startsWith('52')) {
    normalized = `+${digits}`
  } else {
    throw new AccessError(
      'Escribe 10 dígitos de México o incluye el prefijo internacional con +.',
      'credentials',
    )
  }

  if (!/^\+[1-9][0-9]{7,14}$/u.test(normalized)) {
    throw new AccessError(
      'El teléfono no tiene un formato válido.',
      'credentials',
    )
  }

  return normalized
}

export function validatePassword(value: string): void {
  if (value.length < 8 || !/\p{L}/u.test(value) || !/\d/u.test(value)) {
    throw new AccessError(
      'La contraseña debe tener al menos 8 caracteres, una letra y un número.',
      'credentials',
    )
  }
}

function mapIdentity(row: {
  access_role: string
  business_public_id: string | null
  client_public_id: string | null
  display_name: string
  session_expires_at: string | null
}): AccessIdentity {
  if (!['admin', 'client', 'seller'].includes(row.access_role)) {
    throw new AccessError(
      'La cuenta no tiene un rol autorizado.',
      'credentials',
    )
  }

  return {
    businessPublicId: row.business_public_id,
    clientPublicId: row.client_public_id,
    displayName: row.display_name,
    role: row.access_role as AccessRole,
    sessionExpiresAt: row.session_expires_at,
  }
}

function isMissingSessionError(message: string | undefined): boolean {
  return Boolean(
    message?.toLocaleLowerCase('en-US').includes('session missing'),
  )
}

export function createAccessService(): AccessService {
  async function getCurrentAccess(): Promise<AccessIdentity | null> {
    const client = getSupabaseClient()
    const { data: sessionData, error: sessionError } =
      await client.auth.getSession()

    if (sessionError) {
      throw new AccessError(sessionError.message, 'unknown')
    }

    if (!sessionData.session) {
      return null
    }

    const { data, error } = await client.rpc('get_current_access', {})

    if (error) {
      throw new AccessError(error.message, 'unknown')
    }

    return data?.[0] ? mapIdentity(data[0]) : null
  }

  async function signInStaff(
    credentials: StaffCredentials,
  ): Promise<AccessIdentity> {
    const client = getSupabaseClient()
    const email = normalizeEmail(credentials.email)

    if (!email || !credentials.password) {
      throw new AccessError(genericCredentialsMessage, 'credentials')
    }

    const { error } = await client.auth.signInWithPassword({
      email,
      password: credentials.password,
    })

    if (error) {
      throw new AccessError(genericCredentialsMessage, 'credentials')
    }

    const identity = await getCurrentAccess()

    if (!identity || identity.role === 'client') {
      await client.auth.signOut({ scope: 'local' })
      throw new AccessError(
        'La cuenta no tiene acceso operativo.',
        'credentials',
      )
    }

    return identity
  }

  async function signInClient(
    credentials: ClientCredentials,
  ): Promise<AccessIdentity> {
    const client = getSupabaseClient()
    const accessName = normalizeAccessName(credentials.accessName)
    const phone = normalizePhoneE164(credentials.phone)

    if (accessName.length < 2 || accessName.length > 120) {
      throw new AccessError(genericCredentialsMessage, 'credentials')
    }

    const { data: currentSession, error: sessionError } =
      await client.auth.getSession()

    if (sessionError && !isMissingSessionError(sessionError.message)) {
      throw new AccessError(sessionError.message, 'unknown')
    }

    if (currentSession.session && !currentSession.session.user.is_anonymous) {
      throw new AccessError(
        'Cierra la sesión de personal antes de entrar como cliente.',
        'credentials',
      )
    }

    if (!currentSession.session) {
      const { error } = await client.auth.signInAnonymously()

      if (error) {
        throw new AccessError(
          'No fue posible iniciar el acceso temporal. Inténtalo nuevamente.',
          error.status === 429 ? 'rate_limit' : 'unknown',
        )
      }
    }

    const { data, error } = await client.rpc('claim_client_access', {
      p_access_name: accessName,
      p_phone_e164: phone,
    })

    if (error) {
      throw new AccessError('No fue posible validar el acceso.', 'unknown')
    }

    const result = data?.[0]

    if (!result?.authenticated) {
      const message = result?.retry_after_seconds
        ? 'Demasiados intentos. Espera 15 minutos antes de volver a intentar.'
        : genericCredentialsMessage

      throw new AccessError(
        message,
        result?.retry_after_seconds ? 'rate_limit' : 'credentials',
      )
    }

    return mapIdentity({
      access_role: result.access_role ?? 'client',
      business_public_id: null,
      client_public_id: result.client_public_id,
      display_name: result.display_name ?? '',
      session_expires_at: result.session_expires_at,
    })
  }

  async function requestPasswordReset(emailValue: string): Promise<void> {
    const client = getSupabaseClient()
    const email = normalizeEmail(emailValue)

    if (!email) {
      throw new AccessError('Escribe tu correo.', 'credentials')
    }

    const redirectTo = new URL('/', window.location.origin)
    redirectTo.searchParams.set('auth', 'recovery')

    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo.toString(),
    })

    if (error) {
      if (error.status === 429) {
        throw new AccessError(
          'Espera un momento antes de solicitar otro correo.',
          'rate_limit',
        )
      }

      throw new AccessError(
        'No fue posible enviar el correo. Inténtalo nuevamente.',
        'unknown',
      )
    }
  }

  async function updatePassword(password: string): Promise<void> {
    validatePassword(password)

    const { error } = await getSupabaseClient().auth.updateUser({ password })

    if (error) {
      throw new AccessError(error.message, 'unknown')
    }
  }

  async function signOut(identity: AccessIdentity): Promise<void> {
    const client = getSupabaseClient()

    if (identity.role === 'client') {
      const { error } = await client.rpc('revoke_client_access', {})

      if (error) {
        throw new AccessError(
          'No fue posible revocar la sesión de forma segura.',
          'unknown',
        )
      }
    }

    const { error } = await client.auth.signOut({ scope: 'local' })

    if (error && !isMissingSessionError(error.message)) {
      throw new AccessError(error.message, 'unknown')
    }
  }

  function onPasswordRecovery(callback: () => void): () => void {
    const { data } = getSupabaseClient().auth.onAuthStateChange(
      (event: AuthChangeEvent, _session: Session | null) => {
        if (event === 'PASSWORD_RECOVERY') {
          callback()
        }
      },
    )

    return () => data.subscription.unsubscribe()
  }

  return {
    getCurrentAccess,
    onPasswordRecovery,
    requestPasswordReset,
    signInClient,
    signInStaff,
    signOut,
    updatePassword,
  }
}
