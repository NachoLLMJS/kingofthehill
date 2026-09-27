"use client";

import { useState } from "react";
import { ago, duration, shortAddr } from "@/lib/format";
import type { FeedItem, GameState } from "@/lib/types";
import { zoneAttrs } from "./Descent";
import { PixelAvatar, PixelCrown } from "./pixel";
import { Flag } from "./sprites";

const PAGE = 10;

// The slopes: challengers are camps along a switchback trail down the
// mountain. Newest call out sits closest to the summit.
export function Feed({ state, now }: { state: GameState; now: number }) {
  const [shown, setShown] = useState(PAGE);
  const items = state.recent.slice(0, shown);
  const { stats } = state;

  return (
    <section id="challengers" aria-labelledby="feed-title" className="relative z-[6] -mt-[72px] scroll-mt-16 overflow-hidden" {...zoneAttrs("challengers")}>
      {/* One painted mountainside: the trail winds down to the mine entrance at the bottom. */}
      <div
        className="absolute inset-0 bg-[#5f5e5d] bg-[image:image-set(url(/assets/mountain-face-800.webp)_1x,url(/assets/mountain-face-1360.webp)_2x)] bg-cover bg-[position:50%_100%] [image-rendering:pixelated] [mask-image:linear-gradient(to_bottom,transparent_0,black_72px)] lg:bg-[image:url(/assets/mountain-face-1360.webp)]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(15_29_58/.05),rgb(15_29_58/.25)_40%,rgb(15_29_58/.25)_75%,transparent_92%)]" aria-hidden />

      <div className="relative mx-auto max-w-[1100px] px-4 pt-32 sm:px-6">
        <header data-reveal className="px-box mx-auto max-w-[620px] bg-parchment p-6 text-center text-ink sm:p-8">
          <p className="font-display text-sm font-bold tracking-[0.2em] text-grass-dk uppercase">2,000m · the slopes</p>
          <h2 id="feed-title" className="mt-2 font-display text-4xl leading-none font-bold sm:text-5xl">
            The challengers are climbing.
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink-soft">
            Every call out on GMGN is a challenger heading for the summit, newest first. Each one knocks the king off and resets the clock.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
            <Stat label="Call outs" value={String(stats.callouts)} />
            <Stat label="Challengers" value={String(stats.challengers)} />
            <Stat label="Kings" value={String(stats.rounds)} />
            <Stat label="Longest round" value={duration(stats.longestRoundMs).split(" ")[0]} />
          </dl>
        </header>

        <div className="relative mt-16">
          {items.length === 0 ? (
            <div className="px-box mx-auto max-w-[520px] bg-parchment p-8 text-center text-ink">
              <p className="font-display text-xl font-bold uppercase">No challengers yet</p>
              <p className="mt-2 text-[15px]">The first call out on GMGN will set up camp on the trail.</p>
            </div>
          ) : (
            <ol className="relative" aria-label="Recent call outs, newest first">
              <span className="trail-rope absolute top-0 bottom-0 left-[22px] w-1.5 opacity-80 lg:left-1/2 lg:-translate-x-1/2" aria-hidden />
              {items.map((c, i) => (
                <Camp key={c.id} c={c} i={i} now={now} isKing={state.status === "live" && state.king?.id === c.id} />
              ))}
            </ol>
          )}

          {state.recent.length > shown ? (
            <div className="relative mt-12 flex justify-center">
              <button type="button" className="btn-px btn-px--grass btn-px--sm" onClick={() => setShown((n) => n + PAGE)}>
                Further down the trail
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* The trail ends at the mine: leave room so the painted entrance shows. */}
      <div className="relative flex h-[340px] items-start justify-center pt-6 sm:h-[400px] lg:h-[460px]">
        <a href="#mine" className="px-box bg-[#5b3a22] px-4 py-2 font-display text-sm font-bold tracking-[0.18em] text-gold uppercase hover:bg-[#7a5030]">
          Enter the mine <span aria-hidden>▼</span>
        </a>
      </div>
    </section>
  );
}

function Camp({ c, i, now, isKing }: { c: FeedItem; i: number; now: number; isKing: boolean }) {
  const right = i % 2 === 1;
  return (
    <li
      data-reveal={right ? "right" : "left"}
      style={{ ["--i" as string]: i % 3 }}
      className={`relative pl-14 lg:w-[calc(50%-48px)] lg:pl-0 ${i > 0 ? "mt-6 lg:-mt-6" : ""} ${right ? "lg:ml-auto" : ""}`}
    >
      {/* trail marker */}
      <span
        className={`absolute top-4 left-[6px] flex flex-col items-center lg:top-6 ${right ? "lg:-left-[64px]" : "lg:right-[-64px] lg:left-auto"}`}
        aria-hidden
      >
        {isKing || c.crowned ? <PixelCrown className="w-9 -rotate-[8deg]" /> : <Flag color={c.round === null ? "#8a8886" : "#c23729"} className="h-9 w-7" />}
      </span>

      <article className={`px-box grid grid-cols-[48px_1fr] gap-x-4 gap-y-2 p-4 text-ink ${isKing ? "bg-gold" : c.round === null ? "bg-[#e9e2cf]" : "bg-parchment"}`}>
        <div className="relative">
          <PixelAvatar src={c.avatar} seed={c.wallet} size={48} grain={4} />
        </div>
        <div className="min-w-0">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="line-clamp-1 font-display text-lg font-bold [overflow-wrap:anywhere]">{c.name}</span>
            {c.kol ? <span className="bg-ruby px-1 font-display text-[10px] font-bold text-white uppercase">KOL</span> : null}
          </p>
          {c.handle ? <p className="truncate text-xs text-ink-soft">@{c.handle}</p> : null}
          <p className="mt-1.5 line-clamp-2 text-[15px] leading-snug [overflow-wrap:anywhere]">{c.text || "(no text)"}</p>
          <p className="mt-1.5 text-xs text-ink-soft">
            {shortAddr(c.wallet)} · {ago(now - c.at)}
          </p>
        </div>
        <div className="col-span-2">
          <ReignTag c={c} isKing={isKing} now={now} />
        </div>
      </article>
    </li>
  );
}

function ReignTag({ c, isKing, now }: { c: FeedItem; isKing: boolean; now: number }) {
  if (c.round === null)
    return <span className="inline-block border-2 border-dashed border-ink/30 px-2 py-0.5 font-display text-xs font-bold tracking-wider text-ink-soft/80 uppercase">During break · didn’t count</span>;
  if (isKing) return <span className="inline-block bg-ink px-2 py-1 font-display text-xs font-bold tracking-wider text-gold uppercase">On the hill · {duration(now - c.at)}</span>;
  if (c.crowned) return <span className="inline-block bg-ruby px-2 py-1 font-display text-xs font-bold tracking-wider text-white uppercase">Crowned · round {c.round}</span>;
  return (
    <span className="inline-block border-2 border-ink/30 px-2 py-0.5 font-display text-xs font-bold tracking-wider text-ink-soft uppercase">
      Held {duration(c.reignMs ?? 0)} · round {c.round}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink px-3 py-2 text-cloud">
      <dt className="font-display text-[10px] font-bold tracking-[0.16em] text-gold uppercase">{label}</dt>
      <dd className="timer-digits mt-0.5 text-4xl">{value}</dd>
    </div>
  );
}
