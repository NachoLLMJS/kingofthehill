"use client";

import { useLayoutEffect, useRef, useState } from "react";

// One continuous painting (croc on the peak → switchback trail → mine entrance)
// sits behind the hero AND the challengers section, so there is no seam.
// It is sized so that:
//   - the croc's feet land on [data-croc-anchor] inside the hero, and
//   - the painted mine entrance lands on the bottom of this wrapper.
// The wrapper is also given a min-height so the painting is always at least as
// wide as the viewport (its lower part must fill the full width).
const RATIO = 1520 / 2688; // width / height of the art
const FEET = 0.0688; // croc feet, as a fraction of the art height
// The art is drawn at least this much wider than the viewport, so the croc and
// the trail read at a good size (and the lower mountain always fills the width).
const MIN_SCALE = 1.0;
// Bottom share of the art taken by the painted mine entrance: keep content above it.
const ENTRANCE = 0.16;
// Row where the mountain art becomes opaque edge to edge; above it the sides
// are transparent and the backdrop (distant range + forested hills) shows.
const FULL_ROW = 0.372;
const BD_RATIO = 2688 / 1520; // backdrop width / height

type Box = { top: number; height: number; minH: number; bdTop: number; bdH: number };

export function Mountain({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Box | null>(null);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => {
      const anchor = el.querySelector<HTMLElement>("[data-croc-anchor]");
      if (!anchor) return;
      const w = el.getBoundingClientRect();
      const anchorY = anchor.getBoundingClientRect().top - w.top;
      // Content must end above the entrance: solve H = C + ENTRANCE * artH,
      // with artH = (H - anchorY) / (1 - FEET).
      const end = el.querySelector<HTMLElement>("[data-content-end]");
      const C = end ? end.getBoundingClientRect().bottom - w.top : 0;
      const k = ENTRANCE / (1 - FEET);
      const fit = (C - k * anchorY) / (1 - k);
      const minH = Math.max(anchorY + ((1 - FEET) * w.width * MIN_SCALE) / RATIO, fit);
      const H = minH;
      const height = (H - anchorY) / (1 - FEET);
      const top = H - height;
      // Backdrop: its snowy range peeks out beside the peak, and its opaque
      // forest must reach below the row where the mountain fills the width.
      const fullRow = top + FULL_ROW * height;
      // Backdrop drawn 1.5× the viewport wide, bottom-aligned just below that
      // row, so its snowy range sits behind the hero and its forest fills the
      // sides down to where the mountain covers the full width.
      const bdH = (1.5 * w.width) / BD_RATIO;
      const bdTop = fullRow + 40 - bdH;
      const next = { top: Math.round(top), height: Math.round(height), minH: Math.ceil(minH), bdTop: Math.round(bdTop), bdH: Math.round(bdH) };
      setBox((b) => (b && b.top === next.top && b.height === next.height && b.minH === next.minH && b.bdTop === next.bdTop && b.bdH === next.bdH ? b : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // The wrapper's height is set from its content, so watch the content too.
    el.querySelectorAll("[data-mountain-content]").forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      className="relative flex flex-col overflow-hidden bg-[#6a9a3a] [background-image:linear-gradient(180deg,var(--sky-top)_0,var(--sky-mid)_520px,var(--sky-low)_1100px,var(--sky-low)_1400px,#6a9a3a_1400px)]"
      style={box ? { height: box.minH } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/backdrop-2688.webp"
        srcSet="/assets/backdrop-1600.webp 1600w, /assets/backdrop-2688.webp 2688w"
        sizes={box ? `${Math.round(box.bdH * BD_RATIO)}px` : "100vw"}
        alt=""
        width={2688}
        height={1520}
        className="pointer-events-none absolute left-1/2 z-0 max-w-none -translate-x-1/2 select-none"
        style={box ? { top: box.bdTop, height: box.bdH, width: Math.round(box.bdH * BD_RATIO) } : { visibility: "hidden" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/mountain-full-1520.webp"
        srcSet="/assets/mountain-full-1520.webp 1520w, /assets/mountain-full-2280.webp 2280w, /assets/mountain-full-3040.webp 3040w"
        sizes={box ? `${Math.round(box.height * RATIO)}px` : "100vw"}
        alt="The crowned GMGN crocodile on the peak of a grassy pixel-art mountain; a trail winds all the way down to a mine entrance"
        width={1520}
        height={2688}
        fetchPriority="high"
        className="pointer-events-none absolute left-1/2 z-[1] max-w-none -translate-x-1/2 select-none"
        style={box ? { top: box.top, height: box.height, width: Math.round(box.height * RATIO) } : { visibility: "hidden" }}
      />
      {children}
    </div>
  );
}
