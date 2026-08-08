"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/shared/components/Modal";
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMembers,
  bulkDeleteTeamMembers,
  bulkUpdateStatus,
} from "../services/team.service";
import { TeamMember } from "../types";

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Add/Edit Modal
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [slug, setSlug] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete Confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    loadMembers();
  }, [status]);

  async function loadMembers() {
    setLoading(true);
    setError(null);
    try {
      const data = await getTeamMembers({
        search: search || undefined,
        isActive: status === "ACTIVE" ? true : status === "INACTIVE" ? false : undefined,
      });
      setMembers(data.items);
    } catch (err: any) {
      setError(err.message || "Failed to load team members");
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadMembers();
  }

  function openCreate() {
    setEditingId(null);
    setName("");
    setDesignation("");
    setDepartment("");
    setBio("");
    setEmail("");
    setPhone("");
    setLinkedin("");
    setTwitter("");
    setFacebook("");
    setInstagram("");
    setIsFeatured(false);
    setIsActive(true);
    setSlug("");
    setImageFile(null);
    setImagePreview("");
    setFormError(null);
    setIsOpen(true);
  }

  function openEdit(member: TeamMember) {
    setEditingId(member.id);
    setName(member.name);
    setDesignation(member.designation);
    setDepartment(member.department || "");
    setBio(member.bio || "");
    setEmail(member.email || "");
    setPhone(member.phone || "");
    setLinkedin(member.linkedin || "");
    setTwitter(member.twitter || "");
    setFacebook(member.facebook || "");
    setInstagram(member.instagram || "");
    setIsFeatured(member.isFeatured);
    setIsActive(member.isActive);
    setSlug(member.slug || "");
    setImageFile(null);
    setImagePreview(member.image || "");
    setFormError(null);
    setIsOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Name is required");
      return;
    }
    if (!designation.trim()) {
      setFormError("Designation is required");
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("designation", designation);
      if (department) formData.append("department", department);
      if (bio) formData.append("bio", bio);
      if (email) formData.append("email", email);
      if (phone) formData.append("phone", phone);
      if (linkedin) formData.append("linkedin", linkedin);
      if (twitter) formData.append("twitter", twitter);
      if (facebook) formData.append("facebook", facebook);
      if (instagram) formData.append("instagram", instagram);
      formData.append("isFeatured", String(isFeatured));
      formData.append("isActive", String(isActive));
      if (slug) formData.append("slug", slug);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingId) {
        await updateTeamMember(editingId, formData);
      } else {
        await createTeamMember(formData);
      }

      setIsOpen(false);
      loadMembers();
    } catch (err: any) {
      setFormError(err.message || "Failed to save team member details");
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    setDeleteSubmitting(true);
    try {
      await deleteTeamMember(deleteId);
      setDeleteId(null);
      setDeleteName("");
      loadMembers();
    } catch (err: any) {
      alert(err.message || "Failed to delete team member");
    } finally {
      setDeleteSubmitting(false);
    }
  }

  // Move member up/down in sorting
  async function handleMove(index: number, direction: "up" | "down") {
    const newMembers = [...members];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newMembers.length) return;

    // Swap
    const temp = newMembers[index];
    newMembers[index] = newMembers[targetIndex];
    newMembers[targetIndex] = temp;

    setMembers(newMembers);

    try {
      await reorderTeamMembers(newMembers.map((m) => m.id));
    } catch (err: any) {
      alert(err.message || "Failed to update sorting order");
      loadMembers(); // revert on fail
    }
  }

  // Bulk Actions
  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === members.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(members.map((m) => m.id));
    }
  };

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} members?`)) return;
    try {
      await bulkDeleteTeamMembers(selectedIds);
      setSelectedIds([]);
      loadMembers();
    } catch (err: any) {
      alert(err.message || "Failed to bulk delete members");
    }
  }

  async function handleBulkStatus(isActive: boolean) {
    if (selectedIds.length === 0) return;
    try {
      await bulkUpdateStatus(selectedIds, isActive);
      setSelectedIds([]);
      loadMembers();
    } catch (err: any) {
      alert(err.message || "Failed to bulk update status");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Team Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your company team profiles displayed on the website.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Team Member
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex w-full md:w-auto items-center gap-2">
          <input
            type="text"
            placeholder="Search by name, designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-200 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <div className="border border-[#1e1e2e] rounded-lg p-0.5 flex bg-[#0f0f14]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-indigo-500/20 text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}
              title="Grid View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-indigo-500/20 text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}
              title="List View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Header */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-900/20 border border-indigo-500/30 p-3 rounded-lg flex items-center justify-between">
          <span className="text-xs text-indigo-200 font-semibold">
            {selectedIds.length} members selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkStatus(true)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded"
            >
              Activate
            </button>
            <button
              onClick={() => handleBulkStatus(false)}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white rounded"
            >
              Deactivate
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-xs font-semibold text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Team Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center">
          {error}
        </div>
      ) : members.length === 0 ? (
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-12 text-center">
          <p className="text-slate-400">No team members found.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between group relative"
            >
              <div className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(member.id)}
                  onChange={() => handleSelectToggle(member.id)}
                  className="w-4 h-4 text-indigo-600 border-[#1e1e2e] bg-[#0f0f14] rounded focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Sorting buttons */}
              <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-1 rounded backdrop-blur-sm">
                <button
                  onClick={() => handleMove(index, "up")}
                  disabled={index === 0}
                  className="p-1 hover:bg-slate-700 text-slate-300 disabled:opacity-30 rounded transition-colors"
                  title="Move Up"
                >
                  ▲
                </button>
                <button
                  onClick={() => handleMove(index, "down")}
                  disabled={index === members.length - 1}
                  className="p-1 hover:bg-slate-700 text-slate-300 disabled:opacity-30 rounded transition-colors"
                  title="Move Down"
                >
                  ▼
                </button>
              </div>

              <div className="p-5 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 flex items-center justify-center shrink-0 mb-4">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl text-slate-500">👤</span>
                  )}
                </div>
                <h3 className="font-bold text-slate-100 flex items-center gap-1.5 justify-center">
                  {member.name}
                  {member.isFeatured && (
                    <span className="w-2 h-2 bg-amber-400 rounded-full" title="Featured Member" />
                  )}
                </h3>
                <p className="text-xs text-indigo-400 font-semibold mt-0.5">{member.designation}</p>
                {member.department && (
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wider">
                    {member.department}
                  </p>
                )}
                {member.bio && (
                  <p className="text-slate-400 text-xs mt-3 line-clamp-2 italic">"{member.bio}"</p>
                )}
              </div>

              <div className="border-t border-[#1e1e2e] bg-[#161622] px-4 py-3 flex justify-between items-center">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  member.isActive
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-500 border border-slate-700"
                }`}>
                  {member.isActive ? "ACTIVE" : "INACTIVE"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(member)}
                    className="p-1 hover:bg-indigo-500/15 text-slate-400 hover:text-indigo-400 rounded transition-colors"
                    title="Edit Member"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(member.id);
                      setDeleteName(member.name);
                    }}
                    className="p-1 hover:bg-red-500/15 text-slate-400 hover:text-red-400 rounded transition-colors"
                    title="Delete Member"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#1e1e2e] text-slate-400 text-xs font-semibold uppercase tracking-wider bg-[#161622]">
                <th className="py-4 px-6 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === members.length && members.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-indigo-600 border-[#1e1e2e] bg-[#0f0f14] rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Designation</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6">Featured</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2e]">
              {members.map((member, index) => (
                <tr key={member.id} className="hover:bg-[#161622]/50 text-slate-300">
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(member.id)}
                      onChange={() => handleSelectToggle(member.id)}
                      className="w-4 h-4 text-indigo-600 border-[#1e1e2e] bg-[#0f0f14] rounded focus:ring-indigo-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-6 font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center shrink-0">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm text-slate-500">👤</span>
                      )}
                    </div>
                    {member.name}
                  </td>
                  <td className="py-4 px-6 text-indigo-400 font-medium">{member.designation}</td>
                  <td className="py-4 px-6 text-slate-400">{member.department || "—"}</td>
                  <td className="py-4 px-6">
                    {member.isFeatured ? (
                      <span className="text-amber-400 text-xs">★ Yes</span>
                    ) : (
                      <span className="text-slate-500 text-xs">No</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      member.isActive
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-500 border border-slate-700"
                    }`}>
                      {member.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0}
                        className="p-1 hover:bg-slate-700 text-slate-300 disabled:opacity-30 rounded"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMove(index, "down")}
                        disabled={index === members.length - 1}
                        className="p-1 hover:bg-slate-700 text-slate-300 disabled:opacity-30 rounded"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        onClick={() => openEdit(member)}
                        className="p-1 hover:bg-indigo-500/15 text-slate-400 hover:text-indigo-400 rounded"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(member.id);
                          setDeleteName(member.name);
                        }}
                        className="p-1 hover:bg-red-500/15 text-slate-400 hover:text-red-400 rounded"
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
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editingId ? "Edit Team Member" : "Add Team Member"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs">
              {formError}
            </div>
          )}

          {/* Image Preview & Upload */}
          <div className="space-y-2 flex flex-col items-center">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Profile Image</label>
            <div className="w-24 h-24 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center relative group">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-slate-500">👤</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              id="team-image-file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
            />
            <label
              htmlFor="team-image-file"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded cursor-pointer transition-colors"
            >
              Upload Photo
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Designation *</label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Chief Executive Officer"
                className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Executive Board"
                className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">SEO Slug (Optional)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. john-doe"
                className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@company.com"
                className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 99999 99999"
                className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Short Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Provide a brief background statement..."
              rows={3}
              className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide border-b border-[#1e1e2e] pb-1">Social Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase font-bold">LinkedIn URL</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded px-2.5 py-1.5 text-xs text-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase font-bold">Twitter / X URL</label>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://x.com/username"
                  className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded px-2.5 py-1.5 text-xs text-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase font-bold">Facebook URL</label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/username"
                  className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded px-2.5 py-1.5 text-xs text-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase font-bold">Instagram URL</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/username"
                  className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded px-2.5 py-1.5 text-xs text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="flex gap-6 pt-2 bg-[#0f0f14] p-3 rounded-lg border border-[#1e1e2e]">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeatured-toggle"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-[#1e1e2e] bg-[#0f0f14] rounded focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="isFeatured-toggle" className="text-xs font-bold text-slate-300">Featured Member</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive-toggle"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-[#1e1e2e] bg-[#0f0f14] rounded focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="isActive-toggle" className="text-xs font-bold text-slate-300">Active Profile</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {formSubmitting ? "Saving..." : "Save Member"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Team Member">
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete <strong className="text-slate-100">"{deleteName}"</strong>? This profile will be permanently removed from the system.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleteSubmitting}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {deleteSubmitting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
