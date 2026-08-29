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
      description: "We believe in 100% legal clarity. Every square foot of land we develop undergoes a strict 30-year title audit history check before registration, backed by clear approvals.",
      icon: (
        <svg className="w-6 h-6 text-[#8C6D23]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Strategic Locations",
      description: "We handpick high-potential real estate corridors in Mirzapur & Prayagraj, focusing on transit growth sectors where future value and infrastructure expansion are guaranteed.",
      icon: (
        <svg className="w-6 h-6 text-[#8C6D23]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: "Integrated Ecosystems",
      description: "We do not just sell raw land. Every Bhagyashree layout is designed as a secure, gated community with pre-installed modern utilities, asphalt roads, green avenues, and security protocols.",
      icon: (
        <svg className="w-6 h-6 text-[#8C6D23]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9m4 0v10m-4-10v10" />
        </svg>
      )
    }
  ];

  const stats = [
    { value: "10 Mn", suffix: "Sq Ft", label: "Land Delivered" },
    { value: "450+", suffix: "", label: "Happy Customers" },
    { value: "20 Mn", suffix: "Sq Ft", label: "Under Development" },
    { value: "2", suffix: "", label: "Locations in Mirzapur" },
    { value: "1", suffix: "", label: "Location in Prayagraj" }
  ];

  return (
    <div className="min-h-screen bg-[#FBF8F2] pb-24 overflow-hidden relative text-slate-800 font-sans border-t border-[#EADBB4]/60">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-100px] w-[500px] h-[500px] bg-[#8C6D23]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Intro Header Section */}
      <div className="relative pt-24 pb-8 md:pt-32 md:pb-12 z-10">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center">
          <SectionHeading
            badge="Our Heritage"
            plainText="Crafting Landmarks of"
            highlightText="Trust & Excellence"
            align="center"
            className="!mb-3"
          />
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
            Bhagyashree Real Estate was founded with a single mission: to revolutionize land acquisition in Uttar Pradesh by delivering secure, legally verified, and fully developed branded layouts.
          </p>
        </div>
      </div>

      {/* Narrative Section - Split Columns matching Home Screen style */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 mb-20 md:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Media Frame with Floating Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[2.5rem] border border-[#EADBB4] bg-white p-2.5 shadow-xl shadow-[#D4AF37]/10">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-[2rem]">
                <img
                  src="/images/abouthero.png"
                  alt="Bhagyashree Real Estate Dream Developments"
                  className="w-full h-full object-cover object-[20%_center] transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Experience Badge (Bottom-Left) */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 z-20 flex items-center gap-3 bg-[#1A150C] border border-[#D4AF37]/50 px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/40 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-serif font-bold text-xl shrink-0">
                  7+
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">Years Experience</span>
                  <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">Real Estate Mastery</span>
                </div>
              </div>

              {/* Company Logo Overlay (Bottom-Right) */}
              <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md border border-[#EADBB4] px-4 py-2 rounded-xl shadow-md hidden sm:flex items-center gap-2">
                <img src="/navbarlogo.png" alt="Bhagyashree" className="h-6 w-auto object-contain" />
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Narrative */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-4 sm:space-y-5">
            <div>
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#8C6D23] mb-1">
                AB HONGE SAPNE SAKAAR
              </p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1A150C] tracking-tight leading-tight">
                Redefining Plotted Land Ownership in <span className="text-[#8C6D23]">Mirzapur & Prayagraj</span>
              </h3>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-normal">
              For generations, investing in land was considered high-risk due to legal ambiguities, boundary conflicts, and missing utilities. <strong className="text-[#1A150C] font-bold">Bhagyashree Real Estate</strong> stepped in to establish a transparent, trustworthy legal pipeline.
            </p>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
              We handpick transit-oriented development corridors in Mirzapur and Prayagraj. By pre-installing high-quality infrastructure — wide asphalt roads, drainage, solar street lights, and 24/7 security — before selling, we ensure your investment starts appreciating immediately.
            </p>

            {/* Highlights Checkmarks */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[#8C6D23] font-bold">✓</span> 100% Legal Clear Titles
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#8C6D23] font-bold">✓</span> Gated Townships
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#8C6D23] font-bold">✓</span> Instant Possession
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#8C6D23] font-bold">✓</span> Prime Growth Zones
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => openEnquiry("About Us Page")}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#997A15] hover:from-[#EADBB4] hover:to-[#D4AF37] text-[#1A150C] text-xs font-extrabold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-[#D4AF37]/20 hover:scale-105 active:scale-95 cursor-pointer border-none"
              >
                <span>Schedule Site Tour</span>
                <span className="text-sm">➔</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Interactive Stats Grid matching CounterSection style */}
      <div className="w-full bg-[#FAF4E8] border-y border-[#EADBB4] py-12 md:py-14 mb-20 md:mb-28 relative z-10 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-6 flex items-center gap-3 text-[#8C6D23] text-xs font-extrabold uppercase tracking-[0.24em]">
            <span className="h-px w-10 bg-[#8C6D23]" />
            Our Achievements & Impact
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center text-center bg-white border border-[#EADBB4] hover:border-[#D4AF37] rounded-3xl p-6 shadow-md hover:shadow-xl hover:shadow-[#D4AF37]/15 transition-all duration-300 w-full min-h-[150px]"
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-[#1A150C] tracking-tight">
                  {stat.value}
                  {stat.suffix && <span className="text-[#D4AF37] text-xl sm:text-2xl font-bold ml-1">{stat.suffix}</span>}
                </div>
                <span className="mt-3 text-xs text-[#8C6D23] font-bold uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Values / Ethics Section */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 mb-20 md:mb-28">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <SectionHeading
            badge="Our Ethics"
            plainText="Driven by"
            highlightText="Core Principles"
            align="center"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#EADBB4] hover:border-[#D4AF37] p-7 sm:p-9 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF4E8] border border-[#EADBB4] flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/20 transition-colors">
                  {val.icon}
                </div>
                <h4 className="text-lg md:text-xl font-extrabold text-[#1A150C] group-hover:text-[#8C6D23] transition-colors">
                  {val.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                  {val.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <CallToAction />
    </div>
  );
}
