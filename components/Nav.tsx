import { GMGN_TOKEN_URL, TOKEN_ADDRESS } from "@/lib/config";
import { shortAddr } from "@/lib/format";
import { CopyButton } from "./CopyButton";

const LINKS = [
  { href: "#challengers", zone: "challengers", label: "Challengers" },
  { href: "#hall", zone: "hall", label: "Hall of kings" },
  { href: "#how", zone: "how", label: "How to play" },
];

export function Nav() {
  return (
    <header className="hud-bar sticky top-0 z-40 border-b-4">
      <span className="hud-progress absolute right-0 bottom-[-4px] left-0 h-1 bg-gold" aria-hidden />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-gold focus:px-3 focus:py-2 focus:font-display">
        Skip to content
      </a>
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[1240px] items-center gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-3" aria-label="King of the Hill — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/croc-head-256.webp" alt="" width={40} height={40} className="pixelated px-box h-10 w-10" />
          <span className="px-outline-sm font-display text-lg leading-none font-bold tracking-wide uppercase sm:text-xl">
            King of
            <br className="sm:hidden" /> the Hill
          </span>
        </a>

        <ul className="ml-6 hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                data-zone-link={l.zone}
                className="px-outline-sm px-3 py-2 font-display text-sm font-bold tracking-wide uppercase hover:bg-ink hover:text-gold aria-[current]:bg-ink aria-[current]:text-gold"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-3">
          <div className="px-box hidden items-center bg-cloud text-ink md:flex">
            <span className="px-2 font-display text-xs font-bold tracking-wider text-ink-soft uppercase">CA</span>
            <span className="font-display text-sm font-bold" title={TOKEN_ADDRESS}>
              {shortAddr(TOKEN_ADDRESS)}
            </span>
            <CopyButton value={TOKEN_ADDRESS} label="token contract address" />
          </div>
          <a href={GMGN_TOKEN_URL} target="_blank" rel="noopener noreferrer" className="btn-px btn-px--sm">
            Call out <span aria-hidden>↗</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
