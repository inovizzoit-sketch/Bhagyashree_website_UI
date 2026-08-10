"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/shared/components/SectionHeading";

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
    <section className="w-full bg-slate-100/40 py-12 lg:py-20 border-y border-slate-200/60 relative overflow-hidden font-sans">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* Responsive Grid Split: Stacks on mobile, splits on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-center">
          
          {/* Left Column Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-md mx-auto lg:mx-0">
            <SectionHeading 
              badge="Our Commitment"
              plainText="Land Buying," 
              highlightText="Simplified" 
              className="!mb-6"
            />
            <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed">
              Because owning land should feel easy, not overwhelming.
            </p>
          </div>

          {/* Right Column Content: Custom Slick Track Carousel (Vertical Top to Bottom) */}
          <div className="relative w-full max-w-2xl mx-auto overflow-hidden h-[382px]">
            <div 
              className="flex flex-col transition-transform duration-700 ease-out h-full"
              style={{ transform: `translateY(-${activeIndex * 100}%)` }}
            >
              {slickCards.map((card, idx) => (
                <div key={idx} className="w-full min-h-full h-full px-2 py-0.5 box-border">
                  {/* Outer border wrapper */}
                  <div className="bg-gradient-to-b from-slate-200/50 to-slate-200 p-[1px] rounded-2xl h-full">
                    
                    {/* Inner Content Card (Matches the site's deep blue/dark theme with curved base background) */}
                    <div className="bg-gradient-to-t to-indigo-50/20 via-white/80 from-white flex flex-col items-center justify-between gap-10 px-6 pt-10 pb-6 relative rounded-2xl h-full overflow-hidden border border-slate-100 shadow-sm">
                      
                      {/* Decorative Base Vector Curve Background */}
                      <div className="absolute left-0 right-0 bottom-0 h-16 w-full opacity-10 z-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

                      {/* Top: Description text */}
                      <div className="text-center z-10">
                        <p className="text-base font-normal leading-[160%] text-slate-700 max-w-md mx-auto">
                          {card.description}
                        </p>
                      </div>

                      {/* Middle: Brand Tag & Icon details */}
                      <div className="flex flex-col items-center text-center z-10 gap-3">
                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">We promise</p>
                        
                        {/* Gold Badge Medal Symbol */}
                        <div className="flex items-center justify-center gap-1.5 py-1 px-3.5 rounded-full bg-gold-solid/5 border border-gold-solid/25">
                          <span className="text-[10px] text-gold-solid">★</span>
                          <span className="text-[10px] text-gold-solid font-bold uppercase tracking-wider">Premium Guarantee</span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-extrabold leading-[140%] text-slate-800 font-serif mt-2">
                          {card.title}
                        </h3>
                      </div>

                      {/* Bottom: Know More link with chevron indicator */}
                      <div className="flex justify-center items-center gap-2 relative z-30 pb-2 w-full cursor-pointer hover:opacity-85 transition-opacity text-slate-600">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Know more</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                          <circle cx="12" cy="12" r="10" />
                          <path d="m10 8 4 4-4 4" />
                        </svg>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Arrows Overlay */}
            <div className="flex justify-center items-center gap-6 mt-8 relative z-30">
              <button
                onClick={handlePrev}
                aria-label="Previous slide"
                className="w-10 h-10 rounded-full border border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all hover:bg-slate-100 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                aria-label="Next slide"
                className="w-10 h-10 rounded-full border border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all hover:bg-slate-100 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
