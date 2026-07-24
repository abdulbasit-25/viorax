import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal">Signal lost</p>
        <h1 className="mt-4 font-mono text-6xl text-text-primary">404</h1>
        <p className="mt-2 text-sm text-text-muted">
          This frequency isn't broadcasting.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-signal/90"
          >
            Return to base
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">
          Transmission interrupted
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          The signal cut out. Retry or return to base.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-signal/90"
          >
            Retry
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-panel-line bg-panel px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Signal Room — Live screen sharing between devices" },
      { name: "description", content: "Tune in on a frequency and broadcast your screen to any device. Zero setup, no accounts." },
      { property: "og:title", content: "Signal Room" },
      { property: "og:description", content: "Live screen sharing between devices — no accounts, no downloads." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster theme="dark" position="bottom-right" />
    </QueryClientProvider>
  );
}
