import { Link } from "react-router-dom";
import { EMAIL, Icon, ICONS, YELLOW } from "../home/shared";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-[#F4F4F2] py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl text-neutral-900" style={{ background: YELLOW }}>
          <Icon d={ICONS.pin} className="h-9 w-9" />
        </div>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">Error 404</p>
        <h1 className="mt-3 text-balance text-5xl font-semibold tracking-tight text-neutral-900 md:text-6xl">
          This page has wandered off
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-neutral-600">
          The page you’re looking for doesn’t exist or may have moved. Let’s get you back to your circle.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white hover:bg-neutral-700">
            Back to home
          </Link>
          <Link to="/faqs" className="rounded-full border border-neutral-300 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-100">
            Read the FAQs
          </Link>
        </div>
        <p className="mt-8 text-sm text-neutral-500">
          Need help? <a className="font-semibold text-neutral-900 underline underline-offset-4" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </div>
    </section>
  );
}