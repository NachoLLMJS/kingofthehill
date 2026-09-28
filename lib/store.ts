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
  getMeta(name: string): Promise<string | null>;
  setMeta(name: string, value: string): Promise<void>;
  kind: "redis" | "file";
};

const KEY = `koth:callouts:${CHAIN}:${TOKEN_ADDRESS}`;

// Merge a re-sent call out into what we have: keep any translation we already
// stored if the new copy lacks it (older bridges don't send every language).
function merge(prev: Callout | undefined, next: Callout): Callout {
  if (!prev) return next;
  return { ...prev, ...next, textEn: next.textEn || prev.textEn, textZh: next.textZh || prev.textZh };
}
const same = (a: Callout, b: Callout) => a.textEn === b.textEn && a.textZh === b.textZh;

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
      const prev = ((await call(["HMGET", KEY, ...callouts.map((c) => c.id)])) as (string | null)[]).map((v) => (v ? (JSON.parse(v) as Callout) : undefined));
      const writes = callouts.map((c, i) => [prev[i], merge(prev[i], c)] as const).filter(([p, m]) => !p || !same(p, m));
      if (!writes.length) return 0;
      await call(["HSET", KEY, ...writes.flatMap(([, m]) => [m.id, JSON.stringify(m)])]);
      return writes.filter(([p]) => !p).length;
    },
    async getMeta(name) {
      return ((await call(["GET", `${KEY}:meta:${name}`])) as string | null) ?? null;
    },
    async setMeta(name, value) {
      await call(["SET", `${KEY}:meta:${name}`, value]);
    },
  };
}

function fileStore(): Store {
  const file = path.join(process.cwd(), ".data", `callouts-${CHAIN}-${TOKEN_ADDRESS}.json`);
  const metaFile = file.replace(/\.json$/, ".meta.json");
  const readMeta = async () => {
    try {
      return JSON.parse(await readFile(metaFile, "utf8")) as Record<string, string>;
    } catch {
      return {};
    }
  };
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
      let changed = false;
      for (const c of callouts) {
        const prev = map.get(c.id);
        const next = merge(prev, c);
        if (prev && same(prev, next)) continue;
        if (!prev) added++;
        map.set(c.id, next);
        changed = true;
      }
      if (changed) {
        await mkdir(path.dirname(file), { recursive: true });
        const tmp = `${file}.tmp`;
        await writeFile(tmp, JSON.stringify([...map.values()]));
        await rename(tmp, file);
      }
      return added;
    },
    async getMeta(name) {
      return (await readMeta())[name] ?? null;
    },
    async setMeta(name, value) {
      const meta = { ...(await readMeta()), [name]: value };
      await mkdir(path.dirname(metaFile), { recursive: true });
      await writeFile(metaFile, JSON.stringify(meta));
    },
  };
}
