"use client";

import { useEffect, useRef, useState } from "react";
import { BSCSCAN_ADDRESS_URL, FLAP_TOKEN_URL, GMGN_TOKEN_URL } from "@/lib/config";
import { ago, clock, compact, shortAddr } from "@/lib/format";
import type { GameState } from "@/lib/types";
import type { Connection } from "./useGame";
import { CopyButton } from "./CopyButton";
import { PixelAvatar, PixelCloud, PixelCrown } from "./pixel";

const SEGMENTS = 20;

export function Hero({ state, now, connection }: { state: GameState; now: number; connection: Connection }) {
  const { king, roundEndsAt, roundSeconds, status } = state;
  const remaining = roundEndsAt ? Math.max(0, roundEndsAt - now) : 0;
  const crowned = status === "crowned" || (status === "live" && remaining === 0);
  const filled = Math.ceil((remaining / (roundSeconds * 1000)) * SEGMENTS);
  const tone = crowned ? "" : remaining <= 10_000 ? "timer--danger" : remaining <= 60_000 ? "timer--warn" : "";

  // A new call out = new king. Replay the drop-in and flash the clock.
  const prevKing = useRef(king?.id);
  const [entrance, setEntrance] = useState(0);
  useEffect(() => {
    if (king?.id && prevKing.current && king.id !== prevKing.current) setEntrance((n) => n + 1);
    prevKing.current = king?.id;
  }, [king?.id]);

  return (
    <section id="top" aria-labelledby="hero-title" className="sky relative overflow-hidden">
      <Clouds />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 gap-y-8 px-4 pt-6 pb-0 sm:px-6 lg:grid-cols-12 lg:gap-x-8 lg:pt-8">
        {/* ── Left: HUD ── */}
        <div className="relative z-10 lg:col-span-7 lg:pb-12">
          <div className="flex flex-wrap items-center gap-2">
            <SourceBadge state={state} connection={connection} />
            <span className="px-outline-sm font-display text-sm font-bold uppercase tracking-[0.12em]">
              Every call out resets the clock
            </span>
          </div>

          <h1 id="hero-title" className="px-outline mt-4 max-w-[17ch] font-display text-[34px] leading-[0.98] font-bold sm:text-[46px] lg:text-[52px]">
            Last call out takes the crown.
          </h1>

          {/* Timer */}
          <div
            key={`t-${entrance}`}
            className={`mt-6 ${tone} ${entrance ? "timer--reset" : ""}`}
            role="timer"
            aria-live="off"
            aria-label={crowned ? "Round over" : `${clock(remaining)} left for the current king`}
          >
            <p className="px-outline-sm font-display text-base font-bold uppercase tracking-[0.18em]">
              {crowned ? "Time’s up — king crowned" : "Time left on the hill"}
            </p>
            <p className="timer-digits px-outline mt-2 text-[144px] sm:text-[176px] lg:text-[216px]">{king ? clock(remaining) : "--:--"}</p>
            <div className="mt-4 flex max-w-[560px] gap-1" aria-hidden>
              {Array.from({ length: SEGMENTS }, (_, i) => (
                <span
                  key={i}
                  className="h-4 flex-1"
                  style={{
                    background: i < filled ? (remaining <= 60_000 ? "var(--gold)" : "var(--grass)") : "rgb(15 29 58 / 0.25)",
                    boxShadow: i < filled ? "inset 0 -4px 0 rgb(0 0 0 / .2), 0 0 0 2px var(--ink)" : "0 0 0 2px rgb(15 29 58 / .35)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* King card */}
          <div className="mt-9">
            <KingCard state={state} now={now} crowned={crowned} entrance={entrance} />
          </div>

          <div className="mt-8 flex flex-wrap gap-5">
            <a className="btn-px" href={GMGN_TOKEN_URL} target="_blank" rel="noopener noreferrer">
              Call out on GMGN <span aria-hidden>↗</span>
            </a>
            <a className="btn-px btn-px--ghost" href={FLAP_TOKEN_URL} target="_blank" rel="noopener noreferrer">
              Buy on Flap <span aria-hidden>↗</span>
            </a>
          </div>
        </div>

        {/* ── Right: the hill ── */}
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-[560px] lg:absolute lg:right-[-80px] lg:bottom-0 lg:w-[640px] lg:max-w-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/hero-king-croc-960.webp"
              srcSet="/assets/hero-king-croc-640.webp 640w, /assets/hero-king-croc-960.webp 960w, /assets/hero-king-croc-1254.webp 1254w"
              sizes="(min-width: 1024px) 640px, 100vw"
              alt="The GMGN crocodile wearing a gold crown, standing on top of a grassy pixel-art hill"
              width={1254}
              height={1254}
              fetchPriority="high"
              className="pixelated h-full w-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_22%),linear-gradient(to_right,transparent_0%,black_14%,black_88%,transparent_100%)] [mask-composite:intersect]"
            />
          </div>
        </div>
      </div>

      {/* Ground: the hill continues into the dirt below */}
      <div className="grass-tufts relative z-10" aria-hidden />
      <div className="grass-lip relative z-10" aria-hidden />
    </section>
  );
}

function KingCard({ state, now, crowned, entrance }: { state: GameState; now: number; crowned: boolean; entrance: number }) {
  const { king } = state;

  if (!king) {
    return (
      <div className="px-box max-w-[620px] bg-parchment p-6">
        <p className="font-display text-xl font-bold uppercase">The hill is empty</p>
        <p className="mt-2 text-[15px]">
          {state.status === "error"
            ? "We can’t reach GMGN right now. The throne will show up as soon as the feed is back."
            : "No call outs yet. Be the first to call it out on GMGN and take the hill."}
        </p>
      </div>
    );
  }

  return (
    <article
      key={`k-${king.id}-${entrance}`}
      aria-label="Current king"
      className={`px-box relative max-w-[620px] p-5 sm:p-6 ${crowned ? "bg-gold" : "bg-parchment"} ${entrance ? "king-enter" : ""}`}
    >
      <div className="absolute -top-5 left-5 bg-ink px-3 py-1 font-display text-xs font-bold tracking-[0.2em] text-gold uppercase">
        {crowned ? "Crowned king" : "Current king"}
      </div>

      <div className="flex items-start gap-4">
        <div className="relative mt-3">
          <PixelCrown className={`absolute top-[-26px] left-1/2 w-12 -translate-x-1/2 -rotate-[8deg] ${entrance ? "crown-enter" : ""}`} />
          <div className="px-box">
            <PixelAvatar src={king.avatar} seed={king.wallet} size={72} grain={4} alt="" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h2 className="line-clamp-2 font-display text-2xl leading-tight font-bold [overflow-wrap:anywhere]">{king.name}</h2>
            {king.kol ? <span className="bg-ruby px-1.5 font-display text-[11px] font-bold tracking-wider text-white uppercase">KOL</span> : null}
          </div>
          <p className="mt-0.5 text-sm text-ink-soft">
            {king.handle ? (
              <a className="underline decoration-2 underline-offset-2 hover:text-ruby" href={`https://x.com/${king.handle}`} target="_blank" rel="noopener noreferrer">
                @{king.handle}
              </a>
            ) : null}
            {king.followers > 0 ? <span> · {compact(king.followers)} followers</span> : null}
          </p>
          <div className="mt-2 inline-flex flex-wrap items-center bg-ink/8 text-sm">
            <a className="px-2 py-1 font-display font-bold hover:text-ruby" href={BSCSCAN_ADDRESS_URL(king.wallet)} target="_blank" rel="noopener noreferrer" title={king.wallet}>
              {shortAddr(king.wallet)}
            </a>
            <CopyButton value={king.wallet} label="king wallet" />
          </div>
        </div>
      </div>

      <blockquote className="relative mt-5 border-l-4 border-ink pl-4 text-lg leading-snug [overflow-wrap:anywhere]">
        <p className="line-clamp-3">“{king.text || "(no text)"}”</p>
      </blockquote>

      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-display text-sm font-bold tracking-wide uppercase">
        <span>Called {ago(now - king.at)}</span>
        {crowned ? <span className="text-ruby">Won this round · fees to wallet</span> : <span className="text-grass-ink">Holding the hill</span>}
      </p>
    </article>
  );
}

function SourceBadge({ state, connection }: { state: GameState; connection: Connection }) {
  if (connection === "reconnecting" || state.stale)
    return <span className="px-box bg-gold px-2 py-0.5 font-display text-xs font-bold tracking-widest uppercase">Reconnecting…</span>;
  if (state.source === "snapshot")
    return (
      <span className="px-box bg-cloud px-2 py-0.5 font-display text-xs font-bold tracking-widest uppercase" title="No GMGN API key configured: replaying a real snapshot of the test token">
        Demo replay
      </span>
    );
  return (
    <span className="px-box inline-flex items-center gap-1.5 bg-ruby px-2 py-0.5 font-display text-xs font-bold tracking-widest text-white uppercase">
      <span className="blink inline-block h-2 w-2 bg-white" aria-hidden /> Live
    </span>
  );
}

function Clouds() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <PixelCloud className="drift absolute top-[12%] w-40 opacity-90" style={{ animationDuration: "140s", animationDelay: "-40s" }} />
      <PixelCloud className="drift absolute top-[34%] w-24 opacity-80" style={{ animationDuration: "180s", animationDelay: "-120s" }} />
      <PixelCloud className="drift absolute top-[6%] w-28 opacity-70" style={{ animationDuration: "220s", animationDelay: "-10s" }} />
      {[
        [8, 22],
        [46, 9],
        [62, 30],
        [30, 52],
        [88, 18],
      ].map(([l, t], i) => (
        <span key={i} className="absolute h-2 w-2 bg-cloud" style={{ left: `${l}%`, top: `${t}%`, animation: `twinkle ${2 + i * 0.4}s steps(2,end) infinite` }} />
      ))}
    </div>
  );
}
