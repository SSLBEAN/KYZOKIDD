import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/AdminNav'

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
    .select('user_id, username')
    .eq('user_id', user.id)
    .maybeSingle()

  if (adminError) {
    redirect(`/admin/login?error=admin_query_failed&detail=${encodeURIComponent(adminError.message)}`)
  }

  if (!adminRow) {
    await supabase.auth.signOut()
    redirect('/admin/login?error=not_admin')
  }

  const [releases, videos, shows, products, subscribers] = await Promise.all([
    supabase.from('releases').select('id', { count: 'exact', head: true }),
    supabase.from('videos').select('id', { count: 'exact', head: true }),
    supabase.from('shows').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('subscribers').select('id', { count: 'exact', head: true }),
  ])

  const cards = [
    ['Releases', '/admin/releases', releases.count],
    ['Videos', '/admin/videos', videos.count],
    ['Shows', '/admin/shows', shows.count],
    ['Products', '/admin/products', products.count],
    ['Subscribers', null, subscribers.count],
  ] as const

  return (
    <main className="min-h-screen bg-bg text-bone p-6 md:p-10">
      <AdminNav current="/admin" />
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-bone-dim mb-8">
        Welcome, {(adminRow as { username: string | null }).username ?? user.email}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(([label, href, count]) => {
          const inner = (
            <div className="border border-line rounded p-6 hover:border-bone-dim transition-colors h-full">
              <p className="font-semibold">{label}</p>
              <p className="text-bone-dim text-sm mt-1">
                {count ?? 0} {count === 1 ? 'item' : 'items'}
              </p>
            </div>
          )
          return href ? (
            <Link key={label} href={href}>
              {inner}
            </Link>
          ) : (
            <div key={label}>{inner}</div>
          )
        })}
      </div>
    </main>
  )
}
