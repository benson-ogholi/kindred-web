import React from "react";
import logoImg from "../../assets/new.png";

export const PLAY_STORE =
  "https://play.google.com/store/apps/details?id=com.kokohor.app&hl=en";
export const EMAIL = "info@kokohorcircle.com";
export const YELLOW = "#FFC400";
export const YELLOW_SOFT = "#FFF3C2";
export const YELLOW_TINT = "#FFF8DD";

export const ICONS = {
  shield: "M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z",
  pin: "M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z",
  chat: "M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z",
  phone:
    "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  mic: "M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3zM19 11a7 7 0 01-14 0M12 18v3",
  poll: "M5 20V10M12 20V4M19 20v-7",
  news: "M5 4h11a2 2 0 012 2v14H7a2 2 0 01-2-2V4zM18 8h2v10a2 2 0 01-2 2M8 8h7M8 12h7M8 16h4",
  lock: "M6 11V8a6 6 0 1112 0v3M5 11h14v10H5z",
  check: "M5 12l5 5L20 7",
  android:
    "M6 9h12v8a1 1 0 01-1 1H7a1 1 0 01-1-1V9zM8 5l1.5 2.5M16 5l-1.5 2.5M6 9a6 6 0 0112 0",
  mobile:
    "M8 3h8a1 1 0 011 1v16a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1zM11 18h2",
  users:
    "M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M10 11a4 4 0 100-8 4 4 0 000 8zM21 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  file: "M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5zM14 3v5h5M9 13h6M9 17h6",
  heart:
    "M20.8 5.6a5.5 5.5 0 00-7.8 0L12 6.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 000-7.8z",
  mail: "M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zM3 7l9 6 9-6",
  calendar:
    "M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1zM4 10h16M8 3v4M16 3v4",
  plus: "M12 5v14M5 12h14",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
};

export const Icon = ({
  d,
  className = "h-5 w-5",
}: {
  d: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d={d} />
  </svg>
);

export const IconBadge = ({
  d,
  tone = "yellow",
}: {
  d: string;
  tone?: "yellow" | "white";
}) => (
  <div
    className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-neutral-900 ${tone === "white" ? "bg-white" : ""}`}
    style={tone === "yellow" ? { background: YELLOW } : undefined}
  >
    <Icon d={d} />
  </div>
);

export const Logo = ({ className = "h-9" }: { className?: string }) => (
  <a
    href="#home"
    className="inline-flex items-center gap-2"
    aria-label="Kokohor home"
  >
    <img
      src={logoImg}
      alt="Kokohor"
      className={`${className} w-auto object-contain`}
    />
  </a>
);

export const PlayButton = ({ dark = true }: { dark?: boolean }) => (
  <a
    href={PLAY_STORE}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
      dark
        ? "bg-neutral-900 text-white hover:bg-neutral-700"
        : "bg-white text-neutral-900 hover:bg-neutral-100"
    }`}
  >
    <Icon d={ICONS.android} /> Get it on Android
  </a>
);

export const IosSoon = ({ dark = false }: { dark?: boolean }) => (
  <span
    aria-disabled
    className={`inline-flex cursor-not-allowed items-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold ${
      dark
        ? "border-neutral-700 text-neutral-400"
        : "border-neutral-300 bg-white/60 text-neutral-500"
    }`}
  >
    <Icon d={ICONS.mobile} /> iOS coming soon
  </span>
);

export const Card = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={`rounded-3xl p-6  ${className}`}
  >
    {children}
  </div>
);

export const Avatar = ({ label, bg }: { label: string; bg: string }) => (
  <span
    className={`grid h-9 w-9 place-items-center rounded-full border-2 border-white text-xs font-bold text-neutral-900 ${bg}`}
  >
    {label}
  </span>
);

export const SectionHeading = ({
  title,
  body,
  center = true,
}: {
  title: string;
  body: string;
  center?: boolean;
}) => (
  <div className={`mx-auto max-w-3xl px-6 ${center ? "text-center" : ""}`}>
    <h2 className="text-balance text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
      {title}
    </h2>
    <p
      className={`mt-4 text-lg text-neutral-600 ${center ? "mx-auto max-w-2xl" : ""}`}
    >
      {body}
    </p>
  </div>
);
