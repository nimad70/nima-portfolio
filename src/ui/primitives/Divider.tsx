/**
 * Section break. The 2004 <hr>, with a modern implementation:
 * a real separator role rather than a styled empty element.
 */
export function Divider({ label }: { label?: string }) {
  if (!label) {
    return <hr className="my-[var(--space-5)] border-0 border-t border-border" />;
  }

  return (
    <div
      className="my-[var(--space-5)] flex items-center gap-[var(--space-3)]"
      role="separator"
      aria-label={label}
    >
      <span className="font-mono text-[var(--text-xs)] uppercase tracking-[var(--tracking-caps)] text-fg-faint">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );
}
