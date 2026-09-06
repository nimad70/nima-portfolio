import Link from "next/link";
import type { Metadata } from "next";
import { getAllProjects } from "@/content/projects";
import { Panel, MetaLine, Tag, Divider } from "@/ui/primitives";
import type { ProjectStatus } from "@/content/schema";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "AI and machine learning projects — RAG systems, LLM fine-tuning, computer vision and applied ML.",
};

const statusLabel: Record<ProjectStatus, string> = {
  shipped: "shipped",
  "in-progress": "in progress",
  research: "research",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="flex flex-col gap-[var(--space-5)]">
      <header className="flex flex-col gap-[var(--space-2)]">
        <h1 className="text-[var(--text-3xl)]">Projects</h1>
        <p className="max-w-[var(--measure)] text-fg-muted">
          {projects.length} projects, newest first. Each has a full write-up —
          what the problem was, what I did, what the numbers actually mean, and
          where it falls short.
        </p>
      </header>

      <Divider label="All" />

      {/*
        Invariant 1: descriptions render unconditionally. The old site hid them
        behind :hover, so every touch device showed five bare titles and no
        content at all.
      */}
      <div className="flex flex-col gap-[var(--space-4)]">
        {projects.map(({ meta }) => (
          <Panel
            key={meta.slug}
            as="article"
            title={meta.title}
            meta={
              <>
                {meta.featured ? (
                  <span className="mr-[var(--space-2)] text-accent">
                    featured
                  </span>
                ) : null}
                {meta.year}
              </>
            }
          >
            <div className="flex flex-col gap-[var(--space-3)]">
              <p className="max-w-[var(--measure)] text-fg-muted">
                {meta.summary}
              </p>

              {meta.results.length > 0 ? (
                <ul className="flex list-disc flex-col gap-[var(--space-1)] pl-[var(--space-5)] text-[var(--text-sm)]">
                  {meta.results.map((r) => (
                    <li key={r} className="max-w-[var(--measure)]">
                      {r}
                    </li>
                  ))}
                </ul>
              ) : null}

              <MetaLine
                items={[
                  <Tag key="status" variant="accent">
                    {statusLabel[meta.status]}
                  </Tag>,
                  ...meta.tech.slice(0, 5).map((t) => <Tag key={t}>{t}</Tag>),
                  meta.tech.length > 5 ? (
                    <span key="more">+{meta.tech.length - 5} more</span>
                  ) : null,
                ]}
              />

              <MetaLine
                items={[
                  <Link key="read" href={`/projects/${meta.slug}/`}>
                    Read the write-up
                  </Link>,
                  meta.repo ? (
                    <a key="repo" href={meta.repo}>
                      Source
                    </a>
                  ) : null,
                  meta.demo ? (
                    <a key="demo" href={meta.demo}>
                      Demo
                    </a>
                  ) : null,
                ]}
              />
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
