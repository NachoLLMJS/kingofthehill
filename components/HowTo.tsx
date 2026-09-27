import { FLAP_TOKEN_URL, GMGN_TOKEN_URL, ROUND_SECONDS, TOKEN_TICKER } from "@/lib/config";
import { clock } from "@/lib/format";
import { zoneAttrs } from "./Descent";

const STEPS = [
  {
    n: "01",
    title: "Grab the token",
    body: `Pick up ${TOKEN_TICKER} on Flap. Every trade pays a small fee, and those fees are the prize.`,
    cta: { label: "Buy on Flap", href: FLAP_TOKEN_URL },
  },
  {
    n: "02",
    title: "Call it out on GMGN",
    body: "Open the token on GMGN and post a call out. The moment it lands, your wallet is the new king and the clock resets.",
    cta: { label: "Call out on GMGN", href: GMGN_TOKEN_URL },
  },
  {
    n: "03",
    title: "Hold the hill",
    body: `Every new call out resets the clock to ${clock(ROUND_SECONDS * 1000)}. If it reaches 00:00 on your call, you’re crowned and the fees go to your wallet.`,
    cta: null,
  },
];

// Inside the mountain: the mine teaches the game.
export function HowTo() {
  return (
    <section id="mine" aria-labelledby="how-title" className="relative scroll-mt-16 bg-[#2a1a0e] text-cloud" {...zoneAttrs("mine")}>
      <div className="relative h-[440px] overflow-hidden sm:h-[520px] lg:h-[600px]">
        <div data-parallax="0.08" className="absolute inset-x-0 -top-[6%] -bottom-[6%] will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/mine-1920.webp"
            srcSet="/assets/mine-960.webp 960w, /assets/mine-1920.webp 1920w"
            sizes="100vw"
            alt="Pixel-art gold mine tunnel with torches, rails, gold ore and a cart full of gold"
            width={1920}
            height={1086}
            loading="lazy"
            className="pixelated h-full w-full object-cover object-[20%_50%] sm:object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgb(20_10_4/.65),transparent_62%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#2a1a0e]" />

        <div className="relative mx-auto flex h-full max-w-[1240px] items-center justify-center px-4 text-center sm:px-6">
          <header data-reveal="drop">
            <p className="font-display text-sm font-bold tracking-[0.2em] text-gold uppercase [text-shadow:2px_2px_0_#000]">Inside the mountain · the mine</p>
            <h2 id="how-title" className="px-outline mt-3 font-display text-5xl leading-none font-bold sm:text-6xl">
              How to take the hill
            </h2>
          </header>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1240px] px-4 pb-[calc(max(100vw,760px)*0.08+64px)] sm:px-6">
        <ol className="grid gap-x-8 gap-y-14 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.n} data-reveal style={{ ["--i" as string]: i }} className="relative pt-10">
              {/* the sign hangs from two chains */}
              <span className="chain absolute top-0 left-[18%] h-10 w-1.5" aria-hidden />
              <span className="chain absolute top-0 right-[18%] h-10 w-1.5" aria-hidden />
              <article className="wood-sign relative flex h-full flex-col p-6 pt-7 text-parchment">
                <span className="timer-digits text-7xl leading-none text-gold [text-shadow:3px_3px_0_#2a1a0e]">{s.n}</span>
                <h3 className="mt-3 font-display text-2xl font-bold [text-shadow:2px_2px_0_#2a1a0e]">{s.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-parchment/90">{s.body}</p>
                {s.cta ? (
                  <a className="btn-px btn-px--sm mt-6 self-start" href={s.cta.href} target="_blank" rel="noopener noreferrer">
                    {s.cta.label} <span aria-hidden>↗</span>
                  </a>
                ) : (
                  <p className="mt-6 inline-flex items-center gap-2 self-start bg-gold px-3 py-2 font-display text-sm font-bold tracking-wider text-ink uppercase">
                    Last call out wins
                  </p>
                )}
              </article>
            </li>
          ))}
        </ol>

        {/* House rules, nailed to a plank on the tunnel wall */}
        <div data-reveal className="wood-sign relative mt-16 grid gap-8 p-6 pt-8 text-parchment md:grid-cols-[auto_1fr_1fr] md:items-start md:gap-10 md:p-8">
          <p className="font-display text-2xl leading-none font-bold text-gold uppercase [text-shadow:2px_2px_0_#2a1a0e]">
            Mine
            <br className="hidden md:block" /> rules
          </p>
          <Rule title="Only the last call out counts">
            Calling out more often doesn’t stack. What matters is being the most recent caller when the clock runs out.
          </Rule>
          <Rule title="1-minute break, then a new round">
            When a king is crowned the hill rests for 1 minute. Then it opens again, and the first call out on GMGN starts a fresh round.
          </Rule>
        </div>
      </div>
    </section>
  );
}

function Rule({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-lg font-bold [text-shadow:2px_2px_0_#2a1a0e]">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-parchment/85">{children}</p>
    </div>
  );
}
