"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import SectionHeading from "@/shared/components/SectionHeading";
import { API_BASE_URL } from "@/shared/lib/api-config";
import { useEnquiry } from "@/shared/context/EnquiryContext";

interface AmenityCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
}

interface Amenity {
  id: string;
  name: string;
  icon?: string;
  isActive: boolean;
  categoryId?: string;
  category?: AmenityCategory;
}

const fallbackAmenities: Amenity[] = [
  {
    id: "f1",
    name: "Sports & Fitness Hub",
    icon: "https://pub-cf4fd16db10f43dd86a3fc7dad57e249.r2.dev/1787984845436-st1j53.png",
    isActive: true,
    category: { id: "c1", name: "Sports", slug: "sports" },
  },
  {
    id: "f2",
    name: "24/7 Gated Security",
    icon: "",
    isActive: true,
    category: { id: "c2", name: "Security", slug: "security" },
  },
  {
    id: "f3",
    name: "Wide Asphalt Roads",
    icon: "",
    isActive: true,
    category: { id: "c3", name: "Infrastructure", slug: "infrastructure" },
  },
  {
    id: "f4",
    name: "Green Avenues & Parks",
    icon: "",
    isActive: true,
    category: { id: "c4", name: "Leisure", slug: "leisure" },
  },
];

