import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/AdminNav'
import { InviteForm } from '@/components/InviteForm'

export default async function AdminTeamPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login?error=no_session')

  const { data: admins } = await supabase
    .from('admins')
    .select('user_id, username, created_at')
    .order('created_at', { ascending: true })

  return (
    <main className="min-h-screen bg-bg text-bone p-6 md:p-10">
      <AdminNav current="/admin/team" />
      <h1 className="text-2xl font-bold mb-8">Team</h1>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-10">
        <div className="space-y-3">
          {(admins ?? []).map((a) => (
            <div key={a.user_id} className="border border-line rounded p-4">
              <p className="font-semibold">{a.username ?? 'Unnamed'}</p>
              <p className="text-bone-dim text-xs mt-0.5">
                Admin since {new Date(a.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        <InviteForm />
      </div>
    </main>
  )
}
