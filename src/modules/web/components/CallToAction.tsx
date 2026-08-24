"use client";

import React from "react";
import { useEnquiry } from "@/shared/context/EnquiryContext";

interface CallToActionProps {
  locationName?: string;
  phone?: string;
}

export default function CallToAction({
  locationName = "Mirzapur",
  phone = "+91 6307274881, 91981 76509"
}: CallToActionProps) {
  const { openEnquiry } = useEnquiry();

  return (
    <div className="mx-auto max-w-5xl px-6 md:px-8 relative z-10">
      <div className="bg-gradient-to-r from-[#0d153b] via-[#050c38] to-[#020520] border border-white/15 p-8 md:p-14 rounded-3xl text-center space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold-solid/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Decorative Compass on Left */}
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-64 h-64 opacity-25 pointer-events-none hidden lg:block select-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gold-solid">
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
            <text x="50" y="59" textAnchor="middle" fill="currentColor" className="font-serif text-3xl font-light tracking-wide">B</text>
          </svg>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold-solid">Ready to Invest?</span>
          <h3 className="text-2xl md:text-4xl font-serif text-white font-light leading-tight">
            Begin your secure land legacy <span className="font-medium italic text-gold-solid">today</span>
          </h3>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
            Connect with our land investment consultants to schedule a guided site tour of our premium layouts in {locationName}.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
          <button
            onClick={() => openEnquiry()}
            className="w-full sm:w-auto rounded-full bg-gold-solid px-8 py-4 text-xs font-bold uppercase tracking-widest text-dark-primary hover:bg-gold-hover hover:scale-105 active:scale-95 transition-all shadow-[0_4px_25px_rgba(221,189,129,0.3)]"
          >
            ENQUIRE NOW
          </button>
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="w-full sm:w-auto text-center rounded-full border border-white/20 bg-transparent px-8 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 hover:border-white transition-all no-underline"
          >
            CALL CONSULTANT
          </a>
        </div>
      </div>
    </div>
  );
}
