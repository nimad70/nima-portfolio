import { z } from "zod";

/**
 * Content schemas.
 *
 * Content is data, not markup (docs/ARCHITECTURE.md ADR-002). Every MDX file
 * in content/ exports a `metadata` object validated against one of these.
 * Invalid metadata throws during the build rather than shipping a broken page.
 *
 * One source feeds the page, the index, the sitemap, the OG image and — from
 * Phase 5 — the RAG corpus. The old site's failure was the opposite: content
 * welded into HTML, so adding a project meant hand-editing <li> elements.
 */

const slug = z
  .string()
  .min(1)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "slug must be lowercase kebab-case (it becomes the URL)",
  );

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be ISO YYYY-MM-DD");

export const projectStatus = z.enum(["shipped", "in-progress", "research"]);
export type ProjectStatus = z.infer<typeof projectStatus>;

export const projectSchema = z.object({
  slug,
  title: z.string().min(1),
  /** One sentence. Used on the index, in meta description and OG. */
  summary: z.string().min(1).max(200),
  /** Sort key and the year shown in the meta line. */
  year: z.number().int().min(2000).max(2100),
  status: projectStatus,
  /** Surfaced first on the home page and index. */
  featured: z.boolean().default(false),
  /** Rendered as [bracket] tags. Order is meaningful — most relevant first. */
  tech: z.array(z.string().min(1)).min(1),
  repo: z.url().optional(),
  demo: z.url().optional(),
  /** Concrete outcomes. Claims here should be defensible in an interview. */
  results: z.array(z.string().min(1)).default([]),
});

export type Project = z.infer<typeof projectSchema>;

export const postSchema = z.object({
  slug,
  title: z.string().min(1),
  summary: z.string().min(1).max(200),
  date: isoDate,
  tags: z.array(z.string().min(1)).default([]),
  /** Excluded from the index and the sitemap while true. */
  draft: z.boolean().default(false),
});

export type Post = z.infer<typeof postSchema>;

export const roleSchema = z.object({
  title: z.string().min(1),
  organisation: z.string().min(1),
  location: z.string().min(1),
  /** Free text rather than a date: "Oct 2023" and "present" both occur. */
  start: z.string().min(1),
  end: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
});

export type Role = z.infer<typeof roleSchema>;

export const educationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  location: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
  detail: z.array(z.string().min(1)).default([]),
});

export type Education = z.infer<typeof educationSchema>;

export const skillGroupSchema = z.object({
  heading: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

export type SkillGroup = z.infer<typeof skillGroupSchema>;

/**
 * Validate with a message that names the offending file. A Zod error alone
 * says a field is wrong but not which of thirty content files it came from.
 */
export function parseContent<T extends z.ZodType>(
  schema: T,
  value: unknown,
  source: string,
): z.infer<T> {
  const result = schema.safeParse(value);

  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid content in ${source}:\n${issues}`);
  }

  return result.data;
}
