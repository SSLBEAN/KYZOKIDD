'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ---------- Releases ----------
export async function saveRelease(formData: FormData) {
  const supabase = await createClient()
  const id = String(formData.get('id') || '')
  const title = String(formData.get('title') || '').trim()

  const payload = {
    title,
    slug: slugify(title),
    release_type: String(formData.get('release_type') || 'single'),
    description: String(formData.get('description') || '') || null,
    release_date: String(formData.get('release_date') || '') || null,
    cover_image_url: String(formData.get('cover_image_url') || '') || null,
    spotify_url: String(formData.get('spotify_url') || '') || null,
    apple_music_url: String(formData.get('apple_music_url') || '') || null,
    soundcloud_url: String(formData.get('soundcloud_url') || '') || null,
    youtube_url: String(formData.get('youtube_url') || '') || null,
    is_published: formData.get('is_published') === 'on',
  }

  if (id) {
    await supabase.from('releases').update(payload).eq('id', id)
  } else {
    await supabase.from('releases').insert(payload)
  }

  revalidatePath('/admin/releases')
  revalidatePath('/')
  redirect('/admin/releases')
}

export async function deleteRelease(formData: FormData) {
  const supabase = await createClient()
  const id = String(formData.get('id') || '')
  await supabase.from('releases').delete().eq('id', id)
  revalidatePath('/admin/releases')
  revalidatePath('/')
}

// ---------- Videos ----------
export async function saveVideo(formData: FormData) {
  const supabase = await createClient()
  const id = String(formData.get('id') || '')

  const payload = {
    title: String(formData.get('title') || '').trim(),
    youtube_video_id: String(formData.get('youtube_video_id') || '').trim(),
    is_featured: formData.get('is_featured') === 'on',
  }

  if (id) {
    await supabase.from('videos').update(payload).eq('id', id)
  } else {
    await supabase.from('videos').insert(payload)
  }

  revalidatePath('/admin/videos')
  revalidatePath('/')
  redirect('/admin/videos')
}

export async function deleteVideo(formData: FormData) {
  const supabase = await createClient()
  const id = String(formData.get('id') || '')
  await supabase.from('videos').delete().eq('id', id)
  revalidatePath('/admin/videos')
  revalidatePath('/')
}

// ---------- Shows ----------
export async function saveShow(formData: FormData) {
  const supabase = await createClient()
  const id = String(formData.get('id') || '')

  const payload = {
    title: String(formData.get('title') || '').trim(),
    venue: String(formData.get('venue') || '') || null,
    city: String(formData.get('city') || '') || null,
    event_date: String(formData.get('event_date') || ''),
    ticket_url: String(formData.get('ticket_url') || '') || null,
    is_published: formData.get('is_published') === 'on',
  }

  if (id) {
    await supabase.from('shows').update(payload).eq('id', id)
  } else {
    await supabase.from('shows').insert(payload)
  }

  revalidatePath('/admin/shows')
  revalidatePath('/')
  redirect('/admin/shows')
}

export async function deleteShow(formData: FormData) {
  const supabase = await createClient()
  const id = String(formData.get('id') || '')
  await supabase.from('shows').delete().eq('id', id)
  revalidatePath('/admin/shows')
  revalidatePath('/')
}

