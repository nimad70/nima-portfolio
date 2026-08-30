import type { ReactNode } from "react";

/**
 * Monospace terminal surface, shared by the boot sequence and the chat widget.
 *
 * The convergence that makes this design work: an LLM streaming tokens *is*
 * a typewriter effect, so the retro aesthetic and the RAG feature reinforce
 * each other rather than competing.
 */

export function Terminal({
  children,
  label,
  className = "",
}: {
  children: ReactNode;
  /** Accessible name, e.g. "Intro" or "Ask about my CV". */
  label: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`border border-border bg-surface rounded-[var(--radius)] p-[var(--space-4)] font-mono text-[var(--text-sm)] leading-[var(--leading-relaxed)] ${className}`}
    >
      {children}
    </div>
  );
}

/** A single prompt line. The `>` is decorative and hidden from screen readers. */
export function TerminalLine({
  prompt = false,
  children,
}: {
  prompt?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-[var(--space-2)]">
      {prompt ? (
        <span aria-hidden="true" className="shrink-0 text-accent">
          &gt;
        </span>
      ) : null}
      <span className="min-w-0">{children}</span>
    </div>
  );
}
