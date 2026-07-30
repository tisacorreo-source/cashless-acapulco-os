import { type FormEvent, useEffect, useMemo, useState } from 'react'

import {
  AccessError,
  type AccessIdentity,
  type AccessMode,
  type AccessService,
  createAccessService,
  readAuthRedirectState,
} from './access.ts'
import { RoleWorkspace } from '../navigation/RoleWorkspace.tsx'

interface AccessPortalProps {
  service?: AccessService
}

function getErrorMessage(error: unknown): string {
  return error instanceof AccessError
    ? error.message
    : 'Ocurrió un error inesperado. Inténtalo nuevamente.'
}

export function AccessPortal({ service }: AccessPortalProps) {
  const authRedirect = useMemo(readAuthRedirectState, [])
  const accessService = useMemo(
    () => service ?? createAccessService(),
    [service],
  )
  const [mode, setMode] = useState<AccessMode>(authRedirect.mode)
  const [identity, setIdentity] = useState<AccessIdentity | null>(null)
  const [pending, setPending] = useState(true)
  const [error, setError] = useState(authRedirect.error)
  const [notice, setNotice] = useState(authRedirect.notice)

  useEffect(() => {
    let active = true
    let unsubscribe: () => void = () => undefined

    async function restoreAccess() {
      try {
        const currentIdentity = await accessService.getCurrentAccess()

        if (active && authRedirect.mode !== 'update-password') {
          setIdentity(currentIdentity)
        }
      } catch (restoreError) {
        if (active) {
          setError(getErrorMessage(restoreError))
        }
      } finally {
        if (active) {
          setPending(false)
        }
      }
    }

    try {
      unsubscribe = accessService.onPasswordRecovery(() => {
        if (active) {
          setMode('update-password')
          setError('')
          setNotice('Crea una contraseña nueva para recuperar tu acceso.')
        }
      })
      void restoreAccess()
    } catch (setupError) {
      setError(getErrorMessage(setupError))
      setPending(false)
    }

    return () => {
      active = false
      unsubscribe()
    }
  }, [accessService, authRedirect.mode])

  function selectMode(nextMode: AccessMode) {
    setMode(nextMode)
    setError('')
    setNotice('')
  }

  async function submitStaff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setPending(true)
    setError('')
    setNotice('')

    try {
      const nextIdentity = await accessService.signInStaff({
        email: String(form.get('email') ?? ''),
        password: String(form.get('password') ?? ''),
      })
      setIdentity(nextIdentity)
    } catch (signInError) {
      setError(getErrorMessage(signInError))
    } finally {
      setPending(false)
    }
  }

  async function submitClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setPending(true)
    setError('')
    setNotice('')

    try {
      const nextIdentity = await accessService.signInClient({
        accessName: String(form.get('accessName') ?? ''),
        phone: String(form.get('phone') ?? ''),
      })
      setIdentity(nextIdentity)
    } catch (signInError) {
      setError(getErrorMessage(signInError))
    } finally {
      setPending(false)
    }
  }

  async function submitRecovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setPending(true)
    setError('')
    setNotice('')

    try {
      await accessService.requestPasswordReset(String(form.get('email') ?? ''))
      setNotice(
        'Si el correo está registrado, recibirás instrucciones para recuperar el acceso.',
      )
    } catch (recoveryError) {
      setError(getErrorMessage(recoveryError))
    } finally {
      setPending(false)
    }
  }

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const password = String(form.get('password') ?? '')
    const confirmation = String(form.get('passwordConfirmation') ?? '')
    setError('')
    setNotice('')

    if (password !== confirmation) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setPending(true)

    try {
      await accessService.updatePassword(password)
      const currentIdentity = await accessService.getCurrentAccess()

      if (currentIdentity) {
        setIdentity(currentIdentity)
      } else {
        setMode('staff')
        setNotice('Contraseña actualizada. Ya puedes iniciar sesión.')
      }
    } catch (passwordError) {
      setError(getErrorMessage(passwordError))
    } finally {
      setPending(false)
    }
  }

  async function signOut() {
    if (!identity) return

    setPending(true)
    setError('')

    try {
      await accessService.signOut(identity)
      setIdentity(null)
      setMode(identity.role === 'client' ? 'client' : 'staff')
      setNotice('Sesión cerrada correctamente.')
    } catch (signOutError) {
      setError(getErrorMessage(signOutError))
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="access-section" aria-labelledby="access-title">
      <div className="access-heading">
        <div>
          <p className="eyebrow">Acceso seguro</p>
          <h2 id="access-title">Entra según tu operación</h2>
        </div>
        <p>
          Cada perfil conserva únicamente los permisos necesarios para trabajar
          durante el evento.
        </p>
      </div>

      <div
        className={`access-panel${identity ? ' access-panel--workspace' : ''}`}
      >
        {pending && !identity ? (
          <p className="access-loading" role="status">
            Validando sesión…
          </p>
        ) : identity ? (
          <RoleWorkspace
            identity={identity}
            onSignOut={() => void signOut()}
            pending={pending}
          />
        ) : (
          <>
            {mode !== 'recovery' && mode !== 'update-password' ? (
              <div
                className="access-tabs"
                aria-label="Tipo de acceso"
                role="tablist"
              >
                <button
                  aria-selected={mode === 'staff'}
                  className={mode === 'staff' ? 'is-active' : ''}
                  onClick={() => selectMode('staff')}
                  role="tab"
                  type="button"
                >
                  Personal
                </button>
                <button
                  aria-selected={mode === 'client'}
                  className={mode === 'client' ? 'is-active' : ''}
                  onClick={() => selectMode('client')}
                  role="tab"
                  type="button"
                >
                  Cliente
                </button>
              </div>
            ) : null}

            {mode === 'staff' ? (
              <form
                className="access-form"
                onSubmit={(event) => void submitStaff(event)}
              >
                <div>
                  <h3>Administración y venta</h3>
                  <p>Usa el correo y la contraseña asignados a tu cuenta.</p>
                </div>
                <label htmlFor="staff-email">Correo</label>
                <input
                  autoComplete="email"
                  id="staff-email"
                  name="email"
                  required
                  type="email"
                />
                <label htmlFor="staff-password">Contraseña</label>
                <input
                  autoComplete="current-password"
                  id="staff-password"
                  name="password"
                  required
                  type="password"
                />
                <button type="submit" disabled={pending}>
                  {pending ? 'Entrando…' : 'Entrar como personal'}
                </button>
                <button
                  className="access-link"
                  onClick={() => selectMode('recovery')}
                  type="button"
                >
                  Olvidé mi contraseña
                </button>
              </form>
            ) : null}

            {mode === 'client' ? (
              <form
                className="access-form"
                onSubmit={(event) => void submitClient(event)}
              >
                <div>
                  <h3>Consulta de cliente</h3>
                  <p>
                    Ingresa el nombre y teléfono registrados por el
                    administrador.
                  </p>
                </div>
                <label htmlFor="client-name">Nombre de acceso</label>
                <input
                  autoComplete="name"
                  id="client-name"
                  name="accessName"
                  required
                  type="text"
                />
                <label htmlFor="client-phone">Teléfono</label>
                <input
                  autoComplete="tel"
                  id="client-phone"
                  inputMode="tel"
                  name="phone"
                  placeholder="744 123 4567"
                  required
                  type="tel"
                />
                <p className="access-privacy-note">
                  La sesión dura exactamente 8 horas y no se renueva. Por
                  seguridad, el acceso se bloquea 15 minutos después de 5
                  intentos fallidos.
                </p>
                <button type="submit" disabled={pending}>
                  {pending ? 'Validando…' : 'Entrar como cliente'}
                </button>
              </form>
            ) : null}

            {mode === 'recovery' ? (
              <form
                className="access-form"
                onSubmit={(event) => void submitRecovery(event)}
              >
                <div>
                  <h3>Recuperar contraseña</h3>
                  <p>
                    Te enviaremos un enlace si el correo pertenece al personal.
                  </p>
                </div>
                <label htmlFor="recovery-email">Correo</label>
                <input
                  autoComplete="email"
                  id="recovery-email"
                  name="email"
                  required
                  type="email"
                />
                <button type="submit" disabled={pending}>
                  {pending ? 'Solicitando…' : 'Enviar instrucciones'}
                </button>
                <button
                  className="access-link"
                  onClick={() => selectMode('staff')}
                  type="button"
                >
                  Volver al acceso
                </button>
              </form>
            ) : null}

            {mode === 'update-password' ? (
              <form
                className="access-form"
                onSubmit={(event) => void submitPassword(event)}
              >
                <div>
                  <h3>Nueva contraseña</h3>
                  <p>Usa al menos 8 caracteres, una letra y un número.</p>
                </div>
                <label htmlFor="new-password">Contraseña nueva</label>
                <input
                  autoComplete="new-password"
                  id="new-password"
                  minLength={8}
                  name="password"
                  required
                  type="password"
                />
                <label htmlFor="password-confirmation">
                  Confirmar contraseña
                </label>
                <input
                  autoComplete="new-password"
                  id="password-confirmation"
                  minLength={8}
                  name="passwordConfirmation"
                  required
                  type="password"
                />
                <button type="submit" disabled={pending}>
                  {pending ? 'Actualizando…' : 'Guardar contraseña'}
                </button>
              </form>
            ) : null}
          </>
        )}

        {error ? (
          <p className="access-message access-message--error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p className="access-message access-message--notice" role="status">
            {notice}
          </p>
        ) : null}
      </div>
    </section>
  )
}
