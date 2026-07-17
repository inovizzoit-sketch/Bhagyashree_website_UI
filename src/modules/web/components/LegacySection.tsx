import React from "react";
import SectionHeading from "@/shared/components/SectionHeading";

interface LegacyItem {
  iconSvg: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
}

const legacyItems: LegacyItem[] = [
  {
    iconSvg: (
      // Appreciates with Assurance (shield with checkmark)
      <svg className="w-10 h-10 text-[#DDBD81]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12l2.2 2.2L15.5 9" />
      </svg>
    ),
    title: "Appreciates with Assurance",
    subtitle: "",
    description: "Strategically located and expertly developed, branded land grows in value with confidence.",
  },
  {
    iconSvg: (
      // Build a Legacy (sapling / growth)
      <svg className="w-10 h-10 text-[#DDBD81]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V11" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-3.5 2.5-6 6-6-1 3.5-2.5 6-6 6zm0 0c0-3.5-2.5-6-6-6 1 3.5 2.5 6 6 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6" />
      </svg>
    ),
    title: "Build a Legacy",
    subtitle: "",
    description: "Future-ready land from a trusted brand built to preserve and grow wealth across generations.",
  },
  {
    iconSvg: (
      // Limitless Potential (compass)
      <svg className="w-10 h-10 text-[#DDBD81]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9.5L13 13l-3.5 1.5L11 11l3.5-1.5z" />
      </svg>
    ),
    title: "Limitless Potential",
    subtitle: "",
    description: "From dream homes to retreats, branded land comes ready with infrastructure and legal clarity.",
  },
  {
    iconSvg: (
      // Secure and Stable (padlock)
      <svg className="w-10 h-10 text-[#DDBD81]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10.5V7a4 4 0 018 0v3.5" />
        <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: "Secure and Stable",
    subtitle: "",
    description: "Legally vetted, tangible, and resilient branded land stands strong in any market.",
  },
  {
    iconSvg: (
      // Dual value of Land (balance scale)
      <svg className="w-10 h-10 text-[#DDBD81]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M8 20h8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h6M13 7h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 7l-2.5 5a2.5 2.5 0 005 0L5 7zM19 7l-2.5 5a2.5 2.5 0 005 0L19 7z" />
      </svg>
    ),
    title: "Dual value of Land",
    subtitle: "",
    description: "Branded land not only offers potential rental income but also acts as a powerful collateral asset.",
  },
];

export default function LegacySection() {
  return (
    <section className="w-full bg-[#030623] py-14 lg:py-20 overflow-hidden border-t border-white/5 font-sans relative">
      {/* Visual background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-gold-solid/3 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-gold-solid/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">

        <SectionHeading 
          badge="Legacy & Wealth"
          plainText="Why Branded Land" 
          highlightText="Is The New Legacy" 
        />

        {/* 5-column Grid: Stacks on mobile/tablet, stretches on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8 items-start">
          {legacyItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start text-left animate-in fade-in slide-in-from-bottom duration-700 group cursor-default"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              {/* Floating Icon Base Pedestal Vector matching image */}
              <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-white/[0.02] to-[#0a0d2a] border border-white/5 rounded-2xl flex items-center justify-center mb-6 overflow-hidden hover:border-gold-solid/25 transition-all duration-500 shadow-xl">
                {/* Subtle internal gold gradient glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-gold-solid/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                  {item.iconSvg}
                </div>
                {/* Visual pedestal line base */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-solid/20 to-transparent group-hover:via-gold-solid/50 transition-all duration-500" />
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-white leading-snug group-hover:text-gold-solid transition-colors duration-300">
                {item.title}
              </h3>

              {/* Description Body */}
              <p className="mt-3.5 text-xs sm:text-sm text-[#8E90A2] leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}