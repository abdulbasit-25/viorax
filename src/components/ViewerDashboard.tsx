import { useEffect, useState, type ComponentType } from "react";
import {
  Volume2,
  VolumeX,
  Maximize,
  MonitorX,
  Phone,
  Video,
  PhoneOff,
  Mic,
  MicOff,
  Camera,
  CameraOff,
} from "lucide-react";
import type { ViewerState } from "@/hooks/usePeerConnection";
import { Waveform } from "./Waveform";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

const eyebrow = "font-mono text-[10px] uppercase tracking-[0.3em]";

const VARIANTS = {
  default:
    "border-panel-line bg-panel text-text-muted hover:border-link-cyan/60 hover:text-text-primary",
  accent: "border-signal/60 text-text-primary hover:bg-signal/10",
  danger: "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90",
} as const;

function Control({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  disabled,
  pressed,
  className = "",
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  onClick: () => void;
  variant?: keyof typeof VARIANTS;
  disabled?: boolean;
  pressed?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${focusRing} ${className}`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      {label}
    </button>
  );
}

// Assign streams through callback refs so they survive the <video>/<audio> elements
// remounting when the call mode changes (a plain effect would miss that).
const attach = (stream: MediaStream | null | undefined) => (el: HTMLMediaElement | null) => {
  if (el && el.srcObject !== (stream ?? null)) el.srcObject = stream ?? null;
};

export function ViewerDashboard({ viewer, roomCode }: { viewer: ViewerState; roomCode: string }) {
  const [muted, setMuted] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);

  const { callMode, remoteStream, localStream, state } = viewer;
  const isLive = state === "live" && !!remoteStream;

  // New call: mic and camera start on. Calls are user-initiated, so play their audio right away;
  // plain screen sharing stays muted until the viewer opts in.
  useEffect(() => {
    setMicEnabled(true);
    setCameraEnabled(true);
    setMuted(!callMode);
  }, [callMode]);

  const toggleMic = () => {
    localStream?.getAudioTracks().forEach((t) => (t.enabled = !micEnabled));
    setMicEnabled((v) => !v);
  };

  const toggleCamera = () => {
    localStream?.getVideoTracks().forEach((t) => (t.enabled = !cameraEnabled));
    setCameraEnabled((v) => !v);
  };

  const fullscreen = () => {
    const v = videoEl as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!v) return;
    if (v.requestFullscreen) void v.requestFullscreen();
    else v.webkitEnterFullscreen?.(); // iPhone Safari
  };

  const badge =
    callMode === "voice"
      ? "Voice call active"
      : callMode === "video"
        ? "Video call active"
        : "Screen sharing active";

  return (
    <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
      <div className="relative aspect-video max-h-[75dvh] w-full overflow-hidden rounded-md border border-panel-line bg-black">
        {callMode === "voice" && remoteStream ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-panel px-4 sm:gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full border border-signal/60 text-signal sm:h-20 sm:w-20">
              <Phone className="h-6 w-6 sm:h-8 sm:w-8" aria-hidden />
            </div>
            <Waveform state="live" bars={24} />
            <p className="text-sm text-text-muted">Room participant</p>
            <audio ref={attach(remoteStream)} autoPlay muted={muted} />
          </div>
        ) : (
          <video
            ref={(el) => {
              attach(remoteStream)(el);
              setVideoEl((prev) => (prev === el || el === null ? prev : el));
            }}
            autoPlay
            playsInline
            muted={muted}
            className={`h-full w-full object-contain ${isLive ? "opacity-100" : "opacity-0"}`}
          />
        )}

        {callMode === "video" && localStream && (
          <video
            ref={attach(localStream)}
            autoPlay
            playsInline
            muted
            aria-label="Your camera"
            className={`absolute bottom-3 right-3 aspect-video w-24 -scale-x-100 rounded border border-panel-line bg-ink object-cover shadow-lg transition-opacity sm:bottom-4 sm:right-4 sm:w-40 ${
              cameraEnabled ? "opacity-100" : "opacity-40"
            }`}
          />
        )}

        {!isLive && (
          <div
            role="status"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink px-4 text-center sm:gap-4 sm:px-6"
          >
            {state === "error" ? (
              <>
                <MonitorX className="h-8 w-8 text-destructive-text sm:h-10 sm:w-10" aria-hidden />
                <p className={`${eyebrow} text-destructive-text`}>Signal error</p>
                <p className="max-w-sm text-sm text-text-muted">
                  {viewer.error || "Could not connect to this room."}
                </p>
              </>
            ) : state === "disconnected" ? (
              <>
                <MonitorX className="h-8 w-8 text-text-muted sm:h-10 sm:w-10" aria-hidden />
                <p className={`${eyebrow} text-text-muted`}>Off the air</p>
                <p className="max-w-sm text-sm text-text-muted">
                  The participant disconnected. You can stay here and wait for them to reconnect.
                </p>
              </>
            ) : (
              <>
                <Waveform state={state === "connected" ? "connected" : "idle"} bars={40} />
                <p className={`${eyebrow} text-text-muted`}>
                  {state === "initializing"
                    ? "Opening room..."
                    : state === "waiting"
                      ? `Connecting to room ${roomCode}...`
                      : "Ready to connect with a participant."}
                </p>
              </>
            )}
          </div>
        )}

        {isLive && (
          <div
            className={`pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded border border-signal/60 bg-ink/70 px-2 py-1 text-signal ${eyebrow}`}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-signal motion-safe:animate-pulse"
              aria-hidden
            />
            {badge}
          </div>
        )}
      </div>

      {viewer.incomingCall && (
        <div
          role="alert"
          className="flex flex-col gap-4 rounded-md border border-signal bg-panel p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div>
            <p className={`${eyebrow} text-signal`}>Incoming {viewer.incomingCall.mode} call</p>
            <p className="mt-2 text-sm text-text-primary">
              A participant is calling from this room.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button
              type="button"
              onClick={viewer.acceptCall}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-signal px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:bg-signal/90 ${focusRing}`}
            >
              <Phone className="h-4 w-4" aria-hidden /> Accept
            </button>
            <button
              type="button"
              onClick={viewer.rejectCall}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-destructive px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-destructive-text hover:bg-destructive/10 ${focusRing}`}
            >
              <PhoneOff className="h-4 w-4" aria-hidden /> Decline
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className={`${eyebrow} text-text-muted`}>
          Room <span className="tracking-[0.4em] text-text-primary">{roomCode}</span>
        </div>

        <div
          role="toolbar"
          aria-label="Call controls"
          className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center"
        >
          {callMode && (
            <Control
              icon={PhoneOff}
              label="End call"
              variant="danger"
              onClick={viewer.endCall}
              className="col-span-2 sm:order-last sm:col-span-1"
            />
          )}
          {!callMode && state === "connected" && (
            <>
              <Control
                icon={Phone}
                label="Voice call"
                variant="accent"
                onClick={() => viewer.startCall("voice")}
              />
              <Control
                icon={Video}
                label="Video call"
                variant="accent"
                onClick={() => viewer.startCall("video")}
              />
            </>
          )}
          {callMode && (
            <Control
              icon={micEnabled ? Mic : MicOff}
              label={micEnabled ? "Mute mic" : "Unmute mic"}
              pressed={!micEnabled}
              onClick={toggleMic}
            />
          )}
          {callMode === "video" && (
            <Control
              icon={cameraEnabled ? Camera : CameraOff}
              label={cameraEnabled ? "Camera off" : "Camera on"}
              pressed={!cameraEnabled}
              onClick={toggleCamera}
            />
          )}
          <Control
            icon={muted ? VolumeX : Volume2}
            label={muted ? "Unmute audio" : "Mute audio"}
            pressed={muted}
            disabled={!isLive}
            onClick={() => setMuted((m) => !m)}
          />
          {callMode !== "voice" && (
            <Control icon={Maximize} label="Fullscreen" disabled={!isLive} onClick={fullscreen} />
          )}
        </div>
      </div>
    </div>
  );
}
