import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/AdminNav'
import { EpkForm } from '@/components/EpkForm'
import type { EpkContent } from '@/lib/types'

export default async function AdminEpkPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login?error=no_session')

  const { data } = await supabase
    .from('epk_content')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  return (
    <main className="min-h-screen bg-bg text-bone p-6 md:p-10">
      <AdminNav current="/admin/epk" />
      <h1 className="text-2xl font-bold mb-2">Press Kit / EPK</h1>
      <p className="text-bone-dim text-sm mb-8 max-w-xl">
        Everything shown on the public <code>/press</code> page. Leave any
        field blank to keep the current default copy.
      </p>
      <EpkForm epk={data as EpkContent | null} />
    </main>
  )
}
