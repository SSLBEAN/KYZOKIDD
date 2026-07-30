import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: releases } = await supabase
    .from('releases')
    .select('title, slug, release_type')
    .eq('is_published', true)
    .order('sort_order')

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-2">KYZOKIDD</h1>
      <p className="text-white/50 mb-8">
        Placeholder homepage — real design comes from the approved demo next.
        This page exists to confirm the Supabase connection works.
      </p>

      <h2 className="text-lg font-semibold mb-3 text-white/80">Published Releases</h2>
      {releases && releases.length > 0 ? (
        <ul className="space-y-2">
          {releases.map((r) => (
            <li key={r.slug} className="border border-white/15 rounded p-4">
              <span className="font-semibold">{r.title}</span>{' '}
              <span className="text-white/40 text-sm">({r.release_type})</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white/40 text-sm">
          No releases yet — add one from /admin once your Supabase project is connected.
        </p>
      )}
    </main>
  )
}
