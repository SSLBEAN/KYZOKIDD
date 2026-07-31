import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/admin/login?error=no_session')
  }

  const { data: adminRow, error: adminError } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (adminError) {
    // The query itself failed (RLS, connection, etc) — show the real reason
    // instead of silently bouncing back to login.
    redirect(`/admin/login?error=admin_query_failed&detail=${encodeURIComponent(adminError.message)}`)
  }

  if (!adminRow) {
    await supabase.auth.signOut()
    redirect('/admin/login?error=not_admin')
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-white/60 mb-8">Signed in as {user.email}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {['Releases', 'Videos', 'Shows', 'Products', 'Press Assets', 'Subscribers'].map((item) => (
          <div key={item} className="border border-white/15 rounded p-6">
            <p className="font-semibold">{item}</p>
            <p className="text-white/40 text-sm mt-1">Manage {item.toLowerCase()} — coming next</p>
          </div>
        ))}
      </div>
    </main>
  )
}
