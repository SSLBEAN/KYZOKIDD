'use client'

import { useState } from "react";

const PRESETS = [
  { name: "Blood Red", hex: "#b3241f" },
  { name: "Ice Blue", hex: "#2f6fb3" },
  { name: "Emerald", hex: "#1f8a5c" },
  { name: "Royal Purple", hex: "#6b3fb3" },
  { name: "Gold", hex: "#b38a1f" },
];

export function ThemePresets({ defaultHex }: { defaultHex: string }) {
  const [hex, setHex] = useState(defaultHex);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <input
          type="color"
          name="accent_hex"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="w-12 h-10 bg-transparent border border-line rounded cursor-pointer"
        />
        <span className="text-bone-dim text-sm">
          Used for buttons, links, and highlights
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.hex}
            type="button"
            onClick={() => setHex(p.hex)}
            className="flex items-center gap-2 border border-line rounded-full pl-1.5 pr-3 py-1 text-xs hover:border-bone-dim"
          >
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: p.hex }}
            />
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
