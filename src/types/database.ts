// Generado desde el proyecto Supabase y limitado a la superficie Data API.
// `cashless` no se incluye porque es un esquema interno deliberadamente no expuesto.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type EmptySchema = {
  Tables: { [_ in never]: never }
  Views: { [_ in never]: never }
  Functions: { [_ in never]: never }
  Enums: { [_ in never]: never }
  CompositeTypes: { [_ in never]: never }
}

type AccessRow = {
  access_role: string
  business_public_id: string | null
  client_public_id: string | null
  display_name: string
  session_expires_at: string | null
}

type ClientAccessResultRow = {
  access_role: string | null
  authenticated: boolean
  client_public_id: string | null
  display_name: string | null
  retry_after_seconds: number | null
  session_expires_at: string | null
}

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  api: Omit<EmptySchema, 'Functions'> & {
    Functions: {
      claim_client_access: {
        Args: { p_access_name: string; p_phone_e164: string }
        Returns: ClientAccessResultRow[]
      }
      get_current_access: {
        Args: Record<PropertyKey, never>
        Returns: AccessRow[]
      }
      revoke_client_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
  }
  public: EmptySchema
}

export const Constants = {
  api: { Enums: {} },
  public: { Enums: {} },
} as const
