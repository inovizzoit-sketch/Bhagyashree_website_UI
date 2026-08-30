"use client";

import React, { useEffect, useState } from "react";
import SectionHeading from "@/shared/components/SectionHeading";
import { API_BASE_URL } from "@/shared/lib/api-config";
import DecorativeCircles from "./DecorativeCircles";

interface Testimonial {
  id: string;
  name: string;
  designation?: string;
  company?: string;
  rating: number;
  message: string;
  avatar?: string;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fallbackTestimonials: Testimonial[] = [
    {
      id: "fallback-1",
      name: "Rajesh Kumar Verma",
      designation: "Government Officer",
      company: "Prayagraj",
      rating: 5,
      message: "Investing in Bhagyashree's gated layout was the best financial decision. The 30-year legal audit history gave me 100% confidence, and plot appreciation has been remarkable.",
    },
    {
      id: "fallback-2",
      name: "Aarav Mehta",
      designation: "Real Estate Investor",
      company: "Mirzapur Corridor",
      rating: 5,
      message: "BHAGYASHREE REAL ESTATE delivered exactly what they promised. Wide asphalt roads, 24/7 security, and clear registry documentation. Exceptional service!",
    },
    {
      id: "fallback-3",
      name: "Sneha Sharma",
      designation: "Homeowner",
      company: "Prayagraj Township",
      rating: 5,
      message: "Beautiful layouts, transparent dealings, and peaceful green avenues. Instant possession and clear boundary demarcation gave our family total peace of mind.",
    },
    {
      id: "fallback-4",
      name: "Vikram Singh",
      designation: "Business Owner",
      company: "Mirzapur",
      rating: 5,
      message: "Extremely professional team. They guided us through every legal registry step with complete honesty, transparency, and expert care.",
    }
  ];

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch(`${API_BASE_URL}/testimonials`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        } else {
          setTestimonials(fallbackTestimonials);
        }
      } catch (err) {
        console.warn("Using fallback testimonials:", err);
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  const items = testimonials.length > 0 ? testimonials : fallbackTestimonials;
  const totalPages = Math.ceil(items.length / 3);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, items.length - 1) : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= items.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <div className="w-8 h-8 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="w-full py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-[#FBF8F2] via-[#FAF4E8]/60 to-[#FBF8F2] font-sans border-t border-b border-[#EADBB4]/60">
      <DecorativeCircles
        theme="light"
        circles={[
          { size: 650, left: "20%", top: "-100px", opacity: 0.08, color: "border-[#D4AF37]/20" }
        ]}
      />

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        
        {/* Section Header with Manual Slide Navigation Controls */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <SectionHeading 
              badge="Client Stories" 
              plainText="What Our" 
              highlightText="Customers Say" 
              align="left"
              className="!mb-0"
            />
          </div>

          {/* Prev / Next Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="w-12 h-12 rounded-full border border-[#EADBB4] bg-white hover:bg-[#FAF4E8] hover:border-[#D4AF37] text-[#8C6D23] flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-12 h-12 rounded-full border border-[#EADBB4] bg-white hover:bg-[#FAF4E8] hover:border-[#D4AF37] text-[#8C6D23] flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Manual Controlled Testimonials Carousel Grid */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{ transform: `translateX(-${currentIndex * (100 / (typeof window !== "undefined" && window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1))}%)` }}
          >
            {items.map((t, idx) => (
              <div 
                key={`${t.id}-${idx}`}
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 bg-white border border-[#EADBB4] hover:border-[#D4AF37] p-7 md:p-8 rounded-[2rem] flex flex-col justify-between space-y-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#D4AF37]/12 group"
              >
                {/* Rating & Quote Body */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-[#D4AF37]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-base sm:text-lg">
                          {i < t.rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    
                    {/* Gold Quote Icon */}
                    <div className="w-8 h-8 rounded-full bg-[#FAF4E8] border border-[#EADBB4] flex items-center justify-center text-[#8C6D23] font-serif font-bold text-lg">
                      &ldquo;
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed italic">
                    &ldquo;{t.message}&rdquo;
                  </p>
                </div>

                {/* Client Profile Info */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-[#EADBB4]/60">
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#D4AF37]/40 bg-[#FAF4E8] flex items-center justify-center shrink-0 shadow-sm">
                    {t.avatar ? (
                      <img
                        src={t.avatar.startsWith("http") || t.avatar.startsWith("https") ? t.avatar : `${API_BASE_URL.replace("/api/v1", "")}${t.avatar}`}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[#8C6D23] font-extrabold text-xs uppercase">
                        {t.name.slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-[#1A150C] group-hover:text-[#8C6D23] transition-colors">
                      {t.name}
                    </h4>
                    {t.designation && (
                      <p className="text-[11px] text-slate-500 font-normal truncate max-w-[200px]">
                        {t.designation} {t.company ? `• ${t.company}` : ""}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-10">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer border-none ${
                currentIndex === idx
                  ? "w-8 bg-[#8C6D23]"
                  : "w-2.5 bg-[#EADBB4] hover:bg-[#D4AF37]"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
