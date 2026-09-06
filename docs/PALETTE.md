# Palette reference

Every candidate considered for the site, with verified contrast, so changing
the palette later is a lookup rather than a redesign.

**Currently in use: E — Web-safe.** Chosen 2026-09-06.

Values live in `src/styles/tokens.css`. Nothing else in the codebase may
hardcode a colour.

---

## Constraints any candidate must meet

These came out of the design brief and the review, and are why most obvious
options were rejected:

1. **Muted only.** No neon, bright, loud or garish accents. Nima's words.
2. **Warm/cool coherence with the light theme.** The light theme is warm paper.
   A cool dark theme makes the two read as different sites rather than one site
   at different times of day. This was the main fault of the inherited navy.
3. **Paired accents in one hue family.** Each palette defines a dark accent and
   a light accent that are the same colour at different lightness, so the
   identity survives the theme switch. A single accent cannot serve both — the
   dark cyan `#64ffda` is illegible on a light ground.
4. **WCAG AA everywhere.** Every foreground value ≥ 4.5:1 against its own
   background, checked against `--surface` (the harder case) not just `--bg`.
5. **Evocative of the era, not a costume.** The design direction is *modern
   engineering, 2004 information architecture*. Colour should read period
   without tipping into pastiche.

---

## Verified contrast

All ratios against that palette's own `--surface`; light accent against the
light `--surface` `#fffdf8`. All pass AA.

| id | text | muted | faint | accent | light accent |
|----|------|-------|-------|--------|--------------|
| A  | 11.66 | 5.57 | 4.56 | 6.57 | 6.24 |
| B  | 12.15 | 5.65 | 4.56 | 4.78 | 7.07 |
| C  | 12.20 | 6.19 | 4.99 | 7.12 | 6.85 |
| D  | 11.60 | 6.04 | 4.93 | 7.04 | 7.08 |
| **E** | **9.96** | **5.52** | **4.62** | **5.17** | **5.90** |

E has the lowest ratios of the five and still clears AA comfortably. That is a
consequence of using genuine period values rather than tuning for contrast.

---

## Candidates

### A — Sepia & brass

Warm near-black with antique brass. An old print shop. The quietest of the warm
options, and the least likely to date.

```
--bg              #17140e      --accent          #c09a63
--surface         #1f1b14      --accent-hover    #d3b17f
--surface-raised  #2a251c      light accent      #7a5a22
--border          #383125      light hover       #5d4419
--text            #ded4c0
--text-muted      #9c927e
--text-faint      #8d836b
```

*Not chosen:* "old" in a print/Victorian sense rather than a web sense. Brass
accents were never part of 1990s web design.

### B — Oxblood & parchment

Warm ink with muted oxblood. Bookbinding rather than terminal; the most
editorial of the set.

```
--bg              #15120f      --accent          #c1705f
--surface         #1d1915      --accent-hover    #d4897a
--surface-raised  #27221d      light accent      #8f3f30
--border          #352f28      light hover       #712f23
--text            #e0d6c6
--text-muted      #9c9182
--text-faint      #8b8171
```

*Not chosen:* same reason as A, and the clay accent is the most saturated of
the muted set.

### C — Bottle green & cream

Dark bottle green with sage. A leather-bound library. Old without being a
terminal pastiche.

```
--bg              #0f1310      --accent          #8fae87
--surface         #161b17      --accent-hover    #a8c4a0
--surface-raised  #1f2620      light accent      #3f6238
--border          #2c342d      light hover       #2f4a2a
--text            #dbd8c9
--text-muted      #969c8f
--text-faint      #858b80
```

*Not chosen:* strong candidate on legibility (best ratios of the five), but
green risks reading as phosphor-terminal costume.

### D — Ink & dusty blue

Cool ink with faded indigo. Old technical drawings and blueprints. The most
restrained overall.

```
--bg              #13151a      --accent          #94aabf
--surface         #1a1d23      --accent-hover    #aec1d3
--surface-raised  #24282f      light accent      #3d5a75
--border          #31363e      light hover       #2d445a
--text            #d8d6ce
--text-muted      #969ba3
--text-faint      #868b93
```

*Not chosen:* the runner-up, and the safest fallback. Its slightly warm-tinted
greys bridge to the warm light theme more smoothly than E's neutral greys. It
*evokes* the era where E *is* the era. **If E's neutral/warm tension ever
grates, switch to D.**

### E — Web-safe *(current)*

Built from the era's real values rather than an impression of them.

```
--bg              #1a1a1a      --accent          #6699cc   (web-safe)
--surface         #242424      --accent-hover    #99ccff   (web-safe)
--surface-raised  #303030      light accent      #336699   (web-safe)
--border          #3d3d3d      light hover       #003366   (web-safe)
--border-strong   #565656
--text            #cfcfcf
--text-muted      #9a9a9a
--text-faint      #8c8c8c
--selection       #2b4157
```

**Why these exact values:**

- `#6699cc`, `#99ccff`, `#336699`, `#003366` are all members of the 216-colour
  **web-safe cube** (channels restricted to `00/33/66/99/CC/FF`) that 8-bit
  displays forced on 1990s web design. Everyone drew from the same 216 swatches,
  which is why sites of that era share a look.
- Blue-grey was the dominant "serious website" scheme: `#003366`, `#336699`,
  `#6699CC`, `#CCCCCC`.
- Blue was the web's native accent — default link `#0000EE`, visited `#551A8B`,
  Netscape's default page grey `#C0C0C0`.
- `#1a1a1a` / `#cfcfcf` are **MuggleNet's own 2004 palette**, read directly off
  the archived page that seeded this design direction: `bgcolor="black"` /
  `#272727` ground, `#cfcfcf` text, `#575757` secondary.

**Side effect worth knowing:** web-safe values minify to three-digit hex,
because every channel is a doubled digit. The accent ships as `#69c`, the light
accent as `#369`. The palette is smaller on the wire *because* it is
period-accurate.

---

## The shared light theme

Every candidate reuses this; only the accent changes. Warm paper, not clinical
white — a page under a desk lamp rather than an inverted dark theme.

```
--bg              #f4f1ea
--surface         #fffdf8
--surface-raised  #ebe6db
--border          #d8d1c2
--border-strong   #b9b09c
--text            #1a2028
--text-muted      #57616f   6.18:1
--text-faint      #6b7582   4.60:1
```

`--text-faint` was `#7d8794` at 3.58:1 and failed AA for the small metadata it
carries. Fixed 2026-09-06.

---

## Rejected outright

Kept here so they are not proposed again.

| Palette | Accent | Why rejected |
|---|---|---|
| Navy & cyan *(original site)* | `#64ffda` | Cool against a warm light theme; the most over-used scheme in developer portfolios. Also used interchangeably with `#52e0c4`, with no system behind either. |
| Amber CRT | `#ffb454` | Too bright/loud. |
| Green phosphor | `#6ee787` | Neon, and the strongest pull toward terminal costume. |
| Graphite & lime | `#a3e635` | Lime is neon; the palette is also the least period-appropriate. |

---

## How to change the palette

1. Edit the `--d-*` block at the top of `src/styles/tokens.css` for dark, and
   the `--accent` / `--accent-hover` pair in `:root` for light.
2. The dark hexes are defined **once** under `--d-*`; the
   `prefers-color-scheme` block and the `[data-theme="dark"]` override both
   remap to them. Do not inline hexes into either block — that duplication is
   exactly what this structure prevents.
3. Re-verify AA. Ratios in this document were produced with the relative
   luminance formula from WCAG 2.1, checked against `--surface`.
4. Update the "Currently in use" line at the top of this file.
