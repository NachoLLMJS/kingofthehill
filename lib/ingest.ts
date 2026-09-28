import "server-only";
import { timingSafeEqual } from "node:crypto";
import { toCallout, type RawMessage } from "./gmgn";
import type { Callout } from "./types";

// Browser bridge → server. The bridge (a userscript on gmgn.ai) posts the raw
// `messages` from GMGN's token call out feed. Everything is re-validated here:
// the bridge secret gates writes, but we still never trust the shape.

export function bridgeEnabled() {
  return Boolean(process.env.INGEST_SECRET);
}

export function checkSecret(header: string | null) {
  const secret = process.env.INGEST_SECRET;
  if (!secret || !header?.startsWith("Bearer ")) return false;
  const a = Buffer.from(header.slice(7));
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

const ULID = /^[0-9A-HJKMNP-TV-Z]{26}$/;
const WALLET = /^0x[0-9a-fA-F]{40}$/;
const MAX_BATCH = 200;
const DAY = 86_400_000;

export function parseMessages(input: unknown, now = Date.now()): { callouts: Callout[]; rejected: number } {
  const list = Array.isArray(input) ? input.slice(0, MAX_BATCH) : [];
  const callouts: Callout[] = [];
  let rejected = 0;
  for (const raw of list as RawMessage[]) {
    const ulid = typeof raw?.ulid === "string" ? raw.ulid : "";
    const at = Date.parse(String(raw?.created_at ?? ""));
    if (!ULID.test(ulid) || !WALLET.test(String(raw?.wallet_address ?? "")) || !Number.isFinite(at) || at > now + 60_000 || at < now - 30 * DAY) {
      rejected++;
      continue;
    }
    const c = toCallout({
      ulid,
      username: clip(raw.username, 64),
      display_name: clip(raw.display_name, 80),
      profile_image_url: safeImage(raw.profile_image_url),
      wallet_address: raw.wallet_address,
      content: clip(raw.content, 1000),
      display_content: clip(raw.display_content, 1000),
      display_content_zh: clip(raw.display_content_zh, 1000),
      created_at: raw.created_at,
      follower_count: Number.isFinite(Number(raw.follower_count)) ? Math.max(0, Number(raw.follower_count)) : 0,
      is_kol: raw.is_kol === true,
      multiplier: String(Number(raw.multiplier) || 1),
    });
    callouts.push(c);
  }
  return { callouts, rejected };
}

function clip(v: unknown, max: number) {
  return typeof v === "string" ? v.slice(0, max) : undefined;
}

// Avatars are rendered from GMGN's own CDN only.
function safeImage(v: unknown) {
  if (typeof v !== "string") return null;
  try {
    const u = new URL(v);
    return u.protocol === "https:" && (u.hostname === "gmgn.ai" || u.hostname.endsWith(".gmgn.ai")) ? u.toString() : null;
  } catch {
    return null;
  }
}
