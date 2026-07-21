"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardData } from "../services/dashboard.service";
import { getPopupStats, PopupStats } from "../services/popup.service";
import { DashboardResponse } from "../types";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [popupStats, setPopupStats] = useState<PopupStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchDashboard(showLoading = false) {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const [res, popRes] = await Promise.all([
        getDashboardData(),
        getPopupStats().catch((err) => {
          console.error("Failed to load popup stats:", err);
          return null;
        }),
      ]);
      setData(res);
      setPopupStats(popRes);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Something went wrong while fetching dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    Promise.all([
      getDashboardData(),
      getPopupStats().catch((err) => {
        console.error("Failed to load popup stats:", err);
        return null;
      }),
    ]).then(
      ([res, popRes]) => {
        if (active) {
          setData(res);
          setPopupStats(popRes);
          setLoading(false);
        }
      },
      (err) => {
        if (active) {
          setError(err.message || "Something went wrong while fetching dashboard data.");
          setLoading(false);
        }
      }
    );
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Shimmer */}
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-800 rounded-lg"></div>
          <div className="h-4 w-72 bg-slate-800/60 rounded-md"></div>
        </div>

        {/* Stats Shimmer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-slate-800 rounded"></div>
                <div className="h-8 w-8 bg-slate-800 rounded-lg"></div>
              </div>
              <div className="h-8 w-16 bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>

        {/* Content Area Shimmer */}
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6 space-y-4">
          <div className="h-6 w-36 bg-slate-800 rounded"></div>
          <div className="h-40 bg-slate-800/40 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-[#13131a] border border-red-500/20 rounded-2xl max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-3xl mb-4">
          ⚠️
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-2">Failed to Load Dashboard</h3>
        <p className="text-slate-400 text-sm max-w-md mb-6">{error}</p>
        <button
          onClick={() => fetchDashboard(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer shadow-lg shadow-indigo-600/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  const projectsStats = data?.projects || { total: 0, active: 0 };
  const propertiesStats = data?.properties || { total: 0, active: 0, recent: [] };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time analytics and status updates for Nandeeka projects and properties.
          </p>
        </div>
        <button
          onClick={() => fetchDashboard(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#13131a] hover:bg-[#1a1a24] text-slate-300 hover:text-slate-100 border border-[#1e1e2e] rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer"
        >
          <span>↻</span> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Projects */}
        <div className="group relative bg-[#13131a] hover:bg-[#151520] border border-[#1e1e2e] hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-indigo-500/5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Projects</span>
            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform duration-200">
              ◈
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100 tracking-tight">{projectsStats.total}</span>
          </div>
        </div>

        {/* Active Projects */}
        <div className="group relative bg-[#13131a] hover:bg-[#151520] border border-[#1e1e2e] hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-emerald-500/5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Projects</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-450 flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform duration-200">
              ●
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100 tracking-tight">{projectsStats.active}</span>
            <span className="text-xs text-emerald-400 font-medium">Active now</span>
          </div>
        </div>

        {/* Total Properties */}
        <div className="group relative bg-[#13131a] hover:bg-[#151520] border border-[#1e1e2e] hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-purple-500/5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Properties</span>
            <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform duration-200">
              ⌂
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100 tracking-tight">{propertiesStats.total}</span>
          </div>
        </div>

        {/* Active Properties */}
        <div className="group relative bg-[#13131a] hover:bg-[#151520] border border-[#1e1e2e] hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-cyan-500/5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Properties</span>
            <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform duration-200">
              ✓
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100 tracking-tight">{propertiesStats.active}</span>
            <span className="text-xs text-cyan-400 font-medium">Listed</span>
          </div>
        </div>
      </div>

      {/* Popup Analytics Cards */}
      {popupStats && (
        <div className="space-y-4">
          <div className="flex justify-between items-center pt-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Popup & Lead Management</h2>
              <p className="text-xs text-slate-400 mt-0.5">Performance statistics for active popup notifications and lead capture.</p>
            </div>
            <Link
              href="/admin/popup"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-150"
            >
              Manage Popups →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-[#13131a] hover:bg-[#151520] border border-[#1e1e2e] hover:border-violet-500/30 rounded-2xl p-6 transition-all duration-300 shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Popups</span>
                <span className="text-violet-400 text-lg">📢</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-slate-100">{popupStats.totalPopups}</span>
              </div>
            </div>

            <div className="group bg-[#13131a] hover:bg-[#151520] border border-[#1e1e2e] hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300 shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Popups</span>
                <span className="text-emerald-400 text-lg">⚡</span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-100">{popupStats.activePopups}</span>
                <span className="text-xs text-emerald-400">Live now</span>
              </div>
            </div>

            <div className="group bg-[#13131a] hover:bg-[#151520] border border-[#1e1e2e] hover:border-amber-500/30 rounded-2xl p-6 transition-all duration-300 shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Impressions</span>
                <span className="text-amber-400 text-lg">👁</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-slate-100">{popupStats.totalViews.toLocaleString()}</span>
              </div>
            </div>

            {/* <div className="group bg-[#13131a] hover:bg-[#151520] border border-[#1e1e2e] hover:border-rose-500/30 rounded-2xl p-6 transition-all duration-300 shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Captured Leads</span>
                <span className="text-rose-450 text-lg">👥</span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-100">{popupStats.totalLeads ?? 0}</span>
                <Link href="/admin/leads" className="text-xs text-rose-400 hover:underline">
                  View
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      )}

      {/* Recent Properties Section */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-[#1e1e2e] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Recent Properties</h2>
            <p className="text-xs text-slate-400 mt-0.5">Lately added properties to the catalog.</p>
          </div>
          <Link
            href="/admin/projects"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-150"
          >
            Manage Catalog →
          </Link>
        </div>

        {propertiesStats.recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#1e1e2e] flex items-center justify-center text-slate-400 text-2xl mb-4">
              📭
            </div>
            <h3 className="text-sm font-semibold text-slate-200">No properties found</h3>
            <p className="text-xs text-slate-450 max-w-sm mt-1 mb-6">
              You haven&apos;t added any properties yet. Start by adding a property listing to your projects.
            </p>
            <Link
              href="/admin/projects"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all duration-150 shadow-md shadow-indigo-600/10"
            >
              + Create New Property
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#1e1e2e]">
            {propertiesStats.recent.map((prop) => (
              <div key={prop.id} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-[#151520] transition-colors duration-150">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-200">{prop.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-450">
                    {prop.location && <span>📍 {prop.location}</span>}
                    {prop.createdAt && (
                      <span>⏱ {new Date(prop.createdAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="mt-3 sm:mt-0 flex items-center gap-4">
                  {prop.price !== undefined && (
                    <span className="text-sm font-semibold text-slate-300">₹{prop.price.toLocaleString()}</span>
                  )}
                  {prop.status && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${
                      prop.status.toLowerCase() === "active" || prop.status.toLowerCase() === "published"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {prop.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}