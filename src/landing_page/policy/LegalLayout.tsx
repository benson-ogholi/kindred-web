import { EMAIL, YELLOW } from "../home/shared";

export type LegalSection = { title: string; body: string[] };

export default function LegalLayout({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-[#F4F4F2] px-4 py-1.5 text-sm text-neutral-600">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: YELLOW }}
          />{" "}
          Last updated {updated}
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-neutral-600">{intro}</p>

        <nav
          aria-label="On this page"
          className="mt-10 rounded-3xl bg-[#F4F4F2] p-6"
        >
          <p className="text-sm font-semibold text-neutral-900">On this page</p>
          <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-sm text-neutral-600 sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.title}>
                <a
                  className="hover:text-neutral-900 hover:underline"
                  href={`#s${i + 1}`}
                >
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 space-y-10">
          {sections.map((s, i) => (
            <article key={s.title} id={`s${i + 1}`} className="scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                {i + 1}. {s.title}
              </h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-neutral-600">
                  {p}
                </p>
              ))}
            </article>
          ))}
        </div>

        <p className="mt-14 border-t border-neutral-200 pt-6 text-sm text-neutral-500">
          Questions? Email{" "}
          <a
            className="font-semibold text-neutral-900 underline underline-offset-4"
            href={`mailto:${EMAIL}`}
          >
            {EMAIL}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
