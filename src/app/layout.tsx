import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

import { Rail, StatusBar, type RailSection } from "@/ui/primitives";
import { ThemeToggle } from "@/ui/features/ThemeToggle";
import { THEME_INIT_SCRIPT } from "@/ui/features/theme";

// A superfamily designed together: mono carries the UI, chrome and metadata;
// sans carries long-form prose, which is slower to read set in monospace.
// Only the weights actually used are loaded — the old site pulled Poppins
// 300/600 then asked for bold, so browsers synthesised a fake 700.
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nimadaryabar.com"),
  title: {
    default: "Nima Daryabar — AI Engineer",
    template: "%s — Nima Daryabar",
  },
  description:
    "AI engineer working on LLMs, RAG systems and machine learning. Projects, writing and background.",
  authors: [{ name: "Nima Daryabar" }],
  openGraph: {
    type: "website",
    siteName: "Nima Daryabar",
    locale: "en_GB",
  },
};

const railSections: RailSection[] = [
  {
    heading: "Site",
    links: [
      { href: "/", label: "Home" },
      { href: "/projects/", label: "Projects" },
      { href: "/about/", label: "About" },
      { href: "/blog/", label: "Writing" },
      { href: "/contact/", label: "Contact" },
    ],
  },
  {
    heading: "Elsewhere",
    links: [
      { href: "https://github.com/nimad70", label: "GitHub" },
      { href: "https://linkedin.com/in/nima-daryabar", label: "LinkedIn" },
    ],
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning is required, not a workaround: the inline script
    // below sets data-theme before React hydrates, so the DOM deliberately
    // differs from the server payload. This tells React the DOM wins for this
    // element's attributes. Without it React discards the correction and the
    // page flashes the wrong theme.
    // node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
    <html
      lang="en"
      suppressHydrationWarning
      className={`${mono.variable} ${sans.variable}`}
    >
      <head>
        {/* Applies a stored theme before first paint, so a dark-theme reload
            never flashes light. Must stay inline and synchronous. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="visually-hidden">
          Skip to content
        </a>

        <div className="mx-auto flex w-full max-w-[var(--width-content)] flex-1 flex-col gap-[var(--space-6)] px-[var(--space-4)] py-[var(--space-6)] md:flex-row">
          {/* The persistent index. Above the content in source order so it is
              reachable early by keyboard and screen reader; placed to the side
              visually from the medium breakpoint up. */}
          <aside className="md:w-[var(--width-rail)] md:shrink-0">
            <Rail sections={railSections} />
          </aside>

          <main id="main" className="min-w-0 flex-1">
            {children}
          </main>
        </div>

        <StatusBar
          left={<span>nimadaryabar.com</span>}
          right={<ThemeToggle />}
        />
      </body>
    </html>
  );
}
