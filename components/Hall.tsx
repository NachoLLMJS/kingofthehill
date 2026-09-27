"use client";

import { useState } from "react";
import { BSCSCAN_ADDRESS_URL } from "@/lib/config";
import { duration, shortAddr } from "@/lib/format";
import type { GameState } from "@/lib/types";
import { Edge, zoneAttrs } from "./Descent";
import { PixelAvatar, PixelCrown } from "./pixel";
import { Torch } from "./sprites";

const PAGE = 6;

// The crypt of kings: every crowned king rests in a stone tomb with their crown.
export function Hall({ state }: { state: GameState }) {
  const [shown, setShown] = useState(PAGE);
  const winners = state.winners.slice(0, shown);
  const minutes = Math.round(state.roundSeconds / 60);

  return (
    <section id="hall" aria-labelledby="hall-title" className="relative scroll-mt-16 bg-[#161a2e] text-cloud" {...zoneAttrs("hall")}>
      <div className="relative h-[520px] overflow-hidden sm:h-[600px] lg:h-[680px]">
        <div data-parallax="0.1" className="absolute inset-x-0 -top-[8%] -bottom-[8%] will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/crypt-1920.webp"
            srcSet="/assets/crypt-960.webp 960w, /assets/crypt-1920.webp 1920w"
            sizes="100vw"
            alt="Pixel-art royal crypt with stone pillars, red crown banners, braziers and tombs topped with golden crowns"
            width={1920}
            height={1086}
            loading="lazy"
            className="pixelated h-full w-full object-cover object-[50%_60%]"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgb(10_12_24/.6),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-[#161a2e]" />

        <div className="relative mx-auto flex h-full max-w-[1240px] items-center justify-center px-4 text-center sm:px-6">
          <header data-reveal="drop" className="max-w-[640px]">
            <PixelCrown className="mx-auto w-16 -rotate-[6deg] drop-shadow-[0_4px_0_rgb(0_0_0/.4)]" />
            <p className="mt-4 font-display text-sm font-bold tracking-[0.2em] text-gold uppercase [text-shadow:2px_2px_0_#000]">400m · the crypt of kings</p>
            <h2 id="hall-title" className="px-outline mt-2 font-display text-5xl leading-none font-bold sm:text-6xl">
              Hall of Kings
            </h2>
            <p className="mx-auto mt-4 max-w-[44ch] text-[15px] leading-relaxed text-cloud [text-shadow:2px_2px_0_#000]">
              Below the mine lies the crypt. Every caller who held the hill for {minutes} minutes is laid to rest here with their crown. Newest king first.
            </p>
          </header>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1240px] px-4 pb-10 sm:px-6">
        {winners.length === 0 ? (
          <div className="tomb relative mx-auto max-w-[520px] p-8 text-center">
            <PixelCrown className="mx-auto w-12 opacity-60" />
            <p className="mt-4 font-display text-xl font-bold uppercase">No king crowned yet</p>
            <p className="mt-2 text-[15px] text-cloud/80">The first caller to hold the hill until 00:00 gets the first tomb.</p>
          </div>
        ) : (
          <ol className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" aria-label="Crowned kings, newest first">
            {winners.map((w, i) => (
              <li key={w.callout.id} data-reveal style={{ ["--i" as string]: i % 3 }} className="relative pt-6">
                <Torch className="absolute -top-4 left-3 h-11 w-5" />
                <Torch className="absolute -top-4 right-3 h-11 w-5" />
                <article className={`tomb relative p-6 pt-8 ${i === 0 ? "tomb--latest" : ""}`}>
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#8f1d22] px-3 py-0.5 font-display text-xs font-bold tracking-widest whitespace-nowrap text-gold uppercase shadow-[0_0_0_3px_#0d0f1c]">
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
                  <dl className="mt-5 grid grid-cols-3 gap-2 border-t-4 border-dotted border-[#5c6282] pt-4 text-center">
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

      <div className="h-24" />
      <Edge fill="#1d1c21" seed={13} height={56} className="relative -mt-14" />
    </section>
  );
}
