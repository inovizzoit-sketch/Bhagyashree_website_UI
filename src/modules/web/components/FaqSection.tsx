"use client";

import React, { useState } from "react";
import SectionHeading from "@/shared/components/SectionHeading";
import { useEnquiry } from "@/shared/context/EnquiryContext";
import DecorativeCircles from "./DecorativeCircles";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FaqSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const { openEnquiry } = useEnquiry();

  const faqs: FAQItem[] = [
    {
      question: "Are the plots offered by Bhagyashree Real Estate approved by local authorities and ready for investment?",
      answer: "Yes, all plots are applied for local authority approvals, come with clear land titles and have complete infrastructure (paved roads, drainage, water, and electricity). They are ready for both long-term investment and future construction.",
    },
    {
      question: "What kind of support does Bhagyashree Real Estate offer to NRI buyers?",
      answer: "Bhagyashree offers comprehensive end-to-end support for NRI buyers, including virtual site tours, secure digital transaction pathways, remote legal documentation assistance, and dedicated relationship managers to guide you through registration and mutation.",
    },
    {
      question: "What makes Bhagyashree Real Estate different from other real estate or land developers?",
      answer: "Unlike unorganized land sellers, Bhagyashree provides institutional security, pre-built high-quality utilities, clear boundary layout demarcations, and fully gated layouts. We sell peace of mind alongside prime properties.",
    },
    {
      question: "How does Bhagyashree Real Estate deliver long-term value to land investors?",
      answer: "By strategically selecting high-growth transit corridors in Mirzapur (including major highway corridors and upcoming development zones) and adding premium amenities (clubhouses, wellness parks, security), we secure rapid capital appreciation that outperforms raw, unorganized land.",
    },
    {
      question: "How does Bhagyashree Real Estate ensure legally secure and transparent land transactions?",
      answer: "Every parcel is backed by a 30-year clear title registry history, non-agricultural (NA) conversion certificates, and complete municipal clearance documentation that is fully shared with buyers before purchase.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="w-full py-10 md:py-14 bg-surface font-sans">
      {/* FAQ Schema Markup for AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-7xl px-6 md:px-8 grid lg:grid-cols-[0.72fr_1.28fr] gap-8 lg:gap-14 items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            badge="F.A.Q."
            plainText="Frequently Asked"
            highlightText="Questions"
            align="left"
            className="!mb-3"
          />
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 max-w-sm font-normal mb-6">
            Clear answers are part of a transparent land-buying experience. Explore the essentials before taking your next step.
          </p>
          <div className="mt-6 rounded-3xl bg-[#1A150C] p-6 sm:p-7 text-white relative overflow-hidden border border-[#D4AF37]/30 shadow-xl">
            <DecorativeCircles
              theme="dark"
              circles={[
                { size: 180, right: "-40px", top: "-40px", opacity: 0.12, color: "border-[#D4AF37]/20" },
                { size: 120, right: "-20px", top: "-20px", opacity: 0.08, color: "border-white/10" }
              ]}
            />
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-extrabold">Still deciding?</p>
              <p className="mt-3 text-xl font-sans font-bold leading-snug">Speak with our land advisory team for clear, personal guidance.</p>
              <button
                type="button"
                onClick={() => openEnquiry()}
                className="mt-6 w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#997A15] hover:from-[#EADBB4] hover:to-[#D4AF37] px-6 py-3.5 text-xs font-extrabold uppercase tracking-widest text-[#1A150C] hover:text-[#1A150C] shadow-lg transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] cursor-pointer min-h-[44px]"
              >
                Request a consultation
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#EADBB4] hover:border-[#D4AF37] rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-sm md:text-base text-[#1A150C] hover:text-[#8C6D23] transition-colors cursor-pointer outline-none bg-transparent border-none min-h-[48px]"
              >
                <span className="pr-4 leading-snug">{faq.question}</span>
                <span className={`text-[#D4AF37] font-extrabold text-xs transform transition-transform duration-300 shrink-0 ${activeFaq === idx ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-6 pt-2 text-xs md:text-sm text-slate-600 leading-relaxed font-normal border-t border-[#EADBB4]/50 animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
