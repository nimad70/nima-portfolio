import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, projectSlugs } from "@/content/projects";
import { MetaLine, Tag, Divider } from "@/ui/primitives";
import type { ProjectStatus } from "@/content/schema";

const statusLabel: Record<ProjectStatus, string> = {
  shipped: "shipped",
  "in-progress": "in progress",
  research: "research",
};

/** Enumerates every project at build time — required under `output: export`. */
export function generateStaticParams() {
  return projectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProject(slug);
  if (!project) return {};

  return {
    title: project.meta.title,
    description: project.meta.summary,
    openGraph: {
      title: project.meta.title,
      description: project.meta.summary,
      type: "article",
    },
  };
}

export default async function ProjectPage(
  props: PageProps<"/projects/[slug]">,
) {
  // params is a Promise in Next 16.
  const { slug } = await props.params;
  const project = await getProject(slug);

  if (!project) notFound();

  const { meta, Body } = project;

  return (
    <article className="flex flex-col gap-[var(--space-4)]">
      <header className="flex flex-col gap-[var(--space-3)]">
        {/* Invariant 4: exactly one h1 per page. */}
        <h1 className="text-[var(--text-3xl)]">{meta.title}</h1>

        <p className="max-w-[var(--measure)] text-[var(--text-lg)] text-fg-muted">
          {meta.summary}
        </p>

        <MetaLine
          items={[
            String(meta.year),
            <Tag key="status" variant="accent">
              {statusLabel[meta.status]}
            </Tag>,
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

        <MetaLine items={meta.tech.map((t) => <Tag key={t}>{t}</Tag>)} />
      </header>

      <Divider />

      <div className="text-[var(--text-base)]">
        <Body />
      </div>

      <Divider />

      <MetaLine
        items={[
          <Link key="back" href="/projects/">
            ← All projects
          </Link>,
        ]}
      />
    </article>
  );
}
