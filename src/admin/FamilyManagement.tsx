import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FolderTree,
  Search,
  Trash2,
  Eye,
  X,
  Users,
  CreditCard,
  Loader2,
  Menu,
  AlertTriangle,
  Network,
  Activity,
  CalendarClock,
  UserPlus,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  Vote,
  BookOpen,
  ShieldAlert,
  LifeBuoy,
  Crown,
  UserRound,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import type { AppDispatch, RootState } from "../redux/store";
import {
  fetchAllFamilies,
  fetchFamilyDeepDive,
  toggleFamilySuspension,
  deleteFamilyPermanently,
  clearActiveFamily,
} from "../redux/slices/adminFamilySlice";
import Sidebar from "./Sidebar";
import {
  DAY,
  AMBER,
  PALETTE,
  pct,
  startOfDay,
  timeAgo,
  delta,
  downloadCsv,
  ChartTooltip,
  DeltaBadge,
  Kpi,
  Card,
  StatusPill,
} from "./AdminKit";

type Filter = "all" | "active" | "suspended";
type Sort = "newest" | "oldest" | "name" | "members";
type Range = 7 | 30 | 90;
type ModalType = "delete" | "suspend" | "activate" | null;

const SIZE_BUCKETS = [
  { label: "1", test: (n: number) => n <= 1 },
  { label: "2-3", test: (n: number) => n >= 2 && n <= 3 },
  { label: "4-6", test: (n: number) => n >= 4 && n <= 6 },
  { label: "7-10", test: (n: number) => n >= 7 && n <= 10 },
  { label: "11+", test: (n: number) => n >= 11 },
];

const FamilyManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { families, activeFamilyDetails, loading } = useSelector(
    (state: RootState) => state.adminFamily,
  );
  type Family = (typeof families)[number];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [range, setRange] = useState<Range>(30);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: ModalType;
    familyId: string | null;
    familyName: string | null;
  }>({ show: false, type: null, familyId: null, familyName: null });

  useEffect(() => {
    dispatch(fetchAllFamilies());
  }, [dispatch]);

  useEffect(() => setPage(1), [searchTerm, filter, sort, pageSize]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setConfirmModal((m) => ({ ...m, show: false }));
        dispatch(clearActiveFamily());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  const membersOf = (f: Family) => f.members?.length || 0;
  const ownerOf = (f: Family) =>
    `${f.owner?.firstName || ""} ${f.owner?.lastName || ""}`.trim() ||
    "Unknown";

  /* ---------- statistics (real dates, real comparisons) ---------- */
  const s = useMemo(() => {
    const total = families.length;
    const active = families.filter((f) => f.status === "active").length;
    const suspended = total - active;
    const totalMembers = families.reduce((a, f) => a + membersOf(f), 0);
    const avgMembers = total ? Math.round((totalMembers / total) * 10) / 10 : 0;

    const times = families
      .map((f) => (f.createdAt ? new Date(f.createdAt).getTime() : NaN))
      .filter(Number.isFinite);
    const count = (from: number, to: number) =>
      times.filter((t) => t >= from && t < to).length;
    const now = Date.now();
    const today0 = startOfDay(now);

    const today = count(today0, now + 1);
    const yesterday = count(today0 - DAY, today0);
    const last7 = count(now - 7 * DAY, now + 1);
    const prev7 = count(now - 14 * DAY, now - 7 * DAY);
    const last30 = count(now - 30 * DAY, now + 1);

    const typeMap = new Map<string, number>();
    families.forEach((f) => {
      const t = f.familyType || "Unspecified";
      typeMap.set(t, (typeMap.get(t) || 0) + 1);
    });
    const types = [...typeMap.entries()]
      .map(([name, value], i) => ({ name, value, color: "", i }))
      .sort((a, b) => b.value - a.value)
      .map((t, i) => ({ ...t, color: PALETTE[i % PALETTE.length] }));

    const sizes = SIZE_BUCKETS.map((b) => ({
      label: b.label,
      count: families.filter((f) => b.test(membersOf(f))).length,
    }));
    const solo = sizes[0].count;

    const largest = [...families]
      .sort((a, b) => membersOf(b) - membersOf(a))
      .slice(0, 5);

    return {
      total,
      active,
      suspended,
      totalMembers,
      avgMembers,
      times,
      today0,
      today,
      yesterday,
      last7,
      prev7,
      last30,
      types,
      sizes,
      solo,
      largest,
    };
  }, [families]);

  const growth = useMemo(() => {
    const data = Array.from({ length: range }, (_, i) => {
      const from = s.today0 - (range - 1 - i) * DAY;
      return {
        label: new Date(from).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        current: s.times.filter((t) => t >= from && t < from + DAY).length,
        previous: s.times.filter(
          (t) => t >= from - range * DAY && t < from - range * DAY + DAY,
        ).length,
      };
    });
    const total = data.reduce((a, d) => a + d.current, 0);
    const prevTotal = data.reduce((a, d) => a + d.previous, 0);
    const peak = data.reduce(
      (a, d) => (d.current > a.current ? d : a),
      data[0],
    );
    return {
      data,
      total,
      prevTotal,
      avg: Math.round((total / range) * 10) / 10,
      peak,
    };
  }, [s, range]);

  /* ---------- list ---------- */
  const list = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    const rows = families.filter((f) => {
      const matches =
        f.familyName.toLowerCase().includes(q) ||
        ownerOf(f).toLowerCase().includes(q);
      const isActive = f.status === "active";
      return (
        matches &&
        (filter === "all" || (filter === "active" ? isActive : !isActive))
      );
    });
    rows.sort((a, b) => {
      if (sort === "name") return a.familyName.localeCompare(b.familyName);
      if (sort === "members") return membersOf(b) - membersOf(a);
      const diff =
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime();
      return sort === "newest" ? -diff : diff;
    });
    return rows;
  }, [families, searchTerm, filter, sort]);

  const pages = Math.max(1, Math.ceil(list.length / pageSize));
  const safePage = Math.min(page, pages);
  const pageRows = list.slice((safePage - 1) * pageSize, safePage * pageSize);

  /* ---------- actions ---------- */
  const openConfirm = (f: Family, type: Exclude<ModalType, null>) =>
    setConfirmModal({
      show: true,
      type,
      familyId: f._id,
      familyName: f.familyName,
    });
  const closeModal = () => setConfirmModal((m) => ({ ...m, show: false }));

  const handleConfirmedAction = async () => {
    if (!confirmModal.familyId) return;
    if (confirmModal.type === "delete")
      await dispatch(deleteFamilyPermanently(confirmModal.familyId));
    else await dispatch(toggleFamilySuspension(confirmModal.familyId));
    setConfirmModal({
      show: false,
      type: null,
      familyId: null,
      familyName: null,
    });
  };

  const exportCsv = () =>
    downloadCsv(
      `kokohor-families-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        ["Family", "Type", "Owner", "Members", "Status", "Created"],
        ...list.map((f) => [
          f.familyName,
          f.familyType || "",
          ownerOf(f),
          membersOf(f),
          f.status,
          f.createdAt ? new Date(f.createdAt).toISOString() : "",
        ]),
      ],
    );

  const donut = [
    { name: "Active", value: s.active, color: "#10B981" },
    { name: "Suspended", value: s.suspended, color: "#F43F5E" },
  ];
  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: s.total },
    { id: "active", label: "Active", count: s.active },
    { id: "suspended", label: "Suspended", count: s.suspended },
  ];

  if (loading && families.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F5F7]">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
      </div>
    );
  }

  const d = activeFamilyDetails;

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] text-slate-950 antialiased selection:bg-amber-400 selection:text-slate-950">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {typeof window !== "undefined" &&
        createPortal(
          <>
            {/* Confirm modal */}
            <AnimatePresence>
              {confirmModal.show && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal}
                    className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                  />
                  <motion.div
                    role="alertdialog"
                    aria-modal="true"
                    initial={{ opacity: 0, scale: 0.94, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 10 }}
                    className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-2xl"
                  >
                    <div
                      className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border ${confirmModal.type === "delete" ? "border-rose-200 bg-rose-50 text-rose-500" : "border-amber-200 bg-amber-50 text-amber-500"}`}
                    >
                      {confirmModal.type === "delete" ? (
                        <Trash2 size={26} />
                      ) : (
                        <AlertTriangle size={26} />
                      )}
                    </div>
                    <h3 className="text-lg font-extrabold capitalize">
                      Confirm {confirmModal.type}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      Are you sure you want to {confirmModal.type}{" "}
                      <span className="font-bold text-slate-900">
                        {confirmModal.familyName}
                      </span>
                      ?
                      {confirmModal.type === "delete" &&
                        " This is permanent and cannot be undone."}
                    </p>
                    <div className="mt-6 flex flex-col gap-2.5">
                      <button
                        onClick={handleConfirmedAction}
                        className={`w-full rounded-xl py-3 text-xs font-bold transition ${confirmModal.type === "delete" ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-amber-400 text-slate-950 hover:bg-amber-300"}`}
                      >
                        Yes, {confirmModal.type}
                      </button>
                      <button
                        onClick={closeModal}
                        className="w-full rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Audit modal */}
            <AnimatePresence>
              {d && (
                <div className="fixed inset-0 z-[190] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => dispatch(clearActiveFamily())}
                    className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                  />
                  <motion.div
                    role="dialog"
                    aria-label="Family audit"
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 10 }}
                    className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
                      <div>
                        <h2 className="text-base font-extrabold tracking-tight">
                          {d.familyInfo.familyName}
                        </h2>
                        <p className="text-xs font-medium text-slate-500">
                          Asset audit and overview
                        </p>
                      </div>
                      <button
                        onClick={() => dispatch(clearActiveFamily())}
                        aria-label="Close"
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="flex-1 space-y-6 overflow-y-auto p-6">
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                        <AssetBadge
                          label="Tasks"
                          value={d.assets.countSummary.tasks}
                          icon={<ListChecks size={16} />}
                        />
                        <AssetBadge
                          label="Polls"
                          value={d.assets.countSummary.polls}
                          icon={<Vote size={16} />}
                        />
                        <AssetBadge
                          label="Stories"
                          value={d.assets.countSummary.content}
                          icon={<BookOpen size={16} />}
                        />
                        <AssetBadge
                          label="Campaigns"
                          value={d.assets.countSummary.campaigns}
                          icon={<CreditCard size={16} />}
                        />
                        <AssetBadge
                          label="Reports"
                          value={d.assets.reports?.length}
                          icon={<ShieldAlert size={16} />}
                        />
                        <AssetBadge
                          label="Safety nets"
                          value={d.assets.safetyNets?.length}
                          icon={<LifeBuoy size={16} />}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <AssetSection
                          title="Content repository"
                          items={d.assets.content}
                        />
                        <AssetSection
                          title="Financial ledger"
                          items={d.assets.campaigns}
                        />
                        <AssetSection
                          title="Safety and reports"
                          items={d.assets.reports}
                        />
                        <AssetSection
                          title="Safety nets"
                          items={d.assets.safetyNets}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </>,
          document.body,
        )}

      <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
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
                <h1 className="text-lg font-extrabold tracking-tight sm:text-xl">
                  Family hubs
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block">
                  Growth, size and moderation across every family
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(fetchAllFamilies())}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />{" "}
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={exportCsv}
                disabled={!list.length}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-700 disabled:opacity-40"
              >
                <Download size={14} />{" "}
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-5 sm:p-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Kpi
              icon={Network}
              tone="blue"
              label="Total families"
              value={s.total}
              footer={
                <span className="text-[11px] font-semibold text-slate-500">
                  {s.last30.toLocaleString()} created in the last 30 days
                </span>
              }
            />
            <Kpi
              icon={Activity}
              tone="emerald"
              label="Active hubs"
              value={s.active}
              footer={
                <span className="text-[11px] font-semibold text-slate-500">
                  {pct(s.active, s.total)}% of all families
                </span>
              }
            />
            <Kpi
              icon={Users}
              tone="violet"
              label="Total members"
              value={s.totalMembers}
              footer={
                <span className="text-[11px] font-semibold text-slate-500">
                  {s.avgMembers} members per family on average
                </span>
              }
            />
            <Kpi
              icon={CalendarClock}
              tone="amber"
              label="New today"
              value={s.today}
              footer={
                <DeltaBadge
                  d={delta(s.today, s.yesterday)}
                  label="vs yesterday"
                />
              }
            />
            <Kpi
              icon={UserPlus}
              tone="rose"
              label="New this week"
              value={s.last7}
              footer={
                <DeltaBadge
                  d={delta(s.last7, s.prev7)}
                  label="vs previous 7 days"
                />
              }
            />
          </div>

          {/* Growth + status */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card
              className="xl:col-span-2"
              title="Family growth"
              subtitle="New families per day, compared with the period before"
              right={
                <div
                  role="tablist"
                  aria-label="Time range"
                  className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1"
                >
                  {([7, 30, 90] as Range[]).map((r) => (
                    <button
                      key={r}
                      role="tab"
                      aria-selected={range === r}
                      onClick={() => setRange(r)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${range === r ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"}`}
                    >
                      {r}d
                    </button>
                  ))}
                </div>
              }
            >
              <div className="mb-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    New families
                  </p>
                  <p className="mt-1 text-xl font-extrabold tabular-nums">
                    {growth.total.toLocaleString()}
                  </p>
                  <DeltaBadge
                    d={delta(growth.total, growth.prevTotal)}
                    label=""
                  />
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Daily average
                  </p>
                  <p className="mt-1 text-xl font-extrabold tabular-nums">
                    {growth.avg}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Best day
                  </p>
                  <p className="mt-1 text-xl font-extrabold tabular-nums">
                    {growth.peak?.current ?? 0}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500">
                    {growth.peak?.label}
                  </p>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={growth.data}
                    margin={{ top: 8, right: 8, left: -22, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="fCur" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={AMBER} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={AMBER} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#F1F5F9"
                    />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      minTickGap={24}
                      dy={6}
                      tick={{ fontSize: 11, fontWeight: 600, fill: "#64748B" }}
                    />
                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ stroke: "#CBD5E1", strokeDasharray: "4 4" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="previous"
                      name="previous period"
                      stroke="#94A3B8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fill="none"
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="current"
                      name="new families"
                      stroke={AMBER}
                      strokeWidth={3}
                      fill="url(#fCur)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: AMBER,
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex items-center gap-5 text-[11px] font-semibold text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <span className="h-0.5 w-5 rounded bg-amber-500" /> This
                  period
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-0.5 w-5 border-t-2 border-dashed border-slate-400" />{" "}
                  Previous period
                </span>
              </div>
            </Card>

            <Card title="Hub status" subtitle="Active vs suspended">
              <div className="relative mx-auto h-44 w-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<ChartTooltip />} />
                    <Pie
                      data={
                        s.total
                          ? donut
                          : [{ name: "No data", value: 1, color: "#E2E8F0" }]
                      }
                      dataKey="value"
                      innerRadius={54}
                      outerRadius={76}
                      paddingAngle={s.total && s.suspended > 0 ? 5 : 0}
                      cornerRadius={6}
                      stroke="none"
                    >
                      {(s.total ? donut : [{ color: "#E2E8F0" }]).map(
                        (x, i) => (
                          <Cell key={i} fill={x.color} />
                        ),
                      )}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold tabular-nums">
                    {pct(s.active, s.total)}%
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Active
                  </span>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-xs font-semibold">
                {donut.map((x) => (
                  <li
                    key={x.name}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-2.5"
                  >
                    <span className="flex items-center gap-2.5 text-slate-700">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: x.color }}
                      />{" "}
                      {x.name}
                    </span>
                    <span className="tabular-nums">
                      <strong className="text-slate-900">
                        {x.value.toLocaleString()}
                      </strong>{" "}
                      <span className="text-slate-400">
                        · {pct(x.value, s.total)}%
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card title="Family types" subtitle="Share of all families">
              {s.types.length === 0 ? (
                <p className="text-xs font-medium text-slate-500">
                  No families yet.
                </p>
              ) : (
                <>
                  <div className="relative mx-auto h-40 w-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip content={<ChartTooltip />} />
                        <Pie
                          data={s.types}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={48}
                          outerRadius={70}
                          paddingAngle={3}
                          stroke="none"
                        >
                          {s.types.map((t) => (
                            <Cell key={t.name} fill={t.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-extrabold tabular-nums">
                        {s.total}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Hubs
                      </span>
                    </div>
                  </div>
                  <ul className="mt-4 max-h-32 space-y-2 overflow-y-auto pr-1">
                    {s.types.map((t) => (
                      <li
                        key={t.name}
                        className="flex items-center gap-3 text-xs font-bold"
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ background: t.color }}
                        />
                        <span className="flex-1 truncate capitalize text-slate-600">
                          {t.name}
                        </span>
                        <span className="tabular-nums text-slate-400">
                          {t.value}
                        </span>
                        <span className="w-12 text-right tabular-nums">
                          {pct(t.value, s.total)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Card>

            <Card
              title="Family size"
              subtitle={
                s.total
                  ? `${s.solo} ${s.solo === 1 ? "family has" : "families have"} a single member`
                  : "Members per family"
              }
            >
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={s.sizes}
                    margin={{ top: 4, right: 4, left: -26, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fontWeight: 600, fill: "#64748B" }}
                    />
                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: "#F8FAFC" }}
                    />
                    <Bar
                      dataKey="count"
                      name="families"
                      fill={AMBER}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-center text-[11px] font-semibold text-slate-400">
                Members per family
              </p>
            </Card>

            <Card title="Largest families" subtitle="Top five by member count">
              {s.largest.length === 0 ? (
                <p className="text-xs font-medium text-slate-500">
                  No families yet.
                </p>
              ) : (
                <ul className="-my-2 divide-y divide-slate-100">
                  {s.largest.map((f, i) => (
                    <li key={f._id}>
                      <button
                        onClick={() => dispatch(fetchFamilyDeepDive(f._id))}
                        className="flex w-full items-center gap-3 py-2.5 text-left transition hover:opacity-80"
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${i === 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}
                        >
                          {i === 0 ? <Crown size={14} /> : i + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-bold text-slate-900">
                            {f.familyName}
                          </span>
                          {/* <span className="block truncate text-[11px] text-slate-400">
                            Owner: {ownerOf(f)}
                          </span> */}
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-extrabold tabular-nums text-slate-700">
                          <UserRound size={13} className="text-slate-400" />{" "}
                          {membersOf(f)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* Directory */}
          <section aria-label="Family directory" className="space-y-4">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
              <div
                role="tablist"
                aria-label="Filter by status"
                className="inline-flex w-full rounded-xl border border-slate-200 bg-slate-50 p-1 lg:w-auto"
              >
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={filter === t.id}
                    onClick={() => setFilter(t.id)}
                    className={`flex-1 rounded-lg px-4 py-2 text-xs font-bold transition lg:flex-none ${filter === t.id ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    {t.label}{" "}
                    <span
                      className={`ml-1 text-[10px] ${filter === t.id ? "text-amber-400" : "text-slate-400"}`}
                    >
                      {t.count}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
                  />
                  <input
                    type="text"
                    aria-label="Search families"
                    placeholder="Search family or owner…"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 sm:w-72"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  aria-label="Sort families"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-amber-400 focus:bg-white"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="members">Most members</option>
                  <option value="name">Name (A to Z)</option>
                </select>
              </div>
            </div>

            {list.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <FolderTree className="mx-auto mb-3 text-slate-300" size={36} />
                <p className="text-sm font-bold">No families found</p>
                <p className="mt-1 text-xs text-slate-500">
                  Try a different search or filter.
                </p>
                {(searchTerm || filter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilter("all");
                    }}
                    className="mt-4 text-xs font-bold text-amber-600 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 pl-6 pr-4">Family</th>
                        {/* <th className="hidden px-4 py-3.5 md:table-cell">
                          Owner
                        </th> */}
                        <th className="px-4 py-3.5 text-center">Members</th>
                        <th className="px-4 py-3.5 text-center">Status</th>
                        <th className="hidden px-4 py-3.5 sm:table-cell">
                          Created
                        </th>
                        <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {pageRows.map((f) => {
                        const isActive = f.status === "active";
                        return (
                          <tr
                            key={f._id}
                            onClick={() => dispatch(fetchFamilyDeepDive(f._id))}
                            className="cursor-pointer transition-colors hover:bg-slate-50/70"
                          >
                            <td className="py-3.5 pl-6 pr-4">
                              <p className="font-bold text-slate-900">
                                {f.familyName}
                              </p>
                              <span className="mt-1 inline-block rounded-md border border-amber-200/70 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                                {f.familyType || "n/a"}
                              </span>
                            </td>
                            {/* <td className="hidden px-4 py-3.5 text-slate-600 md:table-cell">
                              {ownerOf(f)}
                            </td> */}
                            <td className="px-4 py-3.5 text-center font-bold tabular-nums text-slate-900">
                              {membersOf(f)}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <StatusPill active={isActive} text={f.status} />
                            </td>
                            <td className="hidden px-4 py-3.5 text-slate-500 sm:table-cell">
                              {f.createdAt
                                ? timeAgo(new Date(f.createdAt).getTime())
                                : "N/A"}
                            </td>
                            <td
                              className="py-3.5 pl-4 pr-6 text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() =>
                                    dispatch(fetchFamilyDeepDive(f._id))
                                  }
                                  title="Audit family"
                                  aria-label={`Audit ${f.familyName}`}
                                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    openConfirm(
                                      f,
                                      isActive ? "suspend" : "activate",
                                    )
                                  }
                                  className={`rounded-lg px-3 py-1.5 font-bold transition ${isActive ? "bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-600" : "bg-amber-400 text-slate-950 hover:bg-amber-300"}`}
                                >
                                  {isActive ? "Suspend" : "Activate"}
                                </button>
                                <button
                                  onClick={() => openConfirm(f, "delete")}
                                  title="Delete family"
                                  aria-label={`Delete ${f.familyName}`}
                                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div
                  className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/50 px-5 py-3.5 text-xs font-semibold text-slate-500 sm:flex-row"
                  aria-live="polite"
                >
                  <span>
                    Showing{" "}
                    <strong className="text-slate-900">
                      {(safePage - 1) * pageSize + 1}
                    </strong>{" "}
                    to{" "}
                    <strong className="text-slate-900">
                      {Math.min(safePage * pageSize, list.length)}
                    </strong>{" "}
                    of <strong className="text-slate-900">{list.length}</strong>
                  </span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2">
                      Rows
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 font-bold text-slate-700 outline-none"
                      >
                        {[10, 25, 50].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPage(safePage - 1)}
                        disabled={safePage <= 1}
                        aria-label="Previous page"
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="px-1 tabular-nums">
                        Page {safePage} of {pages}
                      </span>
                      <button
                        onClick={() => setPage(safePage + 1)}
                        disabled={safePage >= pages}
                        aria-label="Next page"
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

const AssetBadge = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: number;
  icon: React.ReactNode;
}) => (
  <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold text-slate-500">{label}</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700">
        {icon}
      </span>
    </div>
    <p className="mt-3 text-2xl font-extrabold tabular-nums text-slate-900">
      {value || 0}
    </p>
  </div>
);

const AssetSection = ({ title, items }: { title: string; items?: any[] }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <h4 className="mb-3 border-b border-slate-100 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
      {title}
    </h4>
    <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
      {items && items.length > 0 ? (
        items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
          >
            <span className="truncate pr-2 font-bold text-slate-800">
              {item.title || item.contentType || "Asset"}
            </span>
            <span className="whitespace-nowrap text-[11px] font-semibold text-slate-400">
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString()
                : ""}
            </span>
          </div>
        ))
      ) : (
        <p className="py-2 text-center text-xs italic text-slate-400">
          No records found
        </p>
      )}
    </div>
  </div>
);

export default FamilyManagement;
