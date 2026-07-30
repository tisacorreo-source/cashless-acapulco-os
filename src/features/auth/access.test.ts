import { describe, expect, it } from 'vitest'

import {
  AccessError,
  normalizeAccessName,
  normalizeEmail,
  normalizePhoneE164,
  validatePassword,
} from './access.ts'

describe('normalización de acceso', () => {
  it('normaliza nombre y correo sin alterar la identidad visible almacenada', () => {
    expect(normalizeAccessName('  María   DEL  Mar ')).toBe('maría del mar')
    expect(normalizeEmail('  Admin@Example.COM ')).toBe('admin@example.com')
  })

  it('agrega +52 a números mexicanos de diez dígitos', () => {
    expect(normalizePhoneE164('744 123 45 67')).toBe('+527441234567')
    expect(normalizePhoneE164('52 744 123 45 67')).toBe('+527441234567')
  })

  it('conserva números internacionales con prefijo explícito', () => {
    expect(normalizePhoneE164('+1 (415) 555-2671')).toBe('+14155552671')
  })

  it('rechaza números ambiguos o inválidos', () => {
    expect(() => normalizePhoneE164('12345')).toThrow(AccessError)
    expect(() => normalizePhoneE164('14155552671')).toThrow(/prefijo/i)
  })
})

describe('contraseña', () => {
  it('exige ocho caracteres con letras y números', () => {
    expect(() => validatePassword('segura123')).not.toThrow()
    expect(() => validatePassword('sololetras')).toThrow(/letra y un número/i)
    expect(() => validatePassword('12345678')).toThrow(/letra y un número/i)
    expect(() => validatePassword('abc123')).toThrow(/8 caracteres/i)
  })
})
