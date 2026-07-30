"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Form, FormType } from "@/modules/admin/types/form.types";
import {
  getForms,
  updateForm,
  duplicateForm,
  deleteForm,
} from "@/modules/admin/services/form.service";

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadForms();
  }, [search, selectedType]);

  async function loadForms() {
    try {
      setLoading(true);
      setError(null);
      const data = await getForms(
        search || undefined,
        (selectedType as FormType) || undefined
      );
      setForms(data);
    } catch (err: any) {
      setError(err.message || "Failed to load forms");
    } finally {
      setLoading(false);
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await updateForm(id, { isActive: !currentActive });
      setSuccessMessage("Form status updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      loadForms();
    } catch (err: any) {
      alert(err.message || "Failed to update form status");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateForm(id);
      setSuccessMessage("Form duplicated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      loadForms();
    } catch (err: any) {
      alert(err.message || "Failed to duplicate form");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete form '${name}'?`)) return;
    try {
      await deleteForm(id);
      setSuccessMessage("Form deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      loadForms();
    } catch (err: any) {
      alert(err.message || "Failed to delete form");
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Dynamic Form Builder
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build and manage custom web forms with dynamic field definitions and submission handlers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/inbox"
            className="px-4 py-2.5 bg-[#13131a] hover:bg-[#1c1c27] text-slate-300 border border-[#1e1e2e] rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
          >
            📥 CRM Inbox
          </Link>
          <Link
            href="/admin/forms/create"
            className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-550 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-650/15 flex items-center gap-2"
          >
            + Create New Form
          </Link>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-sm text-emerald-400 animate-in fade-in duration-350 flex items-center gap-2">
          <span>✓</span> {successMessage}
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full relative">
          <input
            type="text"
            placeholder="Search forms by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 text-xs outline-none transition-colors"
          />
        </div>

        <div className="w-full md:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full md:w-auto bg-[#0b0b0f] border border-[#1e1e2e] text-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-indigo-500"
          >
            <option value="">All Form Types</option>
            <option value="CONTACT">CONTACT</option>
            <option value="LEAD_INQUIRY">LEAD INQUIRY</option>
            <option value="SITE_VISIT">SITE VISIT</option>
            <option value="FEEDBACK">FEEDBACK</option>
            <option value="CUSTOM">CUSTOM</option>
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-mono">Loading dynamic forms...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center space-y-2">
          <span className="text-2xl">⚠️</span>
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : forms.length === 0 ? (
        <div className="text-center py-16 bg-[#13131a] border border-[#1e1e2e] rounded-2xl space-y-3 p-8">
          <span className="text-3xl opacity-40">📋</span>
          <h3 className="text-sm font-bold text-slate-200">No Forms Created Yet</h3>
          <p className="text-xs text-slate-500">
            Build your first web form to start capturing dynamic leads and inquiries.
          </p>
          <Link
            href="/admin/forms/create"
            className="inline-block px-4 py-2 bg-indigo-650 text-white rounded-xl text-xs font-semibold mt-2"
          >
            + Create New Form
          </Link>
        </div>
      ) : (
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0b0b0f] border-b border-[#1e1e2e] text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="p-4">Form Name & API Slug</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Fields</th>
                  <th className="p-4">Submissions</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2e]">
                {forms.map((f) => (
                  <tr key={f.id} className="hover:bg-[#171721] transition-colors group">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <Link
                          href={`/admin/forms/edit/${f.id}`}
                          className="font-bold text-slate-200 hover:text-indigo-400 text-sm transition-colors"
                        >
                          {f.name}
                        </Link>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {f.slug}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {f.type}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="text-slate-300 font-mono font-semibold">
                        {f.fields?.length || 0} Fields
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="text-slate-300 font-mono font-semibold">
                        {f._count?.submissions || 0} Submissions
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(f.id, f.isActive)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider cursor-pointer border transition-all ${f.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-slate-800 text-slate-500 border-slate-700"
                          }`}
                      >
                        {f.isActive ? "ACTIVE" : "INACTIVE"}
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDuplicate(f.id)}
                          title="Duplicate Form"
                          className="p-1.5 bg-[#0b0b0f] hover:bg-[#1a1a26] text-slate-400 hover:text-indigo-400 rounded-lg border border-[#1e1e2e] transition-colors cursor-pointer"
                        >
                          📋
                        </button>
                        <Link
                          href={`/admin/forms/edit/${f.id}`}
                          title="Edit Form"
                          className="p-1.5 bg-[#0b0b0f] hover:bg-[#1a1a26] text-slate-400 hover:text-indigo-400 rounded-lg border border-[#1e1e2e] transition-colors cursor-pointer"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(f.id, f.name)}
                          title="Delete Form"
                          className="p-1.5 bg-[#0b0b0f] hover:bg-[#1a1a26] text-slate-400 hover:text-red-400 rounded-lg border border-[#1e1e2e] transition-colors cursor-pointer"
                        >
                          🗑️
                        </button>
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
