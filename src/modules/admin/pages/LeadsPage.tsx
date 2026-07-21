"use client";

import { useEffect, useState } from "react";
import { getLeads, PopupLeadItem } from "../services/popup.service";

export default function LeadsPage() {
  const [leads, setLeads] = useState<PopupLeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function fetchLeads() {
    try {
      setLoading(true);
      setError(null);
      const res = await getLeads({ page, limit: 10, search });
      setLeads(res.items);
      setTotalPages(res.meta.totalPages);
      setTotalItems(res.meta.total);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load popup leads.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, [page, search]);

  function exportToCSV() {
    if (!leads.length) return;
    const headers = ["ID", "Name", "Email", "Phone", "Message", "Popup", "Date"];
    const rows = leads.map((l) => [
      l.id,
      l.name || "",
      l.email,
      l.phone || "",
      l.message || "",
      l.popup?.title || "N/A",
      new Date(l.createdAt).toLocaleString(),
    ]);
    
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `popup_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Popup Lead Submissions
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            View and manage contact requests submitted through active popups.
          </p>
        </div>
        
        <button
          onClick={exportToCSV}
          disabled={leads.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/40 disabled:text-slate-500 text-white rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer shadow-md disabled:cursor-not-allowed border-none"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Filters/Search */}
      <div className="flex items-center bg-[#13131a] border border-[#1e1e2e] rounded-xl px-4 py-3">
        <span className="text-slate-400 mr-2">🔍</span>
        <input
          type="text"
          placeholder="Search by name, email, phone, or message..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 w-full text-sm"
        />
      </div>

      {/* Error View */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-450 mt-4">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-3xl mb-4">📭</div>
            <h3 className="text-sm font-semibold text-slate-200">No leads found</h3>
            <p className="text-xs text-slate-450 mt-1">
              Either no leads have been submitted, or none match your search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1e1e2e] bg-[#171721] text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Triggered Popup</th>
                  <th className="px-6 py-4">Submitted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2e] text-sm text-slate-300">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#151520] transition-colors duration-150">
                    <td className="px-6 py-4 font-medium text-slate-200">
                      {lead.name || <span className="text-slate-500 italic">No name</span>}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{lead.email}</td>
                    <td className="px-6 py-4">
                      {lead.phone || <span className="text-slate-500 italic">-</span>}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={lead.message || ""}>
                      {lead.message || <span className="text-slate-500 italic">-</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs border border-indigo-500/20 font-medium">
                        {lead.popup?.title || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#1e1e2e] flex items-center justify-between">
            <span className="text-xs text-slate-450">
              Showing page {page} of {totalPages} ({totalItems} total leads)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 bg-[#171721] hover:bg-[#20202e] disabled:bg-[#13131a] border border-[#1e1e2e] rounded text-xs font-medium text-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 bg-[#171721] hover:bg-[#20202e] disabled:bg-[#13131a] border border-[#1e1e2e] rounded text-xs font-medium text-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
