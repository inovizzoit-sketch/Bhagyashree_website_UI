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
    <div className="flex flex-col relative bg-background text-foreground overflow-x-clip">

      {/* Immersive Ken Burns Hero Slider */}
      <HeroSlider />

      <div className="relative z-10 flex flex-col">
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
