"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { superAdminLogin } from "../services/auth.service";

export default function SuperAdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await superAdminLogin({ username, password });
      
      // Store super admin token
      localStorage.setItem("super_admin_token", response.accessToken);
      
      setLoading(false);
      router.push("/super-admin/dashboard");
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Invalid credentials. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-[420px] mx-auto px-5 py-8 sm:px-10 sm:py-12 bg-[#13131a] border border-[#1e1e2e]/60 rounded-2xl shadow-[0_0_0_1px_rgba(139,92,246,0.06),0_24px_64px_rgba(0,0,0,0.5)]">

      {/* Brand */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="relative w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] overflow-hidden flex items-center justify-center shrink-0">
          <Image
            src="/logo.png"
            alt="Nandeeka Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-xl font-bold text-slate-100 tracking-wide">
            Nandeeka
          </span>
          <span className="text-[9px] sm:text-[10px] font-semibold bg-purple-500/20 text-purple-400 px-1.5 sm:px-2 py-0.5 rounded border border-purple-500/30 uppercase tracking-widest">
            SUPER ADMIN
          </span>
        </div>
      </div>

      {/* Headings */}
      <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mb-1 sm:mb-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
        System Control
      </h1>
      <p className="text-xs sm:text-sm text-slate-400 mb-6 sm:mb-8">
        Sign in with your Super Admin account to access configuration
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* Username */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="super-admin-username" className="text-[13px] font-medium text-slate-400 tracking-wide">
            Username
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-sm text-slate-600 pointer-events-none">👤</span>
            <input
              id="super-admin-username"
              type="text"
              autoComplete="username"
              placeholder="superadmin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-200 placeholder-slate-700 outline-none transition-all duration-200 focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="super-admin-password" className="text-[13px] font-medium text-slate-400 tracking-wide">
            Password
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-sm text-slate-600 pointer-events-none">🔒</span>
            <input
              id="super-admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-200 placeholder-slate-700 outline-none transition-all duration-200 focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 text-sm text-slate-600 hover:text-slate-400 transition-colors duration-150 p-1 cursor-pointer bg-transparent border-none"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 px-3.5 py-2.5 bg-red-500/10 border border-red-500/25 rounded-lg text-[13px] text-red-400"
          >
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          id="super-login-submit-btn"
          type="submit"
          disabled={loading}
          className="mt-1.5 w-full py-3 rounded-xl border-none cursor-pointer text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_4px_20px_rgba(139,92,246,0.3)] transition-all duration-200 flex items-center justify-center min-h-[46px] hover:opacity-90 hover:-translate-y-px hover:shadow-[0_8px_28px_rgba(139,92,246,0.4)] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-block w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Authenticate Control"
          )}
        </button>
      </form>
    </div>
  );
}
