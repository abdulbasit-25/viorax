import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Github, Globe, Radio, Twitter } from "lucide-react";

const SITE_URL = "https://viorax.vercel.app";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — VIORAX" },
      { name: "description", content: "Learn about the creator and the VIORAX project." },
      { property: "og:title", content: "About — VIORAX" },
      { property: "og:description", content: "Learn about the creator and the VIORAX project." },
      { property: "og:url", content: `${SITE_URL}/about` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
  }),
  component: About,
});

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

const ARCHER_URL = "https://abdulbasit-archer.vercel.app/";
const CASE_STUDY_URL = "https://abdulbasit-archer.vercel.app/portfolio/1";

// TODO: fill these in (or leave empty to hide them) so nothing fake ships to production.
const GITHUB_URL = ""; // e.g. "https://github.com/your-handle"
const TWITTER_URL = ""; // e.g. "https://x.com/your-handle"

const LINKS = [
  { href: ARCHER_URL, label: "Portfolio", icon: Globe },
  { href: CASE_STUDY_URL, label: "VIORAX case study", icon: ExternalLink },
  ...(GITHUB_URL ? [{ href: GITHUB_URL, label: "GitHub", icon: Github }] : []),
  ...(TWITTER_URL ? [{ href: TWITTER_URL, label: "Twitter", icon: Twitter }] : []),
];

const STEPS = [
  { title: "Create", detail: "Start a room. No account needed." },
  { title: "Share", detail: "Send the 6-character code or QR code." },
  { title: "Connect", detail: "Talk, show your face, or share your screen." },
];

const STACK = [
  "React",
  "TypeScript",
  "WebRTC",
  "Vite",
  "Tailwind CSS",
  "TanStack Router",
  "TanStack Query",
  "Bun",
];

const card = "space-y-4 rounded-lg border border-panel-line bg-panel p-5 sm:p-6";

function About() {
  return (
    // Rendered inside the root route's <main> (flex-col), so this uses flex-1
    // rather than min-h-screen, which would add a second screen of scrolling.
    <div className="flex-1 px-4 py-10 text-text-primary sm:px-8 sm:py-14 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-signal/60 text-signal sm:h-14 sm:w-14"
              aria-hidden="true"
            >
              <Radio className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              About VIORAX
            </h1>
          </div>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-text-muted">
            VIORAX is a lightweight browser-based communication tool for quick voice calls, video
            calls, and screen sharing without accounts or downloads.
          </p>
          <Link
            to="/"
            className={`inline-flex min-h-11 items-center gap-2 rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-signal/90 ${focusRing}`}
          >
            Start a room
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </header>

        <section aria-labelledby="how-title" className={card}>
          <h2 id="how-title" className="text-xl font-semibold">
            How it works
          </h2>
          <ol className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {STEPS.map(({ title, detail }, i) => (
              <li
                key={title}
                className="flex gap-3 rounded-md border border-panel-line bg-ink/40 p-4 sm:flex-col"
              >
                <span className="font-mono text-sm text-signal">{i + 1}</span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="project-title" className={card}>
          <h2 id="project-title" className="text-xl font-semibold">
            Project
          </h2>
          <p className="text-sm leading-relaxed text-text-muted">
            VIORAX uses peer-to-peer browser technology to connect participants for voice, video,
            and screen sharing. It focuses on direct connections, no sign-in required, and a calm,
            minimal interface.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-muted marker:text-signal">
            <li>No user accounts or registration</li>
            <li>Voice calls, video calls, and screen sharing</li>
            <li>Simple six-character room codes and QR joining</li>
          </ul>

          <ul className="flex flex-wrap gap-2 pt-2" aria-label="Built with">
            {STACK.map((item) => (
              <li
                key={item}
                className="rounded-full border border-panel-line px-3 py-1 font-mono text-[11px] tracking-wide text-text-muted"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="creator-title" className={card}>
          <h2 id="creator-title" className="text-xl font-semibold">
            Creator
          </h2>
          <p className="text-sm leading-relaxed text-text-muted">
            Built by Abdul Basit, also known as Archer, to make browser communication simple,
            direct, and easy to use. Visit the{" "}
            <a
              href={ARCHER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-link-cyan underline underline-offset-2 hover:text-link-cyan/80 ${focusRing}`}
            >
              portfolio
            </a>{" "}
            for more projects and updates.
          </p>

          <div className="grid gap-2 pt-1 sm:flex sm:flex-wrap sm:gap-3">
            {LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-panel-line px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-text-muted transition-colors hover:border-link-cyan hover:text-link-cyan sm:justify-start ${focusRing}`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
