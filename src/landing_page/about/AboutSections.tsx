import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Icon, ICONS, YELLOW, YELLOW_SOFT } from "../home/shared";
import { ACCENT, LINE, NAVY, Small, Wrap } from "../home/editorial";

const EASE = [0.2, 0.7, 0.2, 1] as const;
const CAMERA = "M3 7h11a2 2 0 012 2v6a2 2 0 01-2 2H3zM16 10l5-3v10l-5-3";

/* ---------- helpers ---------- */

const Label = ({
  children,
  light = false,
}: {
  children: string;
  light?: boolean;
}) => (
  <p
    className={`text-xs font-medium ${light ? "text-white" : "text-neutral-900"}`}
  >
    /{children.toUpperCase()}/
  </p>
);

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const rm = !!useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={rm ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const rm = !!useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [v, setV] = useState(rm ? to : 0);
  useEffect(() => {
    if (!inView || rm) return;
    const c = animate(0, to, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (x) => setV(x),
    });
    return () => c.stop();
  }, [inView, to, rm]);
  return (
    <span ref={ref}>
      {Math.round(v).toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

/* ---------- 1. Mission: words darken as you scroll ---------- */

const MISSION =
  "A private, secure and organised space to communicate, protect what matters and pass it on.";

function ScrollWord({
  word,
  i,
  n,
  p,
  rm,
}: {
  word: string;
  i: number;
  n: number;
  p: MotionValue<number>;
  rm: boolean;
}) {
  const start = (i / n) * 0.85;
  const o = useTransform(p, [start, start + 0.12], [0.16, 1]);
  return (
    <motion.span
      style={{ opacity: rm ? 1 : o }}
      className="mr-[0.25em] inline-block"
    >
      {word}
    </motion.span>
  );
}

function Mission() {
  const rm = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });
  const words = MISSION.split(" ");
  return (
    <Wrap className="py-20 md:py-32">
      <Label>Our mission</Label>
      <div ref={ref}>
        <p className="mt-8 max-w-5xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
          {words.map((w, i) => (
            <ScrollWord
              key={i}
              word={w}
              i={i}
              n={words.length}
              p={scrollYProgress}
              rm={rm}
            />
          ))}
        </p>
      </div>
      <Reveal
        className={`mt-14 grid gap-6 border-t pt-6 md:grid-cols-[35%_1fr] ${LINE}`}
      >
        <span className="text-xs text-neutral-500">Why it matters</span>
        <Small className="max-w-sm">
          Every family deserves one place for its conversations, its safety
          plans and its history, kept for the generations that follow.
        </Small>
      </Reveal>
    </Wrap>
  );
}

/* ---------- 2. Core values: four colour panels ---------- */

const values = [
  {
    t: "Privacy",
    d: "Family life belongs to the family. We build for privacy and security first.",
    icon: ICONS.lock,
    bg: YELLOW,
    fg: "text-neutral-900",
    chip: "bg-black/10",
  },
  {
    t: "Legacy",
    d: "What is recorded today becomes the inheritance of tomorrow.",
    icon: ICONS.file,
    bg: NAVY,
    fg: "text-white",
    chip: "bg-white/10",
  },
  {
    t: "Connection",
    d: "Closer families, wherever in the world they live.",
    icon: ICONS.users,
    bg: "#E4E4E0",
    fg: "text-neutral-900",
    chip: "bg-black/10",
  },
  {
    t: "Safety",
    d: "Technology should help people stay safe, and be found, when it matters.",
    icon: ICONS.shield,
    bg: ACCENT,
    fg: "text-neutral-900",
    chip: "bg-black/10",
  },
];

