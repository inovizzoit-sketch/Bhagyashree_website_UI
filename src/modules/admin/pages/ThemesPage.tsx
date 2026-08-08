"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "@/shared/components/Modal";
import { useTheme } from "@/shared/context/ThemeContext";
import {
  getThemes,
  getThemeById,
  createTheme,
  deleteTheme,
  duplicateTheme,
  publishTheme,
  archiveTheme,
  exportTheme,
  importTheme,
  updateTheme,
  uploadThemeBranding,
} from "../services/theme.service";
import { Theme, ThemeColor, ThemeTypography, ThemeLayout, ThemeBranding, ThemeComponent } from "../types";

// Default properties for Light Mode
const defaultLightThemeColors: ThemeColor = {
  id: "",
  themeId: "",
  primary: "#4f46e5",
  secondary: "#f9fafb",
  accent: "#3730a3",
  background: "#f9fafb",
  surface: "#ffffff",
  textPrimary: "#111827",
  textMuted: "#4b5563",
  border: "#e5e7eb",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
};

const defaultLightThemeComponents: ThemeComponent = {
  id: "",
  themeId: "",
  btnBg: "#4f46e5",
  btnText: "#ffffff",
  btnBorder: "transparent",
  btnHover: "#3730a3",
  btnRadius: "9999px",
  navBg: "#ffffff",
  navHeight: "80px",
  navMenuColor: "#4b5563",
  navActiveColor: "#4f46e5",
  navSticky: true,
  footerBg: "#f9fafb",
  footerText: "#4b5563",
  footerLink: "#4f46e5",
  cardBg: "#ffffff",
  cardBorder: "#e5e7eb",
  cardRadius: "0.5rem",
  darkModeEnabled: false,
};

// Default properties for Dark Mode
const defaultDarkThemeColors: ThemeColor = {
  id: "",
  themeId: "",
  primary: "#DDBD81",
  secondary: "#020520",
  accent: "#B8963E",
  background: "#020520",
  surface: "#13131a",
  textPrimary: "#FFFFFF",
  textMuted: "#8E90A2",
  border: "#1e1e2e",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
};

const defaultDarkThemeComponents: ThemeComponent = {
  id: "",
  themeId: "",
  btnBg: "#DDBD81",
  btnText: "#020520",
  btnBorder: "transparent",
  btnHover: "#B8963E",
  btnRadius: "0.5rem",
  navBg: "#020520",
  navHeight: "72px",
  navMenuColor: "#8E90A2",
  navActiveColor: "#DDBD81",
  navSticky: true,
  footerBg: "#13131a",
  footerText: "#8E90A2",
  footerLink: "#DDBD81",
  cardBg: "#13131a",
  cardBorder: "#1e1e2e",
  cardRadius: "1rem",
  darkModeEnabled: true,
};

const defaultTypography: ThemeTypography = {
  id: "",
  themeId: "",
  headingFont: "Playfair Display",
  bodyFont: "Open Sans",
  buttonFont: "Inter",
  baseFontSize: "16px",
  lineHeight: "1.6",
  letterSpacing: "0em",
};

const defaultLayout: ThemeLayout = {
  id: "",
  themeId: "",
  containerWidth: "1200px",
  borderRadius: "0.5rem",
  cardRadius: "0.5rem",
  buttonRadius: "9999px",
  shadowStyle: "sm",
  sectionSpacing: "6rem",
};

