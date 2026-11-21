import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EMAIL, Icon, ICONS, YELLOW } from "../home/shared";
import { Arrow, LINE, NAVY, PAPER, Rings, Small, Star, Wrap } from "../home/editorial";

const EASE = [0.2, 0.7, 0.2, 1] as const;

interface PolicySection {
  id: string;
  num: string;
  title: string;
  body: string[];
  hasDraftBracket?: boolean;
}

const sections: PolicySection[] = [
  {
    id: "who-we-are",
    num: "01",
    title: "Who we are",
    body: [
      `Kokohor is operated by [company name], [address]. You can reach us at ${EMAIL}.`,
    ],
    hasDraftBracket: true,
  },
  {
    id: "information-we-collect",
    num: "02",
    title: "Information we collect",
    body: [
      "Account details, such as your name, phone number or email, and profile photo.",
      "Content you create, such as messages, voice notes, group news, polls and call activity.",
      "Safety Vault information you choose to add, such as whereabouts, emergency contacts, medical notes and documents, along with the release terms and the people you assign.",
      "Device and usage information, such as device type, app version and crash reports. [Confirm exactly what is collected, including location if used.]",
    ],
    hasDraftBracket: true,
  },
  {
    id: "how-we-use-your-information",
    num: "03",
    title: "How we use your information",
    body: [
      "To run Kokohor: create your account, deliver messages and calls, show circle content and operate the Safety Vault according to your terms.",
      "To keep the app safe, fix problems, improve features and contact you about your account or important updates.",
    ],
  },
  {
    id: "safety-vault-information",
    num: "04",
    title: "Safety Vault information",
    body: [
      "Vault information is yours. It is made available only to the people you assign, and only when the terms you set are met. We do not use it to advertise to you. [Confirm storage and security details before publishing.]",
    ],
    hasDraftBracket: true,
  },
  {
    id: "who-we-share-information-with",
    num: "05",
    title: "Who we share information with",
    body: [
      "We share content with the members of the circles you choose. We use service providers, such as hosting and notification providers, who process data on our behalf. We may disclose information if the law requires it or to protect people’s safety. We do not sell your personal information.",
    ],
  },
  {
    id: "how-long-we-keep-it",
    num: "06",
    title: "How long we keep it",
    body: [
      "We keep your information while your account is active. When you delete your account, we delete or anonymise your information within [period], unless the law requires us to keep it longer.",
    ],
    hasDraftBracket: true,
  },
  {
    id: "your-rights",
    num: "07",
    title: "Your rights",
    body: [
      `Under the Nigeria Data Protection Act 2023 and other applicable laws, you may have the right to access, correct, delete or object to the use of your personal data, and to withdraw consent. To use these rights, email ${EMAIL}.`,
    ],
  },
  {
    id: "security",
    num: "08",
    title: "Security",
    body: [
      "We take reasonable steps to protect your information. No system is completely secure, so please use a strong password and keep your device safe.",
    ],
  },
  {
    id: "children",
    num: "09",
    title: "Children",
    body: [
      "Kokohor is not intended for children under [18 / confirm]. If you believe a child has given us information, contact us and we will remove it.",
    ],
    hasDraftBracket: true,
  },
  {
    id: "changes-to-this-policy",
    num: "10",
    title: "Changes to this policy",
    body: [
      "We may update this policy. If the changes are important, we will let you know in the app or by email.",
    ],
  },
  {
    id: "contact",
    num: "11",
    title: "Contact",
    body: [`For privacy questions or requests, email ${EMAIL}.`],
  },
];

