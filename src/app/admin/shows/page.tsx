import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/AdminNav'
import { saveShow, deleteShow } from '@/app/admin/actions'
import type { Show } from '@/lib/types'

const inputClass =
  'w-full bg-transparent border border-line rounded px-3 py-2 text-sm outline-none focus:border-bone-dim'
const labelClass = 'block text-xs text-bone-dim mb-1 uppercase tracking-wide'

function toLocalInputValue(iso: string | undefined) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`
}

export default async function AdminShowsPage({
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

  const { data: shows } = await supabase
    .from('shows')
    .select('*')
    .order('event_date', { ascending: true })

  const editing = edit
    ? ((shows ?? []) as Show[]).find((s) => s.id === edit)
    : null

  return (
    <main className="min-h-screen bg-bg text-bone p-6 md:p-10">
      <AdminNav current="/admin/shows" />
      <h1 className="text-2xl font-bold mb-8">Shows</h1>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-10">
        <div className="space-y-3">
          {(shows ?? []).length === 0 && (
            <p className="text-bone-dim text-sm">No shows added yet.</p>
          )}
          {(shows as Show[] | null)?.map((s) => (
            <div
              key={s.id}
              className="border border-line rounded p-4 flex justify-between items-start gap-3"
            >
              <div>
                <p className="font-semibold">{s.title}</p>
                <p className="text-bone-dim text-xs mt-0.5">
                  {[s.venue, s.city].filter(Boolean).join(', ')} ·{' '}
                  {new Date(s.event_date).toLocaleDateString()} ·{' '}
                  {s.is_published ? 'Published' : 'Draft'}
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <a
                  href={`/admin/shows?edit=${s.id}`}
                  className="text-bone-dim hover:text-bone text-sm"
                >
                  Edit
                </a>
                <form action={deleteShow}>
                  <input type="hidden" name="id" value={s.id} />
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
          action={saveShow}
          key={editing?.id ?? 'new'}
          className="border border-line rounded p-6 space-y-4 h-fit"
        >
          <h2 className="font-semibold mb-2">
            {editing ? `Edit: ${editing.title}` : 'Add a show'}
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
              <label className={labelClass}>Venue</label>
              <input
                name="venue"
                defaultValue={editing?.venue ?? ''}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input
                name="city"
                defaultValue={editing?.city ?? ''}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Date &amp; time</label>
            <input
              type="datetime-local"
              name="event_date"
              defaultValue={toLocalInputValue(editing?.event_date)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Ticket URL</label>
            <input
              name="ticket_url"
              defaultValue={editing?.ticket_url ?? ''}
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={editing?.is_published ?? true}
            />
            Published (visible on the live site)
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-blood hover:bg-blood-bright transition-colors px-5 py-2.5 rounded text-sm font-semibold"
            >
              {editing ? 'Save changes' : 'Add show'}
            </button>
            {editing && (
              <a
                href="/admin/shows"
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
