"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "@/shared/components/Modal";
import {
  getThemes,
  createTheme,
  deleteTheme,
  duplicateTheme,
  publishTheme,
  archiveTheme,
  exportTheme,
  importTheme,
} from "../services/theme.service";
import { Theme, ThemeStatus } from "../types";

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination State
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // View mode
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createSlug, setCreateSlug] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createNotes, setCreateNotes] = useState("");
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Import Modal State
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [importSubmitting, setImportSubmitting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Delete/Archive/Publish Confirmation States
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState("");
  const [actionSubmitting, setActionSubmitting] = useState(false);

  useEffect(() => {
    loadThemes();
  }, [page, status, sortBy, sortOrder]);

  async function loadThemes() {
    setLoading(true);
    setError(null);
    try {
      const data = await getThemes({
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
        sortBy,
        sortOrder,
      });
      setThemes(data.items);
      setTotalPages(data.meta.totalPages);
      setTotalItems(data.meta.total);
    } catch (err: any) {
      setError(err.message || "Failed to load themes");
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadThemes();
  }

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!createName.trim()) {
      setCreateError("Theme Name is required");
      return;
    }
    setCreateSubmitting(true);
    setCreateError(null);
    try {
      const newTheme = await createTheme({
        name: createName,
        slug: createSlug.trim() || undefined,
        description: createDescription || undefined,
        notes: createNotes || undefined,
      });
      setIsCreateOpen(false);
      setCreateName("");
      setCreateSlug("");
      setCreateDescription("");
      setCreateNotes("");
      loadThemes();
    } catch (err: any) {
      setCreateError(err.message || "Failed to create theme");
    } finally {
      setCreateSubmitting(false);
    }
  }

  async function handleImportSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!importJson.trim()) {
      setImportError("Please provide theme JSON content");
      return;
    }
    setImportSubmitting(true);
    setImportError(null);
    try {
      const parsed = JSON.parse(importJson);
      await importTheme(parsed);
      setIsImportOpen(false);
      setImportJson("");
      loadThemes();
    } catch (err: any) {
      setImportError(err.message || "Invalid JSON or backend import failed");
    } finally {
      setImportSubmitting(false);
    }
  }

  async function handleDuplicate(id: string) {
    if (!window.confirm("Are you sure you want to duplicate this theme?")) return;
    try {
      await duplicateTheme(id);
      loadThemes();
    } catch (err: any) {
      alert(err.message || "Failed to duplicate theme");
    }
  }

  async function handlePublish(id: string) {
    if (!window.confirm("Publishing this theme will make it the active theme. Continue?")) return;
    try {
      await publishTheme(id);
      loadThemes();
    } catch (err: any) {
      alert(err.message || "Failed to publish theme");
    }
  }

  async function handleArchive(id: string) {
    if (!window.confirm("Are you sure you want to archive this theme?")) return;
    try {
      await archiveTheme(id);
      loadThemes();
    } catch (err: any) {
      alert(err.message || "Failed to archive theme");
    }
  }

  async function handleDelete() {
    if (!confirmDeleteId) return;
    setActionSubmitting(true);
    try {
      await deleteTheme(confirmDeleteId);
      setConfirmDeleteId(null);
      setConfirmDeleteName("");
      loadThemes();
    } catch (err: any) {
      alert(err.message || "Failed to delete theme");
    } finally {
      setActionSubmitting(false);
    }
  }

  async function handleExport(theme: Theme) {
    try {
      const data = await exportTheme(theme.id);
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `${theme.slug || "theme"}-config.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err: any) {
      alert(err.message || "Failed to export theme");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Theme Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            Create, customize, and publish themes to control website styles and layouts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <button
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-700 hover:border-slate-600 rounded-lg text-sm font-medium text-slate-200 transition-colors bg-[#13131a]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import JSON
          </button> */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Theme
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex w-full md:w-auto items-center gap-2">
          <input
            type="text"
            placeholder="Search themes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-200 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field);
              setSortOrder(order as "asc" | "desc");
              setPage(1);
            }}
            className="bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>

          <div className="border border-[#1e1e2e] rounded-lg p-0.5 flex bg-[#0f0f14]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-indigo-500/20 text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}
              title="Grid View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-indigo-500/20 text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}
              title="List View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center">
          {error}
        </div>
      ) : themes.length === 0 ? (
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-12 text-center">
          <p className="text-slate-400">No themes found. Click "Create Theme" to get started.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div key={theme.id} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between">
              {/* Color Stripes Preview (similar to designer color palette cards) */}
              <div className="h-44 w-full flex flex-col shrink-0">
                <div className="h-[40%] w-full transition-all hover:opacity-90" style={{ backgroundColor: theme.colors?.primary || "#3f51b5" }} title={`Primary: ${theme.colors?.primary}`} />
                <div className="h-[25%] w-full transition-all hover:opacity-90" style={{ backgroundColor: theme.colors?.secondary || "#303f9f" }} title={`Secondary: ${theme.colors?.secondary}`} />
                <div className="h-[20%] w-full transition-all hover:opacity-90" style={{ backgroundColor: theme.colors?.accent || "#ff4081" }} title={`Accent: ${theme.colors?.accent}`} />
                <div className="h-[15%] w-full transition-all hover:opacity-90" style={{ backgroundColor: theme.colors?.background || "#ffffff" }} title={`Background: ${theme.colors?.background}`} />
              </div>

              {/* Theme Info Area */}
              <div className="p-4 bg-[#161622] flex flex-col gap-1.5 border-t border-[#1e1e2e]/50">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5 truncate" title={theme.name}>
                    {theme.name}
                  </h3>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {theme.isDefault && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 font-semibold">
                        Active
                      </span>
                    )}
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                      theme.status === "ACTIVE"
                        ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        : theme.status === "ARCHIVED"
                        ? "bg-slate-800 text-slate-500 border border-slate-700"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}>
                      {theme.status}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">Slug: {theme.slug} | v{theme.version}</p>
              </div>

              <div className="border-t border-[#1e1e2e] bg-[#161622] px-5 py-3.5 flex justify-between items-center gap-2">
                <Link
                  href={`/admin/themes/edit/${theme.id}`}
                  className="px-3.5 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/25 text-indigo-400 rounded-lg text-xs font-semibold no-underline transition-colors"
                >
                  Edit Theme
                </Link>
                <div className="flex items-center gap-1">
                  {theme.status !== "ACTIVE" && (
                    <button
                      onClick={() => handlePublish(theme.id)}
                      className="p-1.5 hover:bg-emerald-500/15 text-slate-400 hover:text-emerald-400 rounded transition-colors"
                      title="Publish Theme"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleDuplicate(theme.id)}
                    className="p-1.5 hover:bg-slate-500/10 text-slate-400 hover:text-slate-200 rounded transition-colors"
                    title="Duplicate Theme"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleExport(theme)}
                    className="p-1.5 hover:bg-slate-500/10 text-slate-400 hover:text-slate-200 rounded transition-colors"
                    title="Export JSON"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  {theme.status !== "ARCHIVED" && theme.status !== "ACTIVE" && (
                    <button
                      onClick={() => handleArchive(theme.id)}
                      className="p-1.5 hover:bg-amber-500/15 text-slate-400 hover:text-amber-400 rounded transition-colors"
                      title="Archive Theme"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </button>
                  )}
                  {theme.status !== "ACTIVE" && (
                    <button
                      onClick={() => {
                        setConfirmDeleteId(theme.id);
                        setConfirmDeleteName(theme.name);
                      }}
                      className="p-1.5 hover:bg-red-500/15 text-slate-400 hover:text-red-400 rounded transition-colors"
                      title="Delete Theme"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#1e1e2e] text-slate-400 text-xs font-semibold uppercase tracking-wider bg-[#161622]">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Slug</th>
                <th className="py-4 px-6">Version</th>
                <th className="py-4 px-6">Created By</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2e]">
              {themes.map((theme) => (
                <tr key={theme.id} className="hover:bg-[#161622]/50 text-slate-300">
                  <td className="py-4 px-6 font-bold text-slate-100 flex items-center gap-2">
                    {theme.name}
                    {theme.isDefault && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      theme.status === "ACTIVE"
                        ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        : theme.status === "ARCHIVED"
                        ? "bg-slate-800 text-slate-500 border border-slate-700"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}>
                      {theme.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400">{theme.slug}</td>
                  <td className="py-4 px-6">v{theme.version}</td>
                  <td className="py-4 px-6 text-slate-400">{theme.createdBy || "System"}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/themes/edit/${theme.id}`}
                        className="p-1.5 hover:bg-indigo-500/15 text-slate-400 hover:text-indigo-400 rounded transition-colors"
                        title="Edit Theme"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                      {theme.status !== "ACTIVE" && (
                        <button
                          onClick={() => handlePublish(theme.id)}
                          className="p-1.5 hover:bg-emerald-500/15 text-slate-400 hover:text-emerald-400 rounded transition-colors"
                          title="Publish Theme"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDuplicate(theme.id)}
                        className="p-1.5 hover:bg-slate-500/10 text-slate-400 hover:text-slate-200 rounded transition-colors"
                        title="Duplicate Theme"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleExport(theme)}
                        className="p-1.5 hover:bg-slate-500/10 text-slate-400 hover:text-slate-200 rounded transition-colors"
                        title="Export JSON"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      {theme.status !== "ARCHIVED" && theme.status !== "ACTIVE" && (
                        <button
                          onClick={() => handleArchive(theme.id)}
                          className="p-1.5 hover:bg-amber-500/15 text-slate-400 hover:text-amber-400 rounded transition-colors"
                          title="Archive Theme"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                        </button>
                      )}
                      {theme.status !== "ACTIVE" && (
                        <button
                          onClick={() => {
                            setConfirmDeleteId(theme.id);
                            setConfirmDeleteName(theme.name);
                          }}
                          className="p-1.5 hover:bg-red-500/15 text-slate-400 hover:text-red-400 rounded transition-colors"
                          title="Delete Theme"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4">
          <p className="text-xs text-slate-500">
            Showing page {page} of {totalPages} ({totalItems} total themes)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create Theme Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Theme">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {createError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
              {createError}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Theme Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Elegant Gold Theme"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Slug (Optional)</label>
            <input
              type="text"
              placeholder="e.g. elegant-gold"
              value={createSlug}
              onChange={(e) => setCreateSlug(e.target.value)}
              className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Description</label>
            <textarea
              placeholder="Provide a description of the theme styling..."
              value={createDescription}
              onChange={(e) => setCreateDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Notes / Reminders</label>
            <input
              type="text"
              placeholder="e.g. Created for upcoming Diwali campaign"
              value={createNotes}
              onChange={(e) => setCreateNotes(e.target.value)}
              className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {createSubmitting ? "Creating..." : "Create Theme"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Import JSON Modal */}
      <Modal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} title="Import Theme Configuration">
        <form onSubmit={handleImportSubmit} className="space-y-4">
          {importError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
              {importError}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Theme JSON Content</label>
            <textarea
              required
              placeholder="Paste theme JSON object here..."
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              rows={10}
              className="w-full font-mono text-xs bg-[#0f0f14] border border-[#1e1e2e] rounded-lg p-4 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsImportOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={importSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {importSubmitting ? "Importing..." : "Import Theme"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)} title="Delete Theme">
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete the theme <strong className="text-slate-100">"{confirmDeleteName}"</strong>? This action is permanent and cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirmDeleteId(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={actionSubmitting}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {actionSubmitting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
