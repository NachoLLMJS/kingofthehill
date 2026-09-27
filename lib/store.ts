import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { CHAIN, TOKEN_ADDRESS } from "./config";
import type { Callout } from "./types";

// Append-only archive of every call out we have ever seen, keyed by ULID.
// GMGN only returns recent pages, so this is what lets rounds, kings and
// stats keep accumulating over the life of the game.
//
// Backends:
// - Upstash Redis (REST) when UPSTASH_REDIS_REST_URL / _TOKEN are set (Vercel).
// - A JSON file in .data/ otherwise (local dev; not persistent on Vercel).
export type Store = {
  all(): Promise<Callout[]>;
  add(callouts: Callout[]): Promise<number>; // returns how many were new
  kind: "redis" | "file";
};

const KEY = `koth:callouts:${CHAIN}:${TOKEN_ADDRESS}`;

export function getStore(): Store {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? redisStore(url, token) : fileStore();
}

function redisStore(url: string, token: string): Store {
  const call = async (cmd: (string | number)[]) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(cmd),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Redis ${res.status}`);
    return ((await res.json()) as { result: unknown }).result;
  };
  return {
    kind: "redis",
    // Hash of ulid → JSON; HSETNX semantics via HSET is fine because a
    // call out never changes once posted.
    async all() {
      const flat = ((await call(["HGETALL", KEY])) as string[] | null) ?? [];
      const out: Callout[] = [];
      for (let i = 1; i < flat.length; i += 2) out.push(JSON.parse(flat[i]));
      return out;
    },
    async add(callouts) {
      if (!callouts.length) return 0;
      const args = callouts.flatMap((c) => [c.id, JSON.stringify(c)]);
      return Number(await call(["HSET", KEY, ...args]));
    },
  };
}

function fileStore(): Store {
  const file = path.join(process.cwd(), ".data", `callouts-${CHAIN}-${TOKEN_ADDRESS}.json`);
  let cache: Map<string, Callout> | null = null;
  const load = async () => {
    if (cache) return cache;
    try {
      const list = JSON.parse(await readFile(file, "utf8")) as Callout[];
      cache = new Map(list.map((c) => [c.id, c]));
    } catch {
      cache = new Map();
    }
    return cache;
  };
  return {
    kind: "file",
    async all() {
      return [...(await load()).values()];
    },
    async add(callouts) {
      const map = await load();
      let added = 0;
      for (const c of callouts) {
        if (map.has(c.id)) continue;
        map.set(c.id, c);
        added++;
      }
      if (added) {
        await mkdir(path.dirname(file), { recursive: true });
        const tmp = `${file}.tmp`;
        await writeFile(tmp, JSON.stringify([...map.values()]));
        await rename(tmp, file);
      }
      return added;
    },
  };
}