function Values() {
  return (
    <Wrap className="py-16 md:py-24">
      <Label>Core values</Label>
      <Reveal>
        <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl">
          What drives us forward.
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v, i) => (
          <Reveal key={v.t} delay={i * 0.08} className="h-full">
            <div
              className={`group flex min-h-[340px] flex-col justify-between rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-2 ${v.fg}`}
              style={{ background: v.bg }}
            >
              <span
                className={`grid h-11 w-11 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-[360deg] ${v.chip}`}
              >
                <Icon d={v.icon} />
              </span>
              <div>
                <h3 className="text-3xl font-semibold tracking-[-0.04em]">
                  {v.t}
                </h3>
                <p className="mt-3 text-sm leading-relaxed opacity-75">{v.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Wrap>
  );
}

/* ---------- 3. Problems: sticky index + scrolling stories ---------- */

const problems = [
  {
    feature: "Safety Vault",
    icon: ICONS.shield,
    title: "When a meeting goes wrong, no one knows where to start.",
    problem:
      "Many workers face a serious risk of violence when they meet clients. When someone goes missing, families and investigators often have almost nothing to go on: no name, no address and no record of the conversation. The same gap affects anyone who meets a stranger, from online dating to marketplace sales and gig services.",
    solution:
      "Before a meeting, the user records the person's name, the address and the chat or call history, then sets a safety timer. If the user does not check in as safe, everything is released automatically to a pre-programmed trusted friend or relative. Loved ones can act quickly, and if the worst happens, investigators have vital leads.",
  },
  {
    feature: "Heritage Archive",
    icon: ICONS.file,
    title: "When an elder passes, a library burns down.",
    problem:
      "There is an African saying, often attributed to the Malian writer Amadou Hampâté Bâ: when an old man dies, a library burns. Each time an elder passes, a lifetime of unrecorded knowledge is lost for ever, including genealogy, oral tradition, folklore and cultural heritage.",
    solution:
      "The Heritage Archive lets families record the voices and stories of their elders and keep them safely in one place. Histories, songs, proverbs and traditions are preserved for generations yet unborn.",
  },
  {
    feature: "Safety Net",
    icon: ICONS.lock,
    title: "Vital information is often shared too late.",
    problem:
      "Parents often delay sharing the things that matter most with their children: outstanding debts, trusted allies, active projects, and the assets they own and where to find them. When death comes suddenly, this knowledge can be lost and families are left searching in the dark.",
    solution:
      "Kokohor's Safety Net lets users log vital information and choose who should receive it and when. On the chosen date, the information is securely handed to the intended recipient, so nothing important is left unsaid.",
  },
  {
    feature: "Family Hub",
    icon: ICONS.chat,
    title: "Family updates are buried in the noise.",
    problem:
      "Most families share news in WhatsApp groups. Important updates quickly sink beneath a pile of messages and become almost impossible to find months later.",
    solution:
      "Family Hub organises every update into clear sections: key dates, resolutions, tasks, polls, donations and more. Everything can be found again with a simple search, so decisions and commitments are never lost.",
  },
  {
    feature: "Family Tree",
    icon: ICONS.users,
    title: "Most families cannot trace their roots.",
    problem:
      "Most families cannot trace their lineage back even one hundred years. Names, relationships and origins fade with every generation.",
    solution:
      "With Family Tree, users document their lineage in one place and preserve it for the generations to come, so that future family members always know where they come from.",
  },
];

function Problems() {
  const [active, setActive] = useState(0);
  return (
    <Wrap className="py-16 md:py-24">
      <Label>Problems we solve</Label>
      <Reveal>
        <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl">
          Five problems. One private home.
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-[30%_1fr] lg:gap-20">
        {/* Sticky index */}
        <aside className="hidden lg:block">
          <nav className="sticky top-28" aria-label="Problems">
            {problems.map((p, i) => (
              <a
                key={p.feature}
                href={`#problem-${i}`}
                className={`relative flex items-center gap-3 border-t py-4 text-lg font-semibold tracking-[-0.03em] transition-colors ${LINE} ${
                  active === i
                    ? "text-neutral-900"
                    : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                <span className="relative grid h-3 w-3 place-items-center">
                  {active === i && (
                    <motion.span
                      layoutId="problem-dot"
                      className="absolute h-3 w-3 rounded-full"
                      style={{ background: YELLOW }}
                    />
                  )}
                </span>
                {p.feature}
              </a>
            ))}
            <div className={`border-t ${LINE}`} />
          </nav>
        </aside>

        {/* Stories */}
        <div className="space-y-24 md:space-y-32">
          {problems.map((p, i) => (
            <motion.article
              key={p.feature}
              id={`problem-${i}`}
              className="scroll-mt-28"
              onViewportEnter={() => setActive(i)}
              viewport={{ margin: "-45% 0px -45% 0px" }}
            >
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-neutral-300 py-1 pl-1 pr-4 text-xs font-medium">
                  <span
                    className="grid h-7 w-7 place-items-center rounded-full"
                    style={{ background: YELLOW }}
                  >
                    <Icon d={p.icon} className="h-3.5 w-3.5" />
                  </span>
                  {p.feature}
                </span>
                <h3 className="mt-6 text-3xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl">
                  {p.title}
                </h3>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-600">
                  {p.problem}
                </p>
              </Reveal>
              <Reveal delay={0.1} className="mt-8">
                <div
                  className="rounded-2xl p-6 sm:p-8"
                  style={{ background: YELLOW_SOFT }}
                >
                  <span
                    className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-neutral-900"
                    style={{ background: YELLOW }}
                  >
                    Our solution
                  </span>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-900 sm:text-base">
                    {p.solution}
                  </p>
                </div>
              </Reveal>
            </motion.article>
          ))}
        </div>
      </div>
    </Wrap>
  );
}

/* ---------- 4. Missing persons chart ---------- */

const missing = [
  { c: "Germany", v: 100 },
  { c: "Nigeria", v: 25 },
  { c: "UK", v: 300 },
  { c: "China", v: 500 },
  { c: "India", v: 750 },
  { c: "USA", v: 750 },
];

function Scale() {
  const rm = !!useReducedMotion();
  return (
    <Wrap className="py-8 md:py-16">
      <Label>The scale of the problem</Label>
      <div
        className="mt-8 rounded-3xl p-6 text-white sm:p-10"
        style={{ background: NAVY }}
      >
        <h3 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          Annual missing person reports
        </h3>
        <div className="mt-14 flex h-64 items-end gap-3 sm:gap-6">
          {missing.map((m, i) => (
            <div key={m.c} className="flex h-full flex-1 flex-col justify-end">
              <motion.div
                className="relative origin-bottom rounded-t-lg"
                style={{
                  height: `${(m.v / 800) * 100}%`,
                  minHeight: 6,
                  background:
                    m.c === "Nigeria" ? YELLOW : "rgba(255,255,255,0.22)",
                }}
                initial={rm ? false : { scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: i * 0.09, ease: EASE }}
              >
                <span className="absolute -top-6 left-0 right-0 text-center text-xs font-medium">
                  <CountUp to={m.v} suffix="K" />
                </span>
              </motion.div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-3 border-t border-white/15 pt-3 sm:gap-6">
          {missing.map((m) => (
            <span
              key={m.c}
              className={`flex-1 text-center text-[11px] ${m.c === "Nigeria" ? "font-semibold" : "text-white/60"}`}
              style={m.c === "Nigeria" ? { color: YELLOW } : undefined}
            >
              {m.c}
            </span>
          ))}
        </div>
        <p className="mt-8 max-w-xl text-[11px] leading-relaxed text-white/50">
          Sources: National Missing and Unidentified Persons System (NamUs),
          International Commission on Missing Persons (ICMP), International
          Committee of the Red Cross (ICRC). Figures approximate.
        </p>
      </div>
    </Wrap>
  );
}

/* ---------- 5. Everything else ---------- */

const features = [
  {
    t: "End-to-end video calls",
    d: "Face-to-face with your circle, privately.",
    icon: CAMERA,
  },
  {
    t: "End-to-end voice calls",
    d: "Clear, secure calls to the people who matter.",
    icon: ICONS.phone,
  },
  {
    t: "Secure family updates",
    d: "Share news, react and reply in a space that is only yours.",
    icon: ICONS.news,
  },
];

function Features() {
  return (
    <Wrap className="py-16 md:py-24">
      <Label>Everything else</Label>
      <Reveal>
        <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl">
          Stay in touch, privately.
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.t} delay={i * 0.1} className="h-full">
            <div className="group flex h-full min-h-[260px] flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 transition-colors duration-300 hover:border-transparent hover:bg-[#FFF3C2]">
              <div className="flex items-start justify-between">
                <span
                  className="grid h-12 w-12 place-items-center rounded-full text-neutral-900 transition-colors group-hover:bg-neutral-900 group-hover:text-white"
                  style={{ background: YELLOW }}
                >
                  <Icon d={f.icon} />
                </span>
                <span className="rounded-full border border-neutral-300 px-3 py-1 text-[11px] font-medium text-neutral-600">
                  Private
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.035em]">
                  {f.t}
                </h3>
                <Small className="mt-2 max-w-xs">{f.d}</Small>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Wrap>
  );
}

/* ---------- 6. Roadmap: line draws as you scroll ---------- */

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
  done: { label: "Done", dot: "#16a34a", chip: "bg-green-100 text-green-800" },
  progress: {
    label: "In progress",
    dot: ACCENT,
    chip: "bg-amber-100 text-amber-800",
  },
  upcoming: {
    label: "Upcoming",
    dot: "#a3a3a3",
    chip: "bg-neutral-200 text-neutral-600",
  },
};

function Roadmap() {
  const rm = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.6"],
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const done = roadmap.filter((r) => r.s === "done").length;

  return (
    <Wrap className="py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[35%_1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Label>Roadmap</Label>
          <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl">
            Where we have been, and what is next.
          </h2>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            {done} of {roadmap.length} milestones complete
          </p>
        </div>

        <div ref={ref} className="relative pl-9">
          <span
            className="absolute bottom-2 left-[7px] top-2 w-px bg-neutral-300"
            aria-hidden
          />
          <motion.span
            aria-hidden
            className="absolute left-[7px] top-2 w-px bg-neutral-900"
            style={{ height: rm ? "100%" : height, bottom: rm ? 8 : undefined }}
          />
          {roadmap.map((r, i) => (
            <motion.div
              key={r.what}
              initial={rm ? false : { opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
              className={`relative flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between ${i ? `border-t ${LINE}` : ""}`}
            >
              <span
                className="absolute -left-9 top-[34px] h-[15px] w-[15px] rounded-full border-2 border-white"
                style={{
                  background: STATUS[r.s].dot,
                  boxShadow: `0 0 0 1px ${STATUS[r.s].dot}`,
                }}
              />
              <div>
                <p className="text-xs text-neutral-500">{r.when}</p>
                <p
                  className={`mt-1 text-xl font-semibold tracking-[-0.03em] ${r.s === "upcoming" ? "text-neutral-600" : ""}`}
                >
                  {r.what}
                </p>
              </div>
              <span
                className={`w-fit rounded-full px-3 py-1 text-[11px] font-semibold ${STATUS[r.s].chip}`}
              >
                {STATUS[r.s].label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Wrap>
  );
}

/* ---------- 7. Growth: rising columns + count-up ---------- */

const milestones = [
  {
    to: 5000,
    suffix: "",
    l: "Active users",
    when: "April 2027",
    h: 150,
    bg: "rgba(255,255,255,0.08)",
    fg: "#fff",
  },
  {
    to: 1,
    suffix: "M",
    l: "Active users",
    when: "December 2028",
    h: 200,
    bg: "rgba(255,255,255,0.14)",
    fg: "#fff",
  },
  {
    to: 8,
    suffix: "M",
    l: "Active users",
    when: "December 2030",
    h: 260,
    bg: "rgba(255,255,255,0.22)",
    fg: "#fff",
  },
  {
    to: 30,
    suffix: "M+",
    l: "Active users",
    when: "December 2032",
    h: 330,
    bg: YELLOW,
    fg: "#171717",
  },
];

function Growth() {
  const rm = !!useReducedMotion();
  return (
    <section
      className="overflow-hidden py-16 text-white md:py-24"
      style={{ background: NAVY }}
    >
      <Wrap>
        <Label light>Growth to 2032</Label>
        <Reveal>
          <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl">
            More than 30 million active users by the end of 2032.
          </h2>
        </Reveal>

        <div
          className="mt-16 grid grid-cols-2 items-end gap-3 sm:gap-4 lg:grid-cols-4"
          style={{ minHeight: 330 }}
        >
          {milestones.map((m, i) => (
            <motion.div
              key={m.when}
              className="flex flex-col justify-between rounded-2xl p-5"
              style={{ background: m.bg, color: m.fg }}
              initial={rm ? false : { height: 0, opacity: 0 }}
              whileInView={{ height: m.h, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
            >
              <p className="text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                <CountUp to={m.to} suffix={m.suffix} />
              </p>
              <div>
                <p className="text-sm font-semibold">{m.l}</p>
                <p className="text-xs opacity-70">{m.when}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

/* ---------- 8. Long-term vision: a staircase ---------- */

const vision = [
  {
    y: "2033 to 2035",
    t: "Go public",
    h: 220,
    bg: "#E4E4E0",
    fg: "text-neutral-900",
  },
  {
    y: "2036 to 2038",
    t: "International expansion",
    h: 270,
    bg: YELLOW_SOFT,
    fg: "text-neutral-900",
  },
  {
    y: "2039 to 2041",
    t: "Global technology leadership",
    h: 320,
    bg: YELLOW,
    fg: "text-neutral-900",
  },
  {
    y: "2042 to 2045",
    t: "Global institutional expansion",
    h: 370,
    bg: ACCENT,
    fg: "text-neutral-900",
  },
  {
    y: "2046 and beyond",
    t: "Generational legacy",
    h: 420,
    bg: NAVY,
    fg: "text-white",
  },
];

function Vision() {
  return (
    <Wrap className="py-16 md:py-24">
      <Label>Long-term vision</Label>
      <Reveal>
        <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl">
          Built to last for generations.
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-3 sm:grid-cols-5 sm:items-end">
        {vision.map((v, i) => (
          <motion.div
            key={v.t}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
            className={`flex min-h-[170px] flex-col justify-between rounded-2xl p-5 sm:h-[var(--h)] ${v.fg}`}
            style={
              {
                background: v.bg,
                ["--h" as string]: `${v.h}px`,
              } as CSSProperties
            }
          >
            <p className="text-xs font-medium opacity-70">{v.y}</p>
            <h3 className="text-xl font-semibold leading-tight tracking-[-0.035em] sm:text-2xl">
              {v.t}
            </h3>
          </motion.div>
        ))}
      </div>
    </Wrap>
  );
}

/* ---------- 9. Team ---------- */

const team = [
  {
    n: "Benson Ogholi",
    r: "Founder / CEO",
    bg: YELLOW,
    fg: "text-neutral-900",
    img: "",
  },
  {
    n: "Ikenna Ibeneme",
    r: "Chief Technology Officer",
    bg: NAVY,
    fg: "text-white",
    img: "",
  },
  {
    n: "Kelechi Ulu",
    r: "Chief of Staff",
    bg: ACCENT,
    fg: "text-neutral-900",
    img: "",
  },
  {
    n: "Stephano Bove",
    r: "Quality Assurance",
    bg: "#E4E4E0",
    fg: "text-neutral-900",
    img: "",
  },
];
const initials = (n: string) =>
  n
    .split(" ")
    .map((p) => p[0])
    .join("");

function Team() {
  return (
    <Wrap className="py-16 md:py-24">
      <Label>The team</Label>
      <Reveal>
        <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl">
          The people building Kokohor.
        </h2>
      </Reveal>
      <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {team.map((t, i) => (
          <Reveal key={t.n} delay={i * 0.08}>
            <div
              className={`group relative aspect-[4/5] overflow-hidden rounded-2xl ${t.fg}`}
              style={{ background: t.bg }}
            >
              {t.img ? (
                <img
                  src={t.img}
                  alt={t.n}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center text-7xl font-medium tracking-[-0.06em] opacity-30 transition-transform duration-500 group-hover:scale-110">
                  {initials(t.n)}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 translate-y-1 bg-gradient-to-t from-black/40 to-transparent p-4 pt-12 text-white transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="text-base font-semibold tracking-[-0.02em]">
                  {t.n}
                </h3>
                <p className="text-xs text-white/80">{t.r}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Wrap>
  );
}

/* ---------- composed ---------- */

export default function AboutSections() {
  return (
    <>
      <Mission />
      <Values />
      <Problems />
      <Scale />
      <Features />
      <Roadmap />
      <Growth />
      <Vision />
      <Team />
    </>
  );
}
