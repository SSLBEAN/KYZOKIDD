import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/AdminNav'
import { saveVideo, deleteVideo } from '@/app/admin/actions'
import type { Video } from '@/lib/types'

const inputClass =
  'w-full bg-transparent border border-line rounded px-3 py-2 text-sm outline-none focus:border-bone-dim'
const labelClass = 'block text-xs text-bone-dim mb-1 uppercase tracking-wide'

export default async function AdminVideosPage({
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

  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .order('sort_order', { ascending: true })

  const editing = edit
    ? ((videos ?? []) as Video[]).find((v) => v.id === edit)
    : null

  return (
    <main className="min-h-screen bg-bg text-bone p-6 md:p-10">
      <AdminNav current="/admin/videos" />
      <h1 className="text-2xl font-bold mb-2">Videos</h1>
      <p className="text-bone-dim text-sm mb-8">
        Paste just the YouTube video ID (the part after <code>?v=</code> in the URL),
        not the full link. Mark one as featured to have it autoplay as the main
        embed on the homepage.
      </p>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-10">
        <div className="space-y-3">
          {(videos ?? []).length === 0 && (
            <p className="text-bone-dim text-sm">
              No videos in the database yet — the homepage is currently showing
              3 hardcoded fallback videos. Add real ones here to replace them.
            </p>
          )}
          {(videos as Video[] | null)?.map((v) => (
            <div
              key={v.id}
              className="border border-line rounded p-4 flex justify-between items-start gap-3"
            >
              <div>
                <p className="font-semibold">{v.title}</p>
                <p className="text-bone-dim text-xs mt-0.5">
                  {v.youtube_video_id} {v.is_featured && '· Featured'}
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <a
                  href={`/admin/videos?edit=${v.id}`}
                  className="text-bone-dim hover:text-bone text-sm"
                >
                  Edit
                </a>
                <form action={deleteVideo}>
                  <input type="hidden" name="id" value={v.id} />
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
          action={saveVideo}
          key={editing?.id ?? 'new'}
          className="border border-line rounded p-6 space-y-4 h-fit"
        >
          <h2 className="font-semibold mb-2">
            {editing ? `Edit: ${editing.title}` : 'Add a video'}
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

          <div>
            <label className={labelClass}>YouTube video ID</label>
            <input
              name="youtube_video_id"
              defaultValue={editing?.youtube_video_id}
              required
              placeholder="e.g. wdNDeSRIRjc"
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={editing?.is_featured ?? false}
            />
            Featured (main embed on homepage)
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-blood hover:bg-blood-bright transition-colors px-5 py-2.5 rounded text-sm font-semibold"
            >
              {editing ? 'Save changes' : 'Add video'}
            </button>
            {editing && (
              <a
                href="/admin/videos"
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
