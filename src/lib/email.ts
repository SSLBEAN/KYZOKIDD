/**
 * Minimal Resend wrapper — plain fetch, no SDK dependency needed.
 * Requires RESEND_API_KEY (server-only env var, never NEXT_PUBLIC_).
 * Until a custom domain is verified in Resend, sends must use the
 * onboarding@resend.dev address — swap it once kyzokidd.com (or similar)
 * is verified there.
 */
export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string
  subject: string
  text: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set — skipping email send')
    return { skipped: true }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'KYZOKIDD <onboarding@resend.dev>',
      to: [to],
      subject,
      text,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('Resend send failed:', res.status, body)
    return { skipped: false, ok: false }
  }

  return { skipped: false, ok: true }
}
