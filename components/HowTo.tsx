import { FLAP_TOKEN_URL, GMGN_TOKEN_URL, ROUND_SECONDS, TOKEN_TICKER } from "@/lib/config";
import { clock } from "@/lib/format";
import { Edge, zoneAttrs } from "./Descent";
import { Bat, Gem, MineCart } from "./sprites";

const STEPS = [
  {
    n: "01",
    gem: "#58e0f5",
    title: "Grab the token",
    body: `Pick up ${TOKEN_TICKER} on Flap. Every trade pays a small fee, and those fees are the prize.`,
    cta: { label: "Buy on Flap", href: FLAP_TOKEN_URL },
  },
  {
    n: "02",
    gem: "#b58cff",
    title: "Call it out on GMGN",
    body: "Open the token on GMGN and post a call out. The moment it lands, your wallet is the new king and the clock resets.",
    cta: { label: "Call out on GMGN", href: GMGN_TOKEN_URL },
  },
  {
    n: "03",
    gem: "#fbd322",
    title: "Hold the hill",
    body: `Every new call out resets the clock to ${clock(ROUND_SECONDS * 1000)}. If it reaches 00:00 on your call, you’re crowned and the fees go to your wallet.`,
    cta: null,
  },
];

// The crystal caves: three steps lit by crystals; the cart rolls the rail.
export function HowTo() {
  return (
    <section id="how" aria-labelledby="how-title" className="relative scroll-mt-16 bg-[#12142a] text-cloud" {...zoneAttrs("how")}>
      <div className="relative overflow-hidden">
        <div data-parallax="0.08" className="absolute inset-x-0 -top-[6%] -bottom-[6%] will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/cavern-1920.webp"
            srcSet="/assets/cavern-960.webp 960w, /assets/cavern-1920.webp 1920w"
            sizes="100vw"
            alt="Pixel-art crystal cavern with glowing cyan and violet crystals, an underground pool and a mine rail"
            width={1920}
            height={1086}
            loading="lazy"
            className="pixelated h-full w-full object-cover object-bottom"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#12142a] via-[#12142a]/40 to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 top-[18%] h-24" aria-hidden>
          <div className="bat-path absolute left-[8%]">
            <Bat className="w-9" />
          </div>
          <div className="bat-path absolute top-10 left-[20%]" style={{ animationDuration: "18s", animationDelay: "-6s" }}>
            <Bat className="w-6" />
          </div>
        </div>

        <div className="relative mx-auto max-w-[1240px] px-4 pt-20 pb-[min(30vw,300px)] sm:px-6">
          <header data-reveal className="mx-auto max-w-[640px] text-center">
            <p className="font-display text-sm font-bold tracking-[0.2em] text-[#58e0f5] uppercase [text-shadow:2px_2px_0_#000]">300m · crystal caves</p>
            <h2 id="how-title" className="px-outline mt-2 font-display text-5xl leading-none font-bold sm:text-6xl">
              Three moves to the top.
            </h2>
          </header>

          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.n} data-reveal style={{ ["--i" as string]: i }} className="crystal-tablet relative flex flex-col p-6 pt-8" data-gem={s.gem}>
                <Gem color={s.gem} className="absolute -top-6 left-6 w-10" style={{ animationDelay: `${i * 0.6}s` }} />
                <span className="timer-digits text-7xl leading-none" style={{ color: s.gem }}>
                  {s.n}
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold">{s.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-cloud/85">{s.body}</p>
                {s.cta ? (
                  <a className="btn-px btn-px--sm mt-6 self-start" href={s.cta.href} target="_blank" rel="noopener noreferrer">
                    {s.cta.label} <span aria-hidden>↗</span>
                  </a>
                ) : (
                  <p className="mt-6 inline-flex items-center gap-2 self-start bg-gold px-3 py-2 font-display text-sm font-bold tracking-wider text-ink uppercase">
                    Last call out wins
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Cart rides the cavern rail (the rail is painted in the art at ~83%). */}
        <div data-scrub className="absolute inset-x-0 bottom-[calc(17%-4px)] [container-type:inline-size]" aria-hidden>
          <MineCart className="cart-ride block w-[9vw] max-w-32 min-w-16" />
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1240px] gap-6 px-4 pt-14 pb-24 sm:px-6 md:grid-cols-2">
        <Rule title="Only the last call out counts">
          Calling out more often doesn’t stack. What matters is being the most recent caller when the clock runs out.
        </Rule>
        <Rule title="1-minute break, then a new round">
          When a king is crowned the hill rests for 1 minute. After that it opens again, and the first call out on GMGN starts a fresh round with a full clock.
        </Rule>
      </div>
      <Edge fill="#1d1c21" seed={11} height={56} className="relative -mt-14" />
    </section>
  );
}

function Rule({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div data-reveal className="border-l-8 border-[#58e0f5] bg-[#1c2040] p-5">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-cloud/80">{children}</p>
    </div>
  );
}
