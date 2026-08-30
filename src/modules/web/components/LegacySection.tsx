"use client";

import React from "react";
import SectionHeading from "@/shared/components/SectionHeading";
import { useEnquiry } from "@/shared/context/EnquiryContext";
import DecorativeCircles from "./DecorativeCircles";

interface LegacyItem {
  iconSvg: React.ReactNode;
  title: string;
  description: string;
}

const legacyItems: LegacyItem[] = [
  {
    iconSvg: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-current transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12l2.2 2.2L15.5 9" />
      </svg>
    ),
    title: "Appreciates with Assurance",
    description: "Strategically located and expertly developed, branded land grows in value with confidence.",
  },
  {
    iconSvg: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-current transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V11" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-3.5 2.5-6 6-6-1 3.5-2.5 6-6 6zm0 0c0-3.5-2.5-6-6-6 1 3.5 2.5 6 6 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6" />
      </svg>
    ),
    title: "Build a Legacy",
    description: "Future-ready land from a trusted brand built to preserve and grow wealth across generations.",
  },
  {
    iconSvg: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-current transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9.5L13 13l-3.5 1.5L11 11l3.5-1.5z" />
      </svg>
    ),
    title: "Limitless Potential",
    description: "From dream homes to retreats, branded land comes ready with infrastructure and legal clarity.",
  },
  {
    iconSvg: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-current transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10.5V7a4 4 0 018 0v3.5" />
      </svg>
    ),
    title: "Secure and Stable",
    description: "Legally vetted, tangible, and resilient branded land stands strong in any market conditions.",
  },
  {
    iconSvg: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-current transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M8 20h8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h6M13 7h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 7l-2.5 5a2.5 2.5 0 005 0L5 7zM19 7l-2.5 5a2.5 2.5 0 005 0L19 7z" />
      </svg>
    ),
    title: "Dual value of Land",
    description: "Branded land not only offers potential rental income but also acts as a powerful collateral asset.",
  },
];

export default function LegacySection() {
  const { openEnquiry } = useEnquiry();

  return (
    <section className="w-full min-h-screen flex items-center justify-center py-10 md:py-14 relative overflow-hidden font-sans bg-[#FBF8F2] border-t border-b border-[#EADBB4]/60">
      <DecorativeCircles
        theme="light"
        circles={[
          { size: 620, left: "-310px", top: "10%", opacity: 0.06 }
        ]}
      />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 w-full">
        
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Column: Heading and Brand Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-between items-start text-left bg-[#1A150C] rounded-[2rem] p-7 md:p-8 overflow-hidden border border-[#D4AF37]/30 shadow-2xl relative min-h-[380px] lg:min-h-[440px]">
            <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full border border-[#D4AF37]/20 pointer-events-none" />
            
            <div>
              <SectionHeading 
                badge="Legacy & Wealth"
                plainText="Why Branded Land" 
                highlightText="Is The New Legacy" 
                className="!mb-3 [&_h2]:!text-white"
              />
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Land ownership is not just about plots; it is about creating multi-generational wealth, security, and a lasting family legacy with complete peace of mind.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 justify-start w-full relative z-10">
              <button 
                onClick={() => openEnquiry()}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#997A15] hover:from-[#EADBB4] hover:to-[#D4AF37] text-[#1A150C] hover:text-[#1A150C] text-xs font-extrabold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer min-h-[44px]"
              >
                Build Your Legacy
              </button>
            </div>
          </div>

          {/* Right Column: 5 Connected Timeline Cards fitting 100% inside Single Screen View */}
          <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-3.5 w-full relative pl-6 sm:pl-8 border-l-2 border-[#D4AF37]/40 ml-2 sm:ml-4">
            {legacyItems.map((item, idx) => (
              <div 
                key={idx}
                className="group flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border border-[#EADBB4] bg-white hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/10 hover:translate-x-1.5 transition-all duration-300 relative overflow-hidden"
              >
                {/* Connected Node Dot on the Vertical Line */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FAF4E8] border-2 border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:scale-125 transition-all duration-300 flex items-center justify-center z-10 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] group-hover:bg-white" />
                </div>

                <div className="w-1 absolute top-0 bottom-0 left-0 bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Premium Icon Container */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FAF4E8] border border-[#EADBB4] text-[#8C6D23] flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37] group-hover:text-[#1A150C] group-hover:border-[#D4AF37] transition-all duration-300 shadow-sm">
                  {item.iconSvg}
                </div>

                {/* Text Content */}
                <div className="flex flex-col min-w-0">
                  <h3 className="text-sm sm:text-base font-extrabold text-[#1A150C] tracking-tight group-hover:text-[#8C6D23] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-600 leading-snug font-normal line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
