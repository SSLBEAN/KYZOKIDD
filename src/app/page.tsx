import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Marquee } from "@/components/Marquee";
import { PhotoGallery } from "@/components/PhotoGallery";
import type { Product, Release, Show, Video } from "@/lib/types";

const FALLBACK_TICKER = [
  "ABANDONMENT ISSUES",
  "SO OVER IT",
  "FOREVER",
  "PROD. CAPOBEATZ & ANAGI",
  "RNF REAL NEVER FAIL",
];

const FALLBACK_VIDEOS: Video[] = [
  { id: "f1", title: "FOREVER", youtube_video_id: "wdNDeSRIRjc", release_id: null, is_featured: true, sort_order: 0 },
  { id: "f2", title: "Abandonment Issues", youtube_video_id: "-dr7X6v6vdk", release_id: null, is_featured: false, sort_order: 1 },
  { id: "f3", title: "Music Video", youtube_video_id: "bOUiHNUeMUU", release_id: null, is_featured: false, sort_order: 2 },
  { id: "f4", title: "Music Video", youtube_video_id: "D3K8jpKq27c", release_id: null, is_featured: false, sort_order: 3 },
];

function formatPrice(cents: number | null) {
  if (cents == null) return "$—";
  return `$${(cents / 100).toFixed(2)}`;
}

function formatShowDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function Home() {
  const supabase = await createClient();

  const [releasesRes, videosRes, showsRes, productsRes] = await Promise.all([
    supabase
      .from("releases")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true }),
    supabase.from("videos").select("*").order("sort_order", { ascending: true }),
    supabase
      .from("shows")
      .select("*")
      .eq("is_published", true)
      .gte("event_date", new Date().toISOString())
      .order("event_date", { ascending: true }),
    supabase
      .from("products")
      .select("*")
      .eq("is_available", true)
      .order("sort_order", { ascending: true }),
  ]);

  const releases = (releasesRes.data ?? []) as Release[];
  const videos = ((videosRes.data ?? []) as Video[]).length
    ? (videosRes.data as Video[])
    : FALLBACK_VIDEOS;
  const shows = (showsRes.data ?? []) as Show[];
  const products = (productsRes.data ?? []) as Product[];

  const featuredVideo = videos.find((v) => v.is_featured) ?? videos[0];
  const sideVideos = videos.filter((v) => v.id !== featuredVideo?.id).slice(0, 3);

  const ticker = releases.length
    ? releases.map((r) => r.title.toUpperCase())
    : FALLBACK_TICKER;

  return (
    <>
      <SiteNav />

      {/* HERO — full bleed, minimal chrome, cinematic */}
      <section className="relative h-screen">
        <Image
          src="/images/hero.jpg"
          alt="Kyzo Kidd"
          fill
          priority
          className="object-cover object-[center_20%] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-bg/50" />
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-10 md:pb-14">
          <h1 className="font-display uppercase leading-[0.82] tracking-tight text-[16vw] md:text-[8vw] drop-shadow-[0_4px_50px_rgba(0,0,0,0.7)]">
            Kyzo Kidd
          </h1>
          <div className="flex justify-between items-end mt-3">
            <p className="font-mono-brand text-[11px] md:text-sm tracking-[2px] text-bone-dim uppercase">
              New Jersey · RNF ★ real never fail
            </p>
            <Link
              href="#music"
              className="hidden md:block font-mono-brand text-xs tracking-wider uppercase text-bone-dim hover:text-bone transition-colors"
            >
              Scroll ↓
            </Link>
          </div>
        </div>
      </section>

      <Marquee items={ticker} />

      {/* PHOTO GALLERY — OVO-style mosaic */}
      <PhotoGallery />

      {/* MUSIC */}
      <section id="music" className="px-6 md:px-10 py-20 md:py-28">
        <div className="flex justify-between items-end mb-12 border-b border-line pb-5">
          <h2 className="font-display uppercase text-4xl md:text-6xl tracking-tight">
            Music
          </h2>
          <span className="font-mono-brand text-bone-dim text-sm">01</span>
        </div>
        <div className="max-w-3xl">
          {releases.length === 0 && (
            <p className="text-bone-dim text-sm">
              No releases published yet — add one from the admin dashboard.
            </p>
          )}
          {releases.map((r, i) => (
            <Link
              href={`/music/${r.slug}`}
              key={r.id}
              className="grid grid-cols-[50px_1fr_auto_auto] gap-5 items-center py-5 border-b border-line hover:bg-bone/[0.03] transition-colors"
            >
              <span className="font-mono-brand text-gold text-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-lg font-semibold">{r.title}</span>
              <span className="font-mono-brand text-[11px] text-bone-dim uppercase tracking-wide">
                {r.release_type}
              </span>
              <span className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-xs">
                ▶
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT — full bleed photo left, copy right, no boxed border */}
      <section id="about" className="grid md:grid-cols-2">
        <div className="relative aspect-square md:aspect-auto md:min-h-[600px]">
          <Image
            src="/images/about.jpg"
            alt="Kyzo Kidd portrait"
            fill
            className="object-cover object-[center_15%]"
          />
        </div>
        <div className="flex flex-col justify-center px-6 md:px-14 py-16 md:py-0">
          <span className="font-mono-brand text-[11px] uppercase tracking-[2px] text-gold mb-5">
            About / 02
          </span>
          <p className="font-mono-brand text-xs text-bone-dim mb-4">
            Englewood, NJ · 6 Years Active
          </p>
          <div className="space-y-5 text-bone-dim text-base leading-[1.85] max-w-md">
            <p>
              With a fearless commitment to truth and raw emotion,{" "}
              <strong className="text-bone font-semibold">Kyzo Kidd</strong> is
              carving his own lane in contemporary music. Hailing from the
              streets of New Jersey, his sound is shaped by a life of
              hardship, resilience, and unwavering determination.
            </p>
            <p>
              Blending hip-hop, R&amp;B, pop, and beyond, his music reflects a
              journey of overcoming sorrow and neglect while embracing
              self-empowerment — turning pain into power, track after track.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {["Kanye West", "Michael Jackson", "Tory Lanez", "Juice WRLD"].map(
                (name) => (
                  <span
                    key={name}
                    className="font-mono-brand text-[11px] border border-line rounded-full px-3 py-1.5 text-bone-dim"
                  >
                    {name}
                  </span>
                )
              )}
            </div>
            <Link
              href="/press"
              className="inline-block text-xs uppercase tracking-wider text-bone-dim hover:text-bone pt-2"
            >
              Full Press Kit / EPK →
            </Link>
          </div>
        </div>
      </section>

      {/* RNF STRIP */}
      <div className="bg-violet border-y border-line">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-16 items-center px-6 md:px-10 py-14 md:py-16">
          <h3 className="font-display text-3xl md:text-5xl leading-none">
            RNF <span className="text-gold">★</span>
            <br />
            real never fail
          </h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <span className="font-mono-brand text-[11px] uppercase tracking-[2px] text-bone/50">
                Collective
              </span>
              <ul className="mt-3 space-y-1.5 text-sm text-bone/85">
                <li>Anagi</li>
                <li>CapoBeatz</li>
                <li>Hoodie Bubby</li>
                <li>Jailynn</li>
                <li>Trxst</li>
              </ul>
            </div>
            <div>
              <span className="font-mono-brand text-[11px] uppercase tracking-[2px] text-bone/50">
                Management
              </span>
              <p className="mt-3 text-sm text-bone/85">@itzcapobeatz_</p>
            </div>
          </div>
        </div>
      </div>

      {/* VIDEOS */}
      {featuredVideo && (
        <section id="videos" className="px-6 md:px-10 py-20 md:py-28">
          <div className="flex justify-between items-end mb-12 border-b border-line pb-5">
            <h2 className="font-display uppercase text-4xl md:text-6xl tracking-tight">
              Videos
            </h2>
            <span className="font-mono-brand text-bone-dim text-sm">03</span>
          </div>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-6">
            <div className="relative aspect-video overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${featuredVideo.youtube_video_id}`}
                title={featuredVideo.title}
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="flex flex-col gap-6">
              {sideVideos.map((v) => (
                <a
                  key={v.id}
                  href={`https://www.youtube.com/watch?v=${v.youtube_video_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-video overflow-hidden block group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${v.youtube_video_id}/hqdefault.jpg`}
                    alt={v.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-blood/85 flex items-center justify-center text-sm">
                    ▶
                  </span>
                  <span className="absolute bottom-0 left-0 right-0 px-3.5 py-3 bg-gradient-to-t from-black/85 to-transparent text-sm font-semibold">
                    {v.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRESS / CONTACT — full bleed photo strip */}
      <section id="press" className="relative min-h-[50vh] flex items-end">
        <Image
          src="/images/press.jpg"
          alt=""
          fill
          className="object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-bg/10" />
        <div className="relative px-6 md:px-10 pb-16 grid md:grid-cols-2 gap-10 w-full">
          <div>
            <span className="font-mono-brand text-[11px] uppercase tracking-[2px] text-gold">
              Press / EPK
            </span>
            <Link
              href="/press"
              className="block font-display text-3xl mt-3 hover:text-blood-bright transition-colors"
            >
              One-sheet, photos, contact →
            </Link>
          </div>
          <div>
            <span className="font-mono-brand text-[11px] uppercase tracking-[2px] text-gold">
              Booking &amp; Inquiries
            </span>
            <a
              href="mailto:kyzokiddmusic@gmail.com"
              className="block font-display text-3xl mt-3 hover:text-blood-bright transition-colors"
            >
              kyzokiddmusic@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* SHOWS */}
      <section
        id="shows"
        className="px-6 md:px-10 py-20 md:py-28 relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,10,10,0.9), rgba(10,10,10,0.96)), url(/images/shows-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        <div className="flex justify-between items-end mb-12 border-b border-line pb-5">
          <h2 className="font-display uppercase text-4xl md:text-6xl tracking-tight">
            Shows
          </h2>
          <span className="font-mono-brand text-bone-dim text-sm">04</span>
        </div>
        {shows.length === 0 ? (
          <p className="text-bone-dim text-sm max-w-md">
            No dates announced yet — check back soon, or sign up below to get
            notified first.
          </p>
        ) : (
          <div className="max-w-2xl space-y-4">
            {shows.map((s) => (
              <div
                key={s.id}
                className="flex justify-between items-center border-b border-line pb-4"
              >
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-bone-dim text-sm">
                    {[s.venue, s.city].filter(Boolean).join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono-brand text-sm text-gold">
                    {formatShowDate(s.event_date)}
                  </p>
                  {s.ticket_url && (
                    <a
                      href={s.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-bone-dim hover:text-bone text-xs"
                    >
                      Tickets →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SHOP */}
      <section id="shop" className="px-6 md:px-10 py-20 md:py-28">
        <div className="flex justify-between items-end mb-12 border-b border-line pb-5">
          <h2 className="font-display uppercase text-4xl md:text-6xl tracking-tight">
            Store
          </h2>
          <span className="font-mono-brand text-bone-dim text-sm">05</span>
        </div>
        {products.length === 0 ? (
          <p className="text-bone-dim text-sm">
            No products listed yet — add some from the admin dashboard.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
            {products.map((p) => {
              const card = (
                <div className="group">
                  <div className="relative aspect-square bg-bone/5 overflow-hidden">
                    {p.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    )}
                  </div>
                  <div className="pt-3 flex justify-between items-center">
                    <span className="text-sm font-semibold">{p.name}</span>
                    <span className="font-mono-brand text-sm text-gold">
                      {formatPrice(p.price_cents)}
                    </span>
                  </div>
                </div>
              );
              return p.buy_url ? (
                <a
                  key={p.id}
                  href={p.buy_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {card}
                </a>
              ) : (
                <div key={p.id}>{card}</div>
              );
            })}
          </div>
        )}
      </section>

      <SiteFooter />
    </>
  );
}
