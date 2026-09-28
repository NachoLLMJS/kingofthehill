export const ZONES = [
  { id: "top", label: "Summit", hud: "#489ffa", hudEdge: "#0f1d3a" },
  { id: "challengers", label: "The slopes", hud: "#3f9a2c", hudEdge: "#1e441c" },
  { id: "mine", label: "The mine", hud: "#5b3a22", hudEdge: "#2a1a0e" },
  { id: "hall", label: "Crypt of kings", hud: "#3a2548", hudEdge: "#161a2e" },
  { id: "core", label: "The core", hud: "#3a1410", hudEdge: "#120606" },
] as const;

export type ZoneId = (typeof ZONES)[number]["id"];

export function zoneAttrs(id: ZoneId) {
  const z = ZONES.find((z) => z.id === id)!;
  return { "data-zone": z.id, "data-hud": z.hud, "data-hud-edge": z.hudEdge, "data-label": z.label };
}

// Stepped, pixel-cut seam between two strata. `fill` is the colour of the
// layer below; it bites upward into the layer above.
export function Edge({ fill, seed = 1, height = 40, flip = false, className = "" }: { fill: string; seed?: number; height?: number; flip?: boolean; className?: string }) {
  const W = 1440;
  const step = 24;
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let d = `M0 ${height} `;
  for (let x = 0; x <= W; x += step) {
    const y = Math.round((rnd() * 0.75 + 0.1) * (height / 8)) * 8;
    d += `L${x} ${y} L${x + step} ${y} `;
  }
  d += `L${W} ${height} Z`;
  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio="none"
      className={`pointer-events-none block h-[var(--edge-h)] w-full ${flip ? "-scale-y-100" : ""} ${className}`}
      style={{ ["--edge-h" as string]: `${height}px` }}
      shapeRendering="crispEdges"
      aria-hidden
    >
      <path d={d} fill={fill} />
    </svg>
  );
}

const STRATA = {
  ground: { w: 1920, h: 490, alt: "Cross-section of the ground: grass, roots, soil and rock" },
  rock: { w: 1920, h: 588, alt: "Deep rock with crystals and gold veins above the crypt's stone arches" },
  magma: { w: 1920, h: 500, alt: "Basalt with glowing lava cracks at the bottom of the mountain" },
} as const;

// A cross-section band of rock that bridges two layers of the descent. It
// overlaps both neighbours (negative margins, as fractions of its rendered
// height) so there is never a hard cut. `height` shows a shorter band cropped
// from the top (its jagged bottom edge is kept), faded into the layer above.
export function Stratum({
  kind,
  overlapTop,
  overlapBottom,
  height,
  fadeFrom,
}: {
  kind: keyof typeof STRATA;
  overlapTop: number;
  overlapBottom: number;
  height?: string;
  fadeFrom?: string;
}) {
  const a = STRATA[kind];
  const h = height ?? `(max(100vw, 760px) * ${a.h / a.w})`;
  return (
    <div className="pointer-events-none relative z-20 overflow-x-clip" style={{ marginTop: `calc(-1 * ${h} * ${overlapTop})`, marginBottom: `calc(-1 * ${h} * ${overlapBottom})` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/assets/divider-${kind}-1920.webp`}
        srcSet={`/assets/divider-${kind}-960.webp 960w, /assets/divider-${kind}-1920.webp 1920w`}
        sizes="max(100vw, 760px)"
        alt={a.alt}
        width={a.w}
        height={a.h}
        loading="lazy"
        className="pixelated relative left-1/2 block w-[max(100vw,760px)] max-w-none -translate-x-1/2 object-cover object-bottom"
        style={height ? { height: `calc(${height})` } : undefined}
      />
      {fadeFrom ? <div className="absolute inset-x-0 top-0 h-1/3" style={{ background: `linear-gradient(${fadeFrom}, transparent)` }} /> : null}
    </div>
  );
}

