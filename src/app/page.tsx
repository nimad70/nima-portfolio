import {
  Panel,
  MetaLine,
  Tag,
  Divider,
  Terminal,
  TerminalLine,
} from "@/ui/primitives";

/**
 * Placeholder home page exercising every primitive.
 *
 * Real content lands in Phase 2, when it moves out of legacy/*.html into
 * MDX with validated frontmatter. This page exists so the primitives can be
 * seen rendering, in both themes, before content is layered on top.
 */
export default function Home() {
  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      {/* Invariant 4: exactly one h1 per page. The old home page had none —
          its hero was a stack of <span>s. */}
      <header className="flex flex-col gap-[var(--space-3)]">
        <h1 className="text-[var(--text-3xl)]">Nima Daryabar</h1>
        <p className="max-w-[var(--measure)] text-[var(--text-lg)] text-fg-muted">
          AI engineer. LLMs, RAG systems, and the unglamorous work of making
          them behave in production.
        </p>
        <MetaLine
          items={[
            "Padua, Italy",
            <Tag key="status" variant="accent">
              open to work
            </Tag>,
          ]}
        />
      </header>

      <Terminal label="Introduction">
        <TerminalLine prompt>whoami</TerminalLine>
        <TerminalLine>
          M.Sc. Computer Science, University of Padua. Research on LLM
          vulnerabilities in RAG systems.
        </TerminalLine>
        <TerminalLine prompt>currently</TerminalLine>
        <TerminalLine>
          Building retrieval pipelines that fail honestly rather than
          confidently.
        </TerminalLine>
      </Terminal>

      <Divider label="Recent" />

      <Panel
        title="Projects"
        meta={<span>5 total</span>}
        as="section"
      >
        <div className="flex flex-col gap-[var(--space-4)]">
          <article className="flex flex-col gap-[var(--space-2)]">
            <h3 className="text-[var(--text-lg)]">
              LLM vulnerabilities in RAG systems
            </h3>
            <p className="max-w-[var(--measure)] text-fg-muted">
              Demonstrated up to 40% degradation by poisoning vector databases,
              then proposed mitigations.
            </p>
            <MetaLine
              items={[
                "2024",
                <Tag key="a">RAG</Tag>,
                <Tag key="b">LLaMA-2</Tag>,
                <Tag key="c">ChromaDB</Tag>,
              ]}
            />
          </article>

          <article className="flex flex-col gap-[var(--space-2)]">
            <h3 className="text-[var(--text-lg)]">Emotion-aware chatbot</h3>
            <p className="max-w-[var(--measure)] text-fg-muted">
              Real-time face detection and emotion classification driving a
              conversational model.
            </p>
            <MetaLine
              items={[
                "in progress",
                <Tag key="a">OpenCV</Tag>,
                <Tag key="b">TensorFlow</Tag>,
              ]}
            />
          </article>
        </div>
      </Panel>

      <Panel title="Colophon">
        <p className="max-w-[var(--measure)] text-fg-muted">
          Built with Next.js as a static export, served from the edge. Modern
          engineering, 2004 information architecture — boxed panels, a
          persistent index, and real information density.
        </p>
      </Panel>
    </div>
  );
}
