import { describe, expect, it } from 'vitest'

import { readSupabasePublicConfig } from './supabase.ts'

describe('readSupabasePublicConfig', () => {
  it('normaliza la configuración pública válida', () => {
    expect(
      readSupabasePublicConfig({
        VITE_SUPABASE_PUBLISHABLE_KEY: ' public-key ',
        VITE_SUPABASE_URL: 'https://project.supabase.co/',
      }),
    ).toEqual({
      publishableKey: 'public-key',
      url: 'https://project.supabase.co',
    })
  })

  it('acepta HTTP únicamente para el entorno local', () => {
    expect(
      readSupabasePublicConfig({
        VITE_SUPABASE_PUBLISHABLE_KEY: 'local-key',
        VITE_SUPABASE_URL: 'http://127.0.0.1:54321',
      }).url,
    ).toBe('http://127.0.0.1:54321')
  })

  it('rechaza configuración incompleta', () => {
    expect(() =>
      readSupabasePublicConfig({
        VITE_SUPABASE_PUBLISHABLE_KEY: '',
        VITE_SUPABASE_URL: '',
      }),
    ).toThrow(/faltan/i)
  })

  it('rechaza una URL remota sin HTTPS', () => {
    expect(() =>
      readSupabasePublicConfig({
        VITE_SUPABASE_PUBLISHABLE_KEY: 'public-key',
        VITE_SUPABASE_URL: 'http://example.com',
      }),
    ).toThrow(/https/i)
  })
})
