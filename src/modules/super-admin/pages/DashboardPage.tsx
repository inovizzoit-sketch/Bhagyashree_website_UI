"use client";

import { useEffect, useState } from "react";
import { getSuperAdminDashboardStats, SuperAdminStats } from "../services/dashboard.service";

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getSuperAdminDashboardStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400">
        <p className="font-semibold">Error Loading Metrics</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  const { overview } = stats!;

  const statCards = [
    {
      title: "Total Admin Accounts",
      value: overview.totalAdmins,
      icon: "👤",
      color: "from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30",
    },
    {
      title: "Real Estate Projects",
      value: overview.totalProjects,
      icon: "🏢",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      title: "Properties Listed",
      value: overview.totalProperties,
      icon: "🏠",
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
    },
    {
      title: "Blog Posts Published",
      value: overview.totalBlogs,
      icon: "📝",
      color: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          Super Admin Console
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          System-wide overview statistics and parameters control.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl bg-gradient-to-br ${card.color} border shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-center justify-between transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.title}
              </p>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-100">
                {card.value}
              </p>
            </div>
            <span className="text-3xl sm:text-4xl filter saturate-75">{card.icon}</span>
          </div>
        ))}
      </div>

      {/* <div className="p-6 rounded-2xl bg-[#13131a] border border-[#1e1e2e] space-y-4">
        <h2 className="text-lg font-semibold text-slate-200">System Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-[#0f0f14] border border-[#1e1e2e]/50 flex justify-between">
            <span className="text-slate-400">Node Environment</span>
            <span className="font-mono text-emerald-400 font-semibold">Production</span>
          </div>
          <div className="p-4 rounded-xl bg-[#0f0f14] border border-[#1e1e2e]/50 flex justify-between">
            <span className="text-slate-400">Database Engine</span>
            <span className="font-mono text-indigo-400 font-semibold">PostgreSQL</span>
          </div>
        </div>
      </div> */}
    </div>
  );
}
