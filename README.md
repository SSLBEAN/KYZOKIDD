# KYZOKIDD — Artist Hub

Next.js + Supabase site for Kyzo Kidd. Homepage/Music/Videos/About/Shows/Store/Contact/EPK, with an admin dashboard for Kyzo/his manager to manage content.

## 1. Create the Supabase project

1. Go to https://supabase.com, create a new project (free tier is fine to start).
2. Once it's created, go to **SQL Editor** and paste in the contents of
   `supabase/migrations/0001_init.sql`, then run it. This creates all the tables
   (releases, videos, shows, products, press_assets, subscribers, admins) and
   locks them down with row-level security so only signed-in admins can edit.
3. Go to **Authentication → Providers** and make sure Email is enabled.
4. Go to **Authentication → Users** and manually invite/create the first admin
   user (Kyzo or his manager's email). Note the user's UUID.
5. Back in the SQL Editor, run:
   ```sql
   insert into public.admins (user_id) values ('paste-the-uuid-here');
   ```
   This is what actually grants dashboard access — being a registered user
   alone isn't enough, they also need a row in `admins`.
6. Go to **Settings → API** and copy the **Project URL** and **anon public key**.

## 2. Local setup

```bash
cp .env.local.example .env.local
# paste in the Project URL and anon key from step 1.6

npm install
npm run dev
```

Visit http://localhost:3000 — you should see "No releases yet" (expected, table's empty).
Visit http://localhost:3000/admin/login and sign in with the admin account you created.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial scaffold: Next.js + Supabase + schema"
git branch -M main
git remote add origin <your-empty-repo-URL>
git push -u origin main
```

## 4. Deploy to Vercel

1. Import the repo at https://vercel.com/new
2. Add the two env vars from `.env.local` in the Vercel project settings
   (Settings → Environment Variables)
3. Deploy

## What's here so far

- Next.js (App Router, TypeScript, Tailwind)
- Supabase client (browser + server) wired up in `src/lib/supabase`
- `supabase/migrations/0001_init.sql` — full schema + RLS policies
- Admin auth: login, password reset, dashboard shell (`/admin`)
- Homepage placeholder that reads live from the `releases` table, just to
  prove the connection works end to end

## What's next

- Bring in the real homepage design (the demo you approved) and wire it to
  real data instead of hardcoded placeholder copy
- Per-release pages at `/music/[slug]`
- Admin CRUD screens for releases/videos/shows/products/press assets
- Decide shop checkout approach (still open — external links vs. Stripe)
