"use client";

import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/shared/lib/api-config";
import { GalleryItem, GalleryCategory } from "../types";
import {
  getGalleryItems,
  getGalleryCategories,
  deleteGalleryItem,
  toggleGalleryItemStatus,
  reorderGalleryItems,
} from "../services/gallery.service";
import GalleryCategoryModal from "../components/gallery/GalleryCategoryModal";
import GalleryUploadModal from "../components/gallery/GalleryUploadModal";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals & Reordering
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [previewMedia, setPreviewMedia] = useState<{ url: string; title?: string; type: string } | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadGalleryItems();
  }, [page, search, selectedCategoryId, selectedMediaType]);

  async function loadCategories() {
    try {
      const cats = await getGalleryCategories();
      setCategories(cats);
    } catch (err: any) {
      console.error("Failed to load categories:", err);
    }
  }

  async function loadGalleryItems() {
    setLoading(true);
    setError(null);
    try {
      const res = await getGalleryItems({
        page,
        limit: 12,
        search,
        categoryId: selectedCategoryId || undefined,
        mediaType: selectedMediaType || undefined,
      });
      setItems(res.items);
      setTotalPages(res.meta.totalPages);
      setTotalCount(res.meta.total);
    } catch (err: any) {
      setError(err.message || "Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(item: GalleryItem) {
    try {
      await toggleGalleryItemStatus(item.id, !item.status);
      loadGalleryItems();
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  }

  async function handleDelete(id: string, itemTitle?: string) {
    if (!window.confirm(`Are you sure you want to delete "${itemTitle || "Untitled"}"?`)) return;
    try {
      await deleteGalleryItem(id);
      loadGalleryItems();
    } catch (err: any) {
      alert(err.message || "Failed to delete item");
    }
  }

  function handleMove(index: number, direction: "up" | "down") {
    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Recalculate sortOrder
    const reordered = newItems.map((item, idx) => ({
      ...item,
      sortOrder: idx + 1,
    }));

    setItems(reordered);
  }

  async function handleSaveOrder() {
    try {
      const orderPayload = items.map((item, index) => ({
        id: item.id,
        sortOrder: index + 1,
      }));
      await reorderGalleryItems(orderPayload);
      setIsReordering(false);
      loadGalleryItems();
    } catch (err: any) {
      alert(err.message || "Failed to save reorder");
    }
  }

  const getMediaUrl = (url?: string | null) => {
    if (!url) return "/placeholder-gallery.jpg";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    const baseUrl = API_BASE_URL.replace("/api/v1", "");
    return `${baseUrl}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Portfolio Gallery Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Organize albums, drag & drop reorder, multi-upload images/videos, and manage SEO alt text.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="px-4 py-2.5 bg-[#171721] hover:bg-[#20202e] border border-[#1e1e2e] text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            📁 Manage Categories ({categories.length})
          </button>

          <button
            onClick={() => {
              setEditingItem(null);
              setUploadModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer shadow-lg shadow-gold-solid/10"
          >
            ➕ Upload Gallery Media
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-sm text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Category Pills Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            setSelectedCategoryId("");
            setPage(1);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
            selectedCategoryId === ""
              ? "bg-gold-solid text-[#020520] font-bold shadow-sm shadow-gold-solid/10"
              : "bg-[#13131a] hover:bg-[#171721] border border-[#1e1e2e] text-slate-400"
          }`}
        >
          All Albums ({totalCount})
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategoryId(cat.id);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryId === cat.id
                ? "bg-gold-solid text-[#020520] font-bold shadow-sm shadow-gold-solid/10"
                : "bg-[#13131a] hover:bg-[#171721] border border-[#1e1e2e] text-slate-400"
            }`}
          >
            {cat.name} ({cat._count?.galleries ?? 0})
          </button>
        ))}
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-4">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <span className="text-slate-400 pl-2">🔍</span>
          <input
            type="text"
            placeholder="Search by title, description, or alt text..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 w-full text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={selectedMediaType}
            onChange={(e) => {
              setSelectedMediaType(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 bg-[#171721] border border-[#1e1e2e] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-gold-solid"
          >
            <option value="">All Formats</option>
            <option value="IMAGE">Images</option>
            <option value="VIDEO">Videos</option>
          </select>

          {isReordering ? (
            <button
              onClick={handleSaveOrder}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
            >
              💾 Save Order
            </button>
          ) : (
            <button
              onClick={() => setIsReordering(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              🔄 Reorder Mode
            </button>
          )}
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-8 h-8 border-2 border-gold-solid/20 border-t-gold-solid rounded-full animate-spin" />
          <p className="text-xs text-slate-500 tracking-wider uppercase font-semibold">Loading gallery items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-[#13131a] rounded-2xl border border-[#1e1e2e] p-8 space-y-4">
          <div className="text-4xl">🖼</div>
          <h3 className="text-base font-bold text-slate-300">No Media Assets Found</h3>
          <p className="text-xs text-slate-450 max-w-sm mx-auto">
            Upload single or bulk photos/videos to feature them on your site's portfolio gallery.
          </p>
          <button
            onClick={() => {
              setEditingItem(null);
              setUploadModalOpen(true);
            }}
            className="px-4 py-2 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-gold-solid/10"
          >
            Upload Media Files
          </button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`group relative bg-[#13131a] rounded-2xl overflow-hidden border transition-all flex flex-col ${
                item.status ? "border-[#1e1e2e] hover:border-gold-solid/40" : "border-slate-800 opacity-60"
              }`}
            >
              {/* Media Thumbnail Container */}
              <div className="aspect-[4/3] w-full relative overflow-hidden bg-slate-950 flex items-center justify-center group/media">
                {item.mediaType === "VIDEO" ? (
                  <video
                    src={getMediaUrl(item.mediaUrl)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={getMediaUrl(item.mediaUrl)}
                    alt={item.altText || item.title || "Gallery Media"}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-gallery.jpg";
                    }}
                    className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-300"
                  />
                )}

                {/* Category Badge */}
                <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-gold-solid border border-gold-solid/30">
                  {item.category?.name || "General"}
                </span>

                {/* Status Badge */}
                <span
                  className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-md ${
                    item.status
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-800/80 text-slate-400 border border-slate-700"
                  }`}
                >
                  {item.status ? "Active" : "Draft"}
                </span>

                {/* Preview Overlay Button */}
                <button
                  onClick={() =>
                    setPreviewMedia({
                      url: item.mediaUrl,
                      title: item.title,
                      type: item.mediaType,
                    })
                  }
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white font-semibold text-xs gap-1.5"
                >
                  🔍 Click to Preview
                </button>
              </div>

              {/* Details & Action Controls */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-200 line-clamp-1">
                    {item.title || "Untitled Media"}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-slate-450 mt-1 line-clamp-2">{item.description}</p>
                  )}
                  {item.altText && (
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      Alt: {item.altText}
                    </p>
                  )}
                </div>

                {/* Action Bar */}
                <div className="pt-2 border-t border-[#1e1e2e] flex items-center justify-between">
                  {isReordering ? (
                    <div className="flex items-center gap-1">
                      <button
                        disabled={index === 0}
                        onClick={() => handleMove(index, "up")}
                        className="px-2 py-1 bg-slate-800 disabled:opacity-30 hover:bg-slate-700 text-xs rounded text-slate-300 cursor-pointer"
                      >
                        ← Up
                      </button>
                      <button
                        disabled={index === items.length - 1}
                        onClick={() => handleMove(index, "down")}
                        className="px-2 py-1 bg-slate-800 disabled:opacity-30 hover:bg-slate-700 text-xs rounded text-slate-300 cursor-pointer"
                      >
                        Down →
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`text-[11px] font-semibold transition-colors cursor-pointer ${
                          item.status ? "text-amber-400 hover:text-amber-300" : "text-emerald-400 hover:text-emerald-300"
                        }`}
                      >
                        {item.status ? "Hide" : "Publish"}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setUploadModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-gold-solid/10 hover:bg-gold-solid/20 text-gold-solid text-xs rounded transition-colors cursor-pointer"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="px-2 py-1 bg-red-500/15 hover:bg-red-500/30 text-red-400 text-xs rounded transition-colors cursor-pointer"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="px-6 py-4 bg-[#13131a] border border-[#1e1e2e] rounded-2xl flex items-center justify-between">
          <span className="text-xs text-slate-450">
            Page {page} of {totalPages} ({totalCount} total items)
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1.5 bg-[#171721] hover:bg-[#20202e] disabled:opacity-40 border border-[#1e1e2e] rounded text-xs font-medium text-slate-300 cursor-pointer"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1.5 bg-[#171721] hover:bg-[#20202e] disabled:opacity-40 border border-[#1e1e2e] rounded text-xs font-medium text-slate-300 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Category Modal */}
      <GalleryCategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        categories={categories}
        onRefresh={() => {
          loadCategories();
          loadGalleryItems();
        }}
      />

      {/* Upload/Edit Modal */}
      <GalleryUploadModal
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          setEditingItem(null);
        }}
        categories={categories}
        onRefresh={loadGalleryItems}
        editingItem={editingItem}
      />

      {/* Lightbox / Preview Modal */}
      {previewMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setPreviewMedia(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-transparent flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute -top-10 right-0 text-white hover:text-red-400 text-xl font-bold cursor-pointer"
            >
              ✕ Close
            </button>
            {previewMedia.type === "VIDEO" ? (
              <video
                src={getMediaUrl(previewMedia.url)}
                controls
                autoPlay
                className="max-h-[80vh] w-auto rounded-xl shadow-2xl border border-slate-700"
              />
            ) : (
              <img
                src={getMediaUrl(previewMedia.url)}
                alt={previewMedia.title || "Preview"}
                className="max-h-[80vh] w-auto rounded-xl shadow-2xl border border-slate-700"
              />
            )}
            {previewMedia.title && (
              <p className="text-slate-200 text-sm font-semibold mt-3 bg-black/60 px-4 py-1.5 rounded-full border border-slate-700">
                {previewMedia.title}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
