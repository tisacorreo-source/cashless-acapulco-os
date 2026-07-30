import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import App from './App.tsx'

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
})

describe('App', () => {
  it('presenta el piloto cashless y su acceso por rol', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /piloto cashless acapulco/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(/acceso por rol listo/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /entra según tu operación/i }),
    ).toBeInTheDocument()
  })

  it('habilita vistas ficticias por rol únicamente para revisión local', () => {
    window.history.replaceState(null, '', '/?pilotRole=seller')
    render(<App />)

    expect(
      screen.getByRole('navigation', {
        name: 'Navegación de Punto de venta',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Mar Azul Demo')).toBeInTheDocument()
    expect(screen.getByText(/no representa personas/i)).toBeInTheDocument()
  })
})
