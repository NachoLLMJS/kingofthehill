import { BSCSCAN_ADDRESS_URL, FLAP_TOKEN_URL, GMGN_TOKEN_URL, TOKEN_ADDRESS } from "@/lib/config";
import { CopyButton } from "./CopyButton";
import { zoneAttrs } from "./Descent";

const EMBERS = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: -((i * 1.7) % 9),
  dur: 6 + ((i * 13) % 7),
  dx: ((i % 5) - 2) * 14,
}));

// The core: bottom of the mountain. Lava glows, embers rise.
export function Footer() {
  return (
    <footer id="core" className="relative overflow-hidden bg-[#1d1c21] text-cloud" {...zoneAttrs("core")}>
      <div className="absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/core-1920.webp"
          srcSet="/assets/core-960.webp 960w, /assets/core-1920.webp 1920w"
          sizes="100vw"
          alt=""
          width={1920}
          height={823}
          loading="lazy"
          className="lava-shimmer pixelated absolute inset-x-0 bottom-0 h-full w-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1d1c21] via-[#1d1c21]/70 to-transparent" />
        {EMBERS.map((e, i) => (
          <span key={i} className="ember" style={{ left: `${e.left}%`, animationDelay: `${e.delay}s`, animationDuration: `${e.dur}s`, ["--dx" as string]: `${e.dx}px` }} />
        ))}
      </div>

      <div className="relative mx-auto flex max-w-[1240px] flex-col gap-10 px-4 pt-20 pb-[max(22vw,220px)] sm:px-6 md:flex-row md:items-start md:justify-between">
        <div data-reveal className="max-w-[440px]">
          <p className="font-display text-sm font-bold tracking-[0.2em] text-[#ff9a3c] uppercase">0m · the core</p>
          <div className="mt-3 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-emblem-128.webp" alt="" width={56} height={56} loading="lazy" className="pixelated h-14 w-14" />
            <p className="font-display text-3xl font-bold uppercase">King of the Hill</p>
          </div>
          <p className="mt-4 font-display text-lg font-bold text-gold">Last call out takes the crown.</p>
          <a href="#top" className="btn-px btn-px--sm mt-6">
            <span aria-hidden>▲</span> Climb back to the summit
          </a>
        </div>

        <div data-reveal className="flex flex-col gap-4 md:items-end">
          <div className="inline-flex max-w-full flex-wrap items-center bg-cloud text-ink">
            <span className="px-3 font-display text-xs font-bold tracking-wider text-ink-soft uppercase">CA</span>
            <code className="min-w-0 font-display text-sm font-bold break-all">{TOKEN_ADDRESS}</code>
            <CopyButton value={TOKEN_ADDRESS} label="token contract address" />
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-display text-sm font-bold tracking-wide uppercase">
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
    </footer>
  );
}
