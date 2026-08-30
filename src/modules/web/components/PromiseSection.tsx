"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/shared/components/SectionHeading";
import DecorativeCircles from "./DecorativeCircles";

// Slide promise object structure
interface SlickCard {
  title: string;
  description: string;
}

const slickCards: SlickCard[] = [
  {
    title: "Clean Titles",
    description: "Say goodbye to legal confusion, hidden claims, and endless paperwork drama.",
  },
  {
    title: "Prime Locations",
    description: "No more guesswork, misleading advice, or location-related surprises.",
  },
  {
    title: "Options for Everyone",
    description: "Whether you’re starting small or thinking big, every investor deserves access to the right opportunities.",
  },
  {
    title: "Expert Support",
    description: "No back-and-forth, no unclear answers, expert guidance that keeps you stress-free.",
  },
  {
    title: "Transparent Pricing",
    description: "No hidden charges, administration fees, or surprise costs. What you see is what you pay.",
  },
  {
    title: "Secure Transactions",
    description: "Every payment, document transfer, and agreement is processed with absolute security and transparency.",
  },
];

export default function PromiseSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll loop effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slickCards.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slickCards.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slickCards.length) % slickCards.length);
  };

  return (
    <section className="w-full bg-[#FBF8F2] py-10 md:py-14 relative overflow-x-clip font-sans border-t border-b border-[#EADBB4]/60">
      <DecorativeCircles
        theme="light"
        circles={[
          { size: 550, right: "-15%", top: "10%", opacity: 0.08, className: "lg:right-[-100px] lg:top-[5%]" }
        ]}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      <div className="absolute -left-36 top-20 h-80 w-80 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              badge="Our Commitment"
              plainText="Land Buying,"
              highlightText="Simplified"
              className="!mb-3"
            />
            <p className="max-w-md border-l-2 border-[#D4AF37] pl-4 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
              Because owning land should feel easy, not overwhelming.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous promise"
                className="grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-full border border-[#8C6D23]/40 text-[#8C6D23] bg-white transition-all hover:border-[#8C6D23] hover:bg-[#8C6D23] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] cursor-pointer shadow-sm"
              >
                <span aria-hidden="true" className="text-lg">←</span>
              </button>
              <span className="min-w-16 text-center text-xs font-extrabold tracking-widest text-[#8C6D23]">
                {String(activeIndex + 1).padStart(2, "0")} / {String(slickCards.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next promise"
                className="grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-full bg-[#1A150C] text-[#D4AF37] border border-[#D4AF37]/30 transition-all hover:-translate-y-0.5 hover:bg-[#8C6D23] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] cursor-pointer shadow-md"
              >
                <span aria-hidden="true" className="text-lg">→</span>
              </button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr] min-w-0">
            <article className="relative min-h-[330px] overflow-hidden rounded-[2rem] bg-[#1A150C] p-7 sm:p-9 text-white shadow-xl shadow-black/20 flex flex-col justify-between border border-[#D4AF37]/30">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#D4AF37]/20" />
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/10" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#D4AF37]">
                  <span>★</span> Premium Guarantee
                </span>
              </div>
              <div className="relative mt-12 sm:mt-16">
                <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#D4AF37]">We promise</span>
                <h3 className="mt-2 text-2xl sm:text-4xl font-sans leading-tight text-white font-bold">
                  {slickCards[activeIndex].title}
                </h3>
                <p className="mt-3 sm:mt-4 max-w-lg text-sm sm:text-base leading-7 text-slate-300 font-light">
                  {slickCards[activeIndex].description}
                </p>
              </div>
            </article>

            <div className="grid gap-2.5" role="tablist" aria-label="Our promises">
              {slickCards.map((card, idx) => (
                <button
                  key={card.title}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`group flex min-w-0 items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] cursor-pointer min-h-[48px] ${
                    activeIndex === idx
                      ? "border-[#D4AF37] bg-[#FAF4E8] shadow-md shadow-[#D4AF37]/10"
                      : "border-[#EADBB4] bg-white hover:border-[#D4AF37]/60 hover:bg-[#FAF4E8]/60"
                  }`}
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-extrabold transition-colors ${activeIndex === idx ? "bg-[#8C6D23] text-white" : "bg-[#FAF4E8] text-[#8C6D23] border border-[#EADBB4]"}`}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className={`truncate text-sm font-bold transition-colors ${activeIndex === idx ? "text-[#1A150C]" : "text-slate-800"}`}>
                    {card.title}
                  </span>
                  <span className={`ml-auto text-sm transition-transform group-hover:translate-x-1 ${activeIndex === idx ? "text-[#8C6D23] font-bold" : "text-slate-400"}`}>➔</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
