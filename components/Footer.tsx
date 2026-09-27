import { BSCSCAN_ADDRESS_URL, FLAP_TOKEN_URL, GMGN_TOKEN_URL, TOKEN_ADDRESS } from "@/lib/config";
import { CopyButton } from "./CopyButton";

export function Footer() {
  return (
    <footer className="bedrock text-cloud">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-10 px-4 py-16 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[420px]">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/croc-head-256.webp" alt="" width={48} height={48} loading="lazy" className="pixelated h-12 w-12" />
            <p className="font-display text-2xl font-bold uppercase">King of the Hill</p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cloud/70">
            A game played with GMGN call outs. Not affiliated with GMGN or Flap. Nothing here is financial advice; memecoins can go to zero.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <div className="inline-flex flex-wrap items-center bg-cloud text-ink">
            <span className="px-3 font-display text-xs font-bold tracking-wider text-ink-soft uppercase">CA</span>
            <code className="font-display text-sm font-bold break-all">{TOKEN_ADDRESS}</code>
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
