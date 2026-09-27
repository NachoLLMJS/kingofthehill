# GMGN call out bridge (userscript)

Until GMGN issues Callout OpenAPI keys, call outs reach the site through this
userscript. It runs in a normal gmgn.ai tab, reads the token's call out feed
(same-origin, so no Cloudflare/CORS issue), and POSTs it to `/api/ingest`.

1. Set `INGEST_SECRET` on the site (`.env.local` locally, Vercel env in prod).
2. Install Tampermonkey in Chrome and create a new script from `koth-bridge.user.js`.
3. Edit the config block: `SITE`, `SECRET` (= `INGEST_SECRET`), `CHAIN`, `TOKEN`.
4. Open any gmgn.ai page and leave it open. A yellow badge (bottom right) shows
   `live · N seen · +M new`. It turns red while it retries.

Notes
- Only one gmgn.ai tab sends; other tabs show "standby".
- A worker clock keeps the 5s beat even when the tab is in the background.
- If the tab closes, the site shows "Reconnecting…" after 30s. Call outs made
  meanwhile are picked up on restart if they are still within GMGN's latest 50.
- Once `GMGN_AK`/`GMGN_SK` are set, the site polls GMGN itself and this can be retired.
