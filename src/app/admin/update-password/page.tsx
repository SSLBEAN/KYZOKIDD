'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      return
    }
    setDone(true)
    setTimeout(() => { window.location.href = '/admin' }, 1200)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold mb-6">Set New Password</h1>

        {done ? (
          <p className="text-white/70 text-sm">Password updated — redirecting…</p>
        ) : (
          <>
            <div>
              <label className="block text-sm mb-1 text-white/70">New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-white/20 rounded px-3 py-2 outline-none focus:border-white/60"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-600 transition rounded px-3 py-2 font-semibold"
            >
              Update Password
            </button>
          </>
        )}
      </form>
    </main>
  )
}
