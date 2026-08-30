import type { ReactNode } from "react";

/**
 * The fixed footer strip — build info, theme control, visitor count.
 *
 * Reads as a status line from an era before chrome got invisible, and gives
 * the theme toggle and (later) the visitor counter a natural home.
 */
export function StatusBar({
  left,
  right,
}: {
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="sticky bottom-0 z-10 flex items-center justify-between gap-[var(--space-3)] border-t border-border bg-surface px-[var(--space-4)] py-[var(--space-2)] font-mono text-[var(--text-xs)] text-fg-muted">
      <div className="flex items-center gap-[var(--space-3)]">{left}</div>
      <div className="flex items-center gap-[var(--space-3)]">{right}</div>
    </div>
  );
}
