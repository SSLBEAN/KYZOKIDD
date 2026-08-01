'use client'

import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";

export function ImageUrlField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");

  return (
    <div>
      <label className="block text-xs text-bone-dim mb-1 uppercase tracking-wide">
        {label}
      </label>
      <input
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://… or upload below"
        className="w-full bg-transparent border border-line rounded px-3 py-2 text-sm outline-none focus:border-bone-dim mb-2"
      />
      <ImageUpload
        currentUrl={url || null}
        onUploaded={(newUrl) => setUrl(newUrl)}
        onRemoved={() => setUrl("")}
      />
    </div>
  );
}
