"use client";

import React, { useEffect, useState } from "react";
import { Blog } from "../types";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../services/blog.service";
import { API_BASE_URL } from "@/shared/lib/api-config";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Control
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [blogImage, setBlogImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const blogsData = await getBlogs();
      setBlogs(blogsData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load blogs";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setBlogImage("");
    setImageFile(null);
    setValidationErrors([]);
    setModalOpen(true);
  }

  function handleOpenEdit(b: Blog) {
    setEditingId(b.id);
    setTitle(b.title);
    setDescription(b.description);
    setBlogImage(b.blogImage || "");
    setImageFile(null);
    setValidationErrors([]);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setValidationErrors([]);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (imageFile) {
      formData.append("blogImage", imageFile);
    }

    try {
      if (editingId) {
        await updateBlog(editingId, formData);
      } else {
        await createBlog(formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save blog";
      setValidationErrors([message]);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, blogTitle: string) {
    if (!window.confirm(`Are you sure you want to delete "${blogTitle}"?`)) {
      return;
    }
    try {
      await deleteBlog(id);
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete blog";
      alert(message);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Manage Blogs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create, update, and manage your blog posts here.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer active:scale-[0.98] shadow-lg shadow-gold-solid/10 self-start sm:self-auto"
        >
          + Add Blog
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
            Loading Blogs...
          </p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="border border-[#1e1e2e] bg-[#13131a] rounded-2xl p-12 text-center space-y-4">
          <span className="text-4xl block">✍</span>
          <h3 className="text-lg font-bold text-slate-200">No Blogs Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            You haven&apos;t created any blogs yet. Click the button above to add your first blog post.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden border border-[#1e1e2e] bg-[#13131a] rounded-2xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#1e1e2e] bg-[#181824] text-slate-400 font-semibold tracking-wider text-xs uppercase">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2e] text-slate-300">
                {blogs.map((b) => (
                  <tr key={b.id} className="hover:bg-[#181824]/50 transition-colors">
                    <td className="px-6 py-4">
                      {b.blogImage ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#1e1e2e] bg-[#181824] flex items-center justify-center">
                          <img
                            src={b.blogImage.startsWith("https") ? b.blogImage : `${API_BASE_URL.replace("/api/v1", "")}${b.blogImage}`}
                            alt={b.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs italic">No Image</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200">{b.title}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">
                      <span className="text-slate-400">{b.description}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="px-3 py-1.5 bg-[#181824] hover:bg-gold-solid/10 border border-[#1e1e2e] hover:border-gold-solid/30 text-xs font-bold text-slate-300 hover:text-gold-solid rounded-lg transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b.id, b.title)}
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
                {editingId ? "Modify Blog" : "Add Blog"}
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
                  Blog Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My First Blog"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-gold-solid rounded-xl text-slate-200 text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Description
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="This is a description of my first blog post..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-gold-solid rounded-xl text-slate-200 text-sm outline-none transition-colors resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Blog Image
                </label>
                {blogImage && !imageFile && (
                  <div className="mb-2 relative w-20 h-20 rounded-lg overflow-hidden border border-[#1e1e2e] bg-[#181824] flex items-center justify-center">
                    <img
                      src={blogImage.startsWith("http") ? blogImage : `${API_BASE_URL.replace("/api/v1", "")}${blogImage}`}
                      alt="Blog Image Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                  }}
                  className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-gold-solid rounded-xl text-slate-200 text-sm outline-none transition-colors cursor-pointer"
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
                  {submitting ? "Saving..." : "Save Blog"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
