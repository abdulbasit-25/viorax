import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CopyButton } from "./CopyButton";
import {
  MonitorUp,
  MonitorX,
  Users,
  QrCode,
  Phone,
  Video,
  PhoneOff,
  Mic,
  MicOff,
} from "lucide-react";
import { Waveform } from "./Waveform";
import type { HostState } from "@/hooks/usePeerConnection";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

const label = "block font-mono text-[10px] uppercase tracking-[0.3em]";

const callButton = `flex min-h-[4.5rem] items-center justify-between gap-3 rounded-md border border-signal/60 px-5 py-4 text-left transition-colors hover:bg-signal/10 active:bg-signal/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent ${focusRing}`;

const dangerButton = `flex min-h-[4.5rem] items-center justify-between gap-3 rounded-md border border-destructive bg-destructive px-6 py-5 text-left text-destructive-foreground transition-colors hover:bg-destructive/90 active:bg-destructive/80 ${focusRing}`;

export function HostDashboard({
  roomCode,
  host,
  joinUrl,
}: {
  roomCode: string;
  host: HostState;
  joinUrl: string;
}) {
  const {
    state,
    viewerCount,
    isSharing,
    callMode,
    localStream,
    remoteStream,
    canShareScreen,
    startCall,
    endCall,
    startSharing,
    stopSharing,
  } = host;
  const [micEnabled, setMicEnabled] = useState(true);

  // A new call starts with a live microphone, so reset the toggle when the call changes.
  useEffect(() => {
    setMicEnabled(true);
  }, [callMode]);

  const toggleMic = () => {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !micEnabled;
    });
    setMicEnabled((enabled) => !enabled);
  };

  const people = (n: number) => `${n} ${n === 1 ? "participant" : "participants"}`;
  const statusText =
    state === "initializing"
      ? "Opening room..."
      : state === "waiting"
        ? `Waiting for someone to join room ${roomCode}.`
        : state === "connected"
          ? `${people(viewerCount)} ready.`
          : state === "live"
            ? `Active with ${people(viewerCount)}.`
            : "";

  const waveState = state === "live" ? "live" : state === "connected" ? "connected" : "idle";
  const cannotCall = state === "initializing" || state === "error" || viewerCount === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
      {remoteStream && (
        <audio
          className="hidden"
          autoPlay
          ref={(element) => {
            // Only assign when the stream changes, so re-renders don't restart playback.
            if (element && element.srcObject !== remoteStream) element.srcObject = remoteStream;
          }}
        />
      )}

      {/* Main */}
      <section
        aria-labelledby="room-title"
        className="flex min-w-0 flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14"
      >
        <div>
          <h1 id="room-title" className={`${label} text-signal`}>
            Room created
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3">
            {/* Scales down on small phones so six characters never overflow. */}
            <div
              className="font-mono text-4xl tracking-[0.2em] text-text-primary min-[30rem]:text-6xl min-[30rem]:tracking-[0.3em] sm:text-7xl sm:tracking-[0.35em]"
              aria-label={`Room code ${roomCode.split("").join(" ")}`}
            >
              {roomCode}
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyButton value={roomCode} label="copy code" />
              <CopyButton value={joinUrl} label="copy link" />
            </div>
          </div>
        </div>

        <div className="rounded-md border border-panel-line bg-panel p-4 sm:p-6">
          <div className={`flex items-center justify-between text-text-muted ${label}`}>
            <span>Signal status</span>
            <span
              className="flex items-center gap-2 text-text-primary"
              aria-label={people(viewerCount)}
            >
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {viewerCount}
            </span>
          </div>
          <div className="mt-4 overflow-hidden">
            <Waveform state={waveState} bars={48} />
          </div>
          <p role="status" aria-live="polite" className="mt-4 text-sm text-text-muted">
            {statusText}
          </p>
        </div>

        {host.incomingCall && (
          <div
            role="alert"
            className="flex flex-col gap-4 rounded-md border border-signal bg-panel p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
          >
            <div>
              <p className={`${label} text-signal`}>Incoming {host.incomingCall.mode} call</p>
              <p className="mt-2 text-sm text-text-primary">
                A participant is calling from this room.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <button
                type="button"
                onClick={host.acceptCall}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-signal px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:bg-signal/90 ${focusRing}`}
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" /> Accept
              </button>
              <button
                type="button"
                onClick={host.rejectCall}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-destructive px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-destructive-text hover:bg-destructive/10 ${focusRing}`}
              >
                <PhoneOff className="h-3.5 w-3.5" aria-hidden="true" /> Decline
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {!isSharing && !callMode && (
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => startCall("voice")}
                disabled={cannotCall}
                className={callButton}
              >
                <span>
                  <span className={`${label} text-text-muted`}>Voice</span>
                  <span className="mt-1 block text-lg font-semibold">Start call</span>
                </span>
                <Phone className="h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => startCall("video")}
                disabled={cannotCall}
                className={callButton}
              >
                <span>
                  <span className={`${label} text-text-muted`}>Video</span>
                  <span className="mt-1 block text-lg font-semibold">Start call</span>
                </span>
                <Video className="h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
              </button>
            </div>
          )}
          {!isSharing && !callMode && viewerCount === 0 && state !== "error" && (
            <p className="text-sm text-text-muted">Calls become available once someone joins.</p>
          )}

          {callMode && (
            <button type="button" onClick={endCall} className={dangerButton}>
              <span>
                <span className={`${label} opacity-80`}>{callMode} call</span>
                <span className="mt-1 block text-xl font-semibold">End call</span>
              </span>
              <PhoneOff className="h-6 w-6 shrink-0" aria-hidden="true" />
            </button>
          )}

          {/* Hidden on touch devices with CSS (no JS check, so no flash after load). */}
          {!callMode && !isSharing && (
            <button
              type="button"
              onClick={startSharing}
              disabled={state === "initializing" || state === "error"}
              className={`min-h-[4.5rem] items-center justify-between gap-3 rounded-md border border-signal bg-signal px-6 py-5 text-left text-ink transition-colors hover:bg-signal/90 active:bg-signal/80 disabled:cursor-not-allowed disabled:opacity-40 ${focusRing} flex [@media(pointer:coarse)]:hidden`}
            >
              <span>
                <span className={`${label} opacity-70`}>Transmit</span>
                <span className="mt-1 block text-xl font-semibold">Share screen</span>
              </span>
              <MonitorUp className="h-6 w-6 shrink-0" aria-hidden="true" />
            </button>
          )}
          {isSharing && (
            <button type="button" onClick={stopSharing} className={dangerButton}>
              <span>
                <span className={`${label} opacity-80`}>Cut signal</span>
                <span className="mt-1 block text-xl font-semibold">Stop sharing</span>
              </span>
              <MonitorX className="h-6 w-6 shrink-0" aria-hidden="true" />
            </button>
          )}

          {callMode && (
            <button
              type="button"
              onClick={toggleMic}
              aria-pressed={!micEnabled}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-panel-line px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted hover:text-text-primary ${focusRing}`}
            >
              {micEnabled ? (
                <Mic className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <MicOff className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {micEnabled ? "Mute microphone" : "Unmute microphone"}
            </button>
          )}

          <p className="hidden text-xs leading-relaxed text-text-muted [@media(pointer:coarse)]:block">
            Voice and video calls are available here. Screen sharing is available on desktop.
          </p>
          <p className="text-xs leading-relaxed text-text-muted [@media(pointer:coarse)]:hidden">
            {canShareScreen
              ? "Choose a screen, window, or tab when your browser prompts."
              : "Screen sharing is not available in this browser. You can still make a voice or video call."}
          </p>
        </div>
      </section>

      {/* QR panel */}
      <aside
        aria-labelledby="qr-title"
        className="min-w-0 border-t border-panel-line bg-panel/40 px-4 py-8 sm:px-8 sm:py-10 lg:border-l lg:border-t-0"
      >
        <h2 id="qr-title" className={`flex items-center gap-2 text-text-muted ${label}`}>
          <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
          Scan to join
        </h2>
        <div className="mx-auto mt-6 w-full max-w-[18rem] rounded-md border border-panel-line bg-white p-4 sm:p-5">
          {/* Fills its container, so it never overflows narrow screens. */}
          <QRCodeSVG
            value={joinUrl}
            size={220}
            bgColor="#ffffff"
            fgColor="#0E1116"
            level="M"
            style={{ width: "100%", height: "auto" }}
            role="img"
            aria-label={`QR code to join room ${roomCode}`}
          />
        </div>
        <p className="mt-4 break-all text-center font-mono text-[11px] leading-relaxed text-text-muted lg:text-left">
          {joinUrl}
        </p>
      </aside>
    </div>
  );
}
