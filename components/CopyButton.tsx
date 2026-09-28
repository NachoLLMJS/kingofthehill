"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export function CopyButton({ value, label, className = "" }: { value: string; label: string; className?: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("error");
    }
    setTimeout(() => setState("idle"), 1600);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex min-h-8 items-center gap-1 px-2 font-display text-xs font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-gold ${className}`}
      aria-label={`Copy ${label}`}
    >
      <span aria-hidden>{state === "copied" ? "✓" : state === "error" ? "!" : "⧉"}</span>
      <span aria-live="polite">{state === "copied" ? t("copied") : state === "error" ? t("copy_failed") : t("copy")}</span>
    </button>
  );
}
