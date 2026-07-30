import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '../types/database.ts'

export interface SupabasePublicConfig {
  publishableKey: string
  url: string
}

type PublicEnvironment = Pick<
  ImportMetaEnv,
  'VITE_SUPABASE_PUBLISHABLE_KEY' | 'VITE_SUPABASE_URL'
>

export function readSupabasePublicConfig(
  environment: PublicEnvironment,
): SupabasePublicConfig {
  const url = environment.VITE_SUPABASE_URL?.trim()
  const publishableKey = environment.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

  if (!url || !publishableKey) {
    throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY.')
  }

  let parsedUrl: URL

  try {
    parsedUrl = new URL(url)
  } catch {
    throw new Error('VITE_SUPABASE_URL debe ser una URL válida.')
  }

  const isLocalHttp =
    parsedUrl.protocol === 'http:' &&
    ['127.0.0.1', 'localhost'].includes(parsedUrl.hostname)

  if (parsedUrl.protocol !== 'https:' && !isLocalHttp) {
    throw new Error(
      'VITE_SUPABASE_URL debe usar HTTPS, excepto en desarrollo local.',
    )
  }

  return { publishableKey, url: parsedUrl.toString().replace(/\/$/, '') }
}

type CashlessSupabaseClient = SupabaseClient<Database, 'api', 'api'>

let supabaseClient: CashlessSupabaseClient | undefined

export function getSupabaseClient(): CashlessSupabaseClient {
  if (!supabaseClient) {
    const { publishableKey, url } = readSupabasePublicConfig(import.meta.env)

    supabaseClient = createClient<Database, 'api'>(url, publishableKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
      db: { schema: 'api' },
    })
  }

  return supabaseClient
}
