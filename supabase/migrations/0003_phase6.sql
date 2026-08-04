-- Phase 6: RNF member management, editable EPK content, editable welcome email copy
-- Run in the Supabase SQL editor.

create table if not exists public.rnf_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.epk_content (
  id int primary key default 1,
  short_bio text,
  full_bio text,
  quote text,
  achievements text,
  influences text,
  style_text text,
  colors_text text,
  manager_name text,
  manager_phone text,
  pdf_url text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into public.epk_content (id) values (1) on conflict (id) do nothing;

alter table public.rnf_members enable row level security;
alter table public.epk_content enable row level security;

create policy "public read rnf_members" on public.rnf_members
  for select using (true);
create policy "admins write rnf_members" on public.rnf_members
  for all using (public.is_admin());

create policy "public read epk_content" on public.epk_content
  for select using (true);
create policy "admins write epk_content" on public.epk_content
  for update using (public.is_admin());

-- Editable subject/body for the welcome email sent on sign-up
alter table public.site_settings add column if not exists welcome_email_subject text
  default 'Welcome to the KYZOKIDD list';
alter table public.site_settings add column if not exists welcome_email_body text
  default 'Thanks for signing up — you''ll be the first to hear about new music, videos, and shows.';
