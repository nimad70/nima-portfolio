import type { ComponentType } from "react";
import { parseContent, projectSchema, type Project } from "./schema";

/**
 * Project loader.
 *
 * Every file in content/projects/ is registered here. The registry is explicit
 * rather than filesystem-globbed: `output: "export"` resolves every import at
 * build time, and a static map keeps the bundler able to trace each module.
 * A missing entry is caught by the index test rather than silently dropping a
 * project from the site.
 */

type ProjectModule = {
  metadata: unknown;
  default: ComponentType;
};

const modules: Record<string, () => Promise<ProjectModule>> = {
  "llm-vulnerabilities-in-rag": () =>
    import("@content/projects/llm-vulnerabilities-in-rag.mdx"),
  "emotion-aware-chatbot": () =>
    import("@content/projects/emotion-aware-chatbot.mdx"),
  "mistral-qa-optimisation": () =>
    import("@content/projects/mistral-qa-optimisation.mdx"),
  "diabetic-retinopathy-detection": () =>
    import("@content/projects/diabetic-retinopathy-detection.mdx"),
  "surge-pricing-predictor": () =>
    import("@content/projects/surge-pricing-predictor.mdx"),
};

export type LoadedProject = {
  meta: Project;
  Body: ComponentType;
};

export function projectSlugs(): string[] {
  return Object.keys(modules);
}

export async function getProject(slug: string): Promise<LoadedProject | null> {
  const load = modules[slug];
  if (!load) return null;

  const mod = await load();
  return {
    meta: parseContent(
      projectSchema,
      mod.metadata,
      `content/projects/${slug}.mdx`,
    ),
    Body: mod.default,
  };
}

/** All projects, newest first, featured ahead of the rest. */
export async function getAllProjects(): Promise<LoadedProject[]> {
  const loaded = await Promise.all(projectSlugs().map(getProject));
  const projects = loaded.filter((p): p is LoadedProject => p !== null);

  return projects.sort((a, b) => {
    if (a.meta.featured !== b.meta.featured) return a.meta.featured ? -1 : 1;
    return b.meta.year - a.meta.year;
  });
}
