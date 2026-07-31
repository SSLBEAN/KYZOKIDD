import Link from "next/link";
import { signOutAdmin } from "@/app/admin/actions";

export function AdminNav({ current }: { current?: string }) {
  const items = [
    ["Dashboard", "/admin"],
    ["Releases", "/admin/releases"],
    ["Videos", "/admin/videos"],
    ["Shows", "/admin/shows"],
    ["Products", "/admin/products"],
  ];

  return (
    <div className="flex justify-between items-center flex-wrap gap-4 mb-10 pb-6 border-b border-line">
      <nav className="flex gap-5 flex-wrap">
        {items.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className={`text-sm ${
              current === href
                ? "text-bone font-semibold"
                : "text-bone-dim hover:text-bone"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/" target="_blank" className="text-bone-dim hover:text-bone text-sm">
          View site ↗
        </Link>
        <form action={signOutAdmin}>
          <button
            type="submit"
            className="text-bone-dim hover:text-blood-bright text-sm"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
