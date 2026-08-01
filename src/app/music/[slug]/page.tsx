import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import type { Release } from "@/lib/types";

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: release } = await supabase
    .from("releases")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!release) notFound();

  const { data: settingsData } = await supabase
    .from("site_settings")
    .select("logo_url")
    .eq("id", 1)
    .maybeSingle();
  const logoUrl = (settingsData as { logo_url: string | null } | null)?.logo_url;

  const r = release as Release;

  const links = [
    ["Spotify", r.spotify_url],
    ["Apple Music", r.apple_music_url],
    ["SoundCloud", r.soundcloud_url],
    ["YouTube", r.youtube_url],
  ].filter(([, url]) => Boolean(url)) as [string, string][];

  return (
    <>
      <SiteNav logoUrl={logoUrl} />
      <section className="px-6 md:px-10 pt-32 md:pt-40 pb-24 max-w-4xl mx-auto">
        <Link href="/#music" className="text-bone-dim hover:text-bone text-sm">
          ← Back to Music
        </Link>

        <div className="grid md:grid-cols-[0.8fr_1.2fr] gap-12 mt-8 items-start">
          <div className="relative aspect-square border border-line overflow-hidden bg-bone/5">
            {r.cover_image_url && (
              <Image
                src={r.cover_image_url}
                alt={r.title}
                fill
                className="object-cover"
                unoptimized
              />
            )}
          </div>

          <div>
            <span className="font-mono-brand text-[11px] uppercase tracking-[2px] text-gold">
              {r.release_type}
              {r.release_date &&
                ` · ${new Date(r.release_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}`}
            </span>
            <h1 className="font-display uppercase text-4xl md:text-6xl mt-3 mb-6 leading-[0.9]">
              {r.title}
            </h1>

            {r.description && (
              <p className="text-bone-dim leading-relaxed mb-8 whitespace-pre-line">
                {r.description}
              </p>
            )}

            {links.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {links.map(([label, url]) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-line rounded-sm px-5 py-2.5 text-xs uppercase tracking-wider hover:border-blood-bright hover:text-blood-bright transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
