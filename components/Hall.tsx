"use client";

import { useState } from "react";
import { BSCSCAN_ADDRESS_URL } from "@/lib/config";
import { duration, shortAddr } from "@/lib/format";
import { calloutText, useI18n } from "@/lib/i18n";
import type { GameState } from "@/lib/types";
import { zoneAttrs } from "./Descent";
import { PixelAvatar, PixelCrown } from "./pixel";

const PAGE = 6;

// The crypt of kings: every crowned king rests in a stone tomb with their crown.
export function Hall({ state }: { state: GameState }) {
  const { t, lang } = useI18n();
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
            <p className="mt-4 font-display text-sm font-bold tracking-[0.2em] text-gold uppercase [text-shadow:2px_2px_0_#000]">{t("hall_kicker")}</p>
            <h2 id="hall-title" className="px-outline mt-2 font-display text-5xl leading-none font-bold sm:text-6xl">
              {t("hall_title")}
            </h2>
            <p className="mx-auto mt-4 max-w-[44ch] text-[15px] leading-relaxed text-cloud [text-shadow:2px_2px_0_#000]">
              {t("hall_body", { m: minutes })}
            </p>
          </header>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1240px] px-4 pb-10 sm:px-6">
        {winners.length === 0 ? (
          <div className="tomb relative mx-auto max-w-[520px] p-8 text-center">
            <PixelCrown className="mx-auto w-12 opacity-60" />
            <p className="mt-4 font-display text-xl font-bold uppercase">{t("no_king")}</p>
            <p className="mt-2 text-[15px] text-cloud/80">{t("no_king_body")}</p>
          </div>
        ) : (
          <ol className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" aria-label="Crowned kings, newest first">
            {winners.map((w, i) => (
              <li key={w.callout.id} data-reveal style={{ ["--i" as string]: i % 3 }} className="relative pt-6">
                <article className={`tomb relative p-6 pt-8 ${i === 0 ? "tomb--latest" : ""}`}>
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#8f1d22] px-3 py-0.5 font-display text-xs font-bold tracking-widest whitespace-nowrap text-gold uppercase shadow-[0_0_0_3px_#0d0f1c]">
                    {i === 0 ? t("latest_king", { n: w.round }) : t("round", { n: w.round })}
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
                  <p className="mt-4 line-clamp-2 text-[15px] leading-snug text-cloud/85 [overflow-wrap:anywhere]">“{calloutText(w.callout, lang) || t("no_text")}”</p>
                  <dl className="mt-5 grid grid-cols-3 gap-2 border-t-4 border-dotted border-[#5c6282] pt-4 text-center">
                    <div>
                      <dt className="font-display text-[10px] font-bold tracking-widest text-cloud/60 uppercase">{t("col_crowned")}</dt>
                      <dd className="timer-digits mt-1 text-2xl">{new Date(w.wonAt).toLocaleTimeString(lang === "zh" ? "zh-CN" : "en", { hour: "2-digit", minute: "2-digit" })}</dd>
                    </div>
                    <div>
                      <dt className="font-display text-[10px] font-bold tracking-widest text-cloud/60 uppercase">{t("col_round")}</dt>
                      <dd className="timer-digits mt-1 text-2xl">{duration(w.wonAt - w.startedAt).split(" ")[0]}</dd>
                    </div>
                    <div>
                      <dt className="font-display text-[10px] font-bold tracking-widest text-cloud/60 uppercase">{t("col_callouts")}</dt>
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
              {t("dig_deeper")}
            </button>
          </div>
        ) : null}
      </div>

      <div className="h-6" />
    </section>
  );
}
