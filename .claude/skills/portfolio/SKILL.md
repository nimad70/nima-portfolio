---
name: portfolio
description: Conventions, architecture and workflow for the nimadaryabar.com portfolio. Load when working anywhere in this repo - building pages or UI primitives, authoring MDX content, touching the Cloudflare Worker or RAG chat, changing DNS or deploys, or opening branches and PRs.
---

# nimadaryabar.com

Nima Daryabar's portfolio. Its job is getting him hired as an AI/ML engineer, so
every decision is judged against "does a recruiter or an engineer reading this
come away impressed". The repo is itself a code sample.

## Read first

- `docs/ARCHITECTURE.md` — ADRs and the dependency rule. Read before structural changes.
- `docs/DESIGN.md` — the visual direction and its non-negotiables.
- `docs/CONTRIBUTING.md` — branch flow, commit convention, CI gates.
- `docs/DNS-RESTORE.md` — domain/hosting runbook.

## Hard rules

**Never commit to `main`.** Branch off `dev`, PR back into `dev`. `dev` merges to
`main` only when green. Branch prefixes: `feat/` `fix/` `chore/` `docs/`.

**Seven invariants**, each enforced by a test, each existing because the
pre-rebuild site violated it:

1. No hover-only content — readable without a pointer
2. Every route renders meaningfully with JavaScript disabled
3. Full keyboard operability; correct `aria-expanded` on disclosure controls
4. Exactly one `<h1>` per page
5. `box-sizing: border-box` globally
6. `prefers-reduced-motion` honoured by every animation
7. No hardcoded colour outside `src/styles/tokens.css`

Breaking one of these is a regression, not a trade-off.

## Architecture in one line

Static-first: Next.js `output: 'export'` → static assets on one Cloudflare Worker;
the Worker script runs **only** for `/api/*`. No SSR, no adapter dependency.

**Dependency rule:** `app/` → `ui/` → `content/` → `domain/`. Never the reverse.
`domain/` imports nothing from the framework.

Server components by default. Only four client islands exist — `ThemeToggle`,
`ChatWidget`, `BootSequence`, `MobileRail`. Adding a fifth needs justification.

The Worker depends on **ports**, never on Cloudflare types directly
(`AiProvider`, `VectorStore`, `Mailer`, `Counter`), with `adapters/fake/` for tests.

## Content

Content is data, never markup. Projects and posts are MDX in `content/` with
Zod-validated frontmatter; invalid frontmatter fails the build. Adding a project
means authoring a file, not editing a component. The same content feeds the page,
the RAG corpus, the sitemap and the OG images.

## Design

*Modern engineering, 2004 information architecture.* Retro in structure and
typography — boxed panels with title bars, a persistent index rail, `[bracket]`
conventions, byline/metadata lines, a status bar, monospace, real information
density. Modern in behaviour — responsive, 15–16px minimum body text, real focus
states, WCAG AA, reduced-motion support.

Retro is never an excuse for a worse experience. If a retro cue costs
accessibility or legibility, drop the cue.

Compose pages from the primitives: `Panel` `PanelHeader` `Rail` `StatusBar`
`MetaLine` `Tag` `Divider` `Terminal`. Do not write one-off CSS where a primitive
fits — that is how the old 850-line stylesheet happened.

## Testing

Proportionate and defect-anchored. Vitest for unit and component, Playwright for
E2E, axe for accessibility as a gate. **Not done:** markup snapshots, coverage
thresholds, unit tests of React rendering.

When fixing a bug, add the regression test in the same PR.

## Cost ceiling

Everything runs on Cloudflare's free tier. Workers AI free models only
(GLM-4.7-Flash, Nemotron-3-120B — Kimi K2.6/K2.7 Code and GLM-5.2 went paid-only
on 2026-07-28). Vectorize free tier is 5M stored / 30M queried dimensions per
month; this corpus needs a few hundred vectors. Rate-limit the chat endpoint and
keep a daily request ceiling against the 10k Neurons/day allowance.

Before adding a paid dependency, say so explicitly and get a decision.

## Deferred

The dark-mode easter egg (a Batman-ish figure flips the light back on, ~3 times,
escalating, then leaves) is parked. The theme toggle **emits a subscribable event**
specifically so this can attach later without a refactor — do not replace it with
an inline class flip.
