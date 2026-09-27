import "server-only";
import snapshot from "@/data/callouts-snapshot.json";
import { CHAIN, ROUND_SECONDS, SERVER_CACHE_MS, TOKEN_ADDRESS } from "./config";
import { buildState } from "./game";
import { fetchTokenCallouts, hasGmgnKeys, toCallout, type RawMessage } from "./gmgn";
import type { Callout, GameState } from "./types";

const token = { chain: CHAIN, address: TOKEN_ADDRESS };

// Survives dev hot reloads so the snapshot replay clock does not restart.
const g = globalThis as unknown as {
  __koth?: { bootAt: number; cache?: { at: number; state: GameState }; inflight?: Promise<GameState>; lastGood?: Callout[] };
};
g.__koth ??= { bootAt: Date.now() };
const mem = g.__koth;

export async function getGameState(): Promise<GameState> {
  const now = Date.now();
  if (mem.cache && now - mem.cache.at < SERVER_CACHE_MS) return rebaseNow(mem.cache.state, now);
  mem.inflight ??= load(now).finally(() => (mem.inflight = undefined));
  const state = await mem.inflight;
  mem.cache = { at: now, state };
  return state;
}

async function load(now: number): Promise<GameState> {
  if (!hasGmgnKeys()) return snapshotState(now);
  try {
    const callouts = await fetchTokenCallouts(CHAIN, TOKEN_ADDRESS);
    mem.lastGood = callouts;
    return buildState({ callouts, now, roundSeconds: ROUND_SECONDS, token, source: "live" });
  } catch (err) {
    const error = err instanceof Error ? err.message : "GMGN unavailable";
    console.error("[koth] GMGN fetch failed:", error);
    return buildState({ callouts: mem.lastGood ?? [], now, roundSeconds: ROUND_SECONDS, token, source: "live", stale: true, error });
  }
}

// Without API keys we replay the real snapshot of the test token, shifted so
// it feels live: the newest call out lands ~25s after the server boots,
// which exercises the "new king" reset on real data.
function snapshotState(now: number): GameState {
  const raw = (snapshot.messages as RawMessage[]).map(toCallout);
  const newest = Math.max(...raw.map((c) => c.at));
  const shift = mem.bootAt + 25_000 - newest;
  const callouts = raw.map((c) => ({ ...c, at: c.at + shift }));
  return buildState({ callouts, now, roundSeconds: ROUND_SECONDS, token, source: "snapshot" });
}

function rebaseNow(state: GameState, now: number): GameState {
  return { ...state, serverNow: now };
}
