"use client";

import { useState, useEffect } from "react";
import { GalleryCategory } from "../../types";
import {
  createGalleryCategory,
  updateGalleryCategory,
  deleteGalleryCategory,
} from "../../services/gallery.service";

interface GalleryCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: GalleryCategory[];
  onRefresh: () => void;
}

export default function GalleryCategoryModal({
  isOpen,
  onClose,
  categories,
  onRefresh,
}: GalleryCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setDescription(editingCategory.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [editingCategory]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      setError(null);

      if (editingCategory) {
        await updateGalleryCategory(editingCategory.id, {
          name: name.trim(),
          description: description.trim(),
        });
      } else {
        await createGalleryCategory({
          name: name.trim(),
          description: description.trim(),
        });
      }

      setName("");
      setDescription("");
      setEditingCategory(null);
      onRefresh();
    } catch (err: any) {
      setError(err.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      setLoading(true);
      await deleteGalleryCategory(id);
      if (editingCategory?.id === id) setEditingCategory(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1e1e2e] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Manage Categories</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Create, edit, and organize gallery albums/categories.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
              ⚠️ {error}
            </div>
          )}

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="bg-[#171721] p-4 rounded-xl border border-[#1e1e2e] space-y-4">
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Interior Designs, Construction"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#13131a] border border-[#1e1e2e] rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Short category description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#13131a] border border-[#1e1e2e] rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {editingCategory && (
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                {loading ? "Saving..." : editingCategory ? "Update Category" : "Add Category"}
              </button>
            </div>
          </form>

          {/* List of Existing Categories */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Existing Categories ({categories.length})
            </h3>
            {categories.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No categories created yet.</p>
            ) : (
              <div className="divide-y divide-[#1e1e2e] border border-[#1e1e2e] rounded-xl overflow-hidden bg-[#13131a]">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-3 flex items-center justify-between hover:bg-[#171721] transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        {cat.name}
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {cat._count?.galleries ?? 0} items
                        </span>
                      </div>
                      {cat.description && (
                        <p className="text-xs text-slate-450 mt-0.5">{cat.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/35 text-indigo-300 text-xs rounded transition-colors cursor-pointer"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="px-2.5 py-1 bg-red-500/15 hover:bg-red-500/30 text-red-400 text-xs rounded transition-colors cursor-pointer"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1e1e2e] bg-[#171721] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
