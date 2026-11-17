
import { motion } from "framer-motion";
import {
  Avatar,
  Card,
  Icon,
  ICONS,
  IconBadge,
  PlayButton,
  IosSoon,
  YELLOW,
  YELLOW_TINT,
} from "./shared";

const audiences = [
  { label: "Relatives", tint: "bg-[#FFF8E7]" },
  { label: "Classmates", tint: "bg-[#F0F7FF]" },
  { label: "Office teams", tint: "bg-[#F8F0FF]" },
  { label: "Businesses", tint: "bg-[#F0FFF4]" },
  { label: "Communities", tint: "bg-[#FFF0F3]" },
];

const highlights = [
  {
    icon: ICONS.shield,
    title: "Safety Vault",
    body: "Critical info stays locked until your conditions are met.",
    tint: "bg-[#FFF8E7]",
  },
  {
    icon: ICONS.users,
    title: "Private Circles",
    body: "Family, friends and teams — each in their own space.",
    tint: "bg-[#F0F7FF]",
  },
  {
    icon: ICONS.lock,
    title: "You stay in control",
    body: "Nothing is shared by default. You decide everything.",
    tint: "bg-[#F8F0FF]",
  },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white pb-24 pt-14 md:pt-20"
    >
      {/* Soft background wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${YELLOW_TINT}, transparent)`,
        }}
      />

      {/* Header */}
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-neutral-700">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ background: YELLOW }}
            />
            Live on Android · iOS coming soon
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-7 text-balance text-5xl font-bold tracking-tight text-neutral-900 md:text-7xl leading-[1.05]"
        >
          Stay close to the people who matter
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-neutral-600 leading-relaxed"
        >
          Kokohor is a private space for the circles you care about. Chat
          freely, keep family history safe, and protect what matters most with a{" "}
          <a
            href="#vault"
            className="font-semibold text-neutral-900 hover:underline"
          >
            Safety Vault
          </a>{" "}
          designed around trust.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <PlayButton />
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <IosSoon />
          </motion.div>
        </motion.div>

        {/* Audience pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5"
        >
          {audiences.map((a, i) => (
            <motion.span
              key={a.label}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className={`rounded-full border border-neutral-200/80 px-4 py-1.5 text-xs font-medium text-neutral-700 ${a.tint}`}
            >
              {a.label}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Highlight cards */}
      <div className="relative mx-auto mt-16 max-w-6xl px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.45 }}
            >
              <Card className={`h-full border border-neutral-200/70 ${h.tint}`}>
                <div
                  className="grid h-11 w-11 place-items-center rounded-2xl text-neutral-900"
                  style={{ background: YELLOW }}
                >
                  <Icon d={h.icon} className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-neutral-900">
                  {h.title}
                </h3>
                <p className="mt-1.5 text-sm text-neutral-600 leading-relaxed">
                  {h.body}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom feature strip */}
      <div className="relative mx-auto mt-6 max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="overflow-hidden rounded-[2rem] p-8 md:p-10"
          style={{ background: YELLOW_TINT }}
        >
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <IconBadge d={ICONS.shield} />
              <h3 className="mt-5 text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
                One app. Every circle.
              </h3>
              <p className="mt-3 max-w-md text-neutral-600 leading-relaxed">
                Family, classmates, work teams and communities — each kept in
                its own private space, under your control.
              </p>
            </div>

            <div className="flex items-center justify-center md:justify-end">
              <div className="flex -space-x-3">
                <Avatar label="MA" bg="bg-amber-300" />
                <Avatar label="TK" bg="bg-sky-300" />
                <Avatar label="OB" bg="bg-rose-300" />
                <Avatar label="CJ" bg="bg-emerald-300" />
                <Avatar
                  label="+12"
                  bg="bg-neutral-200 text-neutral-800 font-bold"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
