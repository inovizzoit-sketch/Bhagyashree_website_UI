"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Template,
  TemplateType,
  TemplateStatus,
  EventType,
  TemplateCategory,
} from "../types";
import {
  createTemplate,
  updateTemplate,
  getTemplateCategories,
  previewTemplate,
  testTemplate,
} from "../services/template.service";

interface TemplateFormProps {
  template?: Template;
}

const AVAILABLE_VARIABLES = [
  { key: "{{project_name}}", label: "Project Name" },
  { key: "{{address}}", label: "Full Address" },
  { key: "{{location}}", label: "Area / Location" },
  { key: "{{city}}", label: "City" },
  { key: "{{starting_price}}", label: "Starting Price" },
  { key: "{{price_per_sqft}}", label: "Price / Sqft" },
  { key: "{{project_status}}", label: "Project Status" },
  { key: "{{project_type}}", label: "Project Type" },
  { key: "{{short_description}}", label: "Short Description" },
  { key: "{{project_url}}", label: "Project Detail URL" },
  { key: "{{company_name}}", label: "Company Name" },
  { key: "{{name}}", label: "Recipient Name" },
  { key: "{{email}}", label: "Email Address" },
  { key: "{{phone}}", label: "Phone Number" },
  { key: "{{sales_person}}", label: "Sales Representative" },
  { key: "{{site_visit_date}}", label: "Site Visit Date" },
  { key: "{{current_date}}", label: "Current Date" },
];

