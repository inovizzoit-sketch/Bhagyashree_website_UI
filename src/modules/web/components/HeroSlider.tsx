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
      className="w-full h-[75vh] sm:h-[82vh] md:h-[88vh] lg:h-screen min-h-[480px] sm:min-h-[550px] lg:min-h-[650px] max-h-[920px] pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-4 sm:pb-6 px-3 sm:px-6 md:px-8 max-w-[1700px] mx-auto font-sans select-none flex flex-col justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Framed Rounded Hero Banner Container matching reference screenshot */}
      <div className="relative w-full flex-1 h-full min-h-[380px] sm:min-h-[420px] rounded-[1.8rem] sm:rounded-[2.2rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden border border-[#EADBB4]/60 bg-[#1A150C] shadow-2xl shadow-black/30">

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
                {/* Mobile View (<sm): Single Cover Image */}
                <div className="block sm:hidden w-full h-full relative overflow-hidden bg-black">
                  <img
                    src={slideImages[0]}
                    alt={slide.altText}
                    className={`w-full h-full object-cover transition-transform duration-[4500ms] ease-out ${
                      currentSlideIndex === idx ? "scale-105" : "scale-100"
                    }`}
                  />
                </div>

                {/* Tablet & Desktop View (>=sm): 2-Image Side-by-Side Split View with Faded Seam */}
                <div className="hidden sm:block relative w-full h-full">
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
                          <div className="absolute inset-y-0 right-0 w-32 md:w-52 lg:w-64 bg-gradient-to-l from-black/80 via-black/40 to-transparent pointer-events-none z-10" />
                        )}
                        {slideImages.length > 1 && imgIdx === 1 && (
                          <div className="absolute inset-y-0 left-0 w-32 md:w-52 lg:w-64 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none z-10" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Center Seam — Warm Golden Radiant Glow (matching reference) */}
                  {slideImages.length > 1 && (
                    <>
                      {/* Dark fade layers from each side */}
                      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 md:w-3 bg-black/90 pointer-events-none z-20" />
                      {/* Warm amber glow radiating from center */}
                      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-20 md:w-32 lg:w-40 pointer-events-none z-20"
                        style={{
                          background: "radial-gradient(ellipse 50% 100% at 50% 50%, rgba(255,160,40,0.45) 0%, rgba(210,120,0,0.18) 40%, transparent 75%)"
                        }}
                      />
                      {/* Thin bright center light streak */}
                      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px md:w-0.5 bg-gradient-to-b from-transparent via-amber-300/60 to-transparent pointer-events-none z-20" />
                    </>
                  )}
                </div>

                {/* Subtle Gradient Overlay at Bottom for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none z-10" />
              </div>
            );
          })}
        </div>

        {/* Left Arrow Navigation Overlay */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-[#D4AF37] text-white hover:text-[#1A150C] border border-white/20 hover:border-[#D4AF37] flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold transition-all duration-300 backdrop-blur-md cursor-pointer z-30 shadow-lg hover:scale-110 active:scale-95"
        >
          ‹
        </button>

        {/* Right Arrow Navigation Overlay */}
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-[#D4AF37] text-white hover:text-[#1A150C] border border-white/20 hover:border-[#D4AF37] flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold transition-all duration-300 backdrop-blur-md cursor-pointer z-30 shadow-lg hover:scale-110 active:scale-95"
        >
          ›
        </button>

        {/* Bottom-Left Overlay Content */}
        <div className="absolute bottom-5 left-4 sm:bottom-8 sm:left-8 md:bottom-10 md:left-10 z-20 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl text-left">
          {DEFAULT_SLIDES[currentSlideIndex].subTitle && (
            <span className="inline-block text-[9px] sm:text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] bg-black/50 border border-[#D4AF37]/40 px-3 py-1 rounded-full mb-2 backdrop-blur-md">
              {DEFAULT_SLIDES[currentSlideIndex].subTitle}
            </span>
          )}

          <h1 className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-extrabold text-white tracking-wide uppercase leading-tight drop-shadow-md mb-2.5 sm:mb-4">
            {DEFAULT_SLIDES[currentSlideIndex].title}
          </h1>

          <button
            onClick={handleCtaClick}
            className="inline-flex items-center justify-center border border-white/80 hover:border-[#D4AF37] bg-black/40 hover:bg-[#D4AF37] text-white hover:text-[#1A150C] px-4 sm:px-6 md:px-7 py-1.5 sm:py-2 md:py-2.5 rounded-full text-[10px] sm:text-[11px] md:text-xs font-extrabold uppercase tracking-widest backdrop-blur-md transition-all duration-300 shadow-xl cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>{DEFAULT_SLIDES[currentSlideIndex].ctaText}</span>
            <span className="ml-1.5 font-bold">➔</span>
          </button>
        </div>

        {/* Bottom Center Pagination Dots */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-2.5 z-30 bg-black/40 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10">
          {DEFAULT_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                currentSlideIndex === idx
                  ? "w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#D4AF37] shadow-md shadow-[#D4AF37]/50 scale-110"
                  : "w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/50 hover:bg-white/90"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
