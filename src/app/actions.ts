'use server'

import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'

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

  const { data: settings } = await supabase
    .from('site_settings')
    .select('welcome_email_subject, welcome_email_body')
    .eq('id', 1)
    .maybeSingle()

  const s = settings as { welcome_email_subject?: string; welcome_email_body?: string } | null

  await sendEmail({
    to: email,
    subject: s?.welcome_email_subject || 'Welcome to the KYZOKIDD list',
    text:
      s?.welcome_email_body ||
      "Thanks for signing up — you'll be the first to hear about new music, videos, and shows.",
  })

  return { ok: true, message: "You're in. Thanks for signing up." }
}
