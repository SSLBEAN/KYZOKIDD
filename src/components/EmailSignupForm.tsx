'use client'

import { useActionState } from 'react'
import { subscribeEmail } from '@/app/actions'

const initialState = { ok: false, message: '' }

export function EmailSignupForm() {
  const [state, formAction, pending] = useActionState(subscribeEmail, initialState)

  return (
    <div>
      <form action={formAction} className="flex gap-0 mt-6 max-w-md border-b border-bone">
        <input
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          className="bg-transparent border-none text-bone text-base py-3 flex-1 outline-none placeholder:text-bone-dim"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-transparent border-none text-blood-bright font-mono-brand text-xs tracking-wider uppercase cursor-pointer disabled:opacity-50"
        >
          {pending ? 'Sending…' : 'Sign Up →'}
        </button>
      </form>
      {state.message && (
        <p className={`mt-2 text-sm ${state.ok ? 'text-bone-dim' : 'text-blood-bright'}`}>
          {state.message}
        </p>
      )}
    </div>
  )
}
