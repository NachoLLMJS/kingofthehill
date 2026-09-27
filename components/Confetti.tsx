"use client";

import { useEffect, useRef, useState } from "react";
import { PixelCrown } from "./pixel";

const COLORS = ["#fbd322", "#e0a412", "#c23729", "#94df50", "#c5f14e", "#58b2fa", "#f4f9ff", "#f8ce5e"];
const DURATION = 4200;

// Square pixel confetti on a full-screen canvas. `burst` changes → new burst.
export function Confetti({ burst, name }: { burst: number; name?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [banner, setBanner] = useState(0);

  useEffect(() => {
    if (!burst) return;
    const show = setTimeout(() => setBanner(burst), 0);
    const hide = setTimeout(() => setBanner(0), DURATION - 400);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [burst]);

  useEffect(() => {
    if (!burst) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const count = Math.min(220, Math.round(w / 6));
    const bits = Array.from({ length: count }, (_, i) => {
      const fromLeft = i % 2 === 0;
      return {
        x: fromLeft ? -10 : w + 10,
        y: h * (0.35 + Math.random() * 0.35),
        vx: (fromLeft ? 1 : -1) * (4 + Math.random() * 9),
        vy: -(9 + Math.random() * 11),
        size: 4 * (1 + Math.floor(Math.random() * 3)),
        color: COLORS[i % COLORS.length],
        flip: Math.random() * Math.PI,
        delay: Math.random() * 350,
      };
    });

    const start = performance.now();
    let raf = 0;
    const frame = (t: number) => {
      const el = t - start;
      ctx.clearRect(0, 0, w, h);
      for (const b of bits) {
        if (el < b.delay) continue;
        b.vy += 0.35;
        b.vx *= 0.985;
        b.x += b.vx;
        b.y += b.vy;
        b.flip += 0.2;
        // Snap to a 4px grid so the bits stay crisp and pixel-like.
        const sx = Math.round(b.x / 4) * 4;
        const sy = Math.round(b.y / 4) * 4;
        const squash = Math.max(4, Math.round((Math.abs(Math.cos(b.flip)) * b.size) / 4) * 4);
        ctx.globalAlpha = el > DURATION - 800 ? Math.max(0, (DURATION - el) / 800) : 1;
        ctx.fillStyle = b.color;
        ctx.fillRect(sx, sy, b.size, squash);
      }
      if (el < DURATION) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [burst]);

  return (
    <>
      <canvas ref={ref} className="pointer-events-none fixed inset-0 z-50 h-full w-full" aria-hidden />
      {banner ? (
        <div key={banner} className="pointer-events-none fixed inset-x-0 top-[22%] z-50 flex justify-center px-4" aria-hidden>
          <div className="stamp px-box bg-gold px-6 py-4 text-center sm:px-10">
            <PixelCrown className="mx-auto -mt-12 w-20 -rotate-[6deg]" />
            <p className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-5xl">New king crowned!</p>
            {name ? <p className="mt-2 font-display text-lg font-bold [overflow-wrap:anywhere] sm:text-xl">{name}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
