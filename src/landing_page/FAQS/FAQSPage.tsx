import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EMAIL, Icon, ICONS, YELLOW } from "../home/shared";
import {
  Arrow,
  LINE,
  NAVY,
  PAPER,
  Rings,
  Small,
  Star,
  Wrap,
} from "../home/editorial";

const EASE = [0.2, 0.7, 0.2, 1] as const;

const groups = [
  {
    title: "General",
    items: [
      {
        q: "What is Kokohor?",
        a: "Kokohor is a mobile app for families and the groups that feel like family. You can chat, send voice notes, share news, run polls and use a Safety Vault for critical information.",
      },
      {
        q: "Which devices does it work on?",
        a: "Kokohor is available on Android now. iOS is coming soon.",
      },
      {
        q: "Who is it for?",
        a: "Anyone who wants a private space for their people: relatives, old classmates, coworkers, business teams and communities.",
      },
    ],
  },
  {
    title: "Safety Vault",
    items: [
      {
        q: "What is the Safety Vault?",
        a: "A protected place for things like your whereabouts, emergency contacts, medical notes and documents. You assign the people who can receive access and set the terms that open it.",
      },
      {
        q: "What can trigger a release?",
        a: "You set the terms, for example missing a check-in for a period you choose. Until those terms are met, nobody you assigned can see what’s inside.",
      },
      {
        q: "Can I change who has access?",
        a: "Yes. You can edit what’s in your vault, update your terms and add or remove people at any time.",
      },
      {
        q: "Does the vault replace emergency services?",
        a: "No. In an emergency, call your local emergency number first.",
      },
    ],
  },
  {
    title: "Circles, chats and calls",
    items: [
      {
        q: "What is a circle?",
        a: "A private group for a set of people, such as your family, your class or your team. Each circle has its own members, news, polls and chats.",
      },
      {
        q: "Can I be in more than one circle?",
        a: "Yes. Family, classmates and work can each have their own circle and stay separate.",
      },
      {
        q: "Do voice notes and calls work?",
        a: "Voice notes are available. Calling is in beta, so it may change or have issues while we improve it.",
      },
    ],
  },
  {
    title: "Help and privacy",
    items: [
      {
        q: "How is my information handled?",
        a: "Read our Privacy Policy for the details. You decide what you share and with whom.",
      },
      {
        q: "How do I contact you?",
        a: `Email ${EMAIL} and we’ll get back to you.`,
      },
    ],
  },
];

const total = groups.reduce((n, g) => n + g.items.length, 0);

