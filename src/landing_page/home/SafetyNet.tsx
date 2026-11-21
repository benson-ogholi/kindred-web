import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Avatar, Icon, ICONS, YELLOW, YELLOW_SOFT } from "./shared";
import { Arrow, LINE, NAVY, PAPER, Rings, Small, Wrap } from "./editorial";

const EASE = [0.2, 0.7, 0.2, 1] as const;

const steps = [
  {
    num: "01",
    title: "Fill your vault",
    body: "Add whereabouts, emergency contacts, medical notes, documents and personal instructions.",
  },
  {
    num: "02",
    title: "Set your terms",
    body: "Choose what triggers release — missed check-ins, a specific date, or a manual unlock.",
  },
  {
    num: "03",
    title: "Assign your people",
    body: "Select who can receive access. Update or remove them whenever you want.",
  },
  {
    num: "04",
    title: "Access opens only then",
    body: "When your conditions are met, the right people are notified. Until then, they see nothing.",
  },
];

const stores = [
  {
    icon: ICONS.pin,
    title: "Whereabouts",
    body: "Trips, travel routes and where you’ll be.",
  },
  {
    icon: ICONS.heart,
    title: "Medical details",
    body: "Allergies, conditions, blood group and medication.",
  },
  {
    icon: ICONS.phone,
    title: "Emergency contacts",
    body: "Doctors, employers and people to call first.",
  },
  {
    icon: ICONS.file,
    title: "Documents",
    body: "IDs, policies, property papers and account notes.",
  },
  {
    icon: ICONS.users,
    title: "Instructions",
    body: "What to do for kids, pets, business or home.",
  },
  {
    icon: ICONS.mail,
    title: "Personal messages",
    body: "Words you want your family to receive.",
  },
];

const triggers = [
  {
    icon: ICONS.clock,
    title: "Missed check-in",
    body: "You don’t confirm you’re okay within the time you set — for example 48 hours.",
  },
  {
    icon: ICONS.calendar,
    title: "Scheduled date",
    body: "Release on a date you choose, like the end of a long trip.",
  },
  {
    icon: ICONS.shield,
    title: "Manual release",
    body: "Open the vault yourself whenever you need to.",
  },
];

const initialRecipients = [
  {
    id: "ada",
    name: "Ada Okoye",
    role: "Sister",
    initials: "AO",
    bg: "bg-amber-300",
    enabled: true,
  },
  {
    id: "bayo",
    name: "Bayo Okoye",
    role: "Brother",
    initials: "BO",
    bg: "bg-sky-300",
    enabled: true,
  },
  {
    id: "chidi",
    name: "Chidi Eze",
    role: "Colleague",
    initials: "CE",
    bg: "bg-emerald-300",
    enabled: false,
  },
];

const checkInWindows = ["24 hours", "48 hours", "72 hours"];

