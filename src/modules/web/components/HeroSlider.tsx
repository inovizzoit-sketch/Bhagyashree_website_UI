"use client";

import { useEffect, useState, useRef } from "react";
import { useEnquiry } from "@/shared/context/EnquiryContext";

interface SlideItem {
  id: number;
  title: string;
  subTitle: string;
  images: string[];
  mediaUrl?: string;
  altText: string;
  ctaText: string;
}

const DEFAULT_SLIDES: SlideItem[] = [
  {
    id: 1,
    title: "BHAGYASHREE REAL ESTATE",
    subTitle: "AB HONGE SAPNE SAKAAR",
    images: ["/images/hero1.png", "/images/hero2.png"],
    mediaUrl: "/images/hero1.png",
    altText: "Bhagyashree Real Estate Development Showcase 1",
    ctaText: "View Property",
  },
  {
    id: 2,
    title: "BHAGYASHREE REAL ESTATE",
    subTitle: "AB HONGE SAPNE SAKAAR",
    images: ["/images/hero3.png", "/images/hero4.png"],
    mediaUrl: "/images/hero3.png",
    altText: "Bhagyashree Real Estate Development Showcase 2",
    ctaText: "View Property",
  },
];

export default function HeroSlider() {
  const { openEnquiry } = useEnquiry();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-play cycling effect
  useEffect(() => {
    if (isPaused) {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
      return;
    }

    autoPlayTimer.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % DEFAULT_SLIDES.length);
    }, 4500);

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + DEFAULT_SLIDES.length) % DEFAULT_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % DEFAULT_SLIDES.length);
  };

  const handleCtaClick = () => {
    const el = document.getElementById("featured-projects");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/projects";
    }
  };

  return (
    <section
      className="w-full h-screen min-h-[600px] pt-24 sm:pt-28 md:pt-32 pb-4 sm:pb-6 px-2 sm:px-4 md:px-6 max-w-[1650px] mx-auto font-sans select-none flex flex-col justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Framed Rounded Hero Banner Container matching reference screenshot */}
      <div className="relative w-full flex-1 h-full min-h-[420px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-[#EADBB4]/60 bg-[#1A150C] shadow-2xl shadow-black/20">

        {/* Sliding Track Viewport Container */}
        <div
          className="flex w-full h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
        >
          {DEFAULT_SLIDES.map((slide, idx) => {
            const slideImages = slide.images && slide.images.length > 0 
              ? slide.images 
              : [slide.mediaUrl || "/images/hero1.png"];

            return (
              <div
                key={slide.id}
                className="relative w-full h-full shrink-0 overflow-hidden"
              >
                {/* 2-Image Side-by-Side Split View with Faded Seam */}
                <div className="relative w-full h-full">
                  <div className={`w-full h-full grid ${slideImages.length > 1 ? "grid-cols-2" : "grid-cols-1"} bg-black`}>
                    {slideImages.map((imgUrl, imgIdx) => (
                      <div key={imgIdx} className="relative w-full h-full overflow-hidden bg-black/60">
                        <img
                          src={imgUrl}
                          alt={`${slide.altText} - Part ${imgIdx + 1}`}
                          className={`w-full h-full object-cover transition-transform duration-[4500ms] ease-out ${
                            currentSlideIndex === idx ? "scale-105" : "scale-100"
                          }`}
                        />
                        {/* Soft edge gradient fade on individual image edges */}
                        {slideImages.length > 1 && imgIdx === 0 && (
                          <div className="absolute inset-y-0 right-0 w-28 sm:w-44 bg-gradient-to-l from-black/90 via-black/50 to-transparent pointer-events-none z-10" />
                        )}
                        {slideImages.length > 1 && imgIdx === 1 && (
                          <div className="absolute inset-y-0 left-0 w-28 sm:w-44 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none z-10" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Center Seam Blend Gradient & Glow */}
                  {slideImages.length > 1 && (
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-16 sm:w-28 bg-gradient-to-r from-black/80 via-[#D4AF37]/20 to-black/80 pointer-events-none z-10 blur-sm" />
                  )}
                </div>

                {/* Subtle Gradient Overlay at Bottom for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none z-10" />
              </div>
            );
          })}
        </div>

        {/* Left Arrow Navigation Overlay */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#D4AF37] text-white hover:text-[#1A150C] border border-white/20 hover:border-[#D4AF37] flex items-center justify-center text-xl font-bold transition-all duration-300 backdrop-blur-md cursor-pointer z-30 shadow-lg hover:scale-110 active:scale-95"
        >
          ‹
        </button>

        {/* Right Arrow Navigation Overlay */}
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#D4AF37] text-white hover:text-[#1A150C] border border-white/20 hover:border-[#D4AF37] flex items-center justify-center text-xl font-bold transition-all duration-300 backdrop-blur-md cursor-pointer z-30 shadow-lg hover:scale-110 active:scale-95"
        >
          ›
        </button>

        {/* Bottom-Left Overlay Content (Matching Reference Image) */}
        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-20 max-w-lg text-left">
          <h1 className="text-base sm:text-xl md:text-2xl font-extrabold text-white tracking-wide uppercase leading-tight drop-shadow-md mb-3">
            {DEFAULT_SLIDES[currentSlideIndex].title}
          </h1>

          <button
            onClick={handleCtaClick}
            className="inline-flex items-center justify-center border border-white/80 hover:border-[#D4AF37] bg-black/40 hover:bg-[#D4AF37] text-white hover:text-[#1A150C] px-5 sm:px-6 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-widest backdrop-blur-md transition-all duration-300 shadow-xl cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>{DEFAULT_SLIDES[currentSlideIndex].ctaText}</span>
            <span className="ml-1.5 font-bold">➔</span>
          </button>
        </div>

        {/* Bottom Center Pagination Dots */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-30 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          {DEFAULT_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                currentSlideIndex === idx
                  ? "w-3 h-3 bg-[#D4AF37] shadow-md shadow-[#D4AF37]/50 scale-110"
                  : "w-2.5 h-2.5 bg-white/50 hover:bg-white/90"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
