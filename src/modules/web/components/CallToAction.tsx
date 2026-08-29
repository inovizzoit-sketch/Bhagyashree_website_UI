"use client";

import React from "react";
import { useEnquiry } from "@/shared/context/EnquiryContext";

interface CallToActionProps {
  locationName?: string;
  phone?: string;
}

export default function CallToAction({
  locationName = "Mirzapur & Prayagraj",
  phone = "+91 6307274881, 91981 76509"
}: CallToActionProps) {
  const { openEnquiry } = useEnquiry();

  return (
    <div className="mx-auto max-w-5xl px-6 md:px-8 relative z-10 font-sans">
      <div className="bg-[#FAF4E8] border border-[#EADBB4] p-8 md:p-14 rounded-[2.5rem] text-center space-y-8 shadow-xl shadow-[#D4AF37]/10 relative overflow-hidden">
        {/* Ambient Gold Glows */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#8C6D23]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Decorative Compass on Left */}
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-64 h-64 opacity-15 pointer-events-none hidden lg:block select-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#8C6D23]">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1.5" />
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              const length = i % 6 === 0 ? 5 : 3;
              return (
                <line
                  key={i}
                  x1="50"
                  y1={5}
                  x2="50"
                  y2={5 + length}
                  stroke="currentColor"
                  strokeWidth={i % 6 === 0 ? 0.8 : 0.4}
                  transform={`rotate(${angle} 50 50)`}
                />
              );
            })}
            <text x="50" y="59" textAnchor="middle" fill="currentColor" className="font-sans font-extrabold text-3xl tracking-wide">B</text>
          </svg>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#EADBB4] bg-white px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8C6D23] shadow-sm">
            <span>★</span> Ready to Invest?
          </span>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans text-[#1A150C] font-extrabold leading-tight tracking-tight">
            Begin Your Secure Land Legacy <span className="text-[#8C6D23]">Today</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-normal">
            Connect with our land investment consultants to schedule a guided site tour of our premium layouts in {locationName}.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10 pt-2">
          <button
            onClick={() => openEnquiry()}
            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#997A15] hover:from-[#EADBB4] hover:to-[#D4AF37] px-8 py-4 text-xs font-extrabold uppercase tracking-widest text-[#1A150C] hover:text-[#1A150C] transition-all duration-300 shadow-xl shadow-[#D4AF37]/20 hover:scale-105 active:scale-95 cursor-pointer border-none"
          >
            ENQUIRE NOW ➔
          </button>

          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="w-full sm:w-auto text-center rounded-full border border-[#8C6D23]/40 bg-white hover:bg-[#8C6D23] px-8 py-4 text-xs font-extrabold uppercase tracking-widest text-[#1A150C] hover:text-white transition-all duration-300 backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95 no-underline shadow-md"
          >
            CALL CONSULTANT
          </a>
        </div>
      </div>
    </div>
  );
}
