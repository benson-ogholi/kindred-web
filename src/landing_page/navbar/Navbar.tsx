import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon, ICONS, Logo, PLAY_STORE, YELLOW } from "../home/shared";

const links = [
  { label: "Home", href: "#home" },
  { label: "Safety Vault", href: "#vault" },
  { label: "Circles", href: "#circles" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-white/90 backdrop-blur-md shadow-xs border-b border-neutral-200/60"
          : "bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1.5 md:flex bg-neutral-100/70 p-1.5 rounded-full border border-neutral-200/60 shadow-2xs">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-neutral-600 transition-all hover:bg-white hover:text-neutral-900 hover:shadow-xs"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right Action / Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href={PLAY_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition-all hover:brightness-105 active:scale-95 sm:inline-flex"
            style={{ background: YELLOW }}
          >
            <span>Get the app</span>
            <span className="text-xs bg-black/10 px-1.5 py-0.5 rounded-full">Android</span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-full bg-neutral-900 text-white shadow-sm transition-transform active:scale-95 md:hidden"
          >
            <Icon d={open ? ICONS.close : ICONS.menu} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-neutral-200 bg-white px-6 pb-6 pt-4 md:hidden shadow-lg"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-neutral-800 transition hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>{l.label}</span>
                  <span className="text-neutral-400 text-sm">→</span>
                </a>
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col gap-2">
              <a
                href={PLAY_STORE}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block rounded-full py-3 text-center text-sm font-bold text-neutral-900 shadow-sm transition hover:brightness-105"
                style={{ background: YELLOW }}
              >
                Get it on Android
              </a>
              <p className="text-center text-xs text-neutral-500 font-medium">
                iOS version coming soon
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}