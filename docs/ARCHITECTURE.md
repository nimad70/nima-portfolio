# Architecture

This repo is itself a code sample — a technical reader will judge the structure,
not just the rendered page. Decisions here are made on merit and the rationale is
recorded, including the options rejected.

## ADR-001: Static-first, not SSR

**Status:** accepted · 2026-08-30

### Context

Every page's content is known at build time: projects, blog posts, about, CV.
Exactly three things are dynamic — contact form submission, chat streaming, and a
visitor counter.

### Decision

Next.js App Router with `output: 'export'`, producing static assets, deployed on a
single Cloudflare Worker with Static Assets. The Worker script runs **only** for
`/api/*` via `run_worker_first`.

```
Next.js (output: 'export')  →  static assets
                                ├─ served by Cloudflare's asset layer
                                │  (Worker never invoked → billed as free)
                                └─ Worker runs only for /api/*
```

### Rationale

Running a Node SSR runtime to serve pre-known content buys nothing and costs a
rendering runtime, cold starts, build fragility, and a hard dependency on a
Next-on-Cloudflare adapter. That adapter layer is actively churning — `vinext`
recently displaced `@opennextjs/cloudflare` as Cloudflare's recommendation. A
portfolio should not be coupled to that.

Static export sidesteps adapters entirely while keeping App Router, build-time
React Server Components, MDX, and the framework recognition that matters on a CV.

### Consequences

- One deployable, one origin, no CORS
- The API surface is a plain `fetch` handler — trivially testable
- **Rejected:** ISR, request-time SSR, middleware. None are needed here.
- `next/image` optimization is unavailable under `output: 'export'`; images are
  pre-optimized with `sharp` at build time and served with explicit `srcset`

### Options rejected

| Option | Why not |
|---|---|
| Next.js SSR via `vinext` / OpenNext | Adapter churn; SSR unused by this content |
| Astro | Genuinely well-suited, but Next.js carries more weight on an AI/SWE CV |
| Plain GitHub Pages (status quo) | No server at all → no contact endpoint, no chatbot |

---

## ADR-002: Content is data, not markup

**Status:** accepted · 2026-08-30

### Context

The current site's central failure is content welded into HTML. Adding a project
means hand-editing `<li>` elements. Nothing is reusable, validated, or queryable —
and the same content is needed in three places: the page, the RAG corpus, and the
sitemap.

### Decision

All content lives in `content/` as MDX with Zod-validated frontmatter. `src/content/`
exposes typed loaders. **Invalid frontmatter fails the build.**

```
content/
  projects/*.mdx    one case study per project
  posts/*.mdx       blog
  cv/*.md           also the RAG corpus source
```

### Consequences

- One source feeds the page, the chatbot corpus, the sitemap and the OG images
- Adding a project is authoring a file, not editing components
- Content errors surface in CI, not in production

---

## ADR-003: Ports and adapters in the Worker

**Status:** accepted · 2026-08-30

### Context

The chat endpoint depends on Workers AI and Vectorize. Tested naively, that means
either hitting real Cloudflare services in CI or not testing the retrieval logic
at all.

### Decision

The Worker depends on interfaces, never on Cloudflare types directly.

```
worker/ports/       AiProvider · VectorStore · Mailer · Counter
worker/adapters/cloudflare/   WorkersAi · Vectorize · KV
worker/adapters/fake/         in-memory doubles used by tests
```

### Rationale

Roughly 50 lines of interfaces. It buys fully offline unit tests of chunking,
ranking and grounding, and it makes the planned model upgrade — free-tier Workers
AI now, a frontier model once real traffic justifies it — a single adapter file
plus a secret, with no call-site changes.

This is proportionate, not ceremony. The alternative is untestable AI code, which
is the exact opposite of what this portfolio is meant to demonstrate.

---

## ADR-004: Server components by default, client islands by exception

**Status:** accepted · 2026-08-30

### Decision

Everything renders on the server at build time and ships zero JavaScript, except
four genuine interaction points, which are explicit client components:

`ThemeToggle` · `ChatWidget` · `BootSequence` · `MobileRail`

### Rationale

This is enforced by a hard requirement carried from the review: **every page must
render meaningful content with JavaScript disabled.** The current site fails this
absolutely — a full-viewport loader at `z-index: 9999` is removed only by JS, so
any JS failure yields a blank navy screen.

An E2E test asserts the no-JS render on every route.

---

## Layering

```
content/                 authored source of truth
src/
  content/               Zod schemas + typed loaders
  domain/                pure logic: chunking, ranking, formatting. No I/O.
  ui/primitives/         Panel · PanelHeader · Rail · StatusBar · MetaLine · Tag · Divider · Terminal
  ui/features/           the four client islands
  app/                   routes; thin, composition only
  styles/tokens.css      single source of truth for colour, space, type
worker/                  see ADR-003
scripts/                 ingest.ts · optimize-images.ts
tests/                   unit/ · component/ · e2e/
```

**Dependency rule:** `app/` → `ui/` → `content/` → `domain/`. Never the reverse.
`domain/` imports nothing from the framework, which is what keeps it fast to test.

## Invariants

Non-negotiable, each enforced by a test. Every one exists because the current site
violates it:

1. No hover-only content — descriptions must be readable without a pointer
2. Every route renders meaningfully with JavaScript disabled
3. Full keyboard operability, correct `aria-expanded` on disclosure controls
4. Exactly one `<h1>` per page
5. `box-sizing: border-box` globally
6. `prefers-reduced-motion` honoured by every animation
7. No hardcoded colour outside `tokens.css`
