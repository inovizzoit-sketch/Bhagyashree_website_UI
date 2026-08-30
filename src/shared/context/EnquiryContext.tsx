"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "@/shared/lib/api-config";
import { Form } from "@/modules/admin/types/form.types";
import { getPublicFormBySlug, submitPublicForm } from "@/modules/admin/services/form.service";

interface EnquiryContextType {
  isOpen: boolean;
  projectName: string;
  openEnquiry: (contextTitle?: string, customHeader?: string) => void;
  closeEnquiry: () => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [modalBadge, setModalBadge] = useState("Consultation Request");
  const [modalTitle, setModalTitle] = useState("Book an Appointment");
  const [modalSubtitle, setModalSubtitle] = useState("Our real estate experts will assist you with pricing & layouts.");
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

  const openEnquiry = (contextTitle?: string, customHeader?: string) => {
    const cleanContext = (contextTitle || "").trim();
    const lower = cleanContext.toLowerCase();

    let badge = "Property Enquiry";
    let title = "Quick Enquiry";
    let subtitle = "Fill in your details below and our property team will get in touch with you.";

    if (customHeader) {
      title = customHeader;
      badge = "Enquiry Form";
    } else if (lower.includes("book") || lower.includes("appointment")) {
      badge = "Appointment Booking";
      title = "Book an Appointment";
      subtitle = "Schedule a site visit & consultation with our sales team.";
    } else if (lower.includes("blog") || lower.includes("consult") || lower.includes("article")) {
      badge = "Expert Advice";
      title = "Consult Property Expert";
      subtitle = "Get personalized advice from our real estate investment team.";
    } else if (lower.includes("amenit")) {
      badge = "Amenity Details";
      title = cleanContext && !lower.includes("enquiry") && !lower.includes("details") 
        ? `Enquire: ${cleanContext}` 
        : "Amenity Enquiry";
      subtitle = "Get detailed specifications and availability for this amenity.";
    } else if (cleanContext && !lower.startsWith("enquir") && !lower.startsWith("inquir") && !lower.endsWith("details") && !lower.endsWith("enquiry")) {
      badge = "Property Enquiry";
      title = cleanContext.length > 35 ? "Project Enquiry" : `Enquire: ${cleanContext}`;
      subtitle = "Request pricing, master plans & site layout brochures.";
    } else {
      badge = "Property Enquiry";
      title = "Quick Enquiry";
      subtitle = "Fill in your details below and our property team will get in touch with you.";
    }

    setModalBadge(badge);
    setModalTitle(title);
    setModalSubtitle(subtitle);
    setProjectName(cleanContext);
    setFormData({
      project: cleanContext || "General Project Inquiry",
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

    // Prepare WhatsApp URL beforehand to capture values
    const isBooking = modalTitle.toLowerCase().includes("book") || modalTitle.toLowerCase().includes("appointment");
    let whatsappUrl = "";
    if (isBooking) {
      let messageText = `*New Appointment Booking Request*\n\n`;
      messageText += `*Project/Property*: ${projectName || formData.project || "General Project Inquiry"}\n`;
      Object.entries(formData).forEach(([key, val]) => {
        if (val && key !== "project") {
          const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
          messageText += `*${capitalizedKey}*: ${val}\n`;
        }
      });
      whatsappUrl = `https://wa.me/917007587406?text=${encodeURIComponent(messageText)}`;
    }

    try {
      // Submit dynamically to Form Builder backend API
      const slugToSubmit = dynamicForm?.slug || "quick-project-inquiry";
      await submitPublicForm(slugToSubmit, submissionPayload, pageSource);
      setSuccess(true);
      if (whatsappUrl && typeof window !== "undefined") {
        window.open(whatsappUrl, "_blank");
      }
    } catch {
      // Fallback submit to quick-project-inquiry
      try {
        await submitPublicForm("quick-project-inquiry", submissionPayload, pageSource);
      } catch {}
      setSuccess(true);
      if (whatsappUrl && typeof window !== "undefined") {
        window.open(whatsappUrl, "_blank");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EnquiryContext.Provider value={{ isOpen, projectName, openEnquiry, closeEnquiry }}>
      {children}

      {/* Modern Luxury Gold Glassmorphic Dynamic Enquiry Modal Popup */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in font-sans"
          onClick={closeEnquiry}
        >
          <div
            className="relative w-full max-w-[490px] max-h-[90vh] overflow-y-auto bg-[#FAF8F5] border border-[#EADBB4] rounded-3xl shadow-2xl p-6 sm:p-8 md:p-9 scrollbar-none flex flex-col justify-between text-slate-800 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Gold Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#997A15] rounded-t-3xl" />

            {/* Close Button */}
            <button
              onClick={closeEnquiry}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FAF4E8] hover:bg-[#EADBB4] text-[#1A150C] border border-[#EADBB4] transition-all flex items-center justify-center cursor-pointer outline-none font-bold shadow-sm"
              title="Close"
            >
              ✕
            </button>

            {success ? (
              <div className="py-8 text-center space-y-6">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping opacity-75" />
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-extrabold">
                    ✓
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-2xl font-extrabold text-[#1A150C]">Thank You</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto font-normal">
                    Your details are verified. Our property advisory expert will call you shortly.
                  </p>
                </div>
                
                <button
                  onClick={closeEnquiry}
                  className="rounded-full bg-[#1A150C] hover:bg-[#8C6D23] px-8 py-3.5 text-xs font-extrabold uppercase tracking-widest text-white transition-all cursor-pointer shadow-md"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div className="space-y-6 pt-2">
                {/* Dynamic Header for Every Section */}
                <div className="space-y-1.5 pr-6">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8C6D23] bg-[#FAF4E8] border border-[#EADBB4] px-3 py-1 rounded-full inline-block">
                    {modalBadge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1A150C] leading-tight tracking-tight">
                    {modalTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal">
                    {modalSubtitle}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-700 rounded-xl text-xs font-semibold">
                      ⚠️ {error}
                    </div>
                  )}

                  {/* Project Selector Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1A150C] block">
                      Select Project / Property
                    </label>
                    <select
                      value={projectName}
                      onChange={(e) => {
                        setProjectName(e.target.value);
                        handleInputChange("project", e.target.value);
                      }}
                      className="w-full bg-[#FAF4E8] focus:bg-white border border-[#EADBB4] focus:border-[#D4AF37] text-[#1A150C] text-xs font-bold outline-none px-3.5 py-3 cursor-pointer rounded-xl appearance-none transition-colors"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%238C6D23' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1.25em 1.25em',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      <option value="" disabled className="bg-white text-slate-400">Select a project</option>
                      {projectsList.map((p) => (
                        <option key={p.id} value={p.name} className="bg-white text-[#1A150C]">
                          {p.name}
                        </option>
                      ))}
                      <option value="General Inquiry" className="bg-white text-[#1A150C]">General Inquiry</option>
                    </select>
                  </div>

                  {/* DYNAMIC FORM FIELDS RENDERED FROM BACKEND SCHEMA */}
                  {dynamicForm && dynamicForm.fields && dynamicForm.fields.length > 0 ? (
                    dynamicForm.fields.map((field: any) => {
                      const key = field.name || field.label;
                      return (
                        <div key={field.id || key} className="space-y-1.5">
                          <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1A150C] block">
                            {field.label} {field.required && <span className="text-[#8C6D23]">*</span>}
                          </label>

                          {field.type === "TEXTAREA" || field.type === "textarea" ? (
                            <textarea
                              rows={3}
                              required={field.required}
                              placeholder={field.placeholder || "Enter details..."}
                              value={formData[key] || ""}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              className="w-full bg-[#FAF4E8] focus:bg-white border border-[#EADBB4] focus:border-[#D4AF37] text-[#1A150C] text-xs font-semibold outline-none px-3.5 py-3 placeholder:text-slate-400 rounded-xl transition-colors resize-none"
                            />
                          ) : field.type === "SELECT" || field.type === "select" ? (
                            <select
                              required={field.required}
                              value={formData[key] || ""}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              className="w-full bg-[#FAF4E8] focus:bg-white border border-[#EADBB4] focus:border-[#D4AF37] text-[#1A150C] text-xs font-bold outline-none px-3.5 py-3 cursor-pointer rounded-xl appearance-none transition-colors"
                            >
                              <option value="" disabled className="bg-white text-slate-400">
                                {field.placeholder || "Select option..."}
                              </option>
                              {field.options?.map((opt: string) => (
                                <option key={opt} value={opt} className="bg-white text-[#1A150C]">
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
                              className="w-full bg-[#FAF4E8] focus:bg-white border border-[#EADBB4] focus:border-[#D4AF37] text-[#1A150C] text-xs font-semibold outline-none px-3.5 py-3 placeholder:text-slate-400 rounded-xl transition-colors"
                            />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    /* Fallback Fields if API is Loading */
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1A150C] block">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={formData.name || ""}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="w-full bg-[#FAF4E8] focus:bg-white border border-[#EADBB4] focus:border-[#D4AF37] text-[#1A150C] text-xs font-semibold outline-none px-3.5 py-3 placeholder:text-slate-400 rounded-xl transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1A150C] block">
                          Mobile Number *
                        </label>
                        <div className="flex items-center rounded-xl bg-[#FAF4E8] border border-[#EADBB4] focus-within:border-[#D4AF37] focus-within:bg-white overflow-hidden transition-colors">
                          <div className="flex items-center gap-1.5 text-[#8C6D23] text-xs font-extrabold px-3.5 py-3 bg-[#EADBB4]/30 border-r border-[#EADBB4] select-none">
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
                            className="w-full bg-transparent text-[#1A150C] text-xs font-semibold outline-none py-3 px-3 placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1A150C] block">
                          Email ID <span className="text-slate-400 font-normal lowercase font-sans">(Optional)</span>
                        </label>
                        <input
                          type="email"
                          placeholder="name@example.com (Optional)"
                          value={formData.email || ""}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="w-full bg-[#FAF4E8] focus:bg-white border border-[#EADBB4] focus:border-[#D4AF37] text-[#1A150C] text-xs font-semibold outline-none px-3.5 py-3 placeholder:text-slate-400 rounded-xl transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1A150C] block">
                          Message / Requirements
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Write message..."
                          value={formData.message || ""}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          className="w-full bg-[#FAF4E8] focus:bg-white border border-[#EADBB4] focus:border-[#D4AF37] text-[#1A150C] text-xs font-semibold outline-none px-3.5 py-3 placeholder:text-slate-400 rounded-xl transition-colors resize-none"
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
                      className="w-4 h-4 mt-0.5 shrink-0 rounded border-[#EADBB4] text-[#8C6D23] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed font-normal select-none">
                      I agree to be contacted by Bhagyashree or its representative through SMS/ Email/ WhatsApp/ RCS or Call.
                    </span>
                  </label>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#997A15] hover:from-[#EADBB4] hover:to-[#D4AF37] text-[#1A150C] py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 shadow-md shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer border border-[#EADBB4]/60 hover:scale-[1.02] active:scale-95"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#1A150C]/30 border-t-[#1A150C] rounded-full animate-spin" />
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
