import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Avatar,
  Icon,
  ICONS,
  IosSoon,
  PlayButton,
  YELLOW,
  YELLOW_SOFT,
} from "./shared";
import {
  ACCENT,
  LINE,
  NAVY,
  PAPER,
  Rings,
  Small,
  Star,
  Wrap,
} from "./editorial";
import WhatYouGet from "./WhatYouGet";
import padimanRouteLogo from "../../assets/brands/padiman-route.png";
import padimanUtilityLogo from "../../assets/brands/padiman-utility.png";
import fufuLogo from "../../assets/brands/fufu.png";

/* Optional: set to a real app screenshot (portrait) to replace the coded phone screen. */
const APP_SCREENSHOT = "";

const audiences = [
  "Relatives",
  "Classmates",
  "Office teams",
  "Businesses",
  "Communities",
];

const supporters = [
  {
    name: "Padiman Route",
    logo: padimanRouteLogo,
  },
  {
    name: "Padiman Utility",
    logo: padimanUtilityLogo,
  },
  {
    name: "Fufunova Foods",
    logo: fufuLogo,
  },
];

const EASE = [0.2, 0.7, 0.2, 1] as const;

/* One word of the headline, rising out of a mask */
function Word({
  children,
  delay,
  rm,
}: {
  children: ReactNode;
  delay: number;
  rm: boolean;
}) {
  return (
    <span
      className="inline-block overflow-hidden py-[0.08em] align-bottom"
      style={{ marginBottom: "-0.08em" }}
    >
      <motion.span
        className="inline-block"
        initial={rm ? false : { y: "115%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.65, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* Small floating notification card around the phone */
function Float({
  className,
  delay,
  rm,
  children,
}: {
  className: string;
  delay: number;
  rm: boolean;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={`absolute z-10 ${className}`}
      initial={rm ? false : { opacity: 0, scale: 0.9, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      <motion.div
        animate={rm ? undefined : { y: [0, -9, 0] }}
        transition={{
          duration: 5 + delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center gap-3 rounded-xl bg-white p-3 pr-5 text-neutral-900 shadow-[0_14px_40px_-12px_rgba(0,0,0,0.45)]"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function PhoneScreen() {
  if (APP_SCREENSHOT)
    return (
      <img
        src={APP_SCREENSHOT}
        alt="Kokohor app"
        className="h-full w-full object-cover object-top"
      />
    );
  return (
    <div className="p-4">
      <div className="mx-auto mb-4 h-5 w-20 rounded-full bg-neutral-900" />
      <p className="text-[11px] text-neutral-500">Latest circle updates</p>
      <p className="text-base font-semibold tracking-[-0.03em]">Okoye Family</p>

      <div className="mt-4 rounded-xl p-3" style={{ background: PAPER }}>
        <div className="flex items-center gap-2">
          <Avatar label="TK" bg="bg-sky-300" />
          <div>
            <p className="text-xs font-semibold">Tunde Kalu</p>
            <p className="text-[10px] text-neutral-500">2h ago</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-neutral-800">
          Family reunion is confirmed for December 27.
        </p>
        <div className="mt-2 flex gap-3 text-[10px] text-neutral-500">
          <span className="inline-flex items-center gap-1">
            <Icon d={ICONS.heart} className="h-3 w-3" /> 24
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon d={ICONS.chat} className="h-3 w-3" /> 9
          </span>
        </div>
      </div>

      <div className="mt-3 rounded-xl p-3" style={{ background: PAPER }}>
        <p className="text-xs font-semibold">
          Where should we hold the reunion?
        </p>
        {[
          { l: "Port Harcourt", v: 58 },
          { l: "Abuja", v: 27 },
        ].map((o) => (
          <div key={o.l} className="mt-2">
            <div className="flex justify-between text-[10px] text-neutral-600">
              <span>{o.l}</span>
              <span className="font-semibold" style={{ color: ACCENT }}>
                {o.v}%
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#E1E1DD]">
              <div
                className="h-full rounded-full"
                style={{ width: `${o.v}%`, background: YELLOW }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-3 flex items-center gap-3 rounded-xl p-3"
        style={{ background: YELLOW_SOFT }}
      >
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
          style={{ background: YELLOW }}
        >
          <Icon d={ICONS.shield} className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-semibold">Safety Vault armed</p>
          <p className="text-[10px] text-neutral-600">
            Release if no check-in for 48 hours
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl p-3" style={{ background: PAPER }}>
        <p className="text-xs font-semibold">Key dates</p>
        <p className="mt-1 text-[10px] text-neutral-600">
          Dec 27, Family reunion
        </p>
      </div>
    </div>
  );
}

export default function Hero() {
  const rm = !!useReducedMotion();
  const bandRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ["start end", "end start"],
  });
  const phoneY = useTransform(scrollYProgress, [0, 1], rm ? [0, 0] : [50, -40]);
  const ringsScale = useTransform(
    scrollYProgress,
    [0, 1],
    rm ? [1, 1] : [0.9, 1.15],
  );

  return (
    <section
      id="home"
      style={{ background: PAPER }}
      className="text-neutral-900"
    >
      <Wrap className="pb-14 pt-14 md:pt-20">
        <motion.p
          initial={rm ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-xs font-medium"
        >
          <span
            className="h-2 w-2 animate-pulse rounded-full"
            style={{ background: YELLOW }}
          />
          Live on Android, iOS coming soon
        </motion.p>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.6fr_1fr] md:items-end">
          <h1
            className="text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-7xl"
            aria-label="Stay close to the people who matter."
          >
            <span aria-hidden className="block">
              {["Stay", "close", "to", "the"].map((w, i) => (
                <span key={w}>
                  <Word delay={0.1 + i * 0.07} rm={rm}>
                    {w}
                  </Word>{" "}
                </span>
              ))}
            </span>
            <span
              aria-hidden
              className="mt-1 flex flex-wrap items-center gap-x-3"
            >
              <motion.span
                initial={rm ? false : { scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-900 sm:h-14 sm:w-14"
              >
                <Star />
              </motion.span>
              <span>
                <Word delay={0.5} rm={rm}>
                  people
                </Word>{" "}
                <Word delay={0.57} rm={rm}>
                  who
                </Word>
              </span>
              <span className="relative px-2">
                <motion.span
                  className="absolute inset-0 origin-left"
                  style={{ background: YELLOW }}
                  initial={rm ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.55, delay: 0.95, ease: EASE }}
                />
                <span className="relative">
                  <Word delay={0.7} rm={rm}>
                    matter.
                  </Word>
                </span>
              </span>
            </span>
          </h1>

          <motion.div
            initial={rm ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: EASE }}
            className="md:pb-2"
          >
            <Small className="max-w-xs">
              Kokohor is a private space for the circles you care about. Chat
              freely, keep family history safe, and protect what matters most
              with a{" "}
              <a
                href="#vault"
                className="font-semibold text-neutral-900 underline underline-offset-4"
              >
                Safety Vault
              </a>{" "}
              designed around trust.
            </Small>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PlayButton />
              <IosSoon />
            </div>
          </motion.div>
        </div>

        {/* Audiences */}
        <div
          className={`mt-16 grid grid-cols-2 border-t sm:grid-cols-5 ${LINE}`}
        >
          {audiences.map((a, i) => (
            <motion.p
              key={a}
              initial={rm ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.2 + i * 0.06 }}
              className="py-4 text-sm font-medium text-neutral-700"
            >
              {a}
            </motion.p>
          ))}
        </div>

        {/* Corporate Supporters */}
        {/* Corporate Supporters */}
        <motion.div
          initial={rm ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.45, ease: EASE }}
          className={`mt-8 flex flex-col gap-5 border-t pt-8 sm:flex-row sm:items-center sm:justify-between ${LINE}`}
        >
          <p className="text-xs font-medium text-neutral-500">
            /CORPORATE SUPPORTERS/
          </p>
          <div className="flex flex-wrap items-center gap-8 sm:gap-12">
            {supporters.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-3.5 opacity-85 transition-opacity duration-200 hover:opacity-100"
              >
                <img
                  src={s.logo}
                  alt={s.name}
                  className="h-32 w-32 rounded-lg object-contain sm:h-64 sm:w-64"
                />
              
              </div>
            ))}
          </div>
        </motion.div>
      </Wrap>

      {/* Full-bleed band with the app */}
      <div
        ref={bandRef}
        className="relative overflow-hidden text-white"
        style={{ background: NAVY }}
      >
        <motion.div className="absolute inset-0" style={{ scale: ringsScale }}>
          <Rings />
        </motion.div>

        <Wrap className="relative grid items-center gap-6 md:grid-cols-2">
          <div className="pt-16 md:py-28">
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl">
              One app. Every circle.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Family, classmates, work teams and communities — each kept in its
              own private space, under your control.
            </p>
            <div className="mt-8 flex -space-x-3">
              {[
                ["MA", "bg-amber-300"],
                ["TK", "bg-sky-300"],
                ["OB", "bg-rose-300"],
                ["CJ", "bg-emerald-300"],
                ["+12", "bg-neutral-200 text-neutral-800 font-bold"],
              ].map(([l, bg], i) => (
                <motion.span
                  key={l}
                  initial={rm ? false : { opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.2 + i * 0.08,
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                  }}
                >
                  <Avatar label={l} bg={bg} />
                </motion.span>
              ))}
            </div>
          </div>

          {/* App visual */}
          <div className="relative mx-auto h-[440px] w-full max-w-[440px] md:h-[520px]">
            <div className="absolute bottom-0 left-1/2 w-[250px] -translate-x-1/2 sm:w-[270px]">
              <motion.div
                style={{ y: phoneY }}
                initial={rm ? false : { opacity: 0, y: 60 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE }}
                className="h-[430px] overflow-hidden rounded-t-[2.25rem] border-[8px] border-b-0 border-neutral-900 bg-white text-neutral-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] md:h-[500px]"
              >
                <PhoneScreen />
              </motion.div>
            </div>

            <Float className="left-0 top-14 sm:-left-6" delay={0.5} rm={rm}>
              <span
                className="grid h-9 w-9 place-items-center rounded-full"
                style={{ background: YELLOW }}
              >
                <Icon d={ICONS.check} className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold">Check-in confirmed</p>
                <p className="text-[11px] text-neutral-500">
                  Your vault stays locked
                </p>
              </div>
            </Float>

            <Float
              className="right-0 top-44 hidden sm:flex sm:-right-6"
              delay={0.8}
              rm={rm}
            >
              <Avatar label="OB" bg="bg-rose-300" />
              <div>
                <p className="text-xs font-semibold">Reunion poll</p>
                <p className="text-[11px] text-neutral-500">
                  58% chose Port Harcourt
                </p>
              </div>
            </Float>

            <Float
              className="bottom-28 left-0 hidden sm:flex sm:-left-10"
              delay={1.1}
              rm={rm}
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-neutral-900 text-white">
                <Icon d={ICONS.users} className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold">Ada joined</p>
                <p className="text-[11px] text-neutral-500">Okoye Family</p>
              </div>
            </Float>
          </div>
        </Wrap>
      </div>

      <WhatYouGet />
    </section>
  );
}
