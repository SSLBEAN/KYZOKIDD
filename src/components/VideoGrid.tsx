'use client'

import { useState } from "react";
import type { Video } from "@/lib/types";

export function VideoGrid({ videos }: { videos: Video[] }) {
  const initial = videos.find((v) => v.is_featured) ?? videos[0];
  const [activeId, setActiveId] = useState(initial?.id);
  const active = videos.find((v) => v.id === activeId) ?? initial;
  const others = videos.filter((v) => v.id !== active?.id);

  if (!active) return null;

  return (
    <div className="grid md:grid-cols-[1.3fr_1fr] gap-6">
      <div className="relative aspect-video overflow-hidden">
        <iframe
          key={active.id}
          src={`https://www.youtube.com/embed/${active.youtube_video_id}?autoplay=1`}
          title={active.title}
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <div className="flex flex-col gap-4">
        {others.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setActiveId(v.id)}
            className="relative aspect-video overflow-hidden block group text-left"
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
          </button>
        ))}
      </div>
    </div>
  );
}
