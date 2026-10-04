import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useId, useRef, useState } from "react";
import {
  LogIn,
  ArrowRight,
  Camera,
  Mic,
  Video,
  MonitorUp,
  UserX,
  Download,
  Waypoints,
  CircleSlash,
} from "lucide-react";
import { generateRoomCode, normalizeRoomCode } from "@/lib/roomCode";
import { DeviceSchematic } from "@/components/DeviceSchematic";
import { QrScanner } from "@/components/QrScanner";

const SITE = "https://viorax.vercel.app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VIORAX — Talk, share, connect" },
      {
        name: "description",
        content:
          "Start a voice call, video call, or screen share with a simple room code. No accounts, no downloads.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE },
      { property: "og:title", content: "VIORAX — Talk, share, connect" },
      {
        property: "og:description",
        content: "Talk, share, and connect directly in your browser. No accounts required.",
      },
      { property: "og:image", content: `${SITE}/og-image.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "VIORAX — Talk, share, connect" },
      { name: "twitter:image", content: `${SITE}/og-image.jpg` },
      { name: "twitter:image:alt", content: "VIORAX logo and screen sharing preview" },
    ],
  }),
  component: Landing,
});

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

const features = [
  { icon: Mic, title: "Voice", detail: "Clear audio" },
  { icon: Video, title: "Video", detail: "Face to face" },
  { icon: MonitorUp, title: "Share", detail: "Your screen" },
] as const;

const steps = [
  { title: "Create a room", detail: "One tap. No sign-up, no install." },
  { title: "Share the code", detail: "Send six characters, or let people scan the QR code." },
  { title: "Connect", detail: "Talk, turn on video, or share your screen." },
] as const;

const promises = [
  { icon: UserX, title: "No accounts", detail: "Nothing to register or remember." },
  { icon: Download, title: "No downloads", detail: "Runs in the browser you already have." },
  { icon: Waypoints, title: "Direct connections", detail: "Peer-to-peer, built on WebRTC." },
  { icon: CircleSlash, title: "No recording", detail: "Calls aren't recorded." },
] as const;

function Landing() {
  const navigate = useNavigate();
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Only flag the code after a join attempt, so people aren't told "invalid" mid-typing.
  const showError = submitted && code.length !== 6;

  const host = () => {
    navigate({
      to: "/room/$roomId",
      params: { roomId: generateRoomCode() },
      search: { role: "host" },
    });
  };

  const join = (e: React.FormEvent) => {
    e.preventDefault();
    const c = normalizeRoomCode(code);
    if (c.length !== 6) {
      setSubmitted(true);
      inputRef.current?.focus();
      return;
    }
    navigate({ to: "/room/$roomId", params: { roomId: c }, search: {} });
  };

  return (
    // Rendered inside the root route's <main> (which is flex-col), so this fills the
    // remaining height with flex-1 instead of setting its own min-h-screen.
    <div className="flex flex-1 flex-col text-text-primary">
      <QrScanner open={scannerOpen} onClose={() => setScannerOpen(false)} />

      <div className="relative isolate overflow-hidden">
        {/* Decorative backdrop: faint grid that fades out, plus a warm glow behind the schematic. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(var(--panel-line)_1px,transparent_1px),linear-gradient(90deg,var(--panel-line)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(70%_70%_at_50%_30%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-1/4 -z-10 h-[28rem] w-[28rem] rounded-full bg-signal/10 blur-3xl max-lg:right-1/2 max-lg:translate-x-1/2 max-lg:top-[55%]"
        />
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 lg:grid-cols-2 xl:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]">
          {/* Action panel */}
          <section
            aria-labelledby="hero-title"
            className="flex flex-col justify-center gap-8 px-4 py-10 sm:gap-9 sm:px-8 sm:py-14 lg:px-12 lg:py-20 xl:px-16"
          >
            <div className="space-y-4">
              <h1
                id="hero-title"
                className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-5xl xl:text-6xl"
              >
                Talk. Share. Connect.
              </h1>
              <p className="max-w-md text-pretty text-base leading-relaxed text-text-muted sm:text-lg">
                Start a voice call, video call, or screen share with a room code. No accounts, no
                downloads, and no recording.
              </p>
            </div>

            {/* Stacked on phones and mid-width desktops; side by side only where there's room. */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1 xl:grid-cols-2">
              <button
                type="button"
                onClick={host}
                className={`group flex min-h-[4.5rem] items-center justify-between gap-3 rounded-md border border-signal bg-signal px-5 py-4 text-left text-ink shadow-[0_0_32px_-8px_var(--signal)] transition-colors hover:bg-signal/90 active:bg-signal/80 ${focusRing}`}
              >
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">
                    Start here
                  </span>
                  <span className="mt-1 block text-base font-semibold">Create room</span>
                </span>
                <ArrowRight
                  className="h-5 w-5 shrink-0 motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>

              <form
                onSubmit={join}
                noValidate
                className={`flex min-h-[4.5rem] flex-col justify-center gap-2 rounded-md border bg-panel p-4 transition-colors focus-within:border-link-cyan/60 ${
                  showError ? "border-destructive" : "border-panel-line"
                }`}
              >
                <label
                  htmlFor={inputId}
                  className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted"
                >
                  Join a room
                </label>
                <div className="flex items-center gap-2">
                  {/* 16px+ text prevents iOS Safari from zooming in on focus. */}
                  <input
                    ref={inputRef}
                    id={inputId}
                    value={code}
                    onChange={(e) => setCode(normalizeRoomCode(e.target.value))}
                    placeholder="ABC123"
                    maxLength={6}
                    autoCapitalize="characters"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    inputMode="text"
                    enterKeyHint="go"
                    aria-invalid={showError}
                    aria-describedby={showError ? errorId : undefined}
                    className="h-11 w-full min-w-0 bg-transparent font-mono text-lg tracking-[0.3em] text-text-primary outline-none placeholder:text-text-muted/40 sm:tracking-[0.35em]"
                  />
                  {/* Shown by CSS on touch devices only: no JS, no layout shift after hydration. */}
                  <button
                    type="button"
                    onClick={() => setScannerOpen(true)}
                    aria-label="Scan QR code"
                    className={`hidden h-11 w-11 shrink-0 place-items-center border border-link-cyan text-link-cyan transition-colors hover:bg-link-cyan/10 active:bg-link-cyan/20 [@media(pointer:coarse)]:grid ${focusRing}`}
                  >
                    <Camera className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="submit"
                    aria-label="Join room"
                    className={`grid h-11 w-11 shrink-0 place-items-center border border-link-cyan text-link-cyan transition-colors hover:bg-link-cyan/10 active:bg-link-cyan/20 ${focusRing}`}
                  >
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                {showError && (
                  <p id={errorId} role="alert" className="text-xs text-destructive-text">
                    Enter the 6-character room code.
                  </p>
                )}
              </form>
            </div>

            <ul className="grid grid-cols-3 gap-3 border-t border-panel-line pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted sm:gap-6 sm:tracking-[0.3em]">
              {features.map(({ icon: Icon, title, detail }) => (
                <li key={title} className="min-w-0">
                  <div className="flex items-center gap-1.5 text-text-primary sm:gap-2">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-signal" aria-hidden="true" />
                    <span>{title}</span>
                  </div>
                  <div className="mt-1 break-words">{detail}</div>
                </li>
              ))}
            </ul>
          </section>

          {/* Schematic panel: decorative, so it's hidden from assistive tech. */}
          <section
            aria-hidden="true"
            className="flex items-center justify-center border-t border-panel-line px-4 py-10 sm:px-8 sm:py-14 lg:border-l lg:border-t-0 lg:px-10 lg:py-16"
          >
            <div className="w-full max-w-sm motion-safe:animate-in motion-safe:fade-in motion-safe:duration-1000 sm:max-w-md">
              <DeviceSchematic state="idle" label="STANDBY" />
            </div>
          </section>
        </div>
      </div>

      <section
        aria-labelledby="how-title"
        className="border-t border-panel-line px-4 py-12 sm:px-8 sm:py-16 lg:px-12 xl:px-16"
      >
        <div className="mx-auto max-w-[1600px]">
          <h2 id="how-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            From zero to talking in three steps
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map(({ title, detail }, i) => (
              <li
                key={title}
                className="flex gap-4 rounded-lg border border-panel-line bg-panel p-5"
              >
                <span className="font-mono text-2xl leading-none text-signal">{i + 1}</span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="promise-title"
        className="border-t border-panel-line px-4 py-12 sm:px-8 sm:py-16 lg:px-12 xl:px-16"
      >
        <div className="mx-auto max-w-[1600px]">
          <h2 id="promise-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Private by design
          </h2>
          <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="flex gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-link-cyan" aria-hidden="true" />
                <div>
                  <dt className="font-semibold">{title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-text-muted">{detail}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
