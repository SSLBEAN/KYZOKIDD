import Image from "next/image";

const TILES = [
  { src: "/images/hero-alt.jpg", pos: "center 15%", span: "row-span-2" },
  { src: "/images/gallery-extra.jpg", pos: "center 20%", span: "" },
  { src: "/images/press.jpg", pos: "center 25%", span: "" },
  { src: "/images/shop-2.jpg", pos: "center 30%", span: "row-span-2" },
  { src: "/images/shop-1.jpg", pos: "center 15%", span: "" },
  { src: "/images/shows-bg.jpg", pos: "center 30%", span: "" },
];

export function PhotoGallery() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 auto-rows-[38vw] md:auto-rows-[22vw] gap-1 md:gap-1.5">
      {TILES.map((tile, i) => (
        <div key={i} className={`relative overflow-hidden bg-bone/5 ${tile.span}`}>
          <Image
            src={tile.src}
            alt="Kyzo Kidd"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-[filter] duration-500"
            style={{ objectPosition: tile.pos }}
          />
        </div>
      ))}
    </section>
  );
}
