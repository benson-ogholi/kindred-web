import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Loader2,
  Menu,
  RefreshCw,
  Users,
  FolderTree,
  Activity,
  Layers,
  Trophy,
  ArrowDownToLine,
  Newspaper,
  ShieldAlert,
  LifeBuoy,
  Vote,
  Wallet,
  TrendingUp,
  Sparkles,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
  CartesianGrid,
} from "recharts";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchDashboardStats } from "../redux/slices/dashboardSlice";
import Sidebar from "./Sidebar";

type Range =
  | "24h"
  | "48h"
  | "72h"
  | "1w"
  | "2w"
  | "30d"
  | "60d"
  | "90d"
  | "all";

const RANGES: { id: Range; label: string }[] = [
  { id: "24h", label: "24h" },
  { id: "48h", label: "48h" },
  { id: "72h", label: "72h" },
  { id: "1w", label: "1w" },
  { id: "2w", label: "2w" },
  { id: "30d", label: "30d" },
  { id: "60d", label: "60d" },
  { id: "90d", label: "90d" },
  { id: "all", label: "All" },
];

const PALETTE = [
  "#F59E0B",
  "#0F172A",
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#F97316",
  "#06B6D4",
  "#EC4899",
];

const TONES: Record<string, string> = {
  amber: "bg-amber-50 text-amber-600 border-amber-200/70",
  blue: "bg-blue-50 text-blue-600 border-blue-200/70",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-200/70",
  violet: "bg-violet-50 text-violet-600 border-violet-200/70",
  rose: "bg-rose-50 text-rose-600 border-rose-200/70",
  slate: "bg-slate-100 text-slate-700 border-slate-200/70",
};

const fmt = (n: number) => n.toLocaleString();
const pct = (n: number, total: number) =>
  total ? Math.round((n / total) * 1000) / 10 : 0;
