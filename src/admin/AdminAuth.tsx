import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Loader2,
  AlertCircle,
  Mail,
  Lock,
  Users,
  FolderTree,
  ArrowLeft,
  CheckCircle2,
  Terminal,
  X,
} from "lucide-react";

import {
  sendAdminOtp,
  verifyAdminOtp,
  resetAuthStatus,
} from "../redux/slices/adminAuthSlice";
import type { AppDispatch, RootState } from "../redux/store";

const securitySpecs = [
  {
    icon: Users,
    title: "Hub & Member Oversight",
    desc: "Full visibility into family hubs, roles, and account states.",
  },
  {
    icon: FolderTree,
    title: "Circle Content Auditing",
    desc: "Review flagged activity and compliance logs across circles.",
  },
  {
    icon: Lock,
    title: "Passwordless 2FA Session",
    desc: "Hardware-grade one-time verification with strict IP logging.",
  },
];

const AdminAuth: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, otpSent, error, success, token } = useSelector(
    (state: RootState) => state.admin,
  );

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const cleanEmail = email.toLowerCase().trim();

  // Redirect on success
  useEffect(() => {
    if (success && token && otpSent) {
      navigate("/admin/dashboard");
    }
  }, [success, token, otpSent, navigate]);

  // Surface Redux errors
  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const clearErrors = () => {
    if (localError) setLocalError(null);
    if (error) dispatch(resetAuthStatus());
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!cleanEmail) {
      return setLocalError("Please enter your authorized staff email.");
    }
    dispatch(sendAdminOtp({ email: cleanEmail }));
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (otp.length < 6) {
      return setLocalError("Enter all 6 digits from your verification email.");
    }
    dispatch(verifyAdminOtp({ email: cleanEmail, otp }));
  };

  const handleBackToEmail = () => {
    clearErrors();
    setOtp("");
    dispatch(resetAuthStatus());
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F5F7] text-slate-900 antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* Main Portal Workspace */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 lg:grid-cols-12"
        >
          {/* Left Column: Authentication Form (7 cols) */}
          <div className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-7">
            <div>
              {/* Step Breadcrumb */}
              <div className="mb-8 flex items-center gap-3 text-xs font-semibold">
                <span
                  className={`flex items-center gap-1.5 ${
                    !otpSent ? "text-slate-900" : "text-emerald-600"
                  }`}
                >
                  {otpSent ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[11px] text-white">
                      1
                    </span>
                  )}
                  Identify
                </span>
                <span className="h-[1px] w-6 bg-slate-200" />
                <span
                  className={`flex items-center gap-1.5 ${
                    otpSent ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                      otpSent
                        ? "bg-amber-400 font-bold text-slate-950"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    2
                  </span>
                  Verify Token
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {otpSent ? "Enter security code" : "Sign in to Admin Portal"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {otpSent ? (
                  <>
                    A 6-digit verification code was sent to{" "}
                    <span className="font-semibold text-slate-800">
                      {cleanEmail}
                    </span>
                    .
                  </>
                ) : (
                  "Use your provisioned Kokohor staff email to request an access token."
                )}
              </p>

              {/* Inline Error Alert */}
              <AnimatePresence>
                {localError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      role="alert"
                      className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertCircle
                          size={16}
                          className="mt-0.5 shrink-0 text-red-600"
                        />
                        <span className="font-medium leading-relaxed">
                          {localError}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={clearErrors}
                        className="rounded p-0.5 text-red-500 hover:bg-red-100 hover:text-red-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Switcher */}
              <div className="mt-8">
                <AnimatePresence mode="wait">
                  {!otpSent ? (
                    <motion.form
                      key="step-email"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.18 }}
                      onSubmit={handleSendOtp}
                      className="space-y-5"
                    >
                      <div>
                        <label
                          htmlFor="admin-email"
                          className="mb-1.5 block text-xs font-semibold text-slate-700"
                        >
                          Work Email
                        </label>
                        <div className="relative">
                          <Mail
                            size={17}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <input
                            id="admin-email"
                            type="email"
                            autoComplete="email"
                            placeholder="admin@kokohor.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (localError) clearErrors();
                            }}
                            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loading ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <>
                            <span>Continue with Email</span>
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="step-otp"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                      onSubmit={handleVerifyOtp}
                      className="space-y-5"
                    >
                      <div>
                        <div className="mb-1.5 flex items-center justify-between">
                          <label
                            htmlFor="admin-otp"
                            className="text-xs font-semibold text-slate-700"
                          >
                            6-Digit Verification Code
                          </label>
                          <button
                            type="button"
                            onClick={handleBackToEmail}
                            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
                          >
                            <ArrowLeft size={12} /> Edit email
                          </button>
                        </div>
                        <input
                          id="admin-otp"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          placeholder="000000"
                          value={otp}
                          onChange={(e) => {
                            setOtp(e.target.value.replace(/\D/g, ""));
                            if (localError) clearErrors();
                          }}
                          className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 text-center font-mono text-2xl font-bold tracking-[0.7rem] text-slate-900 placeholder-slate-300 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15"
                          required
                          autoFocus
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loading ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <>
                            <Lock size={16} />
                            <span>Authenticate Session</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                        <span>Code expires in 10 minutes</span>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() =>
                            dispatch(sendAdminOtp({ email: cleanEmail }))
                          }
                          className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 disabled:opacity-50"
                        >
                          Resend code
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Compliance Notice */}
            <div className="mt-10 border-t border-slate-100 pt-5 text-xs text-slate-400">
              Protected by Kokohor Identity Guard. Unauthorized access attempts
              are recorded and audited.
            </div>
          </div>

          {/* Right Column: Portal Info & Security Rail (5 cols) */}
          <aside className="flex flex-col justify-between border-t border-slate-200/80 bg-slate-900 p-7 text-slate-300 sm:p-10 lg:col-span-5 lg:border-l lg:border-t-0">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-slate-700/80 bg-slate-800/80 px-2.5 py-1 font-mono text-[11px] text-amber-400">
                <Terminal size={12} />
                <span>PRIVILEGED ACCESS</span>
              </div>

              <h2 className="mt-5 text-lg font-bold text-white">
                Kokohor Operations & Moderation Suite
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Centralized control plane for user governance, circle audits,
                and platform safety operations.
              </p>

              <div className="mt-8 space-y-5">
                {securitySpecs.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3.5">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-amber-400">
                      <Icon size={15} />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-white">
                        {title}
                      </h3>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminAuth;
