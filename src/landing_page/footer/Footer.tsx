import { Link } from "react-router-dom";
import { EMAIL, Logo, PLAY_STORE, YELLOW } from "../home/shared";
import { Arrow, NAVY, Wrap } from "../home/editorial";

const link = "transition hover:text-white";
const head = "text-xs font-medium text-white";

export default function Footer() {
  return (
    <footer id="contact" className="text-white/60" style={{ background: NAVY }}>
      <Wrap className="pt-20">
        <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:text-6xl">
          Stay close to the people who{" "}
          <span className="px-1.5 text-neutral-900" style={{ background: YELLOW }}>matter.</span>
        </h2>
        <a
          href={`mailto:${EMAIL}`}
          className="mt-10 inline-flex items-center gap-2 border-b border-white pb-1 text-sm text-white"
        >
          {EMAIL} <Arrow />
        </a>

        <div className="mt-16 grid gap-12 border-t border-white/15 py-12 md:grid-cols-[35%_1fr]">
          <div>
            <Logo className="h-8" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              A private space for your family and the circles that feel like family, with a Safety Vault for when it
              matters most.
            </p>
          </div>

          <div className="grid gap-10 text-sm sm:grid-cols-3">
            <nav aria-label="Product">
              <p className={head}>/PRODUCT/</p>
              <ul className="mt-4 space-y-3">
                <li><Link className={link} to="/about">About</Link></li>
                <li><a className={link} href="/#vault">Safety Vault</a></li>
                <li><a className={link} href="/#circles">Circles</a></li>
                <li><a className={link} href="/#circles">Chats and calls</a></li>
                <li><Link className={link} to="/faqs">FAQs</Link></li>
              </ul>
            </nav>

            <nav aria-label="Get the app">
              <p className={head}>/GET THE APP/</p>
              <ul className="mt-4 space-y-3">
                <li>
                  <a className={link} href={PLAY_STORE} target="_blank" rel="noopener noreferrer">
                    Android
                  </a>
                </li>
                <li className="text-white/40">iOS (coming soon)</li>
              </ul>
            </nav>

            <nav aria-label="Legal">
              <p className={head}>/LEGAL/</p>
              <ul className="mt-4 space-y-3">
                <li><Link className={link} to="/terms">Terms of Service</Link></li>
                <li><Link className={link} to="/privacy">Privacy Policy</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </Wrap>

      <div className="border-t border-white/15">
        <Wrap className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Kokohor. All rights reserved.</p>
          <span>Calls are currently in beta.</span>
        </Wrap>
      </div>
    </footer>
  );
}