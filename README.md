# King of the Hill

Pixel-art game site for a Flap token on BSC. The **last GMGN call out** on the token holds the hill.
Every call out resets a 5-minute clock; when it reaches zero the last caller is crowned, confetti
fires, and after a 1-minute break a new round opens.

Next.js 16 (App Router) + Tailwind v4. See `AGENTS.md` for the architecture and design notes.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in what you need
npm run dev -- --port 3217
```

Without any keys the site replays a real snapshot of the test token (demo mode).

## Deploy on Vercel

1. Import this repo in Vercel (framework: Next.js, defaults are fine).
2. **Redis (free):** create a free database at https://console.upstash.com (no card), open it,
   and in *REST API* copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into Vercel's
   environment variables. (A Vercel Marketplace Upstash/Redis integration also works: prefixed
   `*_KV_REST_API_*` and `REDIS_URL` are detected.) Required so history, rounds and the Hall of
   Kings persist. Check `/api/config` → `"storage"` must be `redis-rest` or `redis-tcp`.
3. Add the environment variables below. The game starts automatically the first time the site runs with `NEXT_PUBLIC_TOKEN_ADDRESS` (stored per token in Redis); call outs before that moment are ignored. The ticker is always `$KING`.
   Then, then **Redeploy** (`NEXT_PUBLIC_*` are baked in at build time).

| Variable | Required | Example / notes |
|---|---|---|
| `NEXT_PUBLIC_TOKEN_ADDRESS` | yes | Contract of the token being played |
| `NEXT_PUBLIC_CHAIN` | no | `bsc` (default) |
| `NEXT_PUBLIC_ROUND_SECONDS` | no | `300` (5 min) |
| `NEXT_PUBLIC_BREAK_SECONDS` | no | `60` (1 min) |
| `NEXT_PUBLIC_TWITTER_URL` | no | `https://x.com/yourproject` — X button in navbar/footer (hidden if empty) |
| `INGEST_SECRET` | yes (bridge) | Password so only your userscript can post call outs to `/api/ingest`; same value in the userscript |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | yes | Injected by the Upstash integration |
| `GMGN_AK` / `GMGN_SK` | later | GMGN Callout OpenAPI keys; when set the server polls GMGN itself and the bridge is not needed (GMGN must allowlist the server IP) |

## Feeding call outs (bridge)

Until GMGN issues Callout OpenAPI keys, call outs come from `bridge/koth-bridge.user.js`
(Tampermonkey on a gmgn.ai tab). Set `SITE` to your Vercel URL and `SECRET` to `INGEST_SECRET`,
keep a gmgn.ai tab open. Details in `bridge/README.md`.
