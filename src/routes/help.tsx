import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown } from "lucide-react";

const SITE_URL = "https://viorax.vercel.app";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "How to Use — VIORAX" },
      { name: "description", content: "Learn how to use VIORAX for calls and screen sharing." },
      { property: "og:title", content: "How to Use — VIORAX" },
      { property: "og:url", content: `${SITE_URL}/help` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/help` }],
  }),
  component: Help,
});

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

const HOST_STEPS = [
  "Create a room from the landing page.",
  "Share the room code or QR code with your participant.",
  "Choose a voice call, video call, or screen share.",
  "Allow camera or microphone access when your browser asks.",
];

const VIEWER_STEPS = [
  "Enter the six-character room code on the landing page.",
  "Or tap the QR scan button on mobile to scan a shared code.",
  "Wait for the room to connect, then choose how you want to communicate.",
  "Accept incoming calls, or stay in the room while a participant reconnects.",
];

const FAQ = [
  {
    q: "My browser isn't asking for camera or microphone access",
    a: "Click the lock or settings icon next to the address bar, set Camera and Microphone to Allow, then reload the page. Also check that no other app is using your camera.",
  },
  {
    q: "The other person can't hear or see me",
    a: "Make sure your microphone or camera isn't muted in the room, and that the right device is selected in your browser's site settings. Reloading the page and rejoining with the same code usually fixes it.",
  },
  {
    q: "Screen sharing isn't available on my phone",
    a: "Many mobile browsers don't support screen sharing. Use a desktop browser to share your screen, and join from your phone as a viewer.",
  },
  {
    q: "My room code doesn't work",
    a: "Room codes are six characters. Check for look-alike letters and numbers, and ask the host to confirm the room is still open.",
  },
];

const cardClass = "scroll-mt-24 space-y-4 rounded-lg border border-panel-line bg-panel p-5 sm:p-6";
const jumpLink = `inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.2em] text-link-cyan hover:text-link-cyan/80 ${focusRing}`;

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => (
        <li key={step} className="flex gap-4">
          <span className="w-6 shrink-0 font-mono text-sm text-signal" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-sm leading-relaxed text-text-muted">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function Help() {
  return (
    // Rendered inside the root route's <main> (flex-col), so this uses flex-1
    // instead of min-h-screen, which would add a second screen of scrolling.
    <div className="flex-1 px-4 py-10 text-text-primary sm:px-8 sm:py-14 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            How to use VIORAX
          </h1>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-text-muted">
            Follow these steps to join a call or share your screen.
          </p>
          <nav aria-label="Jump to section" className="flex flex-wrap gap-x-6 pt-1">
            <a href="#hosts" className={jumpLink}>
              For hosts
            </a>
            <a href="#viewers" className={jumpLink}>
              For viewers
            </a>
            <a href="#troubleshooting" className={jumpLink}>
              Troubleshooting
            </a>
          </nav>
        </header>

        <section id="hosts" aria-labelledby="hosts-heading" className={cardClass}>
          <h2 id="hosts-heading" className="text-xl font-semibold">
            For hosts
          </h2>
          <StepList steps={HOST_STEPS} />
        </section>

        <section id="viewers" aria-labelledby="viewers-heading" className={cardClass}>
          <h2 id="viewers-heading" className="text-xl font-semibold">
            For viewers
          </h2>
          <StepList steps={VIEWER_STEPS} />
        </section>

        <section id="troubleshooting" aria-labelledby="trouble-heading" className={cardClass}>
          <h2 id="trouble-heading" className="text-xl font-semibold">
            Troubleshooting
          </h2>
          <div className="divide-y divide-panel-line">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group py-1">
                <summary
                  className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-md py-2 text-sm font-medium marker:hidden [&::-webkit-details-marker]:hidden ${focusRing}`}
                >
                  {q}
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-text-muted motion-safe:transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="pb-3 text-sm leading-relaxed text-text-muted">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="flex justify-center pt-2">
          <Link
            to="/"
            className={`group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-signal px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-signal/90 sm:w-auto ${focusRing}`}
          >
            Create a room
            <ArrowRight
              className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
