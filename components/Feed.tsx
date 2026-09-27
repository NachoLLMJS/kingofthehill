"use client";

import { useState } from "react";
import { ago, duration, shortAddr } from "@/lib/format";
import type { GameState } from "@/lib/types";
import { PixelAvatar, PixelCrown } from "./pixel";

const PAGE = 10;

export function Feed({ state, now }: { state: GameState; now: number }) {
  const [shown, setShown] = useState(PAGE);
  const items = state.recent.slice(0, shown);
  const { stats } = state;

  return (
    <section id="challengers" aria-labelledby="feed-title" className="dirt relative scroll-mt-20 pt-16 pb-24 text-parchment">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-12">
          <header className="on-dark-tile lg:col-span-4">
            <p className="font-display text-sm font-bold tracking-[0.2em] text-gold uppercase">Layer 1 · the challengers</p>
            <h2 id="feed-title" className="mt-3 font-display text-4xl leading-none font-bold sm:text-5xl">
              Every call out knocks the king off.
            </h2>
            <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-parchment/85">
              Live from GMGN, newest first. Each row shows how long that caller held the hill before someone else called out.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-4">
              <Stat label="Call outs" value={String(stats.callouts)} />
              <Stat label="Challengers" value={String(stats.challengers)} />
              <Stat label="Kings crowned" value={String(stats.rounds)} />
              <Stat label="Longest reign" value={duration(stats.longestReignMs).split(" ")[0]} />
            </dl>
            {stats.windowStart ? (
              <p className="mt-3 text-xs text-parchment/60">Since {new Date(stats.windowStart).toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })}</p>
            ) : null}
          </header>

          <div className="lg:col-span-8">
            {items.length === 0 ? (
              <div className="px-box bg-parchment p-8 text-center text-ink">
                <p className="font-display text-xl font-bold uppercase">No challengers yet</p>
                <p className="mt-2 text-[15px]">The first call out on GMGN will appear here.</p>
              </div>
            ) : (
              <ol className="flex flex-col gap-4" aria-label="Recent call outs">
                {items.map((c, i) => {
                  const isKing = i === 0 && c.reignMs === null;
                  return (
                    <li
                      key={c.id}
                      className={`px-box grid grid-cols-[48px_1fr] gap-x-4 gap-y-2 p-4 text-ink sm:grid-cols-[48px_1fr_auto] ${isKing ? "bg-gold" : "bg-parchment"}`}
                    >
                      <div className="relative">
                        {c.crowned || isKing ? <PixelCrown className="absolute -top-4 left-1/2 w-7 -translate-x-1/2 -rotate-[8deg]" /> : null}
                        <PixelAvatar src={c.avatar} seed={c.wallet} size={48} grain={4} />
                      </div>
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-baseline gap-x-2">
                          <span className="truncate font-display text-lg font-bold">{c.name}</span>
                          {c.handle ? <span className="truncate text-sm text-ink-soft">@{c.handle}</span> : null}
                          {c.kol ? <span className="bg-ruby px-1 font-display text-[10px] font-bold text-white uppercase">KOL</span> : null}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[15px] leading-snug [overflow-wrap:anywhere]">{c.text || "(no text)"}</p>
                        <p className="mt-1 text-xs text-ink-soft">
                          {shortAddr(c.wallet)} · {ago(now - c.at)}
                        </p>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 sm:col-span-1 sm:flex-col sm:items-end sm:justify-center">
                        <ReignTag reignMs={c.reignMs} crowned={c.crowned} isKing={isKing} now={now} at={c.at} />
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            {state.recent.length > shown ? (
              <div className="mt-8 flex justify-center">
                <button type="button" className="btn-px btn-px--grass btn-px--sm" onClick={() => setShown((n) => n + PAGE)}>
                  Show more challengers
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReignTag({ reignMs, crowned, isKing, now, at }: { reignMs: number | null; crowned: boolean; isKing: boolean; now: number; at: number }) {
  if (isKing && !crowned)
    return <span className="bg-ink px-2 py-1 font-display text-xs font-bold tracking-wider text-gold uppercase">On the hill · {duration(now - at)}</span>;
  if (crowned) return <span className="bg-ruby px-2 py-1 font-display text-xs font-bold tracking-wider text-white uppercase">Crowned</span>;
  return (
    <span className="border-2 border-ink/30 px-2 py-0.5 font-display text-xs font-bold tracking-wider text-ink-soft uppercase">
      Held {duration(reignMs ?? 0)}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-box bg-dirt-deep px-4 py-3">
      <dt className="font-display text-[11px] font-bold tracking-[0.18em] text-gold uppercase">{label}</dt>
      <dd className="timer-digits mt-1 text-5xl text-parchment">{value}</dd>
    </div>
  );
}
