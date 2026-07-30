-- KYZOKIDD site schema
-- Run this in the Supabase SQL editor (or via `supabase db push` once linked)

-- Admin roster: which auth.users are allowed into /admin
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Releases: songs / singles / projects, each gets its own page at /music/[slug]
create table if not exists public.releases (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  release_type text not null default 'single', -- single | ep | album | mixtape
  cover_image_url text,
  description text,
  release_date date,
  spotify_url text,
  soundcloud_url text,
  apple_music_url text,
  youtube_url text,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Videos: music videos / visuals, can optionally link to a release
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_video_id text not null,
  release_id uuid references public.releases(id) on delete set null,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Shows / events
create table if not exists public.shows (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  venue text,
  city text,
  event_date timestamptz not null,
  ticket_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Shop products (no live checkout yet — "buy_url" can point to an external store,
-- or be left null and swapped for real checkout later without changing the schema)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_cents int,
  image_url text,
  buy_url text,
  is_available boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Press / EPK assets (photos, one-sheet PDF, logo pack, etc.)
create table if not exists public.press_assets (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  file_url text not null,
  asset_type text not null default 'image', -- image | pdf | zip
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Email signups
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

-- Row Level Security: public can read published content, only admins can write
alter table public.releases enable row level security;
alter table public.videos enable row level security;
alter table public.shows enable row level security;
alter table public.products enable row level security;
alter table public.press_assets enable row level security;
alter table public.subscribers enable row level security;
alter table public.admins enable row level security;

create policy "public read published releases" on public.releases
  for select using (is_published = true);
create policy "public read videos" on public.videos
  for select using (true);
create policy "public read published shows" on public.shows
  for select using (is_published = true);
create policy "public read available products" on public.products
  for select using (is_available = true);
create policy "public read press assets" on public.press_assets
  for select using (true);

create policy "anyone can subscribe" on public.subscribers
  for insert with check (true);

-- Admins can do everything on every table
create policy "admins full access releases" on public.releases
  for all using (exists (select 1 from public.admins where user_id = auth.uid()));
create policy "admins full access videos" on public.videos
  for all using (exists (select 1 from public.admins where user_id = auth.uid()));
create policy "admins full access shows" on public.shows
  for all using (exists (select 1 from public.admins where user_id = auth.uid()));
create policy "admins full access products" on public.products
  for all using (exists (select 1 from public.admins where user_id = auth.uid()));
create policy "admins full access press" on public.press_assets
  for all using (exists (select 1 from public.admins where user_id = auth.uid()));
create policy "admins read subscribers" on public.subscribers
  for select using (exists (select 1 from public.admins where user_id = auth.uid()));
create policy "admins manage admins" on public.admins
  for all using (exists (select 1 from public.admins where user_id = auth.uid()));
