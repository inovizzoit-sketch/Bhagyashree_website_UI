"use client";

import React, { useEffect, useState } from "react";
import { HomeGallery } from "../types";
import {
  getHomeGalleries,
  createHomeGallery,
  updateHomeGallery,
  deleteHomeGallery,
} from "../services/home-gallery.service";
import { API_BASE_URL } from "@/shared/lib/api-config";

export default function HomeGalleryPage() {
  const [items, setItems] = useState<HomeGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filtering state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Modal control
  const [modalOpen, setModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [selectedShowItem, setSelectedShowItem] = useState<HomeGallery | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [page, search, isActiveFilter, sortOrder]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const activeParam = isActiveFilter === "active" ? true : isActiveFilter === "inactive" ? false : undefined;
      const data = await getHomeGalleries({
        page,
        limit,
        search: search || undefined,
        isActive: activeParam,
        sortOrder,
      });
      setItems(data.items);
      setTotalPages(data.meta.totalPages);
      setTotalItems(data.meta.total);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load home gallery items";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingId(null);
    setTitle("");
    setTag("");
    setDisplayOrder(0);
    setIsActive(true);
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
    setValidationErrors([]);
    setModalOpen(true);
  }

  function handleOpenEdit(item: HomeGallery) {
    setEditingId(item.id);
    setTitle(item.title);
    setTag(item.tag);
    setDisplayOrder(item.displayOrder);
    setIsActive(item.isActive);
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(item.image);
    setValidationErrors([]);
    setModalOpen(true);
  }

  function handleOpenShow(item: HomeGallery) {
    setSelectedShowItem(item);
    setShowModalOpen(true);
  }

  // Handle File Change & Preview
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validate locally first
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors(["Image file size must not exceed 5 MB"]);
        return;
      }
      const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedMimes.includes(file.type)) {
        setValidationErrors(["Image must be in jpg, jpeg, png, or webp format"]);
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setValidationErrors([]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setValidationErrors([]);

    if (!editingId && !imageFile) {
      setValidationErrors(["An image file is required to create a gallery item."]);
      setSubmitting(false);
      return;
    }

    if (title.length > 100) {
      setValidationErrors(["Title must be 100 characters or less."]);
      setSubmitting(false);
      return;
    }

    if (tag.length > 40) {
      setValidationErrors(["Tag must be 40 characters or less."]);
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("tag", tag);
    formData.append("displayOrder", String(displayOrder));
    formData.append("isActive", String(isActive));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingId) {
        await updateHomeGallery(editingId, formData);
        setSuccessMessage("Gallery item updated successfully!");
      } else {
        await createHomeGallery(formData);
        setSuccessMessage("Gallery item created successfully!");
      }
      setTimeout(() => setSuccessMessage(null), 3000);
      setModalOpen(false);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save gallery item";
      setValidationErrors([msg]);
    } finally {
      setSubmitting(false);
    }
  }

  function handleOpenDeleteConfirm(id: string, title: string) {
    setItemToDelete({ id, title });
    setDeleteConfirmOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!itemToDelete) return;
    try {
      await deleteHomeGallery(itemToDelete.id);
      setSuccessMessage("Gallery item deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete item";
      alert(msg);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Homepage Gallery
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage the beautiful sliding showcase gallery images on the home page.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer active:scale-[0.98] shadow-lg shadow-gold-solid/10 self-start sm:self-auto"
        >
          + Add Image
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-sm text-emerald-400 animate-in fade-in duration-350 flex items-center gap-2">
          <span>✓</span> {successMessage}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-[#13131a] p-4 rounded-2xl border border-[#1e1e2e]">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 text-sm outline-none transition-colors"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={isActiveFilter}
            onChange={(e) => {
              setIsActiveFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-300 text-sm outline-none transition-colors cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-300 text-sm outline-none transition-colors cursor-pointer"
          >
            <option value="asc">Display Order (Asc)</option>
            <option value="desc">Display Order (Desc)</option>
          </select>
        </div>
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
            Loading Gallery...
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="border border-[#1e1e2e] bg-[#13131a] rounded-2xl p-12 text-center space-y-4">
          <span className="text-4xl block">☘</span>
          <h3 className="text-lg font-bold text-slate-200">No Gallery Items Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            No active or inactive records found. Click the button above to publish one.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden border border-[#1e1e2e] bg-[#13131a] rounded-2xl shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#1e1e2e] bg-[#181824] text-slate-400 font-semibold tracking-wider text-xs uppercase">
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Tag</th>
                    <th className="px-6 py-4">Display Order</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e2e] text-slate-300">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#181824]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-[#1e1e2e] bg-[#181824]">
                          <img
                            src={
                              item.image.startsWith("http")
                                ? item.image
                                : `${API_BASE_URL.replace("/api/v1", "")}${item.image}`
                            }
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-200">
                        {item.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-md text-xs font-semibold">
                          {item.tag}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-medium">
                        {item.displayOrder}
                      </td>
                      <td className="px-6 py-4">
                        {item.isActive ? (
                          <span className="text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">
                            Active
                          </span>
                        ) : (
                          <span className="text-slate-400 bg-slate-400/10 border border-slate-400/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenShow(item)}
                          className="px-3 py-1.5 bg-[#181824] hover:bg-indigo-500/10 border border-[#1e1e2e] hover:border-indigo-500/30 text-xs font-bold text-slate-300 hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="px-3 py-1.5 bg-[#181824] hover:bg-gold-solid/10 border border-[#1e1e2e] hover:border-gold-solid/30 text-xs font-bold text-slate-300 hover:text-gold-solid rounded-lg transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleOpenDeleteConfirm(item.id, item.title)}
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-[#13131a] px-6 py-4 rounded-2xl border border-[#1e1e2e]">
              <span className="text-xs text-slate-400">
                Showing page <strong className="text-slate-200">{page}</strong> of <strong className="text-slate-200">{totalPages}</strong> ({totalItems} items)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3.5 py-1.5 bg-[#181824] hover:bg-[#202030] disabled:opacity-40 disabled:hover:bg-[#181824] border border-[#1e1e2e] rounded-lg text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3.5 py-1.5 bg-[#181824] hover:bg-[#202030] disabled:opacity-40 disabled:hover:bg-[#181824] border border-[#1e1e2e] rounded-lg text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* modal create/edit popup */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#13131a] border border-[#1e1e2e] rounded-2xl shadow-2xl overflow-hidden">
            <header className="px-6 py-5 border-b border-[#1e1e2e] flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100">
                {editingId ? "Edit Gallery Item" : "Add Gallery Item"}
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
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl space-y-1">
                  {validationErrors.map((err, idx) => (
                    <div key={idx}>• {err}</div>
                  ))}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Premium Clubhouse"
                  className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-200 text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Tag <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={40}
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Lifestyle, Sports"
                  className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-200 text-sm outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-200 text-sm outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={isActive ? "true" : "false"}
                    onChange={(e) => setIsActive(e.target.value === "true")}
                    className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-300 text-sm outline-none transition-colors cursor-pointer"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Image Upload Input with Preview */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Image File <span className="text-red-400">{editingId ? "" : "*"}</span>
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-300 hover:file:bg-indigo-500/20 file:cursor-pointer"
                />
                
                {/* Preview Box */}
                {(imagePreview || existingImageUrl) && (
                  <div className="mt-3 border border-[#1e1e2e] rounded-xl overflow-hidden relative aspect-[16/9] bg-[#0b0b0f] flex items-center justify-center">
                    <img
                      src={
                        imagePreview || (
                          existingImageUrl?.startsWith("http")
                            ? existingImageUrl
                            : `${API_BASE_URL.replace("/api/v1", "")}${existingImageUrl}`
                        )
                      }
                      alt="Gallery Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-slate-300">
                      {imagePreview ? "New Preview" : "Current Image"}
                    </div>
                  </div>
                )}
              </div>

              <footer className="pt-4 border-t border-[#1e1e2e] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-transparent hover:bg-white/5 border border-[#1e1e2e] rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gold-solid hover:bg-gold-hover disabled:opacity-50 text-[#020520] rounded-xl text-xs font-bold tracking-wide transition-colors cursor-pointer"
                >
                  {submitting ? "Saving..." : editingId ? "Update Item" : "Create Item"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showModalOpen && selectedShowItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#13131a] border border-[#1e1e2e] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <header className="px-6 py-5 border-b border-[#1e1e2e] flex items-center justify-between bg-[#181824]">
              <h3 className="text-lg font-bold text-slate-100">Gallery Item Details</h3>
              <button
                onClick={() => setShowModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 outline-none text-xl"
              >
                ✕
              </button>
            </header>

            <div className="p-6 space-y-6">
              {/* Image Preview Card */}
              <div className="border border-[#1e1e2e] rounded-xl overflow-hidden aspect-[16/9] bg-[#0b0b0f] relative">
                <img
                  src={
                    selectedShowItem.image.startsWith("http")
                      ? selectedShowItem.image
                      : `${API_BASE_URL.replace("/api/v1", "")}${selectedShowItem.image}`
                  }
                  alt={selectedShowItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-[#0b0b0f] p-3.5 rounded-xl border border-[#1e1e2e] space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Title</span>
                  <span className="font-semibold text-slate-200">{selectedShowItem.title}</span>
                </div>
                <div className="bg-[#0b0b0f] p-3.5 rounded-xl border border-[#1e1e2e] space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Tag</span>
                  <span className="inline-block bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-0.5 rounded text-xs font-semibold">
                    {selectedShowItem.tag}
                  </span>
                </div>
                <div className="bg-[#0b0b0f] p-3.5 rounded-xl border border-[#1e1e2e] space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Display Order</span>
                  <span className="font-medium text-slate-200">{selectedShowItem.displayOrder}</span>
                </div>
                <div className="bg-[#0b0b0f] p-3.5 rounded-xl border border-[#1e1e2e] space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Status</span>
                  <div>
                    {selectedShowItem.isActive ? (
                      <span className="text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide inline-block">
                        Active
                      </span>
                    ) : (
                      <span className="text-slate-400 bg-slate-400/10 border border-slate-400/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide inline-block">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-[#0b0b0f] p-3.5 rounded-xl border border-[#1e1e2e] space-y-1 col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">System Identifiers</span>
                  <div className="text-[11px] font-mono text-slate-400 break-all">ID: {selectedShowItem.id}</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    Published: {new Date(selectedShowItem.createdAt).toLocaleString()}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Last Modified: {new Date(selectedShowItem.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <footer className="px-6 py-5 border-t border-[#1e1e2e] flex justify-end bg-[#181824]">
              <button
                onClick={() => setShowModalOpen(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#13131a] border border-[#1e1e2e] rounded-2xl shadow-2xl p-6 text-center space-y-5 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center text-xl mx-auto">
              ⚠️
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-100">Confirm Deletion</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to delete the gallery item <strong className="text-slate-200">"{itemToDelete.title}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 bg-transparent hover:bg-white/5 border border-[#1e1e2e] rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-red-650 hover:bg-red-550 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
