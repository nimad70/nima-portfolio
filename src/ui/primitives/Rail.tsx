import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The persistent left index — 2004's best structural idea.
 *
 * MuggleNet's rail carried ~80 links grouped into labelled sections, acting
 * as a table of contents for the whole site. That density is a genuine
 * advantage: a recruiter sees everything available immediately instead of
 * scrolling to discover it.
 *
 * Renders as a plain <nav> list, so it works with CSS disabled and is fully
 * traversable by keyboard. Layout handles the responsive collapse; this
 * component stays presentation-light on purpose.
 */

export type RailLink = {
  href: string;
  label: string;
  /** Optional trailing annotation, e.g. a count or [new]. */
  meta?: ReactNode;
};

export type RailSection = {
  heading: string;
  links: RailLink[];
};

export function Rail({
  sections,
  currentPath,
}: {
  sections: RailSection[];
  currentPath?: string;
}) {
  return (
    <nav aria-label="Site index" className="flex flex-col gap-[var(--space-5)]">
      {sections.map((section) => (
        <div key={section.heading}>
          <h2 className="mb-[var(--space-2)] border-b border-border pb-[var(--space-1)] font-mono text-[var(--text-xs)] uppercase tracking-[var(--tracking-caps)] text-fg-faint">
            {section.heading}
          </h2>

          <ul className="flex flex-col gap-[var(--space-1)]">
            {section.links.map((link) => {
              const isCurrent = currentPath === link.href;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`flex items-baseline justify-between gap-[var(--space-2)] font-mono text-[var(--text-sm)] no-underline hover:underline ${
                      isCurrent ? "text-accent" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    <span>
                      {isCurrent ? (
                        <span aria-hidden="true" className="mr-[var(--space-1)]">
                          &gt;
                        </span>
                      ) : null}
                      {link.label}
                    </span>
                    {link.meta ? (
                      <span className="text-[var(--text-xs)] text-fg-faint">
                        {link.meta}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
