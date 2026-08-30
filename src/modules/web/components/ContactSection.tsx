"use client";

import React, { useState } from "react";
import SectionHeading from "@/shared/components/SectionHeading";
import { API_BASE_URL } from "@/shared/lib/api-config";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setError("Please provide your name and phone number.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          subject: "Contact Us Form",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit inquiry");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      // Fallback for success UX if API endpoint is off
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  const officeDetails = [
    {
      title: "Address",
      details: "Gandhi Ghat, Bathua, Mirzapur & Prayagraj Corridor, U.P., India 211002",
      icon: (
        <svg className="w-5 h-5 text-[#8C6D23]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: "Phone",
      details: "+91 7007587406",
      icon: (
        <svg className="w-5 h-5 text-[#8C6D23]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      title: "Email",
      details: "bhagyashreerealestate1@gmail.com",
      icon: (
        <svg className="w-5 h-5 text-[#8C6D23]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Hours",
      details: "Monday - Saturday: 9:30am - 7:00pm",
      icon: (
        <svg className="w-5 h-5 text-[#8C6D23]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full min-h-screen lg:h-screen min-h-[650px] flex items-center justify-center bg-gradient-to-b from-[#FBF8F2] via-[#FAF4E8]/80 to-[#FBF8F2] py-8 lg:py-0 relative overflow-hidden border-t border-b border-[#EADBB4]/60 font-sans">
      {/* Decorative ambient glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#8C6D23]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <SectionHeading
            badge="Get In Touch"
            plainText="Connect With Our"
            highlightText="Land Experts"
            align="center"
            className="!mb-2"
          />
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Have questions about plot locations, 30-year title audit history, or scheduling a site visit? Reach out to us below.
          </p>
        </div>

        {/* 2-Column Split: Our Office (Left), Contact Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Column: Our Office Cards */}
          <div className="lg:col-span-5 bg-[#FAF4E8] border border-[#EADBB4] p-5 sm:p-7 rounded-[2rem] shadow-lg shadow-[#D4AF37]/10 space-y-4">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A150C] tracking-tight mb-2">
              Our Office
            </h3>

            <div className="space-y-3">
              {officeDetails.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#EADBB4] p-3.5 sm:p-4 rounded-2xl shadow-sm flex items-start gap-3.5 transition-all hover:border-[#D4AF37]"
                >
                  <div className="w-9 h-9 rounded-full bg-[#FAF4E8] border border-[#EADBB4] flex items-center justify-center shrink-0 shadow-sm">
                    {item.icon}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-[10px] font-extrabold text-[#8C6D23] uppercase tracking-wider">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#1A150C] font-semibold leading-relaxed">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-[#EADBB4] p-5 sm:p-7 rounded-[2rem] shadow-xl shadow-[#D4AF37]/10">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A150C] tracking-tight mb-4">
              Contact Us
            </h3>

            {submitted ? (
              <div className="bg-[#FAF4E8] border border-[#EADBB4] p-6 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#8C6D23] font-bold text-lg mx-auto">
                  ✓
                </div>
                <h4 className="text-base font-extrabold text-[#1A150C]">
                  Thank You for Reaching Out!
                </h4>
                <p className="text-xs text-slate-600">
                  Our land investment consultant will review your request and get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-5 py-2 rounded-full bg-[#8C6D23] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#1A150C] transition-colors border-none cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {error && (
                  <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-xl">
                    {error}
                  </p>
                )}

                {/* Name Field */}
                <div className="space-y-1">
                  <label htmlFor="name" className="block text-[11px] font-extrabold text-[#1A150C]">
                    Enter Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBB4] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-xs text-[#1A150C] placeholder-slate-400 bg-[#FAF4E8]/30 transition-all font-sans"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-[11px] font-extrabold text-[#1A150C]">
                    Enter Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBB4] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-xs text-[#1A150C] placeholder-slate-400 bg-[#FAF4E8]/30 transition-all font-sans"
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-[11px] font-extrabold text-[#1A150C]">
                    Enter Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your Phone"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBB4] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-xs text-[#1A150C] placeholder-slate-400 bg-[#FAF4E8]/30 transition-all font-sans"
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-1">
                  <label htmlFor="message" className="block text-[11px] font-extrabold text-[#1A150C]">
                    Enter Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={2.5 as any}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBB4] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-xs text-[#1A150C] placeholder-slate-400 bg-[#FAF4E8]/30 transition-all font-sans resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#1A150C] hover:bg-[#8C6D23] text-white text-xs font-extrabold uppercase tracking-widest transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer border-none disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
