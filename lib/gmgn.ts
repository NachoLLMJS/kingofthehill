import "server-only";
import { createHmac } from "node:crypto";
import type { Callout } from "./types";

// GMGN Callout OpenAPI — https://docs.gmgn.ai/index/gmgn-callout-openapi
// POST /token returns one token's cross-wallet callout feed, newest first.
// Auth: HMAC-SHA256 over ak + timestamp + method + path + rawQuery + body.
// The key must be issued by GMGN and the server IP must be allowlisted.
const HOST = "https://papi.gmgn.ai";
const TOKEN_PATH = "/callout/openapi/v1/token";
const PAGE_LIMIT = 50;
const BACKFILL_PAGES = 20; // first sync: up to 1,000 call outs
const POLL_PAGES = 4;

export type RawMessage = {
  ulid?: string;
  id?: string;
  username?: string;
  display_name?: string;
  profile_image_url?: string | null;
  wallet_address?: string;
  content?: string;
  display_content?: string;
  created_at?: string;
  follower_count?: number;
  is_kol?: boolean;
  multiplier?: string;
};

export function hasGmgnKeys() {
  return Boolean(process.env.GMGN_AK && process.env.GMGN_SK);
}

async function signedPost<T>(path: string, payload: unknown): Promise<T> {
  const ak = process.env.GMGN_AK!;
  const sk = process.env.GMGN_SK!;
  const body = JSON.stringify(payload);
  const ts = Date.now().toString();
  const signature = createHmac("sha256", sk).update(`${ak}${ts}POST${path}${body}`).digest("hex");

  const res = await fetch(HOST + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Ak": ak, "X-Timestamp": ts, "X-Signature": signature },
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  const json = (await res.json().catch(() => null)) as { code?: number; message?: string; data?: T } | null;
  if (!res.ok || !json || json.code !== 0 || !json.data) {
    throw new Error(`GMGN ${res.status}: ${json?.message ?? "bad response"}`);
  }
  return json.data;
}

// Pages newest → older and stops at the first call out we already know, so a
// normal poll costs one request. With nothing known yet it backfills.
export async function fetchNewCallouts(chain: string, token: string, known: Set<string>, since = 0): Promise<Callout[]> {
  const out: Callout[] = [];
  const maxPages = known.size ? POLL_PAGES : BACKFILL_PAGES;
  let cursor = "";
  for (let page = 0; page < maxPages; page++) {
    const data = await signedPost<{ messages?: RawMessage[]; has_more?: boolean; next_cursor?: string }>(TOKEN_PATH, {
      chain,
      call_token: token,
      cursor,
      limit: PAGE_LIMIT,
    });
    const batch = (data.messages ?? []).map(toCallout);
    const fresh = batch.filter((c) => !known.has(c.id));
    out.push(...fresh);
    if (fresh.length < batch.length) break; // reached what we already have
    if (batch.some((c) => c.at < since)) break; // older than the game start
    // Page on has_more, not on next_cursor (per GMGN docs).
    if (!data.has_more || !data.next_cursor) break;
    cursor = data.next_cursor;
  }
  return out;
}

export function toCallout(m: RawMessage): Callout {
  return {
    id: m.ulid || m.id || `${m.wallet_address}-${m.created_at}`,
    handle: m.username ?? "",
    name: m.display_name || m.username || "anon",
    avatar: m.profile_image_url || null,
    wallet: (m.wallet_address ?? "").toLowerCase(),
    text: (m.content || m.display_content || "").trim(),
    at: Date.parse(m.created_at ?? "") || 0,
    followers: m.follower_count ?? 0,
    kol: Boolean(m.is_kol),
    multiplier: Number(m.multiplier ?? 1) || 1,
  };
}
