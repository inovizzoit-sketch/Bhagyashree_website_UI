"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/shared/components/SectionHeading";
import { getWebsiteHomeGallery } from "@/modules/admin/services/home-gallery.service";
import { HomeGallery } from "@/modules/admin/types";
import { API_BASE_URL } from "@/shared/lib/api-config";

export default function GallerySection() {
  const [items, setItems] = useState<HomeGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getImageUrl = (url?: string) => {
    if (!url || typeof url !== "string") return "/placeholder-gallery.jpg";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    const baseUrl = API_BASE_URL.replace("/api/v1", "");
    return `${baseUrl}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let data = await getWebsiteHomeGallery().catch(() => []);
        
        if (!data || data.length === 0) {
          const fallbackRes = await fetch(`${API_BASE_URL}/gallery?status=true&limit=10`)
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => []);

          const rawItems = Array.isArray(fallbackRes)
            ? fallbackRes
            : fallbackRes && typeof fallbackRes === "object" && Array.isArray(fallbackRes.items)
            ? fallbackRes.items
            : [];

          data = rawItems.map((item: any) => ({
            id: item.id || `fallback-${Math.random()}`,
            title: item.title || "Gallery Showcase",
            tag: item.category?.name || "Portfolio",
            image: item.mediaUrl || item.image || "/placeholder-gallery.jpg",
            sortOrder: item.sortOrder || 1,
            isActive: item.status !== false,
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString(),
          }));
        }
        setItems(data || []);
      } catch (err: unknown) {
        console.error("Failed to load website home gallery:", err);
        setError("Unable to load showcase gallery.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Horizontal scroll control buttons
  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  // Lightbox handlers
  const closeLightbox = () => setLightboxIndex(null);
  const showNext = () => setLightboxIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
  const showPrev = () => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, items]);

  const activeItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <section className="w-full bg-[#FBF8F2] py-10 md:py-14 overflow-hidden border-t border-[#EADBB4]/60 font-sans">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* Section Header with Left & Right Arrow Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-6">
          <div>
            <SectionHeading 
              badge="Visual Experience" 
              plainText="Gallery &" 
              highlightText="Lifestyle" 
              align="left"
              className="max-w-2xl !mb-2"
            />
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
              A glance into the state-of-the-art architectures, wellness setups, and elite clubhouses designed for modern comfort.
            </p>
          </div>

          {/* Direct Navigation Button to Gallery Page */}
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#997A15] hover:from-[#EADBB4] hover:to-[#D4AF37] text-[#1A150C] hover:text-[#1A150C] text-xs font-extrabold uppercase tracking-widest transition-all duration-300 shadow-md shadow-[#D4AF37]/20 hover:scale-105 active:scale-95 shrink-0 no-underline cursor-pointer"
          >
            <span>View Gallery</span>
            <span className="text-sm">➔</span>
          </Link>
        </div>

        {loading ? (
          /* Loading Skeletons */
          <div className="flex overflow-x-auto gap-5 pb-4 snap-x snap-mandatory no-scrollbar scroll-smooth">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="relative aspect-[16/10] w-[300px] sm:w-[360px] md:w-[410px] shrink-0 overflow-hidden rounded-xl border border-[#D4AF37]/40 p-1.5 bg-white animate-pulse"
              >
                <div className="w-full h-full bg-slate-100 rounded-lg" />
              </div>
            ))}
          </div>
        ) : error && items.length === 0 ? (
          /* Error Fallback State */
          <div className="text-center py-8">
            <p className="text-sm text-red-500 font-medium">⚠️ {error}</p>
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-8">
            <p className="text-sm text-text-gray-muted font-light">No gallery images available.</p>
          </div>
        ) : (
          /* Main Gallery horizontal slider with image right-side overlay arrows */
          <div className="relative w-full group/gallery">
            <div 
              ref={scrollRef}
              className="flex items-center gap-5 pb-4 overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {items.map((item, idx) => {
                const imageUrl = getImageUrl(item.image);

                return (
                  <div
                    key={item.id}
                    onClick={() => setLightboxIndex(idx)}
                    className="group relative shrink-0 overflow-hidden rounded-xl border border-[#D4AF37]/50 hover:border-[#D4AF37] p-1.5 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer block w-[300px] sm:w-[360px] md:w-[410px] aspect-[16/10] snap-start"
                  >
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 300px, (max-width: 768px) 360px, 410px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overlay Navigation Arrow Buttons on Image Right Side */}
            <div className="absolute bottom-5 right-5 z-30 flex items-center gap-2 pointer-events-auto">
              <button
                onClick={handleScrollLeft}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1A150C]/90 hover:bg-[#8C6D23] text-[#D4AF37] hover:text-white border border-[#D4AF37]/50 backdrop-blur-md flex items-center justify-center text-xl font-extrabold transition-all duration-300 cursor-pointer shadow-xl hover:scale-110 active:scale-95"
                title="Scroll Left"
              >
                ‹
              </button>
              <button
                onClick={handleScrollRight}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1A150C]/90 hover:bg-[#8C6D23] text-[#D4AF37] hover:text-white border border-[#D4AF37]/50 backdrop-blur-md flex items-center justify-center text-xl font-extrabold transition-all duration-300 cursor-pointer shadow-xl hover:scale-110 active:scale-95"
                title="Scroll Right"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal Mounted via Portal */}
      {mounted && lightboxIndex !== null && activeItem && createPortal(
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 md:p-10 font-sans"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="fixed top-6 right-6 w-12 h-12 rounded-full bg-white/90 hover:bg-[#D4AF37] text-slate-800 hover:text-white flex items-center justify-center text-xl font-bold transition-all cursor-pointer border border-slate-200 z-[1000000] hover:scale-105 active:scale-95 shadow-2xl"
            onClick={closeLightbox}
            title="Close (Esc)"
          >
            ✕
          </button>

          {/* Previous Button */}
          {items.length > 1 && (
            <button
              className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#1A150C]/80 hover:bg-[#8C6D23] text-[#D4AF37] hover:text-white flex items-center justify-center text-2xl font-bold transition-all cursor-pointer border border-[#D4AF37]/40 z-[1000000] hover:scale-110 active:scale-95 shadow-2xl"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              title="Previous Image (←)"
            >
              ‹
            </button>
          )}

          {/* Next Button */}
          {items.length > 1 && (
            <button
              className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#1A150C]/80 hover:bg-[#8C6D23] text-[#D4AF37] hover:text-white flex items-center justify-center text-2xl font-bold transition-all cursor-pointer border border-[#D4AF37]/40 z-[1000000] hover:scale-110 active:scale-95 shadow-2xl"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              title="Next Image (→)"
            >
              ›
            </button>
          )}

          {/* ONLY THE IMAGE ITSELF */}
          <div
            className="relative max-h-[85vh] max-w-[90vw] flex items-center justify-center z-[999999]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(activeItem.image)}
              alt={activeItem.title || "Gallery Showcase"}
              className="max-h-[85vh] max-w-[90vw] w-auto h-auto object-contain rounded-2xl select-none shadow-2xl border border-[#EADBB4]/30"
            />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
