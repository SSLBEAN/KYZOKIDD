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
