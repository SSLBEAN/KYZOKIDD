'use client'

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function FileUpload({
  currentUrl,
  onUploaded,
  onRemoved,
  label,
  accept = "*/*",
}: {
  currentUrl: string | null;
  onUploaded: (url: string) => void;
  onRemoved: () => void;
  label?: string;
  accept?: string;
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
        {currentUrl && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gold hover:underline truncate max-w-[160px]"
          >
            View current file
          </a>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
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
          {uploading ? "Uploading…" : currentUrl ? "Replace file" : "Upload file"}
        </button>
        {currentUrl && (
          <button
            type="button"
            onClick={onRemoved}
            className="text-xs text-bone-dim hover:text-blood-bright"
          >
            Remove
          </button>
        )}
      </div>
      {error && <p className="text-blood-bright text-xs mt-1">{error}</p>}
    </div>
  );
}
