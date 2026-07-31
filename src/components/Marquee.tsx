export function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="border-y border-line bg-blood overflow-hidden whitespace-nowrap py-3.5">
      <div className="inline-block animate-marquee">
        {loop.map((item, i) => (
          <span key={i}>
            <span className="font-display text-base tracking-wide uppercase mx-7">
              {item}
            </span>
            {i < loop.length - 1 && (
              <span className="font-mono-brand text-bone/55 mx-0">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