export default function SafetyVault() {
  const rm = !!useReducedMotion();
  const [windowIdx, setWindowIdx] = useState(1);
  const [recipients, setRecipients] = useState(initialRecipients);
  const [savedNotice, setSavedNotice] = useState(false);

  const activeRecipients = recipients.filter((r) => r.enabled);
  const selectedWindow = checkInWindows[windowIdx];

  const toggleRecipient = (id: string) => {
    setSavedNotice(false);
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    );
  };

  return (
    <section
      id="vault"
      style={{ background: PAPER }}
      className="py-24 text-neutral-900 md:py-32"
    >
      <Wrap>
        {/* Editorial Header */}
        <p className="text-xs font-medium">/SAFETY VAULT/</p>
        <div className="mt-6 grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-end">
          <motion.h2
            initial={rm ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE }}
            className="text-4xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-6xl"
          >
            A safety net that works{" "}
            <span className="inline-block px-2" style={{ background: YELLOW }}>
              when you can’t.
            </span>
          </motion.h2>
          <Small className="max-w-sm md:pb-1">
            The Safety Vault keeps critical information secure and delivers it
            to the people you trust — only on the terms you set.
          </Small>
        </div>

        {/* Navy Stage + Phone Preview */}
        <motion.div
          initial={rm ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ background: NAVY }}
          className="relative mt-14 overflow-hidden rounded-[2rem] p-8 text-white md:p-12"
        >
          <Rings />
          <div className="relative grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-white/60">
                /YOUR TERMS/
              </p>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Private by default. Open only on your rules.
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
                Nothing is shared automatically. You choose what goes inside,
                who can receive it, and the exact condition that unlocks it.
              </p>

              <ul className="mt-7 space-y-3 text-sm text-white/90">
                {[
                  "Private until your conditions are met",
                  "Assign one person or your trusted circle",
                  "Update or revoke access at any time",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-neutral-900"
                      style={{ background: YELLOW }}
                    >
                      <Icon d={ICONS.check} className="h-3.5 w-3.5" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSavedNotice(true)}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:brightness-105 active:scale-[0.98]"
                  style={{ background: YELLOW }}
                >
                  Save vault rules <Arrow />
                </button>
                {savedNotice && (
                  <span
                    className="text-xs font-medium"
                    style={{ color: YELLOW }}
                  >
                    Preview updated: {selectedWindow} ·{" "}
                    {activeRecipients.length} assigned
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Phone Mock */}
            <div className="mx-auto w-full max-w-[290px]">
              <div className="rounded-[2.25rem] border-[8px] border-neutral-900 bg-white p-4 text-neutral-900 shadow-xl">
                <div className="mx-auto mb-4 h-4 w-20 rounded-full bg-neutral-900" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium text-neutral-400">
                      Safety Vault
                    </p>
                    <p className="text-base font-semibold tracking-[-0.02em]">
                      Release terms
                    </p>
                  </div>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-700">
                    Armed
                  </span>
                </div>

                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="rounded-2xl bg-neutral-100 p-3">
                    <p className="text-neutral-500">Missed check-in window</p>
                    <div className="mt-2 flex gap-1.5">
                      {checkInWindows.map((win, idx) => {
                        const active = idx === windowIdx;
                        return (
                          <button
                            key={win}
                            type="button"
                            onClick={() => {
                              setWindowIdx(idx);
                              setSavedNotice(false);
                            }}
                            className="rounded-lg px-2 py-1 font-semibold transition"
                            style={
                              active
                                ? { background: YELLOW_SOFT, color: "#171717" }
                                : { background: "#FFFFFF", color: "#525252" }
                            }
                          >
                            {win}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-neutral-100 p-3">
                    <p className="text-neutral-500">Assigned recipients</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center -space-x-1.5">
                        {activeRecipients.length > 0 ? (
                          activeRecipients.map((r) => (
                            <Avatar key={r.id} label={r.initials} bg={r.bg} />
                          ))
                        ) : (
                          <span className="text-neutral-400">
                            None selected
                          </span>
                        )}
                      </div>
                      <span className="truncate font-medium text-neutral-800">
                        {activeRecipients.length > 0
                          ? activeRecipients
                              .map((r) => r.name.split(" ")[0])
                              .join(", ")
                          : "Select below"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-neutral-100 p-3">
                    <p className="text-neutral-500">Vault contents</p>
                    <p className="mt-1 font-semibold text-neutral-800">
                      Location, medical notes, documents
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How It Works — Numbered Editorial Strip */}
        <div className="mt-24">
          <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-end border-neutral-200">
            <div>
              <p className="text-xs font-medium">/HOW IT WORKS/</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Four steps to quiet readiness
              </h3>
            </div>
            <Small className="max-w-xs">
              Built so nothing leaks early and your people get clarity when it
              counts.
            </Small>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={rm ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45, ease: EASE }}
                className={`border-b py-7 sm:pr-6 lg:border-b-0 lg:border-r lg:last:border-r-0 ${
                  i > 0 ? "lg:pl-6" : ""
                } ${LINE}`}
              >
                <span
                  className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-neutral-900"
                  style={{ background: i === 3 ? YELLOW : "#ffffff" }}
                >
                  {s.num}
                </span>
                <h4 className="mt-4 text-lg font-semibold tracking-[-0.025em]">
                  {s.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What You Can Keep — 3-Column Editorial Grid */}
        <div className="mt-24">
          <p className="text-xs font-medium">/VAULT CONTENTS/</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            What you can keep in it
          </h3>
          <Small className="mt-2 max-w-lg">
            Everything your family would struggle to piece together in an urgent
            moment, kept in one structured place.
          </Small>

          <div
            className={`mt-10 grid border-t border-l sm:grid-cols-2 lg:grid-cols-3 ${LINE}`}
          >
            {stores.map((item, i) => (
              <motion.div
                key={item.title}
                initial={rm ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: Math.min(i * 0.05, 0.25),
                  duration: 0.4,
                  ease: EASE,
                }}
                className={`group border-r border-b bg-white/60 p-6 transition-colors hover:bg-white ${LINE}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-neutral-900">
                    <Icon d={item.icon} className="h-5 w-5" />
                  </span>
                  <span
                    className="h-2 w-2 rounded-full opacity-40 transition-opacity group-hover:opacity-100"
                    style={{ background: YELLOW }}
                  />
                </div>
                <h4 className="mt-5 text-lg font-semibold tracking-[-0.02em]">
                  {item.title}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Triggers + Access Controls */}
        <div className="mt-24 grid gap-8 lg:grid-cols-2">
          {/* Release Triggers */}
          <div className={`border-t pt-8 ${LINE}`}>
            <p className="text-xs font-medium">/RELEASE TRIGGERS/</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Pick what opens the vault
            </h3>

            <div className="mt-6 divide-y divide-neutral-200 border-b border-neutral-200">
              {triggers.map((t) => (
                <div key={t.title} className="flex items-start gap-4 py-5">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-neutral-300 bg-white text-neutral-900">
                    <Icon d={t.icon} className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold tracking-[-0.02em] text-neutral-900">
                      {t.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                      {t.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recipient Access */}
          <div className={`border-t pt-8 ${LINE}`}>
            <p className="text-xs font-medium">/TRUSTED ACCESS/</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Choose who gets access
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              Toggle who can receive vault access when a trigger fires.
            </p>

            <div className="mt-6 divide-y divide-neutral-200 border-b border-neutral-200">
              {recipients.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => toggleRecipient(person.id)}
                  aria-pressed={person.enabled}
                  className="flex w-full items-center justify-between py-4 text-left transition hover:bg-black/[0.02]"
                >
                  <div className="flex items-center gap-3.5">
                    <Avatar label={person.initials} bg={person.bg} />
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {person.name}
                      </p>
                      <p className="text-xs text-neutral-500">{person.role}</p>
                    </div>
                  </div>

                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full border transition ${
                      person.enabled
                        ? "border-neutral-900 text-neutral-900"
                        : "border-neutral-300 text-transparent"
                    }`}
                    style={person.enabled ? { background: YELLOW } : undefined}
                  >
                    <Icon d={ICONS.check} className="h-3.5 w-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  );
}
