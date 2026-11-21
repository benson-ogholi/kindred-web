import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EMAIL, YELLOW } from "../home/shared";
import { Arrow, LINE, NAVY, PAPER, Rings, Small, Star, Wrap } from "../home/editorial";

const EASE = [0.2, 0.7, 0.2, 1] as const;

export type LegalSection = { title: string; body: string[] };

export default function LegalLayout({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  const rm = !!useReducedMotion();
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const formatNum = (idx: number) => String(idx + 1).padStart(2, "0");

  return (
    <main style={{ background: PAPER }} className="min-w-0 text-neutral-900">
      {/* Editorial Header */}
      <Wrap className="pb-12 pt-14 sm:pt-20 md:pt-24">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold tracking-wider">
          <span>/LEGAL/</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-300/90 bg-white/80 px-3.5 py-1 text-[11px] font-medium text-neutral-700">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: YELLOW }}
            />
            Last updated {updated}
          </span>
        </div>

        <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-[1.6fr_1fr] md:items-end md:gap-8">
          <motion.h1
            initial={rm ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: rm ? 0 : 0.6, ease: EASE }}
            className="text-4xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-6xl md:text-7xl"
          >
            {title}
            <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-900 sm:h-12 sm:w-12 md:h-14 md:w-14">
                <Star />
              </span>
              <span className="inline-block px-2" style={{ background: YELLOW }}>
                overview.
              </span>
            </span>
          </motion.h1>

          <Small className="max-w-sm md:pb-2">{intro}</Small>
        </div>
      </Wrap>

      {/* Main Content: Sticky TOC + Numbered Legal Sections */}
      <Wrap className="pb-20 md:pb-28">
        <div className="grid gap-8 lg:grid-cols-[17.5rem_1fr] lg:items-start lg:gap-14">
          {/* On This Page Navigation */}
          <aside className="min-w-0">
            <nav
              aria-label="On this page"
              className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:sticky lg:top-28 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0"
            >
              {sections.map((s, i) => {
                const isActive = activeIdx === i;
                return (
                  <a
                    key={s.title}
                    href={`#s${i + 1}`}
                    onClick={() => setActiveIdx(i)}
                    className={`flex shrink-0 items-center justify-between gap-3 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors lg:w-full lg:rounded-none lg:border-0 lg:border-t lg:px-0 lg:py-3.5 lg:text-sm ${LINE} ${
                      isActive
                        ? "border-neutral-900 bg-neutral-900 text-white lg:bg-transparent lg:font-semibold lg:text-neutral-900"
                        : "border-neutral-300/80 bg-white/60 text-neutral-600 hover:text-neutral-900 lg:bg-transparent lg:text-neutral-500"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span
                        className="hidden h-2 w-2 shrink-0 rounded-full lg:block"
                        style={{
                          background: isActive ? YELLOW : "transparent",
                        }}
                      />
                      <span className="whitespace-nowrap">{s.title}</span>
                    </span>
                    <span className="tabular-nums text-[11px] opacity-70">
                      {formatNum(i)}
                    </span>
                  </a>
                );
              })}
              <div className={`hidden border-t lg:block ${LINE}`} />
            </nav>
          </aside>

          {/* Sections */}
          <div className="min-w-0">
            <div className={`divide-y border-y ${LINE}`}>
              {sections.map((s, i) => (
                <motion.article
                  key={s.title}
                  id={`s${i + 1}`}
                  onFocus={() => setActiveIdx(i)}
                  onMouseEnter={() => setActiveIdx(i)}
                  initial={rm ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: rm ? 0 : 0.4,
                    delay: Math.min(i * 0.03, 0.2),
                    ease: EASE,
                  }}
                  className="scroll-mt-28 py-7 sm:py-9"
                >
                  <span className="text-xs font-semibold tabular-nums tracking-wider text-neutral-400">
                    /{formatNum(i)}/
                  </span>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-neutral-900 sm:text-2xl">
                    {i + 1}. {s.title}
                  </h2>
                  <div className="mt-3.5 space-y-3">
                    {s.body.map((p, pIdx) => (
                      <p
                        key={pIdx}
                        className="max-w-2xl text-sm leading-relaxed text-neutral-700 sm:text-base"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </Wrap>

      {/* Navy Contact Band */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: NAVY }}
      >
        <Rings />
        <Wrap className="relative py-16 sm:py-20 md:py-28">
          <p className="text-xs font-semibold tracking-wider">/QUESTIONS/</p>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.06] tracking-[-0.04em] sm:text-5xl md:text-6xl">
            Need clarification? Reach out to our team.
          </h2>
          <div className="mt-8 flex flex-col items-start gap-4 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:brightness-105 active:scale-95"
              style={{ background: YELLOW }}
            >
              Email us <Arrow />
            </a>
            <span className="break-all text-sm text-white/70 sm:break-normal">
              {EMAIL}
            </span>
          </div>
        </Wrap>
      </section>
    </main>
  );
}