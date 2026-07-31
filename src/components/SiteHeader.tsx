import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-10 py-5 backdrop-blur-md bg-gradient-to-b from-bg/90 to-transparent">
      <Link href="/" className="font-display text-lg tracking-wide">
        KYZO<span className="text-blood-bright">KIDD</span>
      </Link>
      <nav className="hidden md:flex gap-7">
        {[
          ["Music", "/#music"],
          ["Videos", "/#videos"],
          ["About", "/#about"],
          ["Shows", "/#shows"],
          ["Store", "/#shop"],
          ["Press", "/#press"],
        ].map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className="text-bone-dim hover:text-bone text-xs tracking-widest uppercase font-medium transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>
      <Link
        href="/#signup"
        className="border border-line rounded-sm px-4 py-2 text-xs tracking-wider uppercase hover:border-blood-bright hover:text-blood-bright transition-colors"
      >
        Sign Up
      </Link>
    </header>
  );
}
