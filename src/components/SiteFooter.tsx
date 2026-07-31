import { EmailSignupForm } from "./EmailSignupForm";

export function SiteFooter() {
  return (
    <footer id="signup" className="px-6 md:px-10 pt-24 pb-12 border-t border-line">
      <div className="flex justify-between items-end flex-wrap gap-10 mb-16">
        <div>
          <h2 className="font-display text-3xl md:text-5xl uppercase max-w-xl">
            Stay in the loop
          </h2>
          <EmailSignupForm />
        </div>
        <div className="flex gap-9 flex-wrap">
          <div className="flex flex-col gap-2.5">
            <a
              href="https://www.instagram.com/kyzokidd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone-dim hover:text-bone text-sm"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@kyzokiddofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone-dim hover:text-bone text-sm"
            >
              TikTok
            </a>
            <a
              href="https://x.com/kyzokidd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone-dim hover:text-bone text-sm"
            >
              X
            </a>
            <a
              href="https://youtube.com/@kyzokiddofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone-dim hover:text-bone text-sm"
            >
              YouTube
            </a>
            <a
              href="https://open.spotify.com/artist/6BFK2whBZLZa9E1YjNSrJi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone-dim hover:text-bone text-sm"
            >
              Spotify
            </a>
            <a
              href="https://on.soundcloud.com/n82H7RJlqD80BEIVBg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone-dim hover:text-bone text-sm"
            >
              SoundCloud
            </a>
          </div>
          <div className="flex flex-col gap-2.5">
            <a href="mailto:kyzokiddmusic@gmail.com" className="text-bone-dim hover:text-bone text-sm">
              Contact
            </a>
            <a href="/#press" className="text-bone-dim hover:text-bone text-sm">
              Press Kit
            </a>
            <a href="/admin/login" className="text-bone-dim hover:text-bone text-sm">
              Admin Login
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-between text-bone-dim font-mono-brand text-xs pt-7 border-t border-line">
        <span>© {new Date().getFullYear()} KYZOKIDD</span>
        <span>NEW JERSEY</span>
      </div>
    </footer>
  );
}
