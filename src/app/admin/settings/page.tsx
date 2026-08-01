import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/AdminNav'
import { saveSiteSettings } from '@/app/admin/actions'
import type { SiteSettings } from '@/lib/types'

const inputClass =
  'w-full bg-transparent border border-line rounded px-3 py-2 text-sm outline-none focus:border-bone-dim'
const labelClass = 'block text-xs text-bone-dim mb-1 uppercase tracking-wide'

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login?error=no_session')

  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  const settings = settingsData as SiteSettings | null

  return (
    <main className="min-h-screen bg-bg text-bone p-6 md:p-10">
      <AdminNav current="/admin/settings" />
      <h1 className="text-2xl font-bold mb-2">Site Settings</h1>
      <p className="text-bone-dim text-sm mb-8 max-w-xl">
        Controls the site title, the About section text, the logo, and the
        one accent color used across buttons and links. This isn&apos;t a
        full page builder — layout and fonts stay as designed — but it covers
        the text and branding you&apos;ll actually want to update yourself.
      </p>

      <form
        action={saveSiteSettings}
        className="border border-line rounded p-6 space-y-5 max-w-xl"
      >
        <div>
          <label className={labelClass}>Site title</label>
          <input
            name="site_title"
            defaultValue={settings?.site_title ?? 'KYZOKIDD'}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>About section text</label>
          <textarea
            name="about_text"
            rows={6}
            defaultValue={settings?.about_text ?? ''}
            placeholder="Leave blank to use the default bio copy."
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Logo image URL</label>
          <input
            name="logo_url"
            defaultValue={settings?.logo_url ?? ''}
            placeholder="Leave blank to use the KYZOKIDD text wordmark"
            className={inputClass}
          />
          <p className="text-bone-dim text-xs mt-1">
            Upload a logo from the Site Photos tab first, then paste its URL
            here.
          </p>
        </div>

        <div>
          <label className={labelClass}>Accent color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              name="accent_hex"
              defaultValue={settings?.accent_hex ?? '#b3241f'}
              className="w-12 h-10 bg-transparent border border-line rounded cursor-pointer"
            />
            <span className="text-bone-dim text-sm">
              Used for buttons, links, and highlights
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blood hover:bg-blood-bright transition-colors px-5 py-2.5 rounded text-sm font-semibold"
        >
          Save settings
        </button>
      </form>
    </main>
  )
}
