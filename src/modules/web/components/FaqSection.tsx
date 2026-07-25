"use client";

import React, { useState } from "react";
import SectionHeading from "@/shared/components/SectionHeading";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FaqSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Are the plots offered by NANDEEKA ENTERPRISES VDA approved and ready for investment?",
      answer: "Yes, all plots are applied for VDA approval, come with clear land titles and have complete infrastructure (paved roads, drainage, water, and electricity). They are ready for both long-term investment and future construction.",
    },
    {
      question: "What kind of support does Nandeeka Enterprises offer to NRI buyers?",
      answer: "Nandeeka offers comprehensive end-to-end support for NRI buyers, including virtual site tours, secure digital transaction pathways, remote legal documentation assistance, and dedicated relationship managers to guide you through registration and mutation.",
    },
    {
      question: "What makes NANDEEKA ENTERPRISES different from other real estate or land developers?",
      answer: "Unlike unorganized land sellers, Nandeeka provides institutional security, pre-built high-quality utilities, clear boundary layout demarcations, and fully gated layouts. We sell peace of mind alongside prime properties.",
    },
    {
      question: "How does NANDEEKA ENTERPRISES deliver long-term value to land investors?",
      answer: "By strategically selecting high-growth transit corridors (such as Varanasi's ring roads and DLW expansions) and adding premium amenities (clubhouses, wellness parks, security), we secure rapid capital appreciation that outperforms raw, unorganized land.",
    },
    {
      question: "How does NANDEEKA ENTERPRISES ensure legally secure and transparent land transactions?",
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
    <section className="w-full py-10 md:py-14 bg-background">
      {/* FAQ Schema Markup for AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <SectionHeading
          badge="F.A.Q."
          plainText="Frequently Asked"
          highlightText="Questions"
          align="center"
          className="!mb-8"
        />

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#050c38]/20 border border-white/5 hover:border-gold-solid/25 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 backdrop-blur-sm"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-sm md:text-base text-white hover:text-gold-solid transition-colors cursor-pointer outline-none bg-transparent border-none"
              >
                <span>{faq.question}</span>
                <span className={`text-gold-solid text-xs transform transition-transform duration-300 ${activeFaq === idx ? "rotate-95" : ""}`}>
                  {activeFaq === idx ? "▲" : "▼"}
                </span>
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-6 pt-2 text-xs md:text-sm text-[#8E90A2] leading-relaxed font-light border-t border-white/5 animate-fade-in">
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
