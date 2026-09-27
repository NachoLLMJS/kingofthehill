<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository Guidelines — King of the Hill

A game site for a Flap token: the **last GMGN call out** on the token holds the hill. Round rules (confirmed by Nicol):
- Every call out resets a 5-minute countdown (`NEXT_PUBLIC_ROUND_SECONDS=300`). If it reaches zero, the last caller is crowned. The site shows pixel confetti and a "New king crowned!" banner.
- A 1-minute break follows (`NEXT_PUBLIC_BREAK_SECONDS=60`). Call outs during the break don't count. Then the hill opens, and the first call out starts the next round.
- GMGN itself requires about $8 of the token to post a call out, so the site doesn't enforce holding or anti-spam.
- Nicol distributes the fees by hand. Don't show holding requirements, payout mechanics, or fee amounts on the page.

## Structure
- `app/page.tsx` server-renders the first state. `app/api/state/route.ts` serves `GameState` JSON that the client polls every 8s.
- `lib/gmgn.ts` is the GMGN Callout OpenAPI client (`POST https://papi.gmgn.ai/callout/openapi/v1/token`, AK/SK HMAC-SHA256, server only). `lib/game.ts` holds the pure round state machine (`buildState` on the server, `phaseAt` on the client, which ticks live → crowned → open between polls). `lib/state.ts` handles the 6s cache and picks live data or the snapshot.
- Data sources, in priority order: (1) GMGN Callout OpenAPI with `GMGN_AK`/`GMGN_SK`, where the server polls; (2) the browser bridge with `INGEST_SECRET`, where `bridge/koth-bridge.user.js` (Tampermonkey on gmgn.ai) POSTs the feed to `app/api/ingest/route.ts`, which is validated in `lib/ingest.ts`; (3) otherwise the demo. Both live sources write to the append-only archive in `lib/store.ts`.
- With neither, the site replays `data/callouts-snapshot.json`, a real capture of the test token, shifted to "now". The replay loops every ~7 min: a new king, a coronation, the break, then the hill opens.
- `components/` holds the Hero (timer + king), Feed (challengers), Hall (crowned kings), HowTo, Nav, Footer, and `pixel.tsx` (crown, clouds, pixelated avatars, identicons).
- Assets are served from `public/assets/`. Originals live in `assets-src/` and are never referenced. 

## Commands
- `npm run dev -- --port 3217`, `npm run build`, `npm run lint`, `npx tsc --noEmit`.

## Design direction: "The Descent" (v4, 2026-09-27)
The whole page is one mountain, read top to bottom. **Continuity between layers is the top priority**: no hard cuts. Every boundary is bridged by art that overlaps both neighbours.
- **Summit** (hero, title screen): wordmark centred at the top, clock on the left, current king on the right, and the croc on the peak in the middle (`summit2-*`). Its base fills the full width, and its trail exits at the bottom centre.
- **Slopes** (challengers): `mountain-face-*` fades in over the summit's base (the section is pulled up 72px with a masked top), so both trails connect. Challenger camps line the trail, which ends at a painted mine entrance.
- **Stratum "ground"**: a cross-section of grass, soil and rock with a **mine shaft and ladder at the centre**, directly under the entrance.
- **Mine** (how to play): mine art header, three wooden signs on chains, and a "Mine rules" plank.
- **Stratum "rock"**: rock with crystals; the ladder continues down into the crypt's stone arches.
- **Crypt of kings** (hall): crypt art header; each king is a stone tomb.
- **Stratum "magma"**: stone stairs down through lava cracks.
- **Core** (footer): compact (brand, explore links, CA + links) on basalt above a thin lava lake with embers. No disclaimers, no altimeter, no floating torch/cart/ladder sprites (Nicol's call).
- Strata live in `components/Descent.tsx` (`<Stratum kind overlapTop overlapBottom>`, overlaps as fractions of the band's rendered height, min width 760px on mobile).
Avoid hard section cuts, dark "crypto dashboard" styling, rounded corners, soft shadows, and smooth easing (use `steps()`).
- Engine: `components/ScrollEngine.tsx` (a single rAF loop). It handles `data-parallax`, `data-reveal` (→ `.is-in`) and `data-zone` (→ `--hud` nav colour). Sprites are pixel-map SVGs in `components/sprites.tsx` and `pixel.tsx`.
- Visual QA: `node scripts/shoot.mjs .shots/<dir> 1440 900 "0,#challengers-400,#mine-700"` captures sharp viewport screenshots via headless Chrome (`.shots/` is git-ignored). GMGN avatars don't load in headless (they do in a real browser).
- Colours are sampled from the logo (`app/globals.css`): sky `#489ffa→#6dcbfb`, grass `#94df50`, gold `#fbd322`, ruby `#c23729`, parchment `#fff6dc`, ink `#0f1d3a`. Zone HUD colours are in `ZONES`.
- Fonts: Pixelify Sans (display), Jersey 10 (numbers), DotGothic16 with a CJK fallback (body).
- Art (Higgsfield GPT Image 2.5 Sunburst, logo as style reference): originals in `assets-src/*-v01.png`, WebP finals in `public/assets/`. Alpha on transparent layers is thresholded for crisp pixels, and transparent logos are cropped to their bounds.
- Reduced motion: parallax, the scrub cart, birds, bats and embers are disabled, and reveals show immediately.

## Launching the real token (env only, no code changes)
1. In Vercel, set `NEXT_PUBLIC_TOKEN_ADDRESS`, `NEXT_PUBLIC_TOKEN_TICKER`, and `NEXT_PUBLIC_GAME_START` (ISO date of the launch), then **redeploy**. `NEXT_PUBLIC_*` values are inlined at build time.
2. The call out archive is keyed by chain+token, so the new token starts clean and the test data stays separate.
3. The bridge reads chain and token from `/api/config` every minute, so it follows the new token without edits. The page is at `gmgn.ai/…`; it does not need to be the token page.

## Security and limits
- Never expose `GMGN_SK` to the client or commit `.env*`. `.env.example` lists the variables.
- GMGN rejects IPs that aren't allowlisted, and Vercel has no fixed egress IP. Production needs a static-IP proxy/VPS or a GMGN arrangement.
- Rounds are recomputed from the fetched call outs (up to 200). For a long history, or for manual payouts, persist the winners.
- No deploys or pushes during development. Nicol deploys on Vercel.
