import { TWITTER_URL } from "@/lib/config";

// Pixel "X" logo button linking to the project's X/Twitter profile.
export function XButton({ className = "" }: { className?: string }) {
  if (!TWITTER_URL) return null;
  return (
    <a
      href={TWITTER_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="X (Twitter)"
      title="X (Twitter)"
      className={`px-box inline-flex h-10 w-10 shrink-0 items-center justify-center bg-ink text-cloud transition-colors hover:bg-gold hover:text-ink ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </a>
  );
}
