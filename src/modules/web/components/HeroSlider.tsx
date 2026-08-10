"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useEnquiry } from "@/shared/context/EnquiryContext";

const DEFAULT_SLIDES = [
  {
    id: 1,
    heading: "Your Dream Plot Awaits",
    description: "Premium Residential Plots in Prime Locations",
    badgeText: "Prime Location • Trusted Deals • Smart Investment",
    mediaUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=85",
    altText: "Premium Residential Plots",
    ctaText: "Explore Plots →"
  },
  {
    id: 2,
    heading: "Invest in Land. Build Your Future.",
    description: "Secure residential plots with excellent future growth potential.",
    badgeText: "Clear Documentation • Great Connectivity • High Growth Potential",
    mediaUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=85",
    altText: "Secure residential plots",
    ctaText: "View Available Plots →"
  },
  {
    id: 3,
    heading: "Find the Perfect Plot for Your Dream Home",
    description: "Well-planned plots surrounded by roads, greenery and essential infrastructure.",
    badgeText: "Wide Roads • Green Environment • Planned Development",
    mediaUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85",
    altText: "Well-planned plots",
    ctaText: "Book a Site Visit →"
  },
  {
    id: 4,
    heading: "A Smart Investment Starts with the Right Land",
    description: "Choose premium plots in developing locations with strong investment potential.",
    badgeText: "Strategic Location • Secure Investment • Future Appreciation",
    mediaUrl: "https://images.unsplash.com/photo-1500049242364-5f500807cdd7?auto=format&fit=crop&w=1920&q=85",
    altText: "Premium plots",
    ctaText: "Discover Opportunities →"
  }
];

export default function HeroSlider() {
  const { openEnquiry } = useEnquiry();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-play cycling effect (every 4.5 seconds)
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

  const handleScrollDown = () => {
    window.scrollBy({
      top: window.innerHeight - 80,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="relative w-full h-screen min-h-[650px] flex items-center justify-center overflow-hidden font-sans select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Slider with Zoom Animation */}
      <div className="absolute inset-0 z-0 bg-surface-dark-deep">
        {DEFAULT_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlideIndex === idx ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.mediaUrl}
              alt={slide.altText}
              className={`w-full h-full object-cover transition-transform duration-[4500ms] ease-out ${
                currentSlideIndex === idx ? "scale-105" : "scale-100"
              }`}
            />
            {/* Premium Radial & Linear Gradients for optimal text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-surface-dark-deep/65 via-surface-dark-deep/55 to-surface-dark-deep/95 z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-surface-dark-deep/20 to-surface-dark-deep/70 z-10" />
          </div>
        ))}
      </div>

      {/* Slide Text Content Container */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-20 w-full flex flex-col items-center justify-center text-center py-24">
        {DEFAULT_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`max-w-4xl flex flex-col items-center transition-all duration-700 transform ${
              currentSlideIndex === idx
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-6 scale-95 absolute pointer-events-none"
            }`}
          >
            {/* Highlights Bar */}
            {slide.badgeText && (
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gold-solid bg-dark-secondary/85 border border-gold-solid/30 px-4 py-2 rounded-full mb-6 backdrop-blur-md shadow-lg">
                {slide.badgeText}
              </span>
            )}

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white font-normal tracking-tight leading-[1.12] mb-6 drop-shadow-md">
              {slide.heading}
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-200 font-light leading-relaxed max-w-2xl mb-10 drop-shadow">
              {slide.description}
            </p>

            {/* Action Call to Action Button */}
            <button
              onClick={() => openEnquiry(slide.heading)}
              className="px-8 py-4 bg-gold-solid hover:bg-gold-hover text-dark-secondary hover:text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_25px_rgba(9,31,26,0.28)] hover:shadow-[0_4px_30px_rgba(181,138,58,0.3)] cursor-pointer"
            >
              {slide.ctaText}
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Slider Indicators/Dots */}
      {DEFAULT_SLIDES.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-3.5 z-30">
          {DEFAULT_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlideIndex === idx ? "bg-gold-solid scale-125 shadow-md shadow-gold-solid/35" : "bg-white/35 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Down Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
        <button
          onClick={handleScrollDown}
          className="w-11 h-11 rounded-full bg-black/25 hover:bg-gold-solid border border-white/15 hover:border-gold-solid flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm cursor-pointer shadow-md"
          aria-label="Scroll Down"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chevron-down animate-bounce" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
      </div>
    </section>
  );
}
