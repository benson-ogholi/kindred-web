import { Link } from "react-router-dom";
import { PLAY_STORE, YELLOW } from "../home/shared";

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

const values = [
  {
    t: "Privacy",
    d: "Family life belongs to the family. We build for privacy and security first.",
  },
  {
    t: "Legacy",
    d: "What is recorded today becomes the inheritance of tomorrow.",
  },
  { t: "Connection", d: "Closer families, wherever in the world they live." },
  {
    t: "Safety",
    d: "Technology should help people stay safe, and be found, when it matters.",
  },
];

const problems = [
  {
    feature: "Safety Vault",
    title: "When a meeting goes wrong, no one knows where to start.",
    problem:
      "Many workers face a serious risk of violence when they meet clients. When someone goes missing, families and investigators often have almost nothing to go on: no name, no address and no record of the conversation. The same gap affects anyone who meets a stranger, from online dating to marketplace sales and gig services.",
    solution:
      "Before a meeting, the user records the person's name, the address and the chat or call history, then sets a safety timer. If the user does not check in as safe, everything is released automatically to a pre-programmed trusted friend or relative. Loved ones can act quickly, and if the worst happens, investigators have vital leads.",
  },
  {
    feature: "Heritage Archive",
    title: "When an elder passes, a library burns down.",
    problem:
      "There is an African saying, often attributed to the Malian writer Amadou Hampâté Bâ: when an old man dies, a library burns. Each time an elder passes, a lifetime of unrecorded knowledge is lost for ever, including genealogy, oral tradition, folklore and cultural heritage.",
    solution:
      "The Heritage Archive lets families record the voices and stories of their elders and keep them safely in one place. Histories, songs, proverbs and traditions are preserved for generations yet unborn.",
  },
  {
    feature: "Safety Net",
    title: "Vital information is often shared too late.",
    problem:
      "Parents often delay sharing the things that matter most with their children: outstanding debts, trusted allies, active projects, and the assets they own and where to find them. When death comes suddenly, this knowledge can be lost and families are left searching in the dark.",
    solution:
      "Kokohor's Safety Net lets users log vital information and choose who should receive it and when. On the chosen date, the information is securely handed to the intended recipient, so nothing important is left unsaid.",
  },
  {
    feature: "Family Hub",
    title: "Family updates are buried in the noise.",
    problem:
      "Most families share news in WhatsApp groups. Important updates quickly sink beneath a pile of messages and become almost impossible to find months later.",
    solution:
      "Family Hub organises every update into clear sections: key dates, resolutions, tasks, polls, donations and more. Everything can be found again with a simple search, so decisions and commitments are never lost.",
  },
  {
    feature: "Family Tree",
    title: "Most families cannot trace their roots.",
    problem:
      "Most families cannot trace their lineage back even one hundred years. Names, relationships and origins fade with every generation.",
    solution:
      "With Family Tree, users document their lineage in one place and preserve it for the generations to come, so that future family members always know where they come from.",
  },
];

const missing = [
  { c: "Germany", v: 100 },
  { c: "Nigeria", v: 25 },
  { c: "UK", v: 300 },
  { c: "China", v: 500 },
  { c: "India", v: 750 },
  { c: "USA", v: 750 },
];

const features = [
  {
    t: "End-to-end video calls",
    d: "Face-to-face with your circle, privately.",
  },
  {
    t: "End-to-end voice calls",
    d: "Clear, secure calls to the people who matter.",
  },
  {
    t: "Secure family updates",
    d: "Share news, react and reply in a space that is only yours.",
  },
];

const roadmap = [
  { when: "Jan to Apr 2025", what: "Company incorporated", s: "done" },
  { when: "May to Dec 2025", what: "Application development", s: "done" },
  { when: "Jan to Mar 2026", what: "Live on Google Play Store", s: "done" },
  { when: "Apr to Nov 2026", what: "Core team formation", s: "progress" },
  { when: "Sept to Nov 2026", what: "Selection of advisors", s: "progress" },
  {
    when: "Nov to Dec 2026",
    what: "Launch on the Apple App Store",
    s: "upcoming",
  },
  { when: "December 2026", what: "Official public launch", s: "upcoming" },
] as const;

const STATUS = {
  done: { label: "Done", dot: "#16a34a" },
  progress: { label: "In progress", dot: ACCENT },
  upcoming: { label: "Upcoming", dot: "#a3a3a3" },
};

const milestones = [
  { n: "5,000", l: "Active users, April 2027" },
  { n: "1M", l: "Active users, December 2028" },
  { n: "8M", l: "Active users, December 2030" },
  { n: "30M+", l: "Active users, December 2032" },
];

const vision = [
  { y: "2033 to 2035", t: "Go public" },
  { y: "2036 to 2038", t: "International expansion" },
  { y: "2039 to 2041", t: "Global technology leadership" },
  { y: "2042 to 2045", t: "Global institutional expansion" },
  { y: "2046 and beyond", t: "Generational legacy" },
];

const team = [
  { n: "Benson Ogholi", r: "Founder / CEO" },
  { n: "Ikenna Ibeneme", r: "Chief Technology Officer" },
  { n: "Kelechi Ulu", r: "Chief of Staff" },
  { n: "Stephano Bove", r: "Quality Assurance" },
];

const initials = (n: string) =>
  n
    .split(" ")
    .map((p) => p[0])
    .join("");

/* ---------- page ---------- */

