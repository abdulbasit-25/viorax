import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Radio } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const SITE_URL = "https://viorax.vercel.app";
const SITE_NAME = "VIORAX";
const DEFAULT_TITLE = "VIORAX — Talk, share, connect";
const DEFAULT_DESCRIPTION =
  "Start a voice call, video call, or screen share with a simple room code.";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const DEFAULT_IMAGE_ALT = "VIORAX logo and screen sharing preview";
const ARCHER_URL = "https://abdulbasit-archer.vercel.app/";
// Tip: copy this file into /public (e.g. /archer-logo.png) and point here to self-host it.
const ARCHER_LOGO = "https://abdulbasit-archer.vercel.app/logo.png";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/help", label: "Help" },
] as const;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

// TanStack's <Link> sets data-status="active", which avoids text-color class conflicts.
const navLinkClass = `flex min-h-11 items-center font-mono text-sm uppercase tracking-[0.3em] text-text-muted transition-colors hover:text-text-primary data-[status=active]:text-text-primary lg:min-h-0 ${focusRing}`;

const primaryButton = `inline-flex min-h-11 items-center justify-center rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-signal/90 ${focusRing}`;

function ArcherLink({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-10 w-10" : "h-12 w-12";
  return (
    <a
      href={ARCHER_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex min-h-11 items-center gap-3 transition-colors ${focusRing} ${className}`}
    >
      <span className="text-right leading-none">
        <span className="block font-mono text-[9px] uppercase tracking-[0.35em] text-text-muted transition-colors group-hover:text-text-primary">
          Powered by
        </span>
        <span className="mt-1.5 block text-sm font-bold uppercase tracking-wide text-text-primary">
          Archer
        </span>
      </span>

      {/* Logo with three revolving rings. Rings are decorative; motion stops for reduced-motion users. */}
      <span className={`relative grid shrink-0 place-items-center ${box}`} aria-hidden="true">
        {/* Outer dotted ring, slow clockwise */}
        <svg
          viewBox="0 0 48 48"
          className="absolute inset-0 animate-orbit text-text-muted/70 motion-reduce:animate-none"
        >
          <circle
            cx="24"
            cy="24"
            r="22.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="0.01 3.4"
          />
        </svg>
        {/* Middle dashed ring, counter-clockwise */}
        <svg
          viewBox="0 0 48 48"
          className="absolute inset-[3px] animate-orbit-reverse text-link-cyan/60 motion-reduce:animate-none"
        >
          <circle
            cx="24"
            cy="24"
            r="23"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="10 5 2 5"
          />
        </svg>
        {/* Signal arc that sweeps like a radar line */}
        <svg
          viewBox="0 0 48 48"
          className="absolute inset-[6px] animate-orbit-sweep text-signal motion-reduce:animate-none"
        >
          <circle
            cx="24"
            cy="24"
            r="23"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="28 117"
          />
        </svg>
        <img
          src={ARCHER_LOGO}
          alt=""
          width={32}
          height={32}
          loading="lazy"
          decoding="async"
          className="relative h-[68%] w-[68%] rounded-full object-cover"
        />
      </span>
    </a>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal">Signal lost</p>
        <h1 className="mt-4 font-mono text-6xl text-text-primary">404</h1>
        <p className="mt-2 text-sm text-text-muted">This room isn&apos;t active.</p>
        <div className="mt-6">
          <Link to="/" className={primaryButton}>
            Return to base
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16" role="alert">
      <div className="w-full max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">
          Transmission interrupted
        </h1>
        <p className="mt-2 text-sm text-text-muted">The signal cut out. Retry or return to base.</p>
        {import.meta.env.DEV && (
          <pre className="mt-4 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-md bg-panel p-3 text-left text-xs text-text-muted">
            {error.message}
          </pre>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className={primaryButton}
          >
            Retry
          </button>
          <a
            href="/"
            className={`inline-flex min-h-11 items-center justify-center rounded-md border border-panel-line bg-panel px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-accent ${focusRing}`}
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
      // viewport-fit=cover lets the safe-area padding below work on notched phones.
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: DEFAULT_TITLE },
      { name: "description", content: DEFAULT_DESCRIPTION },
      { name: "theme-color", content: "#0e1116" },
      { name: "color-scheme", content: "dark" },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: DEFAULT_TITLE },
      { property: "og:description", content: DEFAULT_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: DEFAULT_IMAGE },
      { property: "og:image:secure_url", content: DEFAULT_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: DEFAULT_IMAGE_ALT },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: DEFAULT_TITLE },
      { name: "twitter:description", content: DEFAULT_DESCRIPTION },
      { name: "twitter:image", content: DEFAULT_IMAGE },
      { name: "twitter:image:alt", content: DEFAULT_IMAGE_ALT },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "canonical", href: SITE_URL },
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
  const [menuOpen, setMenuOpen] = useState(false);

  // Let keyboard users dismiss the mobile menu with Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <QueryClientProvider client={queryClient}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-signal focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>

      {/* The shell owns the full-height layout, so pages should use flex-1, not min-h-screen. */}
      <div className="flex min-h-dvh flex-col bg-ink pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] text-text-primary">
        <header className="border-b border-panel-line px-4 py-2 sm:px-6 lg:px-10 lg:py-3">
          <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-x-4">
            <Link
              to="/"
              className={`flex min-h-11 items-center gap-2.5 font-mono text-sm tracking-widest text-text-primary ${focusRing}`}
              onClick={() => setMenuOpen(false)}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center border border-signal/60 text-signal">
                <Radio className="h-4 w-4" aria-hidden="true" />
              </span>
              VIORAX
            </Link>

            <button
              type="button"
              className={`min-h-11 px-2 font-mono text-xs uppercase tracking-[0.2em] text-text-muted hover:text-text-primary lg:hidden ${focusRing}`}
              aria-expanded={menuOpen}
              aria-controls="primary-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>

            <nav
              id="primary-nav"
              aria-label="Primary"
              className={`${menuOpen ? "flex" : "hidden"} order-last w-full flex-col border-t border-panel-line pb-2 lg:order-none lg:ml-auto lg:mr-8 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-8 lg:border-t-0 lg:pb-0`}
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={navLinkClass}
                  activeProps={{ "aria-current": "page" as const }}
                  activeOptions={{ exact: link.to === "/" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* On phones this lives in the footer instead, to keep the header compact. */}
            <ArcherLink size="sm" className="hidden lg:inline-flex" />
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
          <Outlet />
        </main>

        <footer className="flex justify-center border-t border-panel-line px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 text-xs">
          <ArcherLink />
        </footer>
      </div>
      <Toaster theme="dark" position="bottom-right" />
    </QueryClientProvider>
  );
}
