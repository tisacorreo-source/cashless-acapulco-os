import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App.tsx'

describe('App', () => {
  it('presenta la base técnica del sistema cashless', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /sistema cashless acapulco/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      /aplicación local funcionando/i,
    )
  })
})
