"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, FormFieldItem, FieldType, FormType } from "../types/form.types";
import { createForm, updateForm } from "../services/form.service";

interface FormBuilderProps {
  form?: Form;
}

const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
  { type: "TEXT", label: "Text Field", icon: "🔤" },
  { type: "TEXTAREA", label: "Long Textarea", icon: "📝" },
  { type: "EMAIL", label: "Email Address", icon: "✉️" },
  { type: "PHONE", label: "Phone Number", icon: "📞" },
  { type: "NUMBER", label: "Numeric Input", icon: "🔢" },
  { type: "SELECT", label: "Select Dropdown", icon: "🔽" },
  { type: "RADIO", label: "Radio Options", icon: "🔘" },
  { type: "CHECKBOX", label: "Checkboxes", icon: "☑️" },
  { type: "DATE", label: "Date Picker", icon: "📅" },
  { type: "TIME", label: "Time Picker", icon: "⏰" },
  { type: "URL", label: "Website URL", icon: "🌐" },
];

export default function FormBuilder({ form }: FormBuilderProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Basic Form Setup
  const [name, setName] = useState(form?.name || "");
  const [slug, setSlug] = useState(form?.slug || "");
  const [type, setType] = useState<FormType>(form?.type || "LEAD_INQUIRY");
  const [description, setDescription] = useState(form?.description || "");
  const [submitButtonText, setSubmitButtonText] = useState(form?.submitButtonText || "Submit");
  const [isActive, setIsActive] = useState(form?.isActive ?? true);

  // Fields List
  const [fields, setFields] = useState<FormFieldItem[]>(
    form?.fields && form.fields.length > 0
      ? form.fields
      : [
        { label: "Full Name", name: "name", type: "TEXT", placeholder: "e.g. John Doe", required: true, sortOrder: 1 },
        { label: "Email ID", name: "email", type: "EMAIL", placeholder: "john@example.com", required: true, sortOrder: 2 },
        { label: "Phone Number", name: "phone", type: "PHONE", placeholder: "+91 9876543210", required: true, sortOrder: 3 },
        { label: "Message / Requirements", name: "message", type: "TEXTAREA", placeholder: "Write message...", required: false, sortOrder: 4 },
      ]
  );

  // Live Preview Modal
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!form) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const addField = (fieldType: FieldType) => {
    const newFieldName = `field_${Date.now()}`;
    const newField: FormFieldItem = {
      label: `New ${fieldType.toLowerCase()} field`,
      name: newFieldName,
      type: fieldType,
      placeholder: "",
      required: false,
      options: fieldType === "SELECT" || fieldType === "RADIO" || fieldType === "CHECKBOX" ? ["Option 1", "Option 2"] : [],
      sortOrder: fields.length + 1,
    };
    setFields((prev) => [...prev, newField]);
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updated: Partial<FormFieldItem>) => {
    setFields((prev) =>
      prev.map((f, i) => {
        if (i === index) {
          const merged = { ...f, ...updated };
          if (updated.label && (!f.name || f.name.startsWith("field_"))) {
            merged.name = updated.label
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "_")
              .replace(/(^_|_$)+/g, "");
          }
          return merged;
        }
        return f;
      })
    );
  };

  const moveField = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === fields.length - 1)
    )
      return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const copy = [...fields];
    const temp = copy[index];
    copy[index] = copy[newIndex];
    copy[newIndex] = temp;

    // re-assign sortOrder
    setFields(copy.map((f, idx) => ({ ...f, sortOrder: idx + 1 })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fields.length === 0) {
      setError("Please add at least one field to the form.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const cleanedFields = fields.map((f, idx) => ({
        label: f.label,
        name: f.name || `field_${idx + 1}`,
        type: f.type,
        placeholder: f.placeholder,
        required: f.required ?? false,
        defaultValue: f.defaultValue,
        helpText: f.helpText,
        options: f.options || [],
        sortOrder: f.sortOrder !== undefined ? f.sortOrder : idx + 1,
      }));

      const payload = {
        name,
        slug,
        type,
        description,
        submitButtonText,
        isActive,
        fields: cleanedFields,
      };

      if (form) {
        await updateForm(form.id, payload);
      } else {
        await createForm(payload);
      }

      router.push("/admin/forms");
    } catch (err: any) {
      setError(err.message || "Failed to save form");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8 pb-16 font-sans">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-3">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6">
        <div>
          <h2 className="text-lg font-extrabold text-slate-100">
            {form ? `Edit Form: ${form.name}` : "Visual Dynamic Form Builder"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build custom forms with dynamic fields. Submissions automatically record as Inquiries in your CRM Inbox.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="px-4 py-2 bg-[#171721] hover:bg-[#20202e] border border-[#1e1e2e] text-indigo-400 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2"
          >
            👁 Live Preview
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Form Setup & Field List Manager */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Form Properties */}
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 md:p-8 space-y-6">
            <h3 className="text-base font-bold text-slate-100 border-b border-[#1e1e2e] pb-3">
              1. Form Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Form Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Contact Us Form"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Form Slug (API Identifier) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. contact-us-form"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Form Category / Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as FormType)}
                  className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
                >
                  <option value="CONTACT">Contact Form</option>
                  <option value="LEAD_INQUIRY">Lead Inquiry Form</option>
                  <option value="SITE_VISIT">Site Visit Booking Form</option>
                  <option value="FEEDBACK">Feedback Form</option>
                  <option value="CUSTOM">Custom Form</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Submit Button Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Submit Request"
                  value={submitButtonText}
                  onChange={(e) => setSubmitButtonText(e.target.value)}
                  className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Description / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="Short introductory text displayed above the form..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-lg px-4 py-2.5 text-slate-150 text-sm outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Form Fields Manager */}
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">2. Form Fields ({fields.length})</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure field labels, placeholders, requirement flags, and options.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={index}
                  className="p-5 bg-[#0b0b0f] border border-[#1e1e2e] rounded-2xl space-y-4 relative group"
                >
                  <div className="flex items-center justify-between border-b border-[#1e1e2e]/60 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center border border-indigo-500/20">
                        {index + 1}
                      </span>
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-400 bg-[#13131a] px-2 py-0.5 rounded border border-[#1e1e2e]">
                        {field.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveField(index, "up")}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveField(index, "down")}
                        disabled={index === fields.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => removeField(index)}
                        className="p-1 text-red-400 hover:text-red-300 cursor-pointer ml-2"
                        title="Remove Field"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                        Field Label *
                      </label>
                      <input
                        type="text"
                        required
                        value={field.label}
                        onChange={(e) => updateField(index, { label: e.target.value })}
                        className="w-full bg-[#13131a] border border-[#1e1e2e] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                        Field Name Key (API variable) *
                      </label>
                      <input
                        type="text"
                        required
                        value={field.name}
                        onChange={(e) => updateField(index, { name: e.target.value })}
                        className="w-full bg-[#13131a] border border-[#1e1e2e] rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                        Placeholder
                      </label>
                      <input
                        type="text"
                        value={field.placeholder || ""}
                        onChange={(e) => updateField(index, { placeholder: e.target.value })}
                        className="w-full bg-[#13131a] border border-[#1e1e2e] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.required ?? false}
                          onChange={(e) => updateField(index, { required: e.target.checked })}
                          className="w-4 h-4 text-indigo-600 bg-[#13131a] border-[#1e1e2e] rounded"
                        />
                        <span className="text-xs text-slate-300 font-semibold">
                          Required Field
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Options Input for SELECT / RADIO / CHECKBOX */}
                  {(field.type === "SELECT" || field.type === "RADIO" || field.type === "CHECKBOX") && (
                    <div className="pt-2 border-t border-[#1e1e2e]/40">
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                        Options List (Comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="Option 1, Option 2, Option 3"
                        value={(field.options || []).join(", ")}
                        onChange={(e) =>
                          updateField(index, {
                            options: e.target.value
                              .split(",")
                              .map((o) => o.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full bg-[#13131a] border border-[#1e1e2e] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Add Field Palette */}
        <div className="lg:col-span-4 bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 space-y-4 sticky top-6">
          <h3 className="text-sm font-bold text-slate-100 border-b border-[#1e1e2e] pb-3">
            ➕ Add Form Fields
          </h3>
          <p className="text-xs text-slate-400">
            Click any field type below to append it to your dynamic form:
          </p>

          <div className="grid grid-cols-1 gap-2 pt-2">
            {FIELD_TYPES.map((ft) => (
              <button
                key={ft.type}
                type="button"
                onClick={() => addField(ft.type)}
                className="flex items-center gap-3 p-3 bg-[#0b0b0f] hover:bg-[#181824] border border-[#1e1e2e] hover:border-indigo-500/50 rounded-xl text-xs text-slate-300 font-medium transition-all text-left cursor-pointer group"
              >
                <span className="text-base group-hover:scale-110 transition-transform">
                  {ft.icon}
                </span>
                <span>{ft.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-4 border-t border-[#1e1e2e] pt-6">
        <button
          type="button"
          onClick={() => router.push("/admin/forms")}
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
              <span className="animate-spin text-xs">⏳</span> Saving...
            </>
          ) : form ? (
            "Update Form"
          ) : (
            "Create Form"
          )}
        </button>
      </div>

      {/* Live Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-3">
              <h3 className="font-bold text-slate-100 text-base">Live Form Preview</h3>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 bg-[#0b0b0f] border border-[#1e1e2e] rounded-2xl space-y-4">
              <h4 className="font-extrabold text-slate-100 text-lg">{name || "Form Preview"}</h4>
              {description && <p className="text-xs text-slate-400">{description}</p>}

              <div className="space-y-4 pt-2">
                {fields.map((f, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      {f.label} {f.required && <span className="text-red-400">*</span>}
                    </label>

                    {f.type === "TEXTAREA" ? (
                      <textarea
                        disabled
                        placeholder={f.placeholder}
                        className="w-full bg-[#13131a] border border-[#1e1e2e] rounded-xl p-2.5 text-xs text-slate-400 opacity-70 resize-none"
                      />
                    ) : f.type === "SELECT" ? (
                      <select disabled className="w-full bg-[#13131a] border border-[#1e1e2e] rounded-xl p-2.5 text-xs text-slate-400 opacity-70">
                        <option>{f.placeholder || "Select option..."}</option>
                        {f.options?.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        disabled
                        type="text"
                        placeholder={f.placeholder}
                        className="w-full bg-[#13131a] border border-[#1e1e2e] rounded-xl p-2.5 text-xs text-slate-400 opacity-70"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                disabled
                className="w-full py-3 bg-indigo-650 text-white font-bold text-xs rounded-xl uppercase tracking-wider opacity-70 mt-4"
              >
                {submitButtonText || "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
