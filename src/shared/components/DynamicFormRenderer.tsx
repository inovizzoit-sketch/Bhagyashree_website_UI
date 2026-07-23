"use client";

import React, { useEffect, useState } from "react";
import { Form, FormFieldItem } from "@/modules/admin/types/form.types";
import { getPublicFormBySlug, submitPublicForm } from "@/modules/admin/services/form.service";

interface DynamicFormRendererProps {
  formSlug: string;
  pageSource?: string;
  className?: string;
}

export default function DynamicFormRenderer({
  formSlug,
  pageSource,
  className = "",
}: DynamicFormRendererProps) {
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic field values map
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (formSlug) {
      loadForm();
    }
  }, [formSlug]);

  async function loadForm() {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublicFormBySlug(formSlug);
      setForm(data);

      // Initialize form data defaults
      const initial: Record<string, any> = {};
      data.fields?.forEach((f) => {
        if (f.defaultValue) initial[f.name] = f.defaultValue;
      });
      setFormData(initial);
    } catch (err: any) {
      setError(err.message || "Failed to load form");
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxToggle = (name: string, option: string) => {
    const current: string[] = formData[name] || [];
    const updated = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    setFormData((prev) => ({ ...prev, [name]: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await submitPublicForm(
        formSlug,
        formData,
        pageSource || (typeof window !== "undefined" ? window.location.pathname : "")
      );
      setSubmitSuccess(true);
      setFormData({});
    } catch (err: any) {
      setError(err.message || "Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-xs text-slate-400 font-mono animate-pulse">
        Loading form...
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">
        ⚠️ {error || "Form unavailable"}
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3">
        <span className="text-3xl">🎉</span>
        <h3 className="text-base font-bold text-white">Thank You!</h3>
        <p className="text-xs text-slate-300">
          Your response has been recorded successfully. Our team will contact you shortly.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {form.description && (
        <p className="text-xs text-slate-400 mb-2 leading-relaxed">{form.description}</p>
      )}

      {form.fields?.map((field) => (
        <div key={field.id || field.name} className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </span>
            {field.helpText && (
              <span className="text-[10px] text-slate-500 font-normal">{field.helpText}</span>
            )}
          </label>

          {/* TEXTAREA */}
          {field.type === "TEXTAREA" ? (
            <textarea
              rows={4}
              required={field.required}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-150 text-xs outline-none transition-colors resize-none"
            />
          ) : /* SELECT DROPDOWN */
            field.type === "SELECT" ? (
              <select
                required={field.required}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-150 text-xs outline-none transition-colors"
              >
                <option value="">{field.placeholder || "Select option..."}</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : /* RADIO BUTTONS */
              field.type === "RADIO" ? (
                <div className="flex flex-wrap gap-4 pt-1">
                  {field.options?.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="radio"
                        name={field.name}
                        required={field.required}
                        checked={formData[field.name] === opt}
                        onChange={() => handleInputChange(field.name, opt)}
                        className="w-4 h-4 text-indigo-600 bg-[#0b0b0f] border-[#1e1e2e]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              ) : /* CHECKBOXES */
                field.type === "CHECKBOX" ? (
                  <div className="flex flex-wrap gap-4 pt-1">
                    {field.options?.map((opt) => {
                      const checked = (formData[field.name] || []).includes(opt);
                      return (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleCheckboxToggle(field.name, opt)}
                            className="w-4 h-4 text-indigo-600 bg-[#0b0b0f] border-[#1e1e2e] rounded"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : /* DATE / TIME / NUMBER / EMAIL / PHONE / TEXT */
                  (
                    <input
                      type={
                        field.type === "EMAIL"
                          ? "email"
                          : field.type === "PHONE"
                            ? "tel"
                            : field.type === "NUMBER"
                              ? "number"
                              : field.type === "DATE"
                                ? "date"
                                : field.type === "TIME"
                                  ? "time"
                                  : "text"
                      }
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full bg-[#0b0b0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-150 text-xs outline-none transition-colors"
                    />
                  )}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-indigo-650 hover:bg-indigo-550 active:bg-indigo-750 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-lg shadow-indigo-650/15"
      >
        {submitting ? "Submitting..." : form.submitButtonText || "Submit"}
      </button>
    </form>
  );
}
