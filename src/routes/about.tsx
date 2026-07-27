import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Signal Room" },
      { name: "description", content: "Learn about the creator and the Signal Room project." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <main className="min-h-screen bg-ink px-6 py-16 text-text-primary lg:px-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-signal">About</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Signal Room</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-text-muted">
            Signal Room is a lightweight browser-based screen sharing experience built for quick
            peer-to-peer connection without accounts or downloads.
          </p>
        </div>

        <section className="space-y-4 rounded border border-panel-line bg-panel p-6">
          <h2 className="text-xl font-semibold">Creator</h2>
          <p className="text-sm leading-relaxed text-text-muted">
            Built by Abdul Basit, also known as Archer, this project is designed to make live screen
            sharing simple, private, and easy to use.
          </p>
          <p className="text-sm leading-relaxed text-text-muted">
            If you want to learn more, visit the creator's website for additional projects and
            updates.
          </p>
        </section>

        <section className="space-y-4 rounded border border-panel-line bg-panel p-6">
          <h2 className="text-xl font-semibold">Project</h2>
          <p className="text-sm leading-relaxed text-text-muted">
            Signal Room uses peer-to-peer browser technology to broadcast a shared screen to
            connected devices. It focuses on direct connections, no sign-in required, and a minimal
            interface.
          </p>
          <ul className="space-y-2 text-sm leading-relaxed text-text-muted">
            <li>• No user accounts or registration</li>
            <li>• Live broadcast to one or more viewers</li>
            <li>• Simple frequency-style room codes</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
