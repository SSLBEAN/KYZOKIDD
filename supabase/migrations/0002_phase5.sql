-- Phase 5: site content management, media uploads, invite-only admins with usernames
-- Run this in the Supabase SQL editor.

-- Give admins a display name
alter table public.admins add column if not exists username text unique;

-- Single-row site-wide settings (title, about text, logo, accent color)
create table if not exists public.site_settings (
  id int primary key default 1,
  site_title text not null default 'KYZOKIDD',
  about_text text,
  logo_url text,
  accent_hex text not null default '#b3241f',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- Named image slots used throughout the homepage (hero, about, press, etc.)
-- image_url = null means "fall back to the bundled default photo"
create table if not exists public.site_media (
  slot text primary key,
  image_url text,
  updated_at timestamptz not null default now()
);
insert into public.site_media (slot) values
  ('hero'), ('about'), ('press'), ('shows_bg'),
  ('gallery_1'), ('gallery_2'), ('gallery_3'),
  ('gallery_4'), ('gallery_5'), ('gallery_6')
on conflict (slot) do nothing;

alter table public.site_settings enable row level security;
alter table public.site_media enable row level security;

create policy "public read site_settings" on public.site_settings
  for select using (true);
create policy "admins write site_settings" on public.site_settings
  for update using (public.is_admin());

create policy "public read site_media" on public.site_media
  for select using (true);
create policy "admins write site_media" on public.site_media
  for update using (public.is_admin());

-- Storage bucket for uploaded images (site photos, release covers, product photos)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media bucket" on storage.objects
  for select using (bucket_id = 'media');
create policy "admins upload to media bucket" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());
create policy "admins update media bucket" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());
create policy "admins delete from media bucket" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());
