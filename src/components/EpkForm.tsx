'use client'

import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { saveEpkContent } from "@/app/admin/actions";
import type { EpkContent } from "@/lib/types";

const inputClass =
  "w-full bg-transparent border border-line rounded px-3 py-2 text-sm outline-none focus:border-bone-dim";
const labelClass = "block text-xs text-bone-dim mb-1 uppercase tracking-wide";

export function EpkForm({ epk }: { epk: EpkContent | null }) {
  const [pdfUrl, setPdfUrl] = useState(epk?.pdf_url ?? "");

  return (
    <form action={saveEpkContent} className="border border-line rounded p-6 space-y-5 max-w-2xl">
      <div>
        <label className={labelClass}>Downloadable PDF (optional)</label>
        <input type="hidden" name="pdf_url" value={pdfUrl} />
        <FileUpload
          accept="application/pdf"
          currentUrl={pdfUrl || null}
          onUploaded={(url) => setPdfUrl(url)}
          onRemoved={() => setPdfUrl("")}
        />
      </div>

      <div>
        <label className={labelClass}>Short bio</label>
        <textarea name="short_bio" rows={3} defaultValue={epk?.short_bio ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Full bio</label>
        <textarea name="full_bio" rows={6} defaultValue={epk?.full_bio ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Press quote</label>
        <textarea name="quote" rows={2} defaultValue={epk?.quote ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Achievements (one per line)</label>
        <textarea name="achievements" rows={3} defaultValue={epk?.achievements ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Influences (comma separated)</label>
        <input name="influences" defaultValue={epk?.influences ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Brand / style description</label>
        <textarea name="style_text" rows={2} defaultValue={epk?.style_text ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Colors / themes description</label>
        <textarea name="colors_text" rows={2} defaultValue={epk?.colors_text ?? ""} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Manager name</label>
          <input name="manager_name" defaultValue={epk?.manager_name ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Manager phone</label>
          <input name="manager_phone" defaultValue={epk?.manager_phone ?? ""} className={inputClass} />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blood hover:bg-blood-bright transition-colors px-5 py-2.5 rounded text-sm font-semibold"
      >
        Save press kit
      </button>
    </form>
  );
}
