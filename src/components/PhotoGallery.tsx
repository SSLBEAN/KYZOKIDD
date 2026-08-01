import Image from "next/image";

const DEFAULT_TILES = [
  { slot: "gallery_1", src: "/images/hero-alt.jpg", pos: "center 15%", span: "row-span-2" },
  { slot: "gallery_2", src: "/images/gallery-extra.jpg", pos: "center 20%", span: "" },
  { slot: "gallery_3", src: "/images/press.jpg", pos: "center 25%", span: "" },
  { slot: "gallery_4", src: "/images/shop-2.jpg", pos: "center 30%", span: "row-span-2" },
  { slot: "gallery_5", src: "/images/shop-1.jpg", pos: "center 15%", span: "" },
  { slot: "gallery_6", src: "/images/shows-bg.jpg", pos: "center 30%", span: "" },
];

export function PhotoGallery({
  overrides = {},
}: {
  overrides?: Record<string, string | null>;
}) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 auto-rows-[38vw] md:auto-rows-[22vw] gap-1 md:gap-1.5">
      {DEFAULT_TILES.map((tile) => {
        const src = overrides[tile.slot] || tile.src;
        return (
          <div key={tile.slot} className={`relative overflow-hidden bg-bone/5 ${tile.span}`}>
            <Image
              src={src}
              alt="Kyzo Kidd"
              fill
              unoptimized
              className="object-cover grayscale hover:grayscale-0 transition-[filter] duration-500"
              style={{ objectPosition: tile.pos }}
            />
          </div>
        );
      })}
    </section>
  );
}