const ratio = (a: number, b: number) => (b ? Math.round((a / b) * 10) / 10 : 0);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-lg">
      <p className="font-semibold text-slate-500">{label || item.name}</p>
      <p className="mt-1 font-bold tabular-nums text-slate-900">
        {Number(item.value).toLocaleString()}{" "}
        <span className="font-medium text-slate-500">items</span>
      </p>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [range, setRange] = useState<Range>("30d");
  const { stats, loading } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    // Pass range to the action if your slice supports it
    // e.g. dispatch(fetchDashboardStats(range))
    dispatch(fetchDashboardStats());
  }, [dispatch, range]);

  const d = useMemo(() => {
    if (!stats) return null;

    const users = Number(stats.overview.totalUsers) || 0;
    const families = Number(stats.overview.totalFamilies) || 0;
    const activity = Number(stats.overview.platformActivityScore) || 0;

    const content = (Object.entries(stats.content) as [string, number][])
      .map(([name, value]) => ({ name, count: Number(value) || 0 }))
      .sort((a, b) => b.count - a.count);

    const contentTotal = content.reduce((s, c) => s + c.count, 0);

    const features = [
      {
        name: "News",
        value: Number(stats.features.news) || 0,
        icon: Newspaper,
        tone: "blue",
        barColor: "#3B82F6",
      },
      {
        name: "Reports",
        value: Number(stats.features.reports) || 0,
        icon: ShieldAlert,
        tone: "rose",
        barColor: "#F43F5E",
      },
      {
        name: "Safety Nets",
        value: Number(stats.features.safetyNets) || 0,
        icon: LifeBuoy,
        tone: "violet",
        barColor: "#8B5CF6",
      },
      {
        name: "Active Polls",
        value: Number(stats.features.activePolls) || 0,
        icon: Vote,
        tone: "amber",
        barColor: "#F59E0B",
      },
    ];

    const featureTotal = features.reduce((s, f) => s + f.value, 0);
    const contributionsRaw = stats.finance.contributions;
    const contributions = Number(contributionsRaw);
    const campaigns = Number(stats.finance.campaigns) || 0;

    return {
      users,
      families,
      activity,
      content,
      contentTotal,
      features,
      featureTotal,
      contributionsRaw,
      contributions,
      campaigns,
    };
  }, [stats]);

  if (loading && !stats) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#F4F5F7] text-slate-600">
        <Loader2 className="animate-spin text-amber-500" size={36} />
        <span className="text-xs font-semibold text-slate-500">
          Loading telemetry…
        </span>
      </div>
    );
  }

  const top = d?.content[0];
  const bottom = d?.content[d.content.length - 1];

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] text-slate-950 antialiased selection:bg-amber-400 selection:text-slate-950">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 px-5 py-4 backdrop-blur-md sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open menu"
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-lg font-extrabold tracking-tight sm:text-xl">
                    Platform Overview
                  </h1>
                  <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 sm:inline-flex">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Live
                  </span>
                </div>
                <p className="hidden text-xs text-slate-500 sm:block">
                  Real-time telemetry across users, families, content &
                  campaigns
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Range selector */}
              {/* <div
                role="tablist"
                aria-label="Time range"
                className="hidden items-center rounded-xl border border-slate-200 bg-slate-50 p-1 sm:flex"
              >
                {RANGES.map((r) => (
                  <button
                    key={r.id}
                    role="tab"
                    aria-selected={range === r.id}
                    onClick={() => setRange(r.id)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                      range === r.id
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div> */}

              <button
                onClick={() => dispatch(fetchDashboardStats())}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-700 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={
                    loading ? "animate-spin text-amber-400" : "text-amber-400"
                  }
                />
                <span className="hidden sm:inline">
                  {loading ? "Syncing…" : "Sync"}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile range selector */}
          <div className="mx-auto mt-3 max-w-7xl sm:hidden">
            <div
              role="tablist"
              aria-label="Time range"
              className="flex overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-1 scrollbar-hide"
            >
              {RANGES.map((r) => (
                <button
                  key={r.id}
                  role="tab"
                  aria-selected={range === r.id}
                  onClick={() => setRange(r.id)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    range === r.id
                      ? "bg-slate-900 text-white"
                      : "text-slate-600"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-5 sm:p-8">
          {!d ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-24 text-center">
              <BarChart3 size={36} className="mb-3 text-slate-300" />
              <p className="text-sm font-bold text-slate-700">
                No telemetry available yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Try syncing data or check back once platform activity begins.
              </p>
            </div>
          ) : (
            <>
              {/* KPI Strip */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Kpi
                  icon={Users}
                  tone="blue"
                  label="Total Users"
                  value={fmt(d.users)}
                  footer={`${ratio(d.users, d.families)} per family`}
                />
                <Kpi
                  icon={FolderTree}
                  tone="amber"
                  label="Family Hubs"
                  value={fmt(d.families)}
                  footer={`${ratio(d.contentTotal, d.families)} items / hub`}
                />
                <Kpi
                  icon={Activity}
                  tone="emerald"
                  label="Activity Score"
                  value={fmt(d.activity)}
                  footer="Engagement index"
                />
                <Kpi
                  icon={Layers}
                  tone="violet"
                  label="Total Content"
                  value={fmt(d.contentTotal)}
                  footer={`${d.content.length} active types`}
                />
              </div>

              {/* Content Volume + Finance */}
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <Card
                  className="xl:col-span-2"
                  title="Content Volume by Category"
                  subtitle="Ranked distribution across all family circles"
                  right={
                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600">
                      {fmt(d.contentTotal)} TOTAL
                    </span>
                  }
                >
                  <div
                    style={{ height: Math.max(240, d.content.length * 40) }}
                    className="w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={d.content}
                        layout="vertical"
                        margin={{ left: 4, right: 48, top: 4, bottom: 4 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                          stroke="#F1F5F9"
                        />
                        <XAxis type="number" hide />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={120}
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 12,
                            fontWeight: 600,
                            fill: "#334155",
                          }}
                        />
                        <Tooltip
                          cursor={{ fill: "#F8FAFC" }}
                          content={<CustomTooltip />}
                        />
                        <Bar
                          dataKey="count"
                          fill="#0F172A"
                          radius={[0, 6, 6, 0]}
                          barSize={20}
                        >
                          {d.content.map((_, idx) => (
                            <Cell
                              key={idx}
                              fill={idx === 0 ? "#F59E0B" : "#0F172A"}
                            />
                          ))}
                          <LabelList
                            dataKey="count"
                            position="right"
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              fill: "#0F172A",
                            }}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Finance Card */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 rounded-lg border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">
                        <Wallet size={13} />
                        Treasury & Campaigns
                      </span>
                      <TrendingUp size={18} className="text-emerald-400" />
                    </div>

                    <div className="mt-8">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Total Contributions
                      </p>
                      <p className="mt-2 font-mono text-4xl font-extrabold tracking-tight tabular-nums sm:text-5xl">
                        {String(d.contributionsRaw ?? 0)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3.5">
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Active Campaigns
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Currently accepting funds
                        </p>
                      </div>
                      <span className="font-mono text-2xl font-extrabold text-amber-400 tabular-nums">
                        {fmt(d.campaigns)}
                      </span>
                    </div>

                    {Number.isFinite(d.contributions) && d.campaigns > 0 && (
                      <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-800/40 px-4 py-3 text-xs">
                        <span className="text-slate-400">
                          Average per campaign
                        </span>
                        <span className="font-mono font-bold text-slate-200 tabular-nums">
                          {fmt(Math.round(d.contributions / d.campaigns))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Share + Feature Adoption */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card
                  title="Content Share"
                  subtitle="Proportional mix across categories"
                >
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                    <div className="relative h-48 w-48 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={d.content}
                            dataKey="count"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={88}
                            paddingAngle={3}
                            stroke="none"
                          >
                            {d.content.map((_, i) => (
                              <Cell
                                key={i}
                                fill={PALETTE[i % PALETTE.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-mono text-2xl font-extrabold tabular-nums text-slate-900">
                          {fmt(d.contentTotal)}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Items
                        </span>
                      </div>
                    </div>

                    <ul className="w-full flex-1 space-y-2.5">
                      {d.content.map((c, i) => (
                        <li
                          key={c.name}
                          className="flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 shrink-0 rounded-sm"
                              style={{
                                background: PALETTE[i % PALETTE.length],
                              }}
                            />
                            <span className="truncate font-semibold text-slate-700">
                              {c.name}
                            </span>
                          </div>
                          <div className="flex shrink-0 items-center gap-2 font-mono tabular-nums">
                            <span className="text-slate-400">
                              {fmt(c.count)}
                            </span>
                            <span className="w-12 rounded bg-slate-100 px-1.5 py-0.5 text-right font-bold text-slate-800">
                              {pct(c.count, d.contentTotal)}%
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                <Card
                  title="Feature Adoption"
                  subtitle="Activity distribution across core platform modules"
                  right={
                    <span className="font-mono text-xs font-semibold text-slate-500">
                      {fmt(d.featureTotal)} total
                    </span>
                  }
                >
                  <div
                    className="flex h-3.5 w-full gap-1 overflow-hidden rounded-full bg-slate-100 p-0.5"
                    role="img"
                    aria-label="Feature usage split"
                  >
                    {d.features.map((f) => {
                      const width = pct(f.value, d.featureTotal);
                      if (width <= 0) return null;
                      return (
                        <div
                          key={f.name}
                          style={{
                            width: `${width}%`,
                            backgroundColor: f.barColor,
                          }}
                          className="h-full rounded-full transition-all duration-500"
                          title={`${f.name}: ${fmt(f.value)} (${width}%)`}
                        />
                      );
                    })}
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {d.features.map((f) => {
                      const share = pct(f.value, d.featureTotal);
                      return (
                        <div
                          key={f.name}
                          className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 transition hover:border-slate-300 hover:bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${TONES[f.tone]}`}
                            >
                              <f.icon size={18} />
                            </span>
                            <div>
                              <p className="text-xs font-bold text-slate-700">
                                {f.name}
                              </p>
                              <p className="mt-0.5 font-mono text-xl font-extrabold tabular-nums text-slate-900">
                                {fmt(f.value)}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`rounded-lg border bg-white px-2.5 py-1 font-mono text-xs font-bold tabular-nums ${
                              f.tone === "blue"
                                ? "border-blue-200 text-blue-600"
                                : f.tone === "rose"
                                  ? "border-rose-200 text-rose-600"
                                  : f.tone === "violet"
                                    ? "border-violet-200 text-violet-600"
                                    : "border-amber-200 text-amber-600"
                            }`}
                          >
                            {share}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* Insights */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <InsightTile
                  icon={Trophy}
                  tone="amber"
                  label="Leading Category"
                  value={top?.name ?? "N/A"}
                  hint={
                    top
                      ? `${fmt(top.count)} items (${pct(top.count, d.contentTotal)}%)`
                      : ""
                  }
                />
                <InsightTile
                  icon={ArrowDownToLine}
                  tone="rose"
                  label="Lowest Volume"
                  value={bottom?.name ?? "N/A"}
                  hint={
                    bottom
                      ? `${fmt(bottom.count)} items (${pct(bottom.count, d.contentTotal)}%)`
                      : ""
                  }
                />
                <InsightTile
                  icon={Sparkles}
                  tone="blue"
                  label="Content Density"
                  value={`${ratio(d.contentTotal, d.families)} / hub`}
                  hint="Average items per family"
                />
                <InsightTile
                  icon={Vote}
                  tone="emerald"
                  label="Feature Velocity"
                  value={`${ratio(d.featureTotal, d.users)} / user`}
                  hint="Events across 4 modules"
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

/* ---------- Subcomponents ---------- */

const Card = ({
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

const Kpi = ({
  icon: Icon,
  tone,
  label,
  value,
  footer,
}: {
  icon: React.ElementType;
  tone: string;
  label: string;
  value: string;
  footer: string;
}) => (
  <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl border ${TONES[tone]}`}
      >
        <Icon size={17} />
      </span>
    </div>
    <p className="mt-4 text-3xl font-extrabold tracking-tight tabular-nums text-slate-900">
      {value}
    </p>
    <div className="mt-2 min-h-[20px]">
      <span className="text-[11px] font-semibold text-slate-500">{footer}</span>
    </div>
  </div>
);

const InsightTile = ({
  icon: Icon,
  tone,
  label,
  value,
  hint,
}: {
  icon: React.ElementType;
  tone: string;
  label: string;
  value: string;
  hint: string;
}) => (
  <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4">
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${TONES[tone]}`}
    >
      <Icon size={19} />
    </span>
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="truncate text-base font-extrabold text-slate-900">
        {value}
      </p>
      {hint && (
        <p className="truncate font-mono text-[11px] font-medium text-slate-500">
          {hint}
        </p>
      )}
    </div>
  </div>
);

export default AdminDashboard;
