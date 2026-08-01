import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Uses the SECRET service_role key — this bypasses Row Level Security entirely.
 * Never import this from client components, never expose the key with a
 * NEXT_PUBLIC_ prefix, and only call it after verifying the caller is an
 * admin (see inviteAdmin in app/admin/actions.ts for the pattern).
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
