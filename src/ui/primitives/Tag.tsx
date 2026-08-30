import type { ReactNode } from "react";

/**
 * A `[bracket]` label — the 2004 convention for statuses, counts and topics.
 * The brackets are decorative, so they are hidden from assistive tech.
 */

type TagVariant = "default" | "accent" | "muted";

const variants: Record<TagVariant, string> = {
  default: "border-border text-fg-muted",
  accent: "border-accent text-accent",
  muted: "border-border text-fg-faint",
};

export function Tag({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: TagVariant;
}) {
  return (
    <span
      className={`inline-flex items-center border ${variants[variant]} rounded-[var(--radius)] px-[var(--space-2)] font-mono text-[var(--text-xs)] leading-[1.6]`}
    >
      <span aria-hidden="true">[</span>
      {children}
      <span aria-hidden="true">]</span>
    </span>
  );
}
