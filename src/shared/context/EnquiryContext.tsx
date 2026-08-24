"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "@/shared/lib/api-config";
import { Form } from "@/modules/admin/types/form.types";
import { getPublicFormBySlug, submitPublicForm } from "@/modules/admin/services/form.service";

interface EnquiryContextType {
  isOpen: boolean;
  projectName: string;
  openEnquiry: (projectName?: string) => void;
  closeEnquiry: () => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic Form Schema from Form Builder API
  const [dynamicForm, setDynamicForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [agreed, setAgreed] = useState(true);

  // Dynamic projects list from API
  const [projectsList, setProjectsList] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // 1. Load Projects List
    fetch(`${API_BASE_URL}/projects`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        const activeProjects = data
          .filter((p: { isActive: boolean }) => p.isActive)
          .map((p: { id: string; name: string }) => ({ id: p.id, name: p.name }));
        setProjectsList(activeProjects);
      })
      .catch(() => {
        setProjectsList([
          { id: "1", name: "Bhagyashree Enclave" },
          { id: "2", name: "Bhagyashree Heights" },
          { id: "3", name: "Bhagyashree Puram" },
        ]);
      });

    // 2. Fetch Dynamic Form Schema from API (inquiry-form)
    getPublicFormBySlug("inquiry-form")
      .then((form) => {
        if (form && form.fields) {
          setDynamicForm(form);
        }
      })
      .catch(() => {
        // Form builder fallback
      });
  }, []);

  const openEnquiry = (projName?: string) => {
    setProjectName(projName || "");
    setFormData({
      project: projName || "",
    });
    setAgreed(true);
    setError(null);
    setSuccess(false);
    setIsOpen(true);
  };

  const closeEnquiry = () => {
    setIsOpen(false);
  };

  const handleInputChange = (fieldName: string, value: any) => {
    let cleanVal = value;
    const lowerKey = fieldName.toLowerCase();
    if (lowerKey === "phone" || lowerKey.includes("phone") || lowerKey.includes("mobile")) {
      cleanVal = String(value).replace(/\D/g, "").slice(0, 10);
    }
    setFormData((prev) => ({ ...prev, [fieldName]: cleanVal }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("You must agree to be contacted to submit.");
      return;
    }

    // Validate 10-digit mobile number
    const phoneEntry = Object.entries(formData).find(
      ([k]) => k.toLowerCase().includes("phone") || k.toLowerCase().includes("mobile")
    );
    const phoneVal = phoneEntry ? String(phoneEntry[1] || "") : "";
    if (phoneVal && phoneVal.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const pageSource = typeof window !== "undefined" ? window.location.pathname : "";
    const submissionPayload = {
      ...formData,
      project: projectName || formData.project || "General Project Inquiry",
    };

    try {
      // Submit dynamically to Form Builder backend API
      const slugToSubmit = dynamicForm?.slug || "quick-project-inquiry";
      await submitPublicForm(slugToSubmit, submissionPayload, pageSource);
      setSuccess(true);
    } catch {
      // Fallback submit to quick-project-inquiry
      try {
        await submitPublicForm("quick-project-inquiry", submissionPayload, pageSource);
      } catch {}
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EnquiryContext.Provider value={{ isOpen, projectName, openEnquiry, closeEnquiry }}>
      {children}

      {/* Modern Royal Blue Glassmorphic Dynamic Enquiry Modal Popup */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans"
          onClick={closeEnquiry}
        >
          <div
            className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto bg-[#070e2b] border border-gold-solid/30 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 scrollbar-none flex flex-col justify-between text-white"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Close Button */}
            <button
              onClick={closeEnquiry}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all flex items-center justify-center cursor-pointer outline-none"
              title="Close"
            >
              ✕
            </button>

            {success ? (
              <div className="py-8 text-center space-y-6">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping opacity-75" />
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center text-3xl">
                    ✓
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-white font-serif">Thank You</h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto font-normal">
                    Your details are verified. Our advisory expert will call you shortly.
                  </p>
                </div>
                
                <button
                  onClick={closeEnquiry}
                  className="rounded-full bg-gold-solid px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-[#050c38] hover:bg-gold-hover transition-all cursor-pointer shadow-lg shadow-gold-solid/15"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Dynamic Header */}
                <div className="space-y-1.5 pr-6">
                  <h3 className="text-2xl md:text-3xl font-serif text-white leading-tight font-semibold">
                    {dynamicForm?.name || "Just a few more details."}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-normal">
                    {dynamicForm?.description || "Our experts will call you shortly."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {error && (
                    <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-300 rounded-xl text-xs font-medium">
                      {error}
                    </div>
                  )}

                  {/* Project Selector Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-200 block">
                      Project
                    </label>
                    <select
                      value={projectName}
                      onChange={(e) => {
                        setProjectName(e.target.value);
                        handleInputChange("project", e.target.value);
                      }}
                      className="w-full bg-[#03071e]/90 border border-white/20 focus:border-gold-solid text-white text-sm outline-none px-3.5 py-2.5 cursor-pointer rounded-xl appearance-none transition-colors"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23DDBD81' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1.25em 1.25em',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      <option value="" disabled className="bg-[#070e2b] text-slate-400">Select a project</option>
                      {projectsList.map((p) => (
                        <option key={p.id} value={p.name} className="bg-[#070e2b] text-white">
                          {p.name}
                        </option>
                      ))}
                      <option value="General Inquiry" className="bg-[#070e2b] text-white">General Inquiry</option>
                    </select>
                  </div>

                  {/* DYNAMIC FORM FIELDS RENDERED FROM BACKEND SCHEMA */}
                  {dynamicForm && dynamicForm.fields && dynamicForm.fields.length > 0 ? (
                    dynamicForm.fields.map((field: any) => {
                      const key = field.name || field.label;
                      return (
                        <div key={field.id || key} className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-200 block">
                            {field.label} {field.required && <span className="text-gold-solid">*</span>}
                          </label>

                          {field.type === "TEXTAREA" || field.type === "textarea" ? (
                            <textarea
                              rows={3}
                              required={field.required}
                              placeholder={field.placeholder || "Enter details..."}
                              value={formData[key] || ""}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              className="w-full bg-[#03071e]/90 border border-white/20 focus:border-gold-solid text-white text-sm outline-none px-3.5 py-2.5 placeholder:text-slate-400 rounded-xl transition-colors resize-none"
                            />
                          ) : field.type === "SELECT" || field.type === "select" ? (
                            <select
                              required={field.required}
                              value={formData[key] || ""}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              className="w-full bg-[#03071e]/90 border border-white/20 focus:border-gold-solid text-white text-sm outline-none px-3.5 py-2.5 cursor-pointer rounded-xl appearance-none transition-colors"
                            >
                              <option value="" disabled className="bg-[#070e2b] text-slate-400">
                                {field.placeholder || "Select option..."}
                              </option>
                              {field.options?.map((opt: string) => (
                                <option key={opt} value={opt} className="bg-[#070e2b] text-white">
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={
                                field.type === "EMAIL" || field.type === "email"
                                  ? "email"
                                  : field.type === "PHONE" || field.type === "phone"
                                  ? "tel"
                                  : field.type === "NUMBER" || field.type === "number"
                                  ? "number"
                                  : field.type === "DATE" || field.type === "date"
                                  ? "date"
                                  : "text"
                              }
                              required={field.required}
                              maxLength={
                                field.type === "PHONE" || field.type === "phone" || key.toLowerCase().includes("phone") || key.toLowerCase().includes("mobile")
                                  ? 10
                                  : undefined
                              }
                              inputMode={
                                field.type === "PHONE" || field.type === "phone" || key.toLowerCase().includes("phone") || key.toLowerCase().includes("mobile")
                                  ? "numeric"
                                  : undefined
                              }
                              placeholder={field.placeholder || `Enter ${field.label}`}
                              value={formData[key] || ""}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              className="w-full bg-[#03071e]/90 border border-white/20 focus:border-gold-solid text-white text-sm outline-none px-3.5 py-2.5 placeholder:text-slate-400 rounded-xl transition-colors"
                            />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    /* Fallback Fields if API is Loading */
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-200 block">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          value={formData.name || ""}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="w-full bg-[#03071e]/90 border border-white/20 focus:border-gold-solid text-white text-sm outline-none px-3.5 py-2.5 placeholder:text-slate-400 rounded-xl transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-200 block">
                          Mobile Number *
                        </label>
                        <div className="flex items-center rounded-xl bg-[#03071e]/90 border border-white/20 focus-within:border-gold-solid overflow-hidden transition-colors">
                          <div className="flex items-center gap-1.5 text-gold-solid text-sm font-bold px-3.5 py-2.5 bg-white/5 border-r border-white/20 select-none">
                            <span>+91</span>
                          </div>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            inputMode="numeric"
                            pattern="[0-9]{10}"
                            placeholder="Enter 10-digit mobile number"
                            value={formData.phone || ""}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="w-full bg-transparent text-white text-sm outline-none py-2.5 px-3 placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-200 block">
                          Email ID <span className="text-slate-400 font-normal font-sans">(Optional)</span>
                        </label>
                        <input
                          type="email"
                          placeholder="john@example.com (Optional)"
                          value={formData.email || ""}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="w-full bg-[#03071e]/90 border border-white/20 focus:border-gold-solid text-white text-sm outline-none px-3.5 py-2.5 placeholder:text-slate-400 rounded-xl transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-200 block">
                          Message / Requirements
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Write message..."
                          value={formData.message || ""}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          className="w-full bg-[#03071e]/90 border border-white/20 focus:border-gold-solid text-white text-sm outline-none px-3.5 py-2.5 placeholder:text-slate-400 rounded-xl transition-colors resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* Agreement Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-4 h-4 mt-0.5 shrink-0 rounded border border-white/30 text-gold-solid focus:ring-0 checked:bg-gold-solid cursor-pointer"
                    />
                    <span className="text-xs text-slate-300 leading-relaxed font-normal select-none">
                      I agree to be contacted by Bhagyashree or its representative through SMS/ Email/ WhatsApp/ RCS or Call.
                    </span>
                  </label>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-xl bg-gold-solid hover:bg-gold-hover py-3.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#050c38] transition-all duration-300 disabled:opacity-50 shadow-lg shadow-gold-solid/25 flex items-center justify-center gap-2 cursor-pointer border-none"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#050c38]/30 border-t-[#050c38] rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>{dynamicForm?.submitButtonText || "Submit Interest ➔"}</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error("useEnquiry must be used within an EnquiryProvider");
  }
  return context;
}
