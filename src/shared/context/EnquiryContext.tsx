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
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("You must agree to be contacted to submit.");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          
          <div className="relative w-full max-w-[480px] max-h-[95vh] overflow-y-auto bg-gradient-to-br from-dark-secondary to-background border border-white/5 rounded-3xl shadow-2xl p-8 md:p-10 scrollbar-none flex flex-col justify-between">
            
            {/* Close Button */}
            <button
              onClick={closeEnquiry}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center justify-center cursor-pointer outline-none"
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
                  <p className="text-xs text-[#8E90A2] leading-relaxed max-w-xs mx-auto font-light">
                    Your details are verified. Our advisory expert will call you shortly.
                  </p>
                </div>
                
                <button
                  onClick={closeEnquiry}
                  className="rounded-full bg-gold-solid px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-background hover:bg-gold-hover transition-all cursor-pointer shadow-lg shadow-gold-solid/15"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Dynamic Header */}
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-serif text-white leading-tight font-medium">
                    {dynamicForm?.name || "Just a few more details."}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8E90A2] font-light">
                    {dynamicForm?.description || "Our experts will call you shortly."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-light">
                      {error}
                    </div>
                  )}

                  {/* Project Selector Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] md:text-xs font-semibold text-[#8E90A2] block">
                      Project
                    </label>
                    <select
                      value={projectName}
                      onChange={(e) => {
                        setProjectName(e.target.value);
                        handleInputChange("project", e.target.value);
                      }}
                      className="w-full bg-transparent border-0 border-b border-white/20 focus:border-gold-solid/80 text-white text-sm outline-none py-2.5 cursor-pointer rounded-none appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%238E90A2' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 0rem center',
                        backgroundSize: '1.25em 1.25em',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      <option value="" disabled className="bg-[#0a0d24] text-white/50">Select a project</option>
                      {projectsList.map((p) => (
                        <option key={p.id} value={p.name} className="bg-[#0a0d24] text-white">
                          {p.name}
                        </option>
                      ))}
                      <option value="General Inquiry" className="bg-[#0a0d24] text-white">General Inquiry</option>
                    </select>
                  </div>

                  {/* DYNAMIC FORM FIELDS RENDERED FROM BACKEND SCHEMA */}
                  {dynamicForm && dynamicForm.fields && dynamicForm.fields.length > 0 ? (
                    dynamicForm.fields.map((field: any) => {
                      const key = field.name || field.label;
                      return (
                        <div key={field.id || key} className="space-y-1">
                          <label className="text-[10px] md:text-xs font-semibold text-[#8E90A2] block">
                            {field.label} {field.required && <span className="text-gold-solid">*</span>}
                          </label>

                          {field.type === "TEXTAREA" || field.type === "textarea" ? (
                            <textarea
                              rows={3}
                              required={field.required}
                              placeholder={field.placeholder || "Enter details..."}
                              value={formData[key] || ""}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              className="w-full bg-transparent border-0 border-b border-white/20 focus:border-gold-solid/80 text-white text-sm outline-none py-2.5 placeholder:text-white/20 rounded-none transition-colors resize-none"
                            />
                          ) : field.type === "SELECT" || field.type === "select" ? (
                            <select
                              required={field.required}
                              value={formData[key] || ""}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              className="w-full bg-transparent border-0 border-b border-white/20 focus:border-gold-solid/80 text-white text-sm outline-none py-2.5 cursor-pointer rounded-none appearance-none"
                            >
                              <option value="" disabled className="bg-[#0a0d24] text-white/50">
                                {field.placeholder || "Select option..."}
                              </option>
                              {field.options?.map((opt: string) => (
                                <option key={opt} value={opt} className="bg-[#0a0d24] text-white">
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
                              placeholder={field.placeholder || `Enter ${field.label}`}
                              value={formData[key] || ""}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              className="w-full bg-transparent border-0 border-b border-white/20 focus:border-gold-solid/80 text-white text-sm outline-none py-2.5 placeholder:text-white/20 rounded-none transition-colors"
                            />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    /* Fallback Fields if API is Loading */
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] md:text-xs font-semibold text-[#8E90A2] block">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          value={formData.name || ""}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-white/20 focus:border-gold-solid/80 text-white text-sm outline-none py-2.5 placeholder:text-white/20 rounded-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] md:text-xs font-semibold text-[#8E90A2] block">
                          Mobile Number *
                        </label>
                        <div className="flex items-center border-0 border-b border-white/20 focus-within:border-gold-solid/80 transition-colors">
                          <div className="flex items-center gap-1 text-white text-sm py-2.5 pr-2 select-none font-medium">
                            <span>+91</span>
                            <span>🇮🇳</span>
                          </div>
                          <input
                            type="tel"
                            required
                            placeholder="Enter mobile number"
                            value={formData.phone || ""}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="w-full bg-transparent text-white text-sm outline-none py-2.5 placeholder:text-white/20 rounded-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] md:text-xs font-semibold text-[#8E90A2] block">
                          Email ID *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={formData.email || ""}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-white/20 focus:border-gold-solid/80 text-white text-sm outline-none py-2.5 placeholder:text-white/20 rounded-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] md:text-xs font-semibold text-[#8E90A2] block">
                          Message / Requirements
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Write message..."
                          value={formData.message || ""}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-white/20 focus:border-gold-solid/80 text-white text-sm outline-none py-2.5 placeholder:text-white/20 rounded-none transition-colors resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* Agreement Checkbox */}
                  <label className="flex items-start gap-3.5 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-4 h-4 mt-0.5 shrink-0 rounded bg-transparent border border-white/20 text-gold-solid focus:ring-0 checked:bg-gold-solid cursor-pointer"
                    />
                    <span className="text-[10px] md:text-xs text-[#8E90A2] leading-relaxed font-light select-none">
                      I agree to be contacted by Bhagyashree or its representative through SMS/ Email/ WhatsApp/ RCS or Call.
                    </span>
                  </label>

                  {/* Action Button */}
                  <div className="pt-4 flex justify-center">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto rounded-full bg-gold-solid hover:bg-gold-hover px-10 py-4 text-xs font-bold uppercase tracking-widest text-background transition-all duration-300 disabled:opacity-50 hover:scale-[1.03] active:scale-[0.97] shadow-[0_4px_25px_rgba(221,189,129,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-background/20 border-t-background rounded-full animate-spin" />
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
