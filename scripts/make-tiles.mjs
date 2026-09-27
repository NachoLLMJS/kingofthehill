// Generates the seamless pixel tiles used for the mountain strata.
// 16×16 cells of 4px → 64px tiles. Run: node scripts/make-tiles.mjs
import { writeFileSync } from "node:fs";

function rng(seed) {
  return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}
function tile(name, base, palette, seed, density) {
  const r = rng(seed);
  let rects = "";
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const v = r();
      if (v < density) {
        const c = palette[Math.floor(r() * palette.length)];
        const w = r() < 0.35 ? 2 : 1;
        rects += `<rect x="${x}" y="${y}" width="${Math.min(w, 16 - x)}" height="1" fill="${c}"/>`;
      }
    }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="64" height="64" shape-rendering="crispEdges"><rect width="16" height="16" fill="${base}"/>${rects}</svg>`;
  writeFileSync(`public/assets/tile-${name}.svg`, svg);
}
tile("dirt", "#86592f", ["#7a5030", "#7a5030", "#93653a", "#6b4428"], 7, 0.2);
tile("stone", "#5f5e5c", ["#565553", "#4f4e4d", "#6a6967", "#484746"], 11, 0.22);
tile("bedrock", "#232228", ["#2e2d34", "#18171b", "#3a3942", "#101013"], 5, 0.45);
