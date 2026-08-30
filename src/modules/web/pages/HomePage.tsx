"use client";

import React, { useState, useEffect, useRef } from "react";
import HeroSlider from "@/modules/web/components/HeroSlider";
import AboutOverviewSection from "@/modules/web/components/AboutOverviewSection";
import LocationMapSection from "@/modules/web/components/LocationMapSection";
import CustomerPrioritySection from "@/modules/web/components/CustomerPrioritySection";
import CounterSection from "@/modules/web/components/CounterSection";
import PromiseSection from "@/modules/web/components/PromiseSection";
import LegacySection from "@/modules/web/components/LegacySection";
import FaqSection from "@/modules/web/components/FaqSection";
import TestimonialsSection from "@/modules/web/components/TestimonialsSection";
import FeaturedProjectsSection from "@/modules/web/components/FeaturedProjectsSection";
import GallerySection from "@/modules/web/components/GallerySection";
import AmenitiesSection from "@/modules/web/components/AmenitiesSection";
import ContactSection from "@/modules/web/components/ContactSection";

const SECTIONS = [
  { id: "hero", component: HeroSlider },
  { id: "about", component: AboutOverviewSection },
  { id: "promises", component: PromiseSection },
  { id: "achievements", component: CounterSection },
  { id: "customer-priority", component: CustomerPrioritySection },
  { id: "featured-projects", component: FeaturedProjectsSection },
  { id: "amenities", component: AmenitiesSection },
  { id: "legacy", component: LegacySection },
  { id: "gallery", component: GallerySection },
  { id: "testimonials", component: TestimonialsSection },
  { id: "faq", component: FaqSection },
  { id: "contact", component: ContactSection },
  { id: "location-map", component: LocationMapSection },
];

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex((el) => el === entry.target);
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollNext = () => {
    if (activeIndex < SECTIONS.length - 1) {
      const targetEl = sectionRefs.current[activeIndex + 1];
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleScrollPrev = () => {
    if (activeIndex > 0) {
      const targetEl = sectionRefs.current[activeIndex - 1];
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < SECTIONS.length - 1;

  return (
    <div className="flex flex-col relative bg-background text-foreground overflow-x-clip">
      {/* Floating Section Navigation Controls (Up & Down Arrows stacked on right side) */}
      <div className="fixed right-6 sm:right-8 bottom-24 sm:bottom-28 z-40 flex flex-col gap-2 pointer-events-auto">
        {/* Up Arrow (Previous Section) */}
        {hasPrev && (
          <button
            onClick={handleScrollPrev}
            aria-label="Scroll to Previous Section"
            className="group flex items-center justify-center p-1 cursor-pointer focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1A150C]/90 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#1A150C] border border-[#D4AF37]/60 shadow-2xl backdrop-blur-md flex items-center justify-center text-base font-extrabold transition-all duration-300">
              ↑
            </div>
          </button>
        )}

        {/* Down Arrow (Next Section) */}
        {hasNext && (
          <button
            onClick={handleScrollNext}
            aria-label="Scroll to Next Section"
            className="group flex items-center justify-center p-1 cursor-pointer focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1A150C]/90 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#1A150C] border border-[#D4AF37]/60 shadow-2xl backdrop-blur-md flex items-center justify-center text-base font-extrabold transition-all duration-300 animate-bounce">
              ↓
            </div>
          </button>
        )}
      </div>

      {/* Main Sections */}
      {SECTIONS.map((sec, idx) => {
        const Component = sec.component;
        return (
          <div
            key={sec.id}
            id={sec.id}
            ref={(el) => {
              sectionRefs.current[idx] = el;
            }}
            className="w-full relative"
          >
            <Component />
          </div>
        );
      })}
    </div>
  );
}




