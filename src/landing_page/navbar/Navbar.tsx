import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Icon, ICONS, Logo, PLAY_STORE, YELLOW } from "../home/shared";
import { Arrow, LINE, } from "../home/editorial";

// Hash links use "/#id" so they work from any page (needs the ScrollToTop with hash support).
const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Safety Vault", to: "/#vault" },
  { label: "Circles", to: "/#circles" },
  { label: "FAQs", to: "/faqs" },
  { label: "Contact", to: "/#contact" },
];

// Only real page routes (not hash links) can be "active"
const PAGE_ROUTES = ["/about", "/faqs"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (to: string) => PAGE_ROUTES.includes(to) && pathname === to;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? `${LINE} backdrop-blur-md` : "border-transparent"
      }`}
      style={{
        background: scrolled || open ? "#fff" : '#fff',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />

        {/* Desktop links: plain text, active page underlined */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              aria-current={isActive(l.to) ? "page" : undefined}
              className={`border-b pb-0.5 text-sm tracking-[-0.01em] transition-colors ${
                isActive(l.to)
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={PLAY_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:brightness-105 active:scale-95 sm:inline-flex"
            style={{ background: YELLOW }}
          >
            Get the app <Arrow />
          </a>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center text-neutral-900 md:hidden"
          >
            <Icon d={open ? ICONS.close : ICONS.menu} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`overflow-hidden border-t md:hidden ${LINE}`}
          >
            <nav className="mx-auto max-w-6xl px-6 pt-2" aria-label="Mobile">
              {links.map((l, i) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(l.to) ? "page" : undefined}
                  className={`flex items-center justify-between py-4 text-2xl font-semibold tracking-[-0.04em] ${
                    i ? `border-t ${LINE}` : ""
                  } ${isActive(l.to) ? "text-neutral-900" : "text-neutral-700"}`}
                >
                  <span>{l.label}</span>
                  {isActive(l.to) && (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: YELLOW }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            <div className="mx-auto max-w-6xl px-6 pb-6 pt-4">
              <a
                href={PLAY_STORE}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block rounded-full py-3 text-center text-sm font-medium text-neutral-900"
                style={{ background: YELLOW }}
              >
                Get it on Android
              </a>
              <p className="mt-3 text-center text-xs text-neutral-500">
                iOS version coming soon
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
