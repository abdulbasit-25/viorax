import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useId, useRef, useState } from "react";
import { Radio, LogIn, ArrowRight, Camera, Mic, Video, MonitorUp } from "lucide-react";
import { generateRoomCode, normalizeRoomCode } from "@/lib/roomCode";
import { DeviceSchematic } from "@/components/DeviceSchematic";
import { Waveform } from "@/components/Waveform";
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
    // Rendered inside the root route's <main>, so this is a <div>, not another <main>.
    // dvh keeps the layout correct when mobile browser toolbars show/hide.
    // The env() padding keeps content clear of notches in landscape (needs viewport-fit=cover).
    <div className="flex min-h-dvh flex-col bg-ink pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] text-text-primary">
      <header className="flex items-center justify-between gap-3 border-b border-panel-line px-4 py-3.5 sm:px-6 sm:py-4 lg:px-10">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center border border-signal/60 text-signal">
            <Radio className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="font-mono text-sm tracking-widest">VIORAX</span>
            <span className="hidden truncate text-xs text-text-muted min-[30rem]:block">
              Private. Instant. Connected.
            </span>
          </div>
        </div>
        <div
          className="flex shrink-0 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted"
          role="status"
        >
          <Waveform state="idle" bars={12} />
          <span className="hidden sm:inline">Standby</span>
        </div>
      </header>

      <QrScanner open={scannerOpen} onClose={() => setScannerOpen(false)} />

      <div className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 lg:grid-cols-2 xl:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]">
        {/* Action panel */}
        <section
          aria-labelledby="hero-title"
          className="flex flex-col justify-center gap-8 px-4 py-10 sm:gap-9 sm:px-8 sm:py-14 lg:px-12 lg:py-20 xl:px-16"
        >
          <div className="space-y-4">
            <h1
              id="hero-title"
              className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl"
            >
              Talk. Share. Connect.
            </h1>
            <p className="max-w-md text-pretty text-sm leading-relaxed text-text-muted sm:text-base">
              Start a voice call, video call, or screen share with a room code. No accounts, no
              downloads, and no recording.
            </p>
          </div>

          {/* Stacked on phones and mid-width desktops; side by side only where there's room. */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1 xl:grid-cols-2">
            <button
              type="button"
              onClick={host}
              className={`group flex min-h-[4.5rem] items-center justify-between gap-3 border border-signal bg-signal px-5 py-4 text-left text-ink transition-colors hover:bg-signal/90 active:bg-signal/80 ${focusRing}`}
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
              className={`flex min-h-[4.5rem] flex-col justify-center gap-2 border bg-panel p-4 transition-colors focus-within:border-link-cyan/60 ${
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
          <div className="w-full max-w-sm sm:max-w-md">
            <DeviceSchematic state="idle" label="STANDBY" />
          </div>
        </section>
      </div>
    </div>
  );
}
