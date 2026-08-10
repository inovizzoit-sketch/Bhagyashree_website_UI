"use client";

import React, { useEffect, useState } from "react";
import {
  FooterSettings,
  FooterLink,
  FooterSocial,
} from "../types/footer.types";
import {
  getFooterSettings,
  updateFooterSettings,
  getFooterLinks,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,
  getFooterSocials,
  createFooterSocial,
  updateFooterSocial,
  deleteFooterSocial,
} from "../services/footer.service";
import { API_BASE_URL } from "@/shared/lib/api-config";

export default function FooterPage() {
  const [activeTab, setActiveTab] = useState<"settings" | "links" | "socials">("settings");

  // States
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [socials, setSocials] = useState<FooterSocial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Settings fields
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [copyrightText, setCopyrightText] = useState("");
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState("");
  const [termsOfServiceUrl, setTermsOfServiceUrl] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [isActiveSettings, setIsActiveSettings] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bottomLogoFile, setBottomLogoFile] = useState<File | null>(null);

  // Link Modal
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkOpenInNewTab, setLinkOpenInNewTab] = useState(false);
  const [linkSortOrder, setLinkSortOrder] = useState(0);
  const [linkIsActive, setLinkIsActive] = useState(true);

  // Social Modal
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [socialPlatform, setSocialPlatform] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [socialIcon, setSocialIcon] = useState("");
  const [socialSortOrder, setSocialSortOrder] = useState(0);
  const [socialIsActive, setSocialIsActive] = useState(true);

  function resetSettingsForm() {
    if (settings) {
      setCompanyName(settings.companyName || "");
      setDescription(settings.description || "");
      setAddress(settings.address || "");
      setPhone(settings.phone || "");
      setEmail(settings.email || "");
      setCopyrightText(settings.copyrightText || "");
      setPrivacyPolicyUrl(settings.privacyPolicyUrl || "");
      setTermsOfServiceUrl(settings.termsOfServiceUrl || "");
      setBackgroundColor(settings.backgroundColor || "#020215");
      setTextColor(settings.textColor || "#ffffff");
      setAccentColor(settings.accentColor || "#d4af37");
      setIsActiveSettings(settings.isActive !== false);
      setLogoFile(null);
      setBottomLogoFile(null);
    }
    setIsEditing(false);
  }

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    setError(null);
    try {
      const [settingsData, linksData, socialsData] = await Promise.all([
        getFooterSettings(),
        getFooterLinks(),
        getFooterSocials(),
      ]);

      setSettings(settingsData);
      setCompanyName(settingsData.companyName || "");
      setDescription(settingsData.description || "");
      setAddress(settingsData.address || "");
      setPhone(settingsData.phone || "");
      setEmail(settingsData.email || "");
      setCopyrightText(settingsData.copyrightText || "");
      setPrivacyPolicyUrl(settingsData.privacyPolicyUrl || "");
      setTermsOfServiceUrl(settingsData.termsOfServiceUrl || "");
      setBackgroundColor(settingsData.backgroundColor || "#020215");
      setTextColor(settingsData.textColor || "#ffffff");
      setAccentColor(settingsData.accentColor || "#d4af37");
      setIsActiveSettings(settingsData.isActive !== false);

      setLinks(linksData);
      setSocials(socialsData);
    } catch (err: any) {
      setError(err.message || "Failed to load footer configuration");
    } finally {
      setLoading(false);
    }
  }

  // --- Actions Settings ---
  async function handleUpdateSettings(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("copyrightText", copyrightText);
    formData.append("privacyPolicyUrl", privacyPolicyUrl);
    formData.append("termsOfServiceUrl", termsOfServiceUrl);
    formData.append("backgroundColor", backgroundColor);
    formData.append("textColor", textColor);
    formData.append("accentColor", accentColor);
    formData.append("isActive", String(isActiveSettings));

    if (logoFile) {
      formData.append("logo", logoFile);
    }
    if (bottomLogoFile) {
      formData.append("bottomLogo", bottomLogoFile);
    }

    try {
      const updated = await updateFooterSettings(formData);
      setSettings(updated);
      setSuccessMsg("Footer settings updated successfully!");
      setLogoFile(null);
      setBottomLogoFile(null);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update settings");
    } finally {
      setSubmitting(false);
    }
  }

  // --- Actions Links ---
  function handleOpenLinkCreate() {
    setEditingLinkId(null);
    setLinkTitle("");
    setLinkUrl("");
    setLinkOpenInNewTab(false);
    setLinkSortOrder(0);
    setLinkIsActive(true);
    setLinkModalOpen(true);
  }

  function handleOpenLinkEdit(link: FooterLink) {
    setEditingLinkId(link.id);
    setLinkTitle(link.title);
    setLinkUrl(link.url);
    setLinkOpenInNewTab(link.openInNewTab);
    setLinkSortOrder(link.sortOrder);
    setLinkIsActive(link.isActive);
    setLinkModalOpen(true);
  }

  async function handleLinkSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const dto = {
      title: linkTitle,
      url: linkUrl,
      openInNewTab: linkOpenInNewTab,
      sortOrder: Number(linkSortOrder),
      isActive: linkIsActive,
    };

    try {
      if (editingLinkId) {
        await updateFooterLink(editingLinkId, dto);
      } else {
        await createFooterLink(dto);
      }
      setLinkModalOpen(false);
      const linksData = await getFooterLinks();
      setLinks(linksData);
    } catch (err: any) {
      setError(err.message || "Failed to save link");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLinkDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete link "${title}"?`)) return;
    try {
      await deleteFooterLink(id);
      const linksData = await getFooterLinks();
      setLinks(linksData);
    } catch (err: any) {
      alert(err.message || "Failed to delete link");
    }
  }

  // --- Actions Socials ---
  function handleOpenSocialCreate() {
    setEditingSocialId(null);
    setSocialPlatform("");
    setSocialUrl("");
    setSocialIcon("");
    setSocialSortOrder(0);
    setSocialIsActive(true);
    setSocialModalOpen(true);
  }

  function handleOpenSocialEdit(social: FooterSocial) {
    setEditingSocialId(social.id);
    setSocialPlatform(social.platform);
    setSocialUrl(social.url);
    setSocialIcon(social.icon || "");
    setSocialSortOrder(social.sortOrder);
    setSocialIsActive(social.isActive);
    setSocialModalOpen(true);
  }

  async function handleSocialSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const dto = {
      platform: socialPlatform,
      url: socialUrl,
      icon: socialIcon || undefined,
      sortOrder: Number(socialSortOrder),
      isActive: socialIsActive,
    };

    try {
      if (editingSocialId) {
        await updateFooterSocial(editingSocialId, dto);
      } else {
        await createFooterSocial(dto);
      }
      setSocialModalOpen(false);
      const socialsData = await getFooterSocials();
      setSocials(socialsData);
    } catch (err: any) {
      setError(err.message || "Failed to save social link");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSocialDelete(id: string, platform: string) {
    if (!confirm(`Are you sure you want to delete social profile for "${platform}"?`)) return;
    try {
      await deleteFooterSocial(id);
      const socialsData = await getFooterSocials();
      setSocials(socialsData);
    } catch (err: any) {
      alert(err.message || "Failed to delete social profile");
    }
  }

  const formatImageUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = API_BASE_URL.replace("/api/v1", "");
    return `${base}${url}`;
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Footer Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure global website footer settings, navigation links, and social connections.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1e1e2e] gap-4">
        <button
          onClick={() => { setActiveTab("settings"); setError(null); setSuccessMsg(null); }}
          className={`pb-2.5 text-sm font-semibold tracking-wide transition-colors cursor-pointer border-b-2 bg-transparent border-none ${activeTab === "settings"
              ? "border-gold-solid text-gold-solid"
              : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
        >
          Global Settings
        </button>
        <button
          onClick={() => { setActiveTab("links"); setError(null); setSuccessMsg(null); }}
          className={`pb-2.5 text-sm font-semibold tracking-wide transition-colors cursor-pointer border-b-2 bg-transparent border-none ${activeTab === "links"
              ? "border-gold-solid text-gold-solid"
              : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
        >
          Quick Links
        </button>
        <button
          onClick={() => { setActiveTab("socials"); setError(null); setSuccessMsg(null); }}
          className={`pb-2.5 text-sm font-semibold tracking-wide transition-colors cursor-pointer border-b-2 bg-transparent border-none ${activeTab === "socials"
              ? "border-gold-solid text-gold-solid"
              : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
        >
          Social Accounts
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400">
          ⚠️ {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-sm text-emerald-400">
          ✓ {successMsg}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-8 h-8 border-2 border-gold-solid/20 border-t-gold-solid rounded-full animate-spin" />
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Loading settings...
          </p>
        </div>
      ) : (
        <>
          {/* TAB 1: SETTINGS */}
          {activeTab === "settings" && (
            <form onSubmit={handleUpdateSettings} className="space-y-4">
              <fieldset disabled={!isEditing} className="border-0 p-0 m-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Branding Card */}
                <div className="p-4 border border-[#1e1e2e] bg-[#13131a] rounded-2xl space-y-3 shadow-xl">
                  <h3 className="text-lg font-bold text-slate-200 border-b border-[#1e1e2e] pb-2">Branding</h3>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Bhagyashree Enterprises"
                      required
                      className="w-full bg-[#181824] border border-[#1e1e2e] rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-gold-solid/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Write footer company summary description..."
                      rows={4}
                      className="w-full bg-[#181824] border border-[#1e1e2e] rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-gold-solid/50 transition-colors resize-none"
                    />
                  </div>

                  {/* Logo Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Footer Logo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#181824] file:text-slate-300 hover:file:bg-[#202030] cursor-pointer"
                      />
                      {settings?.logoUrl && (
                        <div className="mt-2 h-10 w-32 border border-[#1e1e2e] bg-[#181824] rounded-lg overflow-hidden flex items-center justify-center p-1">
                          <img src={formatImageUrl(settings.logoUrl)} alt="Logo Preview" className="h-full w-auto object-contain" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Bottom Logo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setBottomLogoFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#181824] file:text-slate-300 hover:file:bg-[#202030] cursor-pointer"
                      />
                      {settings?.bottomLogoUrl && (
                        <div className="mt-2 h-10 w-32 border border-[#1e1e2e] bg-[#181824] rounded-lg overflow-hidden flex items-center justify-center p-1">
                          <img src={formatImageUrl(settings.bottomLogoUrl)} alt="Bottom Logo Preview" className="h-full w-auto object-contain" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="p-4 border border-[#1e1e2e] bg-[#13131a] rounded-2xl space-y-3 shadow-xl">
                  <h3 className="text-lg font-bold text-slate-200 border-b border-[#1e1e2e] pb-2">Contact Details</h3>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Rohaniya, Varanasi"
                      className="w-full bg-[#181824] border border-[#1e1e2e] rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-gold-solid/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 95196 62111"
                      className="w-full bg-[#181824] border border-[#1e1e2e] rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-gold-solid/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. contact@bhagyashree.com"
                      className="w-full bg-[#181824] border border-[#1e1e2e] rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-gold-solid/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Copyright Text</label>
                    <input
                      type="text"
                      value={copyrightText}
                      onChange={(e) => setCopyrightText(e.target.value)}
                      placeholder="e.g. © 2026 Bhagyashree Enterprises."
                      className="w-full bg-[#181824] border border-[#1e1e2e] rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-gold-solid/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Policies & URLs Card */}
                <div className="p-4 border border-[#1e1e2e] bg-[#13131a] rounded-2xl space-y-3 shadow-xl">
                  <h3 className="text-lg font-bold text-slate-200 border-b border-[#1e1e2e] pb-2">Policy Configurations</h3>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Privacy Policy URL</label>
                    <input
                      type="text"
                      value={privacyPolicyUrl}
                      onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
                      placeholder="e.g. /privacy-policy"
                      className="w-full bg-[#181824] border border-[#1e1e2e] rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-gold-solid/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Terms of Service URL</label>
                    <input
                      type="text"
                      value={termsOfServiceUrl}
                      onChange={(e) => setTermsOfServiceUrl(e.target.value)}
                      placeholder="e.g. /terms"
                      className="w-full bg-[#181824] border border-[#1e1e2e] rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-gold-solid/50 transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="isActiveSettings"
                      checked={isActiveSettings}
                      onChange={(e) => setIsActiveSettings(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-[#1e1e2e] bg-[#181824] text-gold-solid focus:ring-gold-solid/30 cursor-pointer"
                    />
                    <label htmlFor="isActiveSettings" className="text-sm font-semibold text-slate-200 cursor-pointer select-none">
                      Enable / Render Footer globally
                    </label>
                  </div>
                </div>

                {/* Theme Customizer Card */}
                <div className="p-4 border border-[#1e1e2e] bg-[#13131a] rounded-2xl space-y-3 shadow-xl">
                  <h3 className="text-lg font-bold text-slate-200 border-b border-[#1e1e2e] pb-2">Custom Color Palette</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Background</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-8 h-8 border-none bg-transparent outline-none cursor-pointer"
                        />
                        <input
                          type="text"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-full bg-[#181824] border border-[#1e1e2e] rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-gold-solid/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Text</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-8 h-8 border-none bg-transparent outline-none cursor-pointer"
                        />
                        <input
                          type="text"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-full bg-[#181824] border border-[#1e1e2e] rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-gold-solid/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Accent Accent</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-8 h-8 border-none bg-transparent outline-none cursor-pointer"
                        />
                        <input
                          type="text"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-full bg-[#181824] border border-[#1e1e2e] rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-gold-solid/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                </div>
              </fieldset>

              {/* Submit panel */}
              <div className="flex justify-end pt-3 gap-3">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-[#1c1c27] hover:bg-[#252535] text-slate-300 rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer active:scale-[0.98] border border-[#1e1e2e]"
                  >
                    Edit Settings
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={resetSettingsForm}
                      className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer active:scale-[0.98] shadow-lg shadow-gold-solid/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Saving..." : "Save Settings"}
                    </button>
                  </>
                )}
              </div>
            </form>
          )}

          {/* TAB 2: LINKS */}
          {activeTab === "links" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-200">Footer Links</h3>
                <button
                  onClick={handleOpenLinkCreate}
                  className="px-4 py-2 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-xs font-bold tracking-wide transition-colors cursor-pointer"
                >
                  + Add Link
                </button>
              </div>

              {links.length === 0 ? (
                <div className="border border-[#1e1e2e] bg-[#13131a] rounded-2xl p-12 text-center space-y-4">
                  <span className="text-3xl block">🔗</span>
                  <h3 className="text-base font-bold text-slate-200">No Links Configured</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Manage link headers or subpages inside your website footer here.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden border border-[#1e1e2e] bg-[#13131a] rounded-2xl shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-[#1e1e2e] bg-[#181824] text-slate-400 font-semibold tracking-wider text-xs uppercase">
                          <th className="px-6 py-4">Title</th>
                          <th className="px-6 py-4">URL</th>
                          <th className="px-6 py-4">New Tab</th>
                          <th className="px-6 py-4">Sort Order</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e1e2e] text-slate-300">
                        {links.map((link) => (
                          <tr key={link.id} className="hover:bg-[#181824]/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-slate-200">{link.title}</td>
                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">{link.url}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded text-xs ${link.openInNewTab ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-500/10 text-slate-400"}`}>
                                {link.openInNewTab ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs">{link.sortOrder}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${link.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${link.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                                {link.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              <button
                                onClick={() => handleOpenLinkEdit(link)}
                                className="px-2.5 py-1.5 bg-[#181824] hover:bg-gold-solid/10 border border-[#1e1e2e] hover:border-gold-solid/30 text-xs font-bold text-slate-300 hover:text-gold-solid rounded-lg transition-colors cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleLinkDelete(link.id, link.title)}
                                className="px-2.5 py-1.5 bg-[#181824] hover:bg-red-500/10 border border-[#1e1e2e] hover:border-red-500/30 text-xs font-bold text-slate-300 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
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
            </div>
          )}

          {/* TAB 3: SOCIALS */}
          {activeTab === "socials" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-200">Social Accounts</h3>
                <button
                  onClick={handleOpenSocialCreate}
                  className="px-4 py-2 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-xs font-bold tracking-wide transition-colors cursor-pointer"
                >
                  + Add Social Handle
                </button>
              </div>

              {socials.length === 0 ? (
                <div className="border border-[#1e1e2e] bg-[#13131a] rounded-2xl p-12 text-center space-y-4">
                  <span className="text-3xl block">📱</span>
                  <h3 className="text-base font-bold text-slate-200">No Social Accounts</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Connect social media profiles to appear in the footer.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden border border-[#1e1e2e] bg-[#13131a] rounded-2xl shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-[#1e1e2e] bg-[#181824] text-slate-400 font-semibold tracking-wider text-xs uppercase">
                          <th className="px-6 py-4">Platform</th>
                          <th className="px-6 py-4">Profile URL</th>
                          <th className="px-6 py-4">Icon Reference</th>
                          <th className="px-6 py-4">Sort Order</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e1e2e] text-slate-300">
                        {socials.map((social) => (
                          <tr key={social.id} className="hover:bg-[#181824]/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-slate-200">{social.platform}</td>
                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">{social.url}</td>
                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">{social.icon || "-"}</td>
                            <td className="px-6 py-4 font-mono text-xs">{social.sortOrder}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${social.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${social.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                                {social.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              <button
                                onClick={() => handleOpenSocialEdit(social)}
                                className="px-2.5 py-1.5 bg-[#181824] hover:bg-gold-solid/10 border border-[#1e1e2e] hover:border-gold-solid/30 text-xs font-bold text-slate-300 hover:text-gold-solid rounded-lg transition-colors cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleSocialDelete(social.id, social.platform)}
                                className="px-2.5 py-1.5 bg-[#181824] hover:bg-red-500/10 border border-[#1e1e2e] hover:border-red-500/30 text-xs font-bold text-slate-300 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
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
            </div>
          )}
          {/* Live UI Preview Section */}
          <div className="mt-8 space-y-3">
            <div className="border-t border-[#1e1e2e] pt-6">
              <h3 className="text-lg font-bold text-slate-200">Live Footer Preview</h3>
              <p className="text-xs text-slate-400">This is how the footer will appear on the live website (showing pending form changes).</p>
            </div>

            <div className="border border-[#1e1e2e] bg-[#09090d] rounded-2xl overflow-hidden shadow-2xl">
              <footer
                className="border-t border-white/5 py-8 text-[12px] md:text-xs text-slate-400"
                style={{ backgroundColor: backgroundColor || "#010314", color: textColor || undefined }}
              >
                <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Column 1: Brand Info */}
                  <div className="md:col-span-6 space-y-4">
                    <div className="flex items-center">
                      <img
                        src={logoFile ? URL.createObjectURL(logoFile) : (settings?.logoUrl ? formatImageUrl(settings.logoUrl) : "/logo.png")}
                        alt="Logo Preview"
                        className="h-8 w-auto object-contain"
                      />
                    </div>
                    {description && (
                      <p className="text-[12px] text-slate-400 leading-relaxed font-light max-w-md">
                        {description}
                      </p>
                    )}

                    {/* Social Links Row */}
                    {socials.filter(s => s.isActive).length > 0 && (
                      <div className="flex items-center gap-3 pt-2">
                        {socials.filter(s => s.isActive).map((social) => {
                          const iconKey = (social.icon || social.platform || "").toLowerCase();
                          let svgElement = (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="2" y1="12" x2="22" y2="12" />
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                          );

                          if (iconKey.includes("facebook")) {
                            svgElement = (
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                              </svg>
                            );
                          } else if (iconKey.includes("instagram")) {
                            svgElement = (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                              </svg>
                            );
                          } else if (iconKey.includes("twitter") || iconKey === "x") {
                            svgElement = (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                              </svg>
                            );
                          } else if (iconKey.includes("linkedin")) {
                            svgElement = (
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                              </svg>
                            );
                          } else if (iconKey.includes("youtube")) {
                            svgElement = (
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                              </svg>
                            );
                          }

                          return (
                            <div
                              key={social.id}
                              className="w-7 h-7 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-slate-300"
                            >
                              {svgElement}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Column 2: Navigation Links */}
                  <div className="md:col-span-2 space-y-3">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider block font-mono">Quick Links</span>
                    <nav className="flex flex-col gap-1.5 font-light">
                      {links.filter(l => l.isActive).map((link) => (
                        <span
                          key={link.id}
                          className="hover:text-gold-solid transition-colors cursor-pointer"
                          style={{ color: accentColor || undefined }}
                        >
                          {link.title}
                        </span>
                      ))}
                    </nav>
                  </div>

                  {/* Column 3: Contacts */}
                  <div className="md:col-span-4 space-y-3">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider block font-mono">Contact Details</span>
                    <div className="space-y-2 font-light">
                      {address && (
                        <div className="flex items-start gap-2">
                          <span style={{ color: accentColor || undefined }}>📍</span>
                          <span className="leading-relaxed">{address}</span>
                        </div>
                      )}
                      {phone && (
                        <div className="flex items-center gap-2">
                          <span style={{ color: accentColor || undefined }}>📞</span>
                          <span>{phone}</span>
                        </div>
                      )}
                      {email && (
                        <div className="flex items-center gap-2">
                          <span style={{ color: accentColor || undefined }}>✉️</span>
                          <span>{email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
                  <p>© {new Date().getFullYear()} {companyName || "Bhagyashree Enterprises"}. All rights reserved.</p>
                  <p className="flex gap-4 font-light">
                    <span className="hover:text-gold-solid cursor-pointer">Privacy Policy</span>
                    <span className="hover:text-gold-solid cursor-pointer">Terms of Service</span>
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </>
      )}

      {/* MODAL 1: FOOTER LINK MODAL */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#13131a] border border-[#1e1e2e] rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <header className="px-6 py-5 border-b border-[#1e1e2e] flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100">
                {editingLinkId ? "Edit Footer Link" : "Add Footer Link"}
              </h3>
              <button
                onClick={() => setLinkModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 outline-none text-lg"
              >
                ✕
              </button>
            </header>

            <form onSubmit={handleLinkSubmit} className="p-4 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Link Title</label>
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="e.g. Contact Us"
                  required
                  className="w-full bg-[#181824] border border-[#1e1e2e] rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-solid/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">URL / Path</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="e.g. /contact-us or https://external.com"
                  required
                  className="w-full bg-[#181824] border border-[#1e1e2e] rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-solid/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sort Order</label>
                <input
                  type="number"
                  value={linkSortOrder}
                  onChange={(e) => setLinkSortOrder(Number(e.target.value))}
                  required
                  className="w-full bg-[#181824] border border-[#1e1e2e] rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-solid/50"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="linkOpenInNewTab"
                  checked={linkOpenInNewTab}
                  onChange={(e) => setLinkOpenInNewTab(e.target.checked)}
                  className="w-4 h-4 rounded border-[#1e1e2e] bg-[#181824] text-gold-solid focus:ring-gold-solid/30 cursor-pointer"
                />
                <label htmlFor="linkOpenInNewTab" className="text-sm font-medium text-slate-200 cursor-pointer select-none">
                  Open in New Tab
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="linkIsActive"
                  checked={linkIsActive}
                  onChange={(e) => setLinkIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-[#1e1e2e] bg-[#181824] text-gold-solid focus:ring-gold-solid/30 cursor-pointer"
                />
                <label htmlFor="linkIsActive" className="text-sm font-medium text-slate-200 cursor-pointer select-none">
                  Active
                </label>
              </div>

              <footer className="pt-4 border-t border-[#1e1e2e] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="px-4 py-2 border border-[#1e1e2e] hover:bg-[#181824] text-xs font-bold text-slate-300 rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-gold-solid hover:bg-gold-hover text-[#020520] text-xs font-bold rounded-lg cursor-pointer transition-all disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Link"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FOOTER SOCIAL MODAL */}
      {socialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#13131a] border border-[#1e1e2e] rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <header className="px-6 py-5 border-b border-[#1e1e2e] flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100">
                {editingSocialId ? "Edit Social Account" : "Add Social Account"}
              </h3>
              <button
                onClick={() => setSocialModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 outline-none text-lg"
              >
                ✕
              </button>
            </header>

            <form onSubmit={handleSocialSubmit} className="p-4 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Platform Name</label>
                <input
                  type="text"
                  value={socialPlatform}
                  onChange={(e) => setSocialPlatform(e.target.value)}
                  placeholder="e.g. Facebook, Instagram"
                  required
                  className="w-full bg-[#181824] border border-[#1e1e2e] rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-solid/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Profile URL</label>
                <input
                  type="text"
                  value={socialUrl}
                  onChange={(e) => setSocialUrl(e.target.value)}
                  placeholder="e.g. https://instagram.com/bhagyashree"
                  required
                  className="w-full bg-[#181824] border border-[#1e1e2e] rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-solid/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Icon Key (Optional)</label>
                <input
                  type="text"
                  value={socialIcon}
                  onChange={(e) => setSocialIcon(e.target.value)}
                  placeholder="e.g. facebook, instagram, linkedin, twitter"
                  className="w-full bg-[#181824] border border-[#1e1e2e] rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-solid/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sort Order</label>
                <input
                  type="number"
                  value={socialSortOrder}
                  onChange={(e) => setSocialSortOrder(Number(e.target.value))}
                  required
                  className="w-full bg-[#181824] border border-[#1e1e2e] rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-solid/50"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="socialIsActive"
                  checked={socialIsActive}
                  onChange={(e) => setSocialIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-[#1e1e2e] bg-[#181824] text-gold-solid focus:ring-gold-solid/30 cursor-pointer"
                />
                <label htmlFor="socialIsActive" className="text-sm font-medium text-slate-200 cursor-pointer select-none">
                  Active
                </label>
              </div>

              <footer className="pt-4 border-t border-[#1e1e2e] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSocialModalOpen(false)}
                  className="px-4 py-2 border border-[#1e1e2e] hover:bg-[#181824] text-xs font-bold text-slate-300 rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-gold-solid hover:bg-gold-hover text-[#020520] text-xs font-bold rounded-lg cursor-pointer transition-all disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Social"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
