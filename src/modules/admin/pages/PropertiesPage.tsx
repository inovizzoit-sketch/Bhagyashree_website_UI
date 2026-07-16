"use client";

import React, { useEffect, useState } from "react";
import { getProperties, createProperty, updateProperty, deleteProperty, Property } from "../services/property.service";
import { getProjects } from "../services/project.service";
import { Project } from "../types";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("");

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [propertyType, setPropertyType] = useState("APARTMENT");
  const [unitNumber, setUnitNumber] = useState("");
  const [areaSqft, setAreaSqft] = useState("");
  const [price, setPrice] = useState("");
  const [facing, setFacing] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [balconies, setBalconies] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [isActive, setIsActive] = useState(true);

  // File Upload State
  const [propertyImageFile, setPropertyImageFile] = useState<File | null>(null);
  const [propertyImageName, setPropertyImageName] = useState("");

  async function fetchPropertiesList(projId?: string) {
    try {
      setLoading(true);
      setError(null);
      const data = await getProperties(projId);
      setProperties(data);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to load properties list");
    } finally {
      setLoading(false);
    }
  }



  useEffect(() => {
    let active = true;
    Promise.all([getProperties(), getProjects()]).then(
      ([propsData, projsData]) => {
        if (active) {
          setProperties(propsData);
          setProjects(projsData);
          setLoading(false);
        }
      },
      (err) => {
        if (active) {
          setError(err.message || "Failed to initialize page data");
          setLoading(false);
        }
      }
    );
    return () => {
      active = false;
    };
  }, []);

  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setSelectedProjectFilter(val);
    fetchPropertiesList(val);
  }

  function openCreateModal() {
    setModalMode("create");
    setSelectedPropertyId(null);
    setModalError(null);
    setTitle("");
    setProjectId(projects[0]?.id || "");
    setPropertyType("APARTMENT");
    setUnitNumber("");
    setAreaSqft("");
    setPrice("");
    setFacing("");
    setBedrooms("");
    setBathrooms("");
    setBalconies("");
    setFloorNumber("");
    setStatus("AVAILABLE");
    setIsActive(true);
    setPropertyImageFile(null);
    setPropertyImageName("");
    setIsModalOpen(true);
  }

  function openEditModal(prop: Property) {
    setModalMode("edit");
    setSelectedPropertyId(prop.id);
    setModalError(null);
    setTitle(prop.title);
    setProjectId(prop.projectId || "");
    setPropertyType(prop.propertyType || "APARTMENT");
    setUnitNumber(prop.unitNumber || "");
    setAreaSqft(prop.areaSqft ? String(prop.areaSqft) : "");
    setPrice(prop.price ? String(prop.price) : "");
    setFacing(prop.facing || "");
    setBedrooms(prop.bedrooms ? String(prop.bedrooms) : "");
    setBathrooms(prop.bathrooms ? String(prop.bathrooms) : "");
    setBalconies(prop.balconies ? String(prop.balconies) : "");
    setFloorNumber(prop.floorNumber ? String(prop.floorNumber) : "");
    setStatus(prop.status || "AVAILABLE");
    setIsActive(prop.isActive);
    setPropertyImageFile(null);
    setPropertyImageName("");
    setIsModalOpen(true);
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setModalSubmitting(true);
    setModalError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("projectId", projectId);
      formData.append("propertyType", propertyType);
      formData.append("unitNumber", unitNumber);
      formData.append("status", status);
      formData.append("isActive", String(isActive));

      if (areaSqft) formData.append("areaSqft", areaSqft);
      if (price) formData.append("price", price);
      if (facing) formData.append("facing", facing);
      if (bedrooms) formData.append("bedrooms", bedrooms);
      if (bathrooms) formData.append("bathrooms", bathrooms);
      if (balconies) formData.append("balconies", balconies);
      if (floorNumber) formData.append("floorNumber", floorNumber);

      if (propertyImageFile) {
        formData.append("propertyImage", propertyImageFile);
      }

      if (modalMode === "create") {
        await createProperty(formData);
      } else if (selectedPropertyId) {
        await updateProperty(selectedPropertyId, formData);
      }

      setIsModalOpen(false);
      fetchPropertiesList(selectedProjectFilter);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setModalError(msg || "Something went wrong while saving property details");
    } finally {
      setModalSubmitting(false);
    }
  }

  async function handleDeleteProperty(id: string) {
    if (!window.confirm("Are you sure you want to delete this property listing permanently?")) return;
    try {
      await deleteProperty(id);
      fetchPropertiesList(selectedProjectFilter);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(msg || "Failed to delete property listing");
    }
  }

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
        <h3 className="text-lg font-bold text-slate-100 mb-2">Failed to Load Properties</h3>
        <p className="text-slate-400 text-sm max-w-md mb-6">{error}</p>
        <button
          onClick={() => fetchPropertiesList(selectedProjectFilter)}
          className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-550 active:bg-indigo-755 text-white rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer shadow-lg shadow-indigo-650/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Properties Inventory
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage individual units, plots, villa layouts, and sales visibility status.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-650 hover:bg-indigo-550 active:bg-indigo-755 text-white rounded-xl text-sm font-semibold transition-all duration-150 shadow-md shadow-indigo-655/15 cursor-pointer no-underline self-start md:self-auto"
        >
          <span>+</span> Add Property
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-4 bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-4">
        <div className="flex flex-col gap-1 w-full max-w-xs">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Filter by Project</label>
          <select
            value={selectedProjectFilter}
            onChange={handleFilterChange}
            className="bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-200 text-xs outline-none transition-colors"
          >
            <option value="">All Projects</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Properties List table */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden shadow-sm">
        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1e1e2e] flex items-center justify-center text-slate-400 text-3xl mb-5">
              ⌂
            </div>
            <h3 className="text-base font-bold text-slate-200">No Properties Found</h3>
            <p className="text-xs text-slate-450 max-w-sm mt-1 mb-8">
              Start setting up units or plots for your developments to display them in listings.
            </p>
            <button
              onClick={openCreateModal}
              className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-550 active:bg-indigo-755 text-white rounded-xl text-xs font-semibold transition-all duration-150 shadow-md shadow-indigo-650/10"
            >
              + Add Property Unit
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1e1e2e] bg-[#171722]/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Type / Unit</th>
                  <th className="px-6 py-4">Pricing</th>
                  <th className="px-6 py-4">Area / Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2e]">
                {properties.map((prop) => (
                  <tr
                    key={prop.id}
                    className="hover:bg-[#151520] transition-colors duration-150 text-sm text-slate-300"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {prop.propertyImage ? (
                          <img
                            src={prop.propertyImage}
                            alt={prop.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-[#1e1e2e]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/20 text-xs">
                            H
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-150">{prop.title}</div>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${
                            prop.isActive
                              ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20"
                              : "bg-slate-700/15 text-slate-400 border-slate-700/20"
                          }`}>
                            {prop.isActive ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-200">
                        {prop.project?.name || "Unassigned"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-indigo-400 uppercase">
                          {prop.propertyType}
                        </span>
                        <span className="text-[11px] text-slate-500">Unit: {prop.unitNumber || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-200">
                        {prop.price ? `₹${(prop.price / 100000).toFixed(1)} Lakhs` : "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-350">
                      <div className="flex flex-col gap-0.5">
                        <span>{prop.areaSqft ? `${prop.areaSqft} sqft` : "N/A"}</span>
                        <span className="text-slate-500 text-[10px]">
                          {prop.bedrooms || 0}BHK • Facing: {prop.facing || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${
                        prop.status === "AVAILABLE"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                          : prop.status === "SOLD"
                          ? "bg-red-500/10 text-red-400 border-red-500/25"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/25"
                      }`}>
                        {prop.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2.5">
                        <button
                          onClick={() => openEditModal(prop)}
                          className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-450 hover:text-indigo-350 border border-indigo-500/20 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(prop.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-305 border border-red-500/20 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer"
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

      {/* ── Immersive Property Modal (Create / Edit) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 md:p-6 transition-all duration-300">
          {/* Backdrop Closer */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

          {/* Modal Container */}
          <div className="relative w-full max-w-4xl bg-[#13131a] border border-[#1e1e2e] h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden z-10 animate-fade-in text-slate-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e2e] bg-[#171722]/50">
              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  {modalMode === "create" ? "Add New Property Listing" : "Edit Property Listing"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Setup unit configurations, layout stats, and images.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#1c1c27] border border-[#1e1e2e] text-slate-400 hover:text-slate-200 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Content */}
            <form id="property-modal-form" onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Core fields */}
              <div className="lg:col-span-6 space-y-5">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Property Title / Unit Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Premium Villa Plot 12"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Associated Project</label>
                  <select
                    required
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                  >
                    <option value="" disabled>Select Associated Project</option>
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Property Type</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                    >
                      <option value="APARTMENT">Apartment</option>
                      <option value="VILLA">Villa</option>
                      <option value="PLOT">Plot</option>
                      <option value="COMMERCIAL">Commercial</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Unit / Door Number</label>
                    <input
                      type="text"
                      placeholder="e.g. P-12"
                      value={unitNumber}
                      onChange={(e) => setUnitNumber(e.target.value)}
                      className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Area (Sqft)</label>
                    <input
                      type="number"
                      placeholder="e.g. 2400"
                      value={areaSqft}
                      onChange={(e) => setAreaSqft(e.target.value)}
                      className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Price (INR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4500000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column: Floor Details & Uploads */}
              <div className="lg:col-span-6 space-y-5">
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Bedrooms</label>
                    <input
                      type="number"
                      placeholder="e.g. 3"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Bathrooms</label>
                    <input
                      type="number"
                      placeholder="e.g. 3"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Balconies</label>
                    <input
                      type="number"
                      placeholder="e.g. 2"
                      value={balconies}
                      onChange={(e) => setBalconies(e.target.value)}
                      className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Facing Direction</label>
                    <input
                      type="text"
                      placeholder="e.g. East"
                      value={facing}
                      onChange={(e) => setFacing(e.target.value)}
                      className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Floor Number</label>
                    <input
                      type="number"
                      placeholder="e.g. 1"
                      value={floorNumber}
                      onChange={(e) => setFloorNumber(e.target.value)}
                      className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-150 text-xs outline-none transition-colors"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="SOLD">Sold</option>
                      <option value="RESERVED">Reserved</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Property Image</label>
                    <label className="flex flex-col items-center justify-center w-full h-10 border border-dashed border-[#1e1e2e] hover:border-indigo-500 rounded-lg cursor-pointer bg-[#0b0b0f] hover:bg-[#13131a]/30 transition-all">
                      <span className="text-[10px] text-slate-400 font-semibold truncate max-w-full px-2">
                        {propertyImageName || "Click to upload image"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setPropertyImageFile(e.target.files[0]);
                            setPropertyImageName(e.target.files[0].name);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-[#0b0b0f] border border-[#1e1e2e] p-4 rounded-xl">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#13131a] border border-[#1e1e2e] text-indigo-500 focus:ring-0 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-200">Active / Published</span>
                      <span className="text-[9px] text-slate-555">Make this unit listing visible to site visitors</span>
                    </div>
                  </label>
                </div>

              </div>

            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#1e1e2e] bg-[#171722]/30 flex justify-between items-center">
              <div>
                {modalError && (
                  <span className="text-xs text-red-400">⚠️ {modalError}</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-[#1c1c27] hover:bg-[#252535] text-slate-300 hover:text-slate-100 border border-[#1e1e2e] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="property-modal-form"
                  disabled={modalSubmitting}
                  className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-550 active:bg-indigo-750 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50 transition-all duration-150 shadow-md shadow-indigo-650/10"
                >
                  {modalSubmitting ? "Saving..." : "Save Property"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
