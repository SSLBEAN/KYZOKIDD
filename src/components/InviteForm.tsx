'use client'

import { useActionState } from "react";
import { inviteAdmin } from "@/app/admin/actions";

const initialState = { ok: false, message: "" };

export function InviteForm() {
  const [state, formAction, pending] = useActionState(inviteAdmin, initialState);

  return (
    <form action={formAction} className="border border-line rounded p-6 space-y-4 max-w-md">
      <h2 className="font-semibold">Invite a teammate</h2>
      <div>
        <label className="block text-xs text-bone-dim mb-1 uppercase tracking-wide">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full bg-transparent border border-line rounded px-3 py-2 text-sm outline-none focus:border-bone-dim"
        />
      </div>
      <div>
        <label className="block text-xs text-bone-dim mb-1 uppercase tracking-wide">
          Username
        </label>
        <input
          name="username"
          required
          placeholder="How their name shows in the dashboard"
          className="w-full bg-transparent border border-line rounded px-3 py-2 text-sm outline-none focus:border-bone-dim"
        />
      </div>
      {state.message && (
        <p className={`text-sm ${state.ok ? "text-bone-dim" : "text-blood-bright"}`}>
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="bg-blood hover:bg-blood-bright transition-colors px-5 py-2.5 rounded text-sm font-semibold disabled:opacity-50"
      >
        {pending ? "Sending invite…" : "Send invite"}
      </button>
      <p className="text-bone-dim text-xs">
        They&apos;ll get an email to set their password. Only people invited
        here can ever sign into /admin — there&apos;s no public sign-up.
      </p>
    </form>
  );
}
