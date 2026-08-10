import React from "react";
import HeroSlider from "@/modules/web/components/HeroSlider";
import CounterSection from "@/modules/web/components/CounterSection";
import PromiseSection from "@/modules/web/components/PromiseSection";
import LegacySection from "@/modules/web/components/LegacySection";
import FaqSection from "@/modules/web/components/FaqSection";
import TestimonialsSection from "@/modules/web/components/TestimonialsSection";
import FeaturedProjectsSection from "@/modules/web/components/FeaturedProjectsSection";
import GallerySection from "@/modules/web/components/GallerySection";

export default function HomePage() {
  return (
    <div className="flex flex-col pb-20 relative bg-transparent text-slate-800 overflow-hidden">
      {/* Decorative ambient glowing background elements */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-purple-200/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[450px] h-[450px] bg-gold-solid/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Immersive Ken Burns Hero Slider */}
      <HeroSlider />

      <div className="relative z-10 flex flex-col gap-4 md:gap-8 mt-16 md:mt-24 pb-16">
        {/* Brand Core Promises */}
        <PromiseSection />

        {/* Counter Achievements */}
        <CounterSection />

        {/* Featured Projects Developments */}
        <FeaturedProjectsSection />

        {/* Legacy & History Timeline */}
        <LegacySection />

        {/* Gallery Site Images */}
        <GallerySection />

        {/* Patrons Testimonials */}
        <TestimonialsSection />

        {/* Support FAQ */}
        <FaqSection />
      </div>
    </div>
  );
}
