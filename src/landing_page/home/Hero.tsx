import { motion } from "framer-motion";
import { Avatar, Icon, ICONS, IosSoon, PlayButton, YELLOW } from "./shared";
import { LINE, NAVY, PAPER, Row, Rings, Small, Star, Wrap, H2 } from "./editorial";

const audiences = ["Relatives", "Classmates", "Office teams", "Businesses", "Communities"];

const highlights = [
  { icon: ICONS.shield, title: "Safety Vault", body: "Critical info stays locked until your conditions are met." },
  { icon: ICONS.users, title: "Private Circles", body: "Family, friends and teams — each in their own space." },
  { icon: ICONS.lock, title: "You stay in control", body: "Nothing is shared by default. You decide everything." },
];

export default function Hero() {
  return (
    <section id="home" style={{ background: PAPER }} className="text-neutral-900">
      <Wrap className="pb-16 pt-14 md:pt-20">
        <p className="flex items-center gap-2 text-xs font-medium">
          <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: YELLOW }} />
          Live on Android, iOS coming soon
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.6fr_1fr] md:items-end">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-7xl"
          >
            Stay close to the
            <span className="mt-1 flex flex-wrap items-center gap-x-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-900 sm:h-14 sm:w-14">
                <Star />
              </span>
              <span>people who</span>
              <span className="px-2" style={{ background: YELLOW }}>matter.</span>
            </span>
          </motion.h1>

          <div className="md:pb-2">
            <Small className="max-w-xs">
              Kokohor is a private space for the circles you care about. Chat freely, keep family history safe, and
              protect what matters most with a{" "}
              <a href="#vault" className="font-semibold text-neutral-900 underline underline-offset-4">
                Safety Vault
              </a>{" "}
              designed around trust.
            </Small>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PlayButton />
              <IosSoon />
            </div>
          </div>
        </div>

        {/* Audiences */}
        <div className={`mt-16 grid grid-cols-2 border-t sm:grid-cols-5 ${LINE}`}>
          {audiences.map((a) => (
            <p key={a} className="py-4 text-sm font-medium text-neutral-700">
              {a}
            </p>
          ))}
        </div>
      </Wrap>

      {/* Full-bleed band */}
      <div className="relative overflow-hidden py-20 text-white md:py-28" style={{ background: NAVY }}>
        <Rings />
        <Wrap className="relative grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl">
              One app. Every circle.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Family, classmates, work teams and communities — each kept in its own private space, under your control.
            </p>
          </div>
          <div className="flex md:justify-end">
            <div className="flex -space-x-3">
              <Avatar label="MA" bg="bg-amber-300" />
              <Avatar label="TK" bg="bg-sky-300" />
              <Avatar label="OB" bg="bg-rose-300" />
              <Avatar label="CJ" bg="bg-emerald-300" />
              <Avatar label="+12" bg="bg-neutral-200 text-neutral-800 font-bold" />
            </div>
          </div>
        </Wrap>
      </div>

      <Wrap>
        <Row label="What you get" first>
          <H2>Private by default, in your control.</H2>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {highlights.map((h) => (
              <div key={h.title} className={`border-t pt-5 ${LINE}`}>
                <Icon d={h.icon} className="h-5 w-5" />
                <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em]">{h.title}</h3>
                <Small className="mt-1.5">{h.body}</Small>
              </div>
            ))}
          </div>
        </Row>
      </Wrap>
    </section>
  );
}