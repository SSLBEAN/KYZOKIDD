import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/AdminNav'
import { MediaSlotEditor } from '@/components/MediaSlotEditor'
import type { SiteMedia } from '@/lib/types'

const SLOT_LABELS: Record<string, string> = {
  hero: 'Homepage Hero',
  about: 'About Section Photo',
  press: 'Press / Contact Background',
  shows_bg: 'Shows Section Background',
  gallery_1: 'Photo Gallery — Tile 1',
  gallery_2: 'Photo Gallery — Tile 2',
  gallery_3: 'Photo Gallery — Tile 3',
  gallery_4: 'Photo Gallery — Tile 4',
  gallery_5: 'Photo Gallery — Tile 5',
  gallery_6: 'Photo Gallery — Tile 6',
}

export default async function AdminMediaPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login?error=no_session')

  const { data: media } = await supabase
    .from('site_media')
    .select('*')
    .order('slot', { ascending: true })

  const rows = (media ?? []) as SiteMedia[]

  return (
    <main className="min-h-screen bg-bg text-bone p-6 md:p-10">
      <AdminNav current="/admin/media" />
      <h1 className="text-2xl font-bold mb-2">Site Photos</h1>
      <p className="text-bone-dim text-sm mb-8">
        These are the fixed photo spots used across the homepage. Upload a
        new photo to replace one, or remove it to fall back to the original
        default.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((row) => (
          <MediaSlotEditor
            key={row.slot}
            slot={row.slot}
            label={SLOT_LABELS[row.slot] ?? row.slot}
            initialUrl={row.image_url}
          />
        ))}
      </div>
    </main>
  )
}
