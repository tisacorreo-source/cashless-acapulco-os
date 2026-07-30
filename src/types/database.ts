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

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  api: EmptySchema
  public: EmptySchema
}

export const Constants = {
  api: { Enums: {} },
  public: { Enums: {} },
} as const
