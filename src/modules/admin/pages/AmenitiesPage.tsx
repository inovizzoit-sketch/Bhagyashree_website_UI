"use client";

import React, { useEffect, useState } from "react";
import {
  Amenity,
  getAmenities,
  createAmenity,
  updateAmenity,
  deleteAmenity,
} from "../services/amenity.service";
import {
  AmenityCategory,
  getAmenityCategories,
} from "../services/amenity-category.service";
import { API_BASE_URL } from "@/shared/lib/api-config";

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [categories, setCategories] = useState<AmenityCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Control
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [icon, setIcon] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [amenitiesData, categoriesData] = await Promise.all([
        getAmenities(),
        getAmenityCategories(),
      ]);
      setAmenities(amenitiesData);
      setCategories(categoriesData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load amenities";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingId(null);
    setName("");
    setCategoryId(categories[0]?.id || "");
    setIcon("");
    setIconFile(null);
    setIsActive(true);
    setValidationErrors([]);
    setModalOpen(true);
  }

  function handleOpenEdit(am: Amenity) {
    setEditingId(am.id);
    setName(am.name);
    setCategoryId(am.categoryId || "");
    setIcon(am.icon || "");
    setIconFile(null);
    setIsActive(am.isActive);
    setValidationErrors([]);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setValidationErrors([]);

    const formData = new FormData();
    formData.append("name", name);
    if (categoryId) {
      formData.append("categoryId", categoryId);
    }
    formData.append("isActive", String(isActive));

    if (iconFile) {
      formData.append("icon", iconFile);
    } else if (icon) {
      formData.append("icon", icon);
    }

    try {
      if (editingId) {
        await updateAmenity(editingId, formData);
      } else {
        await createAmenity(formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save amenity";
      setValidationErrors([message]);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, amName: string) {
    if (!window.confirm(`Are you sure you want to delete "${amName}"?`)) {
      return;
    }
    try {
      await deleteAmenity(id);
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete amenity";
      alert(message);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Project Amenities
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure amenities (e.g. Swimming Pool, Kids Play Area) and link them to classifications.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer active:scale-[0.98] shadow-lg shadow-indigo-500/10 self-start sm:self-auto"
        >
          + Add Amenity
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
            Loading Amenities...
          </p>
        </div>
      ) : amenities.length === 0 ? (
        <div className="border border-[#1e1e2e] bg-[#13131a] rounded-2xl p-12 text-center space-y-4">
          <span className="text-4xl block">🏊</span>
          <h3 className="text-lg font-bold text-slate-200">No Amenities Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            You haven&apos;t created any amenities yet. Click the button above to add your first amenity.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden border border-[#1e1e2e] bg-[#13131a] rounded-2xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#1e1e2e] bg-[#181824] text-slate-400 font-semibold tracking-wider text-xs uppercase">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Image/Icon</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2e] text-slate-300">
                {amenities.map((am) => (
                  <tr key={am.id} className="hover:bg-[#181824]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200">{am.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      {am.category ? (
                        <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-xs font-semibold">
                          {am.category.name}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs italic">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {am.icon ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#1e1e2e] bg-[#181824] flex items-center justify-center">
                          <img
                            src={am.icon.startsWith("http") ? am.icon : `${API_BASE_URL.replace("/api/v1", "")}${am.icon}`}
                            alt={am.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs italic">No Image</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          am.isActive
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-slate-500/10 border-slate-500/20 text-slate-400"
                        }`}
                      >
                        {am.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(am)}
                        className="px-3 py-1.5 bg-[#181824] hover:bg-indigo-500/10 border border-[#1e1e2e] hover:border-indigo-500/30 text-xs font-bold text-slate-300 hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(am.id, am.name)}
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
          <div className="relative w-full max-w-md bg-[#13131a] border border-[#1e1e2e] rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <header className="px-6 py-5 border-b border-[#1e1e2e] flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100">
                {editingId ? "Modify Amenity" : "Add Amenity"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 outline-none text-xl"
              >
                ✕
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {validationErrors.length > 0 && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs space-y-1">
                  {validationErrors.map((err, i) => (
                    <div key={i}>• {err}</div>
                  ))}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Amenity Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swimming Pool"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-indigo-500 rounded-xl text-slate-200 text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Category Classification
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-indigo-500 rounded-xl text-slate-200 text-sm outline-none transition-colors cursor-pointer"
                >
                  <option value="" disabled>Select Category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

               <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Image/Icon File
                </label>
                {icon && !iconFile && (
                  <div className="mb-2 relative w-16 h-16 rounded-lg overflow-hidden border border-[#1e1e2e] bg-[#181824] flex items-center justify-center">
                    <img
                      src={icon.startsWith("http") ? icon : `${API_BASE_URL.replace("/api/v1", "")}${icon}`}
                      alt="Icon Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setIconFile(file);
                  }}
                  className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-indigo-500 rounded-xl text-slate-200 text-sm outline-none transition-colors cursor-pointer"
                />
              </div>

              <div className="space-y-1 py-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#181824] border border-[#1e1e2e] accent-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Active Status
                  </span>
                </label>
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
                  {submitting ? "Saving..." : "Save Amenity"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
