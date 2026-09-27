import type { Callout, FeedItem, GameState, Winner } from "./types";

type BuildArgs = {
  callouts: Callout[];
  now: number;
  roundSeconds: number;
  token: GameState["token"];
  source: GameState["source"];
  stale?: boolean;
  error?: string;
};

// Every call out resets the clock. A caller is crowned when nobody else
// calls out within roundSeconds of their call.
export function buildState({ callouts, now, roundSeconds, token, source, stale = false, error }: BuildArgs): GameState {
  const roundMs = roundSeconds * 1000;
  const asc = dedupe(callouts)
    .filter((c) => c.at <= now)
    .sort((a, b) => a.at - b.at);

  const winners: Winner[] = [];
  const reign = new Map<string, number | null>();
  let longestReignMs = 0;

  asc.forEach((c, i) => {
    const next = asc[i + 1];
    const heldUntil = next ? next.at : null;
    const held = (heldUntil ?? now) - c.at;
    reign.set(c.id, heldUntil === null ? null : held);
    longestReignMs = Math.max(longestReignMs, held);
    if (held >= roundMs) winners.push({ callout: c, wonAt: c.at + roundMs, reignMs: heldUntil === null ? null : held });
  });

  const king = asc.at(-1) ?? null;
  const roundEndsAt = king ? king.at + roundMs : null;
  const status: GameState["status"] = error && !king ? "error" : !king ? "empty" : now >= roundEndsAt! ? "crowned" : "live";

  const recent: FeedItem[] = asc
    .slice(-40)
    .reverse()
    .map((c) => {
      const r = reign.get(c.id) ?? null;
      return { ...c, reignMs: r, crowned: r === null ? now - c.at >= roundMs : r >= roundMs };
    });

  return {
    source,
    stale,
    error,
    serverNow: now,
    roundSeconds,
    token,
    status,
    king,
    roundEndsAt,
    recent,
    winners: winners.reverse(),
    stats: {
      callouts: asc.length,
      challengers: new Set(asc.map((c) => c.wallet)).size,
      rounds: winners.length,
      longestReignMs,
      windowStart: asc[0]?.at ?? null,
    },
  };
}

function dedupe(list: Callout[]) {
  const seen = new Set<string>();
  return list.filter((c) => (seen.has(c.id) ? false : (seen.add(c.id), true)));
}
