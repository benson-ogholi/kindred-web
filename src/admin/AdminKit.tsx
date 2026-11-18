import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

/** Shared helpers and small components for the admin dashboards. */

export const DAY = 86_400_000;
export const AMBER = "#F59E0B";
export const PALETTE = [
  "#F59E0B",
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#F43F5E",
  "#06B6D4",
  "#F97316",
  "#64748B",
];

export const pct = (n: number, total: number) =>
  total ? Math.round((n / total) * 1000) / 10 : 0;

export const startOfDay = (t: number) => {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const timeAgo = (ms: number) => {
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 30 * DAY) return `${Math.floor(diff / DAY)}d ago`;
  return new Date(ms).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/** Quote a CSV cell and neutralise spreadsheet-formula injection. */
export const csvSafe = (v: unknown) => {
  let s = String(v ?? "");
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export const downloadCsv = (filename: string, rows: unknown[][]) => {
  const csv = rows.map((r) => r.map(csvSafe).join(",")).join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export type Delta = { diff: number; pct: number | null };
export const delta = (cur: number, prev: number): Delta => ({
  diff: cur - prev,
  pct: prev ? Math.round(((cur - prev) / prev) * 100) : null,
});

export const TONES: Record<string, string> = {
  amber: "bg-amber-50 text-amber-600 border-amber-200/70",
  blue: "bg-blue-50 text-blue-600 border-blue-200/70",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-200/70",
  rose: "bg-rose-50 text-rose-600 border-rose-200/70",
  violet: "bg-violet-50 text-violet-600 border-violet-200/70",
};

export const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-lg">
      <p className="font-semibold text-slate-500">{label ?? payload[0].name}</p>
      {payload.map((p: any) => (
        <p
          key={p.dataKey ?? p.name}
          className="mt-1 flex items-center gap-2 font-bold tabular-nums text-slate-900"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: p.color || p.payload?.color || AMBER }}
          />
          {Number(p.value).toLocaleString()}{" "}
          <span className="font-medium text-slate-500">{p.name}</span>
        </p>
      ))}
    </div>
  );
};

export const DeltaBadge = ({ d, label }: { d: Delta; label: string }) => {
  const flat = d.diff === 0;
  const up = d.diff > 0;
  const Icon = flat ? Minus : up ? TrendingUp : TrendingDown;
  const color = flat
    ? "text-slate-500 bg-slate-100"
    : up
      ? "text-emerald-700 bg-emerald-50"
      : "text-rose-700 bg-rose-50";
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
      <span
        className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-bold ${color}`}
      >
        <Icon size={11} />
        {d.diff > 0 ? "+" : ""}
        {d.diff}
        {d.pct !== null && ` (${d.pct > 0 ? "+" : ""}${d.pct}%)`}
      </span>
      {label}
    </span>
  );
};

export const Kpi = ({
  icon: I,
  tone,
  label,
  value,
  footer,
}: {
  icon: React.ElementType;
  tone: string;
  label: string;
  value: number | string;
  footer: React.ReactNode;
}) => (
  <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl border ${TONES[tone]}`}
      >
        <I size={17} />
      </span>
    </div>
    <p className="mt-4 text-3xl font-extrabold tracking-tight tabular-nums text-slate-900">
      {typeof value === "number" ? value.toLocaleString() : value}
    </p>
    <div className="mt-2 min-h-[20px]">{footer}</div>
  </div>
);

export const Card = ({
  title,
  subtitle,
  right,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) => (
  <section
    className={`rounded-2xl border border-slate-200/90 bg-white p-6 ${className}`}
  >
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-extrabold tracking-tight text-slate-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </div>
    {children}
  </section>
);

export const StatusPill = ({
  active,
  text,
}: {
  active: boolean;
  text: string;
}) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
      active
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-rose-200 bg-rose-50 text-rose-700"
    }`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-rose-500"}`}
    />
    {text}
  </span>
);
