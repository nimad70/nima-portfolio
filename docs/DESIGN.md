# Design Direction

## Thesis

> **Modern engineering, 2004 information architecture.**

Borrow the *structure and density* of the early-2000s web. Implement it with
modern craft. Every retro cue is a deliberate design decision, never an excuse
for a worse experience.

## Why this direction

1. **Differentiation.** Nearly every AI-engineer portfolio is the same page: dark
   background, Inter, gradient blobs, a three-column "Featured Projects" grid,
   endless whitespace. A terminal/BBS/2004-web aesthetic executed with real
   polish is memorable in a way that grid is not.
2. **Continuity.** The current hero is already a terminal (`> whoami`,
   `> mission`). This direction is not a costume bolted on — it is the thing the
   site is already reaching for, done properly.
3. **Convergence with the product.** Streaming LLM tokens *are* a typewriter
   effect. The retro aesthetic and the headline AI feature reinforce each other
   rather than competing for attention.
4. **Density is a real advantage.** A recruiter spends well under a minute on the
   page. Retro density puts the evidence in front of them immediately, instead
   of six scroll-lengths of whitespace to deliver three facts.

## Reference, analysed

`web.archive.org/web/20041230000933/https://mugglenet.com/` — what is literally on it:

- Fixed ~775px centered column, non-responsive
- `bgcolor="black"` / `#272727`, text `#cfcfcf`, white on headers — **already dark**
- Verdana at `size="1"` / `size="2"` and inline 9–11px
- Left rail: ~80 links grouped into image-headed sections (Books, Movies, Games,
  Fans, Info, Media, Misc) — a table of contents for the entire site
- Homepage is a reverse-chronological news feed; every item closes with a
  metadata line: `Posted by Emerson on 12/28 | comments [479] | send to friend`
- 468×60 banner slot; `border="0"` layout tables with 3–10px spacer cells

## Adopt / Reject

### Adopt — the retro traits that are genuinely good

| Trait | Modern implementation |
|---|---|
| Fixed-width centered column | `max-width: ~1100px`, responsive — restraint, not full-bleed |
| Boxed panels with title bars | The core primitive. A `Panel` with a header strip. |
| Persistent left index rail | Site-wide nav listing every project and section; collapses to a sheet on mobile |
| High information density | Real content above the fold, minimal decorative whitespace |
| Byline / metadata lines | `posted 2026-08-30 · 6 min · [rag] [evals]` under posts and projects |
| `[bracket]` conventions | Tags, statuses, counts — `[featured]`, `[in progress]`, `[432]` |
| Monospace display type | Headings, nav, metadata, chat |
| Bright underlined links | Links look like links; visited state actually differs |
| Status bar | Fixed footer strip: build hash, theme, visitor count |
| Visitor counter | A real one backed by Cloudflare KV. Retro *and* honest. |
| `<hr>` dividers, ASCII art | Section breaks, the 404 page, the boot sequence |

### Reject — the retro traits that were just bad

| Trait | Why |
|---|---|
| Layout tables | Accessibility disaster; unusable with a screen reader |
| Fixed non-responsive width | Roughly half of traffic is mobile |
| 9–11px body text | Illegible; fails WCAG |
| Tiled background textures | Destroys contrast and legibility |
| `<marquee>`, `<blink>`, autoplay audio | Actively hostile |
| Animated-GIF clutter, "Best viewed in" badges | Costume, not design |
| Frames | Breaks linking, history, and search |

The rule: **retro in structure and typography, modern in behaviour and access.**

## System

### Type
- **Display / UI / metadata:** a monospace with real personality
  (JetBrains Mono, Berkeley Mono, or IBM Plex Mono)
- **Body / long-form prose:** a readable sans or serif — do not set case studies
  and blog posts in monospace, it hurts reading speed at length
- Body minimum **15–16px**. Density comes from tight line-height and small
  margins, never from shrinking text below legibility.
- Load only the weights actually used. The current site loads Poppins 300/600
  then asks for `bold` (700), so browsers synthesise a fake bold.

### Colour

**See `docs/PALETTE.md`** for every candidate considered, full token values,
verified contrast ratios, and how to change palettes.

- Full token set as CSS custom properties. No hardcoded hex in components — the
  old stylesheet had hundreds, plus two interchangeable accents (`#64ffda`,
  `#52e0c4`) used at random.
- **Dark and light both first-class.** Light is warm paper, not clinical white.
  Dark is period-accurate Web 1.0 greys.
- The accent is `#6699cc` dark / `#336699` light — genuine values from the
  216-colour web-safe cube that defined 1990s web design. The dark greys are
  MuggleNet's own 2004 palette, read off the archived reference page.
- The inherited navy/cyan was dropped: cool against a warm light theme, so the
  two read as different sites, and the most over-used scheme in developer
  portfolios.
- `prefers-color-scheme` for the default, an explicit toggle to override,
  persisted in `localStorage`.
- Every pairing verified against WCAG AA before it ships.

### Motion
Fun, but cheap and interruptible.

- **Boot sequence** on first visit: a short terminal-style startup, **~1.5s**,
  skippable by any keypress or click, shown once per session via
  `sessionStorage`. The current typewriter takes roughly **9 seconds** before the
  CTA finishes — that is the single worst interaction on the site today.
- Cursor blink, tactile 1px "pressed" hover on panels and buttons, panels that
  expand like old collapsible boxes.
- Optional **CRT scanline / flicker** overlay, off by default, toggleable from
  the status bar. A gimmick the visitor opts into is charming; one forced on them
  is not.
- **`prefers-reduced-motion` is honoured everywhere.** Currently honoured nowhere.
- No perpetual animation. The present `.btn-primary:hover` runs
  `pulseBtn 1.2s infinite` — permanent motion under the cursor.

### Layout primitives
`Panel` · `PanelHeader` · `Rail` (index sidebar) · `StatusBar` · `MetaLine` ·
`Tag` · `Divider` · `Terminal` (shared by the boot sequence and the chatbot)

Build these first; compose every page from them. This is what stops the CSS
turning back into 850 unstructured lines.

## Non-negotiables

Carried directly from the review — these are the bugs the redesign must not reproduce:

1. **No hover-only content, ever.** Project descriptions are currently
   `display:none` until `:hover`, so every phone visitor sees five bare titles
   and zero content.
2. **The page must render without JavaScript.** The current full-viewport
   `.loader` at `z-index:9999` is only removed by JS, so a JS failure leaves a
   blank navy screen.
3. **Keyboard parity.** The hamburger is a `<div>` today — no focus, no
   `aria-expanded`, no keyboard access at all.
4. **One `<h1>` per page.** `index.html` currently has none; the hero is `<span>`s.
5. **`box-sizing: border-box` globally.** Its absence is why the last three
   commits are all form-width patches.

## Deferred: the dark-mode easter egg

Nima's idea, explicitly parked for later:

> Switching to dark mode opens a secret door; a Batman-ish figure walks out and
> flips the light switch back on. Happens ~3 times, escalating, then he says
> something and leaves for good.

It suits this world — a site with a visitor counter and a status bar has earned a
gag. Constraints for whenever it is built:

- Never blocks input; the theme change still applies immediately underneath
- Suppressed entirely under `prefers-reduced-motion`
- Counter in `localStorage`; after the final appearance it never fires again
- Pure CSS/SVG animation, lazy-loaded, zero cost on first paint

**Phase 1 requirement:** the theme toggle must emit a subscribable event rather
than flipping a class inline, so this can be attached later with no refactor.
