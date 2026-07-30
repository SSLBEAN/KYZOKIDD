'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/update-password`,
    })

    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

        {sent ? (
          <p className="text-white/70 text-sm">
            Check your email for a reset link.
          </p>
        ) : (
          <>
            <div>
              <label className="block text-sm mb-1 text-white/70">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-white/20 rounded px-3 py-2 outline-none focus:border-white/60"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-600 transition rounded px-3 py-2 font-semibold"
            >
              Send Reset Link
            </button>
          </>
        )}
      </form>
    </main>
  )
}
