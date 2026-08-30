"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  applyTheme,
  readStoredChoice,
  resolveTheme,
  THEME_EVENT,
  type ResolvedTheme,
  type ThemeChoice,
} from "./theme";

/**
 * Cycles system -> light -> dark -> system.
 *
 * A real <button>, not a styled div — Invariant 3. The old site's nav toggle
 * was a <div> with no focus, no keyboard access and no aria-expanded, which
 * locked keyboard users out of navigation entirely on mobile.
 *
 * Theme lives in localStorage and the OS colour-scheme query — both external
 * mutable stores — so it is read with useSyncExternalStore rather than an
 * effect. That keeps it correct through hydration and avoids tearing.
 */

const order: ThemeChoice[] = ["system", "light", "dark"];

const labels: Record<ThemeChoice, string> = {
  system: "auto",
  light: "light",
  dark: "dark",
};

/** Re-read on our own theme event and on OS-level changes. */
function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener(THEME_EVENT, onChange);
  mq.addEventListener("change", onChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    mq.removeEventListener("change", onChange);
  };
}

// Snapshots must be referentially stable, so both return primitives.
const getChoice = (): ThemeChoice => readStoredChoice();
const getServerChoice = (): ThemeChoice => "system";

const getResolved = (): ResolvedTheme => resolveTheme(readStoredChoice());
const getServerResolved = (): ResolvedTheme => "light";

export function ThemeToggle() {
  const choice = useSyncExternalStore(subscribe, getChoice, getServerChoice);
  const resolved = useSyncExternalStore(
    subscribe,
    getResolved,
    getServerResolved,
  );

  const cycle = useCallback(() => {
    applyTheme(order[(order.indexOf(choice) + 1) % order.length]);
  }, [choice]);

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${labels[choice]}. Activate to change.`}
      className="cursor-pointer border border-border bg-transparent px-[var(--space-2)] py-[var(--space-1)] font-mono text-[var(--text-xs)] text-fg-muted rounded-[var(--radius)] transition-colors hover:border-accent hover:text-accent"
    >
      <span aria-hidden="true">
        theme:{labels[choice]}
        {choice === "system" ? ` (${resolved})` : ""}
      </span>
    </button>
  );
}
