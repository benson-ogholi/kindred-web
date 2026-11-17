
import { motion } from "framer-motion";
import {
  Avatar,
  Card,
  Icon,
  ICONS,
  IconBadge,
  SectionHeading,
  YELLOW,
  YELLOW_SOFT,
  YELLOW_TINT,
} from "./shared";

const steps = [
  {
    title: "Fill your vault",
    body: "Add whereabouts, emergency contacts, medical notes, documents and personal instructions.",
    tint: "bg-[#FFF8E7]", // soft yellow
  },
  {
    title: "Set your terms",
    body: "Choose what triggers release — missed check-ins, a specific date, or a manual unlock.",
    tint: "bg-[#F0F7FF]", // faint blue
  },
  {
    title: "Assign your people",
    body: "Select who can receive access. Update or remove them whenever you want.",
    tint: "bg-[#F8F0FF]", // faint purple
  },
  {
    title: "Access opens only then",
    body: "When your conditions are met, the right people are notified. Until then, they see nothing.",
    tint: "bg-[#F0FFF4]", // faint green
  },
];

const stores = [
  {
    icon: ICONS.pin,
    title: "Whereabouts",
    body: "Trips, travel routes and where you’ll be.",
    tint: "bg-[#FFF8E7]",
  },
  {
    icon: ICONS.heart,
    title: "Medical details",
    body: "Allergies, conditions, blood group and medication.",
    tint: "bg-[#FFF0F3]", // faint pink
  },
  {
    icon: ICONS.phone,
    title: "Emergency contacts",
    body: "Doctors, employers and people to call first.",
    tint: "bg-[#F0F7FF]",
  },
  {
    icon: ICONS.file,
    title: "Documents",
    body: "IDs, policies, property papers and account notes.",
    tint: "bg-[#F8F0FF]",
  },
  {
    icon: ICONS.users,
    title: "Instructions",
    body: "What to do for kids, pets, business or home.",
    tint: "bg-[#F0FFF4]",
  },
  {
    icon: ICONS.mail,
    title: "Personal messages",
    body: "Words you want your family to receive.",
    tint: "bg-[#FFF8E7]",
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

export default function SafetyVault() {
  return (
    <section id="vault" className="bg-white py-24">
      <SectionHeading
        title="A safety net that works when you can’t"
        body="The Safety Vault keeps critical information secure and delivers it to the people you trust — only on the terms you set."
      />

      {/* Main Feature Card */}
      <div className="mx-auto mt-14 max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[2rem] p-8 md:p-12"
          style={{ background: YELLOW_TINT }}
        >
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <IconBadge d={ICONS.shield} />
              <h3 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl text-neutral-900">
                Your vault, your terms
              </h3>
              <p className="mt-4 max-w-md text-neutral-600 leading-relaxed">
                Nothing is shared by default. You decide what goes in, who can
                receive it, and exactly what makes it open.
              </p>
              <ul className="mt-7 space-y-3.5 text-sm text-neutral-800">
                {[
                  "Private until your conditions are met",
                  "Assign one person or the whole family",
                  "Update or remove access at any time",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-neutral-900"
                      style={{ background: YELLOW }}
                    >
                      <Icon d={ICONS.check} className="h-3.5 w-3.5" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Phone Mock */}
            <div className="mx-auto w-full max-w-[280px]">
              <div className="rounded-[2.25rem] border-[8px] border-neutral-900 bg-white p-4">
                <div className="mx-auto mb-5 h-5 w-20 rounded-full bg-neutral-900" />
                <p className="text-xs text-neutral-500">Safety Vault</p>
                <p className="text-base font-semibold text-neutral-900">
                  Release terms
                </p>

                <div className="mt-4 space-y-2.5">
                  <div className="rounded-2xl bg-neutral-100 p-3.5 text-sm">
                    <span className="text-neutral-500">
                      If I miss check-ins for
                    </span>
                    <span
                      className="ml-2 rounded-lg px-2 py-0.5 font-semibold"
                      style={{ background: YELLOW_SOFT }}
                    >
                      48 hours
                    </span>
                  </div>

                  <div className="rounded-2xl bg-neutral-100 p-3.5 text-sm">
                    <span className="text-neutral-500">Share with</span>
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar label="AO" bg="bg-amber-300" />
                      <Avatar label="BO" bg="bg-sky-300" />
                      <span className="text-xs text-neutral-500">
                        Ada and Bayo
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-neutral-100 p-3.5 text-sm">
                    <span className="text-neutral-500">Contains</span>
                    <p className="mt-1 font-medium text-neutral-800">
                      Location, medical, documents
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 text-sm font-semibold">
                  <button
                    type="button"
                    className="rounded-xl bg-neutral-100 py-2.5 text-neutral-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-xl py-2.5 text-neutral-900"
                    style={{ background: YELLOW }}
                  >
                    Save terms
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* How it works */}
      <div className="mx-auto mt-28 max-w-6xl px-6">
        <h3 className="text-center text-3xl font-semibold tracking-tight md:text-4xl text-neutral-900">
          How the vault works
        </h3>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`rounded-3xl p-6 ${s.tint}`}
            >
              <span
                className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-neutral-900"
                style={{ background: YELLOW }}
              >
                {i + 1}
              </span>
              <h4 className="mt-5 text-lg font-semibold text-neutral-900">
                {s.title}
              </h4>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* What you can store */}
      <div className="mx-auto mt-28 max-w-6xl px-6">
        <h3 className="text-3xl font-semibold tracking-tight md:text-4xl text-neutral-900">
          What you can keep in it
        </h3>
        <p className="mt-3 max-w-xl text-neutral-600">
          Everything your family would struggle to find in an emergency — kept
          in one protected place.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Card className={`h-full  ${s.tint}`}>
                <IconBadge d={s.icon} />
                <h4 className="mt-5 text-lg font-semibold text-neutral-900">
                  {s.title}
                </h4>
                <p className="mt-1.5 text-sm text-neutral-600">{s.body}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Triggers + Access */}
      <div className="mx-auto mt-28 grid max-w-6xl gap-5 px-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] bg-[#F0F7FF] p-8" // faint blue
        >
          <IconBadge d={ICONS.clock} tone="white" />
          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-900">
            Pick what opens the vault
          </h3>
          <div className="mt-6 space-y-3">
            {triggers.map((t) => (
              <div
                key={t.title}
                className="flex gap-4 rounded-2xl bg-white p-4 border border-neutral-200/60"
              >
                <span className="mt-0.5 text-neutral-900">
                  <Icon d={t.icon} />
                </span>
                <div>
                  <p className="font-semibold text-neutral-900">{t.title}</p>
                  <p className="text-sm text-neutral-600 mt-0.5">{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-[2rem] bg-[#F8F0FF] p-8" // faint purple
        >
          <IconBadge d={ICONS.users} tone="white" />
          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-900">
            Choose who gets access
          </h3>
          <p className="mt-2 text-neutral-600">
            Assign trusted members. You stay in full control of the list.
          </p>
          <div className="mt-6 space-y-2.5">
            {[
              { n: "Ada Okoye", r: "Sister", on: true },
              { n: "Bayo Okoye", r: "Brother", on: true },
              { n: "Chidi Eze", r: "Colleague", on: false },
            ].map((m) => (
              <div
                key={m.n}
                className="flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 text-sm border border-neutral-200/60"
              >
                <div>
                  <p className="font-semibold text-neutral-900">{m.n}</p>
                  <p className="text-xs text-neutral-500">{m.r}</p>
                </div>
                <span
                  className={`grid h-5 w-5 place-items-center rounded-md border ${
                    m.on
                      ? "border-transparent text-neutral-900"
                      : "border-neutral-300"
                  }`}
                  style={m.on ? { background: YELLOW } : undefined}
                >
                  {m.on && <Icon d={ICONS.check} className="h-3.5 w-3.5" />}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
