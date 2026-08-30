"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/shared/components/SectionHeading";

export default function AboutOverviewSection() {
  return (
    <section className="w-full bg-[#FAF4E8]/60 py-12 md:py-16 relative overflow-hidden border-t border-b border-[#EADBB4]/60 font-sans">
      {/* Decorative background glow */}
      <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#8C6D23]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column: Image with Experience Badge */}
          <div className="lg:col-span-6 relative">
            {/* Clean Image Container showing natural transparent edges */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full bg-transparent">
              <Image
                src="/images/bhagyashree-transparent.png"
                alt="Bhagyashree Real Estate Dream Developments"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain object-center transition-transform duration-700 hover:scale-105"
                priority
              />
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

            {/* Company Logo Badge Overlay at Bottom-Right */}
            <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md border border-[#EADBB4] px-4 py-2 rounded-xl shadow-md hidden sm:flex items-center gap-2">
              <img src="/navbarlogo.png" alt="Bhagyashree" className="h-6 w-auto object-contain" />
            </div>
          </div>

          {/* Right Column: Company Overview Info */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-4 sm:space-y-5">
            <div>
              <SectionHeading
                badge="About Our Vision"
                plainText="Bhagyashree"
                highlightText="Real Estate"
                align="left"
                className="!mb-2"
              />
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#8C6D23] mt-1">
                AB HONGE SAPNE SAKAAR
              </p>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-normal">
              <strong className="text-[#1A150C] font-extrabold">Bhagyashree Real Estate</strong> is a premier real estate and infrastructure development enterprise in Prayagraj, committed to delivering luxurious residential and commercial plots across Uttar Pradesh and surrounding regions.
            </p>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
              We offer trusted real estate solutions designed for modern living and long-term financial appreciation. With a strong focus on legal clarity, planned township infrastructure, and 100% customer satisfaction, we turn your dream land investments into reality.
            </p>

            {/* Learn More Button */}
            <div className="pt-2">
              <Link
                href="/about-us"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#997A15] hover:from-[#EADBB4] hover:to-[#D4AF37] text-[#1A150C] hover:text-[#1A150C] text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-[#D4AF37]/20 hover:scale-105 active:scale-95 no-underline cursor-pointer border-none"
              >
                <span>Learn More</span>
                <span className="text-base font-bold">➔</span>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
