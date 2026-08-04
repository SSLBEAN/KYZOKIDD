import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/AdminNav'
import { saveRnfMember, deleteRnfMember } from '@/app/admin/actions'
import type { RnfMember } from '@/lib/types'

const inputClass =
  'w-full bg-transparent border border-line rounded px-3 py-2 text-sm outline-none focus:border-bone-dim'
const labelClass = 'block text-xs text-bone-dim mb-1 uppercase tracking-wide'

export default async function AdminRnfPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login?error=no_session')

  const { data: members } = await supabase
    .from('rnf_members')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <main className="min-h-screen bg-bg text-bone p-6 md:p-10">
      <AdminNav current="/admin/rnf" />
      <h1 className="text-2xl font-bold mb-2">RNF Collective</h1>
      <p className="text-bone-dim text-sm mb-8 max-w-xl">
        Names listed in the RNF section on the homepage. Lower sort numbers
        show first.
      </p>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-10">
        <div className="space-y-3">
          {(members ?? []).length === 0 && (
            <p className="text-bone-dim text-sm">
              No members added yet — showing the default hardcoded list on
              the live site until you add some here.
            </p>
          )}
          {(members as RnfMember[] | null)?.map((m) => (
            <div
              key={m.id}
              className="border border-line rounded p-4 flex justify-between items-center gap-3"
            >
              <p className="font-semibold">{m.name}</p>
              <form action={deleteRnfMember}>
                <input type="hidden" name="id" value={m.id} />
                <button
                  type="submit"
                  className="text-bone-dim hover:text-blood-bright text-sm"
                >
                  Remove
                </button>
              </form>
            </div>
          ))}
        </div>

        <form
          action={saveRnfMember}
          className="border border-line rounded p-6 space-y-4 h-fit"
        >
          <h2 className="font-semibold mb-2">Add a member</h2>
          <div>
            <label className={labelClass}>Name</label>
            <input name="name" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Sort order</label>
            <input
              type="number"
              name="sort_order"
              defaultValue={(members?.length ?? 0) * 10}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="bg-blood hover:bg-blood-bright transition-colors px-5 py-2.5 rounded text-sm font-semibold"
          >
            Add member
          </button>
        </form>
      </div>
    </main>
  )
}
