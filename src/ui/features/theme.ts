/**
 * Theme store.
 *
 * Three states, not two: "system" follows prefers-color-scheme, while "light"
 * and "dark" are explicit overrides persisted in localStorage.
 *
 * Every change is announced on a DOM CustomEvent. That indirection exists on
 * purpose — the deferred dark-mode easter egg (a figure who walks out and
 * flips the light back on) subscribes to this rather than being wired into
 * the toggle. Do not replace this with an inline class flip.
 */

export type ThemeChoice = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
export const THEME_EVENT = "themechange";

export type ThemeChangeDetail = {
  /** What the user chose, including "system". */
  choice: ThemeChoice;
  /** What that actually renders as right now. */
  resolved: ResolvedTheme;
};

function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function resolveTheme(choice: ThemeChoice): ResolvedTheme {
  if (choice === "system") return systemPrefersDark() ? "dark" : "light";
  return choice;
}

export function readStoredChoice(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
  } catch {
    // Private mode, or storage disabled. System default is a fine fallback.
  }
  return "system";
}

/**
 * Apply a choice to the document and announce it.
 * "system" removes the attribute so the CSS media query takes over.
 */
export function applyTheme(choice: ThemeChoice): ResolvedTheme {
  const resolved = resolveTheme(choice);
  const root = document.documentElement;

  if (choice === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", choice);
  }

  try {
    if (choice === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, choice);
    }
  } catch {
    // Non-fatal: the theme still applies for this page view.
  }

  window.dispatchEvent(
    new CustomEvent<ThemeChangeDetail>(THEME_EVENT, {
      detail: { choice, resolved },
    }),
  );

  return resolved;
}

/** Subscribe to theme changes. Returns an unsubscribe function. */
export function onThemeChange(
  handler: (detail: ThemeChangeDetail) => void,
): () => void {
  const listener = (event: Event) => {
    handler((event as CustomEvent<ThemeChangeDetail>).detail);
  };
  window.addEventListener(THEME_EVENT, listener);
  return () => window.removeEventListener(THEME_EVENT, listener);
}

/**
 * Runs before first paint, inlined in <head>, to stop a light flash on a
 * dark-theme reload. Kept tiny and dependency-free deliberately.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var c=localStorage.getItem("${THEME_STORAGE_KEY}");if(c==="light"||c==="dark"){document.documentElement.setAttribute("data-theme",c)}}catch(e){}})();`;