/* DRAFT TEMPLATE: describe only what the app really does. Have a lawyer review and fill every [bracket]. */
export default function PrivacyPolicy() {
  const rm = !!useReducedMotion();
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string>(sections[0].id);

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.body.some((p) => p.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <main style={{ background: PAPER }} className="min-w-0 text-neutral-900">
      {/* Header & Search */}
      <Wrap className="pb-10 pt-14 sm:pt-20 md:pt-24">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold tracking-wider">
          <span>/PRIVACY POLICY/</span>
          <span className="rounded-full border border-neutral-300 bg-white/80 px-3 py-1 text-[11px] font-medium text-neutral-600">
            Last updated: [date]
          </span>
        </div>

        <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-[1.6fr_1fr] md:items-end md:gap-8">
          <motion.h1
            initial={rm ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: rm ? 0 : 0.6, ease: EASE }}
            className="text-4xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-6xl md:text-7xl"
          >
            Privacy
            <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-900 sm:h-12 sm:w-12 md:h-14 md:w-14">
                <Star />
              </span>
              <span className="inline-block px-2" style={{ background: YELLOW }}>
                policy.
              </span>
            </span>
          </motion.h1>

          <Small className="max-w-sm md:pb-2">
            This policy explains what information Kokohor collects, why, and the
            choices you have.
          </Small>
        </div>

        {/* Search Input */}
        <div className={`mt-10 flex items-center gap-3 border-b pb-4 md:mt-14 ${LINE}`}>
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
          <label htmlFor="privacy-search" className="sr-only">
            Search privacy policy sections
          </label>
          <input
            id="privacy-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sections or topics"
            className="min-w-0 flex-1 bg-transparent text-lg tracking-[-0.02em] outline-none placeholder:text-neutral-400 sm:text-2xl"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-neutral-700 transition hover:bg-black/5 hover:text-neutral-900"
            >
              Clear
            </button>
          )}
        </div>
      </Wrap>

      {/* Body: Sticky Section Index + Policy Articles */}
      <Wrap className="pb-20 md:pb-28">
        <div className="grid gap-8 lg:grid-cols-[17.5rem_1fr] lg:items-start lg:gap-14">
          {/* Responsive Section Index */}
          <aside className="min-w-0">
            <nav
              aria-label="Privacy policy sections"
              className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:sticky lg:top-28 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0"
            >
              {sections.map((s) => {
                const isActive = activeId === s.id;
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setActiveId(s.id)}
                    className={`group flex shrink-0 items-center justify-between gap-3 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors lg:w-full lg:rounded-none lg:border-0 lg:border-t lg:px-0 lg:py-3.5 lg:text-sm ${LINE} ${
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
                      {s.num}
                    </span>
                  </a>
                );
              })}
              <div className={`hidden border-t lg:block ${LINE}`} />
            </nav>
          </aside>

          {/* Policy Content */}
          <div className="min-w-0">
            {filteredSections.length === 0 ? (
              <div
                className="rounded-2xl border bg-white p-6 sm:p-8"
                style={{ borderColor: "rgba(23,23,23,0.12)" }}
              >
                <p className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                  No matching policy sections.
                </p>
                <Small className="mt-2 max-w-sm">
                  Try another search term or contact{" "}
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
              <div className={`divide-y border-y ${LINE}`}>
                {filteredSections.map((sec, i) => (
                  <motion.article
                    key={sec.id}
                    id={sec.id}
                    onFocus={() => setActiveId(sec.id)}
                    onMouseEnter={() => setActiveId(sec.id)}
                    initial={rm ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: rm ? 0 : 0.4,
                      delay: Math.min(i * 0.03, 0.2),
                      ease: EASE,
                    }}
                    className="scroll-mt-28 py-7 sm:py-8"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold tabular-nums tracking-wider text-neutral-400">
                        /{sec.num}/
                      </span>
                      {sec.hasDraftBracket && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3C2] px-2.5 py-0.5 text-[11px] font-medium text-neutral-900">
                          <Icon d={ICONS.shield} className="h-3 w-3" />
                          Draft bracket to confirm
                        </span>
                      )}
                    </div>

                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-neutral-900 sm:text-2xl">
                      {sec.title}
                    </h2>

                    <div className="mt-3.5 space-y-3">
                      {sec.body.map((paragraph, idx) => (
                        <p
                          key={idx}
                          className="max-w-2xl text-sm leading-relaxed text-neutral-700 sm:text-base"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </Wrap>

      {/* Contact Band */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: NAVY }}
      >
        <Rings />
        <Wrap className="relative py-16 sm:py-20 md:py-28">
          <p className="text-xs font-semibold tracking-wider">/DATA REQUESTS & SUPPORT/</p>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.06] tracking-[-0.04em] sm:text-5xl md:text-6xl">
            Questions about your data? Reach out directly.
          </h2>
          <div className="mt-8 flex flex-col items-start gap-4 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:brightness-105 active:scale-95"
              style={{ background: YELLOW }}
            >
              Email privacy team <Arrow />
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