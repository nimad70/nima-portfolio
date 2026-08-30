import type { ReactNode, ElementType } from "react";

/**
 * The core retro primitive: a bordered box with a title bar.
 *
 * This is the 2004 web's most translatable idea — content lives in labelled
 * boxes rather than floating in whitespace. Compose pages from these instead
 * of writing one-off CSS; that habit is what turned the old stylesheet into
 * 850 unstructured lines.
 */

type PanelProps = {
  /** Title bar text. Omit for an unlabelled box. */
  title?: string;
  /** Right-aligned slot in the title bar — counts, badges, actions. */
  meta?: ReactNode;
  children: ReactNode;
  /** Landmark element to render. Use `section`/`article` for real page regions. */
  as?: ElementType;
  className?: string;
};

export function Panel({
  title,
  meta,
  children,
  as: Tag = "section",
  className = "",
}: PanelProps) {
  return (
    <Tag
      className={`border border-border bg-surface rounded-[var(--radius)] overflow-hidden ${className}`}
    >
      {title ? <PanelHeader title={title} meta={meta} /> : null}
      <div className="p-[var(--space-4)]">{children}</div>
    </Tag>
  );
}

type PanelHeaderProps = {
  title: string;
  meta?: ReactNode;
  /** Heading level. Invariant 4 — exactly one h1 per page, so panels default to h2. */
  level?: 2 | 3 | 4;
};

export function PanelHeader({ title, meta, level = 2 }: PanelHeaderProps) {
  const Heading = `h${level}` as ElementType;

  return (
    <div className="flex items-center justify-between gap-[var(--space-3)] border-b border-border bg-surface-raised px-[var(--space-4)] py-[var(--space-2)]">
      <Heading className="font-mono text-[var(--text-sm)] uppercase tracking-[var(--tracking-caps)] text-fg">
        {title}
      </Heading>
      {meta ? (
        <div className="font-mono text-[var(--text-xs)] text-fg-muted">
          {meta}
        </div>
      ) : null}
    </div>
  );
}
