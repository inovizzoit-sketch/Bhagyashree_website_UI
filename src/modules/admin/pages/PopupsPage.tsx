"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPopups, deletePopup, createPopup, getPopupById, PopupItem } from "../services/popup.service";
import Modal from "@/shared/components/Modal";

export default function PopupsPage() {
  const [popups, setPopups] = useState<PopupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [detailsPopup, setDetailsPopup] = useState<PopupItem | null>(null);

  async function fetchPopups() {
    try {
      setLoading(true);
      setError(null);
      const res = await getPopups({ page, limit: 10, search });
      setPopups(res.items);
      setTotalPages(res.meta.totalPages);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load popups.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPopups();
  }, [page, search]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this popup?")) return;
    try {
      setActionLoading(id);
      await deletePopup(id);
      fetchPopups();
    } catch (err: any) {
      alert(err.message || "Failed to delete popup");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDuplicate(id: string) {
    try {
      setActionLoading(id);
      const popup = await getPopupById(id);
      
      const formData = new FormData();
      formData.append("title", `${popup.title} - Copy`);
      formData.append("slug", `${popup.slug}-copy-${Math.floor(Math.random() * 1000)}`);
      formData.append("popupType", popup.popupType);
      if (popup.heading) formData.append("heading", popup.heading);
      if (popup.subHeading) formData.append("subHeading", popup.subHeading);
      if (popup.description) formData.append("description", popup.description);
      if (popup.image) formData.append("image", popup.image);
      if (popup.videoUrl) formData.append("videoUrl", popup.videoUrl);
      if (popup.buttonText) formData.append("buttonText", popup.buttonText);
      if (popup.buttonLink) formData.append("buttonLink", popup.buttonLink);
      if (popup.htmlContent) formData.append("htmlContent", popup.htmlContent);
      formData.append("triggerType", popup.triggerType);
      formData.append("showAfterSeconds", String(popup.showAfterSeconds));
      formData.append("frequency", popup.frequency);
      formData.append("priority", String(popup.priority));
      formData.append("deviceType", popup.deviceType);
      formData.append("targetType", popup.targetType);
      if (popup.targetPages && popup.targetPages.length) {
        formData.append("targetPages", JSON.stringify(popup.targetPages));
      }
      if (popup.startDate) formData.append("startDate", popup.startDate);
      if (popup.endDate) formData.append("endDate", popup.endDate);
      formData.append("isActive", "false"); // duplicated popups start as draft/inactive

      await createPopup(formData);
      fetchPopups();
    } catch (err: any) {
      alert(err.message || "Failed to duplicate popup");
    } finally {
      setActionLoading(null);
    }
  }

  function calculateCTR(clicks: number, impressions: number): string {
    if (!impressions) return "0.0%";
    return `${((clicks / impressions) * 100).toFixed(1)}%`;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Popup Campaigns
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build, schedule, and track engagement rate for marketing popups.
          </p>
        </div>
        
        <Link
          href="/admin/popup/create"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer shadow-md no-underline border-none"
        >
          ➕ New Popup Campaign
        </Link>
      </div>

      {/* Search Filter */}
      <div className="flex items-center bg-[#13131a] border border-[#1e1e2e] rounded-xl px-4 py-3">
        <span className="text-slate-400 mr-2">🔍</span>
        <input
          type="text"
          placeholder="Search by title, slug, or heading..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 w-full text-sm"
        />
      </div>

      {/* Error block */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Table grid */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-gold-solid border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-455 mt-4">Loading campaigns...</p>
          </div>
        ) : popups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-3xl mb-4">📢</div>
            <h3 className="text-sm font-semibold text-slate-200">No popups configured</h3>
            <p className="text-xs text-slate-450 mt-1">
              Start by launching your first popup notification campaign.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1e1e2e] bg-[#171721] text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Title / Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Trigger</th>
                  <th className="px-6 py-4 text-center">Views</th>
                  <th className="px-6 py-4 text-center">Clicks</th>
                  <th className="px-6 py-4 text-center">CTR</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2e] text-sm text-slate-300">
                {popups.map((popup) => (
                  <tr key={popup.id} className="hover:bg-[#151520] transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-200">{popup.title}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{popup.popupType}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        popup.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-800 text-slate-500 border border-slate-700"
                      }`}>
                        {popup.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono">{popup.triggerType}</td>
                    <td className="px-6 py-4 text-center font-mono text-xs">{popup.impressions}</td>
                    <td className="px-6 py-4 text-center font-mono text-xs">{popup.clicks}</td>
                    <td className="px-6 py-4 text-center font-semibold text-xs text-gold-solid">
                      {calculateCTR(popup.clicks, popup.impressions)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setDetailsPopup(popup)}
                        className="px-2.5 py-1 bg-gold-solid/10 hover:bg-gold-solid/20 text-gold-solid rounded text-xs border-none cursor-pointer"
                      >
                        👁 Details
                      </button>
                      <button
                        onClick={() => handleDuplicate(popup.id)}
                        disabled={actionLoading !== null}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-650 text-slate-300 rounded text-xs border-none cursor-pointer"
                      >
                        📋 Duplicate
                      </button>
                      <Link
                        href={`/admin/popup/edit/${popup.id}`}
                        className="no-underline px-2.5 py-1 bg-gold-solid/10 hover:bg-gold-solid/20 text-gold-solid rounded text-xs border-none cursor-pointer"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(popup.id)}
                        disabled={actionLoading !== null}
                        className="px-2.5 py-1 bg-red-650/15 hover:bg-red-650/30 text-red-400 rounded text-xs border-none cursor-pointer"
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#1e1e2e] flex items-center justify-between">
            <span className="text-xs text-slate-450">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 bg-[#171721] hover:bg-[#20202e] disabled:bg-[#13131a] border border-[#1e1e2e] rounded text-xs font-medium text-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed cursor-pointer"
              >
                Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1.5 bg-[#171721] hover:bg-[#20202e] disabled:bg-[#13131a] border border-[#1e1e2e] rounded text-xs font-medium text-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Immersive Details Modal */}
      <Modal
        isOpen={Boolean(detailsPopup)}
        onClose={() => setDetailsPopup(null)}
        maxWidth="max-w-4xl"
        title={
          detailsPopup ? (
            <div className="flex items-center gap-3">
              <span>{detailsPopup.title}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                detailsPopup.isActive
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-slate-800 border-slate-700 text-slate-500"
              }`}>
                {detailsPopup.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          ) : (
            "Campaign Details"
          )
        }
        footer={
          detailsPopup ? (
            <div className="flex items-center justify-between w-full">
              <Link
                href={`/admin/popup/edit/${detailsPopup.id}`}
                className="px-4 py-2 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-xs font-bold no-underline transition-colors"
              >
                ✏️ Edit Campaign
              </Link>
              <button
                type="button"
                onClick={() => setDetailsPopup(null)}
                className="px-4 py-2 bg-[#181824] hover:bg-[#1e1e2e] border border-[#1e1e2e] text-slate-350 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : null
        }
      >
        {detailsPopup && (
          <div className="space-y-6 text-slate-300">
            {/* Content Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Left Column: Properties & Telemetry */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-gold-solid uppercase tracking-wider">Campaign Overview</h4>
                <div className="bg-[#171721] border border-[#1e1e2e] rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Popup Type:</span> <span className="font-mono text-slate-200">{detailsPopup.popupType}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Priority Level:</span> <span className="font-mono text-slate-200">{detailsPopup.priority}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Trigger Type:</span> <span className="font-mono text-slate-200">{detailsPopup.triggerType}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Delay (Seconds):</span> <span className="font-mono text-slate-200">{detailsPopup.showAfterSeconds}s</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Frequency:</span> <span className="font-mono text-slate-200">{detailsPopup.frequency}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Device Target:</span> <span className="font-mono text-slate-200">{detailsPopup.deviceType}</span></div>
                </div>

                <h4 className="text-xs font-semibold text-gold-solid uppercase tracking-wider">Telemetry & Engagement</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#171721] border border-[#1e1e2e] rounded-xl p-3 text-center">
                    <span className="text-[10px] text-slate-400 uppercase block">Views</span>
                    <span className="text-base font-bold text-slate-100">{detailsPopup.impressions}</span>
                  </div>
                  <div className="bg-[#171721] border border-[#1e1e2e] rounded-xl p-3 text-center">
                    <span className="text-[10px] text-slate-400 uppercase block">Clicks</span>
                    <span className="text-base font-bold text-gold-solid">{detailsPopup.clicks}</span>
                  </div>
                  <div className="bg-[#171721] border border-[#1e1e2e] rounded-xl p-3 text-center">
                    <span className="text-[10px] text-slate-400 uppercase block">CTR Rate</span>
                    <span className="text-base font-bold text-emerald-400">{calculateCTR(detailsPopup.clicks, detailsPopup.impressions)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Targeting & Schedule */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-gold-solid uppercase tracking-wider">Page Targeting Rules</h4>
                <div className="bg-[#171721] border border-[#1e1e2e] rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Target Type:</span> <span className="font-mono text-slate-200">{detailsPopup.targetType}</span></div>
                  {detailsPopup.targetType === "SPECIFIC_PAGES" && (
                    <div className="pt-2">
                      <span className="text-slate-400 block mb-1">Configured Target URLs/Paths:</span>
                      {detailsPopup.targetPages && detailsPopup.targetPages.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {detailsPopup.targetPages.map((path, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-gold-solid/15 text-gold-solid rounded text-[11px] font-mono border border-gold-solid/20">
                              {path}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">No specific paths configured</span>
                      )}
                    </div>
                  )}
                </div>

                <h4 className="text-xs font-semibold text-gold-solid uppercase tracking-wider">Active Date Schedule</h4>
                <div className="bg-[#171721] border border-[#1e1e2e] rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Start Date:</span> <span className="font-mono text-slate-200">{detailsPopup.startDate ? new Date(detailsPopup.startDate).toLocaleDateString() : "Immediate (No start date)"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">End Date:</span> <span className="font-mono text-slate-200">{detailsPopup.endDate ? new Date(detailsPopup.endDate).toLocaleDateString() : "Permanent (No end date)"}</span></div>
                </div>
              </div>
            </div>

            {/* Visual Copywriting Preview Section */}
            <div className="space-y-3 pt-2 border-t border-[#1e1e2e]">
              <h4 className="text-xs font-semibold text-gold-solid uppercase tracking-wider">Visual & Content Preview</h4>
              <div className="bg-[#171721] border border-[#1e1e2e] rounded-xl p-4 space-y-3">
                {detailsPopup.heading && <h3 className="text-lg font-semibold text-slate-100">{detailsPopup.heading}</h3>}
                {detailsPopup.subHeading && <h4 className="text-xs font-medium text-amber-400">{detailsPopup.subHeading}</h4>}
                {detailsPopup.description && <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{detailsPopup.description}</p>}
                
                {detailsPopup.image && (
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 block mb-1">Banner Image:</span>
                    <img src={detailsPopup.image} alt={detailsPopup.title} className="h-36 w-auto object-cover rounded-lg border border-[#1e1e2e]" />
                  </div>
                )}

                {detailsPopup.buttonText && (
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-xs text-slate-400">CTA Action:</span>
                    <a href={detailsPopup.buttonLink || "#"} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded text-xs font-bold no-underline">
                      {detailsPopup.buttonText} ↗
                    </a>
                  </div>
                )}

                {detailsPopup.htmlContent && (
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 block mb-1">Custom HTML Content:</span>
                    <pre className="p-3 bg-[#13131a] rounded text-[11px] font-mono text-gold-solid overflow-x-auto border border-[#1e1e2e] max-h-32">
                      {detailsPopup.htmlContent}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
