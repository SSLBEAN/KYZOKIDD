import Link from "next/link";
import { signOutAdmin } from "@/app/admin/actions";

const GROUPS: [string, [string, string][]][] = [
  [
    "Content",
    [
      ["Releases", "/admin/releases"],
      ["Videos", "/admin/videos"],
      ["Shows", "/admin/shows"],
      ["Products", "/admin/products"],
      ["RNF Collective", "/admin/rnf"],
      ["Press Kit", "/admin/epk"],
    ],
  ],
  [
    "Site",
    [
      ["Site Photos", "/admin/media"],
      ["Settings", "/admin/settings"],
    ],
  ],
  ["Team", [["Team", "/admin/team"]]],
];

export function AdminNav({ current }: { current?: string }) {
  return (
    <div className="mb-10 pb-6 border-b border-line">
      <div className="flex justify-between items-center mb-5">
        <Link href="/admin" className="font-display text-sm tracking-wide">
          KYZO<span className="text-blood-bright">KIDD</span>{" "}
          <span className="text-bone-dim font-body font-normal">Admin</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="text-bone-dim hover:text-bone text-sm">
            View site ↗
          </Link>
          <form action={signOutAdmin}>
            <button type="submit" className="text-bone-dim hover:text-blood-bright text-sm">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <nav className="flex flex-wrap gap-x-8 gap-y-3">
        {GROUPS.map(([group, items]) => (
          <div key={group} className="flex items-center gap-3">
            <span className="font-mono-brand text-[10px] uppercase tracking-wider text-bone-dim/60">
              {group}
            </span>
            <div className="flex gap-3">
              {items.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm px-2.5 py-1 rounded-full transition-colors ${
                    current === href
                      ? "bg-bone/10 text-bone font-medium"
                      : "text-bone-dim hover:text-bone"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
