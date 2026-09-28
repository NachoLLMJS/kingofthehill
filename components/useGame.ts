"use client";

import { useEffect, useRef, useState } from "react";
import { POLL_MS } from "@/lib/config";
import type { GameState } from "@/lib/types";

export type Connection = "ok" | "reconnecting";

// Polls /api/state and keeps a clock aligned to the server, so the countdown
// is right even when the visitor's own clock is off.
export function useGame(initial: GameState) {
  const [state, setState] = useState(initial);
  const [connection, setConnection] = useState<Connection>("ok");
  const [now, setNow] = useState(initial.serverNow);
  const skew = useRef<number | null>(null);
  const failures = useRef(0);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;

    const tick = async () => {
      try {
        const res = await fetch("/api/state", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const next = (await res.json()) as GameState;
        if (!alive) return;
        failures.current = 0;
        setConnection("ok");
        skew.current = next.serverNow - Date.now();
        setState(next);
      } catch {
        failures.current += 1;
        if (failures.current >= 2) setConnection("reconnecting");
      } finally {
        if (alive) timer = setTimeout(tick, document.hidden ? POLL_MS * 4 : POLL_MS);
      }
    };

    // Refresh right after hydration so a stale server render never lingers.
    timer = setTimeout(tick, 300);
    const onVisible = () => {
      if (!document.hidden) {
        clearTimeout(timer);
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  useEffect(() => {
    // Poll 4×/s for accuracy but only commit whole seconds: React skips the
    // render when the value is unchanged, so the page updates once a second.
    const id = setInterval(() => {
      skew.current ??= initial.serverNow - Date.now();
      setNow(Math.floor((Date.now() + skew.current) / 1000) * 1000);
    }, 250);
    return () => clearInterval(id);
  }, [initial.serverNow]);

  return { state, connection, now };
}
