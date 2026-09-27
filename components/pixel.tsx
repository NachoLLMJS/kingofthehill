"use client";

import { useState } from "react";

// Crown redrawn on a 13×9 grid from the logo: gold, ruby jewels, dark outline.
const CROWN = [
  "......K......",
  ".K...KGK...K.",
  "KGK.KGRGK.KGK",
  "KGGKGGGGGKGGK",
  "KGGGGGGGGGGGK",
  "KGRGGGRGGGRGK",
  "KGGGGGGGGGGGK",
  "KDDDDDDDDDDDK",
  "KKKKKKKKKKKKK",
];
const CROWN_FILL: Record<string, string> = { K: "var(--gold-ink)", G: "var(--gold)", R: "var(--ruby)", D: "var(--gold-dk)" };

export function PixelCrown({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 13 9" className={className} shapeRendering="crispEdges" aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
      {title ? <title>{title}</title> : null}
      {CROWN.flatMap((row, y) =>
        [...row].map((c, x) => (c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={CROWN_FILL[c]} />)),
      )}
    </svg>
  );
}

const CLOUD = [
  "....WWWW.......",
  "..WWWWWWWW.WW..",
  ".WWWWWWWWWWWWW.",
  "WWWWWWWWWWWWWWW",
  "SSSSSSSSSSSSSSS",
];

export function PixelCloud({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 15 5" className={className} style={style} shapeRendering="crispEdges" aria-hidden>
      {CLOUD.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={c === "W" ? "var(--cloud)" : "var(--cloud-shade)"} />,
        ),
      )}
    </svg>
  );
}

// Deterministic 5×5 pixel identicon for callers without an avatar.
const IDENT_COLORS = ["#94df50", "#fbd322", "#58b2fa", "#c23729", "#f8ce5e", "#3f9a2c", "#9a6a3c"];
function Identicon({ seed }: { seed: string }) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  const fg = IDENT_COLORS[h % IDENT_COLORS.length];
  const cells: [number, number][] = [];
  for (let y = 0; y < 5; y++)
    for (let x = 0; x < 3; x++) {
      if ((h >>> (y * 3 + x)) & 1) {
        cells.push([x, y]);
        if (x < 2) cells.push([4 - x, y]);
      }
    }
  return (
    <svg viewBox="0 0 5 5" className="h-full w-full" shapeRendering="crispEdges" aria-hidden>
      <rect width="5" height="5" fill="var(--ink)" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fg} />
      ))}
    </svg>
  );
}

// Avatars are shrunk to a few pixels and scaled back up with nearest-neighbour,
// so every caller's photo turns into a little sprite that matches the art.
export function PixelAvatar({ src, seed, size, grain = 4, alt = "" }: { src: string | null; seed: string; size: number; grain?: number; alt?: string }) {
  const [broken, setBroken] = useState(false);
  const inner = Math.round(size / grain);
  return (
    <span className="relative block shrink-0 overflow-hidden bg-ink" style={{ width: size, height: size }}>
      {src && !broken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          width={inner}
          height={inner}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setBroken(true)}
          className="pixelated absolute top-0 left-0 max-w-none origin-top-left"
          style={{ width: inner, height: inner, transform: `scale(${size / inner})` }}
        />
      ) : (
        <Identicon seed={seed} />
      )}
    </span>
  );
}
