"use client";

import React from "react";
import Hero from "@/modules/web/components/Hero";
import CounterSection from "@/modules/web/components/CounterSection";
import PromiseSection from "@/modules/web/components/PromiseSection";
import LegacySection from "@/modules/web/components/LegacySection";
import FaqSection from "@/modules/web/components/FaqSection";
import TestimonialsSection from "@/modules/web/components/TestimonialsSection";
import FeaturedProjectsSection from "@/modules/web/components/FeaturedProjectsSection";
import GallerySection from "@/modules/web/components/GallerySection";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-20">
      {/* Immersive Modular Hero Component */}
      <Hero />

      {/* Animated Counter Stats Section */}
      <CounterSection />

      {/* Stacked Promise Carousel Section */}
      <PromiseSection />

      {/* Featured Projects Summary */}
      <FeaturedProjectsSection />

      {/* Immersive Gallery Section */}
      <GallerySection />


      {/* Legacy Section */}
      <LegacySection />

      {/* Patrons Testimonials */}
      <TestimonialsSection />

      {/* Frequently Asked Questions */}
      <FaqSection />
    </div>
  );
}
