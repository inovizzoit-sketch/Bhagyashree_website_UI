"use client";

import React, { useState, useEffect } from "react";
import Hero from "@/modules/web/components/Hero";
import { API_BASE_URL } from "@/shared/lib/api-config";

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states for creating/editing slide
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null); // null means "Create mode"
  const [title, setTitle] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [headingLine1, setHeadingLine1] = useState("");
  const [headingLine2, setHeadingLine2] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState("IMAGE");
  const [mediaUrl, setMediaUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [layoutType, setLayoutType] = useState("LEFT_CONTENT");

  // Styling overrides
  const [backgroundColor, setBackgroundColor] = useState("");
  const [bgGradient, setBgGradient] = useState("");
  const [textColor, setTextColor] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [overlayColor, setOverlayColor] = useState("#000000");
  const [overlayOpacity, setOverlayOpacity] = useState(0.4);

  // Lists configurations
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  const [ctaButtons, setCtaButtons] = useState<any[]>([]);
  const [btnText, setBtnText] = useState("");
  const [btnUrl, setBtnUrl] = useState("");
  const [btnStyle, setBtnStyle] = useState("PRIMARY");
  const [btnNewTab, setBtnNewTab] = useState(false);

  const [statistics, setStatistics] = useState<any[]>([]);
  const [statNumber, setStatNumber] = useState("");
  const [statSuffix, setStatSuffix] = useState("");
  const [statTitle, setStatTitle] = useState("");

  const [isActive, setIsActive] = useState(true);

  // Fetch all slides on load
  const loadSlides = () => {
    setFetching(true);
    const token = localStorage.getItem("admin_token");
    fetch(`${API_BASE_URL}/hero/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSlides(data);
        }
      })
      .catch((err) => console.error("Failed to load slides", err))
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const resetForm = () => {
    setEditingSlideId(null);
    setTitle("New Slide");
    setBadgeText("Ganges Waterfront Plots");
    setHeadingLine1("Kashi");
    setHeadingLine2("has Chosen You");
    setDescription("Own premium gated villa land plots on the banks of Ganga...");
    setMediaType("IMAGE");
    setMediaUrl("z4SA0ciEoO8");
    setAltText("");
    setLayoutType("LEFT_CONTENT");
    setBackgroundColor("");
    setBgGradient("");
    setTextColor("");
    setAccentColor("");
    setOverlayColor("#000000");
    setOverlayOpacity(0.4);
    setFeatures([]);
    setFeatureInput("");
    setCtaButtons([
      { text: "Enquire Now", url: "", openInNewTab: false, style: "PRIMARY" },
      { text: "View Projects →", url: "/projects", openInNewTab: false, style: "SECONDARY" }
    ]);
    setStatistics([
      { number: "500", suffix: "+", title: "Projects" },
      { number: "10", suffix: "K+", title: "Customers" }
    ]);
    setIsActive(true);
  };

  const handleEditClick = (slide: any) => {
    setEditingSlideId(slide.id);
    setTitle(slide.title || "");
    setBadgeText(slide.badgeText || "");
    
    const parts = (slide.heading || "").split("\n");
    setHeadingLine1(parts[0] || "");
    setHeadingLine2(parts[1] || "");
    
    setDescription(slide.description || "");
    setMediaType(slide.mediaType || "IMAGE");
    setMediaUrl(slide.mediaUrl || "");
    setAltText(slide.altText || "");
    setLayoutType(slide.layoutType || "LEFT_CONTENT");
    setBackgroundColor(slide.backgroundColor || "");
    setBgGradient(slide.bgGradient || "");
    setTextColor(slide.textColor || "");
    setAccentColor(slide.accentColor || "");
    setOverlayColor(slide.overlayColor || "#000000");
    setOverlayOpacity(slide.overlayOpacity ?? 0.4);
    setFeatures(slide.features || []);
    setIsActive(slide.isActive !== undefined ? slide.isActive : true);

    try {
      setCtaButtons(slide.ctaButtons ? JSON.parse(slide.ctaButtons) : []);
    } catch (e) {
      setCtaButtons([]);
    }

    try {
      setStatistics(slide.statistics ? JSON.parse(slide.statistics) : []);
    } catch (e) {
      setStatistics([]);
    }
  };

  const handleDuplicate = async (slide: any) => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_BASE_URL}/hero`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...slide,
          id: undefined,
          title: `${slide.title} (Copy)`,
          displayOrder: slide.displayOrder + 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to duplicate slide");
      loadSlides();
      setMessage({ type: "success", text: "Slide duplicated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_BASE_URL}/hero/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete slide");
      loadSlides();
      setMessage({ type: "success", text: "Slide deleted successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newSlides = [...slides];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSlides.length) return;

    // Swap
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIdx];
    newSlides[targetIdx] = temp;

    setSlides(newSlides);

    // Save ordering to backend
    const token = localStorage.getItem("admin_token");
    try {
      await fetch(`${API_BASE_URL}/hero/reorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: newSlides.map((s) => s.id) }),
      });
    } catch (err) {
      console.error("Failed to save slide ordering", err);
    }
  };

  // List helpers
  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const addCta = () => {
    if (btnText.trim()) {
      setCtaButtons([...ctaButtons, { text: btnText.trim(), url: btnUrl.trim(), openInNewTab: btnNewTab, style: btnStyle }]);
      setBtnText("");
      setBtnUrl("");
    }
  };

  const removeCta = (idx: number) => {
    setCtaButtons(ctaButtons.filter((_, i) => i !== idx));
  };

  const addStat = () => {
    if (statNumber.trim() && statTitle.trim()) {
      setStatistics([...statistics, { number: statNumber.trim(), suffix: statSuffix.trim(), title: statTitle.trim() }]);
      setStatNumber("");
      setStatSuffix("");
      setStatTitle("");
    }
  };

  const removeStat = (idx: number) => {
    setStatistics(statistics.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const slidePayload = {
      title,
      badgeText,
      heading: headingLine1 + "\n" + headingLine2,
      description,
      mediaType,
      mediaUrl,
      altText,
      layoutType,
      backgroundColor,
      bgGradient,
      overlayColor,
      overlayOpacity: Number(overlayOpacity),
      textColor,
      accentColor,
      features,
      ctaButtons: JSON.stringify(ctaButtons),
      statistics: JSON.stringify(statistics),
      isActive,
    };

    const token = localStorage.getItem("admin_token");
    try {
      const url = editingSlideId ? `${API_BASE_URL}/hero/${editingSlideId}` : `${API_BASE_URL}/hero`;
      const method = editingSlideId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(slidePayload),
      });

      if (!res.ok) throw new Error("Failed to save slide configurations");

      setMessage({ type: "success", text: "Slide saved successfully!" });
      resetForm();
      loadSlides();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const previewObject = {
    title,
    badgeText,
    heading: headingLine1 + "\n" + headingLine2,
    description,
    mediaType,
    mediaUrl,
    altText,
    layoutType,
    backgroundColor,
    bgGradient,
    overlayColor,
    overlayOpacity: Number(overlayOpacity),
    textColor,
    accentColor,
    features,
    ctaButtons: JSON.stringify(ctaButtons),
    statistics: JSON.stringify(statistics),
    isActive: true,
  };

  if (fetching) {
    return <div className="flex h-[80vh] items-center justify-center text-slate-400">Loading configurations...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 bg-[#0f0f14] text-slate-200">
      <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Hero Slider Management</h1>
          <p className="text-xs text-slate-400">Create, edit, reorder, and override templates layouts for your landing fold slider.</p>
        </div>
        <button
          onClick={resetForm}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg text-xxs transition cursor-pointer"
        >
          + Add New Slide
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg text-sm border ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* List Grid */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#1e1e2e] bg-[#171722] font-semibold text-xs tracking-wider text-slate-400 uppercase">
          Slide Entries ({slides.length})
        </div>
        <div className="divide-y divide-[#1e1e2e]">
          {slides.map((slide, idx) => (
            <div key={slide.id} className="p-4 flex items-center justify-between hover:bg-[#171722] transition">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{slide.title}</span>
                  <span className="text-xxs uppercase tracking-wider bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    {slide.layoutType}
                  </span>
                  {!slide.isActive && (
                    <span className="text-xxs uppercase bg-red-950 text-red-400 border border-red-900 px-2 rounded">
                      Disabled
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 leading-relaxed font-light">{slide.heading.replace("\n", " ")}</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, "up")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 w-8 h-8 rounded flex items-center justify-center disabled:opacity-30 cursor-pointer"
                >
                  ▲
                </button>
                <button
                  disabled={idx === slides.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 w-8 h-8 rounded flex items-center justify-center disabled:opacity-30 cursor-pointer"
                >
                  ▼
                </button>
                <button
                  onClick={() => handleEditClick(slide)}
                  className="bg-indigo-900/60 hover:bg-indigo-900 border border-indigo-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDuplicate(slide)}
                  className="bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded cursor-pointer"
                >
                  Copy
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="bg-red-900/60 hover:bg-red-900 border border-red-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Block */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8">
        <form onSubmit={handleSubmit} className="bg-[#13131a] p-6 rounded-2xl border border-[#1e1e2e] space-y-6">
          <h3 className="text-md font-bold text-white border-b border-[#1e1e2e] pb-3">
            {editingSlideId ? `Edit Slide: ${title}` : "Create Slide Settings"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Slide Internal Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Slider title reference"
                className="w-full bg-[#1b1b26] border border-[#2e2e3f] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Badge Tagline</label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="Ganges Waterfront Plots"
                className="w-full bg-[#1b1b26] border border-[#2e2e3f] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Layout Template</label>
              <select
                value={layoutType}
                onChange={(e) => setLayoutType(e.target.value)}
                className="w-full bg-[#1b1b26] border border-[#2e2e3f] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="LEFT_CONTENT">Layout 1: Left Content + Right Media</option>
                <option value="RIGHT_CONTENT">Layout 2: Right Content + Left Media</option>
                <option value="CENTER">Layout 3: Centered Content</option>
                <option value="FULL_WIDTH">Layout 4: Full Width Background Banner</option>
                <option value="STATS">Layout 5: Stats counters next to Content</option>
                <option value="FORM">Layout 6: Lead Inquiry form next to Content</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Media Type</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full bg-[#1b1b26] border border-[#2e2e3f] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="IMAGE">Image file</option>
                <option value="VIDEO">YouTube Video ID</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Media Filename / Video ID
              </label>
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="z4SA0ciEoO8 or image.jpg"
                className="w-full bg-[#1b1b26] border border-[#2e2e3f] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Image Alt Text</label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Varanasi plots aerial view"
                className="w-full bg-[#1b1b26] border border-[#2e2e3f] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="sm:col-span-2 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Headline Line 1 (Plain Text)
                </label>
                <input
                  type="text"
                  value={headingLine1}
                  onChange={(e) => setHeadingLine1(e.target.value)}
                  placeholder="Kashi"
                  className="w-full bg-[#1b1b26] border border-[#2e2e3f] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Headline Line 2 (Italic Gold Highlighted)
                </label>
                <input
                  type="text"
                  value={headingLine2}
                  onChange={(e) => setHeadingLine2(e.target.value)}
                  placeholder="has Chosen You"
                  className="w-full bg-[#1b1b26] border border-[#2e2e3f] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition font-serif italic text-gold-solid"
                />
              </div>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Description Subtext</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Own premium gated villa land plots..."
                className="w-full bg-[#1b1b26] border border-[#2e2e3f] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* CTA Buttons Lists */}
          <div className="border-t border-[#1e1e2e] pt-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">CTA Buttons</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end bg-[#171722] p-4 rounded-xl">
              <div className="space-y-1">
                <label className="text-xxs uppercase text-slate-400">Button Label</label>
                <input
                  type="text"
                  value={btnText}
                  onChange={(e) => setBtnText(e.target.value)}
                  placeholder="Enquire"
                  className="w-full bg-[#1b1b26] border border-[#2e2e3f] rounded px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xxs uppercase text-slate-400">Target Link URL</label>
                <input
                  type="text"
                  value={btnUrl}
                  onChange={(e) => setBtnUrl(e.target.value)}
                  placeholder="/projects"
                  className="w-full bg-[#1b1b26] border border-[#2e2e3f] rounded px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xxs uppercase text-slate-400">Button Style</label>
                <select
                  value={btnStyle}
                  onChange={(e) => setBtnStyle(e.target.value)}
                  className="w-full bg-[#1b1b26] border border-[#2e2e3f] rounded px-3 py-1.5 text-xs text-white"
                >
                  <option value="PRIMARY">Primary Accent Fill</option>
                  <option value="SECONDARY">Secondary outline</option>
                </select>
              </div>
              <button
                type="button"
                onClick={addCta}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xxs font-bold uppercase py-2 rounded cursor-pointer"
              >
                + Add button
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {ctaButtons.map((btn, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 bg-[#1b1b26] border border-[#2e2e3f] px-3 py-1.5 rounded text-xs text-slate-300"
                >
                  {btn.text} ({btn.style})
                  <button
                    type="button"
                    onClick={() => removeCta(index)}
                    className="text-red-400 hover:text-red-300 font-bold cursor-pointer bg-transparent border-none"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Features checktags list */}
          <div className="border-t border-[#1e1e2e] pt-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Checklist Feature Tags</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="RERA Approved"
                className="flex-1 bg-[#1b1b26] border border-[#2e2e3f] rounded-lg px-4 py-2 text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={addFeature}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase px-4 rounded-lg cursor-pointer"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {features.map((feat, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 bg-[#1b1b26] border border-[#2e2e3f] px-3 py-1.5 rounded-full text-xs text-slate-300"
                >
                  {feat}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-400 hover:text-red-300 font-bold ml-1 cursor-pointer bg-transparent border-none"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Statistics Grid Config (only for STATS layout) */}
          {layoutType === "STATS" && (
            <div className="border-t border-[#1e1e2e] pt-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Layout Stats Grid Configurations
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end bg-[#171722] p-4 rounded-xl">
                <div className="space-y-1">
                  <label className="text-xxs uppercase text-slate-400">Number Value</label>
                  <input
                    type="text"
                    value={statNumber}
                    onChange={(e) => setStatNumber(e.target.value)}
                    placeholder="100"
                    className="w-full bg-[#1b1b26] border border-[#2e2e3f] rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xxs uppercase text-slate-400">Suffix tag</label>
                  <input
                    type="text"
                    value={statSuffix}
                    onChange={(e) => setStatSuffix(e.target.value)}
                    placeholder="K+"
                    className="w-full bg-[#1b1b26] border border-[#2e2e3f] rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xxs uppercase text-slate-400">Stat Label</label>
                  <input
                    type="text"
                    value={statTitle}
                    onChange={(e) => setStatTitle(e.target.value)}
                    placeholder="Customers"
                    className="w-full bg-[#1b1b26] border border-[#2e2e3f] rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={addStat}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xxs font-bold uppercase py-2 rounded cursor-pointer"
                >
                  + Add Stat
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {statistics.map((st, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-[#1b1b26] border border-[#2e2e3f] px-3 py-1.5 rounded text-xs text-slate-300"
                  >
                    {st.number}
                    {st.suffix} {st.title}
                    <button
                      type="button"
                      onClick={() => removeStat(index)}
                      className="text-red-400 hover:text-red-300 font-bold cursor-pointer bg-transparent border-none"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Styling overrides */}
          <div className="border-t border-[#1e1e2e] pt-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Design Customizations</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Background Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={backgroundColor || "#020520"}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-8 h-8 border-0 bg-transparent cursor-pointer rounded overflow-hidden"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#020520"
                    className="flex-1 bg-[#1b1b26] border border-[#2e2e3f] rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Text color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={textColor || "#ffffff"}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 border-0 bg-transparent cursor-pointer rounded overflow-hidden"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 bg-[#1b1b26] border border-[#2e2e3f] rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Gold/Accent color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={accentColor || "#DDBD81"}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 border-0 bg-transparent cursor-pointer rounded overflow-hidden"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    placeholder="#DDBD81"
                    className="flex-1 bg-[#1b1b26] border border-[#2e2e3f] rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {layoutType === "FULL_WIDTH" && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Overlay Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={overlayColor || "#000000"}
                        onChange={(e) => setOverlayColor(e.target.value)}
                        className="w-8 h-8 border-0 bg-transparent cursor-pointer rounded overflow-hidden"
                      />
                      <input
                        type="text"
                        value={overlayColor}
                        onChange={(e) => setOverlayColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1 bg-[#1b1b26] border border-[#2e2e3f] rounded px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Overlay Opacity (0 to 1)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={overlayOpacity}
                      onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                      className="w-full bg-[#1b1b26] border border-[#2e2e3f] rounded-lg px-4 py-2 text-xs text-white"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-[#1e1e2e]">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-widest px-8 py-3.5 rounded-lg text-xs transition cursor-pointer"
            >
              {loading ? "Saving Slide..." : editingSlideId ? "Save Changes" : "Create Slide"}
            </button>

            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                isActive
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {isActive ? "● Active on Website" : "○ Disabled"}
            </button>

            {editingSlideId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-widest px-6 py-3.5 rounded-lg text-xs transition cursor-pointer border border-[#2e2e3f]"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {/* CMS Guidelines Info Panel */}
        <div className="space-y-6">
          <div className="bg-[#13131a] p-6 rounded-2xl border border-[#1e1e2e] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">CMS Guidelines</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Create multiple active hero slides to render them as an autoplaying slider. Select templates layout types to customize grids.
            </p>
            <div className="text-xs space-y-2 text-slate-300 pt-2 leading-relaxed">
              <div>• **Left Content**: Traditional split column with image on right.</div>
              <div>• **Right Content**: Reversed layout (image on left).</div>
              <div>• **Centered / Full Width**: Centered overlay layouts (ideal for background videos).</div>
              <div>• **Stats / Form**: Renders statistics grids or embedded enquiry forms next to content.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time preview */}
      <div className="border-t border-[#1e1e2e] pt-8 space-y-4">
        <h3 className="text-lg font-bold text-white">Live Slide Preview</h3>
        <p className="text-xs text-slate-400">See your active editor modifications and layout selections in real-time before saving.</p>
        <div className="border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <Hero previewData={previewObject} />
        </div>
      </div>
    </div>
  );
}
