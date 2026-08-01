'use client'

import { useState, useTransition } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { saveSiteMediaSlot } from "@/app/admin/actions";

export function MediaSlotEditor({
  slot,
  label,
  initialUrl,
}: {
  slot: string;
  label: string;
  initialUrl: string | null;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [pending, startTransition] = useTransition();

  return (
    <div className="border border-line rounded p-4">
      <ImageUpload
        label={label}
        currentUrl={url}
        onUploaded={(newUrl) => {
          setUrl(newUrl);
          startTransition(() => saveSiteMediaSlot(slot, newUrl));
        }}
        onRemoved={() => {
          setUrl(null);
          startTransition(() => saveSiteMediaSlot(slot, null));
        }}
      />
      {pending && <p className="text-bone-dim text-xs mt-2">Saving…</p>}
      {!url && (
        <p className="text-bone-dim text-xs mt-2">
          Using the bundled default photo for this spot.
        </p>
      )}
    </div>
  );
}
