import { useMemo } from "react";
import { cn } from "@/lib/utils";

type State = "idle" | "connected" | "live";

const COLOR: Record<State, string> = {
  idle: "bg-panel-line",
  connected: "bg-link-cyan",
  live: "bg-signal",
};

const DURATION: Record<State, string> = {
  idle: "2400ms",
  connected: "1200ms",
  live: "700ms",
};

// Pixels of width reserved per bar (bar + gap), used to cap the total width.
const BAR_SLOT = 7;

export function Waveform({
  state,
  bars = 32,
  className,
}: {
  state: State;
  bars?: number;
  className?: string;
}) {
  // Deterministic heights (rounded so server and browser always agree): two overlapping
  // sine waves give a natural-looking envelope, tallest in the middle like a real voice trace.
  const heights = useMemo(
    () =>
      Array.from({ length: bars }, (_, i) => {
        if (state === "idle") return 20 + ((i * 37) % 10);
        const envelope = Math.sin((Math.PI * (i + 0.5)) / bars);
        const ripple = 0.55 + 0.45 * Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.37));
        return Math.round(22 + 70 * envelope * ripple);
      }),
    [bars, state],
  );

  const animation = state === "idle" ? "signal-idle" : "signal-pulse";

  return (
    <div
      aria-hidden="true"
      // Fills the available width but never stretches past a sensible size, and never overflows
      // a narrow phone: bars shrink instead of the row scrolling or clipping.
      className={cn("flex h-10 w-full min-w-0 items-center justify-center gap-[3px]", className)}
      style={{ maxWidth: bars * BAR_SLOT }}
    >
      {heights.map((height, i) => (
        <span
          key={i}
          className={cn(
            "min-w-px max-w-[4px] flex-1 origin-center rounded-full transition-colors duration-500",
            COLOR[state],
            // For reduced-motion users, drop the animation and show a still waveform.
            "motion-reduce:animate-none!",
          )}
          style={{
            height: `${height}%`,
            animation: `${animation} ${DURATION[state]} ease-in-out infinite`,
            animationDelay: `${(i * 60) % 900}ms`,
          }}
        />
      ))}
    </div>
  );
}
