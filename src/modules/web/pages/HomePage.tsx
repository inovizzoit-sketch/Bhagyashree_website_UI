import React from "react";
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

export default function HomePage() {
  return (
    <div className="flex flex-col relative bg-background text-foreground overflow-x-clip">

      {/* Immersive Ken Burns Hero Slider */}
      <HeroSlider />

      <div className="relative z-10 flex flex-col">
        {/* Brand Overview Section right after Hero */}
        <AboutOverviewSection />

        {/* Brand Core Promises */}
        <PromiseSection />

        {/* Counter Achievements */}
        <CounterSection />

        {/* Customer Priority & Value Section */}
        <CustomerPrioritySection />

        {/* Featured Projects Developments */}
        <FeaturedProjectsSection />

        {/* World-Class Amenities & Facilities */}
        <AmenitiesSection />

        {/* Legacy & History Timeline */}
        <LegacySection />

        {/* Gallery Site Images */}
        <GallerySection />

        {/* Patrons Testimonials */}
        <TestimonialsSection />

        {/* Support FAQ */}
        <FaqSection />

        {/* Contact Us Section */}
        <ContactSection />

      
      </div>
    </div>
  );
}
