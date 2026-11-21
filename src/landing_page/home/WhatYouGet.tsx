import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Avatar, Icon, ICONS, YELLOW } from "./shared";
import { LINE, NAVY, Wrap } from "./editorial";

const SLIDE_MS = 5500;

/* ---------- right-hand panels ---------- */

function VaultPanel({ rm }: { rm: boolean }) {
  const conditions = [
    { i: ICONS.clock, t: "No check-in for 48 hours" },
    { i: ICONS.calendar, t: "Or on a date you choose" },
    { i: ICONS.shield, t: "Or when you unlock it yourself" },
  ];

  return (
    <div className="w-full max-w-sm rounded-xl bg-white p-5 text-neutral-900 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-3">
        <motion.span
          initial={rm ? false : { scale: 0.8, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 20 }}
          className="grid h-11 w-11 place-items-center rounded-full bg-neutral-900 text-white"
        >
          <Icon d={ICONS.lock} />
        </motion.span>
        <div>
          <p className="text-base font-semibold tracking-[-0.02em]">Vault locked</p>
          <p className="text-xs text-neutral-500">Private until your conditions are met</p>
        </div>
      </div>

      <div className="mt-5 space-y-2.5 text-sm">
        {conditions.map((c, idx) => (
          <motion.div
            key={c.t}
            initial={rm ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.08, duration: 0.35, ease: "easeOut" }}
            whileHover={rm ? undefined : { x: 3 }}
            className="flex items-center gap-3 rounded-lg bg-[#F3F3F1] px-3 py-2.5 transition-colors hover:bg-[#ECECE8]"
          >
            <Icon d={c.i} className="h-4 w-4 shrink-0 text-neutral-700" />
            <span className="flex-1">{c.t}</span>
            <span className="rounded bg-white px-2 py-0.5 text-[11px] font-medium text-neutral-500 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              Not met
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-[11px] text-neutral-500">
          <span>Next check-in</span>
          <span>due in 46 hours</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#E6E6E2]">
          <motion.div
            className="h-full origin-left rounded-full"
            style={{ background: YELLOW, width: "92%" }}
            initial={rm ? { scaleX: 1 } : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: rm ? 0 : 0.9, delay: rm ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

function CirclesPanel({ rm }: { rm: boolean }) {
  const rows = [
    {
      n: "Relatives",
      c: "12 members",
      a: [
        ["MA", "bg-amber-300"],
        ["TK", "bg-sky-300"],
        ["OB", "bg-rose-300"],
      ],
    },
    {
      n: "Classmates",
      c: "28 members",
      a: [
        ["CJ", "bg-emerald-300"],
        ["AO", "bg-amber-300"],
        ["BO", "bg-sky-300"],
      ],
    },
    {
      n: "Office",
      c: "9 members",
      a: [
        ["TK", "bg-sky-300"],
        ["MA", "bg-amber-300"],
        ["CJ", "bg-emerald-300"],
      ],
    },
  ];

  return (
    <div className="w-full max-w-sm space-y-3">
      {rows.map((r, i) => (
        <motion.div
          key={r.n}
          initial={rm ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={rm ? undefined : { y: -2, scale: 1.01 }}
          transition={{ delay: 0.08 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between rounded-xl bg-white/10 p-4 text-white backdrop-blur transition-colors hover:bg-white/15"
        >
          <div>
            <p className="text-base font-semibold tracking-[-0.02em]">{r.n}</p>
            <p className="text-xs text-white/60">{r.c}</p>
          </div>
          <div className="flex -space-x-3">
            {r.a.map(([l, bg], k) => (
              <motion.div
                key={k}
                initial={rm ? false : { scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.16 + i * 0.08 + k * 0.05, duration: 0.25 }}
              >
                <Avatar label={l} bg={bg} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
      <motion.p
        initial={rm ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="pt-1 text-center text-xs text-white/60"
      >
        Each circle has its own members, news and chats.
      </motion.p>
    </div>
  );
}

function ControlPanel({ rm }: { rm: boolean }) {
  const rows = ["Whereabouts", "Medical details", "Documents", "Personal messages"];
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});

  const toggle = (label: string) =>
    setEnabled((prev) => ({ ...prev, [label]: !prev[label] }));

  const activeCount = Object.values(enabled).filter(Boolean).length;

  return (
    <div className="w-full max-w-sm rounded-xl bg-white p-5 text-neutral-900 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
      <p className="text-base font-semibold tracking-[-0.02em]">Sharing</p>
      <p className="text-xs text-neutral-500">Everything is off until you turn it on</p>

      <div className="mt-4">
        {rows.map((r, i) => {
          const isOn = !!enabled[r];
          return (
            <button
              key={r}
              type="button"
              onClick={() => toggle(r)}
              aria-pressed={isOn}
              className={`flex w-full items-center justify-between py-3 text-left text-sm transition-colors hover:text-neutral-700 ${
                i ? `border-t ${LINE}` : ""
              }`}
            >
              <span>{r}</span>
              <span
                className="relative flex h-5 w-9 items-center rounded-full p-0.5 transition-colors duration-200"
                style={{ background: isOn ? "#171717" : "#D9D9D5" }}
                aria-hidden
              >
                <motion.span
                  layout={!rm}
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  className="h-4 w-4 rounded-full bg-white shadow"
                  style={{
                    marginLeft: isOn ? "auto" : "0",
                  }}
                />
              </span>
            </button>
          );
        })}
      </div>

      <motion.p
        key={activeCount}
        initial={rm ? false : { opacity: 0.6, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-3 rounded-lg bg-[#F3F3F1] px-3 py-2 text-xs text-neutral-600"
      >
        Shared with:{" "}
        <span className="font-semibold text-neutral-900">
          {activeCount === 0
            ? "nobody yet"
            : `${activeCount} ${activeCount === 1 ? "category" : "categories"} selected`}
        </span>
      </motion.p>
    </div>
  );
}

/* ---------- section ---------- */

const items: {
  title: string;
  body: string;
  icon: string;
  bg: string;
  panel: (rm: boolean) => ReactNode;
}[] = [
  {
    title: "Safety Vault",
    body: "Critical info stays locked until your conditions are met.",
    icon: ICONS.shield,
    bg: YELLOW,
    panel: (rm) => <VaultPanel rm={rm} />,
  },
  {
    title: "Private Circles",
    body: "Family, friends and teams — each in their own space.",
    icon: ICONS.users,
    bg: NAVY,
    panel: (rm) => <CirclesPanel rm={rm} />,
  },
  {
    title: "You stay in control",
    body: "Nothing is shared by default. You decide everything.",
    icon: ICONS.lock,
    bg: "#E4E4E0",
    panel: (rm) => <ControlPanel rm={rm} />,
  },
];

export default function WhatYouGet() {
  const rm = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance (off for reduced motion, and while the person is interacting)
  useEffect(() => {
    if (rm || paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % items.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [active, paused, rm]);

  return (
    <Wrap className="py-16 md:py-24">
      <motion.div
        initial={rm ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-medium text-neutral-900">/WHAT YOU GET/</p>
        <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl">
          Private by default, in your control.
        </h2>
      </motion.div>

      <motion.div
        initial={rm ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Selector */}
        <div role="tablist" aria-label="What you get" className="self-start">
          {items.map((it, i) => {
            const on = i === active;
            return (
              <motion.button
                key={it.title}
                role="tab"
                aria-selected={on}
                type="button"
                whileTap={rm ? undefined : { scale: 0.992 }}
                onClick={() => setActive(i)}
                className={`relative block w-full border-t py-6 text-left ${LINE} ${
                  i === items.length - 1 ? "border-b" : ""
                }`}
              >
                {/* progress line for the active row */}
                {on && (
                  <motion.span
                    key={`${active}-${paused}`}
                    className="absolute -top-px left-0 h-px bg-neutral-900"
                    initial={{ width: rm || paused ? "100%" : "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: rm || paused ? 0 : SLIDE_MS / 1000,
                      ease: "linear",
                    }}
                  />
                )}
                <div className="flex items-start gap-4">
                  <motion.span
                    animate={rm ? undefined : { scale: on ? 1.05 : 1 }}
                    transition={{ type: "spring", stiffness: 360, damping: 24 }}
                    className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-200 ${
                      on ? "text-neutral-900" : "bg-neutral-200 text-neutral-500"
                    }`}
                    style={on ? { background: YELLOW } : undefined}
                  >
                    <Icon d={it.icon} className="h-4 w-4" />
                  </motion.span>
                  <div>
                    <h3
                      className={`text-3xl font-semibold tracking-[-0.04em] transition-colors duration-200 sm:text-4xl ${
                        on ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
                      }`}
                    >
                      {it.title}
                    </h3>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.p
                          initial={rm ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: rm ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden text-sm leading-relaxed text-neutral-600"
                        >
                          <span className="block pt-3">{it.body}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Visual */}
        <div
          role="tabpanel"
          className="relative grid min-h-[380px] place-items-center overflow-hidden rounded-2xl p-6 transition-colors duration-500 sm:min-h-[420px]"
          style={{ background: items[active].bg }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={rm ? false : { opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={rm ? undefined : { opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: rm ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="flex w-full justify-center"
            >
              {items[active].panel(rm)}
            </motion.div>
          </AnimatePresence>
          <span
            className="absolute bottom-4 right-5 text-xs font-medium"
            style={{
              color: active === 1 ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
            }}
          >
            {active + 1} / {items.length}
          </span>
        </div>
      </motion.div>
    </Wrap>
  );
}