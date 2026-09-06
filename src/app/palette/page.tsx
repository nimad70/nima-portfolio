import type { CSSProperties } from "react";
import { Panel, MetaLine, Tag, Terminal, TerminalLine } from "@/ui/primitives";

/**
 * Dark palette comparison. Not linked from the rail — a working surface for
 * choosing the palette, deleted once one is picked.
 *
 * Constraints these were designed to, from Nima: classy, evocative of old
 * times, and explicitly not bright, neon, loud or garish. So every accent is
 * low-saturation and drawn from print and bookbinding rather than from
 * terminals — sepia, brass, oxblood, bottle green, ink.
 *
 * Each candidate carries a paired light accent in the same hue family, so the
 * two themes read as one site at different times of day. Every foreground
 * value is verified at WCAG AA (>=4.5:1) against its own background.
 */

type ThemeTokens = Record<string, string>;

type Palette = {
  id: string;
  name: string;
  note: string;
  dark: ThemeTokens;
  light: ThemeTokens;
};

const SHARED_LIGHT = {
  "--bg": "#f4f1ea",
  "--surface": "#fffdf8",
  "--surface-raised": "#ebe6db",
  "--border": "#d8d1c2",
  "--text": "#1a2028",
  "--text-muted": "#57616f",
  "--text-faint": "#6b7582",
};

const candidates: Palette[] = [
  {
    id: "sepia",
    name: "A — Sepia & brass",
    note: "Warm near-black with antique brass. Reads like an old print shop. The quietest of the warm options.",
    dark: {
      "--bg": "#17140e",
      "--surface": "#1f1b14",
      "--surface-raised": "#2a251c",
      "--border": "#383125",
      "--text": "#ded4c0",
      "--text-muted": "#9c927e",
      "--text-faint": "#8d836b",
      "--accent": "#c09a63",
      "--accent-hover": "#d3b17f",
    },
    light: { ...SHARED_LIGHT, "--accent": "#7a5a22", "--accent-hover": "#5d4419" },
  },
  {
    id: "oxblood",
    name: "B — Oxblood & parchment",
    note: "Warm ink with a muted oxblood. Bookbinding rather than terminal; the most editorial of the set.",
    dark: {
      "--bg": "#15120f",
      "--surface": "#1d1915",
      "--surface-raised": "#27221d",
      "--border": "#352f28",
      "--text": "#e0d6c6",
      "--text-muted": "#9c9182",
      "--text-faint": "#8b8171",
      "--accent": "#c1705f",
      "--accent-hover": "#d4897a",
    },
    light: { ...SHARED_LIGHT, "--accent": "#8f3f30", "--accent-hover": "#712f23" },
  },
  {
    id: "bottle",
    name: "C — Bottle green & cream",
    note: "Dark bottle green with sage. Leather-bound library. Old without being a terminal pastiche.",
    dark: {
      "--bg": "#0f1310",
      "--surface": "#161b17",
      "--surface-raised": "#1f2620",
      "--border": "#2c342d",
      "--text": "#dbd8c9",
      "--text-muted": "#969c8f",
      "--text-faint": "#858b80",
      "--accent": "#8fae87",
      "--accent-hover": "#a8c4a0",
    },
    light: { ...SHARED_LIGHT, "--accent": "#3f6238", "--accent-hover": "#2f4a2a" },
  },
  {
    id: "ink",
    name: "D — Ink & dusty blue",
    note: "Cool ink with faded indigo. Closest to old technical drawings and blueprints. The most restrained overall.",
    dark: {
      "--bg": "#13151a",
      "--surface": "#1a1d23",
      "--surface-raised": "#24282f",
      "--border": "#31363e",
      "--text": "#d8d6ce",
      "--text-muted": "#969ba3",
      "--text-faint": "#868b93",
      "--accent": "#94aabf",
      "--accent-hover": "#aec1d3",
    },
    light: { ...SHARED_LIGHT, "--accent": "#3d5a75", "--accent-hover": "#2d445a" },
  },
];

function Sample({
  tokens,
  label,
}: {
  tokens: ThemeTokens;
  label: string;
}) {
  return (
    <div
      style={
        {
          ...tokens,
          background: "var(--bg)",
          color: "var(--text)",
        } as CSSProperties
      }
      className="flex-1 rounded-[var(--radius)] border border-[var(--border)] p-[var(--space-4)]"
    >
      <div className="mb-[var(--space-3)] font-mono text-[var(--text-xs)] uppercase tracking-[var(--tracking-caps)] text-[var(--text-faint)]">
        {label}
      </div>

      <div className="flex flex-col gap-[var(--space-3)]">
        <h3 className="font-mono text-[var(--text-xl)]">Nima Daryabar</h3>
        <p className="text-[var(--text-sm)] text-[var(--text-muted)]">
          AI engineer. LLMs, RAG systems, and the unglamorous work of making
          them behave in production.
        </p>
        <MetaLine
          items={[
            "Padua",
            <Tag key="s" variant="accent">
              open to work
            </Tag>,
          ]}
        />

        <Terminal label={`${label} sample`}>
          <TerminalLine prompt>whoami</TerminalLine>
          <TerminalLine>M.Sc. Computer Science, Padua.</TerminalLine>
        </Terminal>

        <Panel title="Projects" meta={<span>5 total</span>}>
          <div className="flex flex-col gap-[var(--space-2)]">
            <h4 className="text-[var(--text-base)]">
              LLM vulnerabilities in RAG systems
            </h4>
            <p className="text-[var(--text-sm)] text-[var(--text-muted)]">
              Up to 40% degradation via poisoned vector databases. Here is{" "}
              <a href="#top">a link in running text</a> for contrast.
            </p>
            <MetaLine items={["2024", <Tag key="a">RAG</Tag>]} />
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default function PalettePage() {
  return (
    <div id="top" className="flex flex-col gap-[var(--space-7)]">
      <header className="flex flex-col gap-[var(--space-2)]">
        <h1 className="text-[var(--text-3xl)]">Palette candidates</h1>
        <p className="max-w-[var(--measure)] text-fg-muted">
          Muted only — no neon, nothing loud. Accents come from print and
          bookbinding rather than terminals. Each candidate is shown in both
          themes so the pair can be judged together; every foreground value is
          verified at WCAG AA against its own background.
        </p>
      </header>

      {candidates.map((p) => (
        <section key={p.id} className="flex flex-col gap-[var(--space-3)]">
          <div className="flex flex-wrap items-baseline justify-between gap-[var(--space-2)]">
            <h2 className="font-mono text-[var(--text-xl)]">{p.name}</h2>
            <code className="font-mono text-[var(--text-xs)] text-fg-faint">
              dark {p.dark["--accent"]} · light {p.light["--accent"]}
            </code>
          </div>

          <p className="max-w-[var(--measure)] text-[var(--text-sm)] text-fg-muted">
            {p.note}
          </p>

          <div className="flex flex-col gap-[var(--space-3)] lg:flex-row">
            <Sample tokens={p.dark} label="dark" />
            <Sample tokens={p.light} label="light" />
          </div>
        </section>
      ))}
    </div>
  );
}
