"use client";

import { memo, useState } from "react";
import { ago, duration, shortAddr } from "@/lib/format";
import { calloutText, useI18n } from "@/lib/i18n";
import type { FeedItem, GameState } from "@/lib/types";
import { zoneAttrs } from "./Descent";
import { PixelAvatar, PixelCrown } from "./pixel";
import { Flag } from "./sprites";

const PAGE = 10;

// The slopes: challengers are camps along a switchback trail down the
// mountain. Newest call out sits closest to the summit.
export const Feed = memo(function Feed({ state, now }: { state: GameState; now: number }) {
  const { t } = useI18n();
  const [shown, setShown] = useState(PAGE);
  const items = state.recent.slice(0, shown);
  const { stats } = state;

  return (
    <section id="challengers" aria-labelledby="feed-title" className="relative z-10 flex flex-1 flex-col scroll-mt-16" {...zoneAttrs("challengers")}>
      {/* One painted mountainside: the trail winds down to the mine entrance at the bottom. */}

      <div data-mountain-content className="relative mx-auto max-w-[1100px] px-4 pt-10 sm:px-6">
        <header data-reveal className="px-box mx-auto max-w-[620px] bg-parchment p-6 text-center text-ink sm:p-8">
          <p className="font-display text-sm font-bold tracking-[0.2em] text-grass-dk uppercase">{t("slopes_kicker")}</p>
          <h2 id="feed-title" className="mt-2 font-display text-4xl leading-none font-bold sm:text-5xl">
            {t("slopes_title")}
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink-soft">
            {t("slopes_body")}
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
            <Stat label={t("stat_callouts")} value={String(stats.callouts)} />
            <Stat label={t("stat_challengers")} value={String(stats.challengers)} />
            <Stat label={t("stat_kings")} value={String(stats.rounds)} />
            <Stat label={t("stat_longest")} value={duration(stats.longestRoundMs).split(" ")[0]} />
          </dl>
        </header>

        <div className="relative mt-16">
          {items.length === 0 ? (
            <div className="px-box mx-auto max-w-[520px] bg-parchment p-8 text-center text-ink">
              <p className="font-display text-xl font-bold uppercase">{t("no_challengers")}</p>
              <p className="mt-2 text-[15px]">{t("no_challengers_body")}</p>
            </div>
          ) : (
            <ol className="relative" aria-label="Recent call outs, newest first">
              {items.map((c, i) => (
                <Camp
                  key={c.id}
                  c={c}
                  i={i}
                  isKing={state.status === "live" && state.king?.id === c.id}
                  now={state.status === "live" && state.king?.id === c.id ? now : Math.floor(now / 15_000) * 15_000}
                />
              ))}
            </ol>
          )}

          <div className="relative mt-12 flex flex-wrap justify-center gap-4" data-content-end>
            {state.recent.length > shown ? (
              <button type="button" className="btn-px btn-px--grass btn-px--sm" onClick={() => setShown((n) => n + PAGE)}>
                {t("more_trail")}
              </button>
            ) : null}
            <a href="#mine" className="btn-px btn-px--sm" style={{ ["--btn-bg" as string]: "#7a5030", ["--btn-fg" as string]: "#fbd322" }}>
              {t("enter_mine")} <span aria-hidden>▼</span>
            </a>
          </div>
        </div>
      </div>

    </section>
  );
});

const Camp = memo(function Camp({ c, i, now, isKing }: { c: FeedItem; i: number; now: number; isKing: boolean }) {
  const { t, lang } = useI18n();
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
          <p className="mt-1.5 line-clamp-2 text-[15px] leading-snug [overflow-wrap:anywhere]">{calloutText(c, lang) || t("no_text")}</p>
          <p className="mt-1.5 text-xs text-ink-soft">
            {shortAddr(c.wallet)} · {ago(now - c.at, t)}
          </p>
        </div>
        <div className="col-span-2">
          <ReignTag c={c} isKing={isKing} now={now} />
        </div>
      </article>
    </li>
  );
});

function ReignTag({ c, isKing, now }: { c: FeedItem; isKing: boolean; now: number }) {
  const { t } = useI18n();
  if (c.round === null)
    return <span className="inline-block border-2 border-dashed border-ink/30 px-2 py-0.5 font-display text-xs font-bold tracking-wider text-ink-soft/80 uppercase">{t("tag_break")}</span>;
  if (isKing) return <span className="inline-block bg-ink px-2 py-1 font-display text-xs font-bold tracking-wider text-gold uppercase">{t("tag_on_hill", { t: duration(now - c.at) })}</span>;
  if (c.crowned) return <span className="inline-block bg-ruby px-2 py-1 font-display text-xs font-bold tracking-wider text-white uppercase">{t("tag_crowned", { n: c.round })}</span>;
  return (
    <span className="inline-block border-2 border-ink/30 px-2 py-0.5 font-display text-xs font-bold tracking-wider text-ink-soft uppercase">
      {t("tag_held", { t: duration(c.reignMs ?? 0), n: c.round ?? "" })}
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
