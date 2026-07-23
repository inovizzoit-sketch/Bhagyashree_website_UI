"use client";

import React, { useEffect, useState } from "react";
import {
  AmenityCategory,
  getAmenityCategories,
  createAmenityCategory,
  updateAmenityCategory,
  deleteAmenityCategory,
} from "../services/amenity-category.service";

export default function AmenityCategoriesPage() {
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
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAmenityCategories();
      setCategories(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load categories";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setIcon("");
    setSortOrder(1);
    setIsActive(true);
    setValidationErrors([]);
    setModalOpen(true);
  }

  function handleOpenEdit(cat: AmenityCategory) {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setIcon(cat.icon || "");
    setSortOrder(cat.sortOrder);
    setIsActive(cat.isActive);
    setValidationErrors([]);
    setModalOpen(true);
  }

  // Auto slug generation helper
  function handleNameChange(val: string) {
    setName(val);
    if (!editingId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setValidationErrors([]);

    const payload = {
      name,
      slug: slug || undefined,
      description: description || undefined,
      icon: icon || undefined,
      sortOrder: Number(sortOrder),
      isActive,
    };

    try {
      if (editingId) {
        await updateAmenityCategory(editingId, payload);
      } else {
        await createAmenityCategory(payload);
      }
      setModalOpen(false);
      loadCategories();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save category";
      setValidationErrors([message]);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, catName: string) {
    if (!window.confirm(`Are you sure you want to delete the "${catName}" category?`)) {
      return;
    }
    try {
      await deleteAmenityCategory(id);
      loadCategories();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete category";
      alert(message);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Amenity Categories
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage grouping classifications for project-wide facilities and community amenities.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer active:scale-[0.98] shadow-lg shadow-gold-solid/10 self-start sm:self-auto"
        >
          + Add Category
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-8 h-8 border-2 border-gold-solid/20 border-t-gold-solid rounded-full animate-spin" />
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Loading Categories...
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="border border-[#1e1e2e] bg-[#13131a] rounded-2xl p-12 text-center space-y-4">
          <span className="text-4xl block">📦</span>
          <h3 className="text-lg font-bold text-slate-200">No Categories Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            You haven&apos;t created any amenity categories yet. Click the button above to add your first category.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden border border-[#1e1e2e] bg-[#13131a] rounded-2xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#1e1e2e] bg-[#181824] text-slate-400 font-semibold tracking-wider text-xs uppercase">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Icon Identifier</th>
                  <th className="px-6 py-4">Sort Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2e] text-slate-300">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#181824]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200">{cat.name}</div>
                      {cat.description && (
                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-xs font-light">
                          {cat.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {cat.slug}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gold-solid font-mono">
                      {cat.icon || "N/A"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-300">
                      {cat.sortOrder}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          cat.isActive
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-slate-500/10 border-slate-500/20 text-slate-400"
                        }`}
                      >
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="px-3 py-1.5 bg-[#181824] hover:bg-gold-solid/10 border border-[#1e1e2e] hover:border-gold-solid/30 text-xs font-bold text-slate-300 hover:text-gold-solid rounded-lg transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
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
                {editingId ? "Modify Amenity Category" : "Add Amenity Category"}
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
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sports & Fitness"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-gold-solid rounded-xl text-slate-200 text-sm outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Slug
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="sports-and-fitness"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-gold-solid rounded-xl text-slate-200 text-xs font-mono outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Icon Identifier
                  </label>
                  <input
                    type="text"
                    placeholder="sports-icon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-gold-solid rounded-xl text-slate-200 text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-gold-solid rounded-xl text-slate-200 text-sm outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1 flex flex-col justify-end pb-3.5">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#181824] border border-[#1e1e2e] accent-gold-solid cursor-pointer"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Active Status
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the nature of facilities in this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-gold-solid rounded-xl text-slate-200 text-sm outline-none transition-colors resize-none"
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
                  className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover disabled:opacity-50 text-[#020520] rounded-xl text-xs font-bold tracking-wide transition-colors cursor-pointer active:scale-[0.98] shadow-lg shadow-gold-solid/10"
                >
                  {submitting ? "Saving..." : "Save Category"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
