import { LogOut } from "lucide-react";
import { Waveform } from "./Waveform";

type State = "idle" | "connected" | "live" | "error";

const DOT: Record<State, string> = {
  idle: "bg-text-muted/50",
  connected: "bg-link-cyan",
  live: "bg-signal motion-safe:animate-pulse",
  error: "bg-destructive",
};

export function StatusBar({
  roomCode,
  role,
  status,
  statusLabel,
  onDisconnect,
}: {
  roomCode: string;
  role: "Host" | "Viewer";
  status: State;
  statusLabel: string;
  onDisconnect: () => void;
}) {
  return (
    // The root layout already provides the page <header>, so this is a labelled region
    // instead of a second banner landmark. It sticks to the top so Disconnect stays in reach.
    <section
      aria-label="Room status"
      className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-panel-line bg-panel/95 px-4 py-2 backdrop-blur sm:px-6"
    >
      <dl className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">
        <div className="flex items-center gap-2">
          <dt>Room</dt>
          <dd className="tracking-[0.35em] text-text-primary">{roomCode}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt>Role</dt>
          <dd className="text-text-primary">{role}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Status</dt>
          <dd className="flex items-center gap-2 text-text-primary" role="status">
            <span
              className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${DOT[status]}`}
              aria-hidden="true"
            />
            {statusLabel}
          </dd>
        </div>
      </dl>

      <div className="flex shrink-0 items-center gap-3">
        {/* Explicit width: the waveform fills its container, so it needs one to size against. */}
        <div className="hidden w-24 md:block">
          <Waveform state={status === "error" ? "idle" : status} bars={14} />
        </div>
        <button
          type="button"
          onClick={onDisconnect}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-panel-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted transition-colors hover:border-destructive/70 hover:text-destructive-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          <span>
            <span className="sm:hidden">Leave</span>
            <span className="hidden sm:inline">Disconnect</span>
          </span>
        </button>
      </div>
    </section>
  );
}
