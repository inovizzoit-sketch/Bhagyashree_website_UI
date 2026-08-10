"use client";

import React from "react";
import SectionHeading from "@/shared/components/SectionHeading";

interface GovernancePrinciple {
  num: string;
  title: string;
  description: string;
  details: string[];
}

export default function GovernancePage() {
  const principles: GovernancePrinciple[] = [
    {
      num: "01",
      title: "RERA Compliant Frameworks",
      description: "We strictly adhere to the Real Estate Regulatory Authority standards across all ongoing projects.",
      details: [
        "100% project registration under regional RERA guidelines",
        "Clear disclosure of layouts, development timelines, and project margins",
        "Quarterly updates on site development progress reports"
      ]
    },
    {
      num: "02",
      title: "Title Vetting & Verification",
      description: "Our dedicated legal team conducts comprehensive vetting processes prior to land acquisition.",
      details: [
        "Minimum 30-year historical title search registries audit",
        "Clearance certificate confirmation from verified government legal advisors",
        "Non-agricultural (NA) conversion audit and boundary approvals"
      ]
    },
    {
      num: "03",
      title: "Financial Protection Protocols",
      description: "Investor capital is managed with strict escrow and allocation checks.",
      details: [
        "Designated project-specific bank escrow setups",
        "Allocated fund utilization exclusively for site development operations",
        "Clean compliance track records with national financial partners"
      ]
    },
    {
      num: "04",
      title: "Eco-Conscious Development",
      description: "Our layouts are designed to align harmoniously with Varanasi's town planning and environment.",
      details: [
        "Strict adherence to environmental impact clearances (EIC)",
        "Layout designs incorporating green buffers, water recharging, and plantation belts",
        "Compliance with state green energy regulations"
      ]
    }
  ];

  return (
    <div className="min-h-screen pb-32 overflow-hidden relative text-slate-300 font-sans">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-gold-solid/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40vh] -left-[200px] w-[500px] h-[500px] bg-gold-solid/2 rounded-full blur-[140px] pointer-events-none" />

      {/* Page Header */}
      <div className="relative pt-28 pb-6 md:pt-36 md:pb-8 z-10">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center">
          <SectionHeading
            badge="Compliance & Trust"
            plainText="Corporate"
            highlightText="Governance"
            align="center"
            className="!mb-4"
          />
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-text-gray-muted leading-relaxed font-light">
            Bhagyashree Enterprises operates under standard corporate governance models, delivering legal security, structural clarity, and transparent transactions to every investor.
          </p>
        </div>
      </div>

      {/* Grid of Principles */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {principles.map((principle, idx) => (
            <div
              key={idx}
              className="bg-[#050c38]/15 border border-white/5 hover:border-gold-solid/35 p-6 md:p-8 rounded-2xl shadow-xl transition-all duration-300 backdrop-blur-sm group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl md:text-2xl font-mono font-bold text-gold-solid">
                    {principle.num}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-gold-solid transition-colors duration-300">
                    {principle.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#8E90A2] font-light leading-relaxed">
                  {principle.description}
                </p>
              </div>

              {/* Bullet Details */}
              <ul className="mt-6 pt-4 border-t border-white/5 space-y-2 list-none text-xs sm:text-sm">
                {principle.details.map((detail, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-2.5">
                    <span className="text-gold-solid mt-0.5">✦</span>
                    <span className="font-light text-slate-200">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
