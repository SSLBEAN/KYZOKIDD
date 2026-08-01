export type Release = {
  id: string
  slug: string
  title: string
  release_type: string
  cover_image_url: string | null
  description: string | null
  release_date: string | null
  spotify_url: string | null
  soundcloud_url: string | null
  apple_music_url: string | null
  youtube_url: string | null
  is_published: boolean
  sort_order: number
}

export type Video = {
  id: string
  title: string
  youtube_video_id: string
  release_id: string | null
  is_featured: boolean
  sort_order: number
}

export type Show = {
  id: string
  title: string
  venue: string | null
  city: string | null
  event_date: string
  ticket_url: string | null
  is_published: boolean
}

export type Product = {
  id: string
  name: string
  price_cents: number | null
  image_url: string | null
  buy_url: string | null
  is_available: boolean
  sort_order: number
}

export type PressAsset = {
  id: string
  label: string
  file_url: string
  asset_type: string
  sort_order: number
}

export type SiteSettings = {
  id: number
  site_title: string
  about_text: string | null
  logo_url: string | null
  accent_hex: string
}

export type SiteMedia = {
  slot: string
  image_url: string | null
}
