import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  CalendarClock,
  Search,
  Trash2,
  AlertTriangle,
  Loader2,
  Menu,
  X,
  Phone,
  Mail,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Camera,
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
  fetchAllUsers,
  toggleUserSuspension,
  deleteUserAccount,
} from "../redux/slices/adminUserSlice";
import Sidebar from "./Sidebar";

type Filter = "all" | "active" | "suspended";
type Sort = "newest" | "oldest" | "name";
type ModalType = "delete" | "suspend" | "activate" | null;
type Range = 7 | 30 | 90;

const DAY = 86_400_000;
const AMBER = "#F59E0B";

/* ---------- helpers ---------- */
const pct = (n: number, total: number) =>
  total ? Math.round((n / total) * 1000) / 10 : 0;
const startOfDay = (t: number) => {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
const timeAgo = (ms: number) => {
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
const csvSafe = (v: unknown) => {
  let s = String(v ?? "");
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // avoid spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
};

type Delta = { diff: number; pct: number | null };
const delta = (cur: number, prev: number): Delta => ({
  diff: cur - prev,
  pct: prev ? Math.round(((cur - prev) / prev) * 100) : null,
});

const TONES: Record<string, string> = {
  amber: "bg-amber-50 text-amber-600 border-amber-200/70",
  blue: "bg-blue-50 text-blue-600 border-blue-200/70",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-200/70",
  rose: "bg-rose-50 text-rose-600 border-rose-200/70",
  violet: "bg-violet-50 text-violet-600 border-violet-200/70",
};

/* ---------- small components ---------- */
const ChartTooltip = ({ active, payload, label }: any) => {
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

const DeltaBadge = ({ d, label }: { d: Delta; label: string }) => {
  const up = d.diff > 0;
  const flat = d.diff === 0;
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

const Kpi = ({
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

const Avatar = ({
  src,
  name,
  size = "h-10 w-10",
}: {
  src?: string;
  name?: string;
  size?: string;
}) => (
  <div
    className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 font-bold text-slate-600`}
  >
    {src ? (
      <img src={src} alt="" className="h-full w-full object-cover" />
    ) : (
      <span>{name?.[0]?.toUpperCase() || "?"}</span>
    )}
  </div>
);

const StatusPill = ({ active, text }: { active: boolean; text: string }) => (
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

/* =================================================================== */

const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, actionLoading } = useSelector(
    (state: RootState) => state.adminUser,
  );
  type User = (typeof users)[number];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [range, setRange] = useState<Range>(30);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: ModalType;
    userId: string | null;
    userName: string | null;
  }>({ show: false, type: null, userId: null, userName: null });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => setPage(1), [searchTerm, filter, sort, pageSize]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setConfirmModal((m) => ({ ...m, show: false }));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- statistics (all computed from real createdAt dates) ---------- */
  const s = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "active").length;
    const suspended = total - active;

    const times = users
      .map((u) => (u.createdAt ? new Date(u.createdAt).getTime() : NaN))
      .filter(Number.isFinite);
    const count = (from: number, to: number) =>
      times.filter((t) => t >= from && t < to).length;

    const now = Date.now();
    const today0 = startOfDay(now);
    const today = count(today0, now + 1);
    const yesterday = count(today0 - DAY, today0);
    const last30 = count(now - 30 * DAY, now + 1);
    const prev30 = count(now - 60 * DAY, now - 30 * DAY);
    const last7 = count(now - 7 * DAY, now + 1);
    const prev7 = count(now - 14 * DAY, now - 7 * DAY);

    // Weekday distribution (Mon..Sun)
    const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const byDay = names.map((name) => ({ name, count: 0 }));
    times.forEach((t) => {
      const i = (new Date(t).getDay() + 6) % 7;
      byDay[i].count += 1;
    });

    const withPhone = users.filter((u) => !!u.phone).length;
    const withPhoto = users.filter((u) => !!u.profilePicture).length;
    const complete = users.filter(
      (u) => !!u.phone && !!u.profilePicture,
    ).length;

    return {
      total,
      active,
      suspended,
      today,
      yesterday,
      last30,
      prev30,
      last7,
      prev7,
      byDay,
      withPhone,
      withPhoto,
      complete,
      times,
      today0,
      now,
    };
  }, [users]);

  const growth = useMemo(() => {
    const data = Array.from({ length: range }, (_, i) => {
      const from = s.today0 - (range - 1 - i) * DAY;
      const cur = s.times.filter((t) => t >= from && t < from + DAY).length;
      const prev = s.times.filter(
        (t) => t >= from - range * DAY && t < from - range * DAY + DAY,
      ).length;
      return {
        label: new Date(from).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        current: cur,
        previous: prev,
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

  const recent = useMemo(
    () =>
      [...users]
        .filter((u) => u.createdAt)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    [users],
  );

  /* ---------- directory list ---------- */
  const list = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    const rows = users.filter((u) => {
      const matches = `${u.firstName} ${u.lastName} ${u.email}`
        .toLowerCase()
        .includes(q);
      const isActive = u.status === "active";
      return (
        matches &&
        (filter === "all" || (filter === "active" ? isActive : !isActive))
      );
    });
    rows.sort((a, b) => {
      if (sort === "name")
        return `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`,
        );
      const diff =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sort === "newest" ? -diff : diff;
    });
    return rows;
  }, [users, searchTerm, filter, sort]);

  const pages = Math.max(1, Math.ceil(list.length / pageSize));
  const safePage = Math.min(page, pages);
  const pageRows = list.slice((safePage - 1) * pageSize, safePage * pageSize);
  const selected = users.find((u) => u._id === selectedId) ?? null;

  /* ---------- actions ---------- */
  const fullNameOf = (u: User) =>
    `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unnamed user";

  const openConfirm = (u: User, type: Exclude<ModalType, null>) =>
    setConfirmModal({
      show: true,
      type,
      userId: u._id,
      userName: fullNameOf(u),
    });
  const closeModal = () => setConfirmModal((m) => ({ ...m, show: false }));

  const handleConfirmedAction = async () => {
    if (!confirmModal.userId) return;
    if (confirmModal.type === "delete") {
      await dispatch(deleteUserAccount(confirmModal.userId));
      if (selectedId === confirmModal.userId) setSelectedId(null);
    } else {
      await dispatch(toggleUserSuspension(confirmModal.userId));
    }
    setConfirmModal({ show: false, type: null, userId: null, userName: null });
  };

  const exportCsv = () => {
    const header = ["Name", "Email", "Phone", "Status", "Joined"];
    const rows = list.map((u) => [
      fullNameOf(u),
      u.email,
      u.phone || "",
      u.status,
      u.createdAt ? new Date(u.createdAt).toISOString() : "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map(csvSafe).join(","))
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `kokohor-users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const donut = [
    { name: "Active", value: s.active, color: "#10B981" },
    { name: "Suspended", value: s.suspended, color: "#F43F5E" },
  ];

  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: s.total },
    { id: "active", label: "Active", count: s.active },
    { id: "suspended", label: "Suspended", count: s.suspended },
  ];

  const completeness = [
    { label: "Has phone number", value: s.withPhone, icon: Phone },
    { label: "Has profile photo", value: s.withPhoto, icon: Camera },
    { label: "Complete profile", value: s.complete, icon: UserCheck },
  ];

  const peakWeekday = s.byDay.reduce(
    (a, d) => (d.count > a.count ? d : a),
    s.byDay[0],
  );
  const initialLoading = loading && users.length === 0;

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] text-slate-950 antialiased selection:bg-amber-400 selection:text-slate-950">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Portals: confirm modal + user drawer */}
      {typeof window !== "undefined" &&
        createPortal(
          <>
            <AnimatePresence>
              {selected && (
                <>
                  <motion.div
                    key="drawer-bg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedId(null)}
                    className="fixed inset-0 z-[150] bg-slate-900/30 backdrop-blur-[2px]"
                  />
                  <motion.aside
                    key="drawer"
                    role="dialog"
                    aria-label="User details"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "tween", duration: 0.25 }}
                    className="fixed right-0 top-0 z-[160] flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                      <h3 className="text-sm font-extrabold">User details</h3>
                      <button
                        onClick={() => setSelectedId(null)}
                        aria-label="Close"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="flex items-center gap-4">
                        <Avatar
                          src={selected.profilePicture}
                          name={selected.firstName}
                          size="h-16 w-16 text-xl"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-lg font-extrabold">
                            {fullNameOf(selected)}
                          </p>
                          <div className="mt-1">
                            <StatusPill
                              active={selected.status === "active"}
                              text={selected.status}
                            />
                          </div>
                        </div>
                      </div>
                      <dl className="mt-8 divide-y divide-slate-100 text-sm">
                        {[
                          { icon: Mail, k: "Email", v: selected.email },
                          {
                            icon: Phone,
                            k: "Phone",
                            v: selected.phone || "Not provided",
                          },
                          {
                            icon: CalendarClock,
                            k: "Joined",
                            v: selected.createdAt
                              ? `${new Date(selected.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} (${timeAgo(new Date(selected.createdAt).getTime())})`
                              : "N/A",
                          },
                        ].map((r) => (
                          <div
                            key={r.k}
                            className="flex items-start gap-3 py-3.5"
                          >
                            <r.icon
                              size={16}
                              className="mt-0.5 shrink-0 text-slate-400"
                            />
                            <div className="min-w-0">
                              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                {r.k}
                              </dt>
                              <dd className="mt-0.5 break-words font-semibold text-slate-800">
                                {r.v}
                              </dd>
                            </div>
                          </div>
                        ))}
                        <div className="py-3.5">
                          <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            User ID
                          </dt>
                          <dd className="mt-0.5 break-all font-mono text-xs text-slate-500">
                            {selected._id}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="flex gap-3 border-t border-slate-100 p-4">
                      <button
                        onClick={() =>
                          openConfirm(
                            selected,
                            selected.status === "active"
                              ? "suspend"
                              : "activate",
                          )
                        }
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition ${
                          selected.status === "active"
                            ? "bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600"
                            : "bg-amber-400 text-slate-950 hover:bg-amber-300"
                        }`}
                      >
                        {selected.status === "active" ? (
                          <ShieldAlert size={15} />
                        ) : (
                          <ShieldCheck size={15} />
                        )}
                        {selected.status === "active"
                          ? "Suspend account"
                          : "Activate account"}
                      </button>
                      <button
                        onClick={() => openConfirm(selected, "delete")}
                        aria-label="Delete user"
                        className="rounded-xl bg-slate-100 px-4 text-slate-500 transition hover:bg-rose-500 hover:text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

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
                    <h3 className="text-lg font-extrabold capitalize text-black">
                      Confirm {confirmModal.type}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      Are you sure you want to {confirmModal.type}{" "}
                      <span className="font-bold text-slate-900">
                        {confirmModal.userName}
                      </span>
                      ?
                      {confirmModal.type === "delete" &&
                        " This is permanent and cannot be undone."}
                    </p>
                    <div className="mt-6 flex flex-col gap-2.5">
                      <button
                        onClick={handleConfirmedAction}
                        disabled={actionLoading}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition disabled:opacity-60 ${confirmModal.type === "delete" ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-amber-400 text-slate-950 hover:bg-amber-300"}`}
                      >
                        {actionLoading ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          `Yes, ${confirmModal.type}`
                        )}
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
          </>,
          document.body,
        )}

      <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
        {/* Top bar */}
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
                  Users
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block">
                  Growth, account health and moderation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(fetchAllUsers())}
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
          {initialLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <Loader2 className="animate-spin text-amber-500" size={36} />
              <p className="mt-3 text-xs font-semibold text-slate-500">
                Loading users…
              </p>
            </div>
          ) : (
            <>
              {/* KPI strip */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <Kpi
                  icon={Users}
                  tone="blue"
                  label="Total users"
                  value={s.total}
                  footer={
                    <span className="text-[11px] font-semibold text-slate-500">
                      {s.last30.toLocaleString()} joined in the last 30 days
                    </span>
                  }
                />
                <Kpi
                  icon={UserCheck}
                  tone="emerald"
                  label="Active accounts"
                  value={s.active}
                  footer={
                    <span className="text-[11px] font-semibold text-slate-500">
                      {pct(s.active, s.total)}% of all users
                    </span>
                  }
                />
                <Kpi
                  icon={UserX}
                  tone="rose"
                  label="Suspended"
                  value={s.suspended}
                  footer={
                    <span className="text-[11px] font-semibold text-slate-500">
                      {pct(s.suspended, s.total)}% of all users
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
                  tone="violet"
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
                  title="Sign-up growth"
                  subtitle="Daily sign-ups, compared with the period before"
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
                        Sign-ups
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
                          <linearGradient id="gCur" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="0%"
                              stopColor={AMBER}
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor={AMBER}
                              stopOpacity={0}
                            />
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
                          tick={{
                            fontSize: 11,
                            fontWeight: 600,
                            fill: "#64748B",
                          }}
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
                          name="sign-ups"
                          stroke={AMBER}
                          strokeWidth={3}
                          fill="url(#gCur)"
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
                      <span className="h-0.5 w-5 rounded border-t-2 border-dashed border-slate-400" />{" "}
                      Previous period
                    </span>
                  </div>
                </Card>

                <Card title="Account status" subtitle="Active vs suspended">
                  <div className="relative mx-auto h-44 w-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip content={<ChartTooltip />} />
                        <Pie
                          data={
                            s.total
                              ? donut
                              : [
                                  {
                                    name: "No data",
                                    value: 1,
                                    color: "#E2E8F0",
                                  },
                                ]
                          }
                          dataKey="value"
                          innerRadius={54}
                          outerRadius={76}
                          paddingAngle={s.total && s.suspended > 0 ? 5 : 0}
                          cornerRadius={6}
                          stroke="none"
                        >
                          {(s.total ? donut : [{ color: "#E2E8F0" }]).map(
                            (d, i) => (
                              <Cell key={i} fill={d.color} />
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
                    {donut.map((d) => (
                      <li
                        key={d.name}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-2.5"
                      >
                        <span className="flex items-center gap-2.5 text-slate-700">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: d.color }}
                          />{" "}
                          {d.name}
                        </span>
                        <span className="tabular-nums">
                          <strong className="text-slate-900">
                            {d.value.toLocaleString()}
                          </strong>{" "}
                          <span className="text-slate-400">
                            · {pct(d.value, s.total)}%
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Insights row */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card
                  title="Sign-ups by weekday"
                  subtitle={
                    s.total
                      ? `${peakWeekday.name} is the busiest day`
                      : "All time"
                  }
                >
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={s.byDay}
                        margin={{ top: 4, right: 4, left: -26, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 11,
                            fontWeight: 600,
                            fill: "#64748B",
                          }}
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
                          name="sign-ups"
                          radius={[6, 6, 0, 0]}
                        >
                          {s.byDay.map((d) => (
                            <Cell
                              key={d.name}
                              fill={
                                d.name === peakWeekday.name && d.count > 0
                                  ? AMBER
                                  : "#E2E8F0"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card
                  title="Profile completeness"
                  subtitle="How much users have filled in"
                >
                  <ul className="space-y-4">
                    {completeness.map((c) => (
                      <li key={c.label}>
                        <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
                          <span className="flex items-center gap-2 text-slate-600">
                            <c.icon size={14} className="text-slate-400" />{" "}
                            {c.label}
                          </span>
                          <span className="tabular-nums text-slate-900">
                            {pct(c.value, s.total)}%{" "}
                            <span className="font-semibold text-slate-400">
                              ({c.value})
                            </span>
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct(c.value, s.total)}%` }}
                            transition={{ duration: 0.6 }}
                            className="h-full rounded-full bg-amber-400"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card title="Recently joined" subtitle="Newest five accounts">
                  {recent.length === 0 ? (
                    <p className="text-xs font-medium text-slate-500">
                      No users yet.
                    </p>
                  ) : (
                    <ul className="-my-2 divide-y divide-slate-100">
                      {recent.map((u) => (
                        <li key={u._id}>
                          <button
                            onClick={() => setSelectedId(u._id)}
                            className="flex w-full items-center gap-3 py-2.5 text-left transition hover:opacity-80"
                          >
                            <Avatar
                              src={u.profilePicture}
                              name={u.firstName}
                              size="h-9 w-9"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-bold text-slate-900">
                                {fullNameOf(u)}
                              </span>
                              <span className="block truncate text-[11px] text-slate-400">
                                {u.email}
                              </span>
                            </span>
                            <span className="shrink-0 text-[11px] font-semibold text-slate-500">
                              {timeAgo(new Date(u.createdAt).getTime())}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </div>

              {/* Directory */}
              <section aria-label="User directory" className="space-y-4">
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
                        aria-label="Search users"
                        placeholder="Search name or email…"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 sm:w-72"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      aria-label="Sort users"
                      value={sort}
                      onChange={(e) => setSort(e.target.value as Sort)}
                      className="rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-amber-400 focus:bg-white"
                    >
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                      <option value="name">Name (A to Z)</option>
                    </select>
                  </div>
                </div>

                {list.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                    <Users className="mx-auto mb-3 text-slate-300" size={36} />
                    <p className="text-sm font-bold">No users found</p>
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
                            <th className="py-3.5 pl-6 pr-4">User</th>
                            <th className="hidden px-4 py-3.5 md:table-cell">
                              Phone
                            </th>
                            <th className="px-4 py-3.5">Status</th>
                            <th className="hidden px-4 py-3.5 sm:table-cell">
                              Joined
                            </th>
                            <th className="py-3.5 pl-4 pr-6 text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                          {pageRows.map((u) => {
                            const isActive = u.status === "active";
                            return (
                              <tr
                                key={u._id}
                                onClick={() => setSelectedId(u._id)}
                                className="cursor-pointer transition-colors hover:bg-slate-50/70"
                              >
                                <td className="py-3.5 pl-6 pr-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar
                                      src={u.profilePicture}
                                      name={u.firstName}
                                    />
                                    <div className="min-w-0">
                                      <p className="truncate font-bold text-slate-900">
                                        {fullNameOf(u)}
                                      </p>
                                      <p className="truncate text-[11px] text-slate-400">
                                        {u.email}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="hidden px-4 py-3.5 text-slate-600 md:table-cell">
                                  {u.phone || (
                                    <span className="italic text-slate-400">
                                      Not provided
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3.5">
                                  <StatusPill
                                    active={isActive}
                                    text={u.status}
                                  />
                                </td>
                                <td className="hidden px-4 py-3.5 text-slate-500 sm:table-cell">
                                  {u.createdAt
                                    ? timeAgo(new Date(u.createdAt).getTime())
                                    : "N/A"}
                                </td>
                                <td
                                  className="py-3.5 pl-4 pr-6 text-right"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() =>
                                        openConfirm(
                                          u,
                                          isActive ? "suspend" : "activate",
                                        )
                                      }
                                      className={`rounded-lg px-3 py-1.5 font-bold transition ${isActive ? "bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600" : "bg-amber-400 text-slate-950 hover:bg-amber-300"}`}
                                    >
                                      {isActive ? "Suspend" : "Activate"}
                                    </button>
                                    <button
                                      onClick={() => openConfirm(u, "delete")}
                                      aria-label={`Delete ${fullNameOf(u)}`}
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

                    {/* Pagination */}
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
                        of{" "}
                        <strong className="text-slate-900">
                          {list.length}
                        </strong>
                      </span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2">
                          Rows
                          <select
                            value={pageSize}
                            onChange={(e) =>
                              setPageSize(Number(e.target.value))
                            }
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
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserManagement;
