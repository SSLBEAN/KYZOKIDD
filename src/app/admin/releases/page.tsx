import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/AdminNav'
import { saveRelease, deleteRelease } from '@/app/admin/actions'
import type { Release } from '@/lib/types'

const inputClass =
  'w-full bg-transparent border border-line rounded px-3 py-2 text-sm outline-none focus:border-bone-dim'
const labelClass = 'block text-xs text-bone-dim mb-1 uppercase tracking-wide'

export default async function AdminReleasesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const { edit } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login?error=no_session')

  const { data: releases } = await supabase
    .from('releases')
    .select('*')
    .order('sort_order', { ascending: true })

  const editing = edit
    ? ((releases ?? []) as Release[]).find((r) => r.id === edit)
    : null

  return (
    <main className="min-h-screen bg-bg text-bone p-6 md:p-10">
      <AdminNav current="/admin/releases" />
      <h1 className="text-2xl font-bold mb-8">Releases</h1>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div className="space-y-3">
          {(releases ?? []).length === 0 && (
            <p className="text-bone-dim text-sm">No releases yet.</p>
          )}
          {(releases as Release[] | null)?.map((r) => (
            <div
              key={r.id}
              className="border border-line rounded p-4 flex justify-between items-start gap-3"
            >
              <div>
                <p className="font-semibold">{r.title}</p>
                <p className="text-bone-dim text-xs mt-0.5">
                  {r.release_type} · {r.is_published ? 'Published' : 'Draft'}
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <a
                  href={`/admin/releases?edit=${r.id}`}
                  className="text-bone-dim hover:text-bone text-sm"
                >
                  Edit
                </a>
                <form action={deleteRelease}>
                  <input type="hidden" name="id" value={r.id} />
                  <button
                    type="submit"
                    className="text-bone-dim hover:text-blood-bright text-sm"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <form
          action={saveRelease}
          key={editing?.id ?? 'new'}
          className="border border-line rounded p-6 space-y-4 h-fit"
        >
          <h2 className="font-semibold mb-2">
            {editing ? `Edit: ${editing.title}` : 'Add a release'}
          </h2>
          {editing && <input type="hidden" name="id" value={editing.id} />}

          <div>
            <label className={labelClass}>Title</label>
            <input
              name="title"
              defaultValue={editing?.title}
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type</label>
              <select
                name="release_type"
                defaultValue={editing?.release_type ?? 'single'}
                className={inputClass}
              >
                <option value="single">Single</option>
                <option value="ep">EP</option>
                <option value="album">Album</option>
                <option value="mixtape">Mixtape</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Release date</label>
              <input
                type="date"
                name="release_date"
                defaultValue={editing?.release_date ?? ''}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={editing?.description ?? ''}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Cover image URL</label>
            <input
              name="cover_image_url"
              defaultValue={editing?.cover_image_url ?? ''}
              placeholder="https://…"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Spotify URL</label>
              <input
                name="spotify_url"
                defaultValue={editing?.spotify_url ?? ''}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Apple Music URL</label>
              <input
                name="apple_music_url"
                defaultValue={editing?.apple_music_url ?? ''}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>SoundCloud URL</label>
              <input
                name="soundcloud_url"
                defaultValue={editing?.soundcloud_url ?? ''}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>YouTube URL</label>
              <input
                name="youtube_url"
                defaultValue={editing?.youtube_url ?? ''}
                className={inputClass}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={editing?.is_published ?? false}
            />
            Published (visible on the live site)
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-blood hover:bg-blood-bright transition-colors px-5 py-2.5 rounded text-sm font-semibold"
            >
              {editing ? 'Save changes' : 'Add release'}
            </button>
            {editing && (
              <a
                href="/admin/releases"
                className="px-5 py-2.5 rounded text-sm border border-line hover:border-bone-dim"
              >
                Cancel
              </a>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}
