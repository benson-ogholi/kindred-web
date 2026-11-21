import { Link } from "react-router-dom";
import { PLAY_STORE, YELLOW } from "../home/shared";
import AboutSections from "./AboutSections";

/* ------------------------------------------------------------------
   Optional: drop a real photo URL here (family, team, product shot).
   Leave empty to use the built-in brand panel instead.
------------------------------------------------------------------- */
const HERO_IMG = "";

const ACCENT = "#E8981C"; // Kokohor orange from the pitch deck
const NAVY = "#14264A";
const LINE = "border-neutral-300/70";

/* ---------- building blocks ---------- */

const Wrap = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`mx-auto max-w-6xl px-6 ${className}`}>{children}</div>;

/** Left slash-label, right content: the signature layout of the reference */
function Row({
  label,
  children,
  first = false,
}: {
  label: string;
  children: React.ReactNode;
  first?: boolean;
}) {
  return (
    <div
      className={`grid gap-6 py-12 md:grid-cols-[35%_1fr] md:py-16 ${first ? "" : `border-t ${LINE}`}`}
    >
      <p className="text-xs font-medium text-neutral-900">
        /{label.toUpperCase()}/
      </p>
      <div>{children}</div>
    </div>
  );
}

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-neutral-900 sm:text-5xl">
    {children}
  </h2>
);

const Small = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p className={`text-sm leading-relaxed text-neutral-600 ${className}`}>
    {children}
  </p>
);

const Arrow = () => (
  <svg
    viewBox="0 0 12 12"
    className="h-3 w-3"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    aria-hidden
  >
    <path d="M3 9l6-6M4 3h5v5" />
  </svg>
);

const Star = () => (
  <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" aria-hidden>
    <path
      fill={YELLOW}
      d="M12 1c.9 6.2 4.8 10.1 11 11-6.2.9-10.1 4.8-11 11-.9-6.2-4.8-10.1-11-11C7.2 11.1 11.1 7.2 12 1z"
    />
  </svg>
);

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p
        className="text-5xl font-medium tracking-[-0.05em] sm:text-6xl"
        style={{ color: ACCENT }}
      >
        {n}
      </p>
      <p className="mt-2 text-xs text-neutral-600">{label}</p>
    </div>
  );
}

/* ---------- content (from the pitch deck) ---------- */

const marquee = [
  "Safety Vault",
  "Heritage Archive",
  "Safety Net",
  "Family Hub",
  "Family Tree",
  "Video calls",
  "Voice calls",
  "Secure updates",
];

/* ---------- page ---------- */

export default function About() {
  return (
    <main className="bg-white text-neutral-900">
      <style>{`
        @keyframes kk-marquee { to { transform: translateX(-50%); } }
        .kk-marquee { animation: kk-marquee 32s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .kk-marquee { animation: none; } }
      `}</style>

      {/* Hero */}
      <Wrap className="grid gap-10 pb-16 pt-20 md:grid-cols-[1.6fr_1fr] md:items-end md:pt-28">
        <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-7xl">
          A private home for
          <span className="mt-1 flex flex-wrap items-center gap-x-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-900 sm:h-14 sm:w-14">
              <Star />
            </span>
            <span>family, safety and</span>
            <span className="px-2" style={{ background: YELLOW }}>
              legacy.
            </span>
          </span>
        </h1>
        <div className="md:pb-2">
          <Small className="max-w-xs">
            Kokohor Circle gives every family a private, secure and organised
            space to communicate, protect what matters and pass it on to the
            generations that follow.
          </Small>
          <a
            href={PLAY_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 border-b border-neutral-900 pb-1 text-sm"
          >
            Get the app on Android <Arrow />
          </a>
        </div>
      </Wrap>

      {/* Full-bleed visual */}
      <div
        className="relative h-[340px] w-full overflow-hidden sm:h-[500px]"
        style={{ background: NAVY }}
      >
        {HERO_IMG ? (
          <img
            src={HERO_IMG}
            alt="Kokohor families"
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            {[320, 560, 800, 1040].map((d) => (
              <span
                key={d}
                className="absolute left-1/2 top-1/2 rounded-full border border-white/10"
                style={{
                  width: d,
                  height: d,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
            <div className="absolute inset-0 grid place-items-center px-6">
              <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-center sm:grid-cols-4 sm:gap-x-14">
                {["Safety", "Heritage", "Connections", "Legacy"].map((w, i) => (
                  <span
                    key={w}
                    className="text-2xl font-semibold tracking-[-0.04em] sm:text-4xl"
                    style={{ color: i % 2 ? YELLOW : "#fff" }}
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Vision + stats */}
      <Wrap>
        <Row label="Our vision" first>
          <H2>
            To become the world's most trusted home for family connection and
            legacy.
          </H2>
          <Small className="mt-8 max-w-sm">
            Where no family's story, wisdom or heritage is ever lost. Good
            technology isn't just about features. It's about protecting people
            and what they leave behind.
          </Small>
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            <Stat n="$1.2T" label="Total addressable market" />
            <Stat n="30M+" label="Users targeted by 2032" />
            <Stat n="Dec 2026" label="Official public launch" />
          </div>
        </Row>
        <div className={`border-t ${LINE}`} />
      </Wrap>

      {/* Marquee */}
      <div
        className="overflow-hidden py-10"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        }}
        aria-hidden
      >
        <div className="kk-marquee flex w-max gap-14 whitespace-nowrap text-xl font-semibold tracking-[-0.03em] text-neutral-400">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>

      <AboutSections />

      {/* Founder quote, full-bleed */}
      <section style={{ background: NAVY }} className="text-white">
        <Wrap className="py-20 md:py-28">
          <p className="max-w-4xl text-3xl font-semibold leading-[1.1] tracking-[-0.04em] sm:text-6xl">
            When an elder dies, a library burns.{" "}
            <span style={{ color: YELLOW }}>
              Let us build the library that never burns.
            </span>
          </p>
          <p className="mt-10 text-sm font-medium">Benson Ogholi</p>
          <p className="text-xs text-white/60">Founder, Kokohor Circle</p>
        </Wrap>
      </section>

      {/* Contact */}
      <Wrap>
        <Row label="Contact" first>
          <H2>Reach out to our team for anything you need.</H2>
          <div className="mt-12">
            {[
              {
                l: "Email",
                v: "info@kokohorcircle.com",
                href: "mailto:info@kokohorcircle.com",
              },
              {
                l: "WhatsApp",
                v: "+44 7405 672016",
                href: "https://wa.me/447405672016",
              },
              { l: "Office", v: "5, Military Lane, Port Harcourt" },
              {
                l: "Website",
                v: "www.kokohorcircle.com",
                href: "https://www.kokohorcircle.com",
              },
            ].map((c, i) => (
              <div
                key={c.l}
                className={`flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between ${i ? `border-t ${LINE}` : ""}`}
              >
                <span className="text-xs text-neutral-500">{c.l}</span>
                {c.href ? (
                  <a
                    href={c.href}
                    className="text-lg font-medium tracking-[-0.02em] hover:underline"
                  >
                    {c.v}
                  </a>
                ) : (
                  <span className="text-lg font-medium tracking-[-0.02em]">
                    {c.v}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href={PLAY_STORE}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:brightness-105 active:scale-95"
              style={{ background: YELLOW }}
            >
              Get it on Android
            </a>
            <Link
              to="/faqs"
              className="inline-flex items-center gap-2 border-b border-neutral-900 pb-1 text-sm"
            >
              Read the FAQs <Arrow />
            </Link>
          </div>
        </Row>
      </Wrap>
    </main>
  );
}
