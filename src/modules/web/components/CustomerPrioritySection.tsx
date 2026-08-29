"use client";

import React from "react";
import SectionHeading from "@/shared/components/SectionHeading";
import { useEnquiry } from "@/shared/context/EnquiryContext";

export default function CustomerPrioritySection() {
  const { openEnquiry } = useEnquiry();

  const priorityPoints = [
    {
      title: "Low-Cost Plot Options",
      description:
        "Budget-friendly residential & commercial plots with uncompromised infrastructure, making prime land investment accessible for every buyer.",
    },
    {
      title: "Professional Investment Guidance",
      description:
        "Expert market advice and local corridor insights to help you make safe, informed, and high-return real estate decisions.",
    },
    {
      title: "100% Legal & Verified Titles",
      description:
        "Fully audit-verified plots, transparent transactions, and hassle-free registry documentation for complete peace of mind.",
    },
    {
      title: "Simple & Fast Accessibility",
      description:
        "Quick site visits, instant plot demarcation, and seamless booking processes in top-growth sectors across Prayagraj & Mirzapur.",
    },
  ];

  return (
    <section className="w-full min-h-[600px] lg:h-screen flex items-center justify-center bg-[#FAF4E8]/60 py-10 lg:py-0 relative overflow-hidden border-t border-b border-[#EADBB4]/60 font-sans">
      {/* Decorative ambient background glows */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#8C6D23]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Customer Priority Narrative & Points */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-4 sm:space-y-5 text-left">
            <div>
              <SectionHeading
                badge="Customer Centricity"
                plainText="We Always Prioritize"
                highlightText="Our Customers"
                align="left"
                className="!mb-2"
              />
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#8C6D23]">
                AB HONGE SAPNE SAKAAR
              </p>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-normal max-w-2xl">
              As one of Prayagraj & Mirzapur&apos;s leading land development companies,{" "}
              <strong className="text-[#1A150C] font-extrabold">BHAGYASHREE REAL ESTATE</strong> is committed to delivering premium residential and commercial plots built on{" "}
              <strong className="text-[#8C6D23] font-bold">honesty, legal clarity, and long-term trust</strong>.
            </p>

            {/* 4 Feature Points List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-1">
              {priorityPoints.map((point, idx) => (
                <div key={idx} className="bg-white/90 border border-[#EADBB4] hover:border-[#D4AF37] p-4 rounded-2xl transition-all shadow-sm hover:shadow-md space-y-1.5 group">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#1A150C]">
                    <span className="text-[#8C6D23] font-black text-sm group-hover:scale-110 transition-transform">✓</span>
                    <span className="text-[#8C6D23] cursor-pointer hover:underline" onClick={() => openEnquiry(point.title)}>
                      {point.title}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-normal font-normal pl-4">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Clean Image Only - No Outer Border */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            <div className="relative w-full overflow-hidden rounded-[2rem] shadow-xl bg-white">
              <img
                src="/images/section2.png"
                alt="Bhagyashree Development"
                className="w-full h-auto max-h-[540px] object-contain mx-auto block transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