// ---------- Products ----------
export async function saveProduct(formData: FormData) {
  const supabase = await createClient()
  const id = String(formData.get('id') || '')
  const priceInput = String(formData.get('price') || '').trim()

  const payload = {
    name: String(formData.get('name') || '').trim(),
    price_cents: priceInput ? Math.round(parseFloat(priceInput) * 100) : null,
    image_url: String(formData.get('image_url') || '') || null,
    buy_url: String(formData.get('buy_url') || '') || null,
    is_available: formData.get('is_available') === 'on',
  }

  if (id) {
    await supabase.from('products').update(payload).eq('id', id)
  } else {
    await supabase.from('products').insert(payload)
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
  redirect('/admin/products')
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClient()
  const id = String(formData.get('id') || '')
  await supabase.from('products').delete().eq('id', id)
  revalidatePath('/admin/products')
  revalidatePath('/')
}

// ---------- Auth ----------
export async function signOutAdmin() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

// ---------- Site settings ----------
export async function saveSiteSettings(formData: FormData) {
  const supabase = await createClient()

  const payload = {
    site_title: String(formData.get('site_title') || 'KYZOKIDD').trim(),
    about_text: String(formData.get('about_text') || '') || null,
    logo_url: String(formData.get('logo_url') || '') || null,
    accent_hex: String(formData.get('accent_hex') || '#b3241f'),
    welcome_email_subject: String(formData.get('welcome_email_subject') || '') || null,
    welcome_email_body: String(formData.get('welcome_email_body') || '') || null,
  }

  await supabase.from('site_settings').update(payload).eq('id', 1)
  revalidatePath('/admin/settings')
  revalidatePath('/')
  revalidatePath('/press')
}

// ---------- Site media (hero, about, gallery, etc images) ----------
export async function saveSiteMediaSlot(slot: string, imageUrl: string | null) {
  const supabase = await createClient()
  await supabase
    .from('site_media')
    .update({ image_url: imageUrl, updated_at: new Date().toISOString() })
    .eq('slot', slot)
  revalidatePath('/admin/media')
  revalidatePath('/')
  revalidatePath('/press')
}

// ---------- Invite a new admin ----------
export async function inviteAdmin(
  _prevState: { ok: boolean; message: string } | null,
  formData: FormData
): Promise<{ ok: boolean; message: string }> {
  const email = String(formData.get('email') || '').trim()
  const username = String(formData.get('username') || '').trim()

  if (!email || !email.includes('@')) {
    return { ok: false, message: 'Enter a valid email.' }
  }
  if (!username) {
    return { ok: false, message: 'Enter a username.' }
  }

  // Confirm the caller is actually an admin before using elevated access.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, message: 'Not signed in.' }

  const { data: adminRow } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!adminRow) return { ok: false, message: 'Not authorized.' }

  const { createAdminClient } = await import('@/lib/supabase/admin')
  const adminClient = createAdminClient()

  const { data: invited, error: inviteError } =
    await adminClient.auth.admin.inviteUserByEmail(email)

  if (inviteError || !invited.user) {
    return { ok: false, message: inviteError?.message || 'Invite failed.' }
  }

  const { error: insertError } = await adminClient
    .from('admins')
    .insert({ user_id: invited.user.id, username })

  if (insertError) {
    return { ok: false, message: insertError.message }
  }

  revalidatePath('/admin/team')
  return { ok: true, message: `Invited ${email} as "${username}".` }
}

// ---------- RNF members ----------
export async function saveRnfMember(formData: FormData) {
  const supabase = await createClient()
  const id = String(formData.get('id') || '')
  const payload = {
    name: String(formData.get('name') || '').trim(),
    sort_order: parseInt(String(formData.get('sort_order') || '0'), 10) || 0,
  }

  if (id) {
    await supabase.from('rnf_members').update(payload).eq('id', id)
  } else {
    await supabase.from('rnf_members').insert(payload)
  }

  revalidatePath('/admin/rnf')
  revalidatePath('/')
}

export async function deleteRnfMember(formData: FormData) {
  const supabase = await createClient()
  const id = String(formData.get('id') || '')
  await supabase.from('rnf_members').delete().eq('id', id)
  revalidatePath('/admin/rnf')
  revalidatePath('/')
}

// ---------- EPK content ----------
export async function saveEpkContent(formData: FormData) {
  const supabase = await createClient()

  const payload = {
    short_bio: String(formData.get('short_bio') || '') || null,
    full_bio: String(formData.get('full_bio') || '') || null,
    quote: String(formData.get('quote') || '') || null,
    achievements: String(formData.get('achievements') || '') || null,
    influences: String(formData.get('influences') || '') || null,
    style_text: String(formData.get('style_text') || '') || null,
    colors_text: String(formData.get('colors_text') || '') || null,
    manager_name: String(formData.get('manager_name') || '') || null,
    manager_phone: String(formData.get('manager_phone') || '') || null,
    pdf_url: String(formData.get('pdf_url') || '') || null,
  }

  await supabase.from('epk_content').update(payload).eq('id', 1)
  revalidatePath('/admin/epk')
  revalidatePath('/press')
  revalidatePath('/')
}
