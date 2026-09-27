import type { Callout, FeedItem, GameState, GameStatus, Winner } from "./types";

type BuildArgs = {
  callouts: Callout[];
  now: number;
  roundSeconds: number;
  breakSeconds: number;
  token: GameState["token"];
  source: GameState["source"];
  stale?: boolean;
  error?: string;
};

// Round rules:
// - While the hill is open, the first call out starts a round and becomes king.
// - Every call out during a round takes the hill and resets the clock.
// - When the clock hits zero, the last caller is crowned. A break follows,
//   and call outs during the break don't count. Then the hill opens again.
export function buildState({ callouts, now, roundSeconds, breakSeconds, token, source, stale = false, error }: BuildArgs): GameState {
  const roundMs = roundSeconds * 1000;
  const breakMs = breakSeconds * 1000;
  const asc = dedupe(callouts)
    .filter((c) => c.at <= now)
    .sort((a, b) => a.at - b.at);

  type Phase = "open" | "live" | "crowned";
  // Read through phaseNow(): TS cannot see that advance() mutates it.
  let phase = "open" as Phase;
  const phaseNow = () => phase;
  let king: Callout | null = null;
  let endsAt = 0;
  let breakEndsAt = 0;
  let round = 0;
  let roundStart = 0;
  let roundCount = 0;
  const winners: Winner[] = [];
  const meta = new Map<string, { round: number | null; heldUntil: number | null; crowned: boolean }>();

  const advance = (t: number) => {
    if (phase === "live" && t >= endsAt) {
      winners.push({ callout: king!, round, startedAt: roundStart, wonAt: endsAt, callouts: roundCount });
      meta.set(king!.id, { round, heldUntil: endsAt, crowned: true });
      phase = "crowned";
      breakEndsAt = endsAt + breakMs;
    }
    if (phase === "crowned" && t >= breakEndsAt) phase = "open";
  };

  for (const c of asc) {
    advance(c.at);
    if (phaseNow() === "crowned") {
      meta.set(c.id, { round: null, heldUntil: null, crowned: false });
      continue;
    }
    if (phase === "open") {
      round += 1;
      roundStart = c.at;
      roundCount = 0;
      phase = "live";
    } else if (king) {
      meta.set(king.id, { round, heldUntil: c.at, crowned: false });
    }
    king = c;
    roundCount += 1;
    endsAt = c.at + roundMs;
    meta.set(c.id, { round, heldUntil: null, crowned: false });
  }
  advance(now);
  phase = phaseNow();

  const status: GameStatus = error && !asc.length ? "error" : !asc.length ? "empty" : phase;
  const lastWinner = winners.at(-1) ?? null;

  const recent: FeedItem[] = asc
    .slice(-40)
    .reverse()
    .map((c) => {
      const m = meta.get(c.id)!;
      return { ...c, round: m.round, crowned: m.crowned, reignMs: m.heldUntil === null ? null : m.heldUntil - c.at };
    });

  return {
    source,
    stale,
    error,
    serverNow: now,
    roundSeconds,
    breakSeconds,
    token,
    status,
    round,
    king: phase === "open" ? null : king,
    roundEndsAt: phase === "open" || !king ? null : endsAt,
    breakEndsAt: phase === "crowned" ? breakEndsAt : null,
    lastWinner,
    recent,
    winners: [...winners].reverse(),
    stats: {
      callouts: asc.length,
      challengers: new Set(asc.map((c) => c.wallet)).size,
      rounds: winners.length,
      longestRoundMs: Math.max(0, ...winners.map((w) => w.wonAt - w.startedAt)),
      windowStart: asc[0]?.at ?? null,
    },
  };
}

// The server state is a snapshot; the browser keeps ticking between polls.
// This derives the phase at the visitor's `now` so the crown, confetti and
// break countdown happen on time even before the next poll arrives.
export function phaseAt(s: GameState, now: number) {
  let status = s.status;
  let king = s.king;
  let winner = s.lastWinner;
  const roundEndsAt = s.roundEndsAt;
  let breakEndsAt = s.breakEndsAt;

  if (status === "live" && roundEndsAt && now >= roundEndsAt) {
    status = "crowned";
    breakEndsAt = roundEndsAt + s.breakSeconds * 1000;
    winner = { callout: king!, round: s.round, startedAt: roundEndsAt, wonAt: roundEndsAt, callouts: 0 };
  }
  if (status === "crowned" && breakEndsAt && now >= breakEndsAt) {
    status = "open";
    king = null;
  }
  return {
    status,
    king,
    winner,
    roundRemaining: status === "live" && roundEndsAt ? roundEndsAt - now : 0,
    breakRemaining: status === "crowned" && breakEndsAt ? Math.max(0, breakEndsAt - now) : 0,
  };
}

function dedupe(list: Callout[]) {
  const seen = new Set<string>();
  return list.filter((c) => (seen.has(c.id) ? false : (seen.add(c.id), true)));
}
