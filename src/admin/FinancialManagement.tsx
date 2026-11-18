import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Eye,
  Menu,
  X,
  Loader2,
  Search,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Target,
  Percent,
  Megaphone,
  Coins,
  AlertTriangle,
  Crown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  CartesianGrid,
} from "recharts";
import type { AppDispatch, RootState } from "../redux/store";
import {
  fetchAllCampaigns,
  fetchCampaignContributions,
  verifyContribution,
} from "../redux/slices/adminFinanceSlice";
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

type Range = 7 | 30 | 90 | "all";
type Sort = "newest" | "raised" | "progress" | "target";
type CFilter = "all" | "PENDING" | "VERIFIED" | "REJECTED";

const naira = (n: number) => `₦${Math.round(n || 0).toLocaleString()}`;
const compact = (n: number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

const FinancialManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { campaigns, contributions, loading, actionLoading } = useSelector(
    (state: RootState) => state.adminFinance,
  );
  type Campaign = (typeof campaigns)[number];
  type Contribution = (typeof contributions)[number];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [range, setRange] = useState<Range>(30);
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [proofModal, setProofModal] = useState<string | null>(null);
  const [cFilter, setCFilter] = useState<CFilter>("all");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [confirm, setConfirm] = useState<{
    con: Contribution;
    status: "VERIFIED" | "REJECTED";
  } | null>(null);

  useEffect(() => {
    dispatch(fetchAllCampaigns());
  }, [dispatch]);

  useEffect(() => setPage(1), [search, statusFilter, sort, pageSize]);
  useEffect(() => setCFilter("all"), [selected?._id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (confirm) setConfirm(null);
      else if (proofModal) setProofModal(null);
      else setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirm, proofModal]);

  const openCampaign = (c: Campaign) => {
    setSelected(c);
    dispatch(fetchCampaignContributions(c._id));
  };

  const progressOf = (c: Campaign) =>
    c.targetAmount ? (c.totalRaised / c.targetAmount) * 100 : 0;
  const createdAt = (c: Campaign) =>
    c.createdAt ? new Date(c.createdAt).getTime() : NaN;

  /* ---------- statistics for the chosen range ---------- */
  const s = useMemo(() => {
    const now = Date.now();
    const within = (c: Campaign, from: number, to: number) => {
      const t = createdAt(c);
      return t >= from && t < to;
    };
    const cur =
      range === "all"
        ? campaigns
        : campaigns.filter((c) => within(c, now - range * DAY, now + 1));
    const prev =
      range === "all"
        ? []
        : campaigns.filter((c) =>
            within(c, now - 2 * range * DAY, now - range * DAY),
          );
    const sum = (arr: Campaign[], k: "totalRaised" | "targetAmount") =>
      arr.reduce((a, c) => a + (Number(c[k]) || 0), 0);

    const raised = sum(cur, "totalRaised");
    const target = sum(cur, "targetAmount");
    const prevRaised = sum(prev, "totalRaised");
    const rate = pct(raised, target);
    const avg = cur.length ? raised / cur.length : 0;
    const prevAvg = prev.length ? prevRaised / prev.length : 0;

    // time buckets: daily (7/30), weekly (90), monthly (all)
    const end = startOfDay(now) + DAY;
    let buckets: { label: string; from: number; to: number }[];
    if (range === "all") {
      buckets = Array.from({ length: 12 }, (_, i) => {
        const d = new Date();
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        d.setMonth(d.getMonth() - (11 - i));
        return {
          label: d.toLocaleDateString(undefined, { month: "short" }),
          from: d.getTime(),
          to: new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime(),
        };
      });
    } else {
      const step = range === 90 ? 7 * DAY : DAY;
      const n = range === 90 ? 13 : range;
      buckets = Array.from({ length: n }, (_, i) => {
        const from = end - (n - i) * step;
        return {
          label: new Date(from).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          }),
          from,
          to: from + step,
        };
      });
    }
    const series = buckets.map((b) => {
      const inB = campaigns.filter((c) => within(c, b.from, b.to));
      return {
        label: b.label,
        raised: sum(inB, "totalRaised"),
        count: inB.length,
      };
    });

    const statusMap = new Map<string, { count: number; raised: number }>();
    cur.forEach((c) => {
      const k = c.status || "unknown";
      const v = statusMap.get(k) || { count: 0, raised: 0 };
      statusMap.set(k, {
        count: v.count + 1,
        raised: v.raised + (Number(c.totalRaised) || 0),
      });
    });
    const statuses = [...statusMap.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .map(([name, v], i) => ({
        name,
        value: v.count,
        raised: v.raised,
        color: PALETTE[i % PALETTE.length],
      }));

    const prog = (c: Campaign) =>
      c.targetAmount ? (c.totalRaised / c.targetAmount) * 100 : 0;
    const funding = [
      { label: "Under 25%", count: cur.filter((c) => prog(c) < 25).length },
      {
        label: "25-49%",
        count: cur.filter((c) => prog(c) >= 25 && prog(c) < 50).length,
      },
      {
        label: "50-74%",
        count: cur.filter((c) => prog(c) >= 50 && prog(c) < 75).length,
      },
      {
        label: "75-99%",
        count: cur.filter((c) => prog(c) >= 75 && prog(c) < 100).length,
      },
      { label: "Funded", count: cur.filter((c) => prog(c) >= 100).length },
    ];

    const top = [...cur]
      .sort((a, b) => b.totalRaised - a.totalRaised)
      .slice(0, 5);

    const famMap = new Map<string, { raised: number; count: number }>();
    cur.forEach((c) => {
      const k = c.family?.familyName || "Independent";
      const v = famMap.get(k) || { raised: 0, count: 0 };
      famMap.set(k, {
        raised: v.raised + (Number(c.totalRaised) || 0),
        count: v.count + 1,
      });
    });
    const families = [...famMap.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.raised - a.raised)
      .slice(0, 5);

    return {
      cur,
      prev,
      raised,
      target,
      prevRaised,
      rate,
      avg,
      prevAvg,
      series,
      statuses,
      funding,
      top,
      families,
      hasPrev: range !== "all",
    };
  }, [campaigns, range]);

  /* ---------- campaign directory ---------- */
  const allStatuses = useMemo(
    () => [...new Set(campaigns.map((c) => c.status).filter(Boolean))],
    [campaigns],
  );

  const list = useMemo(() => {
    const q = search.toLowerCase().trim();
    const rows = campaigns.filter((c) => {
      const matches =
        c.title.toLowerCase().includes(q) ||
        (c.family?.familyName || "").toLowerCase().includes(q);
      return matches && (statusFilter === "all" || c.status === statusFilter);
    });
    rows.sort((a, b) => {
      if (sort === "raised") return b.totalRaised - a.totalRaised;
      if (sort === "target") return b.targetAmount - a.targetAmount;
      if (sort === "progress") return progressOf(b) - progressOf(a);
      return (createdAt(b) || 0) - (createdAt(a) || 0);
    });
    return rows;
  }, [campaigns, search, statusFilter, sort]);

  const pages = Math.max(1, Math.ceil(list.length / pageSize));
  const safePage = Math.min(page, pages);
  const pageRows = list.slice((safePage - 1) * pageSize, safePage * pageSize);

  /* ---------- contributions of the selected campaign ---------- */
  const cs = useMemo(() => {
    const amt = (c: Contribution) => Number(c.amountSent) || 0;
    const by = (st: string) =>
      contributions.filter((c) => c.verificationStatus === st);
    const pending = by("PENDING"),
      verified = by("VERIFIED"),
      rejected = by("REJECTED");
    const sumOf = (a: Contribution[]) => a.reduce((x, c) => x + amt(c), 0);
    return {
      total: contributions.length,
      totalAmount: sumOf(contributions),
      pending: pending.length,
      pendingAmount: sumOf(pending),
      verified: verified.length,
      verifiedAmount: sumOf(verified),
      rejected: rejected.length,
    };
  }, [contributions]);

  const shownContribs = contributions.filter(
    (c) => cFilter === "all" || c.verificationStatus === cFilter,
  );
  const nameOf = (c: Contribution) =>
    `${c.contributor?.firstName || "Anonymous"} ${c.contributor?.lastName || ""}`.trim();

  const runVerify = async () => {
    if (!confirm) return;
    await dispatch(
      verifyContribution({ id: confirm.con._id, status: confirm.status }),
    );
    setConfirm(null);
  };

  const exportCampaigns = () =>
    downloadCsv(
      `kokohor-campaigns-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        [
          "Title",
          "Family",
          "Status",
          "Raised",
          "Target",
          "Progress %",
          "Created",
        ],
        ...list.map((c) => [
          c.title,
          c.family?.familyName || "Independent",
          c.status,
          c.totalRaised,
          c.targetAmount,
          Math.round(progressOf(c)),
          c.createdAt ? new Date(c.createdAt).toISOString() : "",
        ]),
      ],
    );

  const exportContribs = () =>
    downloadCsv(
      `kokohor-contributions-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        ["Contributor", "Amount", "Status", "Has proof"],
        ...shownContribs.map((c) => [
          nameOf(c),
          c.amountSent,
          c.verificationStatus,
          c.paymentProof?.url ? "yes" : "no",
        ]),
      ],
    );

  if (loading && campaigns.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F5F7] font-sans">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-amber-500" />
          <p className="text-xs font-semibold text-slate-500">
            Loading financial data…
          </p>
        </div>
      </div>
    );
  }

  const rangeLabel = range === "all" ? "all time" : `the last ${range} days`;
  const selProgress = selected ? Math.min(progressOf(selected), 100) : 0;

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] text-slate-950 antialiased selection:bg-amber-400 selection:text-slate-950">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {typeof window !== "undefined" &&
        createPortal(
          <>
            {/* Campaign drawer */}
            <AnimatePresence>
              {selected && (
                <>
                  <motion.div
                    key="bg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelected(null)}
                    className="fixed inset-0 z-[150] bg-slate-900/30 backdrop-blur-[2px]"
                  />
                  <motion.aside
                    key="drawer"
                    role="dialog"
                    aria-label="Campaign details"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "tween", duration: 0.25 }}
                    className="fixed right-0 top-0 z-[160] flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl"
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                          {selected.family?.familyName || "Independent"}
                        </p>
                        <h3 className="truncate text-base font-extrabold">
                          {selected.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelected(null)}
                        aria-label="Close"
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="flex-1 space-y-6 overflow-y-auto p-6">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Raised
                            </p>
                            <p className="text-2xl font-extrabold tabular-nums">
                              {naira(selected.totalRaised)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Goal
                            </p>
                            <p className="text-sm font-bold tabular-nums text-slate-600">
                              {naira(selected.targetAmount)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${selProgress}%` }}
                            className="h-full rounded-full bg-amber-500"
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                          <span>
                            {Math.round(progressOf(selected))}% funded
                          </span>
                          <span>
                            {selected.createdAt
                              ? `Created ${timeAgo(createdAt(selected))}`
                              : ""}
                          </span>
                        </div>
                        <div className="mt-3">
                          <StatusPill
                            active={
                              String(selected.status).toLowerCase() === "active"
                            }
                            text={selected.status}
                          />
                        </div>
                      </div>

                      {loading ? (
                        <div className="flex flex-col items-center py-16">
                          <Loader2 className="mb-3 h-8 w-8 animate-spin text-amber-500" />
                          <p className="text-xs font-semibold text-slate-500">
                            Loading contributions…
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <MiniStat
                              label="Contributions"
                              value={cs.total}
                              sub={naira(cs.totalAmount)}
                            />
                            <MiniStat
                              label="Pending"
                              value={cs.pending}
                              sub={naira(cs.pendingAmount)}
                              tone="amber"
                            />
                            <MiniStat
                              label="Verified"
                              value={cs.verified}
                              sub={naira(cs.verifiedAmount)}
                              tone="emerald"
                            />
                            <MiniStat
                              label="Rejected"
                              value={cs.rejected}
                              tone="rose"
                            />
                          </div>

                          <div>
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                              <div
                                role="tablist"
                                aria-label="Filter contributions"
                                className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1"
                              >
                                {(
                                  [
                                    "all",
                                    "PENDING",
                                    "VERIFIED",
                                    "REJECTED",
                                  ] as CFilter[]
                                ).map((f) => (
                                  <button
                                    key={f}
                                    role="tab"
                                    aria-selected={cFilter === f}
                                    onClick={() => setCFilter(f)}
                                    className={`rounded-lg px-3 py-1.5 text-[11px] font-bold capitalize transition ${cFilter === f ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"}`}
                                  >
                                    {f === "all" ? "All" : f.toLowerCase()}
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={exportContribs}
                                disabled={!shownContribs.length}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                              >
                                <Download size={13} /> Export
                              </button>
                            </div>

                            {shownContribs.length === 0 ? (
                              <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center">
                                <CreditCard
                                  size={32}
                                  className="mx-auto mb-2 text-slate-300"
                                />
                                <p className="text-xs font-bold text-slate-700">
                                  {contributions.length
                                    ? "None match this filter"
                                    : "No contributions yet"}
                                </p>
                              </div>
                            ) : (
                              <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
                                {shownContribs.map((con) => {
                                  const isPending =
                                    con.verificationStatus === "PENDING";
                                  const isVerified =
                                    con.verificationStatus === "VERIFIED";
                                  return (
                                    <li
                                      key={con._id}
                                      className="flex flex-wrap items-center gap-3 px-4 py-3.5"
                                    >
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-bold text-slate-900">
                                          {nameOf(con)}
                                        </p>
                                        <p className="text-sm font-extrabold tabular-nums text-slate-700">
                                          {naira(Number(con.amountSent))}
                                        </p>
                                      </div>
                                      {con.paymentProof?.url ? (
                                        <button
                                          onClick={() =>
                                            setProofModal(con.paymentProof.url)
                                          }
                                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50"
                                        >
                                          <Eye size={13} /> Proof
                                        </button>
                                      ) : (
                                        <span className="text-[11px] font-semibold text-slate-400">
                                          No proof
                                        </span>
                                      )}
                                      {isPending ? (
                                        <div className="flex gap-1.5">
                                          <button
                                            disabled={actionLoading}
                                            onClick={() =>
                                              setConfirm({
                                                con,
                                                status: "VERIFIED",
                                              })
                                            }
                                            title="Verify"
                                            aria-label="Verify"
                                            className="rounded-lg border border-emerald-200 bg-emerald-50 p-1.5 text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                                          >
                                            <CheckCircle size={16} />
                                          </button>
                                          <button
                                            disabled={actionLoading}
                                            onClick={() =>
                                              setConfirm({
                                                con,
                                                status: "REJECTED",
                                              })
                                            }
                                            title="Reject"
                                            aria-label="Reject"
                                            className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                                          >
                                            <XCircle size={16} />
                                          </button>
                                        </div>
                                      ) : (
                                        <StatusPill
                                          active={isVerified}
                                          text={con.verificationStatus}
                                        />
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* Verify / reject confirm */}
            <AnimatePresence>
              {confirm && (
                <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setConfirm(null)}
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
                      className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border ${confirm.status === "VERIFIED" ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-rose-200 bg-rose-50 text-rose-500"}`}
                    >
                      {confirm.status === "VERIFIED" ? (
                        <CheckCircle size={26} />
                      ) : (
                        <AlertTriangle size={26} />
                      )}
                    </div>
                    <h3 className="text-lg font-extrabold text-black">
                      {confirm.status === "VERIFIED"
                        ? "Verify payment?"
                        : "Reject payment?"}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {confirm.status === "VERIFIED"
                        ? "Confirm that you received"
                        : "Mark as rejected"}{" "}
                      <span className="font-bold text-slate-900">
                        {naira(Number(confirm.con.amountSent))}
                      </span>{" "}
                      from{" "}
                      <span className="font-bold text-slate-900">
                        {nameOf(confirm.con)}
                      </span>
                      .
                    </p>
                    <div className="mt-6 flex flex-col gap-2.5">
                      <button
                        onClick={runVerify}
                        disabled={actionLoading}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition disabled:opacity-60 ${confirm.status === "VERIFIED" ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-rose-500 text-white hover:bg-rose-600"}`}
                      >
                        {actionLoading ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : confirm.status === "VERIFIED" ? (
                          "Yes, verify"
                        ) : (
                          "Yes, reject"
                        )}
                      </button>
                      <button
                        onClick={() => setConfirm(null)}
                        className="w-full rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Proof viewer */}
            <AnimatePresence>
              {proofModal && (
                <div className="fixed inset-0 z-[230] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setProofModal(null)}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-extrabold">Payment proof</h4>
                      <button
                        onClick={() => setProofModal(null)}
                        aria-label="Close"
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="flex max-h-[75vh] items-center justify-center overflow-auto rounded-xl bg-slate-50">
                      <img
                        src={proofModal}
                        alt="Payment proof"
                        className="max-h-[70vh] w-auto rounded-xl object-contain"
                      />
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
                  Financials
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block">
                  Campaign funding and the contribution audit trail
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(fetchAllCampaigns())}
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
                onClick={exportCampaigns}
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
          {/* Range selector */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold tracking-tight">
                Overview
              </h2>
              <p className="text-xs font-medium text-slate-500">
                Campaigns created in {rangeLabel}
                {s.hasPrev ? ", compared with the period before" : ""}
              </p>
            </div>
            <div
              role="tablist"
              aria-label="Time range"
              className="inline-flex rounded-xl border border-slate-200 bg-white p-1"
            >
              {([7, 30, 90, "all"] as Range[]).map((r) => (
                <button
                  key={String(r)}
                  role="tab"
                  aria-selected={range === r}
                  onClick={() => setRange(r)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${range === r ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {r === "all" ? "All time" : `${r}d`}
                </button>
              ))}
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Kpi
              icon={Wallet}
              tone="amber"
              label="Total raised"
              value={naira(s.raised)}
              footer={
                s.hasPrev ? (
                  <DeltaBadge
                    d={delta(s.raised, s.prevRaised)}
                   
                    label="vs previous"
                  />
                ) : (
                  <span className="text-[11px] font-semibold text-slate-500">
                    Across all campaigns
                  </span>
                )
              }
            />
            <Kpi
              icon={Target}
              tone="blue"
              label="Target amount"
              value={naira(s.target)}
              footer={
                <span className="text-[11px] font-semibold text-slate-500">
                  Combined goal of these campaigns
                </span>
              }
            />
            <Kpi
              icon={Percent}
              tone="emerald"
              label="Funding rate"
              value={`${s.rate}%`}
              footer={
                <span className="text-[11px] font-semibold text-slate-500">
                  {naira(Math.max(s.target - s.raised, 0))} still to raise
                </span>
              }
            />
            <Kpi
              icon={Megaphone}
              tone="violet"
              label="Campaigns"
              value={s.cur.length}
              footer={
                s.hasPrev ? (
                  <DeltaBadge
                    d={delta(s.cur.length, s.prev.length)}
                    label="vs previous"
                  />
                ) : (
                  <span className="text-[11px] font-semibold text-slate-500">
                    All fundraisers
                  </span>
                )
              }
            />
            <Kpi
              icon={Coins}
              tone="rose"
              label="Avg per campaign"
              value={naira(s.avg)}
              footer={
                s.hasPrev ? (
                  <DeltaBadge
                    d={delta(Math.round(s.avg), Math.round(s.prevAvg))}
                   
                    label="vs previous"
                  />
                ) : (
                  <span className="text-[11px] font-semibold text-slate-500">
                    Mean amount raised
                  </span>
                )
              }
            />
          </div>

          {/* Raised over time + status */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card
              className="xl:col-span-2"
              title="Amount raised over time"
              subtitle={`Raised by campaigns created each ${range === "all" ? "month" : range === 90 ? "week" : "day"}`}
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={s.series}
                    margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#F1F5F9"
                    />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      minTickGap={20}
                      dy={6}
                      tick={{ fontSize: 11, fontWeight: 600, fill: "#64748B" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={compact}
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: "#F8FAFC" }}
                    />
                    <Bar
                      dataKey="raised"
                      name="₦ raised"
                      fill={AMBER}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card
              title="Campaign status"
              subtitle="Share of campaigns by status"
            >
              {s.statuses.length === 0 ? (
                <p className="py-10 text-center text-xs font-medium text-slate-400">
                  No campaigns in this range.
                </p>
              ) : (
                <>
                  <div className="relative mx-auto h-40 w-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip content={<ChartTooltip />} />
                        <Pie
                          data={s.statuses}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={48}
                          outerRadius={70}
                          paddingAngle={3}
                          stroke="none"
                        >
                          {s.statuses.map((x) => (
                            <Cell key={x.name} fill={x.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-extrabold tabular-nums">
                        {s.cur.length}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Total
                      </span>
                    </div>
                  </div>
                  <ul className="mt-4 max-h-32 space-y-2 overflow-y-auto pr-1">
                    {s.statuses.map((x) => (
                      <li
                        key={x.name}
                        className="flex items-center gap-3 text-xs font-bold"
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ background: x.color }}
                        />
                        <span className="flex-1 truncate capitalize text-slate-600">
                          {x.name}
                        </span>
                        <span className="tabular-nums text-slate-400">
                          {x.value}
                        </span>
                        <span className="w-12 text-right tabular-nums">
                          {pct(x.value, s.cur.length)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Card>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card title="Top campaigns" subtitle="Highest amount raised">
              {s.top.length === 0 ? (
                <p className="py-8 text-center text-xs font-medium text-slate-400">
                  No data for this range.
                </p>
              ) : (
                <ul className="space-y-4">
                  {s.top.map((c, i) => {
                    const max = Math.max(s.top[0].totalRaised, 1);
                    return (
                      <li key={c._id}>
                        <button
                          onClick={() => openCampaign(c)}
                          className="w-full text-left"
                        >
                          <div className="mb-1.5 flex items-center justify-between gap-2 text-xs font-bold">
                            <span className="flex min-w-0 items-center gap-2 text-slate-700">
                              {i === 0 && (
                                <Crown
                                  size={13}
                                  className="shrink-0 text-amber-500"
                                />
                              )}
                              <span className="truncate">{c.title}</span>
                            </span>
                            <span className="shrink-0 tabular-nums text-amber-600">
                              {naira(c.totalRaised)}
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.max((c.totalRaised / max) * 100, 3)}%`,
                              }}
                              transition={{ duration: 0.6 }}
                              className="h-full rounded-full bg-amber-400"
                            />
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            <Card
              title="Funding progress"
              subtitle="Campaigns grouped by how funded they are"
            >
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={s.funding}
                    margin={{ top: 4, right: 4, left: -26, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 600, fill: "#64748B" }}
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
                    <Bar dataKey="count" name="campaigns" radius={[6, 6, 0, 0]}>
                      {s.funding.map((f, i) => (
                        <Cell
                          key={f.label}
                          fill={i === s.funding.length - 1 ? "#10B981" : AMBER}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Raised by family" subtitle="Top five families">
              {s.families.length === 0 ? (
                <p className="py-8 text-center text-xs font-medium text-slate-400">
                  No data for this range.
                </p>
              ) : (
                <ul className="-my-2 divide-y divide-slate-100">
                  {s.families.map((f, i) => (
                    <li key={f.name} className="flex items-center gap-3 py-2.5">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${i === 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-bold text-slate-900">
                          {f.name}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          {f.count} {f.count === 1 ? "campaign" : "campaigns"}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs font-extrabold tabular-nums text-slate-700">
                        {naira(f.raised)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* Campaign directory */}
          <section aria-label="Campaigns" className="space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-extrabold tracking-tight">
                  All campaigns
                </h2>
                <p className="text-xs font-medium text-slate-500">
                  Open a campaign to review and verify its contributions
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
                  />
                  <input
                    type="text"
                    aria-label="Search campaigns"
                    placeholder="Search title or family…"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 sm:w-64"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  aria-label="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-bold capitalize text-slate-700 outline-none focus:border-amber-400 focus:bg-white"
                >
                  <option value="all">All statuses</option>
                  {allStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Sort campaigns"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-amber-400 focus:bg-white"
                >
                  <option value="newest">Newest first</option>
                  <option value="raised">Most raised</option>
                  <option value="progress">Most funded</option>
                  <option value="target">Largest goal</option>
                </select>
              </div>
            </div>

            {list.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <Megaphone className="mx-auto mb-3 text-slate-300" size={36} />
                <p className="text-sm font-bold">No campaigns found</p>
                <p className="mt-1 text-xs text-slate-500">
                  Try a different search or filter.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 pl-6 pr-4">Campaign</th>
                        <th className="min-w-[180px] px-4 py-3.5">Progress</th>
                        <th className="hidden px-4 py-3.5 text-right md:table-cell">
                          Raised
                        </th>
                        <th className="hidden px-4 py-3.5 text-right lg:table-cell">
                          Goal
                        </th>
                        <th className="px-4 py-3.5 text-center">Status</th>
                        <th className="hidden py-3.5 pl-4 pr-6 sm:table-cell">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {pageRows.map((c) => {
                        const p = progressOf(c);
                        return (
                          <tr
                            key={c._id}
                            onClick={() => openCampaign(c)}
                            className="cursor-pointer transition-colors hover:bg-slate-50/70"
                          >
                            <td className="py-3.5 pl-6 pr-4">
                              <p className="max-w-[240px] truncate font-bold text-slate-900">
                                {c.title}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {c.family?.familyName || "Independent"}
                              </p>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className={`h-full rounded-full ${p >= 100 ? "bg-emerald-500" : "bg-amber-400"}`}
                                  style={{ width: `${Math.min(p, 100)}%` }}
                                />
                              </div>
                              <p className="mt-1 text-[11px] font-bold tabular-nums text-slate-500">
                                {Math.round(p)}%
                              </p>
                            </td>
                            <td className="hidden px-4 py-3.5 text-right font-bold tabular-nums text-slate-900 md:table-cell">
                              {naira(c.totalRaised)}
                            </td>
                            <td className="hidden px-4 py-3.5 text-right tabular-nums text-slate-500 lg:table-cell">
                              {naira(c.targetAmount)}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <StatusPill
                                active={
                                  String(c.status).toLowerCase() === "active"
                                }
                                text={c.status}
                              />
                            </td>
                            <td className="hidden py-3.5 pl-4 pr-6 text-slate-500 sm:table-cell">
                              {c.createdAt ? timeAgo(createdAt(c)) : "N/A"}
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

const MiniStat = ({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: number;
  sub?: string;
  tone?: "amber" | "emerald" | "rose";
}) => {
  const color =
    tone === "amber"
      ? "text-amber-600"
      : tone === "emerald"
        ? "text-emerald-600"
        : tone === "rose"
          ? "text-rose-600"
          : "text-slate-900";
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className={`mt-1 text-xl font-extrabold tabular-nums ${color}`}>
        {value}
      </p>
      {sub && (
        <p className="mt-0.5 truncate text-[11px] font-semibold tabular-nums text-slate-500">
          {sub}
        </p>
      )}
    </div>
  );
};

export default FinancialManagement;
