"use client";

import { useState } from "react";
import { GalleryCategory, GalleryItem } from "../../types";
import {
  createGalleryItem,
  uploadMultipleGalleryItems,
  updateGalleryItem,
} from "../../services/gallery.service";

interface GalleryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: GalleryCategory[];
  onRefresh: () => void;
  editingItem?: GalleryItem | null;
}

export default function GalleryUploadModal({
  isOpen,
  onClose,
  categories,
  onRefresh,
  editingItem,
}: GalleryUploadModalProps) {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("bulk");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [title, setTitle] = useState(editingItem?.title || "");
  const [altText, setAltText] = useState(editingItem?.altText || "");
  const [description, setDescription] = useState(editingItem?.description || "");
  const [categoryId, setCategoryId] = useState(editingItem?.categoryId || "");
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState(editingItem?.mediaUrl || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSingleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      if (title) formData.append("title", title);
      if (altText) formData.append("altText", altText);
      if (description) formData.append("description", description);
      if (categoryId) formData.append("categoryId", categoryId);
      if (singleFile) formData.append("file", singleFile);
      if (mediaUrl) formData.append("mediaUrl", mediaUrl);

      if (editingItem) {
        await updateGalleryItem(editingItem.id, formData);
      } else {
        await createGalleryItem(formData);
      }

      onRefresh();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save item");
    } finally {
      setLoading(false);
    }
  }

  async function handleBulkSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      if (categoryId) formData.append("categoryId", categoryId);

      await uploadMultipleGalleryItems(formData);

      setSelectedFiles([]);
      onRefresh();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to upload images");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1e1e2e] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              {editingItem ? "Edit Gallery Item" : "Upload Gallery Media"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Add single or multiple image/video files to your portfolio gallery.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Toggle (Only when creating new) */}
        {!editingItem && (
          <div className="flex border-b border-[#1e1e2e] bg-[#171721] px-6 pt-3 gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("bulk")}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === "bulk"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              📁 Bulk Multi-Image Upload
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("single")}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === "single"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              ✏️ Detailed Single Entry
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
              ⚠️ {error}
            </div>
          )}

          {/* BULK UPLOAD TAB */}
          {!editingItem && activeTab === "bulk" && (
            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Assign Category / Album (Optional)
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171721] border border-[#1e1e2e] rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">No Category (Unassigned)</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Drag and Drop Zone */}
              <div
                className="border-2 border-dashed border-[#1e1e2e] hover:border-indigo-500/50 bg-[#171721] rounded-2xl p-8 text-center transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files) {
                    setSelectedFiles(Array.from(e.dataTransfer.files));
                  }
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setSelectedFiles(Array.from(e.target.files));
                    }
                  }}
                  className="hidden"
                  id="bulk-file-input"
                />
                <label htmlFor="bulk-file-input" className="cursor-pointer">
                  <div className="text-3xl mb-2">📥</div>
                  <p className="text-sm font-semibold text-slate-200">
                    Click to select or drag & drop files here
                  </p>
                  <p className="text-xs text-slate-450 mt-1">
                    Supports JPG, PNG, WEBP, MP4 (Up to 20 files at once)
                  </p>
                </label>
              </div>

              {/* File Preview Chips */}
              {selectedFiles.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-indigo-400 mb-2">
                    Selected Files ({selectedFiles.length}):
                  </p>
                  <div className="max-h-36 overflow-y-auto space-y-1">
                    {selectedFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs px-3 py-1.5 bg-[#13131a] rounded border border-[#1e1e2e] text-slate-300"
                      >
                        <span className="truncate max-w-[300px]">{f.name}</span>
                        <span className="text-slate-500 font-mono">
                          {(f.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#1e1e2e]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || selectedFiles.length === 0}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-md"
                >
                  {loading ? "Uploading..." : `Upload ${selectedFiles.length} File(s)`}
                </button>
              </div>
            </form>
          )}

          {/* SINGLE / EDIT ENTRY TAB */}
          {(editingItem || activeTab === "single") && (
            <form onSubmit={handleSingleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Title / Caption
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Bedroom View"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171721] border border-[#1e1e2e] rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category / Album
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171721] border border-[#1e1e2e] rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">No Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Alt Text (for SEO)
                </label>
                <input
                  type="text"
                  placeholder="Descriptive image text..."
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171721] border border-[#1e1e2e] rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Detailed description of the media asset..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171721] border border-[#1e1e2e] rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Upload Media File (Image/Video)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setSingleFile(e.target.files[0]);
                  }}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/20 file:text-indigo-300 hover:file:bg-indigo-600/35 cursor-pointer"
                />
              </div>

              <div className="text-center text-xs text-slate-500 font-semibold my-2">OR</div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  External Media URL
                </label>
                <input
                  type="text"
                  placeholder="https://pub-xxxx.r2.dev/image.jpg"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171721] border border-[#1e1e2e] rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#1e1e2e]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-md"
                >
                  {loading ? "Saving..." : editingItem ? "Update Entry" : "Save Entry"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
