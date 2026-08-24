"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { adminLogin } from "../services/auth.service";

export default function LoginForm() {
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
      const response = await adminLogin({ username, password });
      
      // Store token & permissions
      localStorage.setItem("admin_token", response.accessToken);
      localStorage.setItem("admin_permissions", JSON.stringify(response.admin?.permissions || {}));
      
      setLoading(false);
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Invalid credentials. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-[420px] mx-auto px-6 py-8 sm:px-10 sm:py-10 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] font-sans">

      {/* Brand */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="relative w-[48px] h-[48px] sm:w-[54px] sm:h-[54px] overflow-hidden flex items-center justify-center shrink-0">
          <Image
            src="/logo.png"
            alt="Bhagyashree Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-wide font-serif">
            Bhagyashree
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold bg-[#070e2b]/10 text-[#070e2b] px-2 py-0.5 rounded-md border border-[#070e2b]/20 uppercase tracking-widest">
            CMS
          </span>
        </div>
      </div>

      {/* Headings */}
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1 font-serif">
        Welcome Back
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 font-normal">
        Sign in to your admin panel to manage website content.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* Username */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="admin-username" className="text-xs font-semibold text-slate-700 tracking-wide">
            Username
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-sm text-slate-400 pointer-events-none">👤</span>
            <input
              id="admin-username"
              type="text"
              autoComplete="username"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-gold-solid rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="admin-password" className="text-xs font-semibold text-slate-700 tracking-wide">
            Password
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-sm text-slate-400 pointer-events-none">🔒</span>
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-gold-solid rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 text-sm text-slate-400 hover:text-slate-700 transition-colors duration-150 p-1 cursor-pointer bg-transparent border-none"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-600"
          >
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          id="login-submit-btn"
          type="submit"
          disabled={loading}
          className="mt-2 w-full py-3.5 rounded-xl border-none cursor-pointer text-xs font-bold uppercase tracking-widest text-[#070e2b] bg-gold-solid hover:bg-gold-hover shadow-lg shadow-gold-solid/20 transition-all flex items-center justify-center min-h-[46px] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-block w-[18px] h-[18px] border-2 border-[#070e2b]/30 border-t-[#070e2b] rounded-full animate-spin" />
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </div>
  );
}