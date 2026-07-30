"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TemplateType, EventType } from "../types";
import {
  getTemplateById,
  createTemplate,
  updateTemplate,
  previewTemplate,
} from "../services/template.service";

interface TemplateFormPageProps {
  id?: string;
}

const AVAILABLE_VARIABLES = [
  { label: "Lead Name", val: "{{name}}" },
  { label: "Email Address", val: "{{email}}" },
  { label: "Phone Number", val: "{{phone}}" },
  { label: "Project Name", val: "{{project_name}}" },
  { label: "Project Location", val: "{{project_location}}" },
  { label: "Sales Person", val: "{{sales_person}}" },
  { label: "Company Name", val: "{{company_name}}" },
  { label: "Site Visit Date", val: "{{site_visit_date}}" },
  { label: "Current Date", val: "{{current_date}}" },
];

export default function TemplateFormPage({ id }: TemplateFormPageProps) {
  const router = useRouter();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<TemplateType>("EMAIL");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [eventType, setEventType] = useState<EventType | "">("LEAD_CREATED");

  // Live Preview State
  const [livePreviewContent, setLivePreviewContent] = useState("");
  const [livePreviewSubject, setLivePreviewSubject] = useState("");

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  useEffect(() => {
    updateLivePreview();
  }, [content, subject]);

  async function loadData(templateId: string) {
    try {
      const data = await getTemplateById(templateId);
      setName(data.name);
      setSlug(data.slug);
      setType(data.type);
      setSubject(data.subject || "");
      setContent(data.content);
      setDescription(data.description || "");
      setStatus(Boolean(data.status));
      setEventType(data.eventType || "");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load template");
    } finally {
      setLoading(false);
    }
  }

  async function updateLivePreview() {
    try {
      const res = await previewTemplate({ content, subject });
      setLivePreviewContent(res.renderedContent);
      setLivePreviewSubject(res.renderedSubject || "");
    } catch {
      setLivePreviewContent(content);
      setLivePreviewSubject(subject);
    }
  }

  function insertVariable(variableToken: string) {
    const textarea = document.getElementById("template-content-textarea") as HTMLTextAreaElement;
    if (!textarea) {
      setContent((prev) => `${prev} ${variableToken}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    setContent(text.substring(0, start) + variableToken + text.substring(end));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variableToken.length, start + variableToken.length);
    }, 0);
  }

  function insertFormat(tagOpen: string, tagClose: string) {
    const textarea = document.getElementById("template-content-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = tagOpen + selectedText + tagClose;

    setContent(text.substring(0, start) + replacement + text.substring(end));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selectedText.length);
    }, 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const payload = {
      name,
      slug: generatedSlug,
      type,
      subject: type === "EMAIL" ? subject : undefined,
      content,
      description,
      status,
      eventType: eventType ? (eventType as EventType) : undefined,
    };

    try {
      if (isEditing && id) {
        await updateTemplate(id, payload);
      } else {
        await createTemplate(payload);
      }
      router.push("/admin/templates");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save template");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3 font-sans">
        <div className="w-8 h-8 border-2 border-gold-solid/20 border-t-gold-solid rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-mono">Loading template details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/templates"
            className="p-2 bg-[#13131a] hover:bg-[#181824] border border-[#1e1e2e] text-xs text-slate-300 rounded-xl transition-colors no-underline"
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-100">
              {isEditing ? "Edit Communication Template" : "Create New Template"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure template copywriting, channel types, and placeholder variables.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-6 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-gold-solid/10 disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEditing ? "Update Template" : "Save & Publish"}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-5 bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 shadow-xl">
          {/* Template Channel Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Channel Type</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[
                { label: "📧 Email", val: "EMAIL" },
                { label: "💬 WhatsApp", val: "WHATSAPP" },
                { label: "📱 SMS", val: "SMS" },
                { label: "🔔 Push", val: "NOTIFICATION" },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setType(item.val as TemplateType)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    type === item.val
                      ? "bg-gold-solid/15 border-gold-solid text-gold-solid"
                      : "bg-[#0b0b0f] border-[#1e1e2e] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Template Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Template Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Welcome Brochure Email"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0b0b0f] border border-[#1e1e2e] rounded-xl text-xs text-slate-100 focus:outline-none focus:border-gold-solid/50 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">System Slug (Optional)</label>
              <input
                type="text"
                placeholder="auto-generated-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0b0b0f] border border-[#1e1e2e] rounded-xl text-xs text-slate-100 focus:outline-none focus:border-gold-solid/50 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Email Subject (Shown only for EMAIL) */}
          {type === "EMAIL" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Subject Line *</label>
              <input
                type="text"
                required={type === "EMAIL"}
                placeholder="e.g. Welcome to {{project_name}} by {{company_name}}"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0b0b0f] border border-[#1e1e2e] rounded-xl text-xs text-gold-solid font-medium focus:outline-none focus:border-gold-solid/50 transition-colors"
              />
            </div>
          )}

          {/* Placeholder Variables Click-to-Insert Chips */}
          <div className="space-y-2 pt-2 border-t border-[#1e1e2e]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Insert Dynamic Variables</span>
              <span className="text-[10px] text-slate-500 font-mono">Click to insert placeholder</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_VARIABLES.map((v) => (
                <button
                  key={v.val}
                  type="button"
                  onClick={() => insertVariable(v.val)}
                  className="px-2.5 py-1 bg-[#181824] hover:bg-gold-solid/10 border border-[#1e1e2e] hover:border-gold-solid/30 text-[11px] font-mono text-gold-solid rounded-lg transition-colors cursor-pointer"
                >
                  + {v.val}
                </button>
              ))}
            </div>
          </div>

          {/* Template Body Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Template Body Content *</label>
              {type === "EMAIL" && (
                <div className="flex items-center gap-1 bg-[#13131a] border border-[#1e1e2e] p-1 rounded-lg">
                  <button
                    type="button"
                    title="Bold"
                    onClick={() => insertFormat("<b>", "</b>")}
                    className="p-1.5 hover:bg-[#1c1c27] text-slate-305 hover:text-white rounded text-[11px] font-bold cursor-pointer outline-none transition-colors"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    title="Italic"
                    onClick={() => insertFormat("<i>", "</i>")}
                    className="p-1.5 hover:bg-[#1c1c27] text-slate-305 hover:text-white rounded text-[11px] italic cursor-pointer outline-none transition-colors"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    title="Underline"
                    onClick={() => insertFormat("<u>", "</u>")}
                    className="p-1.5 hover:bg-[#1c1c27] text-slate-305 hover:text-white rounded text-[11px] underline cursor-pointer outline-none transition-colors"
                  >
                    U
                  </button>
                  <div className="w-[1px] h-3 bg-[#1e1e2e] mx-1" />
                  <button
                    type="button"
                    title="Heading 1"
                    onClick={() => insertFormat("<h1>", "</h1>")}
                    className="p-1.5 hover:bg-[#1c1c27] text-slate-305 hover:text-white rounded text-[10px] font-extrabold cursor-pointer outline-none transition-colors"
                  >
                    H1
                  </button>
                  <button
                    type="button"
                    title="Heading 2"
                    onClick={() => insertFormat("<h2>", "</h2>")}
                    className="p-1.5 hover:bg-[#1c1c27] text-slate-305 hover:text-white rounded text-[10px] font-extrabold cursor-pointer outline-none transition-colors"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    title="Paragraph"
                    onClick={() => insertFormat("<p>", "</p>")}
                    className="p-1.5 hover:bg-[#1c1c27] text-slate-305 hover:text-white rounded text-[10px] font-mono cursor-pointer outline-none transition-colors"
                  >
                    P
                  </button>
                  <div className="w-[1px] h-3 bg-[#1e1e2e] mx-1" />
                  <button
                    type="button"
                    title="Line Break"
                    onClick={() => insertFormat("<br/>", "")}
                    className="p-1.5 hover:bg-[#1c1c27] text-slate-305 hover:text-white rounded text-[10px] font-mono cursor-pointer outline-none transition-colors"
                  >
                    BR
                  </button>
                  <button
                    type="button"
                    title="List Item"
                    onClick={() => insertFormat("<li>", "</li>")}
                    className="p-1.5 hover:bg-[#1c1c27] text-slate-305 hover:text-white rounded text-[10px] font-mono cursor-pointer outline-none transition-colors"
                  >
                    LI
                  </button>
                  <button
                    type="button"
                    title="Link"
                    onClick={() => insertFormat('<a href="https://example.com" target="_blank" class="text-gold-solid hover:underline">', "</a>")}
                    className="p-1.5 hover:bg-[#1c1c27] text-slate-305 hover:text-white rounded text-[10px] font-mono cursor-pointer outline-none transition-colors"
                  >
                    A
                  </button>
                </div>
              )}
            </div>
            <textarea
              id="template-content-textarea"
              required
              rows={8}
              placeholder="Write template content here using {{variables}}..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0b0b0f] border border-[#1e1e2e] rounded-xl text-xs text-slate-105 leading-relaxed focus:outline-none focus:border-gold-solid/50 transition-colors font-mono"
            />
          </div>

          {/* Event Trigger & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1e1e2e]">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Automated Event Trigger</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                className="w-full px-3.5 py-2.5 bg-[#0b0b0f] border border-[#1e1e2e] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-gold-solid/50"
              >
                <option value="">No Automatic Trigger (Manual Only)</option>
                <option value="LEAD_CREATED">New Lead Created</option>
                <option value="INQUIRY_SUBMITTED">Property Inquiry Submitted</option>
                <option value="SITE_VISIT_BOOKED">Site Visit Booked</option>
                <option value="USER_REGISTERED">User Account Registered</option>
                <option value="PROPERTY_ENQUIRY_CREATED">Property Specification Inquiry</option>
                <option value="BOOKING_CONFIRMED">Unit Booking Confirmed</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Template Description</label>
              <input
                type="text"
                placeholder="Internal note for admin team..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0b0b0f] border border-[#1e1e2e] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-gold-solid/50"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Variable Replacement Preview Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 shadow-xl space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs">👁</span>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Live Variable Preview
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Real-time Render
              </span>
            </div>

            {type === "EMAIL" && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Subject Line Output:</span>
                <div className="p-3 rounded-xl bg-[#0b0b0f] border border-[#1e1e2e] text-xs font-bold text-gold-solid">
                  {livePreviewSubject || <span className="text-slate-600 italic">Subject will appear here...</span>}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Message Content Output:</span>
              <div className="p-4 rounded-xl bg-[#0b0b0f] border border-[#1e1e2e] text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed min-h-[220px]">
                {livePreviewContent || <span className="text-slate-600 italic">Message preview will render here with sample lead data...</span>}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#181824] border border-[#1e1e2e] text-[10px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 block">💡 Tip:</span>
              <p>Variables inside <code className="text-gold-solid">{`{{name}}`}</code> will be automatically replaced with the lead&apos;s real data before dispatch.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
