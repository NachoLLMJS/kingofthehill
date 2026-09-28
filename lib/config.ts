// Game + token configuration. Public values are safe for the browser;
// GMGN_AK / GMGN_SK are read only in lib/gmgn.ts (server).

export const CHAIN = process.env.NEXT_PUBLIC_CHAIN || "bsc";

// Test token by default. Replace with the real Flap token at launch.
export const TOKEN_ADDRESS = (
  process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "0xfedf19759ba9c45b1a8345a2bde916b38acc7777"
).toLowerCase();

export const TOKEN_TICKER = "$KING";

// Seconds a call out holds the hill before its caller is crowned.
// Confirmed by Nicol 2026-09-27: 5 minutes without a new call out crowns the king.
export const ROUND_SECONDS = Number(process.env.NEXT_PUBLIC_ROUND_SECONDS || 300);

// Break after a coronation before the hill opens again (confirmed: 1 minute).
export const BREAK_SECONDS = Number(process.env.NEXT_PUBLIC_BREAK_SECONDS || 60);

// Project X/Twitter profile (set in Vercel). Button hides when empty.
export const TWITTER_URL = process.env.NEXT_PUBLIC_TWITTER_URL || "";

export const GMGN_TOKEN_URL = `https://gmgn.ai/${CHAIN}/token/${TOKEN_ADDRESS}`;
export const FLAP_TOKEN_URL = `https://flap.sh/bnb/${TOKEN_ADDRESS}`;
export const BSCSCAN_ADDRESS_URL = (addr: string) => `https://bscscan.com/address/${addr}`;

// How often the browser asks /api/state for news, and how long the server
// reuses one GMGN response (keeps us well under the per-key rate limit).
export const POLL_MS = 8_000;
export const SERVER_CACHE_MS = 6_000;
