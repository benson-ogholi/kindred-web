
import { Icon, ICONS, YELLOW } from "./shared";

const controls = [
  {
    icon: ICONS.lock,
    title: "Nothing shared by default",
    body: "Your vault stays private. No one sees it until your own terms are met.",
  },
  {
    icon: ICONS.users,
    title: "Invite-only circles",
    body: "Only people you invite can see a circle’s news, polls and chats.",
  },
  {
    icon: ICONS.check,
    title: "You approve access",
    body: "You choose which members are assigned to your vault and can change the list anytime.",
  },
  {
    icon: ICONS.clock,
    title: "You set the timing",
    body: "Pick how long without a check-in, or which date, before the vault opens.",
  },
  {
    icon: ICONS.pin,
    title: "You choose what to share",
    body: "Add as much or as little as you like: location, medical notes, documents or messages.",
  },
  {
    icon: ICONS.shield,
    title: "Easy to change your mind",
    body: "Edit what’s inside, update your terms or remove a person whenever you need to.",
  },
];

export default function Privacy() {
  return (
    <section id="privacy" className="bg-neutral-900 py-24 text-white">
      <div className="mx-auto grid max-w-6xl items-end gap-8 px-6 md:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-4 py-1.5 text-sm text-neutral-300">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: YELLOW }}
            />{" "}
            Privacy and control
          </p>
          <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Built so you stay in charge
          </h2>
        </div>
        <p className="text-lg text-neutral-400 md:max-w-md">
          Family information is personal. Kokohor puts every decision about who
          sees what in your hands.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {controls.map((c) => (
          <div
            key={c.title}
            className="rounded-3xl border border-neutral-800 bg-neutral-800/50 p-6"
          >
            <span
              className="grid h-11 w-11 place-items-center rounded-2xl text-neutral-900"
              style={{ background: YELLOW }}
            >
              <Icon d={c.icon} />
            </span>
            <h3 className="mt-5 text-lg font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm text-neutral-400">{c.body}</p>
          </div>
        ))}
      </div>

      {/* Callout */}
      <div className="mx-auto mt-6 max-w-6xl px-6">
        <div
          className="flex flex-col items-start justify-between gap-4 rounded-3xl p-8 text-neutral-900 md:flex-row md:items-center"
          style={{ background: YELLOW }}
        >
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">
              Have a privacy question?
            </h3>
            <p className="mt-1 text-neutral-800">
              We’re happy to explain how Kokohor handles your information.
            </p>
          </div>
          <a
            href="#contact"
            className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700"
          >
            Contact us
          </a>
        </div>
      </div>
    </section>
  );
}
