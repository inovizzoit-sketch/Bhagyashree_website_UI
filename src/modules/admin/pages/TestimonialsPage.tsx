"use client";

import React, { useEffect, useState } from "react";
import { Testimonial } from "../types";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../services/testimonial.service";
import { API_BASE_URL } from "@/shared/lib/api-config";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Control
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load testimonials";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingId(null);
    setName("");
    setDesignation("");
    setCompany("");
    setRating(5);
    setMessage("");
    setAvatar("");
    setAvatarFile(null);
    setValidationErrors([]);
    setModalOpen(true);
  }

  function handleOpenEdit(t: Testimonial) {
    setEditingId(t.id);
    setName(t.name);
    setDesignation(t.designation || "");
    setCompany(t.company || "");
    setRating(t.rating);
    setMessage(t.message);
    setAvatar(t.avatar || "");
    setAvatarFile(null);
    setValidationErrors([]);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setValidationErrors([]);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("designation", designation);
    formData.append("company", company);
    formData.append("rating", String(rating));
    formData.append("message", message);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      if (editingId) {
        await updateTestimonial(editingId, formData);
      } else {
        await createTestimonial(formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save testimonial";
      setValidationErrors([msg]);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Are you sure you want to delete the testimonial from "${name}"?`)) {
      return;
    }
    try {
      await deleteTestimonial(id);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete testimonial";
      alert(msg);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Client Testimonials
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage feedback from clients, investors, and homeowners.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer active:scale-[0.98] shadow-lg shadow-gold-solid/10 self-start sm:self-auto"
        >
          + Add Testimonial
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
            Loading Testimonials...
          </p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="border border-[#1e1e2e] bg-[#13131a] rounded-2xl p-12 text-center space-y-4">
          <span className="text-4xl block">★</span>
          <h3 className="text-lg font-bold text-slate-200">No Testimonials Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            No testimonials exist yet. Click the button above to add client feedback.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden border border-[#1e1e2e] bg-[#13131a] rounded-2xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#1e1e2e] bg-[#181824] text-slate-400 font-semibold tracking-wider text-xs uppercase">
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Role & Company</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2e] text-slate-300">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-[#181824]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#1e1e2e] bg-[#181824] flex items-center justify-center shrink-0">
                          {t.avatar ? (
                            <img
                              src={t.avatar.startsWith("http") || t.avatar.startsWith("https") ? t.avatar : `${API_BASE_URL.replace("/api/v1", "")}${t.avatar}`}
                              alt={t.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-slate-500 font-bold text-sm uppercase">
                              {t.name.slice(0, 2)}
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-slate-200">{t.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-200 font-medium">{t.designation || "Client"}</div>
                      <div className="text-xs text-slate-400">{t.company || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="text-base">
                            {i < t.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-sm truncate">
                      <span className="text-slate-400">{t.message}</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="px-3 py-1.5 bg-[#181824] hover:bg-gold-solid/10 border border-[#1e1e2e] hover:border-gold-solid/30 text-xs font-bold text-slate-300 hover:text-gold-solid rounded-lg transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.name)}
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
                {editingId ? "Modify Testimonial" : "Add Testimonial"}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Client Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-gold-solid rounded-xl text-slate-200 text-sm outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Rating (1 - 5)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-gold-solid rounded-xl text-slate-200 text-sm outline-none transition-colors cursor-pointer"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                    <option value={2}>2 Stars ★★☆☆☆</option>
                    <option value={1}>1 Star ★☆☆☆☆</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-gold-solid rounded-xl text-slate-200 text-sm outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-gold-solid rounded-xl text-slate-200 text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Testimonial Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="This is an amazing service! Highly recommended."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-[#181824] border border-[#1e1e2e] hover:border-[#3F404D] focus:border-gold-solid rounded-xl text-slate-200 text-sm outline-none transition-colors resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Avatar / Client Photo
                </label>
                {avatar && !avatarFile && (
                  <div className="mb-2 relative w-14 h-14 rounded-full overflow-hidden border border-[#1e1e2e] bg-[#181824] flex items-center justify-center">
                    <img
                      src={avatar.startsWith("http") || avatar.startsWith("https") ? avatar : `${API_BASE_URL.replace("/api/v1", "")}${avatar}`}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setAvatarFile(file);
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
                  {submitting ? "Saving..." : "Save Testimonial"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
