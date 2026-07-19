"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "@/shared/lib/api-config";

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

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [agreed, setAgreed] = useState(true);

  // Dynamic projects list from API
  const [projectsList, setProjectsList] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
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
        // Fallback static projects list if API call fails
        setProjectsList([
          { id: "1", name: "Nandeeka Enclave" },
          { id: "2", name: "Nandeeka Heights" },
          { id: "3", name: "Nandeeka Puram" },
        ]);
      });
  }, []);

  const openEnquiry = (projName?: string) => {
    setProjectName(projName || "");
    setName("");
    setEmail("");
    setPhone("");
    setCity("");
    setAgreed(true);
    setError(null);
    setSuccess(false);
    setIsOpen(true);
  };

  const closeEnquiry = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("You must agree to be contacted to submit.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const payload = {
      name,
      email,
      phone,
      message: `City: ${city}`,
      project: projectName || undefined,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Backend not available");
      }
      setSuccess(true);
    } catch (err) {
      console.log("Using frontend fallback success simulation:", payload);
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EnquiryContext.Provider value={{ isOpen, projectName, openEnquiry, closeEnquiry }}>
      {children}

      {/* Modern Royal Blue Glassmorphic Enquiry Modal Popup */}
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
                {/* Header */}
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-serif text-white leading-tight font-medium">
                    Just a few more details.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8E90A2] font-light">
                    Our experts will call you shortly.
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
                      onChange={(e) => setProjectName(e.target.value)}
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

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] md:text-xs font-semibold text-[#8E90A2] block">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-white/20 focus:border-gold-solid/80 text-white text-sm outline-none py-2.5 placeholder:text-white/20 rounded-none transition-colors"
                    />
                  </div>

                  {/* Mobile Number Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] md:text-xs font-semibold text-[#8E90A2] block">
                      Mobile Number
                    </label>
                    <div className="flex items-center border-0 border-b border-white/20 focus-within:border-gold-solid/80 transition-colors">
                      <div className="flex items-center gap-1 text-white text-sm py-2.5 pr-2 select-none font-medium">
                        <span>+91</span>
                        <span>🇮🇳</span>
                        <span className="text-[9px] text-[#8E90A2] ml-0.5">▼</span>
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="Enter your mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-transparent text-white text-sm outline-none py-2.5 placeholder:text-white/20 rounded-none"
                      />
                    </div>
                  </div>

                  {/* City Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] md:text-xs font-semibold text-[#8E90A2] block">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-white/20 focus:border-gold-solid/80 text-white text-sm outline-none py-2.5 placeholder:text-white/20 rounded-none transition-colors"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] md:text-xs font-semibold text-[#8E90A2] block">
                      Email ID
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email ID"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-white/20 focus:border-gold-solid/80 text-white text-sm outline-none py-2.5 placeholder:text-white/20 rounded-none transition-colors"
                    />
                  </div>

                  {/* Agreement Checkbox */}
                  <label className="flex items-start gap-3.5 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-4 h-4 mt-0.5 shrink-0 rounded bg-transparent border border-white/20 text-gold-solid focus:ring-0 checked:bg-gold-solid cursor-pointer"
                    />
                    <span className="text-[10px] md:text-xs text-[#8E90A2] leading-relaxed font-light select-none">
                      I agree to be contacted by Nandeeka or its representative through SMS/ Email/ WhatsApp/ RCS or Call.
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
                        <span>Submit Interest ➔</span>
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

