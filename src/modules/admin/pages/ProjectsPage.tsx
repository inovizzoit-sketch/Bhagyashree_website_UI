"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "@/shared/components/Modal";
import { getProjects, getProjectByIdOrSlug, updateProject, deleteProject } from "../services/project.service";
import { Project, ProjectProperty, ProjectType, ProjectStatus } from "../types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail View State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Edit Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editProjectType, setEditProjectType] = useState<ProjectType>("APARTMENT");
  const [editProjectStatus, setEditProjectStatus] = useState<ProjectStatus>("ONGOING");
  const [editShortDescription, setEditShortDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editPincode, setEditPincode] = useState("");
  const [editStartingPrice, setEditStartingPrice] = useState("");
  const [editPricePerSqft, setEditPricePerSqft] = useState("");
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editIsActive, setEditIsActive] = useState(true);
  const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null);
  const [editBrochureFile, setEditBrochureFile] = useState<File | null>(null);
  const [editThumbnailName, setEditThumbnailName] = useState("");
  const [editBrochureName, setEditBrochureName] = useState("");
  const [updateSubmitting, setUpdateSubmitting] = useState(false);

  // Delete State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState("");
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function startEditing() {
    if (!selectedProject) return;
    setEditName(selectedProject.name);
    setEditSlug(selectedProject.slug);
    setEditProjectType(selectedProject.projectType);
    setEditProjectStatus(selectedProject.projectStatus);
    setEditShortDescription(selectedProject.shortDescription);
    setEditDescription(selectedProject.description);
    setEditLocation(selectedProject.location);
    setEditAddress(selectedProject.address);
    setEditCity(selectedProject.city);
    setEditState(selectedProject.state);
    setEditPincode(selectedProject.pincode);
    setEditStartingPrice(String(selectedProject.startingPrice));
    setEditPricePerSqft(String(selectedProject.pricePerSqft));
    setEditIsFeatured(selectedProject.isFeatured);
    setEditIsActive(selectedProject.isActive);
    setEditThumbnailFile(null);
    setEditBrochureFile(null);
    setEditThumbnailName("");
    setEditBrochureName("");
    setIsEditing(true);
  }

  async function handleUpdateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject) return;
    setUpdateSubmitting(true);
    setDetailError(null);

    try {
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("slug", editSlug);
      formData.append("projectType", editProjectType);
      formData.append("projectStatus", editProjectStatus);
      formData.append("shortDescription", editShortDescription);
      formData.append("description", editDescription);
      formData.append("location", editLocation);
      formData.append("address", editAddress);
      formData.append("city", editCity);
      formData.append("state", editState);
      formData.append("pincode", editPincode);
      formData.append("startingPrice", editStartingPrice || "0");
      formData.append("pricePerSqft", editPricePerSqft || "0");
      formData.append("isFeatured", String(editIsFeatured));
      formData.append("isActive", String(editIsActive));

      if (editThumbnailFile) {
        formData.append("thumbnailImage", editThumbnailFile);
      }
      if (editBrochureFile) {
        formData.append("brochureFile", editBrochureFile);
      }

      const updated = await updateProject(selectedProject.id, formData);
      setSelectedProject(updated);
      setIsEditing(false);
      fetchProjects(false); // Refresh list
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setDetailError(msg || "Failed to update project");
    } finally {
      setUpdateSubmitting(false);
    }
  }

  async function handleDeleteProject() {
    if (!confirmDeleteId) return;
    setDeleteSubmitting(true);
    setDeleteError(null);
    try {
      await deleteProject(confirmDeleteId);
      setConfirmDeleteId(null);
      setConfirmDeleteName("");
      // Close detail modal if the deleted project is currently open
      if (selectedProject && selectedProject.id === confirmDeleteId) {
        setSelectedProject(null);
        setDetailError(null);
        setIsEditing(false);
      }
      fetchProjects(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setDeleteError(msg || "Failed to delete project");
    } finally {
      setDeleteSubmitting(false);
    }
  }

  async function handleEditProject(idOrSlug: string) {
    try {
      setDetailLoading(true);
      setDetailError(null);
      const data = await getProjectByIdOrSlug(idOrSlug);
      setSelectedProject(data);
      setEditName(data.name || "");
      setEditSlug(data.slug || "");
      setEditProjectType(data.projectType || "APARTMENT");
      setEditProjectStatus(data.projectStatus || "UPCOMING");
      setEditShortDescription(data.shortDescription || "");
      setEditDescription(data.description || "");
      setEditLocation(data.location || "");
      setEditAddress(data.address || "");
      setEditCity(data.city || "");
      setEditState(data.state || "");
      setEditPincode(data.pincode || "");
      setEditStartingPrice(String(data.startingPrice || 0));
      setEditPricePerSqft(String(data.pricePerSqft || 0));
      setEditThumbnailFile(null);
      setEditBrochureFile(null);
      setEditThumbnailName("");
      setEditBrochureName("");
      setEditIsActive(data.isActive || false);
      setEditIsFeatured(data.isFeatured || false);
      setIsEditing(true);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setDetailError(msg || "Failed to load project details");
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleViewProject(idOrSlug: string) {
    try {
      setDetailLoading(true);
      setDetailError(null);
      const data = await getProjectByIdOrSlug(idOrSlug);
      setSelectedProject(data);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setDetailError(msg || "Failed to load project details");
    } finally {
      setDetailLoading(false);
    }
  }

  async function fetchProjects(showLoading = false) {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const data = await getProjects();
      setProjects(data);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to load projects list");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    getProjects().then(
      (data) => {
        if (active) {
          setProjects(data);
          setLoading(false);
        }
      },
      (err) => {
        if (active) {
          setError(err.message || "Failed to load projects list");
          setLoading(false);
        }
      }
    );
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-40 bg-slate-800 rounded-lg"></div>
            <div className="h-4 w-60 bg-slate-800/60 rounded-md"></div>
          </div>
          <div className="h-10 w-32 bg-slate-800 rounded-xl"></div>
        </div>
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-800/40 rounded-xl w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-[#13131a] border border-red-500/20 rounded-2xl max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-3xl mb-4">
          ⚠️
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-2">Failed to Load Projects</h3>
        <p className="text-slate-400 text-sm max-w-md mb-6">{error}</p>
        <button
          onClick={() => fetchProjects(true)}
          className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-lg text-sm font-bold transition-all duration-150 cursor-pointer shadow-lg shadow-gold-solid/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Projects Catalog
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your developments, apartments, villas, and commercial properties.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-sm font-bold transition-all duration-150 shadow-md shadow-gold-solid/15 cursor-pointer no-underline"
        >
          <span>+</span> Add Project
        </Link>
      </div>

      {/* Projects List Card */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden shadow-sm">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1e1e2e] flex items-center justify-center text-slate-400 text-3xl mb-5">
              ◈
            </div>
            <h3 className="text-base font-bold text-slate-200">No Projects Available</h3>
            <p className="text-xs text-slate-450 max-w-sm mt-1 mb-8">
              Start building your portfolio by creating your first real estate project development.
            </p>
            <Link
              href="/admin/projects/new"
              className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-xs font-bold transition-all duration-150 shadow-md shadow-gold-solid/10 no-underline"
            >
              + Create New Project
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1e1e2e] bg-[#171722]/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Type / Status</th>
                  <th className="px-6 py-4">Pricing</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Visibility</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2e]">
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-[#151520] transition-colors duration-150 text-sm text-slate-300"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {project.thumbnailUrl || project.thumbnailImage ? (
                          <img
                            src={project.thumbnailUrl || project.thumbnailImage}
                            alt={project.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-[#1e1e2e]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/20">
                            P
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-150">{project.name}</div>
                          <div className="text-[11px] text-slate-500">/{project.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-indigo-400">
                          {project.projectType}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border self-start ${
                            project.projectStatus === "COMPLETED"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                              : project.projectStatus === "ONGOING"
                              ? "bg-amber-500/10 text-amber-405 border-amber-500/25"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/25"
                          }`}
                        >
                          {project.projectStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200">
                          ₹{(project.startingPrice / 100000).toFixed(1)} Lakhs+
                        </span>
                        <span className="text-[11px] text-slate-500">
                          ₹{project.pricePerSqft}/sqft
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{project.location}</span>
                        <span className="text-[11px] text-slate-500">{project.city}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {project.isActive ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-550" title="Active"></span>
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-600" title="Inactive"></span>
                        )}
                        {project.isFeatured && (
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewProject(project.slug || project.id)}
                          className="px-3.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-455 hover:text-indigo-350 border border-indigo-500/20 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleEditProject(project.slug || project.id)}
                          className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/20 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => { setConfirmDeleteId(project.id); setConfirmDeleteName(project.name); setDeleteError(null); }}
                          className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Immersive Project Details Modal ── */}
      <Modal
        isOpen={Boolean(selectedProject || detailLoading || detailError)}
        onClose={() => { setSelectedProject(null); setDetailError(null); setIsEditing(false); }}
        maxWidth="max-w-5xl"
        title={
          selectedProject ? (
            <div className="flex items-center gap-3">
              <span>{selectedProject.name}</span>
              <span className="text-[10px] font-bold bg-gold-solid/20 text-gold-solid px-2 py-0.5 rounded border border-gold-solid/25 uppercase">
                {selectedProject.projectType}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                selectedProject.projectStatus === "COMPLETED"
                  ? "bg-emerald-500/10 text-emerald-455 border-emerald-500/25"
                  : selectedProject.projectStatus === "ONGOING"
                  ? "bg-amber-500/10 text-amber-405 border-amber-500/25"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/25"
              }`}>
                {selectedProject.projectStatus}
              </span>
            </div>
          ) : (
            "Project Details"
          )
        }
        footer={
          isEditing ? (
            <>
              <button
                type="button"
                onClick={() => { setIsEditing(false); setDetailError(null); }}
                className="px-5 py-2.5 bg-[#1c1c27] hover:bg-[#252535] text-slate-300 hover:text-slate-100 border border-[#1e1e2e] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-project-form"
                disabled={updateSubmitting}
                className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50 transition-all duration-150 shadow-md shadow-gold-solid/10"
              >
                {updateSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : selectedProject ? (
            <>
              <button
                type="button"
                onClick={() => { setConfirmDeleteId(selectedProject.id); setConfirmDeleteName(selectedProject.name); setDeleteError(null); }}
                className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150"
              >
                Delete Project
              </button>
              {/* <button
                type="button"
                onClick={startEditing}
                className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-xs font-bold cursor-pointer transition-all duration-150 shadow-md shadow-gold-solid/10"
              >
                Edit Project
              </button> */}
              <button
                type="button"
                onClick={() => { setSelectedProject(null); setDetailError(null); }}
                className="px-5 py-2.5 bg-[#1c1c27] hover:bg-[#252535] text-slate-300 hover:text-slate-100 border border-[#1e1e2e] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Close View
              </button>
            </>
          ) : null
        }
      >
              {detailLoading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <span className="animate-spin text-3xl text-indigo-500">⏳</span>
                  <p className="text-sm text-slate-405">Loading project details...</p>
                </div>
              ) : detailError ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
                  <span className="text-3xl text-red-500">⚠️</span>
                  <h4 className="text-base font-bold text-slate-100">Error Occurred</h4>
                  <p className="text-xs text-slate-400 max-w-sm">{detailError}</p>
                  <button
                    onClick={() => { setSelectedProject(null); setDetailError(null); setIsEditing(false); }}
                    className="px-4 py-2 bg-[#1c1c27] hover:bg-[#252535] text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : selectedProject ? (
                isEditing ? (
                  <form id="edit-project-form" onSubmit={handleUpdateSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Inputs */}
                    <div className="lg:col-span-6 space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Project Name</label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => {
                            setEditName(e.target.value);
                            setEditSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
                          }}
                          className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Slug (URL Keyword)</label>
                        <input
                          type="text"
                          required
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Project Type</label>
                          <select
                            value={editProjectType}
                            onChange={(e) => setEditProjectType(e.target.value as ProjectType)}
                            className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                          >
                            <option value="APARTMENT">Apartment</option>
                            <option value="VILLA">Villa</option>
                            <option value="PLOT">Plot</option>
                            <option value="COMMERCIAL">Commercial</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Project Status</label>
                          <select
                            value={editProjectStatus}
                            onChange={(e) => setEditProjectStatus(e.target.value as ProjectStatus)}
                            className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                          >
                            <option value="ONGOING">Ongoing</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="UPCOMING">Upcoming</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Starting Price (INR)</label>
                          <input
                            type="number"
                            required
                            value={editStartingPrice}
                            onChange={(e) => setEditStartingPrice(e.target.value)}
                            className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Price per Sqft (INR)</label>
                          <input
                            type="number"
                            required
                            value={editPricePerSqft}
                            onChange={(e) => setEditPricePerSqft(e.target.value)}
                            className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Location / Area</label>
                        <input
                          type="text"
                          required
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Full Address</label>
                        <input
                          type="text"
                          required
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                          className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">City</label>
                          <input
                            type="text"
                            required
                            value={editCity}
                            onChange={(e) => setEditCity(e.target.value)}
                            className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">State</label>
                          <input
                            type="text"
                            required
                            value={editState}
                            onChange={(e) => setEditState(e.target.value)}
                            className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Pincode</label>
                          <input
                            type="text"
                            required
                            value={editPincode}
                            onChange={(e) => setEditPincode(e.target.value)}
                            className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Descriptions & Files */}
                    <div className="lg:col-span-6 space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Short Description</label>
                        <input
                          type="text"
                          required
                          value={editShortDescription}
                          onChange={(e) => setEditShortDescription(e.target.value)}
                          className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Detailed Description</label>
                        <textarea
                          rows={4}
                          required
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors resize-none"
                        />
                      </div>

                      {/* File Upload fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Change Thumbnail</label>
                          <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-[#1e1e2e] hover:border-indigo-500 rounded-xl cursor-pointer bg-[#0b0b0f] hover:bg-[#13131a]/30 transition-all">
                            <span className="text-lg">🖼️</span>
                            <span className="text-[10px] text-slate-400 font-semibold truncate max-w-full px-2">
                              {editThumbnailName || "Upload Image"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setEditThumbnailFile(e.target.files[0]);
                                  setEditThumbnailName(e.target.files[0].name);
                                }
                              }}
                            />
                          </label>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Change Brochure PDF</label>
                          <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-[#1e1e2e] hover:border-indigo-500 rounded-xl cursor-pointer bg-[#0b0b0f] hover:bg-[#13131a]/30 transition-all">
                            <span className="text-lg">📄</span>
                            <span className="text-[10px] text-slate-400 font-semibold truncate max-w-full px-2">
                              {editBrochureName || "Upload PDF"}
                            </span>
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setEditBrochureFile(e.target.files[0]);
                                  setEditBrochureName(e.target.files[0].name);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Visibility Status Checks */}
                      <div className="flex gap-8 bg-[#0b0b0f] border border-[#1e1e2e] p-4 rounded-xl">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editIsFeatured}
                            onChange={(e) => setEditIsFeatured(e.target.checked)}
                            className="w-4 h-4 rounded bg-[#13131a] border border-[#1e1e2e] text-indigo-500 focus:ring-0 cursor-pointer"
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-200">Featured</span>
                            <span className="text-[9px] text-slate-500">Show on homepage</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editIsActive}
                            onChange={(e) => setEditIsActive(e.target.checked)}
                            className="w-4 h-4 rounded bg-[#13131a] border border-[#1e1e2e] text-indigo-500 focus:ring-0 cursor-pointer"
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-200">Active</span>
                            <span className="text-[9px] text-slate-555">Published to public</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column - Media & Quick Stats */}
                    <div className="lg:col-span-5 space-y-6">
                      {/* Thumbnail */}
                      {(selectedProject.thumbnailUrl || selectedProject.thumbnailImage) && (
                        <div className="rounded-xl overflow-hidden border border-[#1e1e2e] bg-[#0b0b0f] aspect-[16/10] relative shadow-sm">
                          <img
                            src={selectedProject.thumbnailUrl || selectedProject.thumbnailImage}
                            alt={selectedProject.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0b0b0f] border border-[#1e1e2e] rounded-xl p-4">
                          <span className="text-[10px] text-slate-550 block uppercase tracking-wider mb-0.5">Starting Price</span>
                          <span className="text-slate-200 font-extrabold text-sm">
                            ₹{(selectedProject.startingPrice / 100000).toFixed(1)} Lakhs+
                          </span>
                        </div>
                        <div className="bg-[#0b0b0f] border border-[#1e1e2e] rounded-xl p-4">
                          <span className="text-[10px] text-slate-550 block uppercase tracking-wider mb-0.5">Price Per Sqft</span>
                          <span className="text-slate-200 font-extrabold text-sm">
                            ₹{selectedProject.pricePerSqft}/sqft
                          </span>
                        </div>
                      </div>

                      {/* Location Card */}
                      <div className="bg-[#0b0b0f] border border-[#1e1e2e] rounded-xl p-4 space-y-3">
                        <div>
                          <span className="text-[10px] text-slate-555 block uppercase tracking-wider mb-0.5">Location Area</span>
                          <span className="text-xs text-slate-200 font-medium">{selectedProject.location}</span>
                        </div>
                        <div className="border-t border-[#1e1e2e]/50 pt-2.5">
                          <span className="text-[10px] text-slate-555 block uppercase tracking-wider mb-0.5">Full Address</span>
                          <span className="text-xs text-slate-300">{selectedProject.address}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 border-t border-[#1e1e2e]/50 pt-2.5 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-555 block uppercase tracking-wider">City</span>
                            <span className="text-slate-300">{selectedProject.city}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-555 block uppercase tracking-wider">Pincode</span>
                            <span className="text-slate-300">{selectedProject.pincode}</span>
                          </div>
                        </div>
                      </div>

                      {/* Brochure Attachment */}
                      {(selectedProject.brochureUrl || selectedProject.brochureFile) && (
                        <a
                          href={selectedProject.brochureUrl || selectedProject.brochureFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3.5 bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 hover:text-indigo-300 rounded-xl text-xs font-semibold transition-all duration-150 no-underline cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">📄</span>
                            <span>Download Project Brochure</span>
                          </div>
                          <span className="text-sm">↗</span>
                        </a>
                      )}
                    </div>

                    {/* Right Column - Descriptions & Properties */}
                    <div className="lg:col-span-7 space-y-6">
                      {/* Description Card */}
                      <div className="bg-[#0b0b0f] border border-[#1e1e2e] rounded-xl p-5 space-y-4">
                        <div>
                          <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider block mb-1">Short Description</span>
                          <p className="text-xs text-slate-350 leading-relaxed">{selectedProject.shortDescription}</p>
                        </div>
                        <div className="border-t border-[#1e1e2e]/50 pt-4">
                          <span className="text-[10px] text-slate-555 font-bold uppercase tracking-wider block mb-1">Detailed Description</span>
                          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedProject.description}</p>
                        </div>
                      </div>

                      {/* Associated Properties Grid */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Associated Properties</h4>
                        {selectedProject.properties && selectedProject.properties.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {selectedProject.properties.map((prop: ProjectProperty) => (
                              <div
                                key={prop.id}
                                className="p-4 bg-[#0b0b0f] border border-[#1e1e2e] hover:border-slate-800 rounded-xl flex flex-col justify-between gap-3 transition-colors"
                              >
                                <div>
                                  <span className="font-bold text-slate-200 block text-xs truncate">{prop.title}</span>
                                  <span className="text-[10px] text-slate-500">Type: {prop.type || "Unit"}</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border self-start ${
                                  prop.status === "ACTIVE"
                                    ? "bg-emerald-500/10 text-emerald-455 border-emerald-500/25"
                                    : "bg-slate-550/10 text-slate-400 border-slate-550/25"
                                }`}>
                                  {prop.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 border border-dashed border-[#1e1e2e] rounded-xl text-xs text-slate-500">
                            No listed properties inside this project yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              ) : null}
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-[#13131a] border border-red-500/25 rounded-2xl shadow-2xl p-7 space-y-5 z-10">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-2xl mx-auto">
              🗑️
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-slate-100">Delete Project?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <span className="text-white font-semibold">{confirmDeleteName}</span>?{" "}
                This action <span className="text-red-400 font-semibold">cannot be undone</span>.
              </p>
            </div>

            {deleteError && (
              <p className="text-xs text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                ⚠️ {deleteError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmDeleteId(null); setConfirmDeleteName(""); setDeleteError(null); }}
                disabled={deleteSubmitting}
                className="flex-1 px-4 py-2.5 bg-[#1c1c27] hover:bg-[#252535] text-slate-300 border border-[#1e1e2e] rounded-xl text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={deleteSubmitting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all duration-150 disabled:opacity-50"
              >
                {deleteSubmitting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
