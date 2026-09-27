"use client";

import { useEffect, useRef, useState } from "react";
import { BSCSCAN_ADDRESS_URL, FLAP_TOKEN_URL, GMGN_TOKEN_URL } from "@/lib/config";
import { ago, clock, compact, shortAddr } from "@/lib/format";
import { phaseAt } from "@/lib/game";
import type { Callout, GameState } from "@/lib/types";
import type { Connection } from "./useGame";
import { Confetti } from "./Confetti";
import { CopyButton } from "./CopyButton";
import { zoneAttrs } from "./Descent";
import { PixelAvatar, PixelCloud, PixelCrown } from "./pixel";
import { Bird } from "./sprites";

const SEGMENTS = 20;

export function Hero({ state, now, connection }: { state: GameState; now: number; connection: Connection }) {
  const phase = phaseAt(state, now);
  const { status, king, winner } = phase;
  const roundMs = state.roundSeconds * 1000;
  const breakMs = state.breakSeconds * 1000;

  const live = status === "live";
  const crowned = status === "crowned";
  const open = status === "open";

  const digits = live ? clock(phase.roundRemaining) : crowned ? clock(phase.breakRemaining) : open ? clock(roundMs) : "--:--";
  const filled = live
    ? Math.ceil((phase.roundRemaining / roundMs) * SEGMENTS)
    : crowned
      ? Math.ceil((phase.breakRemaining / breakMs) * SEGMENTS)
      : open
        ? SEGMENTS
        : 0;
  const tone = live ? (phase.roundRemaining <= 10_000 ? "timer--danger" : phase.roundRemaining <= 60_000 ? "timer--warn" : "") : "";

  // New call out → drop-in + clock flash. Clock runs out → confetti.
  const prevKing = useRef(king?.id);
  const prevStatus = useRef<string | null>(null);
  const [entrance, setEntrance] = useState(0);
  const [burst, setBurst] = useState(0);
  useEffect(() => {
    if (live && king?.id && prevKing.current && king.id !== prevKing.current) setEntrance((n) => n + 1);
    prevKing.current = king?.id;
  }, [king?.id, live]);
  useEffect(() => {
    const was = prevStatus.current;
    prevStatus.current = status;
    const justCrowned = status === "crowned" && (was === "live" || (was === null && phase.breakRemaining > 5_000));
    if (justCrowned) setBurst((n) => n + 1);
  }, [status, phase.breakRemaining]);

  const label = live ? "Time left on the hill" : crowned ? "King crowned · next round in" : open ? "The hill is open" : "Waiting for the first call out";

  return (
    <section id="top" aria-labelledby="hero-title" className="sky relative overflow-hidden" {...zoneAttrs("top")}>
      <Sun />
      {/* Far range: drifts slower than the page, so the summit feels high up. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%]" aria-hidden>
        <div data-parallax="0.18" className="absolute inset-x-[-4%] bottom-[-6%] will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/far-range-1920.webp"
            srcSet="/assets/far-range-1280.webp 1280w, /assets/far-range-1920.webp 1920w"
            sizes="108vw"
            alt=""
            width={1920}
            height={823}
            className="pixelated w-full opacity-95"
          />
        </div>
      </div>
      <Clouds />
      <Birds />
      <Confetti burst={burst} name={winner?.callout.name} />
      <p className="sr-only" aria-live="polite">
        {crowned && winner ? `${winner.callout.name} was crowned king of the hill.` : ""}
      </p>

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 gap-y-8 px-4 pt-6 pb-0 sm:px-6 lg:grid-cols-12 lg:gap-x-8 lg:pt-8">
        {/* ── Left: HUD ── */}
        <div className="relative z-10 lg:col-span-7 lg:pb-12">
          <div className="flex flex-wrap items-center gap-2">
            <SourceBadge state={state} connection={connection} />
            <span className="px-outline-sm font-display text-sm font-bold uppercase tracking-[0.12em]">
              {state.round > 0 ? `Round ${open ? state.round + 1 : state.round} · ` : ""}Every call out resets the clock
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
            aria-label={live ? `${digits} left for the current king` : crowned ? `Next round in ${digits}` : label}
          >
            <p className={`px-outline-sm font-display text-base font-bold uppercase tracking-[0.18em] ${crowned ? "text-gold" : ""}`}>{label}</p>
            <p className={`timer-digits px-outline mt-2 text-[144px] sm:text-[176px] lg:text-[216px] ${open ? "blink-slow" : ""}`}>{digits}</p>
            <div className="mt-4 flex max-w-[560px] gap-1" aria-hidden>
              {Array.from({ length: SEGMENTS }, (_, i) => {
                const on = i < filled;
                const color = crowned ? "var(--gold)" : live && phase.roundRemaining <= 60_000 ? "var(--gold)" : "var(--grass)";
                return (
                  <span
                    key={i}
                    className="h-4 flex-1"
                    style={{
                      background: on ? color : "rgb(15 29 58 / 0.25)",
                      boxShadow: on ? "inset 0 -4px 0 rgb(0 0 0 / .2), 0 0 0 2px var(--ink)" : "0 0 0 2px rgb(15 29 58 / .35)",
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-9">
            {live && king ? (
              <KingCard king={king} now={now} entrance={entrance} crowned={false} />
            ) : crowned && winner ? (
              <KingCard king={winner.callout} now={now} entrance={burst} crowned round={winner.round} />
            ) : (
              <OpenCard state={state} open={open} />
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-5">
            <a className="btn-px" href={GMGN_TOKEN_URL} target="_blank" rel="noopener noreferrer">
              {open ? "Take the hill on GMGN" : "Call out on GMGN"} <span aria-hidden>↗</span>
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
              className={`pixelated h-full w-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_22%),linear-gradient(to_right,transparent_0%,black_14%,black_88%,transparent_100%)] [mask-composite:intersect] ${crowned ? "bob" : ""}`}
            />
          </div>
        </div>
      </div>

      <a
        href="#challengers"
        className="cue absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1 font-display text-xs font-bold tracking-[0.25em] text-white uppercase [text-shadow:2px_2px_0_var(--ink)] lg:flex"
      >
        Descend
        <svg viewBox="0 0 7 4" className="w-6" shapeRendering="crispEdges" aria-hidden>
          <path d="M0 0h7v1H6v1H5v1H4v1H3V3H2V2H1V1H0z" fill="#fff" stroke="none" />
        </svg>
      </a>
    </section>
  );
}

function KingCard({ king, now, entrance, crowned, round }: { king: Callout; now: number; entrance: number; crowned: boolean; round?: number }) {
  return (
    <article
      key={`k-${king.id}-${entrance}-${crowned}`}
      aria-label={crowned ? "Crowned king" : "Current king"}
      className={`px-box relative max-w-[620px] p-5 sm:p-6 ${crowned ? "bg-gold" : "bg-parchment"} ${entrance ? "king-enter" : ""}`}
    >
      <div className="absolute -top-5 left-5 bg-ink px-3 py-1 font-display text-xs font-bold tracking-[0.2em] text-gold uppercase">
        {crowned ? `Crowned king${round ? ` · round ${round}` : ""}` : "Current king"}
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
        {crowned ? <span className="text-ruby">King of the hill!</span> : <span className="text-grass-ink">Holding the hill</span>}
      </p>
    </article>
  );
}

function OpenCard({ state, open }: { state: GameState; open: boolean }) {
  const last = state.lastWinner;
  return (
    <div className="px-box relative max-w-[620px] bg-parchment p-6">
      <div className="absolute -top-5 left-5 bg-ink px-3 py-1 font-display text-xs font-bold tracking-[0.2em] text-gold uppercase">
        {open ? `Round ${state.round + 1}` : "The throne"}
      </div>
      <p className="mt-1 font-display text-2xl font-bold">The hill is empty.</p>
      <p className="mt-2 text-[15px] leading-relaxed">
        {state.status === "error"
          ? "We can’t reach GMGN right now. The throne will show up as soon as the feed is back."
          : "The first call out on GMGN takes the hill and starts the clock."}
      </p>
      {last ? (
        <div className="mt-5 flex items-center gap-3 border-t-4 border-dotted border-ink/20 pt-4">
          <div className="relative">
            <PixelCrown className="absolute -top-3 left-1/2 w-6 -translate-x-1/2 -rotate-[8deg]" />
            <PixelAvatar src={last.callout.avatar} seed={last.callout.wallet} size={36} grain={4} />
          </div>
          <p className="min-w-0 text-sm">
            <span className="font-display font-bold uppercase">Last king:</span> <span className="[overflow-wrap:anywhere]">{last.callout.name}</span>
          </p>
        </div>
      ) : null}
    </div>
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

function Sun() {
  return (
    <div className="pointer-events-none absolute top-[7%] right-[9%] h-24 w-24" aria-hidden data-parallax="0.08">
      <div className="absolute inset-[-60%] bg-[radial-gradient(circle,rgb(255_250_223/.55)_0_22%,rgb(255_250_223/.18)_38%,transparent_60%)]" />
      <div className="absolute inset-[22%] bg-[#fbfadf] shadow-[0_0_0_6px_rgb(251_250_223/.45),0_0_0_12px_rgb(251_250_223/.2)]" />
    </div>
  );
}

function Birds() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[14%] h-40" aria-hidden>
      <div className="fly absolute top-0 left-0" style={{ animationDuration: "38s", animationDelay: "-6s" }}>
        <Bird style={{ left: 0, top: 0 }} />
        <Bird style={{ left: 26, top: 14, transform: "scale(.8)" }} />
        <Bird style={{ left: -18, top: 20, transform: "scale(.7)" }} />
      </div>
      <div className="fly absolute top-20 left-0" style={{ animationDuration: "52s", animationDelay: "-30s" }}>
        <Bird style={{ left: 0, top: 0, transform: "scale(.7)" }} />
        <Bird style={{ left: 22, top: 10, transform: "scale(.6)" }} />
      </div>
    </div>
  );
}

function Clouds() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden data-parallax="0.1">
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
