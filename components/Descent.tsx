import { SUMMIT_ALTITUDE } from "./ScrollEngine";

export const ZONES = [
  { id: "top", label: "Summit", hud: "#489ffa", hudEdge: "#0f1d3a" },
  { id: "challengers", label: "The slopes", hud: "#3f9a2c", hudEdge: "#1e441c" },
  { id: "hall", label: "The mine", hud: "#5b3a22", hudEdge: "#2a1a0e" },
  { id: "how", label: "Crystal caves", hud: "#2a2f5a", hudEdge: "#12142a" },
  { id: "core", label: "The core", hud: "#3a1410", hudEdge: "#120606" },
] as const;

export type ZoneId = (typeof ZONES)[number]["id"];

export function zoneAttrs(id: ZoneId) {
  const z = ZONES.find((z) => z.id === id)!;
  return { "data-zone": z.id, "data-hud": z.hud, "data-hud-edge": z.hudEdge, "data-label": z.label };
}

// Fixed altimeter on the left edge: altitude counts down and the croc slides
// down the rope as you descend. Values are written by ScrollEngine.
export function DepthMeter() {
  return (
    <nav aria-label="Descent" className="depth-meter pointer-events-none fixed top-24 bottom-8 left-2 z-30 hidden w-[72px] flex-col items-center min-[1400px]:flex">
      <div className="px-box pointer-events-auto bg-ink/85 px-2 py-1.5 text-center text-cloud">
        <p className="font-display text-[9px] font-bold tracking-[0.2em] text-gold uppercase">Altitude</p>
        <p id="alt-value" className="timer-digits text-xl leading-none">
          {SUMMIT_ALTITUDE.toLocaleString("en")}m
        </p>
        <p id="alt-zone" className="mt-0.5 font-display text-[9px] font-bold tracking-wider uppercase">
          Summit
        </p>
      </div>

      <div className="relative mt-3 w-full flex-1 [container-type:size]">
        {/* the rope */}
        <div className="absolute top-0 bottom-0 left-1/2 w-1 -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,#e8d7a8_0_8px,#9a6a3c_8px_12px)] shadow-[0_0_0_2px_rgb(15_29_58/.5)]" />
        {/* zone stops */}
        {ZONES.map((z, i) => (
          <a
            key={z.id}
            href={`#${z.id}`}
            data-zone-link={z.id}
            className="zone-stop pointer-events-auto absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
            style={{ top: `${(i / (ZONES.length - 1)) * 100}%` }}
            aria-label={`Jump to ${z.label}`}
          >
            <span className="block h-3 w-3 border-2 border-ink" style={{ background: z.hud }} />
            <span className="zone-stop-label absolute left-5 font-display text-[10px] font-bold tracking-wider whitespace-nowrap uppercase">{z.label}</span>
          </a>
        ))}
        {/* climber */}
        <div id="alt-marker" className="absolute top-0 left-1/2 will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/croc-head-256.webp" alt="" width={36} height={36} className="pixelated px-box -mt-[18px] -ml-[18px] h-9 w-9" />
        </div>
      </div>
    </nav>
  );
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
