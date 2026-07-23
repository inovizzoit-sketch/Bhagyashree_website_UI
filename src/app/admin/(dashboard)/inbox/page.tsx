"use client";

import React, { useEffect, useState } from "react";
import {
  Inquiry,
  InquiryStatus,
  InquiryNote,
} from "@/modules/admin/types/form.types";
import {
  getInquiries,
  getInquiryById,
  updateInquiry,
  addInquiryNote,
  deleteInquiry,
  getInquiryStats,
} from "@/modules/admin/services/inquiry.service";

type InboxFolder = "inbox" | "starred" | "assigned" | "spam" | "trash";

const STATUS_COLOR_MAP: Record<InquiryStatus, { bg: string; text: string; border: string }> = {
  NEW: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  IN_PROGRESS: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  CONTACTED: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
  QUALIFIED: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  CLOSED: { bg: "bg-slate-800", text: "text-slate-400", border: "border-slate-700" },
  SPAM: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
};

export default function InboxPage() {
  const [folder, setFolder] = useState<InboxFolder>("inbox");
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loadingList, setLoadingList] = useState(true);

  // Selected Inquiry Detail (Right Panel)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Note Input
  const [newNoteContent, setNewNoteContent] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    loadInboxData();
  }, [folder, search, selectedStatus]);

  useEffect(() => {
    if (selectedId) {
      loadInquiryDetail(selectedId);
    } else {
      setSelectedInquiry(null);
    }
  }, [selectedId]);

  async function loadInboxData() {
    try {
      setLoadingList(true);
      const [inquiriesRes, statsRes] = await Promise.all([
        getInquiries({
          folder,
          search: search || undefined,
          status: (selectedStatus as InquiryStatus) || undefined,
        }),
        getInquiryStats().catch(() => null),
      ]);

      setInquiries(inquiriesRes.items);
      setStats(statsRes);

      // Auto-select first item if available
      if (inquiriesRes.items.length > 0 && !selectedId) {
        setSelectedId(inquiriesRes.items[0].id);
      }
    } catch (err: any) {
      console.error("Failed to load inbox data:", err);
    } finally {
      setLoadingList(false);
    }
  }

  async function loadInquiryDetail(id: string) {
    try {
      setLoadingDetail(true);
      const data = await getInquiryById(id);
      setSelectedInquiry(data);
    } catch (err: any) {
      console.error("Failed to load inquiry detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  }

  const handleToggleStar = async (e: React.MouseEvent, id: string, currentStarred: boolean) => {
    e.stopPropagation();
    try {
      await updateInquiry(id, { isStarred: !currentStarred });
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isStarred: !currentStarred } : item))
      );
      if (selectedInquiry?.id === id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, isStarred: !currentStarred } : null));
      }
    } catch (err: any) {
      alert(err.message || "Failed to star inquiry");
    }
  };

  const handleStatusChange = async (newStatus: InquiryStatus) => {
    if (!selectedInquiry) return;
    try {
      const updated = await updateInquiry(selectedInquiry.id, { status: newStatus });
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      setInquiries((prev) =>
        prev.map((item) => (item.id === selectedInquiry.id ? { ...item, status: newStatus } : item))
      );
    } catch (err: any) {
      alert(err.message || "Failed to change status");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !newNoteContent.trim()) return;

    try {
      setAddingNote(true);
      const createdNote = await addInquiryNote(selectedInquiry.id, newNoteContent);
      setSelectedInquiry((prev) =>
        prev ? { ...prev, notes: [createdNote, ...(prev.notes || [])] } : null
      );
      setNewNoteContent("");
    } catch (err: any) {
      alert(err.message || "Failed to add note");
    } finally {
      setAddingNote(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedInquiry || !confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await deleteInquiry(selectedInquiry.id);
      setSelectedId(null);
      setSelectedInquiry(null);
      loadInboxData();
    } catch (err: any) {
      alert(err.message || "Failed to delete inquiry");
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col font-sans space-y-4">
      {/* Top Header & Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Enterprise CRM Inbox & Inquiries
          </h1>
          <p className="text-xs text-slate-400">
            Real-time management for dynamic form submissions, lead routing, and customer inquiries.
          </p>
        </div>

        {stats && (
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl px-3.5 py-1.5 flex items-center gap-2">
              <span className="text-slate-500 font-mono">Total:</span>
              <span className="font-bold text-slate-200">{stats.totalInquiries}</span>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-3.5 py-1.5 flex items-center gap-2">
              <span className="text-blue-400 font-mono font-semibold">New Today:</span>
              <span className="font-bold text-blue-300">{stats.newToday}</span>
            </div>
          </div>
        )}
      </div>

      {/* 3-Column Enterprise CRM Layout */}
      <div className="flex-1 bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden grid grid-cols-12 shadow-2xl">
        {/* COLUMN 1: Left Folders Sidebar (2 cols) */}
        <div className="col-span-12 md:col-span-2 bg-[#0b0b0f] border-r border-[#1e1e2e] p-4 flex flex-col justify-between">
          <div className="space-y-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
              Folders
            </span>

            <nav className="space-y-1">
              {[
                { id: "inbox", label: "Inbox", icon: "📥", count: stats?.unreadCount },
                // { id: "starred", label: "Starred", icon: "⭐", count: stats?.starredCount },
                // { id: "assigned", label: "Assigned", icon: "👤" },
                // { id: "spam", label: "Spam", icon: "🚫", count: stats?.spamCount },
                // { id: "trash", label: "Trash / Archive", icon: "🗑️" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFolder(f.id as InboxFolder);
                    setSelectedId(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${folder === f.id
                      ? "bg-indigo-600/15 border border-indigo-500/30 text-indigo-300"
                      : "text-slate-400 hover:bg-[#13131a] hover:text-slate-200"
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>{f.icon}</span>
                    <span>{f.label}</span>
                  </div>
                  {f.count !== undefined && f.count > 0 && (
                    <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                      {f.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* COLUMN 2: Center Inquiries List (4 cols) */}
        <div className="col-span-12 md:col-span-4 border-r border-[#1e1e2e] flex flex-col bg-[#13131a]">
          {/* Filter Bar */}
          <div className="p-3 border-b border-[#1e1e2e] space-y-2">
            <input
              type="text"
              placeholder="Search by name, email, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
            />
            <div className="flex items-center justify-between gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#0b0b0f] border border-[#1e1e2e] text-slate-400 rounded-lg px-2.5 py-1 text-[11px] outline-none"
              >
                <option value="">All Statuses</option>
                <option value="NEW">NEW</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="QUALIFIED">QUALIFIED</option>
                <option value="CLOSED">CLOSED</option>
                <option value="SPAM">SPAM</option>
              </select>
              <span className="text-[10px] text-slate-500 font-mono">
                {inquiries.length} items
              </span>
            </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#1e1e2e]">
            {loadingList ? (
              <div className="p-12 text-center text-xs text-slate-500 font-mono">
                Loading inquiries...
              </div>
            ) : inquiries.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No inquiries found in folder '{folder}'.
              </div>
            ) : (
              inquiries.map((inq) => {
                const statusStyle = STATUS_COLOR_MAP[inq.status] || STATUS_COLOR_MAP.NEW;
                const isSelected = selectedId === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedId(inq.id)}
                    className={`p-3.5 transition-all cursor-pointer relative group ${isSelected
                        ? "bg-indigo-600/10 border-l-4 border-l-indigo-500"
                        : "hover:bg-[#171721]"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-100 text-xs truncate">
                        {inq.name}
                      </span>
                      <button
                        onClick={(e) => handleToggleStar(e, inq.id, inq.isStarred)}
                        className={`text-xs cursor-pointer ${inq.isStarred ? "text-amber-400" : "text-slate-600 hover:text-slate-400"
                          }`}
                      >
                        ★
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-300 truncate font-medium">
                      {inq.subject || "No Subject"}
                    </p>

                    <div className="flex items-center justify-between mt-2 text-[10px]">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        {inq.status}
                      </span>
                      <span className="text-slate-500 font-mono">
                        {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 3: Right Inquiry Details & Notes Panel (6 cols) */}
        <div className="col-span-12 md:col-span-6 flex flex-col bg-[#0b0b0f]">
          {loadingDetail ? (
            <div className="flex flex-col items-center justify-center h-full text-xs text-slate-500 font-mono">
              Loading inquiry details...
            </div>
          ) : !selectedInquiry ? (
            <div className="flex flex-col items-center justify-center h-full text-xs text-slate-500 space-y-2">
              <span className="text-3xl opacity-30">📩</span>
              <p>Select an inquiry from the center list to view details.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header Bar */}
              <div className="p-4 bg-[#13131a] border-b border-[#1e1e2e] flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{selectedInquiry.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Form: <span className="text-indigo-400">{selectedInquiry.form?.name || "Dynamic Form"}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => handleStatusChange(e.target.value as InquiryStatus)}
                    className="bg-[#0b0b0f] border border-[#1e1e2e] text-slate-200 text-xs rounded-xl px-3 py-1.5 font-bold outline-none focus:border-indigo-500"
                  >
                    <option value="NEW">NEW</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="SPAM">SPAM</option>
                  </select>

                  <button
                    onClick={handleDelete}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 text-xs transition-colors cursor-pointer"
                    title="Delete Inquiry"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {/* Contact Info Bar */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-[#13131a] border border-[#1e1e2e] rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5 font-mono">Email</span>
                    <span className="text-slate-200 font-mono">{selectedInquiry.email || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5 font-mono">Phone</span>
                    <span className="text-slate-200 font-mono">{selectedInquiry.phone || "N/A"}</span>
                  </div>
                </div>

                {/* Submitted Dynamic Form Payload */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono border-b border-[#1e1e2e] pb-2">
                    Submitted Form Payload:
                  </h4>
                  <div className="p-4 bg-[#13131a] border border-[#1e1e2e] rounded-2xl space-y-3 text-xs">
                    {selectedInquiry.payload ? (
                      Object.entries(selectedInquiry.payload).map(([k, v]) => (
                        <div key={k} className="flex flex-col border-b border-[#1e1e2e]/50 pb-2 last:border-0 last:pb-0">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-mono">
                            {k.replace(/_/g, " ")}
                          </span>
                          <span className="text-slate-200 font-sans mt-0.5 whitespace-pre-wrap">
                            {Array.isArray(v) ? v.join(", ") : String(v)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 italic">No custom field payload recorded.</p>
                    )}
                  </div>
                </div>

                {/* Notes & Activity Timeline */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono border-b border-[#1e1e2e] pb-2">
                    Internal Notes & Activity ({selectedInquiry.notes?.length || 0})
                  </h4>

                  {/* Add Note Input */}
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <textarea
                      rows={2}
                      placeholder="Add an internal note or sales update..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="w-full bg-[#13131a] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-200 outline-none resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={addingNote || !newNoteContent.trim()}
                        className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-550 text-white rounded-lg text-xs font-semibold disabled:opacity-50 cursor-pointer"
                      >
                        {addingNote ? "Saving Note..." : "+ Add Note"}
                      </button>
                    </div>
                  </form>

                  {/* Notes Timeline List */}
                  <div className="space-y-3 pt-2">
                    {selectedInquiry.notes?.map((n) => (
                      <div key={n.id} className="p-3 bg-[#13131a] border border-[#1e1e2e] rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span className="font-bold text-indigo-300">{n.author}</span>
                          <span className="font-mono">{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-300 whitespace-pre-wrap font-sans">{n.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
