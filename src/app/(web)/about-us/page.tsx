"use client";

import React from "react";
import SectionHeading from "@/shared/components/SectionHeading";
import { useEnquiry } from "@/shared/context/EnquiryContext";
import CallToAction from "@/modules/web/components/CallToAction";

export default function AboutUsPage() {
  const { openEnquiry } = useEnquiry();

  const values = [
    {
      title: "Absolute Transparency",
      description: "We believe in 100% legal clarity. Every square foot of land we develop undergoes a strict 30-year title audit history check before any registration, backed by clear RERA approvals.",
      icon: (
        <svg className="w-10 h-10 text-gold-solid" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M8 20h8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h6M13 7h6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 7l-2.5 5a2.5 2.5 0 005 0L5 7zM19 7l-2.5 5a2.5 2.5 0 005 0L19 7z" />
        </svg>
      )
    },
    {
      title: "Strategic Locations",
      description: "We handpick high-potential real estate corridors in Mirzapur, focusing on transit growth sectors. We build where future value and infrastructure expansion are guaranteed.",
      icon: (
        <svg className="w-10 h-10 text-gold-solid" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25A7.5 7.5 0 1119.5 10.5z" />
        </svg>
      )
    },
    {
      title: "Integrated Ecosystems",
      description: "We do not just sell raw land. Every Bhagyashree layout is designed as a secure, gated community with pre-installed modern utilities, asphalt roads, green avenues, and security protocols.",
      icon: (
        <svg className="w-10 h-10 text-gold-solid" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    }
  ];

  const stats = [
    { value: "5 Mn Sq Ft", label: "Land" },
    { value: "650+", label: "Customers" },
    { value: "16 Mn Sq.Ft.", label: "Under Development" },
    { value: "2", label: "Locations in Greater Mirzapur" }
  ];

  return (
    <div className="min-h-screen bg-background pb-32 overflow-hidden relative text-slate-800 font-sans">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-gold-solid/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20vh] -right-[200px] w-[600px] h-[600px] bg-gold-solid/3 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Intro Header Section */}
      <div className="relative pt-28 pb-6 md:pt-36 md:pb-8 z-10">
        <div className="mx-auto max-w-5xl px-6 md:px-8 text-center">
          <SectionHeading
            badge="Our Heritage"
            plainText="Crafting Landmarks of"
            highlightText="Trust"
            align="center"
            className="!mb-4"
          />
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-light">
            Bhagyashree Enterprises was founded with a single mission: to revolutionize raw land acquisition in Uttar Pradesh by delivering secure, institutional, and fully developed branded layouts.
          </p>
        </div>
      </div>

      {/* Narrative Section - Split Columns */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl font-serif text-slate-900 font-light tracking-tight leading-snug">
              Redefining Plotted Land ownership in <span className="text-gold-solid font-medium italic">Mirzapur</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
              For generations, investing in land was considered high-risk due to duplicate claims, boundary conflicts, and missing infrastructure. Bhagyashree Enterprises stepped in to build a transparent legal pipeline.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
              We focus on picking transit-oriented development hubs in Mirzapur. By pre-installing high-quality utilities (asphalt drainage, street lights, and 24/7 security) before selling, we ensure that our customers buy assets that instantly start appreciating.
            </p>
          </div>

          {/* Decorative Media Frame */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-dark-secondary/10 shadow-2xl">
            <img
              src="/images/About.jpeg"
              alt="About Bhagyashree"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Interactive Stats Grid */}
      <div className="w-full bg-gold-solid/5 border-y border-gold-solid/20 py-12 mb-28 relative z-10 backdrop-blur-sm shadow-xl">
        <div className="mx-auto max-w-7xl px-6 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-gold-solid block tracking-tight">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-600 uppercase tracking-wider block font-light">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Core Values Section */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 mb-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionHeading
            badge="Our Ethics"
            plainText="Driven by"
            highlightText="Principles"
            align="center"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="bg-surface border border-dark-secondary/10 hover:border-gold-solid/40 p-6 md:p-8 rounded-2xl transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05),_0_0_25px_rgba(221,189,129,0.04)] backdrop-blur-sm group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="mb-4 transition-transform duration-500 ease-out group-hover:scale-110 origin-left">{val.icon}</div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-gold-solid transition-colors duration-300">
                  {val.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-650 font-light leading-relaxed">
                  {val.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Box */}
      <CallToAction />
    </div>
  );
}
