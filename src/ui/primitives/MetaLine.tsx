import type { ReactNode } from "react";

/**
 * The byline row lifted straight from 2004 news sites:
 *   "Posted by Emerson on 12/28 | comments [479] | send to friend"
 *
 * Separators are decorative and hidden from screen readers, which would
 * otherwise read a wall of pipes between every item.
 */
export function MetaLine({ items }: { items: ReactNode[] }) {
  const shown = items.filter(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-x-[var(--space-2)] gap-y-[var(--space-1)] font-mono text-[var(--text-xs)] text-fg-muted">
      {shown.map((item, i) => (
        <span key={i} className="flex items-center gap-x-[var(--space-2)]">
          {i > 0 ? <span aria-hidden="true">·</span> : null}
          {item}
        </span>
      ))}
    </div>
  );
}
