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
  ground: { w: 1920, h: 480, alt: "Cross-section of the ground: grass, roots and rock, with a mine shaft and ladder going down" },
  rock: { w: 1920, h: 584, alt: "Deep rock layers with crystals and gold veins; the shaft ladder leads down into the crypt's stone arches" },
  magma: { w: 1920, h: 490, alt: "Basalt with glowing lava cracks; stone stairs lead down to the core" },
} as const;

// A cross-section band of rock that bridges two layers of the descent. It
// overlaps both neighbours (negative margins) so there is never a hard cut,
// and its central shaft (ladder, then stairs) is the thread down the page.
// overlapTop / overlapBottom are fractions of the band's rendered height.
export function Stratum({ kind, overlapTop, overlapBottom }: { kind: keyof typeof STRATA; overlapTop: number; overlapBottom: number }) {
  const a = STRATA[kind];
  const h = `(max(100vw, 760px) * ${a.h / a.w})`;
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
        className="pixelated relative left-1/2 block w-[max(100vw,760px)] max-w-none -translate-x-1/2"
      />
    </div>
  );
}
