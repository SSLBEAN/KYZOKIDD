'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ERROR_MESSAGES: Record<string, string> = {
  no_session:
    "You weren't signed in when the dashboard checked — the session didn't carry over. Try signing in again.",
  not_admin:
    "That account signed in successfully, but it isn't on the admin list yet. Add its user ID to the admins table in Supabase.",
  admin_query_failed:
    'The dashboard could not check the admin list (a database/permissions error). See detail below.',
}

function LoginNotice() {
  const params = useSearchParams()
  const errorCode = params.get('error')
  const detail = params.get('detail')

  if (!errorCode) return null

  return (
    <div className="border border-yellow-600/50 bg-yellow-950/40 rounded p-3 text-sm text-yellow-200">
      <p>{ERROR_MESSAGES[errorCode] ?? `Redirected back with error: ${errorCode}`}</p>
      {detail && <p className="mt-1 text-yellow-400/80 text-xs break-words">Detail: {detail}</p>}
    </div>
  )
}

export default function AdminLoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Full page reload (not client-side router.push) so the server
    // sees the freshly-set session cookie on the very next request.
    window.location.href = '/admin'
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold mb-2">Admin Login</h1>

        <Suspense fallback={null}>
          <LoginNotice />
        </Suspense>

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

        <div>
          <label className="block text-sm mb-1 text-white/70">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-white/20 rounded px-3 py-2 outline-none focus:border-white/60"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-700 hover:bg-red-600 transition rounded px-3 py-2 font-semibold disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <a href="/admin/reset-password" className="block text-sm text-white/50 hover:text-white text-center pt-2">
          Forgot password?
        </a>
      </form>
    </main>
  )
}
