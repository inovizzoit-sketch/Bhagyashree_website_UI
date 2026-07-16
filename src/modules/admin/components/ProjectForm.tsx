"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "../services/project.service";
import { ProjectType, ProjectStatus } from "../types";

export default function ProjectForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("APARTMENT");
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>("ONGOING");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [pricePerSqft, setPricePerSqft] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // File states
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [brochureFile, setBrochureFile] = useState<File | null>(null);

  // File name helper states for display
  const [thumbnailName, setThumbnailName] = useState("");
  const [brochureName, setBrochureName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    // Simple auto-slugification
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "brochure"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (type === "thumbnail") {
        setThumbnailImage(file);
        setThumbnailName(file.name);
      } else {
        setBrochureFile(file);
        setBrochureName(file.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("projectType", projectType);
      formData.append("projectStatus", projectStatus);
      formData.append("shortDescription", shortDescription);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("pincode", pincode);
      formData.append("startingPrice", startingPrice || "0");
      formData.append("pricePerSqft", pricePerSqft || "0");
      formData.append("isFeatured", String(isFeatured));
      formData.append("isActive", String(isActive));

      if (thumbnailImage) {
        formData.append("thumbnailImage", thumbnailImage);
      }
      if (brochureFile) {
        formData.append("brochureFile", brochureFile);
      }

      await createProject(formData);
      router.push("/admin/projects");
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to create project");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-12">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-3">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Basic Details Section */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="text-base font-bold text-slate-100 border-b border-[#1e1e2e] pb-3">
          1. Basic Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Nandeeka Apartments"
              value={name}
              onChange={handleNameChange}
              className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Slug (URL Keyword) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. nandeeka-apartments"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Project Type <span className="text-red-400">*</span>
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value as ProjectType)}
              className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
            >
              <option value="APARTMENT">Apartment</option>
              <option value="VILLA">Villa</option>
              <option value="PLOT">Plot</option>
              <option value="COMMERCIAL">Commercial</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Project Status <span className="text-red-400">*</span>
            </label>
            <select
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value as ProjectStatus)}
              className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
            >
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="UPCOMING">Upcoming</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing & Valuation Section */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="text-base font-bold text-slate-100 border-b border-[#1e1e2e] pb-3">
          2. Pricing & Valuation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Starting Price (INR) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 12000000"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Price per Sqft (INR) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 7500"
              value={pricePerSqft}
              onChange={(e) => setPricePerSqft(e.target.value)}
              className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="text-base font-bold text-slate-100 border-b border-[#1e1e2e] pb-3">
          3. Location Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 md:col-span-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Location / Area <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sarjapur Road"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
            />
          </div>

          <div className="space-y-2 md:col-span-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Full Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 123, Sarjapur Main Road, Near Wipro Office"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              City <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bangalore"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              State <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Karnataka"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pincode <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 560035"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Description Info */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="text-base font-bold text-slate-100 border-b border-[#1e1e2e] pb-3">
          4. Project Description
        </h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Short Description <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Brief summary of the project (e.g. Luxury 3 BHK apartments in Bangalore.)"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Full Description <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={5}
              required
              placeholder="Detailed description of the project amenities, benefits..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Media and File Uploads */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="text-base font-bold text-slate-100 border-b border-[#1e1e2e] pb-3">
          5. Media & Attachments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thumbnail */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Thumbnail Image <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-[#1e1e2e] hover:border-indigo-500 rounded-xl cursor-pointer bg-[#0b0b0f] hover:bg-[#13131a]/30 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="text-2xl mb-1 text-slate-400">🖼️</span>
                  <p className="text-xs text-slate-400 font-semibold">
                    {thumbnailName || "Click to upload thumbnail"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => handleFileChange(e, "thumbnail")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Brochure */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Brochure File (PDF)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-[#1e1e2e] hover:border-indigo-500 rounded-xl cursor-pointer bg-[#0b0b0f] hover:bg-[#13131a]/30 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="text-2xl mb-1 text-slate-400">📄</span>
                  <p className="text-xs text-slate-400 font-semibold">
                    {brochureName || "Click to upload brochure PDF"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">PDF up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, "brochure")}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Visibility Status */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="text-base font-bold text-slate-100 border-b border-[#1e1e2e] pb-3">
          6. Visibility Status
        </h3>
        <div className="flex flex-wrap gap-12">
          {/* Featured */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 rounded bg-[#0b0b0f] border border-[#1e1e2e] text-indigo-500 focus:ring-0 cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-200 group-hover:text-slate-100 transition-colors">
                Featured Project
              </span>
              <span className="text-[11px] text-slate-500">Show on homepage features listing</span>
            </div>
          </label>

          {/* Active */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 rounded bg-[#0b0b0f] border border-[#1e1e2e] text-indigo-500 focus:ring-0 cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-200 group-hover:text-slate-100 transition-colors">
                Active / Published
              </span>
              <span className="text-[11px] text-slate-500">Visible to public viewers</span>
            </div>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="px-5 py-2.5 bg-[#13131a] hover:bg-[#1c1c27] text-slate-350 hover:text-slate-200 border border-[#1e1e2e] rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-550 active:bg-indigo-750 text-white rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-650/15 flex items-center gap-2"
        >
          {submitting ? (
            <>
              <span className="animate-spin text-xs">⏳</span> Creating...
            </>
          ) : (
            "Create Project"
          )}
        </button>
      </div>
    </form>
  );
}
