"use client";

import { useState } from "react";
import { ago, duration, shortAddr } from "@/lib/format";
import type { FeedItem, GameState } from "@/lib/types";
import { Edge, zoneAttrs } from "./Descent";
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
    <section id="challengers" aria-labelledby="feed-title" className="relative scroll-mt-16 bg-[#86592f]" {...zoneAttrs("challengers")}>
      {/* Over the edge of the summit plateau… */}
      <div className="absolute inset-x-0 -top-6 z-10" aria-hidden>
        <Edge fill="#94df50" seed={5} height={32} />
        <div className="h-3 bg-[#3f9a2c]" />
      </div>
      {/* …and down the mountainside. The art's own sky is cropped away. */}
      <div className="relative overflow-hidden sm:h-[600px] lg:h-[660px]">
        <div data-parallax="0.12" className="absolute inset-x-0 top-[-60px] h-[400px] will-change-transform sm:top-auto sm:-top-[42%] sm:-bottom-[6%] sm:h-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/slope-1920.webp"
            srcSet="/assets/slope-960.webp 960w, /assets/slope-1920.webp 1920w"
            sizes="100vw"
            alt="Pixel-art mountainside with grassy ledges, pine trees and a rope bridge"
            width={1920}
            height={1086}
            loading="lazy"
            className="pixelated h-full w-full object-cover object-[50%_40%]"
          />
        </div>
        <div className="absolute inset-x-0 top-[200px] h-40 bg-gradient-to-b from-transparent to-[#86592f] sm:top-auto sm:bottom-0" />

        <div className="relative mx-auto flex h-full max-w-[1240px] items-end px-4 pt-[250px] pb-10 sm:px-6 sm:pt-0">
          <header data-reveal className="px-box max-w-[560px] bg-parchment p-6 text-ink sm:p-8">
            <p className="font-display text-sm font-bold tracking-[0.2em] text-grass-dk uppercase">2,000m · the slopes</p>
            <h2 id="feed-title" className="mt-2 font-display text-4xl leading-none font-bold sm:text-5xl">
              Every call out knocks the king off.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              The trail down from the summit, newest first. Each camp shows how long that caller held the hill. Call outs during the 1-minute break don’t count.
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Call outs" value={String(stats.callouts)} />
              <Stat label="Challengers" value={String(stats.challengers)} />
              <Stat label="Kings" value={String(stats.rounds)} />
              <Stat label="Longest round" value={duration(stats.longestRoundMs).split(" ")[0]} />
            </dl>
          </header>
        </div>
      </div>

      {/* The switchback trail */}
      <div className="dirt relative overflow-hidden pt-6 pb-28">
        <Cliffs />
        <div className="relative mx-auto max-w-[1100px] px-4 sm:px-6">
          {items.length === 0 ? (
            <div className="px-box mx-auto max-w-[520px] bg-parchment p-8 text-center text-ink">
              <p className="font-display text-xl font-bold uppercase">No challengers yet</p>
              <p className="mt-2 text-[15px]">The first call out on GMGN will set up camp here.</p>
            </div>
          ) : (
            <ol className="relative" aria-label="Recent call outs, newest first">
              <span className="trail-rope absolute top-0 bottom-0 left-[22px] w-1.5 lg:left-1/2 lg:-translate-x-1/2" aria-hidden />
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
      <Edge fill="#2a1a0e" seed={3} height={48} className="relative -mt-12" />
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

// Cliff walls framing the trail, drifting at a different speed than the page.
function Cliffs() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
      <div className="absolute top-0 right-0 bottom-0 w-[240px] overflow-hidden">
        <div data-parallax="-0.15" className="absolute inset-x-0 -top-[20%] -bottom-[20%] bg-[url(/assets/cliff-900.webp)] bg-[length:100%_auto] bg-repeat-y [image-rendering:pixelated]" />
      </div>
      <div className="absolute top-0 bottom-0 left-0 w-[200px] -scale-x-100 overflow-hidden opacity-90">
        <div data-parallax="-0.08" className="absolute inset-x-0 -top-[20%] -bottom-[20%] bg-[url(/assets/cliff-900.webp)] bg-[length:100%_auto] bg-repeat-y [background-position:0_300px] [image-rendering:pixelated]" />
      </div>
    </div>
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
