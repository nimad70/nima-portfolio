import type { MDXComponents } from "mdx/types";

/**
 * Global MDX component mapping. Required by @next/mdx in the App Router —
 * it will not work without this file.
 *
 * Content prose renders through the site's own primitives so an MDX case
 * study looks identical to a hand-built page, and so no content file needs
 * to know about styling.
 */
const components: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-[var(--space-6)] text-[var(--text-2xl)]" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-[var(--space-5)] text-[var(--text-xl)]" {...props} />
  ),
  p: (props) => (
    <p
      className="mt-[var(--space-3)] max-w-[var(--measure)] leading-[var(--leading-relaxed)]"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="mt-[var(--space-3)] flex list-disc flex-col gap-[var(--space-2)] pl-[var(--space-5)]"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-[var(--space-3)] flex list-decimal flex-col gap-[var(--space-2)] pl-[var(--space-5)]"
      {...props}
    />
  ),
  li: (props) => <li className="max-w-[var(--measure)]" {...props} />,
  code: (props) => (
    <code
      className="rounded-[var(--radius)] border border-border bg-surface-raised px-[var(--space-1)]"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mt-[var(--space-4)] overflow-x-auto rounded-[var(--radius)] border border-border bg-surface p-[var(--space-4)]"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="mt-[var(--space-4)] border-l-2 border-accent pl-[var(--space-4)] text-fg-muted"
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
