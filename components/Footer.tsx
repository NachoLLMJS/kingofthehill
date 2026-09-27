import { BSCSCAN_ADDRESS_URL, FLAP_TOKEN_URL, GMGN_TOKEN_URL, TOKEN_ADDRESS } from "@/lib/config";
import { shortAddr } from "@/lib/format";
import { CopyButton } from "./CopyButton";
import { zoneAttrs } from "./Descent";

const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37 + 5) % 100,
  delay: -((i * 1.7) % 7),
  dur: 4 + ((i * 13) % 5),
  dx: ((i % 5) - 2) * 10,
}));

const LINKS = [
  { href: "#challengers", label: "Challengers" },
  { href: "#mine", label: "How to play" },
  { href: "#hall", label: "Hall of kings" },
];

// The core: the bottom of the mountain. A compact footer on basalt, with the
// lava lake glowing underneath.
export function Footer() {
  return (
    <footer id="core" className="relative overflow-hidden bg-[#1d1c21] text-cloud" {...zoneAttrs("core")}>
      <div className="relative mx-auto grid max-w-[1240px] gap-10 px-4 pt-[max(9vw,72px)] pb-10 sm:px-6 md:grid-cols-[1.2fr_1fr_1.2fr] md:items-start">
        <div>
          <a href="#top" className="inline-flex items-center gap-3" aria-label="Back to the summit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-emblem-128.webp" alt="" width={48} height={48} loading="lazy" className="pixelated h-12 w-12" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-wordmark-600.webp" alt="King of the Hill" width={600} height={227} loading="lazy" className="pixelated h-11 w-auto" />
          </a>
          <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-cloud/75">The last call out on GMGN takes the crown. Hold the hill for 5 minutes and the fees are yours.</p>
        </div>

        <nav aria-label="Footer">
          <p className="font-display text-xs font-bold tracking-[0.2em] text-[#ff9a3c] uppercase">Explore</p>
          <ul className="mt-3 grid gap-2 font-display text-sm font-bold tracking-wide uppercase">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a className="hover:text-gold" href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a className="text-gold hover:text-cloud" href="#top">
                ▲ Back to the summit
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <p className="font-display text-xs font-bold tracking-[0.2em] text-[#ff9a3c] uppercase">Token</p>
          <div className="mt-3 inline-flex max-w-full items-center bg-cloud text-ink">
            <span className="px-3 font-display text-xs font-bold tracking-wider text-ink-soft uppercase">CA</span>
            <code className="font-display text-sm font-bold" title={TOKEN_ADDRESS}>
              {shortAddr(TOKEN_ADDRESS)}
            </code>
            <CopyButton value={TOKEN_ADDRESS} label="token contract address" />
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-display text-sm font-bold tracking-wide uppercase">
            <li>
              <a className="hover:text-gold" href={GMGN_TOKEN_URL} target="_blank" rel="noopener noreferrer">
                GMGN ↗
              </a>
            </li>
            <li>
              <a className="hover:text-gold" href={FLAP_TOKEN_URL} target="_blank" rel="noopener noreferrer">
                Flap ↗
              </a>
            </li>
            <li>
              <a className="hover:text-gold" href={BSCSCAN_ADDRESS_URL(TOKEN_ADDRESS)} target="_blank" rel="noopener noreferrer">
                BscScan ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* The lava lake at the very bottom of the mountain */}
      <div className="relative h-[140px] overflow-hidden sm:h-[180px]" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/core-1920.webp"
          srcSet="/assets/core-960.webp 960w, /assets/core-1920.webp 1920w"
          sizes="100vw"
          alt=""
          width={1920}
          height={823}
          loading="lazy"
          className="lava-shimmer pixelated absolute inset-x-0 bottom-0 h-[300%] w-full object-cover object-bottom"
        />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#1d1c21] to-transparent" />
        {EMBERS.map((e, i) => (
          <span key={i} className="ember" style={{ left: `${e.left}%`, animationDelay: `${e.delay}s`, animationDuration: `${e.dur}s`, ["--dx" as string]: `${e.dx}px` }} />
        ))}
      </div>
    </footer>
  );
}
