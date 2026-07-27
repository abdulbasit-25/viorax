import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "How to Use — Signal Room" },
      { name: "description", content: "Learn how to use Signal Room for screen sharing." },
    ],
  }),
  component: Help,
});

function Help() {
  return (
    <main className="min-h-screen bg-ink px-6 py-16 text-text-primary lg:px-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-signal">Help</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            How to use Signal Room
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-text-muted">
            Follow these steps to broadcast or watch a live screen session.
          </p>
        </div>

        <section className="space-y-4 rounded border border-panel-line bg-panel p-6">
          <h2 className="text-xl font-semibold">For hosts</h2>
          <ol className="space-y-3 text-sm leading-relaxed text-text-muted list-decimal list-inside">
            <li>Open a frequency from the landing page on a desktop browser.</li>
            <li>Share the generated room code or link with viewers.</li>
            <li>Click Go Live and choose the screen, window, or tab to broadcast.</li>
            <li>Allow microphone access if you want audio to travel with the stream.</li>
          </ol>
        </section>

        <section className="space-y-4 rounded border border-panel-line bg-panel p-6">
          <h2 className="text-xl font-semibold">For viewers</h2>
          <ol className="space-y-3 text-sm leading-relaxed text-text-muted list-decimal list-inside">
            <li>Enter the 6-character room code on the landing page.</li>
            <li>Or tap the QR scan button on mobile to scan a shared code.</li>
            <li>Tune in and wait for the host to start broadcasting.</li>
            <li>If the broadcast ends, refresh or return to the landing page to reconnect.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
