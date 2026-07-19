"use client";

import React, { useEffect, useState } from "react";
import { GalleryItem } from "../types";
import {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
} from "../services/gallery.service";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Control
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await getGalleryItems();
      setItems(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load gallery items";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setTitle("");
    setCategory("");
    setFile(null);
    setValidationErrors([]);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setValidationErrors(["Please select an image or video file to upload."]);
      return;
    }

    setSubmitting(true);
    setValidationErrors([]);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("file", file);

    try {
      await createGalleryItem(formData);
      setModalOpen(false);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload gallery item";
      setValidationErrors([msg]);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, itemTitle: string) {
    if (!window.confirm(`Are you sure you want to delete the gallery item "${itemTitle || "Untitled"}"?`)) {
      return;
    }
    try {
      await deleteGalleryItem(id);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete gallery item";
      alert(msg);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Gallery Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload images and videos for the client website gallery.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer active:scale-[0.98] shadow-lg shadow-indigo-500/10 self-start sm:self-auto"
        >
          + Add Gallery Item
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
          <p className="text-xs text-slate-500 tracking-wider uppercase font-semibold">Loading gallery...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-[#13131a] rounded-2xl border border-slate-800 p-8 space-y-4">
          <div className="text-4xl text-slate-600">🖼</div>
          <h3 className="text-base font-bold text-slate-300">No Gallery Items Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload images or videos of developments, clubhouses, and amenities to show them on the public gallery page.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer"
          >
            Upload First Item
          </button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative bg-[#13131a] rounded-2xl overflow-hidden border border-[#1e1e2e] hover:border-slate-700 transition-all flex flex-col"
            >
              <div className="aspect-[4/3] w-full relative overflow-hidden bg-slate-900 flex items-center justify-center">
                {item.mediaType === "VIDEO" ? (
                  <video
                    src={item.mediaUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={item.mediaUrl}
                    alt={item.title || "Gallery Media"}
                    className="w-full h-full object-cover"
                  />
                )}

                <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 backdrop-blur-md">
                  {item.category || "General"}
                </span>

                <button
                  onClick={() => handleDelete(item.id, item.title || "")}
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 text-red-400 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-95 cursor-pointer"
                  title="Delete Item"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-200 line-clamp-1">
                    {item.title || "Untitled"}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                    Format: {item.mediaType}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#13131a] rounded-2xl border border-[#1e1e2e] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e2e]">
              <h3 className="font-bold text-slate-200">Upload Gallery Item</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 flex items-center justify-center transition-colors cursor-pointer bg-transparent border-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {validationErrors.length > 0 && (
                <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400 space-y-1">
                  {validationErrors.map((err, i) => (
                    <div key={i}>• {err}</div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Clubhouse Entrance"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Clubhouse"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  File (Image / Video) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  required
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setFile(files[0]);
                    }
                  }}
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 file:cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e1e2e]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer bg-transparent border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer active:scale-95"
                >
                  {submitting ? "Uploading..." : "Upload Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
