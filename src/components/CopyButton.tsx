import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

// Fallback for browsers or insecure (http) contexts where navigator.clipboard is missing.
function legacyCopy(text: string) {
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.cssText = "position:fixed;top:0;left:0;opacity:0;font-size:16px";
  document.body.appendChild(el);
  el.select();
  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(el);
  }
}

export function CopyButton({
  value,
  label = "Copy",
  copiedMessage,
}: {
  value: string;
  label?: string;
  /** Toast text. Defaults to e.g. "Code copied" for the label "copy code". */
  copiedMessage?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  // Don't update state after unmount.
  useEffect(() => () => clearTimeout(timer.current), []);

  const noun = label.replace(/^copy\s+/i, "").trim();
  const message =
    copiedMessage ??
    (noun && noun.toLowerCase() !== label.toLowerCase()
      ? `${noun[0].toUpperCase()}${noun.slice(1)} copied`
      : "Copied to clipboard");

  const doCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value);
      else if (!legacyCopy(value)) throw new Error("copy failed");
      setCopied(true);
      toast.success(message);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Couldn't copy. Select the text and copy it manually.");
    }
  };

  return (
    <button
      type="button"
      onClick={doCopy}
      className={`group inline-flex min-h-11 min-w-[7.5rem] items-center justify-center gap-2 rounded-md border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors active:scale-[0.98] ${focusRing} ${
        copied
          ? "border-link-cyan/60 bg-link-cyan/10 text-link-cyan"
          : "border-panel-line bg-panel text-text-muted hover:border-link-cyan/60 hover:text-text-primary"
      }`}
    >
      {copied ? (
        <Check
          className="h-3.5 w-3.5 motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:duration-200"
          aria-hidden="true"
        />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      <span>{copied ? "copied" : label}</span>
    </button>
  );
}
