import { FLAP_TOKEN_URL, GMGN_TOKEN_URL, ROUND_SECONDS, TOKEN_TICKER } from "@/lib/config";
import { clock } from "@/lib/format";
import { Edge, zoneAttrs } from "./Descent";
import { Bat, Gem, MineCart, Pickaxe, Torch } from "./sprites";

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

// Inside the mountain: the mine teaches the game, then a ladder drops into
// the crystal caves where the rules are carved.
export function HowTo() {
  return (
    <section id="mine" aria-labelledby="how-title" className="relative scroll-mt-16 bg-[#2a1a0e] text-cloud" {...zoneAttrs("mine")}>
      {/* Tunnel mouth: the dark of the entrance above opens into the mine. */}
      <div className="relative h-[420px] overflow-hidden sm:h-[500px] lg:h-[560px]">
        <div data-parallax="0.1" className="absolute inset-x-0 -top-[8%] -bottom-[8%] will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/mine-1920.webp"
            srcSet="/assets/mine-960.webp 960w, /assets/mine-1920.webp 1920w"
            sizes="100vw"
            alt="Pixel-art gold mine tunnel with torches, rails and gold ore"
            width={1920}
            height={1086}
            loading="lazy"
            className="pixelated h-full w-full object-cover object-[20%_50%] sm:object-center"
          />
        </div>
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0b0704] to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgb(20_10_4/.6),transparent_65%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#2a1a0e]" />

        <div className="relative mx-auto flex h-full max-w-[1240px] items-center justify-center px-4 text-center sm:px-6">
          <header data-reveal="drop">
            <Pickaxe className="mx-auto w-12" />
            <p className="mt-4 font-display text-sm font-bold tracking-[0.2em] text-gold uppercase [text-shadow:2px_2px_0_#000]">1,200m · the mine</p>
            <h2 id="how-title" className="px-outline mt-2 font-display text-5xl leading-none font-bold sm:text-6xl">
              How to take the hill
            </h2>
          </header>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1240px] px-4 pb-6 sm:px-6">
        <ol className="grid gap-x-8 gap-y-14 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.n} data-reveal style={{ ["--i" as string]: i }} className="relative pt-10">
              {/* the sign hangs from two chains */}
              <span className="absolute top-0 left-[18%] h-10 w-1 bg-[repeating-linear-gradient(to_bottom,#a9a8a6_0_6px,transparent_6px_9px)]" aria-hidden />
              <span className="absolute top-0 right-[18%] h-10 w-1 bg-[repeating-linear-gradient(to_bottom,#a9a8a6_0_6px,transparent_6px_9px)]" aria-hidden />
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
      </div>

      {/* Rail with a cart that rolls along as you scroll past. */}
      <div data-scrub className="relative mx-auto mt-10 max-w-[1240px] px-4 sm:px-6" aria-hidden>
        <div className="flex justify-between px-6">
          <Torch className="h-12 w-5" />
          <Torch className="h-12 w-5" />
          <Torch className="h-12 w-5" />
        </div>
        <div className="mt-4 [container-type:inline-size]">
          <MineCart className="cart-ride block w-24 sm:w-28" />
        </div>
        <div className="rail -mt-1" />
      </div>

      {/* The shaft: a ladder down into the crystal caves. */}
      <div className="relative mt-10 flex justify-center" aria-hidden>
        <div className="ladder h-40 w-14" />
      </div>
      <Edge fill="#12142a" seed={7} height={56} className="relative -mt-14" />

      <div className="relative overflow-hidden bg-[#12142a]">
        <div data-parallax="0.08" className="absolute inset-x-0 -top-[10%] -bottom-[10%] will-change-transform" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/cavern-1920.webp"
            srcSet="/assets/cavern-960.webp 960w, /assets/cavern-1920.webp 1920w"
            sizes="100vw"
            alt=""
            width={1920}
            height={1086}
            loading="lazy"
            className="pixelated h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[#12142a]/45" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-[14%] h-24" aria-hidden>
          <div className="bat-path absolute left-[8%]">
            <Bat className="w-9" />
          </div>
          <div className="bat-path absolute top-10 left-[24%]" style={{ animationDuration: "18s", animationDelay: "-6s" }}>
            <Bat className="w-6" />
          </div>
        </div>

        <div className="relative mx-auto max-w-[1240px] px-4 pt-20 pb-28 sm:px-6">
          <p data-reveal className="text-center font-display text-sm font-bold tracking-[0.2em] text-[#58e0f5] uppercase [text-shadow:2px_2px_0_#000]">
            800m · the crystal caves · rules carved in stone
          </p>
          <div className="mx-auto mt-8 grid max-w-[980px] gap-8 md:grid-cols-2">
            <Rule gem="#58e0f5" title="Only the last call out counts">
              Calling out more often doesn’t stack. What matters is being the most recent caller when the clock runs out.
            </Rule>
            <Rule gem="#b58cff" title="1-minute break, then a new round">
              When a king is crowned the hill rests for 1 minute. After that it opens again, and the first call out on GMGN starts a fresh round with a full clock.
            </Rule>
          </div>
        </div>
      </div>
      <Edge fill="#161a2e" seed={11} height={56} className="relative -mt-14" />
    </section>
  );
}

function Rule({ gem, title, children }: { gem: string; title: string; children: React.ReactNode }) {
  return (
    <div data-reveal className="crystal-tablet relative p-6 pt-8">
      <Gem color={gem} className="absolute -top-6 left-6 w-10" />
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-cloud/85">{children}</p>
    </div>
  );
}
