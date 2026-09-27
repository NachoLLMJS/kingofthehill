import { FLAP_TOKEN_URL, GMGN_TOKEN_URL, ROUND_SECONDS, TOKEN_TICKER } from "@/lib/config";
import { clock } from "@/lib/format";

// TO CONFIRM with Nicol: holding requirement, payout timing and anti-spam rules.
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

export function HowTo() {
  return (
    <section id="how" aria-labelledby="how-title" className="relative scroll-mt-20 bg-stone-deep pt-16 pb-24 text-cloud">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <header className="max-w-[640px]">
          <p className="font-display text-sm font-bold tracking-[0.2em] text-gold uppercase">Layer 3 · how to play</p>
          <h2 id="how-title" className="mt-3 font-display text-4xl leading-none font-bold sm:text-5xl">
            Three moves to the top.
          </h2>
        </header>

        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="px-box flex flex-col bg-parchment p-6 text-ink">
              <span className="timer-digits text-7xl text-gold-dk">{s.n}</span>
              <h3 className="mt-3 font-display text-2xl font-bold">{s.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed">{s.body}</p>
              {s.cta ? (
                <a className="btn-px btn-px--sm mt-6 self-start" href={s.cta.href} target="_blank" rel="noopener noreferrer">
                  {s.cta.label} <span aria-hidden>↗</span>
                </a>
              ) : (
                <p className="mt-6 inline-flex items-center gap-2 self-start bg-ink px-3 py-2 font-display text-sm font-bold tracking-wider text-gold uppercase">
                  Last call out wins
                </p>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Rule title="Only the last call out counts">
            Calling out more often doesn’t stack. What matters is being the most recent caller when the clock runs out.
          </Rule>
          <Rule title="Rounds start themselves">
            After a king is crowned, the hill stays open. The next call out on GMGN starts a fresh round with a full clock.
          </Rule>
        </div>
      </div>
    </section>
  );
}

function Rule({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-8 border-gold bg-bedrock/60 p-5">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-cloud/80">{children}</p>
    </div>
  );
}