export default function AmenitiesSection() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { openEnquiry } = useEnquiry();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let active = true;

    fetch(`${API_BASE_URL}/amenities`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        if (active && Array.isArray(data)) {
          const activeItems = data.filter((item: Amenity) => item.isActive !== false);
          setAmenities(activeItems.length > 0 ? activeItems : fallbackAmenities);
        } else if (active) {
          setAmenities(fallbackAmenities);
        }
      })
      .catch(() => {
        if (active) setAmenities(fallbackAmenities);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const getImageSrc = (iconPath?: string) => {
    if (!iconPath) return null;
    if (iconPath.startsWith("http://") || iconPath.startsWith("https://")) {
      return iconPath;
    }
    const baseUrl = API_BASE_URL.replace("/api/v1", "");
    return `${baseUrl}${iconPath.startsWith("/") ? "" : "/"}${iconPath}`;
  };

  const displayedAmenities = amenities.slice(0, 10);

  // Scroll controls for horizontal row
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -420, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 420, behavior: "smooth" });
    }
  };

  // Lightbox handlers
  const closeLightbox = () => setLightboxIndex(null);

  const showNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < displayedAmenities.length - 1 ? prev + 1 : 0));
  };

  const showPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : displayedAmenities.length - 1));
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") {
        showNext();
      } else if (e.key === "ArrowLeft") {
        showPrev();
      } else if (e.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, displayedAmenities]);

  const activeAmenity = lightboxIndex !== null ? displayedAmenities[lightboxIndex] : null;
  const activeImgSrc = activeAmenity ? getImageSrc(activeAmenity.icon) : null;

  return (
    <section className="py-10 md:py-14 relative text-foreground overflow-hidden font-sans border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        {/* Section Header with Left & Right Arrow Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-6">
          <SectionHeading
            badge="Luxury & Infrastructure"
            plainText="Modern World-Class"
            highlightText="Amenities"
            align="left"
            className="!mb-0"
          />

          {/* Horizontal Row Scroll Left / Right Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleScrollLeft}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#8C6D23]/30 bg-[#FAF4E8] hover:bg-[#8C6D23] text-[#8C6D23] hover:text-white flex items-center justify-center text-xl font-bold transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
              title="Scroll Left"
            >
              ‹
            </button>
            <button
              onClick={handleScrollRight}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#8C6D23]/30 bg-[#FAF4E8] hover:bg-[#8C6D23] text-[#8C6D23] hover:text-white flex items-center justify-center text-xl font-bold transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
              title="Scroll Right"
            >
              ›
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center gap-6 overflow-hidden py-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="shrink-0 w-[320px] sm:w-[400px] aspect-[16/10] rounded-3xl bg-card-bg/60 border border-card-border animate-pulse p-6 flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10" />
                <div className="space-y-2">
                  <div className="w-1/3 h-3 bg-white/10 rounded" />
                  <div className="w-2/3 h-5 bg-white/15 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedAmenities.length === 0 ? (
          <div className="text-center py-16 px-6 bg-card-bg/50 border border-card-border rounded-2xl space-y-4">
            <p className="text-sm text-text-gray-muted">No amenities available at the moment.</p>
          </div>
        ) : (
          /* Amenities Single Row Horizontal Carousel Slider (Clean Shadowless Luxury Card Design) */
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-1 scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayedAmenities.map((amenity, idx) => {
              const imgSrc = getImageSrc(amenity.icon);

              return (
                <div
                  key={amenity.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative shrink-0 w-[300px] sm:w-[380px] md:w-[450px] aspect-[16/10] rounded-3xl overflow-hidden border border-[#EADBB4] hover:border-[#D4AF37] transition-all duration-500 hover:-translate-y-1 cursor-pointer snap-start block"
                >
                  {/* Full Cover Image */}
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={amenity.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
                      <span className="text-4xl text-[#D4AF37]">☘</span>
                    </div>
                  )}

                  {/* Dark Luxury Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />

                  {/* Category Pill Tag (Top Right) */}
                  {amenity.category?.name && (
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md border border-[#D4AF37]/40 px-3.5 py-1 rounded-full z-10 pointer-events-none">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37]">
                        {amenity.category.name}
                      </span>
                    </div>
                  )}

                  {/* Amenity Title Floating Gracefully inside Bottom Left */}
                  <div className="absolute bottom-5 left-6 right-6 z-10 pointer-events-none flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                      <h3 className="text-lg md:text-xl font-extrabold text-white tracking-tight group-hover:text-[#D4AF37] transition-colors duration-300 truncate">
                        {amenity.name}
                      </h3>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#D4AF37] group-hover:text-[#1A150C] text-white flex items-center justify-center text-xs font-bold transition-all shrink-0">
                      ➔
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 sm:mt-10 text-center">
          <Link
            href="/amenities"
            className="inline-flex items-center gap-2 rounded-full border border-[#8C6D23]/40 bg-[#FAF4E8] hover:bg-[#8C6D23] hover:text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-[#8C6D23] transition-all duration-300 cursor-pointer no-underline group"
          >
            <span>Explore All Amenities ({amenities.length})</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">➔</span>
          </Link>
        </div>
      </div>

      {mounted && lightboxIndex !== null && activeAmenity && createPortal(
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 md:p-10 font-sans"
          onClick={closeLightbox}
        >
          <button
            className="fixed top-6 right-6 w-12 h-12 rounded-full bg-white hover:bg-[#D4AF37] text-slate-800 hover:text-[#1A150C] flex items-center justify-center text-xl font-bold transition-all cursor-pointer border border-[#EADBB4] z-[1000000] hover:scale-105 active:scale-95 shadow-2xl"
            onClick={closeLightbox}
            title="Close (Esc)"
          >
            ✕
          </button>

          <button
            className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white hover:bg-[#D4AF37] text-slate-800 hover:text-[#1A150C] flex items-center justify-center text-2xl font-bold transition-all cursor-pointer border border-[#EADBB4] z-[1000000] hover:scale-110 active:scale-95 shadow-2xl"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            title="Previous Image (←)"
          >
            ‹
          </button>

          <button
            className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white hover:bg-[#D4AF37] text-slate-800 hover:text-[#1A150C] flex items-center justify-center text-2xl font-bold transition-all cursor-pointer border border-[#EADBB4] z-[1000000] hover:scale-110 active:scale-95 shadow-2xl"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            title="Next Image (→)"
          >
            ›
          </button>

          <div
            className="relative max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-3xl border border-[#EADBB4] bg-white flex flex-col shadow-2xl z-[999999] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[68vh] bg-[#1A150C] flex items-center justify-center overflow-hidden p-3">
              {activeImgSrc ? (
                <img
                  src={activeImgSrc}
                  alt={activeAmenity.name}
                  className="max-h-[64vh] w-auto max-w-full object-contain rounded-2xl select-none shadow-md"
                />
              ) : (
                <div className="w-full h-64 bg-[#FAF4E8] flex items-center justify-center">
                  <span className="text-5xl text-[#D4AF37]">☘</span>
                </div>
              )}
            </div>

            <div className="w-full bg-[#FAF4E8] p-6 border-t border-[#EADBB4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  {activeAmenity.category?.name && (
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8C6D23] bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3 py-0.5 rounded-full">
                      {activeAmenity.category.name}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500 font-mono font-semibold">
                    {lightboxIndex + 1} / {displayedAmenities.length}
                  </span>
                </div>
                <h4 className="text-xl md:text-2xl font-extrabold text-[#1A150C] tracking-tight">
                  {activeAmenity.name}
                </h4>
                {(activeAmenity.category?.description || (activeAmenity as any).description) && (
                  <p className="text-xs md:text-sm text-slate-600 font-medium max-w-2xl line-clamp-2 leading-relaxed">
                    {activeAmenity.category?.description || (activeAmenity as any).description}
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  closeLightbox();
                  openEnquiry(`${activeAmenity.name} (Amenity)`);
                }}
                className="px-8 py-3 rounded-full bg-[#1A150C] hover:bg-[#8C6D23] text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-md border-none"
              >
                Enquire Now
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
