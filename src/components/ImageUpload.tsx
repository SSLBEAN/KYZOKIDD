'use client'

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ImageUpload({
  currentUrl,
  onUploaded,
  onRemoved,
  label,
}: {
  currentUrl: string | null;
  onUploaded: (url: string) => void;
  onRemoved: () => void;
  label?: string;
}) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);

    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("media").getPublicUrl(path);
    onUploaded(data.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      {label && (
        <label className="block text-xs text-bone-dim mb-1 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <div className="relative w-20 h-20 border border-line rounded overflow-hidden bg-bone/5 shrink-0">
          {currentUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentUrl} alt="" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="text-xs border border-line rounded px-3 py-1.5 hover:border-bone-dim disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Upload image"}
          </button>
          {currentUrl && (
            <button
              type="button"
              onClick={onRemoved}
              className="text-xs text-bone-dim hover:text-blood-bright text-left"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-blood-bright text-xs mt-1">{error}</p>}
    </div>
  );
}
