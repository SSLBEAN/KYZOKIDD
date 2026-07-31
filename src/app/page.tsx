import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Marquee } from "@/components/Marquee";
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
  { id: "f2", title: "Best That Ever Did This", youtube_video_id: "OF3eFqJNTOE", release_id: null, is_featured: false, sort_order: 1 },
  { id: "f3", title: "Abandonment Issues", youtube_video_id: "-dr7X6v6vdk", release_id: null, is_featured: false, sort_order: 2 },
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
  const sideVideos = videos.filter((v) => v.id !== featuredVideo?.id).slice(0, 2);

  const ticker = releases.length
    ? releases.map((r) => r.title.toUpperCase())
    : FALLBACK_TICKER;

  return (
    <>
      <SiteHeader />

      {/* HERO */}
      <section className="relative h-screen flex items-end">
        <Image
          src="/images/hero.jpg"
          alt="Kyzo Kidd"
          fill
          priority
          className="object-cover object-[center_20%] -z-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/35 to-bg/55 -z-10" />
        <div className="px-6 md:px-10 pb-16 md:pb-20 w-full">
          <div className="flex items-center gap-2.5 font-mono-brand text-xs tracking-[3px] text-gold uppercase mb-4">
            <span className="w-6 h-px bg-gold" />
            New Jersey · RNF ★ Real Never Fail
          </div>
          <h1 className="font-display uppercase leading-[0.85] tracking-tight text-[15vw] md:text-[9vw] drop-shadow-[0_4px_40px_rgba(0,0,0,0.6)]">
            Turning
            <br />
            Pain{" "}
            <span className="text-transparent [-webkit-text-stroke:1.5px_#ede8e0]">
              Into
            </span>
            <br />
            Power
          </h1>
          <p className="max-w-lg mt-6 text-bone-dim text-[15px] leading-relaxed">
            Kyzo Kidd fuses hip-hop, R&amp;B, and pop into a sound built from
            heartbreak, resilience, and self-empowerment. The sixth studio
            project is on the way.
          </p>
          <div className="flex gap-4 mt-9">
            <Link
              href="#music"
              className="bg-blood hover:bg-blood-bright transition-colors px-7 py-3.5 text-xs tracking-wider uppercase font-semibold rounded-sm"
            >
              Hear the Music
            </Link>
            <Link
              href="#press"
              className="border border-bone/40 backdrop-blur-sm px-7 py-3.5 text-xs tracking-wider uppercase rounded-sm hover:border-bone transition-colors"
            >
              Press Kit / EPK
            </Link>
          </div>
        </div>
      </section>

      <Marquee items={ticker} />

      {/* MUSIC */}
      <section id="music" className="px-6 md:px-10 py-24 md:py-32">
        <div className="flex justify-between items-end mb-14 border-b border-line pb-5">
          <h2 className="font-display uppercase text-4xl md:text-5xl tracking-tight">
            Music
          </h2>
          <span className="font-mono-brand text-bone-dim text-sm">Catalog / 01</span>
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

      {/* ABOUT */}
      <section id="about" className="px-6 md:px-10 py-24 md:py-32">
        <div className="flex justify-between items-end mb-14 border-b border-line pb-5">
          <h2 className="font-display uppercase text-4xl md:text-5xl tracking-tight">
            About
          </h2>
          <span className="font-mono-brand text-bone-dim text-sm">Bio / 02</span>
        </div>
        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-16 items-center">
          <div className="relative aspect-[4/5] border border-line overflow-hidden">
            <Image
              src="/images/about.jpg"
              alt="Kyzo Kidd portrait"
              fill
              className="object-cover object-[center_15%]"
            />
          </div>
          <div className="space-y-5 text-bone-dim text-base leading-[1.85]">
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
          </div>
        </div>
      </section>

      {/* RNF STRIP */}
      <div className="bg-violet border-y border-line">
        <div className="flex justify-between items-center flex-wrap gap-5 px-6 md:px-10 py-12">
          <h3 className="font-display text-2xl md:text-4xl">
            RNF <span className="text-gold">★</span> Real Never Fail
          </h3>
          <p className="font-mono-brand text-sm text-bone/75 leading-relaxed">
            Collective: Anagi · CapoBeatz · Hoodie Bubby · Jailynn · Trxst
            <br />
            Mgmt: @itzcapobeatz_
          </p>
        </div>
      </div>

      {/* VIDEOS */}
      {featuredVideo && (
        <section id="videos" className="px-6 md:px-10 py-24 md:py-32">
          <div className="flex justify-between items-end mb-14 border-b border-line pb-5">
            <h2 className="font-display uppercase text-4xl md:text-5xl tracking-tight">
              Videos
            </h2>
            <span className="font-mono-brand text-bone-dim text-sm">Visuals / 03</span>
          </div>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-6">
            <div className="relative aspect-video border border-line overflow-hidden">
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
                  className="relative aspect-video border border-line overflow-hidden block group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${v.youtube_video_id}/hqdefault.jpg`}
                    alt={v.title}
                    className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all"
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

      {/* PRESS / CONTACT */}
      <section id="press" className="grid md:grid-cols-2 gap-px bg-line">
        <div className="relative bg-bg p-10 md:p-12 min-h-[280px] flex flex-col justify-between overflow-hidden">
          <Image
            src="/images/press.jpg"
            alt=""
            fill
            className="object-cover object-[center_20%] -z-10 opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-bg/40 to-bg/90 -z-10" />
          <span className="font-mono-brand text-[11px] uppercase tracking-[2px] text-gold">
            Press / EPK
          </span>
          <div>
            <h3 className="font-display text-2xl mb-4">
              One-sheet, photos, contact
            </h3>
            <span className="text-bone-dim text-sm">
              Reach out for the full press kit →
            </span>
          </div>
        </div>
        <div className="bg-bg p-10 md:p-12 min-h-[280px] flex flex-col justify-between">
          <span className="font-mono-brand text-[11px] uppercase tracking-[2px] text-gold">
            Contact
          </span>
          <div>
            <h3 className="font-display text-2xl mb-4">Booking &amp; inquiries</h3>
            <a
              href="mailto:kyzokiddmusic@gmail.com"
              className="text-bone-dim hover:text-bone text-sm"
            >
              kyzokiddmusic@gmail.com →
            </a>
          </div>
        </div>
      </section>

      {/* SHOWS */}
      <section
        id="shows"
        className="px-6 md:px-10 py-24 md:py-32 relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,10,10,0.88), rgba(10,10,10,0.96)), url(/images/shows-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        <div className="flex justify-between items-end mb-14 border-b border-line pb-5">
          <h2 className="font-display uppercase text-4xl md:text-5xl tracking-tight">
            Shows
          </h2>
          <span className="font-mono-brand text-bone-dim text-sm">Events / 04</span>
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
      <section id="shop" className="px-6 md:px-10 py-24 md:py-32">
        <div className="flex justify-between items-end mb-14 border-b border-line pb-5">
          <h2 className="font-display uppercase text-4xl md:text-5xl tracking-tight">
            Store
          </h2>
          <span className="font-mono-brand text-bone-dim text-sm">Merch / 05</span>
        </div>
        {products.length === 0 ? (
          <p className="text-bone-dim text-sm">
            No products listed yet — add some from the admin dashboard.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((p) => {
              const card = (
                <div className="border border-line">
                  <div className="relative aspect-square bg-bone/5">
                    {p.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4 flex justify-between items-center">
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
