"use client";

import React, { useState } from "react";
import SectionHeading from "@/shared/components/SectionHeading";

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string[];
}

export default function DecodingLandPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogArticle | null>(null);

  const stats = [
    { value: "5x", label: "Historic Land Multiplier" },
    { value: "100%", label: "Title Ownership Clarity" },
    { value: "24/7", label: "Security & Encroachment Protection" },
    { value: "0%", label: "Risk on Boundary Auditing" },
  ];

  const articles: BlogArticle[] = [
    {
      id: "mirzapur-renaissance",
      title: "The Mirzapur Renaissance: Why Development Zones are Plotted Land's Next Goldmine",
      category: "Market Insights",
      date: "July 15, 2026",
      readTime: "4 min read",
      image: "/images/hero_brand.png",
      excerpt: "With the expansion of transit highways and rapid urban migration, Mirzapur's outskirts are witnessing unprecedented appreciation. Here's a deep dive into the numbers.",
      content: [
        "Mirzapur is experiencing an unprecedented structural boom. The expansion of transit corridors and arterial highway connectivity has brought new suburbs into the primary limelight for both commercial expansions and luxury residential plotting layout developments.",
        "Over the last 36 months, land values along the outer corridors have seen historic capital appreciation multipliers. The influx of retail spaces, institutional campuses, and national transit projects has created a supply-demand imbalance that favors early investors.",
        "Unlike traditional unorganized land segments where title clearing remains an issue, branded plotted avenues in Mirzapur offer secure investment channels with clear exit strategies, high resale liquidity, and robust legal backing."
      ]
    },
    {
      id: "branded-plotted-land",
      title: "Branded Plotted Land: The Safest Wealth Multiplier in 2026",
      category: "Land Economics",
      date: "July 12, 2026",
      readTime: "5 min read",
      image: "/images/About.jpeg",
      excerpt: "Why institutional security, legal clearances, and immediate road access make branded land layouts outperform traditional unorganized plots by 3x.",
      content: [
        "For decades, plotted land purchase was considered high-risk due to duplicate registrations, boundary overlaps, and encroachment threats. Branded land developers have changed the paradigm by offering institutional security.",
        "Branded plotted layouts undergo rigorous legal checks. They guarantee non-agricultural (NA) certification, local authority standard compliance, and clear demarcation from day one, which standardizes plot value appreciation.",
        "Additionally, branded layouts deliver ready utilities (paved asphalt roads, electricity connections, water supply drains) immediately. This pre-installed infrastructure ensures rapid valuation growth, outperforming raw agricultural plots by up to 300%."
      ]
    },
    {
      id: "legal-due-diligence",
      title: "The Smart Investor's Legal Checklist for Land in Uttar Pradesh",
      category: "Due Diligence",
      date: "July 08, 2026",
      readTime: "6 min read",
      image: "/images/wellness.png",
      excerpt: "Navigating non-agricultural certificates, local authority layout documentation, and land mutation records can be tricky. Here is our 5-step checklist.",
      content: [
        "Due diligence is the single most important step when acquiring land in Uttar Pradesh. First, verify the 'Khatauni' (land record registers) to establish the current ownership names and check for hidden bank mortgages.",
        "Ensure the plot is registered as Non-Agricultural (NA) or verify that a conversion certificate has been officially issued by the sub-divisional magistrate. This prevents zoning fines down the road.",
        "Finally, ensure that the layout is approved by local authorities. Buying inside a standard-compliant development protects your capital against developer defaults, boundary conflicts, and infrastructure delivery delays."
      ]
    }
  ];

  const comparisons = [
    {
      feature: "Title Clearance & Legal Auditing",
      traditional: "Tedious manual tracking, high risk of double-sales or disputes.",
      bhagyashree: "100% vetted clear titles, backed by legal certificate guarantee.",
    },
    {
      feature: "Infrastructure Development",
      traditional: "Raw plots without access roads, power lines, or water drains.",
      bhagyashree: "Integrated avenues, paved asphalt roads, sewage, and power lines pre-installed.",
    },
    {
      feature: "Encroachment & Security",
      traditional: "Vulnerable to illegal land grabbing; requires continuous vigilance.",
      bhagyashree: "Fully gated community, boundary fences, and 24/7 round-the-clock guards.",
    },
    {
      feature: "Resale Liquidity",
      traditional: "Takes months to find private buyers; opaque pricing.",
      bhagyashree: "Branded community ecosystem with high-demand resale facilitation.",
    },
  ];

  const faqs: FAQItem[] = [
    {
      question: "What makes branded land a safer asset class than traditional plots?",
      answer: "Traditional plotted land lacks standardized title documentation and physical infrastructure. Bhagyashree's branded land guarantees completely clean legal titles, immediate registration readiness, pre-built physical infrastructures (asphalt roads, electricity lines, gated communities), and continuous guard surveillance to eliminate encroachment risk.",
    },
    {
      question: "How does Bhagyashree guarantee boundary ownership clarity?",
      answer: "We employ precision digital surveying technology and physical boundary fencing. Every plot has designated geo-coordinates, verified through government registration maps, eliminating boundary disputes or overlap claims.",
    },
    {
      question: "Are your plots compliant with government layouts?",
      answer: "Yes, all our plotting layouts are designed in accordance with local municipal standards. This guarantees that layout drawings, amenities timelines, and title certificates conform fully to statutory regulatory norms.",
    },
    {
      question: "Can I obtain financing or bank loans for purchasing plots?",
      answer: "Absolutely. Because BHAGYASHREE ENTERPRISES features verified clean titles and government-approved layouts, all leading national banks facilitate standard land acquisition loans for our buyers.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-32 overflow-hidden relative text-slate-300 font-sans">
      {/* Visual background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-gold-solid/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[60vh] -right-[200px] w-[500px] h-[500px] bg-gold-solid/2 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Header Banner */}
      <div className="relative pt-28 pb-6 md:pt-36 md:pb-8 z-10">
          <SectionHeading 
            badge="Asset Intelligence Blog" 
            plainText="Decoding" 
            highlightText="Land" 
            align="center" 
            className="!mb-4"
          />
          <p className="mx-auto max-w-2xl px-6 text-center text-xs sm:text-sm md:text-base text-text-gray-muted leading-relaxed font-light">
            Demystifying land acquisitions. Learn why branded plotted land is the ultimate hedge against inflation and how we guarantee legal safety, security, and wealth generation.
          </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 md:px-8 relative z-10 space-y-24">
        {/* Animated Counter Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#0d153b]/20 border border-white/5 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
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

        {/* Premium Blog Section */}
        <div className="space-y-10">
          <SectionHeading 
            badge="Trending Insights" 
            plainText="Land Investment &" 
            highlightText="Finance Digest" 
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedBlog(article)}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#0d153b]/15 hover:border-gold-solid/35 transition-all duration-300 shadow-xl cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Image container */}
                  <div className="aspect-[16/10] overflow-hidden relative bg-background">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-gold-solid text-background text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {article.category}
                    </div>
                  </div>

                  {/* Text contents */}
                  <div className="px-6 space-y-2">
                    <span className="text-[10px] text-text-gray-muted font-mono">
                      {article.date} • {article.readTime}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-gold-solid transition-colors duration-300 leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-text-gray-muted font-light leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 mt-auto">
                  <span className="text-xs font-semibold text-gold-solid group-hover:text-white transition-colors flex items-center gap-1.5">
                    Read Full Article ➔
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traditional Plotted vs Bhagyashree Branded Land */}
        <div className="space-y-8">
          <SectionHeading 
            badge="Comparison Audit" 
            plainText="Making The" 
            highlightText="Difference" 
            align="center" 
          />

          <div className="overflow-hidden border border-white/5 rounded-2xl bg-[#0d153b]/15 shadow-2xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-[#0d153b]/40 text-text-gray-muted font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Investment Dimension</th>
                    <th className="px-6 py-4">Traditional Unorganized Ploting</th>
                    <th className="px-6 py-4 text-gold-solid">Bhagyashree Branded Land</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {comparisons.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#0d153b]/10 transition-colors">
                      <td className="px-6 py-4 font-bold text-white max-w-[200px]">
                        {item.feature}
                      </td>
                      <td className="px-6 py-4 text-sm font-light leading-relaxed text-text-gray-muted">
                        {item.traditional}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium bg-gold-solid/5 border-l border-gold-solid/10 leading-relaxed text-text-gray-light">
                        {item.bhagyashree}
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
          <div className="lg:col-span-6">
            <SectionHeading 
              badge="Risk Management" 
              plainText="Our 5-Fold Legal" 
              highlightText="Due Diligence" 
              className="!mb-6"
            />
            <p className="text-sm sm:text-base text-text-gray-muted leading-relaxed font-light">
              We perform rigorous legal vetting and infrastructure planning before any land development starts. Bhagyashree covers the compliance checklist so you can invest with absolute peace of mind.
            </p>
          </div>
          
          <div className="lg:col-span-6 space-y-4">
            {[
              { num: "01", title: "Comprehensive Title Search", desc: "30-year historical title verification to establish complete ownership chain." },
              { num: "02", title: "NA (Non-Agricultural) Certification", desc: "Verifying clear zoning conversions and boundary layout map clearances." },
              { num: "03", title: "Government Guidelines", desc: "Applied under state municipal norms ensuring transparent construction and delivery timelines." },
              { num: "04", title: "Geo-fenced Boundary Mapping", desc: "Precise coordinates matching revenue records to secure layout margins." },
              { num: "05", title: "Pre-installed Utility Infrastructure", desc: "Ensuring power, water connection networks, and storm drains are fully ready." },
            ].map((check, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-[#0d153b]/20 border border-white/5 rounded-xl hover:border-gold-solid/35 transition-colors">
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
          <SectionHeading 
            badge="F.A.Q." 
            plainText="Frequently Asked" 
            highlightText="Legalities" 
            align="center" 
            className="!mb-6"
          />

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#0d153b]/20 border border-white/5 hover:border-white/10 rounded-xl overflow-hidden shadow-md transition-all duration-300"
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

      {/* Glassmorphic Blog Article Modal Overlay */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0e163d]/95 to-[#080d27]/98 border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slide-up">
            
            {/* Top decorative line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-gold-solid to-gold-hover" />

            {/* Close button */}
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 border border-white/10 text-white hover:bg-gold-solid hover:text-background transition-colors flex items-center justify-center cursor-pointer outline-none"
            >
              ✕
            </button>

            {/* Content area */}
            <div className="p-8 pt-12 overflow-y-auto space-y-4 leading-relaxed text-sm text-text-gray-light font-light scrollbar-thin">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-solid bg-gold-solid/10 border border-gold-solid/25 px-2 py-0.5 rounded inline-block">
                  {selectedBlog.category}
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
                  {selectedBlog.title}
                </h3>
                <p className="text-xs text-text-gray-muted font-mono">
                  Published on {selectedBlog.date} • {selectedBlog.readTime}
                </p>
              </div>

              <hr className="border-white/5 my-4" />

              {selectedBlog.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="p-6 border-t border-white/5 bg-background/40 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedBlog(null)}
                className="px-6 py-2.5 bg-gold-solid hover:bg-gold-hover text-background font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
