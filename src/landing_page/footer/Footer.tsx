import { EMAIL, Icon, ICONS, Logo, PLAY_STORE, YELLOW } from "../home/shared";

export default function Footer() {
  return (
    <footer id="contact" className="bg-neutral-900 text-neutral-300">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="inline-block rounded-2xl px-4 py-2.5">
            <Logo className="h-8" />
          </div>
          <p className="mt-5 max-w-sm text-sm text-neutral-400">
            A private space for your family and the circles that feel like
            family, with a Safety Vault for when it matters most.
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:brightness-95"
            style={{ background: YELLOW }}
          >
            <Icon d={ICONS.mail} className="h-4 w-4" /> {EMAIL}
          </a>
        </div>

        <nav className="md:col-span-2" aria-label="Product">
          <h4 className="text-sm font-semibold text-white">Product</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a className="hover:text-white" href="#vault">
                Safety Vault
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#circles">
                Circles
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#circles">
                Chats and calls
              </a>
            </li>
          </ul>
        </nav>

        <nav className="md:col-span-2" aria-label="Get the app">
          <h4 className="text-sm font-semibold text-white">Get the app</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                className="hover:text-white"
                href={PLAY_STORE}
                target="_blank"
                rel="noopener noreferrer"
              >
                Android
              </a>
            </li>
            <li className="text-neutral-500">iOS (coming soon)</li>
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h4 className="text-sm font-semibold text-white">Contact</h4>
          <p className="mt-4 text-sm text-neutral-400">
            Questions, feedback or partnerships? Write to us.
          </p>
          <a
            className="mt-2 inline-block text-sm font-medium text-white underline decoration-neutral-600 underline-offset-4 hover:decoration-white"
            href={`mailto:${EMAIL}`}
          >
            {EMAIL}
          </a>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Kokohor. All rights reserved.</p>
          <p>Calls are currently in beta.</p>
        </div>
      </div>
    </footer>
  );
}
