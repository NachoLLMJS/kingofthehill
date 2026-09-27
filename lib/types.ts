export type Callout = {
  id: string;
  handle: string;
  name: string;
  avatar: string | null;
  wallet: string;
  text: string;
  at: number; // unix ms
  followers: number;
  kol: boolean;
  multiplier: number;
};

export type FeedItem = Callout & {
  // How long this call out held the hill (null while it is the current king).
  reignMs: number | null;
  crowned: boolean;
};

export type Winner = { callout: Callout; wonAt: number; reignMs: number | null };

export type GameStatus = "live" | "crowned" | "empty" | "error";

export type GameState = {
  source: "live" | "snapshot";
  stale: boolean;
  error?: string;
  serverNow: number;
  roundSeconds: number;
  token: { chain: string; address: string };
  status: GameStatus;
  king: Callout | null;
  roundEndsAt: number | null;
  recent: FeedItem[];
  winners: Winner[];
  stats: {
    callouts: number;
    challengers: number;
    rounds: number;
    longestReignMs: number;
    windowStart: number | null;
  };
};
