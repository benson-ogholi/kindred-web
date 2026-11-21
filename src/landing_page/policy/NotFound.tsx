import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { EMAIL, Icon, ICONS, YELLOW } from "../home/shared";
import { Arrow, LINE, NAVY, PAPER, Rings, Small, Star, Wrap } from "../home/editorial";

const EASE = [0.2, 0.7, 0.2, 1] as const;

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About Kokohor", to: "/about" },
  { label: "FAQs", to: "/faqs" },
  { label: "Privacy Policy", to: "/privacy" },
];

export default function NotFound() {
  const rm = !!useReducedMotion();

  return (
    <main style={{ background: PAPER }} className="min-w-0 text-neutral-900">
      {/* Main 404 Stage */}
      <Wrap className="pb-20 pt-14 sm:pt-20 md:pb-28 md:pt-24">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold tracking-wider">
          <span>/ERROR 404/</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-300/90 bg-white/80 px-3.5 py-1 text-[11px] font-medium text-neutral-700">
            <Icon d={ICONS.pin} className="h-3.5 w-3.5 text-neutral-900" />
            Page not found
          </span>
        </div>

        <div className="mt-6 grid gap-8 md:mt-8 md:grid-cols-[1.6fr_1fr] md:items-end">
          <motion.h1
            initial={rm ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: rm ? 0 : 0.6, ease: EASE }}
            className="text-4xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-6xl md:text-7xl"
          >
             Sorry, Page not
            <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-900 sm:h-12 sm:w-12 md:h-14 md:w-14">
                <Star />
              </span>
              <span className="inline-block px-2" style={{ background: YELLOW }}>
                Found.
              </span>
            </span>
          </motion.h1>

          <Small className="max-w-sm md:pb-2">
            The page you’re looking for doesn’t exist or may have moved. Let’s
            get you back to your circle.
          </Small>
        </div>

        {/* Actions + Destination Strip */}
        <motion.div
          initial={rm ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: rm ? 0 : 0.45, delay: 0.08, ease: EASE }}
          className={`mt-12 border-t pt-8 ${LINE}`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:brightness-105 active:scale-[0.98]"
              style={{ background: YELLOW }}
            >
              Back to home <Arrow />
            </Link>
            <Link
              to="/faqs"
              className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-900 hover:bg-neutral-50"
            >
              Read the FAQs
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500">
            <span className="font-semibold uppercase tracking-wider text-neutral-400">
              Jump to:
            </span>
            {quickLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4 transition hover:text-neutral-900 hover:decoration-neutral-900"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </Wrap>

      {/* Help Band */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: NAVY }}
      >
        <Rings />
        <Wrap className="relative py-16 sm:py-20 md:py-24">
          <p className="text-xs font-semibold tracking-wider">/NEED HELP?/</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.06] tracking-[-0.04em] sm:text-5xl">
            Looking for something specific? Write to us.
          </h2>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:brightness-105 active:scale-95"
              style={{ background: YELLOW }}
            >
              Email support <Arrow />
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