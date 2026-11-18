import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FolderTree,
  CreditCard,
  LogOut,
  ShieldCheck,
  X,
  Search,
  AlertTriangle,
  Terminal,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../redux/slices/adminAuthSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "../landing_page/home/shared";

type NavEntry = { icon: React.ReactNode; label: string; path: string };

const mainNav: NavEntry[] = [
  {
    icon: <LayoutDashboard size={17} />,
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  { icon: <Users size={17} />, label: "User Directory", path: "/admin/users" },
  {
    icon: <FolderTree size={17} />,
    label: "Family Hubs",
    path: "/admin/families",
  },
  {
    icon: <CreditCard size={17} />,
    label: "Financials",
    path: "/admin/finance",
  },
];

const Sidebar: React.FC<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}> = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const location = useLocation();
  const [navSearch, setNavSearch] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const q = navSearch.toLowerCase().trim();
  const main = mainNav.filter((i) => i.label.toLowerCase().includes(q));

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              className="relative w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-7 text-center shadow-2xl text-white"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-white">
                Sign out of Admin Console?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Your session token will be destroyed. You will require a new
                one-time code to authenticate again.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    dispatch(logoutAdmin());
                    navigate("/admin");
                  }}
                  className="w-full rounded-xl bg-amber-400 py-3 text-xs font-bold text-slate-950 transition hover:bg-amber-300"
                >
                  Confirm Sign Out
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-800/60 py-3 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar: w-64 matches the dashboard's lg:ml-64 */}
      <aside
        aria-label="Admin navigation"
        className={`fixed left-0 top-0 z-[70] flex h-full w-64 flex-col border-r border-slate-800/80 bg-slate-900 text-slate-300 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          <button
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu Search */}
        <div className="px-4 pt-4 pb-2">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={14}
            />
            <input
              type="text"
              placeholder="Search menu..."
              aria-label="Search menu"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-9 pr-3 text-xs font-medium text-white placeholder-slate-500 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {main.length > 0 ? (
            <div className="space-y-1">
              <p className="px-3 pb-2 pt-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                Platform Navigation
              </p>
              {main.map((i) => (
                <NavItem
                  key={i.label}
                  icon={i.icon}
                  label={i.label}
                  active={location.pathname === i.path}
                  onClick={() => {
                    navigate(i.path);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="px-3 py-8 text-center text-xs font-medium text-slate-500">
              No menu items match “{navSearch}”.
            </p>
          )}
        </nav>

        {/* System Status / Mode Badge */}
        <div className="px-4 py-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-950/40 px-3 py-2 text-[11px] text-slate-400">
            <Terminal size={13} className="text-amber-400 shrink-0" />
            <span className="truncate font-mono text-[10px]">
              Access Level: SuperAdmin
            </span>
          </div>
        </div>

        {/* Admin Account Card */}
        <div className="border-t border-slate-800/80 p-3">
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <ShieldCheck size={17} />
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-xs font-bold text-white">
                Administrator
              </p>
              <p className="font-mono text-[10px] text-emerald-400">
                ● Active Session
              </p>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              aria-label="Sign out"
              title="Sign out"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const NavItem = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-current={active ? "page" : undefined}
    className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${
      active
        ? "bg-amber-400/10 text-amber-400 shadow-sm"
        : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
    }`}
  >
    {active && (
      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-amber-400" />
    )}
    <span
      className={
        active
          ? "text-amber-400"
          : "text-slate-500 group-hover:text-slate-300 transition-colors"
      }
    >
      {icon}
    </span>
    <span className="flex-1 tracking-wide">{label}</span>
  </button>
);

export default Sidebar;
