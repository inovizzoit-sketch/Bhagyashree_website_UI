"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TemplateLog } from "@/modules/admin/types";
import { getTemplateLogs } from "@/modules/admin/services/template.service";

export default function TemplateLogsPage() {
  const [logs, setLogs] = useState<TemplateLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      setLoading(true);
      setError(null);
      const res = await getTemplateLogs(1, 50);
      setLogs(res.logs);
    } catch (err: any) {
      setError(err.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Template Execution & Audit Logs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time delivery & simulation log history for communication messages.
          </p>
        </div>

        <Link
          href="/admin/templates"
          className="px-4 py-2.5 bg-[#13131a] hover:bg-[#1c1c27] text-slate-300 border border-[#1e1e2e] rounded-xl text-xs font-semibold transition-all self-start"
        >
          ← Back to Templates
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-mono">Loading delivery logs...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center space-y-2">
          <span className="text-2xl">⚠️</span>
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 bg-[#13131a] border border-[#1e1e2e] rounded-2xl space-y-3 p-8">
          <span className="text-3xl opacity-40">📜</span>
          <h3 className="text-sm font-bold text-slate-200">No Execution Logs Recorded</h3>
          <p className="text-xs text-slate-500">
            Logs will record here automatically when event automation or test simulations trigger messages.
          </p>
        </div>
      ) : (
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0b0b0f] border-b border-[#1e1e2e] text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Template Name</th>
                  <th className="p-4">Recipient</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payload Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2e]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#171721] transition-colors">
                    <td className="p-4 text-slate-400 font-mono text-[11px]">
                      {new Date(log.sentAt).toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-slate-200">
                      {log.template?.name || "Manual Test / Dynamic"}
                    </td>
                    <td className="p-4 text-indigo-300 font-mono">
                      {log.recipient}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4 max-w-md">
                      <div className="p-2 bg-[#0b0b0f] border border-[#1e1e2e] rounded-lg text-slate-400 font-mono text-[10px] truncate max-h-16 overflow-y-auto">
                        {log.payload}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
