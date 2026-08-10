"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getThemeById, updateTheme, uploadThemeBranding, publishTheme } from "../services/theme.service";
import { Theme } from "../types";

export default function ThemeFormPage({ id }: { id: string }) {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "details" | "colors" | "typography" | "layout" | "branding" | "components"
  >("colors");

  // Undo/Redo & State tracking
  const [formData, setFormData] = useState<Partial<Theme>>({});
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // File Upload states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [darkLogoFile, setDarkLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [loadingLogoFile, setLoadingLogoFile] = useState<File | null>(null);
  const [uploadingBranding, setUploadingBranding] = useState(false);

  // Preview Viewport Mode
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    loadTheme();
  }, [id]);

  async function loadTheme() {
    setLoading(true);
    setError(null);
    try {
      const data = await getThemeById(id);
      setTheme(data);
      const initialForm = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        notes: data.notes,
        colors: data.colors ? { ...data.colors } : undefined,
        typography: data.typography ? { ...data.typography } : undefined,
        layout: data.layout ? { ...data.layout } : undefined,
        branding: data.branding ? { ...data.branding } : undefined,
        components: data.components ? { ...data.components } : undefined,
      };
      setFormData(initialForm);
      // Init history
      const stateStr = JSON.stringify(initialForm);
      setHistory([stateStr]);
      setHistoryIndex(0);
    } catch (err: any) {
      setError(err.message || "Failed to load theme settings");
    } finally {
      setLoading(false);
    }
  }

  // Push new state to history for undo/redo
  const updateState = (updated: Partial<Theme>) => {
    setFormData(updated);
    const stateStr = JSON.stringify(updated);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(stateStr);
    // Limit history size to 30
    if (newHistory.length > 30) {
      newHistory.shift();
    }
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setFormData(JSON.parse(history[nextIndex]));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setFormData(JSON.parse(history[nextIndex]));
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to discard all unsaved changes?")) {
      if (theme) {
        const resetForm = {
          name: theme.name,
          slug: theme.slug,
          description: theme.description,
          notes: theme.notes,
          colors: theme.colors ? { ...theme.colors } : undefined,
          typography: theme.typography ? { ...theme.typography } : undefined,
          layout: theme.layout ? { ...theme.layout } : undefined,
          branding: theme.branding ? { ...theme.branding } : undefined,
          components: theme.components ? { ...theme.components } : undefined,
        };
        setFormData(resetForm);
        setHistory([JSON.stringify(resetForm)]);
        setHistoryIndex(0);
      }
    }
  };

  // Helper for deep settings update
  const handleNestedChange = (
    section: "colors" | "typography" | "layout" | "components" | "branding",
    key: string,
    value: any
  ) => {
    const updated = {
      ...formData,
      [section]: {
        ...(formData[section] || {}),
        [key]: value,
      },
    };
    updateState(updated);
  };

  const handleDetailsChange = (key: string, value: string) => {
    const updated = {
      ...formData,
      [key]: value,
    };
    updateState(updated);
  };

  // Save changes
  async function handleSave(statusOverride?: "ACTIVE") {
    setIsSubmitting(true);
    setError(null);
    setSaveSuccess(false);
    try {
      // 1. Upload branding files first if any are selected
      if (logoFile || darkLogoFile || faviconFile || loadingLogoFile) {
        setUploadingBranding(true);
        const fileForm = new FormData();
        if (logoFile) fileForm.append("logo", logoFile);
        if (darkLogoFile) fileForm.append("darkLogo", darkLogoFile);
        if (faviconFile) fileForm.append("favicon", faviconFile);
        if (loadingLogoFile) fileForm.append("loadingLogo", loadingLogoFile);

        const updatedBranding = await uploadThemeBranding(id, fileForm);
        // Clear file states
        setLogoFile(null);
        setDarkLogoFile(null);
        setFaviconFile(null);
        setLoadingLogoFile(null);

        // Update local state with new branding urls
        if (updatedBranding.branding) {
          formData.branding = updatedBranding.branding;
        }
      }

      // 2. Save the text & color details
      const toSave = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description ?? undefined,
        notes: formData.notes ?? undefined,
        colors: formData.colors ? {
          primary: formData.colors.primary,
          secondary: formData.colors.secondary,
          accent: formData.colors.accent,
          background: formData.colors.background,
          surface: formData.colors.surface,
          textPrimary: formData.colors.textPrimary,
          textMuted: formData.colors.textMuted,
          border: formData.colors.border,
          success: formData.colors.success,
          warning: formData.colors.warning,
          error: formData.colors.error,
        } : undefined,
        typography: formData.typography ? {
          headingFont: formData.typography.headingFont,
          bodyFont: formData.typography.bodyFont,
          buttonFont: formData.typography.buttonFont,
          baseFontSize: formData.typography.baseFontSize,
          lineHeight: formData.typography.lineHeight,
          letterSpacing: formData.typography.letterSpacing,
        } : undefined,
        layout: formData.layout ? {
          containerWidth: formData.layout.containerWidth,
          borderRadius: formData.layout.borderRadius,
          cardRadius: formData.layout.cardRadius,
          buttonRadius: formData.layout.buttonRadius,
          shadowStyle: formData.layout.shadowStyle,
          sectionSpacing: formData.layout.sectionSpacing,
        } : undefined,
        components: formData.components ? {
          btnBg: formData.components.btnBg,
          btnText: formData.components.btnText,
          btnBorder: formData.components.btnBorder,
          btnHover: formData.components.btnHover,
          btnRadius: formData.components.btnRadius,
          navBg: formData.components.navBg,
          navHeight: formData.components.navHeight,
          navMenuColor: formData.components.navMenuColor,
          navActiveColor: formData.components.navActiveColor,
          navSticky: formData.components.navSticky,
          footerBg: formData.components.footerBg,
          footerText: formData.components.footerText,
          footerLink: formData.components.footerLink,
          cardBg: formData.components.cardBg,
          cardBorder: formData.components.cardBorder,
          cardRadius: formData.components.cardRadius,
          darkModeEnabled: formData.components.darkModeEnabled,
        } : undefined,
      };

      const result = await updateTheme(id, toSave);

      // 3. Publish if requested
      if (statusOverride === "ACTIVE") {
        await publishTheme(id);
        result.status = "ACTIVE";
      }

      setTheme(result);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save theme settings");
    } finally {
      setIsSubmitting(false);
      setUploadingBranding(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !theme) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl text-center">
        <h2 className="text-lg font-bold">Error</h2>
        <p className="mt-2">{error}</p>
        <Link href="/admin/themes" className="mt-4 inline-block text-indigo-400 font-semibold underline">
          Back to Themes
        </Link>
      </div>
    );
  }

  // Live CSS variables computed for the preview pane
  const colors = (formData.colors || {}) as any;
  const typography = (formData.typography || {}) as any;
  const layout = (formData.layout || {}) as any;
  const components = (formData.components || {}) as any;

  const previewStyles = {
    "--color-primary": colors.primary || "#DDBD81",
    "--color-secondary": colors.secondary || "#020520",
    "--color-accent": colors.accent || "#B8963E",
    "--color-bg":
      colors.background === "#020520" || !colors.background
        ? "linear-gradient(90deg, rgba(7, 32, 61, 1) 0%, rgb(6, 6, 51) 100%)"
        : colors.background,
    "--color-surface": colors.surface || "#13131a",
    "--color-text-primary": colors.textPrimary || "#FFFFFF",
    "--color-text-muted": colors.textMuted || "#8E90A2",
    "--color-border": colors.border || "#1e1e2e",
    "--color-success": colors.success || "#22c55e",
    "--color-warning": colors.warning || "#f59e0b",
    "--color-error": colors.error || "#ef4444",

    "--radius-container": layout.borderRadius || "0.5rem",
    "--radius-card": layout.cardRadius || "1rem",
    "--radius-btn": layout.buttonRadius || "0.5rem",
    "--spacing-section": layout.sectionSpacing || "5rem",

    "--btn-bg": components.btnBg || "#DDBD81",
    "--btn-text": components.btnText || "#020520",
    "--btn-border": components.btnBorder || "transparent",
    "--btn-hover": components.btnHover || "#B8963E",
    "--btn-radius": components.btnRadius || "0.5rem",

    "--nav-bg": components.navBg || "#020520",
    "--nav-height": components.navHeight || "72px",
    "--nav-menu": components.navMenuColor || "#8E90A2",
    "--nav-active": components.navActiveColor || "#DDBD81",

    "--footer-bg": components.footerBg || "#13131a",
    "--footer-text": components.footerText || "#8E90A2",
    "--footer-link": components.footerLink || "#DDBD81",

    "--card-bg": components.cardBg || "#13131a",
    "--card-border": components.cardBorder || "#1e1e2e",
    "--card-radius": components.cardRadius || "1rem",

    fontFamily: typography.bodyFont ? `"${typography.bodyFont}", sans-serif` : "sans-serif",
  } as React.CSSProperties;

  const renderColorInput = (
    section: "colors" | "components",
    key: string,
    label: string,
    isBackgroundField = false
  ) => {
    const sectionData = (formData[section] as any) || {};
    const val = sectionData[key] || "";
    const isGradient = val.includes("gradient") || val.includes("linear") || val.includes("radial");
    const isTransparent = val === "transparent";

    return (
      <div className="space-y-1">
        <label className="text-[10px] text-slate-400 font-bold uppercase">{label}</label>
        <div className="flex items-center gap-2 bg-[#0f0f14] border border-[#1e1e2e] rounded px-2.5 py-1.5">
          {!isGradient && !isTransparent && (
            <input
              type="color"
              value={val.startsWith("#") && val.length === 7 ? val : "#FFFFFF"}
              onChange={(e) => handleNestedChange(section, key, e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border border-[#1e1e2e] bg-transparent shrink-0"
            />
          )}
          <input
            type="text"
            value={val}
            onChange={(e) => handleNestedChange(section, key, e.target.value)}
            className="w-full bg-transparent border-0 p-0 text-xs text-slate-200 font-mono focus:outline-none"
            maxLength={isBackgroundField ? 150 : 25}
            placeholder={isBackgroundField ? "e.g. #HEX or linear-gradient(...)" : "#HEX"}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] overflow-hidden space-y-4">
      {/* Top Header bar with Undo/Redo & Save Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#13131a] border border-[#1e1e2e] p-4 rounded-xl shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/themes"
            className="p-1.5 bg-[#0f0f14] hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold text-slate-100">{formData.name || "Edit Theme"}</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                theme?.status === "ACTIVE"
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              }`}>
                {theme?.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Customize properties and view real-time changes.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex bg-[#0f0f14] rounded-lg border border-[#1e1e2e] p-0.5 mr-2">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 text-slate-400 hover:text-slate-100 disabled:opacity-30 rounded-md transition-colors"
              title="Undo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 text-slate-400 hover:text-slate-100 disabled:opacity-30 rounded-md transition-colors"
              title="Redo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
              </svg>
            </button>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 border border-slate-700 hover:border-slate-600 rounded-lg text-sm font-semibold text-slate-200 transition-colors bg-[#13131a]"
          >
            Reset
          </button>
          <button
            onClick={() => handleSave()}
            disabled={isSubmitting}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold text-slate-200 transition-colors border border-[#1e1e2e]"
          >
            {isSubmitting ? "Saving..." : "Save Draft"}
          </button>
          {theme?.status !== "ACTIVE" && (
            <button
              onClick={() => handleSave("ACTIVE")}
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Publish Active
            </button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-lg text-sm font-medium shrink-0 animate-fade-in flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Theme saved successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2.5 rounded-lg text-sm font-medium shrink-0">
          {error}
        </div>
      )}

      {/* Editor & Preview Split Pane */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Settings Panel */}
        <div className="w-full lg:w-[450px] bg-[#13131a] border border-[#1e1e2e] rounded-xl flex flex-col overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto border-b border-[#1e1e2e] bg-[#161622] shrink-0">
            {(["colors", "typography", "layout", "branding", "components", "details"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? "border-indigo-500 text-slate-100 bg-indigo-500/5"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Form Fields container (scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {activeTab === "details" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Theme Name</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => handleDetailsChange("name", e.target.value)}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Slug</label>
                  <input
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) => handleDetailsChange("slug", e.target.value)}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Description</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => handleDetailsChange("description", e.target.value)}
                    rows={4}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Theme Notes</label>
                  <textarea
                    value={formData.notes || ""}
                    onChange={(e) => handleDetailsChange("notes", e.target.value)}
                    rows={3}
                    placeholder="Describe specific features of this draft..."
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {activeTab === "colors" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide border-b border-[#1e1e2e] pb-1.5">Palette Colors</h3>
                {(
                  [
                    { key: "primary", label: "Primary Color (Brand Accent)" },
                    { key: "secondary", label: "Secondary Color" },
                    { key: "accent", label: "Accent Tone" },
                    { key: "background", label: "Page Background" },
                    { key: "surface", label: "Surface (Cards & Modals)" },
                    { key: "textPrimary", label: "Text Color (Primary)" },
                    { key: "textMuted", label: "Muted & Placeholder Text" },
                    { key: "border", label: "Border Color" },
                    { key: "success", label: "Success Accent" },
                    { key: "warning", label: "Warning Accent" },
                    { key: "error", label: "Error / Critical Accent" },
                  ] as const
                ).map(({ key, label }) => {
                  const val = colors[key] || "";
                  const isGradient = val.includes("gradient") || val.includes("linear") || val.includes("radial");
                  const isLongField = key === "background" || key === "surface";
                  return (
                    <div key={key} className="flex items-center justify-between gap-4 bg-[#0f0f14] p-3 rounded-lg border border-[#1e1e2e]">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-300">{label}</span>
                        <span className="block text-[10px] font-mono text-slate-500 uppercase">{val || "#FFFFFF"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isGradient && (
                          <input
                            type="color"
                            value={val.startsWith("#") && val.length === 7 ? val : "#FFFFFF"}
                            onChange={(e) => handleNestedChange("colors", key, e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-[#1e1e2e] bg-transparent"
                          />
                        )}
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleNestedChange("colors", key, e.target.value)}
                          className={`${isLongField ? 'w-48' : 'w-20'} bg-[#0f0f14] border border-[#1e1e2e] rounded px-2 py-1 text-xs text-slate-200 font-mono text-center`}
                          maxLength={isLongField ? 150 : 7}
                          placeholder={key === "background" ? "e.g. #020520 or linear-gradient(...)" : "#HEX"}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "typography" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide border-b border-[#1e1e2e] pb-1.5">Fonts (Google Fonts)</h3>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Heading Font</label>
                  <select
                    value={typography.headingFont || "Cormorant Garamond"}
                    onChange={(e) => handleNestedChange("typography", "headingFont", e.target.value)}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200"
                  >
                    <option value="Cormorant Garamond">Cormorant Garamond</option>
                    <option value="Inter">Inter</option>
                    <option value="Jost">Jost</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Outfit">Outfit</option>
                    <option value="Roboto">Roboto</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Body Font</label>
                  <select
                    value={typography.bodyFont || "Jost"}
                    onChange={(e) => handleNestedChange("typography", "bodyFont", e.target.value)}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200"
                  >
                    <option value="Jost">Jost</option>
                    <option value="Inter">Inter</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Outfit">Outfit</option>
                    <option value="Roboto">Roboto</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Button Font</label>
                  <select
                    value={typography.buttonFont || "Jost"}
                    onChange={(e) => handleNestedChange("typography", "buttonFont", e.target.value)}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200"
                  >
                    <option value="Jost">Jost</option>
                    <option value="Inter">Inter</option>
                    <option value="Outfit">Outfit</option>
                  </select>
                </div>

                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide border-b border-[#1e1e2e] pt-4 pb-1.5">Sizing & Layout</h3>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Base Font Size</label>
                  <input
                    type="text"
                    value={typography.baseFontSize || "16px"}
                    onChange={(e) => handleNestedChange("typography", "baseFontSize", e.target.value)}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Line Height</label>
                  <input
                    type="text"
                    value={typography.lineHeight || "1.6"}
                    onChange={(e) => handleNestedChange("typography", "lineHeight", e.target.value)}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Letter Spacing</label>
                  <input
                    type="text"
                    value={typography.letterSpacing || "0em"}
                    onChange={(e) => handleNestedChange("typography", "letterSpacing", e.target.value)}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200"
                  />
                </div>
              </div>
            )}

            {activeTab === "layout" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide border-b border-[#1e1e2e] pb-1.5">Global Grid</h3>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Container Max Width</label>
                  <input
                    type="text"
                    value={layout.containerWidth || "1280px"}
                    onChange={(e) => handleNestedChange("layout", "containerWidth", e.target.value)}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Section Spacing</label>
                  <input
                    type="text"
                    value={layout.sectionSpacing || "5rem"}
                    onChange={(e) => handleNestedChange("layout", "sectionSpacing", e.target.value)}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200"
                  />
                </div>

                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide border-b border-[#1e1e2e] pt-4 pb-1.5">Radii & Aesthetics</h3>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Border Radius (Global)</label>
                  <input
                    type="text"
                    value={layout.borderRadius || "0.5rem"}
                    onChange={(e) => handleNestedChange("layout", "borderRadius", e.target.value)}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Card Radius</label>
                  <input
                    type="text"
                    value={layout.cardRadius || "1rem"}
                    onChange={(e) => handleNestedChange("layout", "cardRadius", e.target.value)}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Button Radius</label>
                  <input
                    type="text"
                    value={layout.buttonRadius || "0.5rem"}
                    onChange={(e) => handleNestedChange("layout", "buttonRadius", e.target.value)}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Shadow Style</label>
                  <select
                    value={layout.shadowStyle || "md"}
                    onChange={(e) => handleNestedChange("layout", "shadowStyle", e.target.value)}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200"
                  >
                    <option value="none">None</option>
                    <option value="sm">Small (sm)</option>
                    <option value="md">Medium (md)</option>
                    <option value="lg">Large (lg)</option>
                    <option value="xl">Extra Large (xl)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "branding" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide border-b border-[#1e1e2e] pb-1.5">Branding Assets</h3>

                {[
                  { key: "logo", label: "Main Logo (Light backgrounds)", file: logoFile, setFile: setLogoFile, current: formData.branding?.logo },
                  { key: "darkLogo", label: "Dark Logo (Dark backgrounds)", file: darkLogoFile, setFile: setDarkLogoFile, current: formData.branding?.darkLogo },
                  { key: "favicon", label: "Favicon", file: faviconFile, setFile: setFaviconFile, current: formData.branding?.favicon },
                  { key: "loadingLogo", label: "Preloader Logo", file: loadingLogoFile, setFile: setLoadingLogoFile, current: formData.branding?.loadingLogo },
                ].map(({ key, label, file, setFile, current }) => (
                  <div key={key} className="space-y-2 bg-[#0f0f14] p-3 rounded-lg border border-[#1e1e2e]">
                    <span className="text-xs font-bold text-slate-300 block">{label}</span>
                    {current && (
                      <div className="bg-[#13131a] p-2 rounded border border-[#1e1e2e] flex items-center justify-center h-16 relative">
                        <img src={current} alt={label} className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setFile(e.target.files[0]);
                        }}
                        className="hidden"
                        id={`file-input-${key}`}
                      />
                      <label
                        htmlFor={`file-input-${key}`}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded cursor-pointer transition-colors"
                      >
                        Choose Image
                      </label>
                      <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
                        {file ? file.name : "No file chosen"}
                      </span>
                    </div>
                  </div>
                ))}
                {uploadingBranding && (
                  <p className="text-xs text-indigo-400 animate-pulse font-medium">Uploading brand assets on save...</p>
                )}
              </div>
            )}

            {activeTab === "components" && (
              <div className="space-y-5">
                {/* Buttons Component */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide border-b border-[#1e1e2e] pb-1.5">Buttons</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {renderColorInput("components", "btnBg", "Background", true)}
                    {renderColorInput("components", "btnText", "Text Color")}
                    {renderColorInput("components", "btnBorder", "Border Color")}
                    {renderColorInput("components", "btnHover", "Hover State")}
                  </div>
                </div>

                {/* Navbar Component */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide border-b border-[#1e1e2e] pb-1.5">Navigation Bar</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      {renderColorInput("components", "navBg", "Navbar Background", true)}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Navbar Height</label>
                      <input
                        type="text"
                        value={components.navHeight || ""}
                        onChange={(e) => handleNestedChange("components", "navHeight", e.target.value)}
                        className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded px-2.5 py-1.5 text-xs text-slate-200"
                      />
                    </div>
                    {renderColorInput("components", "navMenuColor", "Menu Color")}
                    {renderColorInput("components", "navActiveColor", "Active Link")}
                    <div className="flex items-center gap-2 pt-4 col-span-2">
                      <input
                        type="checkbox"
                        id="navSticky-toggle"
                        checked={components.navSticky ?? true}
                        onChange={(e) => handleNestedChange("components", "navSticky", e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-[#1e1e2e] bg-[#0f0f14] rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="navSticky-toggle" className="text-xs font-bold text-slate-300">Sticky Navbar</label>
                    </div>
                  </div>
                </div>

                {/* Footer Component */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide border-b border-[#1e1e2e] pb-1.5">Footer</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      {renderColorInput("components", "footerBg", "Footer Background", true)}
                    </div>
                    {renderColorInput("components", "footerText", "Text Color")}
                    {renderColorInput("components", "footerLink", "Link Accent")}
                  </div>
                </div>

                {/* Dark Mode toggle */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide border-b border-[#1e1e2e] pb-1.5">Preferences</h3>
                  <div className="flex items-center gap-2 bg-[#0f0f14] p-3 rounded-lg border border-[#1e1e2e]">
                    <input
                      type="checkbox"
                      id="darkMode-toggle"
                      checked={components.darkModeEnabled ?? true}
                      onChange={(e) => handleNestedChange("components", "darkModeEnabled", e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-[#1e1e2e] bg-[#0f0f14] rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="darkMode-toggle" className="text-xs font-bold text-slate-300">Enable Dark Mode Support</label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="flex-1 bg-[#13131a] border border-[#1e1e2e] rounded-xl flex flex-col overflow-hidden">
          {/* Viewport Toggles */}
          <div className="bg-[#161622] border-b border-[#1e1e2e] px-4 py-2 flex items-center justify-between shrink-0">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Live Preview</span>
            <div className="flex border border-[#1e1e2e] rounded bg-[#0f0f14] p-0.5">
              {(["desktop", "tablet", "mobile"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewportMode(mode)}
                  className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-all cursor-pointer ${
                    viewportMode === mode
                      ? "bg-indigo-500/20 text-indigo-400"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Renders inside customized styles */}
          <div className="flex-1 bg-[#09090d] p-8 overflow-y-auto flex items-center justify-center">
            <div
              style={previewStyles}
              className={`bg-[var(--color-bg)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-[var(--radius-container)] shadow-2xl transition-all duration-300 overflow-hidden flex flex-col ${
                viewportMode === "desktop"
                  ? "w-full max-w-4xl h-[450px]"
                  : viewportMode === "tablet"
                  ? "w-[480px] h-[450px]"
                  : "w-[320px] h-[450px]"
              }`}
            >
              {/* Mock Nav */}
              <div
                style={{
                  backgroundColor: "var(--nav-bg)",
                  height: "var(--nav-height)",
                  borderColor: "var(--color-border)",
                }}
                className="border-b px-5 flex items-center justify-between shrink-0"
              >
                <div className="flex items-center gap-2">
                  {formData.branding?.logo ? (
                    <img src={formData.branding.logo} alt="Logo" className="h-6 object-contain" />
                  ) : (
                    <span className="font-bold text-sm tracking-wider" style={{ color: "var(--color-primary)" }}>
                      BHAGYASHREE
                    </span>
                  )}
                </div>
                <div className="flex gap-4 items-center">
                  <span className="text-xs font-semibold" style={{ color: "var(--nav-active)" }}>
                    Home
                  </span>
                  <span className="text-xs font-semibold" style={{ color: "var(--nav-menu)" }}>
                    Projects
                  </span>
                  <span className="text-xs font-semibold" style={{ color: "var(--nav-menu)" }}>
                    Contact
                  </span>
                </div>
              </div>

              {/* Mock Body */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[var(--color-bg)]">
                <div className="space-y-2">
                  <h2
                    className="text-xl font-bold font-serif"
                    style={{ fontFamily: typography.headingFont ? `"${typography.headingFont}", serif` : "serif" }}
                  >
                    Experience Luxury Living
                  </h2>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    Discover our collection of super premium luxury apartment residences. Tailored design, exquisite finishes, and mastercraft architecture.
                  </p>
                </div>

                {/* Cards Preview */}
                <div
                  className="p-4 border transition-all"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--card-border)",
                    borderRadius: "var(--card-radius)",
                  }}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--color-primary)" }}>
                    Featured Project
                  </span>
                  <h4 className="font-bold text-sm mt-1">Bhagyashree Heights, Bangalore</h4>
                  <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                    Ultra premium 3 & 4 BHK apartments with panoramic skyline views.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="px-4 py-1.5 text-xs font-bold transition-all"
                      style={{
                        backgroundColor: "var(--btn-bg)",
                        color: "var(--btn-text)",
                        borderColor: "var(--btn-border)",
                        borderRadius: "var(--btn-radius)",
                        fontFamily: typography.buttonFont ? `"${typography.buttonFont}", sans-serif` : "sans-serif",
                      }}
                    >
                      View Details
                    </button>
                    <button
                      className="px-4 py-1.5 text-xs font-bold bg-transparent border transition-all"
                      style={{
                        borderColor: "var(--color-primary)",
                        color: "var(--color-primary)",
                        borderRadius: "var(--btn-radius)",
                        fontFamily: typography.buttonFont ? `"${typography.buttonFont}", sans-serif` : "sans-serif",
                      }}
                    >
                      Download Brochure
                    </button>
                  </div>
                </div>

                {/* Form Elements */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider">Schedule a Visit</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      disabled
                      className="w-full bg-[var(--color-bg)] border rounded px-3 py-2 text-xs"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      disabled
                      className="w-full bg-[var(--color-bg)] border rounded px-3 py-2 text-xs"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Mock Footer */}
              <div
                style={{ backgroundColor: "var(--footer-bg)", borderColor: "var(--color-border)" }}
                className="border-t px-6 py-4 flex justify-between items-center shrink-0"
              >
                <span className="text-[10px]" style={{ color: "var(--footer-text)" }}>
                  © 2026 Bhagyashree Group. All rights reserved.
                </span>
                <span className="text-[10px] font-semibold" style={{ color: "var(--footer-link)" }}>
                  Privacy Policy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