// WCAG Contrast Calculation Helpers
function getContrastRatio(color1: string, color2: string): number {
  const getRGB = (c: string) => {
    let clean = c || "#FFFFFF";
    if (clean.startsWith("linear-gradient") || clean.startsWith("radial-gradient")) {
      const match = clean.match(/#[0-9a-fA-F]{3,8}/);
      clean = match ? match[0] : "#000000";
    }
    let hex = clean.replace("#", "");
    if (hex.length === 3) {
      hex = hex.split("").map((x) => x + x).join("");
    }
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const a = [r, g, b].map((v) => {
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };

  try {
    const l1 = getRGB(color1);
    const l2 = getRGB(color2);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (brightest + 0.05) / (darkest + 0.05);
  } catch {
    return 4.5;
  }
}

// Lighten/Darken Hex Helper for Hover Suggestions
function adjustColorBrightness(hex: string, percent: number): string {
  if (hex.startsWith("linear-gradient") || hex.startsWith("radial-gradient")) return hex;
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((x) => x + x).join("");
  }
  let R = parseInt(clean.substring(0, 2), 16);
  let G = parseInt(clean.substring(2, 4), 16);
  let B = parseInt(clean.substring(4, 6), 16);

  R = Math.min(255, Math.max(0, R + percent));
  G = Math.min(255, Math.max(0, G + percent));
  B = Math.min(255, Math.max(0, B + percent));

  const rHex = R.toString(16).padStart(2, "0");
  const gHex = G.toString(16).padStart(2, "0");
  const bHex = B.toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
}

export default function ThemesPage() {
  const { setPreviewTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"settings" | "advanced">("settings");
  
  // Theme Settings states
  const [lightTheme, setLightTheme] = useState<Theme | null>(null);
  const [darkTheme, setDarkTheme] = useState<Theme | null>(null);
  const [editingMode, setEditingMode] = useState<"light" | "dark">("light");
  const [settingsTab, setSettingsTab] = useState<"colors" | "typography" | "layout" | "branding" | "components">("colors");
  const [settingsForm, setSettingsForm] = useState<Partial<Theme>>({});
  
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // File Upload states for Settings
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [darkLogoFile, setDarkLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [loadingLogoFile, setLoadingLogoFile] = useState<File | null>(null);
  const [uploadingBranding, setUploadingBranding] = useState(false);
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewPath, setPreviewPath] = useState<string>("/");
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  // Advanced / List View states
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createSlug, setCreateSlug] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createNotes, setCreateNotes] = useState("");
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState("");
  const [actionSubmitting, setActionSubmitting] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (activeTab === "advanced") {
      loadThemes();
    }
  }, [activeTab, page, status, sortBy, sortOrder]);

  // Synchronize Live Preview on Settings Edit via postMessage to Iframe
  useEffect(() => {
    if (activeTab === "settings" && settingsForm.name) {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "THEME_PREVIEW_UPDATE",
            theme: settingsForm,
          },
          "*"
        );
      }
    }
  }, [settingsForm, activeTab]);

  const handleIframeLoad = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "THEME_PREVIEW_UPDATE",
          theme: settingsForm,
        },
        "*"
      );
    }
  };

  async function loadSettings() {
    setSettingsLoading(true);
    setSettingsError(null);
    try {
      const response = await getThemes({ page: 1, limit: 100 });
      const list = response.items;

      let light = list.find((t) => t.slug === "elegance-light");
      let dark = list.find((t) => t.slug === "royal-gold");

      // Auto-create Elegance Light Theme if missing
      if (!light) {
        light = await createTheme({
          name: "Elegance Light Theme",
          slug: "elegance-light",
          description: "Clean light background theme with modern indigo colors.",
        });
        await updateTheme(light.id, {
          colors: defaultLightThemeColors,
          components: defaultLightThemeComponents,
          typography: defaultTypography,
          layout: defaultLayout,
        });
        light = await getThemeById(light.id);
      }

      // Auto-create Royal Gold Theme if missing
      if (!dark) {
        dark = await createTheme({
          name: "Royal Gold Theme",
          slug: "royal-gold",
          description: "Elegant royal dark blue and classic gold corporate theme.",
        });
        await updateTheme(dark.id, {
          colors: defaultDarkThemeColors,
          components: defaultDarkThemeComponents,
          typography: defaultTypography,
          layout: defaultLayout,
        });
        dark = await getThemeById(dark.id);
      }

      setLightTheme(light);
      setDarkTheme(dark);

      if (dark.status === "ACTIVE") {
        setEditingMode("dark");
        initForm(dark);
      } else {
        setEditingMode("light");
        initForm(light);
      }
    } catch (err: any) {
      setSettingsError(err.message || "Failed to load theme settings");
    } finally {
      setSettingsLoading(false);
    }
  }

  function initForm(theme: Theme) {
    setSettingsForm({
      id: theme.id,
      name: theme.name,
      slug: theme.slug,
      description: theme.description,
      notes: theme.notes,
      colors: theme.colors ? { ...theme.colors } : undefined,
      typography: theme.typography ? { ...theme.typography } : undefined,
      layout: theme.layout ? { ...theme.layout } : undefined,
      branding: theme.branding ? { ...theme.branding } : undefined,
      components: theme.components ? { ...theme.components } : undefined,
    });
  }

  async function handleSwitchMode(mode: "light" | "dark") {
    setEditingMode(mode);
    const target = mode === "light" ? lightTheme : darkTheme;
    if (target) {
      initForm(target);
    }
  }

  async function handleSetDefaultMode(mode: "light" | "dark") {
    const target = mode === "light" ? lightTheme : darkTheme;
    if (!target) return;
    setSettingsLoading(true);
    try {
      await publishTheme(target.id);
      await loadSettings();
    } catch (err: any) {
      alert(err.message || "Failed to set default theme mode");
    } finally {
      setSettingsLoading(false);
    }
  }

  async function loadThemes() {
    setLoading(true);
    setError(null);
    try {
      const data = await getThemes({
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
        sortBy,
        sortOrder,
      });
      setThemes(data.items);
      setTotalPages(data.meta.totalPages);
      setTotalItems(data.meta.total);
    } catch (err: any) {
      setError(err.message || "Failed to load themes");
    } finally {
      setLoading(false);
    }
  }

  const handleNestedChange = (
    section: "colors" | "typography" | "layout" | "components" | "branding",
    key: string,
    value: any
  ) => {
    setSettingsForm((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value,
      },
    }));
  };

  async function handleSaveSettings() {
    const themeId = settingsForm.id;
    if (!themeId) return;

    setSettingsSaving(true);
    setSettingsError(null);
    setSettingsSuccess(false);

    try {
      if (logoFile || darkLogoFile || faviconFile || loadingLogoFile) {
        setUploadingBranding(true);
        const data = new FormData();
        if (logoFile) data.append("logo", logoFile);
        if (darkLogoFile) data.append("darkLogo", darkLogoFile);
        if (faviconFile) data.append("favicon", faviconFile);
        if (loadingLogoFile) data.append("loadingLogo", loadingLogoFile);

        const updatedBrandingTheme = await uploadThemeBranding(themeId, data);
        if (updatedBrandingTheme.branding) {
          settingsForm.branding = updatedBrandingTheme.branding;
        }

        setLogoFile(null);
        setDarkLogoFile(null);
        setFaviconFile(null);
        setLoadingLogoFile(null);
        setUploadingBranding(false);
      }

      const toSave = {
        name: settingsForm.name,
        slug: settingsForm.slug,
        description: settingsForm.description ?? undefined,
        notes: settingsForm.notes ?? undefined,
        colors: settingsForm.colors ? {
          primary: settingsForm.colors.primary,
          secondary: settingsForm.colors.secondary,
          accent: settingsForm.colors.accent,
          background: settingsForm.colors.background,
          surface: settingsForm.colors.surface,
          textPrimary: settingsForm.colors.textPrimary,
          textMuted: settingsForm.colors.textMuted,
          border: settingsForm.colors.border,
          success: settingsForm.colors.success,
          warning: settingsForm.colors.warning,
          error: settingsForm.colors.error,
        } : undefined,
        typography: settingsForm.typography ? {
          headingFont: settingsForm.typography.headingFont,
          bodyFont: settingsForm.typography.bodyFont,
          buttonFont: settingsForm.typography.buttonFont,
          baseFontSize: settingsForm.typography.baseFontSize,
          lineHeight: settingsForm.typography.lineHeight,
          letterSpacing: settingsForm.typography.letterSpacing,
        } : undefined,
        layout: settingsForm.layout ? {
          containerWidth: settingsForm.layout.containerWidth,
          borderRadius: settingsForm.layout.borderRadius,
          cardRadius: settingsForm.layout.cardRadius,
          buttonRadius: settingsForm.layout.buttonRadius,
          shadowStyle: settingsForm.layout.shadowStyle,
          sectionSpacing: settingsForm.layout.sectionSpacing,
        } : undefined,
        components: settingsForm.components ? {
          btnBg: settingsForm.components.btnBg,
          btnText: settingsForm.components.btnText,
          btnBorder: settingsForm.components.btnBorder,
          btnHover: settingsForm.components.btnHover,
          btnRadius: settingsForm.components.btnRadius,
          navBg: settingsForm.components.navBg,
          navHeight: settingsForm.components.navHeight,
          navMenuColor: settingsForm.components.navMenuColor,
          navActiveColor: settingsForm.components.navActiveColor,
          navSticky: settingsForm.components.navSticky,
          footerBg: settingsForm.components.footerBg,
          footerText: settingsForm.components.footerText,
          footerLink: settingsForm.components.footerLink,
          cardBg: settingsForm.components.cardBg,
          cardBorder: settingsForm.components.cardBorder,
          cardRadius: settingsForm.components.cardRadius,
          darkModeEnabled: settingsForm.components.darkModeEnabled,
        } : undefined,
      };

      await updateTheme(themeId, toSave);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
      await loadSettings();
    } catch (err: any) {
      setSettingsError(err.message || "Failed to save theme settings");
    } finally {
      setSettingsSaving(false);
    }
  }

  function handleResetSettings() {
    if (window.confirm("Reset all settings to default values?")) {
      const isDark = editingMode === "dark";
      setSettingsForm((prev) => ({
        ...prev,
        colors: isDark ? { ...defaultDarkThemeColors } : { ...defaultLightThemeColors },
        components: isDark ? { ...defaultDarkThemeComponents } : { ...defaultLightThemeComponents },
        typography: { ...defaultTypography },
        layout: { ...defaultLayout },
      }));
    }
  }

  function applyFontPreset(heading: string, body: string) {
    setSettingsForm((prev) => ({
      ...prev,
      typography: {
        ...(prev.typography || {}),
        headingFont: heading,
        bodyFont: body,
      } as ThemeTypography,
    }));
  }

  // Search/Filters handlers for List View
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadThemes();
  }

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!createName.trim()) {
      setCreateError("Theme Name is required");
      return;
    }
    setCreateSubmitting(true);
    setCreateError(null);
    try {
      await createTheme({
        name: createName,
        slug: createSlug.trim() || undefined,
        description: createDescription || undefined,
        notes: createNotes || undefined,
      });
      setIsCreateOpen(false);
      setCreateName("");
      setCreateSlug("");
      setCreateDescription("");
      setCreateNotes("");
      loadThemes();
    } catch (err: any) {
      setCreateError(err.message || "Failed to create theme");
    } finally {
      setCreateSubmitting(false);
    }
  }

  async function handleDuplicate(id: string) {
    if (!window.confirm("Are you sure you want to duplicate this theme?")) return;
    try {
      await duplicateTheme(id);
      loadThemes();
    } catch (err: any) {
      alert(err.message || "Failed to duplicate theme");
    }
  }

  async function handlePublish(id: string) {
    if (!window.confirm("Publishing this theme will make it active. Continue?")) return;
    try {
      await publishTheme(id);
      loadThemes();
      await loadSettings();
    } catch (err: any) {
      alert(err.message || "Failed to publish theme");
    }
  }

  async function handleArchive(id: string) {
    if (!window.confirm("Are you sure you want to archive this theme?")) return;
    try {
      await archiveTheme(id);
      loadThemes();
    } catch (err: any) {
      alert(err.message || "Failed to archive theme");
    }
  }

  async function handleDelete() {
    if (!confirmDeleteId) return;
    setActionSubmitting(true);
    try {
      await deleteTheme(confirmDeleteId);
      setConfirmDeleteId(null);
      setConfirmDeleteName("");
      loadThemes();
    } catch (err: any) {
      alert(err.message || "Failed to delete theme");
    } finally {
      setActionSubmitting(false);
    }
  }

  async function handleExport(theme: Theme) {
    try {
      const data = await exportTheme(theme.id);
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `${theme.slug || "theme"}-config.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err: any) {
      alert(err.message || "Failed to export theme");
    }
  }

  const renderColorInput = (
    section: "colors" | "components",
    key: string,
    label: string,
    isBackgroundField = false
  ) => {
    const sectionData = (settingsForm[section] as any) || {};
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

  const colors = (settingsForm.colors || {}) as ThemeColor;
  const typography = (settingsForm.typography || {}) as ThemeTypography;
  const layout = (settingsForm.layout || {}) as ThemeLayout;
  const branding = (settingsForm.branding || {}) as ThemeBranding;
  const components = (settingsForm.components || {}) as ThemeComponent;

  const activeThemeMode = darkTheme?.status === "ACTIVE" ? "dark" : "light";

  // Compute contrast score in real-time
  const contrastRatio = getContrastRatio(colors.background || "#FFFFFF", colors.textPrimary || "#000000");
  const isAALarge = contrastRatio >= 3.0;
  const isAANormal = contrastRatio >= 4.5;
  const isAAA = contrastRatio >= 7.0;

  // Recommends dynamic button hover state color (15% darker or lighter)
  const suggestedHoverColor = colors.primary ? adjustColorBrightness(colors.primary, -25) : "#C5A267";

  return (
    <div className="space-y-6">
      {/* Top Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Theme Settings Manager</h1>
          <p className="text-slate-400 text-sm mt-1">
            Create, customize, preview, and monitor WCAG accessibility compliance across light & dark themes.
          </p>
        </div>
        <div className="flex bg-[#13131a] border border-[#1e1e2e] rounded-lg p-1 shrink-0">
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Theme Settings
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "advanced"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Themes List
          </button>
        </div>
      </div>

      {activeTab === "settings" ? (
        settingsLoading ? (
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-12 text-center">
            <p className="text-indigo-400 animate-pulse font-medium text-sm">Loading settings panel...</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-210px)] overflow-hidden">
            {/* Control Panel */}
            <div className="w-full lg:w-[480px] bg-[#13131a] border border-[#1e1e2e] rounded-xl flex flex-col overflow-hidden shrink-0">
              {/* Default Theme Selector Header */}
              <div className="p-4 bg-[#161622] border-b border-[#1e1e2e] space-y-4 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Select default Theme</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 capitalize">
                    Default Mode: {activeThemeMode}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSetDefaultMode("light")}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      activeThemeMode === "light"
                        ? "bg-indigo-500/10 border-indigo-500 text-slate-100"
                        : "bg-[#0f0f14] border-[#1e1e2e] text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-lg">🌞</span>
                    <span className="text-xs font-bold">Light Mode Default</span>
                    <span className="text-[9px] text-slate-500 font-mono">elegance-light</span>
                  </button>

                  <button
                    onClick={() => handleSetDefaultMode("dark")}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      activeThemeMode === "dark"
                        ? "bg-indigo-500/10 border-indigo-500 text-slate-100"
                        : "bg-[#0f0f14] border-[#1e1e2e] text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-lg">🌙</span>
                    <span className="text-xs font-bold">Dark Mode Default</span>
                    <span className="text-[9px] text-slate-500 font-mono">royal-gold</span>
                  </button>
                </div>

                <div className="flex bg-[#0f0f14] border border-[#1e1e2e] rounded-md p-0.5">
                  <button
                    onClick={() => handleSwitchMode("light")}
                    className={`flex-1 py-1 rounded text-xs font-semibold capitalize transition-all cursor-pointer ${
                      editingMode === "light"
                        ? "bg-slate-800 text-slate-200"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Configure Light Theme
                  </button>
                  <button
                    onClick={() => handleSwitchMode("dark")}
                    className={`flex-1 py-1 rounded text-xs font-semibold capitalize transition-all cursor-pointer ${
                      editingMode === "dark"
                        ? "bg-slate-800 text-slate-200"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Configure Dark Theme
                  </button>
                </div>
              </div>

              {/* Settings Tab Selector */}
              <div className="flex border-b border-[#1e1e2e] bg-[#0c0c12] px-2 shrink-0">
                {(["colors", "typography", "layout", "branding", "components"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSettingsTab(tab)}
                    className={`flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                      settingsTab === tab
                        ? "border-indigo-500 text-indigo-400"
                        : "border-transparent text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {settingsError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs">
                    {settingsError}
                  </div>
                )}
                {settingsSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-xs">
                    Changes saved successfully! Active variables updated.
                  </div>
                )}

                {settingsTab === "colors" && (
                  <div className="space-y-4">
                    {/* WCAG Accessibility Metrics */}
                    <div className="bg-[#161622] border border-[#1e1e2e] p-3 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Contrast score checker</span>
                        <span className="text-xs font-bold text-slate-200 font-mono">{contrastRatio.toFixed(2)}:1</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                          isAANormal ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                        }`}>
                          WCAG AA: {isAANormal ? "PASS" : "FAIL"}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                          isAAA ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        }`}>
                          WCAG AAA: {isAAA ? "PASS" : "FAIL"}
                        </span>
                      </div>
                      {!isAANormal && (
                        <p className="text-[9px] text-red-400 font-medium pt-1">
                          ⚠️ Warning: Contrast between background & primary text is low. Re-adjust page background or primary text hex code.
                        </p>
                      )}
                      
                      <div className="pt-2 border-t border-[#1e1e2e] text-[9px] text-slate-400 flex justify-between">
                        <span>Suggested Hover State Color:</span>
                        <span className="font-mono text-slate-200 font-bold">{suggestedHoverColor}</span>
                      </div>
                    </div>

                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide border-b border-[#1e1e2e] pb-1.5">Color Palette</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {renderColorInput("colors", "primary", "Primary Accent")}
                      {renderColorInput("colors", "secondary", "Secondary Background")}
                      {renderColorInput("colors", "accent", "Accent Tone")}
                      {renderColorInput("colors", "background", "Page Background", true)}
                      {renderColorInput("colors", "surface", "Surface Backdrops")}
                      {renderColorInput("colors", "textPrimary", "Primary Text")}
                      {renderColorInput("colors", "textMuted", "Muted & Placeholder Text")}
                      {renderColorInput("colors", "border", "Border Color")}
                      {renderColorInput("colors", "success", "Success Accent")}
                      {renderColorInput("colors", "warning", "Warning Accent")}
                      {renderColorInput("colors", "error", "Error Accent")}
                    </div>
                  </div>
                )}

                {settingsTab === "typography" && (
                  <div className="space-y-4">
                    {/* Font Pairing Suggestions */}
                    <div className="bg-[#161622] border border-[#1e1e2e] p-3 rounded-lg space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Google Font Pairings</span>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { h: "Playfair Display", b: "Open Sans", desc: "Classic & Readable" },
                          { h: "Cormorant Garamond", b: "Jost", desc: "Luxury Serif & Geometric" },
                          { h: "Outfit", b: "Inter", desc: "Modern Tech & Clean Geometric" },
                        ].map((pair, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => applyFontPreset(pair.h, pair.b)}
                            className="flex justify-between items-center p-2 rounded bg-[#0f0f14] border border-[#1e1e2e] hover:border-indigo-500 text-left cursor-pointer transition-all"
                          >
                            <span className="text-[10px] text-slate-300 font-bold">{pair.h} / {pair.b}</span>
                            <span className="text-[8px] text-slate-500 uppercase font-bold">{pair.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide border-b border-[#1e1e2e] pb-1.5">Fonts & Layout</h3>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Heading Font</label>
                      <select
                        value={typography.headingFont || "Playfair Display"}
                        onChange={(e) => handleNestedChange("typography", "headingFont", e.target.value)}
                        className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Cormorant Garamond">Cormorant Garamond</option>
                        <option value="Inter">Inter</option>
                        <option value="Jost">Jost</option>
                        <option value="Outfit">Outfit</option>
                        <option value="Roboto">Roboto</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Body Font</label>
                      <select
                        value={typography.bodyFont || "Open Sans"}
                        onChange={(e) => handleNestedChange("typography", "bodyFont", e.target.value)}
                        className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Open Sans">Open Sans</option>
                        <option value="Inter">Inter</option>
                        <option value="Jost">Jost</option>
                        <option value="Outfit">Outfit</option>
                        <option value="Roboto">Roboto</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
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
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Letter Spacing</label>
                        <input
                          type="text"
                          value={typography.letterSpacing || "0em"}
                          onChange={(e) => handleNestedChange("typography", "letterSpacing", e.target.value)}
                          className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === "layout" && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide border-b border-[#1e1e2e] pb-1.5">Page Layout</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Container Width</label>
                        <input
                          type="text"
                          value={layout.containerWidth || "1200px"}
                          onChange={(e) => handleNestedChange("layout", "containerWidth", e.target.value)}
                          className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded px-2.5 py-1.5 text-xs text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Border Radius (Container)</label>
                        <input
                          type="text"
                          value={layout.borderRadius || "0.5rem"}
                          onChange={(e) => handleNestedChange("layout", "borderRadius", e.target.value)}
                          className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded px-2.5 py-1.5 text-xs text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Card Corner Radius</label>
                        <input
                          type="text"
                          value={layout.cardRadius || "0.5rem"}
                          onChange={(e) => handleNestedChange("layout", "cardRadius", e.target.value)}
                          className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded px-2.5 py-1.5 text-xs text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Button Corner Radius</label>
                        <input
                          type="text"
                          value={layout.buttonRadius || "9999px"}
                          onChange={(e) => handleNestedChange("layout", "buttonRadius", e.target.value)}
                          className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded px-2.5 py-1.5 text-xs text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Section Spacing</label>
                        <input
                          type="text"
                          value={layout.sectionSpacing || "6rem"}
                          onChange={(e) => handleNestedChange("layout", "sectionSpacing", e.target.value)}
                          className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded px-2.5 py-1.5 text-xs text-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === "branding" && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide border-b border-[#1e1e2e] pb-1.5">Branding Assets</h3>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase block">Light Background Logo</label>
                      {branding.logo && (
                        <div className="w-full h-16 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-2 mb-2">
                          <img src={branding.logo} alt="Logo" className="max-h-full object-contain" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)}
                        className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase block">Dark Background Logo</label>
                      {branding.darkLogo && (
                        <div className="w-full h-16 bg-slate-950 border border-[#1e1e2e] rounded-lg flex items-center justify-center p-2 mb-2">
                          <img src={branding.darkLogo} alt="Dark Logo" className="max-h-full object-contain" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setDarkLogoFile(e.target.files ? e.target.files[0] : null)}
                        className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase block">Favicon Icon</label>
                      {branding.favicon && (
                        <div className="w-8 h-8 bg-slate-900 border border-[#1e1e2e] rounded flex items-center justify-center p-1.5 mb-2">
                          <img src={branding.favicon} alt="Favicon" className="max-h-full object-contain" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFaviconFile(e.target.files ? e.target.files[0] : null)}
                        className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase block">Loading Logo Indicator</label>
                      {branding.loadingLogo && (
                        <div className="w-12 h-12 bg-slate-900 border border-[#1e1e2e] rounded flex items-center justify-center p-1.5 mb-2">
                          <img src={branding.loadingLogo} alt="Loading Logo" className="max-h-full object-contain" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLoadingLogoFile(e.target.files ? e.target.files[0] : null)}
                        className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                      />
                    </div>
                  </div>
                )}

                {settingsTab === "components" && (
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
                  </div>
                )}
              </div>

              {/* Bottom Actions footer */}
              <div className="p-4 bg-[#161622] border-t border-[#1e1e2e] flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={handleResetSettings}
                  className="px-4 py-2 border border-slate-700 hover:border-slate-600 rounded-lg text-sm font-semibold text-slate-200 transition-colors bg-[#13131a]"
                >
                  Reset Defaults
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={settingsSaving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {settingsSaving ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>

            {/* Live Preview Panel */}
            <div className="flex-1 bg-[#13131a] border border-[#1e1e2e] rounded-xl flex flex-col overflow-hidden">
              <div className="bg-[#161622] border-b border-[#1e1e2e] px-4 py-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Live Preview</span>
                  <select
                    value={previewPath}
                    onChange={(e) => setPreviewPath(e.target.value)}
                    className="bg-[#0f0f14] border border-[#1e1e2e] rounded px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="/">Home Page (/)</option>
                    <option value="/projects">Projects Page (/projects)</option>
                    <option value="/decoding-land">Decoding Land (/decoding-land)</option>
                    <option value="/about-us">About Us Page (/about-us)</option>
                  </select>
                </div>
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

              <div className="flex-1 bg-[#09090e] p-6 flex items-center justify-center overflow-auto">
                <div
                  className="border border-[#1e1e2e] overflow-hidden transition-all duration-300 shadow-2xl relative bg-slate-950"
                  style={{
                    width: viewportMode === "mobile" ? "360px" : viewportMode === "tablet" ? "768px" : "100%",
                    height: viewportMode === "mobile" ? "640px" : viewportMode === "tablet" ? "1024px" : "100%",
                    borderRadius: viewportMode === "mobile" ? "1.5rem" : viewportMode === "tablet" ? "1rem" : "0.75rem",
                  }}
                >
                  <iframe
                    ref={iframeRef}
                    src={previewPath}
                    onLoad={handleIframeLoad}
                    className="w-full h-full border-0 bg-transparent"
                    title="Real Theme Live Preview"
                  />
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        /* Original themes list rendering block (All Themes List) */
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="flex w-full md:w-auto items-center gap-2">
              <input
                type="text"
                placeholder="Search themes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64 bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-200 transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                  setPage(1);
                }}
                className="bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>

              <div className="border border-[#1e1e2e] rounded-lg p-0.5 flex bg-[#0f0f14]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md cursor-pointer ${viewMode === "grid" ? "bg-indigo-500/20 text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}
                  title="Grid View"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md cursor-pointer ${viewMode === "list" ? "bg-indigo-500/20 text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}
                  title="List View"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create Theme
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl h-48 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center">
              {error}
            </div>
          ) : themes.length === 0 ? (
            <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-12 text-center">
              <p className="text-slate-400">No themes found. Click "Create Theme" to get started.</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <div key={theme.id} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between">
                  {/* Color Stripes Preview */}
                  <div className="h-44 w-full flex flex-col shrink-0">
                    <div className="h-[40%] w-full transition-all hover:opacity-90" style={{ backgroundColor: theme.colors?.primary || "#3f51b5" }} />
                    <div className="h-[25%] w-full transition-all hover:opacity-90" style={{ backgroundColor: theme.colors?.secondary || "#303f9f" }} />
                    <div className="h-[20%] w-full transition-all hover:opacity-90" style={{ backgroundColor: theme.colors?.accent || "#ff4081" }} />
                    <div className="h-[15%] w-full transition-all hover:opacity-90" style={{ backgroundColor: theme.colors?.background || "#ffffff" }} />
                  </div>

                  <div className="p-4 bg-[#161622] flex flex-col gap-1.5 border-t border-[#1e1e2e]/50">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5 truncate">
                        {theme.name}
                      </h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {theme.status === "ACTIVE" && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 font-semibold">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500">Slug: {theme.slug}</p>
                  </div>

                  <div className="border-t border-[#1e1e2e] bg-[#161622] px-5 py-3.5 flex justify-between items-center gap-2">
                    <Link
                      href={`/admin/themes/edit/${theme.id}`}
                      className="px-3.5 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/25 text-indigo-400 rounded-lg text-xs font-semibold no-underline transition-colors"
                    >
                      Edit Theme
                    </Link>
                    <div className="flex items-center gap-1">
                      {theme.status !== "ACTIVE" && (
                        <button
                          onClick={() => handlePublish(theme.id)}
                          className="p-1.5 hover:bg-emerald-500/15 text-slate-400 hover:text-emerald-400 rounded transition-colors cursor-pointer"
                          title="Publish Theme"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDuplicate(theme.id)}
                        className="p-1.5 hover:bg-slate-500/10 text-slate-400 hover:text-slate-200 rounded transition-colors cursor-pointer"
                        title="Duplicate Theme"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleExport(theme)}
                        className="p-1.5 hover:bg-slate-500/10 text-slate-400 hover:text-slate-200 rounded transition-colors cursor-pointer"
                        title="Export JSON"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      {theme.status !== "ACTIVE" && (
                        <button
                          onClick={() => {
                            setConfirmDeleteId(theme.id);
                            setConfirmDeleteName(theme.name);
                          }}
                          className="p-1.5 hover:bg-red-500/15 text-slate-400 hover:text-red-400 rounded transition-colors cursor-pointer"
                          title="Delete Theme"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
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
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Slug</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e2e]">
                  {themes.map((theme) => (
                    <tr key={theme.id} className="hover:bg-[#161622]/50 text-slate-300">
                      <td className="py-4 px-6 font-bold text-slate-100 flex items-center gap-2">
                        {theme.name}
                        {theme.status === "ACTIVE" && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30`}>
                          {theme.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400">{theme.slug}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/themes/edit/${theme.id}`}
                            className="p-1.5 hover:bg-indigo-500/15 text-slate-400 hover:text-indigo-400 rounded transition-colors"
                            title="Edit Theme"
                          >
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </Link>
                          {theme.status !== "ACTIVE" && (
                            <button
                              onClick={() => handlePublish(theme.id)}
                              className="p-1.5 hover:bg-emerald-500/15 text-slate-400 hover:text-emerald-400 rounded transition-colors cursor-pointer"
                              title="Publish Theme"
                            >
                              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => handleDuplicate(theme.id)}
                            className="p-1.5 hover:bg-slate-500/10 text-slate-400 hover:text-slate-200 rounded transition-colors cursor-pointer"
                            title="Duplicate Theme"
                          >
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleExport(theme)}
                            className="p-1.5 hover:bg-slate-500/10 text-slate-400 hover:text-slate-200 rounded transition-colors cursor-pointer"
                            title="Export JSON"
                          >
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                          {theme.status !== "ACTIVE" && (
                            <button
                              onClick={() => {
                                setConfirmDeleteId(theme.id);
                                setConfirmDeleteName(theme.name);
                              }}
                              className="p-1.5 hover:bg-red-500/15 text-slate-400 hover:text-red-400 rounded transition-colors cursor-pointer"
                              title="Delete Theme"
                            >
                              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4">
              <p className="text-xs text-slate-500">
                Showing page {page} of {totalPages} ({totalItems} total themes)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Theme Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Theme">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {createError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
              {createError}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Theme Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Elegant Gold Theme"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Slug (Optional)</label>
            <input
              type="text"
              placeholder="e.g. elegant-gold"
              value={createSlug}
              onChange={(e) => setCreateSlug(e.target.value)}
              className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Description</label>
            <textarea
              placeholder="Provide a description of the theme styling..."
              value={createDescription}
              onChange={(e) => setCreateDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Notes</label>
            <input
              type="text"
              placeholder="Notes..."
              value={createNotes}
              onChange={(e) => setCreateNotes(e.target.value)}
              className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {createSubmitting ? "Creating..." : "Create Theme"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)} title="Delete Theme">
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete the theme <strong className="text-slate-100">"{confirmDeleteName}"</strong>? This action is permanent and cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirmDeleteId(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={actionSubmitting}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {actionSubmitting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
