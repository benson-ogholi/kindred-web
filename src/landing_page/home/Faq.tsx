import { useState } from "react";
import { EMAIL, Icon, ICONS, YELLOW } from "./shared";

const groups = [
  { title: "General", items: [
    { q: "What is Kokohor?", a: "Kokohor is a mobile app for families and the groups that feel like family. You can chat, send voice notes, share news, run polls and use a Safety Vault for critical information." },
    { q: "Which devices does it work on?", a: "Kokohor is available on Android now. iOS is coming soon." },
    { q: "Who is it for?", a: "Anyone who wants a private space for their people: relatives, old classmates, coworkers, business teams and communities." },
  ]},
  { title: "Safety Vault", items: [
    { q: "What is the Safety Vault?", a: "A protected place for things like your whereabouts, emergency contacts, medical notes and documents. You assign the people who can receive access and set the terms that open it." },
    { q: "What can trigger a release?", a: "You set the terms, for example missing a check-in for a period you choose. Until those terms are met, nobody you assigned can see what’s inside." },
    { q: "Can I change who has access?", a: "Yes. You can edit what’s in your vault, update your terms and add or remove people at any time." },
    { q: "Does the vault replace emergency services?", a: "No. In an emergency, call your local emergency number first." },
  ]},
  { title: "Circles, chats and calls", items: [
    { q: "What is a circle?", a: "A private group for a set of people, such as your family, your class or your team. Each circle has its own members, news, polls and chats." },
    { q: "Can I be in more than one circle?", a: "Yes. Family, classmates and work can each have their own circle and stay separate." },
    { q: "Do voice notes and calls work?", a: "Voice notes are available. Calling is in beta, so it may change or have issues while we improve it." },
  ]},
  { title: "Help and privacy", items: [
    { q: "How is my information handled?", a: "Read our Privacy Policy for the details. You decide what you share and with whom." },
    { q: "How do I contact you?", a: `Email ${EMAIL} and we’ll get back to you.` },
  ]},
];

export default function FaqsPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-center text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
          Frequently asked questions
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-neutral-600">
          Everything about Kokohor, the Safety Vault and circles, in one place.
        </p>

        {groups.map((g) => (
          <div key={g.title} className="mt-14">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">{g.title}</h2>
            <div className="mt-3 divide-y divide-neutral-200 border-y border-neutral-200">
              {g.items.map((f) => {
                const id = `${g.title}-${f.q}`;
                const isOpen = open === id;
                return (
                  <div key={id}>
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold text-neutral-900"
                      >
                        {f.q}
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-neutral-900 transition-transform ${isOpen ? "rotate-45" : ""}`}
                          style={{ background: YELLOW }}
                        >
                          <Icon d={ICONS.plus} className="h-4 w-4" />
                        </span>
                      </button>
                    </h3>
                    {isOpen && <p className="pb-6 pr-12 text-neutral-600">{f.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <p className="mt-12 text-center text-sm text-neutral-500">
          Still need help?{" "}
          <a className="font-semibold text-neutral-900 underline underline-offset-4" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </div>
    </section>
  );
}