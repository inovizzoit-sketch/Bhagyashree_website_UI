"use client";

import React from "react";
import SectionHeading from "@/shared/components/SectionHeading";
import { useEnquiry } from "@/shared/context/EnquiryContext";

interface LegacyItem {
  iconSvg: React.ReactNode;
  title: string;
  description: string;
}

const legacyItems: LegacyItem[] = [
  {
    iconSvg: (
      <svg className="w-6 h-6 text-gold-solid" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12l2.2 2.2L15.5 9" />
      </svg>
    ),
    title: "Appreciates with Assurance",
    description: "Strategically located and expertly developed, branded land grows in value with confidence.",
  },
  {
    iconSvg: (
      <svg className="w-6 h-6 text-gold-solid" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
      <svg className="w-6 h-6 text-gold-solid" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9.5L13 13l-3.5 1.5L11 11l3.5-1.5z" />
      </svg>
    ),
    title: "Limitless Potential",
    description: "From dream homes to retreats, branded land comes ready with infrastructure and legal clarity.",
  },
  {
    iconSvg: (
      <svg className="w-6 h-6 text-gold-solid" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10.5V7a4 4 0 018 0v3.5" />
      </svg>
    ),
    title: "Secure and Stable",
    description: "Legally vetted, tangible, and resilient branded land stands strong in any market conditions.",
  },
  {
    iconSvg: (
      <svg className="w-6 h-6 text-gold-solid" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
    <section className="w-full py-16 lg:py-24 relative overflow-hidden font-sans bg-transparent">
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Heading and Brand Narrative */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left sticky top-24">
            <SectionHeading 
              badge="Legacy & Wealth"
              plainText="Why Branded Land" 
              highlightText="Is The New Legacy" 
              className="!mb-6"
            />
            <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed max-w-md">
              Land ownership is not just about plots; it is about creating multi-generational wealth, security, and a lasting family legacy with complete peace of mind.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start w-full">
              <button 
                onClick={() => openEnquiry()}
                className="px-6 py-3 rounded-xl bg-dark-primary hover:bg-dark-secondary text-white text-xs font-extrabold uppercase tracking-widest transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Build Your Legacy
              </button>
            </div>
          </div>

          {/* Right Column: Premium Cascading timeline card flow */}
          <div className="flex flex-col gap-6 w-full">
            {legacyItems.map((item, idx) => (
              <div 
                key={idx}
                className="group flex flex-col sm:flex-row gap-5 items-start p-6 rounded-2xl border border-card-border bg-card-bg hover:border-gold-solid/40 hover:shadow-[0_15px_30px_var(--shadow-color)] transition-all duration-300 relative overflow-hidden"
              >
                {/* Accent border line */}
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-gold-solid/0 via-gold-solid/25 to-gold-solid/0 group-hover:from-gold-solid group-hover:to-gold-solid transition-all duration-300" />
                
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-gold-solid/10 transition-colors duration-300">
                  {item.iconSvg}
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight leading-snug group-hover:text-gold-solid transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
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
