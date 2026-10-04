import type { ComponentType } from "react";
import { Monitor, Smartphone, Radio } from "lucide-react";
import { Waveform } from "./Waveform";

type State = "idle" | "connected" | "live";

const TONE: Record<State, { text: string; border: string; fill: string }> = {
  idle: { text: "text-text-muted", border: "border-panel-line", fill: "bg-transparent" },
  connected: { text: "text-link-cyan", border: "border-link-cyan/60", fill: "bg-link-cyan/10" },
  live: { text: "text-signal", border: "border-signal/60", fill: "bg-signal/10" },
};

const STATUS: Record<State, string> = {
  idle: "Standby",
  connected: "Link open",
  live: "Transmitting",
};

export function DeviceSchematic({ state, label }: { state: State; label: string }) {
  const tone = TONE[state];

  return (
    <div
      role="img"
      aria-label={`Connection diagram between a host and a viewer. Status: ${STATUS[state]}.`}
      className="flex h-full min-h-[16rem] flex-col justify-between gap-6 rounded-md border border-panel-line bg-panel p-4 sm:min-h-[20rem] sm:p-6 lg:p-10"
    >
      <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
        <span className="truncate">CH-01 / uplink</span>
        <span className={`shrink-0 ${tone.text}`}>{label}</span>
      </div>

      <div className="flex items-center justify-between gap-3 py-2 sm:gap-6 sm:py-6">
        <DeviceGlyph icon={Monitor} name="Host" state={state} active={state !== "idle"} />
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <Waveform state={state} bars={28} />
          <div className="flex items-center gap-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted sm:tracking-[0.25em]">
            <Radio className={`h-3 w-3 shrink-0 ${tone.text}`} aria-hidden="true" />
            <span>{STATUS[state]}</span>
          </div>
        </div>
        <DeviceGlyph icon={Smartphone} name="Viewer" state={state} active={state !== "idle"} />
      </div>

      {/* Only facts about the product: no made-up latency or codec numbers. */}
      <dl className="grid grid-cols-3 gap-3 border-t border-panel-line pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted sm:tracking-[0.25em]">
        <Stat label="Protocol" value="WebRTC" />
        <Stat label="Accounts" value="None" />
        <Stat label="Installs" value="None" />
      </dl>
    </div>
  );
}

function DeviceGlyph({
  icon: Icon,
  name,
  state,
  active,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  name: string;
  state: State;
  active: boolean;
}) {
  const tone = active ? TONE[state] : TONE.idle;
  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <div className="relative">
        {/* A single soft ping while live; still for reduced-motion users. */}
        {state === "live" && (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-md border border-signal/40 motion-safe:animate-ping motion-reduce:hidden"
          />
        )}
        <div
          className={`relative grid h-12 w-12 place-items-center rounded-md border transition-colors duration-500 sm:h-16 sm:w-16 ${tone.border} ${tone.fill} ${tone.text}`}
        >
          <Icon className="h-6 w-6 sm:h-8 sm:w-8" aria-hidden />
        </div>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
        {name}
      </span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt>{label}</dt>
      <dd className="text-text-primary">{value}</dd>
    </div>
  );
}
