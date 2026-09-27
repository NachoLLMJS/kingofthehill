"use client";

import { useState } from "react";
import { BSCSCAN_ADDRESS_URL } from "@/lib/config";
import { duration, shortAddr } from "@/lib/format";
import type { GameState } from "@/lib/types";
import { Edge, zoneAttrs } from "./Descent";
import { PixelAvatar, PixelCrown } from "./pixel";
import { MineCart, Pickaxe, Torch } from "./sprites";

const PAGE = 6;

// The mine: every crowned king gets a gold plaque on the tunnel wall.
export function Hall({ state }: { state: GameState }) {
  const [shown, setShown] = useState(PAGE);
  const winners = state.winners.slice(0, shown);
  const minutes = Math.round(state.roundSeconds / 60);

  return (
    <section id="hall" aria-labelledby="hall-title" className="relative scroll-mt-16 bg-[#2a1a0e] text-cloud" {...zoneAttrs("hall")}>
      <div className="relative h-[520px] overflow-hidden sm:h-[600px] lg:h-[680px]">
        <div data-parallax="0.1" className="absolute inset-x-0 -top-[8%] -bottom-[8%] will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/mine-1920.webp"
            srcSet="/assets/mine-960.webp 960w, /assets/mine-1920.webp 1920w"
            sizes="100vw"
            alt="Pixel-art gold mine tunnel with torches, rails and golden crowns on stone pedestals"
            width={1920}
            height={1086}
            loading="lazy"
            className="pixelated h-full w-full object-cover object-[20%_50%] sm:object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgb(20_10_4/.55),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-[#2a1a0e]" />

        <div className="relative mx-auto flex h-full max-w-[1240px] items-center justify-center px-4 text-center sm:px-6">
          <header data-reveal="drop" className="max-w-[640px]">
            <PixelCrown className="mx-auto w-16 -rotate-[6deg] drop-shadow-[0_4px_0_rgb(0_0_0/.4)]" />
            <p className="mt-4 font-display text-sm font-bold tracking-[0.2em] text-gold uppercase [text-shadow:2px_2px_0_#000]">900m · the mine</p>
            <h2 id="hall-title" className="px-outline mt-2 font-display text-5xl leading-none font-bold sm:text-6xl">
              Hall of Kings
            </h2>
            <p className="mx-auto mt-4 max-w-[44ch] text-[15px] leading-relaxed text-cloud [text-shadow:2px_2px_0_#000]">
              Deep in the mine, every caller who held the hill for {minutes} minutes gets a gold plaque. Newest king first.
            </p>
          </header>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1240px] px-4 pb-10 sm:px-6">
        {winners.length === 0 ? (
          <div className="px-box mx-auto max-w-[520px] bg-[#3a2415] p-8 text-center">
            <Pickaxe className="mx-auto w-12" />
            <p className="mt-4 font-display text-xl font-bold uppercase">No king crowned yet</p>
            <p className="mt-2 text-[15px] text-cloud/80">The first caller to hold the hill until 00:00 gets the first plaque.</p>
          </div>
        ) : (
          <ol className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" aria-label="Crowned kings, newest first">
            {winners.map((w, i) => (
              <li key={w.callout.id} data-reveal style={{ ["--i" as string]: i % 3 }} className="relative pt-6">
                <Torch className="absolute -top-4 left-3 h-11 w-5" />
                <Torch className="absolute -top-4 right-3 h-11 w-5" />
                <article className={`plaque relative p-5 pt-6 ${i === 0 ? "plaque--latest" : ""}`}>
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold px-2 py-0.5 font-display text-xs font-bold tracking-widest whitespace-nowrap text-ink uppercase">
                    {i === 0 ? `Latest king · round ${w.round}` : `Round ${w.round}`}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <PixelCrown className="absolute -top-5 left-1/2 w-9 -translate-x-1/2 -rotate-[8deg]" />
                      <div className="shadow-[0_0_0_3px_#fbd322,0_0_0_6px_#483114]">
                        <PixelAvatar src={w.callout.avatar} seed={w.callout.wallet} size={56} grain={4} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-display text-lg font-bold text-gold [overflow-wrap:anywhere]">{w.callout.name}</p>
                      <a
                        className="font-display text-sm text-cloud/85 underline decoration-2 underline-offset-2 hover:text-gold"
                        href={BSCSCAN_ADDRESS_URL(w.callout.wallet)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={w.callout.wallet}
                      >
                        {shortAddr(w.callout.wallet)}
                      </a>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-2 text-[15px] leading-snug text-cloud/85 [overflow-wrap:anywhere]">“{w.callout.text || "(no text)"}”</p>
                  <dl className="mt-5 grid grid-cols-3 gap-2 border-t-4 border-dotted border-[#7a5030] pt-4 text-center">
                    <div>
                      <dt className="font-display text-[10px] font-bold tracking-widest text-cloud/60 uppercase">Crowned</dt>
                      <dd className="timer-digits mt-1 text-2xl">{new Date(w.wonAt).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}</dd>
                    </div>
                    <div>
                      <dt className="font-display text-[10px] font-bold tracking-widest text-cloud/60 uppercase">Round</dt>
                      <dd className="timer-digits mt-1 text-2xl">{duration(w.wonAt - w.startedAt).split(" ")[0]}</dd>
                    </div>
                    <div>
                      <dt className="font-display text-[10px] font-bold tracking-widest text-cloud/60 uppercase">Call outs</dt>
                      <dd className="timer-digits mt-1 text-2xl text-gold">{w.callouts}</dd>
                    </div>
                  </dl>
                </article>
              </li>
            ))}
          </ol>
        )}

        {state.winners.length > shown ? (
          <div className="mt-12 flex justify-center">
            <button type="button" className="btn-px btn-px--sm" onClick={() => setShown((n) => n + PAGE)}>
              Dig deeper
            </button>
          </div>
        ) : null}
      </div>

      {/* Rail with a cart that rolls along as you scroll past. */}
      <div data-scrub className="relative mx-auto mt-6 max-w-[1240px] px-4 pb-16 sm:px-6" aria-hidden>
        <div className="[container-type:inline-size]">
          <MineCart className="cart-ride block w-24 sm:w-28" />
        </div>
        <div className="rail -mt-1" />
      </div>
      <Edge fill="#12142a" seed={7} height={56} className="relative -mt-14" />
    </section>
  );
}
