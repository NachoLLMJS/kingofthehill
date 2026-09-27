"use client";

import { useEffect } from "react";

// One scroll loop drives the whole descent, writing only CSS variables and
// transforms (no React renders while scrolling):
//   [data-parallax="0.3"] → translateY by (distance from viewport centre × speed)
//   [data-scrub]          → --scrub 0..1 as the element crosses the viewport
//   [data-reveal]         → gets .is-in once it enters the viewport
//   [data-zone]           → the zone under the HUD sets --hud / --hud-ink on <html>
//   #alt-value / #alt-zone / #alt-marker → the depth meter
export const SUMMIT_ALTITUDE = 3000;

export function ScrollEngine() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let parallax: HTMLElement[] = [];
    let scrubs: HTMLElement[] = [];
    let zones: HTMLElement[] = [];
    let raf = 0;

    const collect = () => {
      parallax = [...document.querySelectorAll<HTMLElement>("[data-parallax]")];
      scrubs = [...document.querySelectorAll<HTMLElement>("[data-scrub]")];
      zones = [...document.querySelectorAll<HTMLElement>("[data-zone]")];
    };

    const altValue = () => document.getElementById("alt-value");
    const altZone = () => document.getElementById("alt-zone");
    const altMarker = () => document.getElementById("alt-marker");

    let lastZone = "";
    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      const max = Math.max(1, root.scrollHeight - vh);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      root.style.setProperty("--p", p.toFixed(4));

      if (!reduce.matches) {
        for (const el of parallax) {
          const speed = Number(el.dataset.parallax) || 0;
          const host = (el.parentElement ?? el).getBoundingClientRect();
          const offset = host.top + host.height / 2 - vh / 2;
          el.style.transform = `translate3d(0, ${(offset * -speed).toFixed(1)}px, 0)`;
        }
      }
      for (const el of scrubs) {
        const r = el.getBoundingClientRect();
        const t = reduce.matches ? 0.5 : Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        el.style.setProperty("--scrub", t.toFixed(4));
      }

      // Zone under the HUD bar (72px from top).
      let current: HTMLElement | undefined;
      for (const z of zones) if (z.getBoundingClientRect().top <= 72) current = z;
      // The last zone is shorter than the viewport: at the very bottom it wins.
      if (p > 0.995 || (zones.length && zones[zones.length - 1].getBoundingClientRect().top < vh * 0.5)) current = zones[zones.length - 1];
      current ??= zones[0];
      if (current && current.dataset.zone !== lastZone) {
        lastZone = current.dataset.zone ?? "";
        root.style.setProperty("--hud", current.dataset.hud ?? "#489ffa");
        root.style.setProperty("--hud-edge", current.dataset.hudEdge ?? "#0f1d3a");
        const z = altZone();
        if (z) z.textContent = current.dataset.label ?? "";
        document.querySelectorAll("[data-zone-link]").forEach((a) => a.toggleAttribute("aria-current", (a as HTMLElement).dataset.zoneLink === lastZone));
      }

      const v = altValue();
      if (v) v.textContent = `${Math.round(SUMMIT_ALTITUDE * (1 - p)).toLocaleString("en")}m`;
      const m = altMarker();
      if (m) m.style.transform = `translate3d(0, ${(p * 100).toFixed(2)}cqh, 0)`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    const observeReveals = () => document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));

    // Content (feed rows, kings) arrives after polls: re-scan when the DOM changes.
    const mo = new MutationObserver(() => {
      collect();
      observeReveals();
      schedule();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    collect();
    observeReveals();
    frame();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return null;
}