export default function TemplateForm({ template }: TemplateFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Categories list
  const [categories, setCategories] = useState<TemplateCategory[]>([]);

  // Form State
  const [name, setName] = useState(template?.name || "");
  const [slug, setSlug] = useState(template?.slug || "");
  const [type, setType] = useState<TemplateType>(template?.type || "EMAIL");
  const [subject, setSubject] = useState(template?.subject || "");
  const [content, setContent] = useState(template?.content || "");
  const [description, setDescription] = useState(template?.description || "");
  const [status, setStatus] = useState<TemplateStatus>(
    typeof template?.status === "string" ? (template.status as TemplateStatus) : "ACTIVE"
  );
  const [eventType, setEventType] = useState<EventType>(template?.eventType || "NONE");
  const [categoryId, setCategoryId] = useState(template?.categoryId || "");
  const [isDefault, setIsDefault] = useState(template?.isDefault ?? false);

  // Live Preview State
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [renderedSubject, setRenderedSubject] = useState<string | null>(null);
  const [renderedContent, setRenderedContent] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);

  // Test Runner State
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testRecipient, setTestRecipient] = useState("admin@nandeekacms.com");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const cats = await getTemplateCategories();
      setCategories(cats);
    } catch (err: any) {
      console.error("Failed to load categories:", err);
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!template) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  function insertVariable(variableKey: string) {
    setContent((prev) => prev + " " + variableKey);
  }

  async function handleTabChange(tab: "edit" | "preview") {
    setActiveTab(tab);
    if (tab === "preview" && content.trim()) {
      try {
        setPreviewLoading(true);
        const res = await previewTemplate({
          subject,
          content,
        });
        setRenderedSubject(res.renderedSubject || null);
        setRenderedContent(res.renderedContent);
      } catch (err: any) {
        console.error("Preview error:", err);
      } finally {
        setPreviewLoading(false);
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Template content cannot be empty.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        name,
        slug,
        type,
        subject,
        content,
        description,
        status,
        eventType,
        categoryId: categoryId || undefined,
        isDefault,
      };

      if (template) {
        await updateTemplate(template.id, payload);
      } else {
        await createTemplate(payload);
      }

      router.push("/admin/templates");
    } catch (err: any) {
      setError(err.message || "Failed to save template");
      setSubmitting(false);
    }
  };

  async function handleTestSend(e: React.FormEvent) {
    e.preventDefault();
    if (!testRecipient.trim()) return;

    try {
      setTestLoading(true);
      const res = await testTemplate({
        templateId: template?.id,
        recipient: testRecipient,
        payload: {
          name: "Test Recipient",
          project_name: "Nandeeka Signature Residency",
        },
      });
      setTestResult(res);
    } catch (err: any) {
      alert(err.message || "Test execution failed");
    } finally {
      setTestLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-12 font-sans">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-3">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Header Info & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6">
        <div>
          <h2 className="text-lg font-extrabold text-slate-100">
            {template ? `Edit Template: ${template.name}` : "Create Communication Template"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build dynamic templates for Email, WhatsApp, SMS, or Push Notifications with variable placeholders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {template && (
            <button
              type="button"
              onClick={() => setTestModalOpen(true)}
              className="px-4 py-2 bg-[#171721] hover:bg-[#20202e] border border-[#1e1e2e] text-gold-solid text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              🧪 Test Execution
            </button>
          )}

          <div className="flex bg-[#171721] border border-[#1e1e2e] rounded-xl p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleTabChange("edit")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "edit" ? "bg-gold-solid text-[#020520] font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ✏️ Editor
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("preview")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "preview" ? "bg-gold-solid text-[#020520] font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              👁 Live Preview
            </button>
          </div>
        </div>
      </div>

      {activeTab === "edit" ? (
        <div className="space-y-8">
          {/* Section 1: Template Metadata */}
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 md:p-8 space-y-6">
            <h3 className="text-base font-bold text-slate-100 border-b border-[#1e1e2e] pb-3">
              1. Basic Setup & Channel
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Template Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Welcome Email"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-gold-solid rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Slug (Unique Identifier) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. lead-welcome-email"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-gold-solid rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Channel Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as TemplateType)}
                  className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-gold-solid rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
                >
                  <option value="EMAIL">📧 Email Template</option>
                  <option value="WHATSAPP">💬 WhatsApp Template</option>
                  <option value="SMS">📱 SMS Template</option>
                  <option value="NOTIFICATION">🔔 Push Notification</option>
                  <option value="LEAD_FOLLOWUP">👥 Lead Follow-up</option>
                  <option value="AUTO_REPLY">🤖 Auto Reply</option>
                  <option value="CUSTOM">⚙️ Custom Template</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Event Automation Trigger
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-gold-solid rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
                >
                  <option value="NONE">None (Manual Only)</option>
                  <option value="LEAD_CREATED">Trigger on: Lead Created</option>
                  <option value="INQUIRY_SUBMITTED">Trigger on: Inquiry Submitted</option>
                  <option value="SITE_VISIT_BOOKED">Trigger on: Site Visit Booked</option>
                  <option value="PROPERTY_ENQUIRY_CREATED">Trigger on: Property Enquiry Created</option>
                  <option value="USER_REGISTERED">Trigger on: User Registered</option>
                  <option value="PAYMENT_RECEIVED">Trigger on: Payment Received</option>
                  <option value="BOOKING_CONFIRMED">Trigger on: Booking Confirmed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-gold-solid rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
                >
                  <option value="">Unassigned Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TemplateStatus)}
                  className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-gold-solid rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Subject & Content Editor */}
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 md:p-8 space-y-6">
            <h3 className="text-base font-bold text-slate-100 border-b border-[#1e1e2e] pb-3">
              2. Subject & Content Builder
            </h3>

            {(type === "EMAIL" || type === "NOTIFICATION" || type === "WHATSAPP") && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Subject Line / Header
                </label>
                <input
                  type="text"
                  placeholder="e.g. Welcome to {{company_name}}, {{name}}!"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-gold-solid rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
                />
              </div>
            )}

            {/* Click-to-Insert Placeholder Pills */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Click to Insert Dynamic Placeholder Variables:
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-[#0b0b0f] border border-[#1e1e2e] rounded-xl">
                {AVAILABLE_VARIABLES.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => insertVariable(v.key)}
                    className="px-2.5 py-1 bg-gold-solid/10 hover:bg-gold-solid/20 text-gold-solid border border-gold-solid/25 rounded-md text-xs font-mono font-medium transition-all cursor-pointer hover:scale-105 active:scale-95"
                    title={v.label}
                  >
                    + {v.key}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Template Content Body <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={10}
                required
                placeholder="Hello {{name}}, thank you for inquiring about {{project_name}}..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-gold-solid rounded-xl px-4 py-3 text-slate-150 text-sm outline-none transition-colors font-mono leading-relaxed resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Internal Notes / Description
              </label>
              <input
                type="text"
                placeholder="Internal memo on when this template is sent..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-gold-solid rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      ) : (
        /* LIVE PREVIEW PANE */
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100">Live Preview Output</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulated rendering with placeholder variables substituted.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-gold-solid/20 text-gold-solid border border-gold-solid/30">
              Channel: {type}
            </span>
          </div>

          {previewLoading ? (
            <div className="py-16 text-center text-xs text-slate-500 font-mono">
              Rendering template preview...
            </div>
          ) : (
            <div className="space-y-4">
              {renderedSubject && (
                <div className="p-4 bg-[#0b0b0f] border border-[#1e1e2e] rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-gold-solid uppercase tracking-wider block font-mono">
                    Subject Line
                  </span>
                  <p className="text-sm font-semibold text-slate-100">{renderedSubject}</p>
                </div>
              )}

              <div className="p-6 bg-[#0b0b0f] border border-[#1e1e2e] rounded-xl space-y-2 min-h-[200px]">
                <span className="text-[10px] font-bold text-gold-solid uppercase tracking-wider block font-mono border-b border-[#1e1e2e] pb-2">
                  Body Content
                </span>
                <p className="text-sm text-slate-200 whitespace-pre-wrap font-sans leading-relaxed pt-2">
                  {renderedContent || "(No content provided)"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Action Footer */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push("/admin/templates")}
          className="px-5 py-2.5 bg-[#13131a] hover:bg-[#1c1c27] text-slate-350 hover:text-slate-200 border border-[#1e1e2e] rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-sm font-bold transition-all duration-150 disabled:opacity-50 cursor-pointer shadow-lg shadow-gold-solid/10 flex items-center gap-2"
        >
          {submitting ? (
            <>
              <span className="animate-spin text-xs">⏳</span> Saving...
            </>
          ) : template ? (
            "Update Template"
          ) : (
            "Create Template"
          )}
        </button>
      </div>

      {/* Test Execution Modal */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-3">
              <h3 className="font-bold text-slate-100 text-base">Test Template Execution</h3>
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTestSend} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Recipient (Email or Phone) *
                </label>
                <input
                  type="text"
                  required
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0b0b0f] border border-[#1e1e2e] rounded-lg text-sm text-slate-200 focus:outline-none focus:border-gold-solid"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTestModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={testLoading}
                  className="px-4 py-2 bg-gold-solid hover:bg-gold-hover text-[#020520] text-xs font-bold rounded-lg cursor-pointer"
                >
                  {testLoading ? "Sending Test..." : "Run Test Simulation"}
                </button>
              </div>
            </form>

            {testResult && (
              <div className="p-4 bg-[#0b0b0f] border border-[#1e1e2e] rounded-xl text-xs space-y-2">
                <p className="text-emerald-400 font-semibold">✓ {testResult.message}</p>
                <p className="text-slate-300 font-mono">
                  Subject: {testResult.renderedSubject || "(None)"}
                </p>
                <div className="p-2 bg-[#13131a] rounded text-slate-400 whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
                  {testResult.renderedContent}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
