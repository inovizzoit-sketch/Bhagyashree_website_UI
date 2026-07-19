"use client";

import React, { useEffect, useState } from "react";
import { Announcement } from "../types";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../services/announcement.service";
import { API_BASE_URL } from "@/shared/lib/api-config";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Control
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load announcements";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingId(null);
    setTitle("");
    setContent("");
    setLink("");
    setIsActive(true);
    setStartDate("");
    setEndDate("");
    setImageUrl("");
    setMediaFile(null);
    setValidationErrors([]);
    setModalOpen(true);
  }

  function handleOpenEdit(ann: Announcement) {
    setEditingId(ann.id);
    setTitle(ann.title);
    setContent(ann.content);
    setLink(ann.link || "");
    setIsActive(ann.isActive);
    setStartDate(ann.startDate ? new Date(ann.startDate).toISOString().slice(0, 16) : "");
    setEndDate(ann.endDate ? new Date(ann.endDate).toISOString().slice(0, 16) : "");
    setImageUrl(ann.imageUrl || "");
    setMediaFile(null);
    setValidationErrors([]);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setValidationErrors([]);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("link", link);
    formData.append("isActive", String(isActive));
    if (startDate) formData.append("startDate", new Date(startDate).toISOString());
    if (endDate) formData.append("endDate", new Date(endDate).toISOString());

    if (mediaFile) {
      formData.append("image", mediaFile); // Note: backend interceptor uses field name 'image'
    }

    try {
      if (editingId) {
        await updateAnnouncement(editingId, formData);
      } else {
        await createAnnouncement(formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save announcement";
      setValidationErrors([msg]);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Are you sure you want to delete the announcement "${name}"?`)) {
      return;
    }
    try {
      await deleteAnnouncement(id);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete announcement";
      alert(msg);
    }
  }

  const isVideo = (url?: string) => {
    if (!url) return false;
    const cleanUrl = url.split("?")[0].split("#")[0].toLowerCase();
    return (
      cleanUrl.endsWith(".mp4") ||
      cleanUrl.endsWith(".webm") ||
      cleanUrl.endsWith(".ogg") ||
      cleanUrl.endsWith(".mov")
    );
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Announcements
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage promotional highlights, updates, and site popups.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer active:scale-[0.98] shadow-lg shadow-indigo-500/10 self-start sm:self-auto"
        >
          + Add Announcement
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Loading Announcements...
          </p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="border border-[#1e1e2e] bg-[#13131a] rounded-2xl p-12 text-center space-y-4">
          <span className="text-4xl block">📢</span>
          <h3 className="text-lg font-bold text-slate-200">No Announcements Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            No announcements exist yet. Click the button above to add your first update.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden border border-[#1e1e2e] bg-[#13131a] rounded-2xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#1e1e2e] bg-[#181824] text-slate-400 font-semibold tracking-wider text-xs uppercase">
                  <th className="px-6 py-4">Preview</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Timeline</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2e] text-slate-300">
                {announcements.map((ann) => (
                  <tr key={ann.id} className="hover:bg-[#181824]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden border border-[#1e1e2e] bg-[#181824] flex items-center justify-center shrink-0">
                        {ann.imageUrl ? (
                          isVideo(ann.imageUrl) ? (
                            <video src={ann.imageUrl} className="w-full h-full object-cover" muted />
                          ) : (
                            <img src={ann.imageUrl} alt={ann.title} className="w-full h-full object-cover" />
                          )
                        ) : (
                          <span className="text-slate-600 text-xs">No media</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200">{ann.title}</div>
                      <div className="text-xs text-slate-400 max-w-xs truncate">{ann.content}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          ann.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {ann.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {ann.startDate || ann.endDate ? (
                        <>
                          <div>Start: {ann.startDate ? new Date(ann.startDate).toLocaleDateString() : "Immediate"}</div>
                          <div>End: {ann.endDate ? new Date(ann.endDate).toLocaleDateString() : "Forever"}</div>
                        </>
                      ) : (
                        <span>Always Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(ann)}
                        className="px-3 py-1.5 bg-[#181824] hover:bg-indigo-500/10 border border-[#1e1e2e] hover:border-indigo-500/30 text-xs font-bold text-slate-300 hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ann.id, ann.title)}
                        className="px-3 py-1.5 bg-[#181824] hover:bg-red-500/10 border border-[#1e1e2e] hover:border-red-500/30 text-xs font-bold text-slate-300 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* modal create/edit popup */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#13131a] border border-[#1e1e2e] rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <header className="px-6 py-5 border-b border-[#1e1e2e] flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100">
                {editingId ? "Modify Announcement" : "Add Announcement"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 outline-none text-xl"
              >
                ✕
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {validationErrors.length > 0 && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs space-y-1">
                  {validationErrors.map((err, i) => (
                    <div key={i}>• {err}</div>
                  ))}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Announcement Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phase 2 Booking Open"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-indigo-500 rounded-xl text-slate-200 text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Announcement Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Details of the announcement..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-indigo-500 rounded-xl text-slate-200 text-sm outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    External Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-indigo-500 rounded-xl text-slate-200 text-sm outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </label>
                  <select
                    value={String(isActive)}
                    onChange={(e) => setIsActive(e.target.value === "true")}
                    className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-indigo-500 rounded-xl text-slate-200 text-sm outline-none transition-colors cursor-pointer"
                  >
                    <option value="true">Active (Show Popup)</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Start Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-indigo-500 rounded-xl text-slate-200 text-sm outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    End Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-indigo-500 rounded-xl text-slate-200 text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Media Attachment (Image or Video)
                </label>
                {imageUrl && !mediaFile && (
                  <div className="mb-2 relative w-20 h-16 rounded-lg overflow-hidden border border-[#1e1e2e] bg-[#181824] flex items-center justify-center">
                    {isVideo(imageUrl) ? (
                      <video src={imageUrl} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={imageUrl} alt="Announcement Preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setMediaFile(file);
                  }}
                  className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-indigo-500 rounded-xl text-slate-200 text-sm outline-none transition-colors cursor-pointer"
                />
              </div>

              <footer className="pt-4 border-t border-[#1e1e2e] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-[#181824] hover:bg-[#1e1e2e] border border-[#1e1e2e] text-slate-300 rounded-xl text-xs font-bold tracking-wide transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold tracking-wide transition-colors cursor-pointer active:scale-[0.98] shadow-lg shadow-indigo-500/10"
                >
                  {submitting ? "Saving..." : "Save Announcement"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
