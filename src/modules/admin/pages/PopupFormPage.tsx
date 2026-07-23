"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPopup, updatePopup, getPopupById } from "../services/popup.service";
import { API_BASE_URL } from "@/shared/lib/api-config";

interface PopupFormPageProps {
  id?: string;
}

export default function PopupFormPage({ id }: PopupFormPageProps) {
  const router = useRouter();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [popupType, setPopupType] = useState("ANNOUNCEMENT");
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [triggerType, setTriggerType] = useState("ON_PAGE_LOAD");
  const [showAfterSeconds, setShowAfterSeconds] = useState(0);
  const [frequency, setFrequency] = useState("ONCE");
  const [priority, setPriority] = useState(0);
  const [deviceType, setDeviceType] = useState("ALL");
  const [targetType, setTargetType] = useState("ALL_PAGES");
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [availablePages, setAvailablePages] = useState<{ name: string; pathname: string }[]>([
    { name: "Home (/) - /", pathname: "/" },
    { name: "About Us (/about-us) - /about-us", pathname: "/about-us" },
    { name: "Amenities (/amenities) - /amenities", pathname: "/amenities" },
    { name: "Blogs (/blogs) - /blogs", pathname: "/blogs" },
    { name: "Decoding Land (/decoding-land) - /decoding-land", pathname: "/decoding-land" },
    { name: "Gallery (/gallery) - /gallery", pathname: "/gallery" },
    { name: "Governance (/governance) - /governance", pathname: "/governance" },
    { name: "Projects (/projects) - /projects", pathname: "/projects" },
    { name: "Contact (/contact) - /contact", pathname: "/contact" },
  ]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Fetch available website pages dynamically from the CMS
  useEffect(() => {
    Promise.allSettled([
      fetch(`${API_BASE_URL}/projects`).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_BASE_URL}/blog`).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_BASE_URL}/gallery/category?status=true`).then((r) => (r.ok ? r.json() : [])),
    ]).then(([projectsRes, blogsRes, galleryRes]) => {
      const dynamicPages: { name: string; pathname: string }[] = [];

      if (projectsRes.status === "fulfilled" && Array.isArray(projectsRes.value)) {
        projectsRes.value.forEach((proj: any) => {
          if (proj.slug) {
            dynamicPages.push({
              name: `Project: ${proj.name} (/projects/${proj.slug})`,
              pathname: `/projects/${proj.slug}`,
            });
          }
        });
      }

      if (blogsRes.status === "fulfilled" && Array.isArray(blogsRes.value)) {
        blogsRes.value.forEach((blog: any) => {
          if (blog.slug) {
            dynamicPages.push({
              name: `Blog: ${blog.title} (/blogs/${blog.slug})`,
              pathname: `/blogs/${blog.slug}`,
            });
          }
        });
      }

      if (galleryRes.status === "fulfilled" && Array.isArray(galleryRes.value)) {
        galleryRes.value.forEach((cat: any) => {
          if (cat.slug) {
            dynamicPages.push({
              name: `Gallery Category: ${cat.name} (/gallery/${cat.slug})`,
              pathname: `/gallery/${cat.slug}`,
            });
          }
        });
      }

      setAvailablePages((prev) => {
        const staticOnly = prev.filter(
          (p) =>
            !p.pathname.startsWith("/projects/") &&
            !p.pathname.startsWith("/blogs/") &&
            !p.pathname.startsWith("/gallery/")
        );
        return [...staticOnly, ...dynamicPages];
      });
    });
  }, []);

  // Clear selected pages automatically if Target Type is All Pages
  useEffect(() => {
    if (targetType === "ALL_PAGES") {
      setSelectedPages([]);
    }
  }, [targetType]);

  useEffect(() => {
    if (isEdit && id) {
      getPopupById(id)
        .then((popup) => {
          setTitle(popup.title);
          setSlug(popup.slug);
          setPopupType(popup.popupType);
          setHeading(popup.heading || "");
          setSubHeading(popup.subHeading || "");
          setDescription(popup.description || "");
          if (popup.image) {
            setImagePreview(popup.image);
          }
          setVideoUrl(popup.videoUrl || "");
          setButtonText(popup.buttonText || "");
          setButtonLink(popup.buttonLink || "");
          setHtmlContent(popup.htmlContent || "");
          setTriggerType(popup.triggerType);
          setShowAfterSeconds(popup.showAfterSeconds || 0);
          setFrequency(popup.frequency);
          setPriority(popup.priority || 0);
          setDeviceType(popup.deviceType);
          setTargetType(popup.targetType);
          setSelectedPages(popup.targetPages || []);
          setStartDate(popup.startDate ? popup.startDate.split("T")[0] : "");
          setEndDate(popup.endDate ? popup.endDate.split("T")[0] : "");
          setIsActive(popup.isActive);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message || "Failed to load popup details.");
          setLoading(false);
        });
    }
  }, [id, isEdit]);

  // Auto-generate slug from title
  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTitle(value);
    if (!isEdit) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError("Title and Slug are required.");
      return;
    }

    if (targetType === "SPECIFIC_PAGES" && selectedPages.length === 0) {
      setError("Please select at least one target page.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("popupType", popupType);
      formData.append("heading", heading);
      formData.append("subHeading", subHeading);
      formData.append("description", description);
      
      if (imageFile) {
        formData.append("image", imageFile);
      }
      formData.append("videoUrl", videoUrl);
      formData.append("buttonText", buttonText);
      formData.append("buttonLink", buttonLink);
      formData.append("htmlContent", htmlContent);
      formData.append("triggerType", triggerType);
      formData.append("showAfterSeconds", String(showAfterSeconds));
      formData.append("frequency", frequency);
      formData.append("priority", String(priority));
      formData.append("deviceType", deviceType);
      formData.append("targetType", targetType);
      
      formData.append("targetPages", JSON.stringify(selectedPages));

      if (startDate) {
        formData.append("startDate", new Date(startDate).toISOString());
      }
      if (endDate) {
        formData.append("endDate", new Date(endDate).toISOString());
      }
      formData.append("isActive", String(isActive));

      if (isEdit && id) {
        await updatePopup(id, formData);
      } else {
        await createPopup(formData);
      }

      router.push("/admin/popup");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save popup campaign.");
    } finally {
      setSubmitting(false);
    }
  }

  const filteredPages = availablePages.filter(
    (page) =>
      page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.pathname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-450 mt-4">Loading form details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            {isEdit ? "Edit Popup Campaign" : "New Popup Campaign"}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure display options, scheduling rules, triggers, and content layouts.
          </p>
        </div>
        <Link
          href="/admin/popup"
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors bg-transparent border-none outline-none no-underline"
        >
          Cancel & Return
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 sm:p-8">
        
        {/* Core Config Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-indigo-400 border-b border-[#1e1e2e] pb-2">1. Campaign Configuration</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-350">Campaign Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Summer Sale Announcement"
                className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-350">Campaign URL Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="summer-sale-announcement"
                className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-350">Popup Type</label>
              <select
                value={popupType}
                onChange={(e) => setPopupType(e.target.value)}
                className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200"
              >
                <option value="ANNOUNCEMENT">Announcement</option>
                <option value="PROMOTION">Promotion / Banner</option>
                <option value="NEWSLETTER">Newsletter Signup</option>
                <option value="LEAD_FORM">Lead Capture Form</option>
                <option value="IMAGE_POPUP">Image Showcase</option>
                <option value="VIDEO_POPUP">Video Player</option>
                <option value="CUSTOM_HTML">Custom HTML Code</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-350">Priority Level</label>
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)}
                className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Content Section based on type */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-semibold text-indigo-400 border-b border-[#1e1e2e] pb-2">2. Visual & Copywriting Content</h3>
          
          {popupType !== "CUSTOM_HTML" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-350">Main Heading</label>
                <input
                  type="text"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="e.g. Mega Sale Up to 40% Off!"
                  className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-350">Sub Heading</label>
                <input
                  type="text"
                  value={subHeading}
                  onChange={(e) => setSubHeading(e.target.value)}
                  placeholder="Limited time inventory only."
                  className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-350">Description Content</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your offer or notification here..."
                  className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200 resize-y"
                />
              </div>
            </div>
          )}

          {/* Conditional image file input */}
          {(popupType === "IMAGE_POPUP" || popupType === "PROMOTION" || popupType === "ANNOUNCEMENT") && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-350">Upload Banner Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setImageFile(e.target.files[0]);
                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="text-sm text-slate-400"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview Banner"
                  className="mt-2 h-32 w-auto object-cover rounded-lg border border-[#1e1e2e]"
                />
              )}
            </div>
          )}

          {/* Conditional video url input */}
          {popupType === "VIDEO_POPUP" && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-350">Video Embed URL (YouTube/Vimeo/S3 link)</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200"
              />
            </div>
          )}

          {/* HTML content */}
          {popupType === "CUSTOM_HTML" && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-350">Custom HTML Code</label>
              <textarea
                rows={8}
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="<div style='color: red;'>Hello World</div>"
                className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm font-mono text-indigo-200 resize-y"
              />
            </div>
          )}

          {/* Call to action buttons */}
          {popupType !== "CUSTOM_HTML" && popupType !== "LEAD_FORM" && popupType !== "NEWSLETTER" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-350">Button Label</label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="e.g. Learn More"
                  className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-350">Button Action Link</label>
                <input
                  type="text"
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                  placeholder="https://mysite.com/deals"
                  className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Triggers, Limits & Scheduling Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-semibold text-indigo-400 border-b border-[#1e1e2e] pb-2">3. Triggers & Behavioral Rules</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-350">Activation Trigger</label>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value)}
                className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200"
              >
                <option value="ON_PAGE_LOAD">On Page Load</option>
                <option value="AFTER_X_SECONDS">After Delay (Seconds)</option>
                <option value="ON_SCROLL">On Scroll Depth</option>
                <option value="EXIT_INTENT">Exit Intent (Mouse Leave)</option>
                <option value="ON_BUTTON_CLICK">On Button Click</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-350">Delay Duration (Seconds)</label>
              <input
                type="number"
                value={showAfterSeconds}
                onChange={(e) => setShowAfterSeconds(parseInt(e.target.value, 10) || 0)}
                className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-350">Display Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200"
              >
                <option value="ONCE">Once per user</option>
                <option value="EVERY_SESSION">Once per session</option>
                <option value="ONCE_A_DAY">Once per day</option>
                <option value="ALWAYS">Always display</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-350">Device Compatibility</label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200"
              >
                <option value="ALL">All Devices</option>
                <option value="DESKTOP">Desktop Only</option>
                <option value="MOBILE">Mobile Only</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-350">Target Pages Setting</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200"
              >
                <option value="ALL_PAGES">Global (All Pages)</option>
                <option value="SPECIFIC_PAGES">Specific Pages Only</option>
              </select>
            </div>

            {targetType === "SPECIFIC_PAGES" && (
              <div className="flex flex-col gap-2 sm:col-span-2 relative">
                <label className="text-xs font-semibold text-slate-350">Target Pages *</label>
                
                {/* Search / Dropdown Toggle Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200 flex items-center justify-between cursor-pointer text-left"
                  >
                    <span className="text-slate-400">
                      {selectedPages.length === 0 ? "Select pages..." : `${selectedPages.length} pages selected`}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className={`w-4 h-4 text-slate-450 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute left-0 right-0 mt-2 bg-[#171721] border border-[#1e1e2e] rounded-xl shadow-2xl z-30 max-h-80 flex flex-col overflow-hidden">
                      {/* Search Bar */}
                      <div className="p-3 border-b border-[#1e1e2e]">
                        <input
                          type="text"
                          placeholder="Search pages..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-[#101017] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-3 py-2 text-xs text-slate-200"
                        />
                      </div>
                      
                      {/* Options List */}
                      <div className="overflow-y-auto flex-1 max-h-56 p-2 space-y-1">
                        {filteredPages.length === 0 ? (
                          <div className="text-xs text-slate-500 text-center py-4">No pages found.</div>
                        ) : (
                          filteredPages.map((pageOpt) => {
                            const isChecked = selectedPages.includes(pageOpt.pathname);
                            return (
                              <label
                                key={pageOpt.pathname}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer text-xs text-slate-350 transition-colors select-none"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    if (isChecked) {
                                      setSelectedPages(selectedPages.filter((p) => p !== pageOpt.pathname));
                                    } else {
                                      setSelectedPages([...selectedPages, pageOpt.pathname]);
                                    }
                                  }}
                                  className="w-4 h-4 rounded text-indigo-500 bg-[#101017] border-[#1e1e2e] focus:ring-indigo-500"
                                />
                                <span className="flex-1 truncate">{pageOpt.name}</span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Removable Chips */}
                {selectedPages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedPages.map((pathname) => {
                      const foundPage = availablePages.find((p) => p.pathname === pathname);
                      const displayName = foundPage ? foundPage.name.split(" (")[0] : pathname;
                      return (
                        <div
                          key={pathname}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/35 text-indigo-300 text-xs font-semibold"
                        >
                          <span className="truncate max-w-[200px]">{displayName}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedPages(selectedPages.filter((p) => p !== pathname))}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-indigo-500/20 text-indigo-400 hover:text-white transition-colors cursor-pointer border-none text-[10px]"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scheduling Details */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-semibold text-indigo-400 border-b border-[#1e1e2e] pb-2">4. Date Ranges & Visibility</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-350">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-350">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-[#171721] border border-[#1e1e2e] focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-200"
              />
            </div>

            <div className="flex items-center gap-3 sm:col-span-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-500 bg-[#171721] border-[#1e1e2e] focus:ring-indigo-500"
              />
              <label htmlFor="isActive" className="text-sm font-semibold text-slate-200 cursor-pointer">
                Campaign is Active (Check to enable on client side instantly)
              </label>
            </div>
          </div>
        </div>

        {/* Actions Submit */}
        <div className="border-t border-[#1e1e2e] pt-6 flex items-center justify-end gap-4">
          <Link
            href="/admin/popup"
            className="no-underline px-5 py-2.5 bg-transparent text-slate-400 hover:text-slate-200 transition-colors text-sm font-semibold cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-slate-500 text-white rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer border-none shadow-md"
          >
            {submitting ? "Saving..." : isEdit ? "Update Campaign" : "Publish Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
}