export default function About() {
  return (
    <main className="bg-[#ffffff] text-neutral-900">
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

      {/* Mission */}
      <Wrap>
        <div className="pb-6 pt-16">
          <h2 className="max-w-md text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-3xl">
            This is how we help families stay close.
          </h2>
        </div>
        <Row label="Our mission">
          <H2>
            A private, secure and organised space to communicate, protect what
            matters and pass it on.
          </H2>
          <Small className="mt-8 max-w-sm">
            Every family deserves one place for its conversations, its safety
            plans and its history, kept for the generations that follow.
          </Small>
        </Row>

        {/* Values */}
        <Row label="Core values">
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.t} className={`border-t pt-5 ${LINE}`}>
                <h3 className="text-xl font-semibold tracking-[-0.03em]">
                  {v.t}
                </h3>
                <Small className="mt-2 max-w-xs">{v.d}</Small>
              </div>
            ))}
          </div>
        </Row>

        {/* Problems */}
        {problems.map((p) => (
          <Row key={p.feature} label={p.feature}>
            <h3 className="text-3xl font-semibold leading-[1.1] tracking-[-0.04em] sm:text-4xl">
              {p.title}
            </h3>
            <Small className="mt-6 max-w-lg">{p.problem}</Small>
            <div className={`mt-8 max-w-lg border-t pt-5 ${LINE}`}>
              <p className="text-xs font-medium" style={{ color: ACCENT }}>
                Our solution
              </p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-900">
                {p.solution}
              </p>
            </div>
          </Row>
        ))}

        {/* Missing persons chart */}
        <Row label="The scale of the problem">
          <h3 className="text-2xl font-semibold tracking-[-0.04em]">
            Annual missing person reports
          </h3>
          <div
            className={`mt-8 flex h-48 items-end gap-3 border-b sm:gap-6 ${LINE}`}
          >
            {missing.map((m) => (
              <div
                key={m.c}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <span className="mb-1 text-center text-[11px] text-neutral-600">
                  {m.v}K
                </span>
                <div
                  style={{
                    height: `${(m.v / 800) * 100}%`,
                    minHeight: 4,
                    background: ACCENT,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3 sm:gap-6">
            {missing.map((m) => (
              <span
                key={m.c}
                className="flex-1 text-center text-[11px] text-neutral-600"
              >
                {m.c}
              </span>
            ))}
          </div>
          <p className="mt-6 max-w-lg text-[11px] leading-relaxed text-neutral-500">
            Sources: National Missing and Unidentified Persons System (NamUs),
            International Commission on Missing Persons (ICMP), International
            Committee of the Red Cross (ICRC). Figures approximate.
          </p>
        </Row>

        {/* Other features */}
        <Row label="Everything else">
          <div className="space-y-0">
            {features.map((f, i) => (
              <div
                key={f.t}
                className={`flex flex-col justify-between gap-1 py-5 sm:flex-row sm:items-baseline ${i ? `border-t ${LINE}` : ""}`}
              >
                <h3 className="text-xl font-semibold tracking-[-0.03em]">
                  {f.t}
                </h3>
                <Small className="max-w-xs">{f.d}</Small>
              </div>
            ))}
          </div>
        </Row>

        {/* Roadmap */}
        <Row label="Roadmap">
          <div>
            {roadmap.map((r, i) => (
              <div
                key={r.what}
                className={`grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 py-4 sm:grid-cols-[9rem_1fr_auto] sm:items-center ${i ? `border-t ${LINE}` : ""}`}
              >
                <span className="text-xs text-neutral-500 sm:order-none">
                  {r.when}
                </span>
                <span className="col-span-2 row-start-2 text-base font-medium tracking-[-0.02em] sm:col-span-1 sm:row-start-auto">
                  {r.what}
                </span>
                <span className="flex items-center gap-2 text-xs text-neutral-700">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: STATUS[r.s].dot }}
                  />
                  {STATUS[r.s].label}
                </span>
              </div>
            ))}
          </div>
        </Row>

        {/* Growth */}
        <Row label="Growth to 2032">
          <H2>More than 30 million active users by the end of 2032.</H2>
          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {milestones.map((m) => (
              <Stat key={m.n} n={m.n} label={m.l} />
            ))}
          </div>
        </Row>

        {/* Long-term vision */}
        <Row label="Long-term vision">
          <div>
            {vision.map((v, i) => (
              <div
                key={v.y}
                className={`flex flex-col justify-between gap-1 py-5 sm:flex-row sm:items-baseline ${i ? `border-t ${LINE}` : ""}`}
              >
                <h3 className="text-xl font-semibold tracking-[-0.03em]">
                  {v.t}
                </h3>
                <span className="text-xs text-neutral-500">{v.y}</span>
              </div>
            ))}
          </div>
        </Row>

        {/* Team */}
        <Row label="The team">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {team.map((t) => (
              <div key={t.n}>
                {/* Swap this block for an <img> when real photos are available */}
                <div className="grid aspect-[4/5] place-items-center bg-[#E6E6E2] text-4xl font-medium tracking-[-0.05em] text-neutral-400">
                  {initials(t.n)}
                </div>
                <h3 className="mt-3 text-base font-semibold tracking-[-0.02em]">
                  {t.n}
                </h3>
                <p className="text-xs text-neutral-600">{t.r}</p>
              </div>
            ))}
          </div>
        </Row>
      </Wrap>

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
