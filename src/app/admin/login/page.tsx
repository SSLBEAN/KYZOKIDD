'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

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
