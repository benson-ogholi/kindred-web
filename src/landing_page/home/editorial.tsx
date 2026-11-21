import type { ReactNode } from "react";
import { YELLOW } from "./shared";

/* Shared design tokens + primitives for the editorial look.
   Hero, SafetyVault, Circles, Footer (and About, if you like) all import from here. */

export const ACCENT = "#E8981C";
export const NAVY = "#14264A";
export const PAPER = "#ffffff";
export const LINE = "border-neutral-300/70";

export const Wrap = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-6xl px-6 ${className}`}>{children}</div>
);

/** Slash label on the left, content on the right */
export function Row({ label, children, first = false }: { label: string; children: ReactNode; first?: boolean }) {
  return (
    <div className={`grid gap-6 py-12 md:grid-cols-[35%_1fr] md:py-16 ${first ? "" : `border-t ${LINE}`}`}>
      <p className="text-xs font-medium text-neutral-900">/{label.toUpperCase()}/</p>
      <div>{children}</div>
    </div>
  );
}

export const H2 = ({ children, light = false }: { children: ReactNode; light?: boolean }) => (
  <h2
    className={`text-3xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl ${
      light ? "text-white" : "text-neutral-900"
    }`}
  >
    {children}
  </h2>
);

export const H3 = ({ children }: { children: ReactNode }) => (
  <h3 className="text-2xl font-semibold leading-tight tracking-[-0.035em] text-neutral-900 sm:text-3xl">{children}</h3>
);

export const Small = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`text-sm leading-relaxed text-neutral-600 ${className}`}>{children}</p>
);

export const Arrow = () => (
  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
    <path d="M3 9l6-6M4 3h5v5" />
  </svg>
);

export const Star = () => (
  <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" aria-hidden>
    <path fill={YELLOW} d="M12 1c.9 6.2 4.8 10.1 11 11-6.2.9-10.1 4.8-11 11-.9-6.2-4.8-10.1-11-11C7.2 11.1 11.1 7.2 12 1z" />
  </svg>
);

export const Rings = () => (
  <>
    {[320, 560, 800, 1040].map((d) => (
      <span
        key={d}
        aria-hidden
        className="absolute left-1/2 top-1/2 rounded-full border border-white/10"
        style={{ width: d, height: d, transform: "translate(-50%, -50%)" }}
      />
    ))}
  </>
);