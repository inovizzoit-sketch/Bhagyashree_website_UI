"use client";

import React, { useEffect, useState } from "react";
import SectionHeading from "@/shared/components/SectionHeading";
import { API_BASE_URL } from "@/shared/lib/api-config";

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

  const fallbackTestimonials: Testimonial[] = [
    {
      id: "fallback-1",
      name: "John Doe",
      designation: "Software Engineer",
      company: "Google",
      rating: 5,
      message: "This is an amazing service! Highly recommended.",
    },
    {
      id: "fallback-2",
      name: "Aarav Mehta",
      designation: "Real Estate Investor",
      company: "Mehta Holdings",
      rating: 5,
      message: "Nandeeka developments delivered exactly what they promised. The appreciation on the plots is exceptional.",
    },
    {
      id: "fallback-3",
      name: "Sneha Sharma",
      designation: "Homeowner",
      company: "Indo Corp",
      rating: 5,
      message: "Beautiful layouts, transparent dealings, and peaceful green surroundings. Highly recommend their projects.",
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
        console.error("Error loading testimonials, using fallbacks:", err);
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <div className="w-8 h-8 border-2 border-gold-solid/20 border-t-gold-solid rounded-full animate-spin" />
      </div>
    );
  }

  // Duplicate items to ensure seamless infinite looping
  const loopedList = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="w-full py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-background via-dark-secondary/40 to-background">
      {/* Local inline styles for the infinite marquee animation */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-6 md:px-8 mb-12">
        <SectionHeading 
          badge="Client Stories" 
          plainText="What Our" 
          highlightText="Patrons Say" 
          align="center"
        />
      </div>
      
      {/* Sliding Track Viewport wrapper */}
      <div className="w-full overflow-hidden py-4 relative">
        {/* Fading overlay effects on left and right borders matching the project theme variable */}
        <div className="absolute top-0 left-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="marquee-track gap-6 px-4">
          {loopedList.map((t, idx) => (
            <div 
              key={`${t.id}-${idx}`}
              className="bg-gradient-to-br from-dark-secondary/60 to-background border border-border-muted hover:border-gold-solid/40 p-6 md:p-8 rounded-2xl flex flex-col justify-between space-y-6 transition-all duration-300 shadow-2xl group w-[300px] md:w-[360px] shrink-0 animate-fade-in"
            >
              {/* Top Stars & Quote */}
              <div className="space-y-4">
                <div className="flex gap-0.5 text-gold-solid">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-base">
                      {i < t.rating ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-200 font-light leading-relaxed italic line-clamp-4">
                  &ldquo;{t.message}&rdquo;
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-border-muted">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gold-solid/30 bg-background flex items-center justify-center shrink-0">
                  {t.avatar ? (
                    <img
                      src={t.avatar.startsWith("http") || t.avatar.startsWith("https") ? t.avatar : `${API_BASE_URL.replace("/api/v1", "")}${t.avatar}`}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gold-solid font-bold text-xs uppercase">
                      {t.name.slice(0, 2)}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-gold-solid transition-colors">
                    {t.name}
                  </h4>
                  {t.designation && (
                    <p className="text-[11px] text-slate-400 mt-0.5 font-light truncate max-w-[200px]">
                      {t.designation} {t.company ? `@ ${t.company}` : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
