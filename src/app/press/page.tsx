import Image from "next/image";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Press Kit / EPK — KYZOKIDD",
};

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-10 border-b border-line">
      <span className="font-mono-brand text-[11px] uppercase tracking-[2px] text-gold block mb-4">
        {label}
      </span>
      {children}
    </section>
  );
}

export default async function PressPage() {
  const supabase = await createClient();
  const [{ data: settingsData }, { data: mediaData }] = await Promise.all([
    supabase.from("site_settings").select("logo_url").eq("id", 1).maybeSingle(),
    supabase.from("site_media").select("image_url").eq("slot", "press").maybeSingle(),
  ]);
  const logoUrl = (settingsData as { logo_url: string | null } | null)?.logo_url;
  const pressImage =
    (mediaData as { image_url: string | null } | null)?.image_url || "/images/press.jpg";

  return (
    <>
      <SiteNav logoUrl={logoUrl} />

      <section className="relative h-[55vh] min-h-[380px] flex items-end">
        <Image
          src={pressImage}
          alt="Kyzo Kidd"
          fill
          unoptimized
          priority
          className="object-cover object-[center_20%] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-bg/60" />
        <div className="relative px-6 md:px-10 pb-10">
          <span className="font-mono-brand text-xs uppercase tracking-[2px] text-gold">
            Press Kit / EPK
          </span>
          <h1 className="font-display uppercase text-5xl md:text-7xl mt-2">
            Kyzo Kidd
          </h1>
        </div>
      </section>

      <div className="px-6 md:px-10 max-w-4xl mx-auto">
        <Section label="Overview">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-bone-dim text-xs uppercase tracking-wide mb-1">
                Genre
              </p>
              <p>Hip-Hop / Rap</p>
            </div>
            <div>
              <p className="text-bone-dim text-xs uppercase tracking-wide mb-1">
                Location
              </p>
              <p>Englewood, NJ</p>
            </div>
            <div>
              <p className="text-bone-dim text-xs uppercase tracking-wide mb-1">
                Years Active
              </p>
              <p>6</p>
            </div>
            <div>
              <p className="text-bone-dim text-xs uppercase tracking-wide mb-1">
                Crew
              </p>
              <p>RNF — Real Never Fail</p>
            </div>
          </div>
        </Section>

        <Section label="Short Bio">
          <p className="text-bone-dim leading-relaxed max-w-2xl">
            Kyzo Kidd is a Englewood, NJ–based hip-hop artist delivering raw,
            melodic energy with a modern edge. Blending street narratives with
            introspective storytelling, his sound captures both grit and
            growth. With six years in the game, Kyzo Kidd continues to build a
            loyal audience through authenticity and consistency.
          </p>
        </Section>

        <Section label="Full Bio">
          <div className="space-y-4 text-bone-dim leading-relaxed max-w-2xl">
            <p>
              Hailing from Englewood, New Jersey, Kyzo Kidd has been carving
              out his lane in hip-hop for over six years, developing a sound
              that balances emotional depth with hard-hitting delivery. His
              music reflects real-life experiences, combining melodic flows
              with sharp lyricism that speaks to both struggle and ambition.
            </p>
            <p>
              Drawing inspiration from modern rap&apos;s evolution while
              staying rooted in authenticity, Kyzo Kidd creates records that
              resonate with listeners navigating their own journeys. His
              ability to switch between introspective tones and confident,
              high-energy performances makes his catalog versatile and
              engaging.
            </p>
            <p>
              With releases like &quot;Pardon Me&quot; gaining traction across
              streaming platforms, Kyzo Kidd continues to elevate his
              presence, positioning himself as a rising voice in the
              independent hip-hop scene. His dedication to growth, both
              artistically and personally, sets the foundation for a
              promising career ahead.
            </p>
          </div>
        </Section>

        <Section label="Music">
          <p className="text-bone-dim text-xs uppercase tracking-wide mb-1">
            Latest Release
          </p>
          <a
            href="https://music.apple.com/us/album/pardon-me/1871877995?i=1871877996"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-2xl hover:text-blood-bright transition-colors"
          >
            Pardon Me
          </a>

          <div className="grid sm:grid-cols-2 gap-3 mt-8 max-w-md">
            <a
              href="https://open.spotify.com/artist/6BFK2whBZLZa9E1YjNSrJi?si=kdu_nl8YRXKAEONLLvOS6A"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-line rounded-sm px-4 py-2.5 text-xs uppercase tracking-wider hover:border-blood-bright hover:text-blood-bright transition-colors text-center"
            >
              Spotify
            </a>
            <a
              href="https://music.apple.com/us/artist/kyzo-kidd/1437545648"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-line rounded-sm px-4 py-2.5 text-xs uppercase tracking-wider hover:border-blood-bright hover:text-blood-bright transition-colors text-center"
            >
              Apple Music
            </a>
            <a
              href="https://on.soundcloud.com/n82H7RJlqD80BEIVBg"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-line rounded-sm px-4 py-2.5 text-xs uppercase tracking-wider hover:border-blood-bright hover:text-blood-bright transition-colors text-center"
            >
              SoundCloud
            </a>
            <a
              href="https://www.youtube.com/@KyzoKiddOfficial"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-line rounded-sm px-4 py-2.5 text-xs uppercase tracking-wider hover:border-blood-bright hover:text-blood-bright transition-colors text-center"
            >
              YouTube
            </a>
          </div>
        </Section>

        <Section label="Press / Media">
          <p className="text-bone-dim text-xs uppercase tracking-wide mb-2">
            Quote
          </p>
          <blockquote className="text-lg italic text-bone-dim max-w-xl border-l-2 border-gold pl-4">
            &quot;Kyzo Kidd brings a refreshing mix of melody and authenticity
            to modern hip-hop.&quot;
          </blockquote>
        </Section>

        <Section label="Achievements">
          <ul className="space-y-2 text-bone-dim text-sm list-disc list-inside">
            <li>Growing streaming presence across major platforms</li>
            <li>Independent artist with consistent releases</li>
            <li>Building a dedicated fanbase in New Jersey and beyond</li>
          </ul>
        </Section>

        <Section label="Shows">
          <p className="text-bone-dim text-xs uppercase tracking-wide mb-1">
            Past Highlights
          </p>
          <p className="text-sm">Deiner Park / Rutgers Unity Day — New Brunswick, NJ</p>
        </Section>

        <Section label="Brand / Aesthetic">
          <div className="space-y-4 max-w-2xl text-sm">
            <div>
              <p className="text-bone-dim text-xs uppercase tracking-wide mb-1">
                Style
              </p>
              <p className="text-bone-dim leading-relaxed">
                Moody, melodic, and authentic with a street-influenced edge. A
                balance of introspection and confidence, reflecting real-life
                experiences and ambition.
              </p>
            </div>
            <div>
              <p className="text-bone-dim text-xs uppercase tracking-wide mb-1">
                Influences
              </p>
              <div className="flex flex-wrap gap-2">
                {["Juice WRLD", "XXXTENTACION", "Polo G", "Michael Jackson"].map(
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
            <div>
              <p className="text-bone-dim text-xs uppercase tracking-wide mb-1">
                Colors / Themes
              </p>
              <p className="text-bone-dim leading-relaxed">
                Dark tones, black/white contrast, urban visuals, night-life
                atmosphere.
              </p>
            </div>
          </div>
        </Section>

        <Section label="Social Media">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl text-sm">
            <a href="https://www.instagram.com/kyzokidd/" target="_blank" rel="noopener noreferrer" className="text-bone-dim hover:text-bone">Instagram</a>
            <a href="https://www.tiktok.com/@kyzokiddofficial" target="_blank" rel="noopener noreferrer" className="text-bone-dim hover:text-bone">TikTok</a>
            <a href="https://www.youtube.com/@KyzoKiddOfficial" target="_blank" rel="noopener noreferrer" className="text-bone-dim hover:text-bone">YouTube</a>
            <a href="https://x.com/kyzokidd" target="_blank" rel="noopener noreferrer" className="text-bone-dim hover:text-bone">X / Twitter</a>
          </div>
        </Section>

        <Section label="Contact">
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-bone-dim">Booking: </span>
              <a href="mailto:kyzokiddmusic@gmail.com" className="hover:text-blood-bright transition-colors">
                kyzokiddmusic@gmail.com
              </a>
            </p>
            <p>
              <span className="text-bone-dim">Manager: </span>
              Jahad &quot;CapoBeatz&quot; Weston — 908-720-0154
            </p>
          </div>
        </Section>
      </div>

      <div className="h-16" />
      <SiteFooter />
    </>
  );
}
