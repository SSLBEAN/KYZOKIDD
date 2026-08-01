'use client'

import { useEffect, useState } from "react";
import Link from "next/link";

const LINKS = [
  ["Music", "/#music"],
  ["Videos", "/#videos"],
  ["About", "/#about"],
  ["Shows", "/#shows"],
  ["Store", "/#shop"],
  ["Press", "/press"],
  ["Sign Up", "/#signup"],
];

const SOCIALS = [
  ["Instagram", "https://www.instagram.com/kyzokidd/"],
  ["TikTok", "https://www.tiktok.com/@kyzokiddofficial"],
  ["X", "https://x.com/kyzokidd"],
  ["YouTube", "https://youtube.com/@kyzokiddofficial"],
  ["Spotify", "https://open.spotify.com/artist/6BFK2whBZLZa9E1YjNSrJi"],
  ["SoundCloud", "https://on.soundcloud.com/n82H7RJlqD80BEIVBg"],
];

export function SiteNav({ logoUrl }: { logoUrl?: string | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-6">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="mix-blend-difference"
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo" className="h-8 w-auto" />
          ) : (
            <span className="font-display text-lg tracking-wide text-white">
              KYZO<span className="text-blood-bright">KIDD</span>
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="w-10 h-10 flex flex-col items-center justify-center gap-[5px] mix-blend-difference"
        >
          <span
            className={`block w-6 h-[1.5px] bg-white transition-transform duration-300 ${
              open ? "translate-y-[3.25px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-6 h-[1.5px] bg-white transition-transform duration-300 ${
              open ? "-translate-y-[3.25px] -rotate-45" : ""
            }`}
          />
        </button>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-bg transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="h-full flex flex-col justify-center px-6 md:px-16">
          {LINKS.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="font-display uppercase text-[13vw] md:text-6xl leading-[1.05] hover:text-blood-bright transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-6 mt-10 flex-wrap">
            {SOCIALS.map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-brand text-xs uppercase tracking-wider text-bone-dim hover:text-bone transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