export default function FaqsPage() {
  const rm = !!useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  // Apply category + search filters
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .filter((g) => category === "All" || g.title === category)
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (f) =>
            !q ||
            f.q.toLowerCase().includes(q) ||
            f.a.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [category, query]);

  const shown = visible.reduce((n, g) => n + g.items.length, 0);
  const tabs = [
    { title: "All", count: total },
    ...groups.map((g) => ({ title: g.title, count: g.items.length })),
  ];

  return (
    <main style={{ background: PAPER }} className="text-neutral-900">
      {/* Header */}
      <Wrap className="pb-10 pt-16 md:pt-24">
        <p className="text-xs font-medium">/FAQS/</p>
        <div className="mt-8 grid gap-8 md:grid-cols-[1.6fr_1fr] md:items-end">
          <motion.h1
            initial={rm ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-7xl"
          >
            Questions,
            <span className="mt-1 flex flex-wrap items-center gap-x-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-900 sm:h-14 sm:w-14">
                <Star />
              </span>
              <span className="px-2" style={{ background: YELLOW }}>
                answered.
              </span>
            </span>
          </motion.h1>
          <Small className="max-w-xs md:pb-2">
            Everything about Kokohor, the Safety Vault and circles, in one
            place.
          </Small>
        </div>

        {/* Search */}
        <div className={`mt-14 flex items-center gap-3 border-b pb-4 ${LINE}`}>
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0 text-neutral-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <label htmlFor="faq-search" className="sr-only">
            Search questions
          </label>
          <input
            id="faq-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the questions"
            className="w-full bg-transparent text-xl tracking-[-0.02em] outline-none placeholder:text-neutral-400 sm:text-2xl"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="shrink-0 text-xs font-medium underline underline-offset-4"
            >
              Clear
            </button>
          )}
        </div>
      </Wrap>

      {/* Body */}
      <Wrap className="pb-20 md:pb-28">
        <div className="grid gap-8 lg:grid-cols-[28%_1fr] lg:gap-16">
          {/* Categories */}
          <aside>
            <nav
              aria-label="Categories"
              className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-28 lg:block lg:overflow-visible lg:pb-0"
            >
              {tabs.map((t) => {
                const on = category === t.title;
                return (
                  <button
                    key={t.title}
                    type="button"
                    onClick={() => setCategory(t.title)}
                    aria-pressed={on}
                    className={`relative flex shrink-0 items-center justify-between gap-3 rounded-full border px-4 py-2 text-sm font-medium transition-colors lg:w-full lg:rounded-none lg:border-0 lg:border-t lg:px-0 lg:py-4 lg:text-lg lg:font-semibold lg:tracking-[-0.03em] ${LINE} ${
                      on
                        ? "border-neutral-900 text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="relative hidden h-3 w-3 lg:block">
                        {on && (
                          <motion.span
                            layoutId="faq-dot"
                            className="absolute inset-0 rounded-full"
                            style={{ background: YELLOW }}
                          />
                        )}
                      </span>
                      {t.title}
                    </span>
                    <span className="text-xs font-normal text-neutral-400">
                      {t.count}
                    </span>
                  </button>
                );
              })}
              <div className={`hidden border-t lg:block ${LINE}`} />
            </nav>
          </aside>

          {/* Questions */}
          <div>
            <p className="text-xs text-neutral-500" aria-live="polite">
              {shown} {shown === 1 ? "question" : "questions"}
              {query ? ` matching “${query.trim()}”` : ""}
            </p>

            {shown === 0 ? (
              <div className="mt-10 rounded-2xl bg-white p-8">
                <p className="text-2xl font-semibold tracking-[-0.04em]">
                  Nothing matches that search.
                </p>
                <Small className="mt-2 max-w-sm">
                  Try a different word, or write to us at{" "}
                  <a
                    className="font-semibold text-neutral-900 underline underline-offset-4"
                    href={`mailto:${EMAIL}`}
                  >
                    {EMAIL}
                  </a>
                  .
                </Small>
              </div>
            ) : (
              visible.map((g) => (
                <section key={g.title} className="mt-10 first:mt-6">
                  <h2 className="text-xs font-medium">
                    /{g.title.toUpperCase()}/
                  </h2>
                  <div className={`mt-4 border-b ${LINE}`}>
                    {g.items.map((f, i) => {
                      const id = `${g.title}-${f.q}`;
                      const isOpen = open === id;
                      return (
                        <motion.div
                          key={id}
                          initial={rm ? false : { opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: Math.min(i * 0.05, 0.25),
                            ease: EASE,
                          }}
                          className={`border-t ${LINE}`}
                        >
                          <h3>
                            <button
                              type="button"
                              onClick={() => setOpen(isOpen ? null : id)}
                              aria-expanded={isOpen}
                              aria-controls={`panel-${id}`}
                              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                            >
                              <span
                                className={`text-xl font-semibold leading-snug tracking-[-0.035em] transition-colors sm:text-2xl ${isOpen ? "text-neutral-900" : "text-neutral-800 group-hover:text-neutral-900"}`}
                              >
                                {f.q}
                              </span>
                              <span
                                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                                  isOpen
                                    ? "rotate-45 bg-neutral-900 text-white"
                                    : "text-neutral-900 group-hover:scale-110"
                                }`}
                                style={
                                  isOpen ? undefined : { background: YELLOW }
                                }
                              >
                                <Icon d={ICONS.plus} className="h-4 w-4" />
                              </span>
                            </button>
                          </h3>
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                id={`panel-${id}`}
                                role="region"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: rm ? 0 : 0.3,
                                  ease: EASE,
                                }}
                                className="overflow-hidden"
                              >
                                <p className="max-w-xl pb-7 pr-12 text-base leading-relaxed text-neutral-600">
                                  {f.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </Wrap>

      {/* Help band */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: NAVY }}
      >
        <Rings />
        <Wrap className="relative py-20 md:py-28">
          <p className="text-xs font-medium">/STILL NEED HELP?/</p>
          <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl">
            Can’t find your answer? Write to us.
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-neutral-900 transition hover:brightness-105 active:scale-95"
              style={{ background: YELLOW }}
            >
              Email us <Arrow />
            </a>
            <span className="text-sm text-white/60">{EMAIL}</span>
          </div>
        </Wrap>
      </section>
    </main>
  );
}
