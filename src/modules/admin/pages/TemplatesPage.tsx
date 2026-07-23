"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Template, TemplateType } from "../types";
import {
  getTemplates,
  deleteTemplate,
  toggleTemplateStatus,
  duplicateTemplate,
  previewTemplate,
} from "../services/template.service";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Preview Modal State
  const [previewItem, setPreviewItem] = useState<Template | null>(null);
  const [renderedSubject, setRenderedSubject] = useState("");
  const [renderedContent, setRenderedContent] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, [activeTab]);

  async function loadTemplates() {
    setLoading(true);
    setError(null);
    try {
      const typeFilter = activeTab === "ALL" ? undefined : activeTab;
      const data = await getTemplates(typeFilter);
      setTemplates(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load templates";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(id: string, currentStatus: boolean) {
    try {
      await toggleTemplateStatus(id, !currentStatus);
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: !currentStatus } : t))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  async function handleDuplicate(id: string) {
    try {
      await duplicateTemplate(id);
      loadTemplates();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to duplicate template");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Are you sure you want to delete template "${name}"?`)) {
      return;
    }
    try {
      await deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete template");
    }
  }

  async function handleOpenPreview(tpl: Template) {
    setPreviewItem(tpl);
    setPreviewLoading(true);
    try {
      const res = await previewTemplate({
        content: tpl.content,
        subject: tpl.subject,
      });
      setRenderedSubject(res.renderedSubject || "");
      setRenderedContent(res.renderedContent || "");
    } catch {
      setRenderedSubject(tpl.subject || "");
      setRenderedContent(tpl.content);
    } finally {
      setPreviewLoading(false);
    }
  }

  const safeTemplates = Array.isArray(templates) ? templates : [];
  const filteredTemplates = safeTemplates.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q) ||
      (t.subject && t.subject.toLowerCase().includes(q)) ||
      (t.eventType && t.eventType.toLowerCase().includes(q))
    );
  });

  const getTypeBadgeClass = (type: TemplateType) => {
    switch (type) {
      case "EMAIL":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "WHATSAPP":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "SMS":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "NOTIFICATION":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getTypeIcon = (type: TemplateType) => {
    switch (type) {
      case "EMAIL":
        return "✉️ Email";
      case "WHATSAPP":
        return "💬 WhatsApp";
      case "SMS":
        return "📱 SMS";
      case "NOTIFICATION":
        return "🔔 Push";
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Communication Templates
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage automated Email, WhatsApp, SMS, and Push notification templates with dynamic variables.
          </p>
        </div>

        <Link
          href="/admin/templates/create"
          className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer shadow-lg shadow-gold-solid/10 self-start sm:self-auto flex items-center gap-2 no-underline"
        >
          <span>+ Create Template</span>
        </Link>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#1e1e2e] pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: "All Templates", value: "ALL" },
            { label: "📧 Email", value: "EMAIL" },
            { label: "💬 WhatsApp", value: "WHATSAPP" },
            { label: "📱 SMS", value: "SMS" },
            { label: "🔔 Push", value: "NOTIFICATION" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap border ${activeTab === tab.value
                  ? "bg-gold-solid/15 border-gold-solid/40 text-gold-solid"
                  : "bg-[#13131a] border-[#1e1e2e] text-slate-400 hover:text-slate-200"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#13131a] border border-[#1e1e2e] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-gold-solid/50 transition-colors"
          />
          <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-gold-solid/20 border-t-gold-solid rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-mono">Loading communication templates...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Grid List */}
      {!loading && !error && filteredTemplates.length === 0 && (
        <div className="py-16 text-center border border-dashed border-[#1e1e2e] rounded-2xl p-8 space-y-3">
          <span className="text-3xl">📨</span>
          <h3 className="text-base font-bold text-slate-200">No Templates Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Get started by creating your first Email, WhatsApp, or SMS template to automate buyer communication.
          </p>
          <Link
            href="/admin/templates/create"
            className="inline-block px-4 py-2 bg-gold-solid text-[#020520] text-xs font-bold rounded-xl no-underline mt-2"
          >
            Create New Template
          </Link>
        </div>
      )}

      {!loading && !error && filteredTemplates.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-[#13131a] border border-[#1e1e2e] hover:border-gold-solid/30 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all duration-300 shadow-xl relative group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${getTypeBadgeClass(tpl.type)}`}>
                    {getTypeIcon(tpl.type)}
                  </span>

                  {/* Status Toggle Switch */}
                  {(() => {
                    const isActive = Boolean(tpl.status === true || tpl.status === "ACTIVE");
                    return (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-[10px] font-mono text-slate-400">
                          {isActive ? "Active" : "Inactive"}
                        </span>
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => handleToggleStatus(tpl.id, isActive)}
                          className="sr-only"
                        />
                        <div className={`w-8 h-4 rounded-full transition-colors relative ${isActive ? "bg-emerald-500" : "bg-slate-700"}`}>
                          <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${isActive ? "translate-x-4" : "translate-x-0.5"}`} />
                        </div>
                      </label>
                    );
                  })()}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-gold-solid transition-colors line-clamp-1">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-light">
                    {tpl.description || tpl.content}
                  </p>
                </div>

                {tpl.eventType && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#181824] border border-[#1e1e2e] text-[10px] font-mono text-gold-solid/90">
                    <span>⚡ Trigger:</span>
                    <span>{tpl.eventType}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#1e1e2e] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenPreview(tpl)}
                  className="px-3 py-1.5 bg-[#181824] hover:bg-gold-solid/10 border border-[#1e1e2e] hover:border-gold-solid/30 text-xs font-semibold text-slate-300 hover:text-gold-solid rounded-lg transition-colors cursor-pointer"
                >
                  👁 Preview
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDuplicate(tpl.id)}
                    title="Duplicate Template"
                    className="p-1.5 bg-[#181824] hover:bg-slate-800 border border-[#1e1e2e] text-xs text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    📋
                  </button>
                  <Link
                    href={`/admin/templates/edit/${tpl.id}`}
                    className="px-3 py-1.5 bg-[#181824] hover:bg-indigo-500/10 border border-[#1e1e2e] hover:border-indigo-500/30 text-xs font-semibold text-slate-300 hover:text-indigo-400 rounded-lg transition-colors cursor-pointer no-underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(tpl.id, tpl.name)}
                    className="p-1.5 bg-[#181824] hover:bg-red-500/10 border border-[#1e1e2e] hover:border-red-500/30 text-xs text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Variable Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#13131a] border border-[#1e1e2e] rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <header className="px-6 py-4 border-b border-[#1e1e2e] flex items-center justify-between bg-[#181824]/50">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getTypeBadgeClass(previewItem.type)}`}>
                  {getTypeIcon(previewItem.type)}
                </span>
                <h3 className="text-base font-bold text-slate-100">
                  {previewItem.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </header>

            <div className="p-6 space-y-4">
              {previewLoading ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Rendering template placeholders with mock sample payload...
                </div>
              ) : (
                <>
                  {renderedSubject && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Subject Line:</span>
                      <div className="p-3 rounded-xl bg-[#0b0b0f] border border-[#1e1e2e] text-xs font-bold text-gold-solid">
                        {renderedSubject}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Rendered Live Output:</span>
                    <div className="p-4 rounded-xl bg-[#0b0b0f] border border-[#1e1e2e] text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed min-h-[160px]">
                      {renderedContent}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#181824] border border-[#1e1e2e] flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">Sample variables used:</span>
                    <span className="text-emerald-400 font-mono">
                      name, project_name, project_location, sales_person
                    </span>
                  </div>
                </>
              )}
            </div>

            <footer className="px-6 py-4 border-t border-[#1e1e2e] flex items-center justify-end bg-[#181824]/50">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
