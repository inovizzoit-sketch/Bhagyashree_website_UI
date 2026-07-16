"use client";

import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function DecodingLandPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { value: "5x", label: "Historic Land Multiplier" },
    { value: "100%", label: "Title Ownership Clarity" },
    { value: "24/7", label: "Security & Encroachment Protection" },
    { value: "0%", label: "Risk on Boundary Auditing" },
  ];

  const comparisons = [
    {
      feature: "Title Clearance & Legal Auditing",
      traditional: "Tedious manual tracking, high risk of double-sales or disputes.",
      nandeeka: "100% vetted clear titles, backed by legal certificate guarantee.",
    },
    {
      feature: "Infrastructure Development",
      traditional: "Raw plots without access roads, power lines, or water drains.",
      nandeeka: "Integrated avenues, paved asphalt roads, sewage, and power lines pre-installed.",
    },
    {
      feature: "Encroachment & Security",
      traditional: "Vulnerable to illegal land grabbing; requires continuous vigilance.",
      nandeeka: "Fully gated community, boundary fences, and 24/7 round-the-clock guards.",
    },
    {
      feature: "Resale Liquidity",
      traditional: "Takes months to find private buyers; opaque pricing.",
      nandeeka: "Branded community ecosystem with high-demand resale facilitation.",
    },
  ];

  const faqs: FAQItem[] = [
    {
      question: "What makes branded land a safer asset class than traditional plots?",
      answer: "Traditional plotted land lacks standardized title documentation and physical infrastructure. Nandeeka's branded land guarantees completely clean legal titles, immediate registration readiness, pre-built physical infrastructures (asphalt roads, electricity lines, gated communities), and continuous guard surveillance to eliminate encroachment risk.",
    },
    {
      question: "How does Nandeeka guarantee boundary ownership clarity?",
      answer: "We employ precision digital surveying technology and physical boundary fencing. Every plot has designated geo-coordinates, verified through government registration maps, eliminating boundary disputes or overlap claims.",
    },
    {
      question: "Is RERA registration mandatory for plotting developments?",
      answer: "Yes, all our plotting layouts are registered under regional RERA standards. This guarantees that layout drawings, amenities timelines, and title certificates conform fully to statutory regulatory norms.",
    },
    {
      question: "Can I obtain financing or bank loans for purchasing plots?",
      answer: "Absolutely. Because Nandeeka developments feature verified clean titles and government-approved layouts, all leading national banks facilitate standard land acquisition loans for our buyers.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020520] pb-32 overflow-hidden relative text-slate-300">
      {/* Visual background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-gold-solid/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[60vh] -right-[200px] w-[500px] h-[500px] bg-gold-solid/2 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Header Banner */}
      <div className="relative pt-28 pb-16 md:pt-36 md:pb-20 z-10">
        <div className="mx-auto max-w-5xl px-6 md:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-solid/5 border border-gold-solid/20 text-[10px] font-bold uppercase tracking-widest text-gold-solid">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-solid animate-pulse"></span>
            Asset Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white font-sans leading-tight">
            Decoding <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-solid via-gold-hover to-gold-dark">Land</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base md:text-lg text-text-gray-muted leading-relaxed font-light">
            Demystifying land acquisitions. Learn why branded plotted land is the ultimate hedge against inflation and how we guarantee legal safety, security, and wealth generation.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 md:px-8 relative z-10 space-y-20">
        {/* Animated Counter Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#050c38]/20 border border-white/5 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-1">
              <span className="text-3xl md:text-4xl font-extrabold text-gold-solid block">
                {stat.value}
              </span>
              <span className="text-[10px] text-text-gray-muted uppercase tracking-wider block font-light">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Traditional Plotted vs Nandeeka Branded Land */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white font-sans">
              Making The Difference
            </h2>
            <p className="text-xs text-text-gray-muted uppercase tracking-widest font-mono">
              Traditional Unorganized Plots vs. Nandeeka Branded Ecosystem
            </p>
          </div>

          <div className="overflow-hidden border border-white/5 rounded-2xl bg-[#050c38]/15 shadow-2xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-[#050c38]/40 text-text-gray-muted font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Investment Dimension</th>
                    <th className="px-6 py-4">Traditional Unorganized Ploting</th>
                    <th className="px-6 py-4 text-gold-solid">Nandeeka Branded Land</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {comparisons.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#050c38]/10 transition-colors">
                      <td className="px-6 py-4 font-bold text-white max-w-[200px]">
                        {item.feature}
                      </td>
                      <td className="px-6 py-4 text-sm font-light leading-relaxed text-text-gray-muted">
                        {item.traditional}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium bg-gold-solid/5 border-l border-gold-solid/10 leading-relaxed text-text-gray-light">
                        {item.nandeeka}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Due Diligence Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-solid">
              Risk Management
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white font-sans tracking-tight">
              Our 5-Fold Legal Due Diligence
            </h2>
            <p className="text-base text-text-gray-muted leading-relaxed font-light">
              We perform rigorous legal vetting and infrastructure planning before any land development starts. Nandeeka covers the compliance checklist so you can invest with absolute peace of mind.
            </p>
          </div>
          
          <div className="lg:col-span-6 space-y-4">
            {[
              { num: "01", title: "Comprehensive Title Search", desc: "30-year historical title verification to establish complete ownership chain." },
              { num: "02", title: "NA (Non-Agricultural) Certification", desc: "Verifying clear zoning conversions and boundary layout map clearances." },
              { num: "03", title: "RERA Registrations", desc: "Registered under statutory norms ensuring transparent construction and delivery timelines." },
              { num: "04", title: "Geo-fenced Boundary Mapping", desc: "Precise coordinates matching revenue records to secure layout margins." },
              { num: "05", title: "Pre-installed Utility Infrastructure", desc: "Ensuring power, water connection networks, and storm drains are fully ready." },
            ].map((check, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-[#050c38]/20 border border-white/5 rounded-xl hover:border-gold-solid/35 transition-colors">
                <span className="text-gold-solid font-mono font-bold text-lg">{check.num}</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-base">{check.title}</h4>
                  <p className="text-sm text-text-gray-muted font-light leading-relaxed">{check.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white font-sans">
              Frequently Asked Legalities
            </h2>
            <p className="text-xs text-text-gray-muted uppercase tracking-widest font-mono">
              Navigating Rules, Taxes, and Registration Compliance
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#050c38]/20 border border-white/5 hover:border-white/10 rounded-xl overflow-hidden shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-sm md:text-base text-white hover:text-gold-solid transition-colors cursor-pointer outline-none bg-transparent border-none"
                >
                  <span>{faq.question}</span>
                  <span className={`text-gold-solid text-xs transform transition-transform duration-300 ${activeFaq === idx ? "rotate-95" : ""}`}>
                    {activeFaq === idx ? "▲" : "▼"}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-sm text-text-gray-muted leading-relaxed font-light border-t border-white/5 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
