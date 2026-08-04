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

  const [releases, videos, shows, products, subscribers, rnf, admins] = await Promise.all([
    supabase.from('releases').select('id', { count: 'exact', head: true }),
    supabase.from('videos').select('id', { count: 'exact', head: true }),
    supabase.from('shows').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('subscribers').select('id', { count: 'exact', head: true }),
    supabase.from('rnf_members').select('id', { count: 'exact', head: true }),
    supabase.from('admins').select('user_id', { count: 'exact', head: true }),
  ])

  const stats = [
    ['Subscribers', subscribers.count],
    ['Releases', releases.count],
    ['Shows', shows.count],
    ['Team members', admins.count],
  ] as const

  const contentCards = [
    ['Releases', '/admin/releases', releases.count, 'Songs, singles, and projects'],
    ['Videos', '/admin/videos', videos.count, 'Music videos shown on the homepage'],
    ['Shows', '/admin/shows', shows.count, 'Upcoming and past dates'],
    ['Products', '/admin/products', products.count, 'Merch store items'],
    ['RNF Collective', '/admin/rnf', rnf.count, 'Names shown in the RNF section'],
    ['Press Kit', '/admin/epk', null, 'Bio, achievements, contact, PDF'],
  ] as const

  const siteCards = [
    ['Site Photos', '/admin/media', 'Hero, about, gallery, and background images'],
    ['Settings', '/admin/settings', 'Title, accent color, welcome email'],
    ['Team', '/admin/team', 'Invite-only admin accounts'],
  ] as const

  const name = (adminRow as { username: string | null }).username ?? user.email

  return (
    <main className="min-h-screen bg-bg text-bone p-6 md:p-10">
      <AdminNav current="/admin" />

      <div className="mb-10">
        <h1 className="text-3xl font-bold">Welcome, {name}</h1>
        <p className="text-bone-dim mt-1">Here&apos;s what&apos;s happening with the site.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map(([label, count]) => (
          <div key={label} className="border border-line rounded p-5">
            <p className="text-3xl font-display">{count ?? 0}</p>
            <p className="text-bone-dim text-xs uppercase tracking-wide mt-1">{label}</p>
          </div>
        ))}
      </div>

      <p className="font-mono-brand text-xs uppercase tracking-wider text-bone-dim mb-4">
        Content
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {contentCards.map(([label, href, count, desc]) => (
          <Link key={label} href={href}>
            <div className="border border-line rounded p-6 hover:border-bone-dim transition-colors h-full">
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold">{label}</p>
                {count !== null && (
                  <span className="text-bone-dim text-xs">{count}</span>
                )}
              </div>
              <p className="text-bone-dim text-xs">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <p className="font-mono-brand text-xs uppercase tracking-wider text-bone-dim mb-4">
        Site
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {siteCards.map(([label, href, desc]) => (
          <Link key={label} href={href}>
            <div className="border border-line rounded p-6 hover:border-bone-dim transition-colors h-full">
              <p className="font-semibold mb-1">{label}</p>
              <p className="text-bone-dim text-xs">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
