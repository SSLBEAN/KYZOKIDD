'use server'

import { createClient } from '@/lib/supabase/server'

export async function subscribeEmail(
  _prevState: { ok: boolean; message: string } | null,
  formData: FormData
): Promise<{ ok: boolean; message: string }> {
  const email = String(formData.get('email') || '').trim()

  if (!email || !email.includes('@')) {
    return { ok: false, message: 'Enter a valid email.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('subscribers').insert({ email })

  if (error) {
    // Unique constraint violation = already subscribed, treat as success.
    if (error.code === '23505') {
      return { ok: true, message: "You're already on the list." }
    }
    return { ok: false, message: 'Something went wrong — try again.' }
  }

  return { ok: true, message: "You're in. Thanks for signing up." }
}
