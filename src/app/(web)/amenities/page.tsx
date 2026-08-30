"use client";

import React, { useEffect, useState } from "react";
import SectionHeading from "@/shared/components/SectionHeading";
import { API_BASE_URL } from "@/shared/lib/api-config";
import { useEnquiry } from "@/shared/context/EnquiryContext";

interface AmenityCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  sortOrder: number;
}

interface Amenity {
  id: string;
  name: string;
  icon?: string;
  isActive: boolean;
  categoryId?: string;
  category?: AmenityCategory;
}

export default function AmenitiesWebPage() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedAmenityIndex, setSelectedAmenityIndex] = useState<number | null>(null);
  const { openEnquiry } = useEnquiry();

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/amenities`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load amenities");
        return res.json();
      })
      .then((data) => {
        if (active) {
          const activeAmenities = data.filter((a: Amenity) => a.isActive);
          setAmenities(activeAmenities);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load amenities list");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Group amenities by category
  const groupedAmenities: Record<string, { category: AmenityCategory; list: Amenity[] }> = {};

  amenities.forEach((am) => {
    const catName = am.category?.name || "Premium Features";
    const catSlug = am.category?.slug || "premium-features";
    const categoryInfo = am.category || {
      id: "fallback-cat-id",
      name: catName,
      slug: catSlug,
      sortOrder: 99,
      description: "Handpicked premium configurations and elite upgrades.",
    };

    if (!groupedAmenities[catName]) {
      groupedAmenities[catName] = {
        category: categoryInfo,
        list: [],
      };
    }
    groupedAmenities[catName].list.push(am);
  });

  // Sort categories by sortOrder
  const sortedCategories = Object.values(groupedAmenities).sort(
    (a, b) => a.category.sortOrder - b.category.sortOrder
  );

  const selectedCategoryData = selectedCategorySlug 
    ? sortedCategories.find(cat => cat.category.slug === selectedCategorySlug)
    : null;

  // Keyboard controls for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedAmenityIndex === null || !selectedCategoryData) return;
      const total = selectedCategoryData.list.length;

      if (e.key === "Escape") {
        setSelectedAmenityIndex(null);
      } else if (e.key === "ArrowRight") {
        setSelectedAmenityIndex((prev) => (prev !== null && prev < total - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowLeft") {
        setSelectedAmenityIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : total - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAmenityIndex, selectedCategoryData]);

  return (
    <div className="min-h-screen bg-[#FBF8F2] pb-32 overflow-hidden relative font-sans text-slate-800 border-t border-[#EADBB4]/60">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[35vh] right-[-200px] w-[500px] h-[500px] bg-[#8C6D23]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header section */}
      <div className="relative pt-24 pb-6 md:pt-32 md:pb-8 z-10">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center">
          <SectionHeading
            badge="World-class standards"
            plainText={selectedCategoryData ? selectedCategoryData.category.name : "Premium Lifestyle"}
            highlightText={selectedCategoryData ? "Album" : "Amenities"}
            align="center"
            className="!mb-4"
          />
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
            {selectedCategoryData 
              ? (selectedCategoryData.category.description || "Explore curated premium offerings in this category.") 
              : "Discover the structural perks, recreational facilities, and security configurations that set BHAGYASHREE REAL ESTATE apart."
            }
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-2 border-[#D4AF37]/25 border-t-[#D4AF37] rounded-full animate-spin" />
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Loading Amenities...</p>
          </div>
        ) : error && amenities.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-2xl border border-red-500/20 bg-red-500/5 text-center space-y-4">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-base font-bold text-[#1A150C]">Temporary Loading Error</h3>
            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              We encountered a connection check delay. Click below to contact our customer helpline directly.
            </p>
            <button
              onClick={() => openEnquiry("Amenities Details")}
              className="px-6 py-3 bg-[#1A150C] hover:bg-[#8C6D23] text-white font-extrabold text-xs rounded-full uppercase tracking-wider transition-all cursor-pointer border-none"
            >
              Enquire Directly
            </button>
          </div>
        ) : amenities.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-3xl border border-[#EADBB4] bg-white text-center space-y-4 shadow-sm">
            <span className="text-3xl text-[#D4AF37]">☘</span>
            <h3 className="text-base font-extrabold text-[#1A150C]">Amenities Catalog Empty</h3>
            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              No amenities have been published yet. Contact our desk to receive structural plans and catalogue files.
            </p>
            <button
              onClick={() => openEnquiry("Amenities Enquiry")}
              className="px-6 py-3 bg-[#1A150C] hover:bg-[#8C6D23] text-white font-extrabold text-xs rounded-full uppercase tracking-wider transition-all cursor-pointer border-none"
            >
              Enquire Details
            </button>
          </div>
        ) : !selectedCategorySlug ? (
          /* ALBUM COVER GRID (Default View) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
            {sortedCategories.map((cat) => {
              // Get cover image from first amenity that has an image
              const coverItem = cat.list.find((am) => am.icon && (am.icon.startsWith("http") || am.icon.startsWith("/")));
              const coverUrl = coverItem?.icon 
                ? (coverItem.icon.startsWith("http") ? coverItem.icon : `${API_BASE_URL.replace("/api/v1", "")}${coverItem.icon}`)
                : "/placeholder-gallery.jpg";

              const totalAmenities = cat.list.length;

              return (
                <div
                  key={cat.category.id}
                  onClick={() => setSelectedCategorySlug(cat.category.slug)}
                  className="group relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-white shadow-md hover:shadow-2xl hover:shadow-[#D4AF37]/15 transition-all duration-500 cursor-pointer border border-[#EADBB4] hover:border-[#D4AF37] block"
                >
                  {/* Background Cover Image */}
                  <img
                    src={coverUrl}
                    alt={cat.category.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Dark Elegant Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />

                  {/* Top Stats Tag */}
                  <div className="absolute top-4 right-4 bg-[#1A150C]/80 backdrop-blur-md border border-[#D4AF37]/40 px-3.5 py-1 rounded-full pointer-events-none">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37]">
                      {totalAmenities} {totalAmenities === 1 ? "Amenity" : "Amenities"}
                    </span>
                  </div>

                  {/* Info Tag Footer */}
                  <div className="absolute bottom-6 left-6 right-6 pointer-events-none transition-transform duration-300 group-hover:translate-y-[-2px]">
                    <h4 className="text-xl font-extrabold text-white tracking-tight leading-snug">
                      {cat.category.name}
                    </h4>
                    {cat.category.description && (
                      <p className="text-xs text-slate-300 font-light mt-1.5 line-clamp-2 leading-relaxed">
                        {cat.category.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* INSIDE AN ALBUM (Show specific category amenities) */
          <div className="space-y-8 pt-2">
            {/* Back Navigation Bar */}
            <div className="flex justify-start">
              <button
                onClick={() => setSelectedCategorySlug(null)}
                className="px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-[#8C6D23] hover:text-[#1A150C] bg-[#FAF4E8] hover:bg-[#EADBB4] border border-[#EADBB4] transition-all cursor-pointer active:scale-95"
              >
                ← Back to Albums
              </button>
            </div>

            {/* Grid display of amenities belonging to this category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
              {selectedCategoryData?.list.map((am, idx) => (
                <div
                  key={am.id}
                  className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-white shadow-md transition-all duration-500 hover:shadow-2xl hover:shadow-[#D4AF37]/15 cursor-pointer border border-[#EADBB4] hover:border-[#D4AF37]"
                  onClick={() => setSelectedAmenityIndex(idx)}
                >
                  {/* Background Visual Image Overlay */}
                  {am.icon ? (
                    <img
                      src={
                        am.icon.startsWith("http")
                          ? am.icon
                          : `${API_BASE_URL.replace("/api/v1", "")}${am.icon}`
                      }
                      alt={am.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 h-full w-full bg-[#FAF4E8] flex items-center justify-center">
                      <span className="text-3xl text-[#D4AF37]">✽</span>
                    </div>
                  )}

                  {/* Dark shading */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />

                  {/* Info Tag Footer */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF37] block">
                      {selectedCategoryData.category.name}
                    </span>
                    <h4 className="text-lg font-extrabold text-white tracking-tight mt-1.5 leading-snug">
                      {am.name}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Amenity Lightbox Popup Modal */}
      {selectedAmenityIndex !== null && selectedCategoryData && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-300 p-4 font-sans"
          onClick={() => setSelectedAmenityIndex(null)}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-[#D4AF37] text-[#1A150C] flex items-center justify-center text-xl transition-all cursor-pointer border border-[#EADBB4] z-50 hover:scale-105 active:scale-95 shadow-2xl font-bold"
            onClick={() => setSelectedAmenityIndex(null)}
            title="Close (Esc)"
          >
            ✕
          </button>

          {/* Previous Button */}
          {selectedCategoryData.list.length > 1 && (
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1A150C]/90 hover:bg-[#8C6D23] text-[#D4AF37] hover:text-white flex items-center justify-center text-xl font-extrabold transition-all cursor-pointer border border-[#D4AF37]/40 z-50 hover:scale-110 active:scale-95 shadow-2xl"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAmenityIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : selectedCategoryData.list.length - 1));
              }}
              title="Previous Amenity"
            >
              ‹
            </button>
          )}

          {/* Next Button */}
          {selectedCategoryData.list.length > 1 && (
            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1A150C]/90 hover:bg-[#8C6D23] text-[#D4AF37] hover:text-white flex items-center justify-center text-xl font-extrabold transition-all cursor-pointer border border-[#D4AF37]/40 z-50 hover:scale-110 active:scale-95 shadow-2xl"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAmenityIndex((prev) => (prev !== null && prev < selectedCategoryData.list.length - 1 ? prev + 1 : 0));
              }}
              title="Next Amenity"
            >
              ›
            </button>
          )}

          {/* Media Modal Frame */}
          {(() => {
            const activeAm = selectedCategoryData.list[selectedAmenityIndex];
            if (!activeAm) return null;

            const imgUrl = activeAm.icon
              ? (activeAm.icon.startsWith("http") ? activeAm.icon : `${API_BASE_URL.replace("/api/v1", "")}${activeAm.icon}`)
              : "/placeholder-gallery.jpg";

            return (
              <div
                className="relative max-w-4xl w-full max-h-[85vh] overflow-hidden rounded-3xl border border-[#EADBB4] bg-white flex flex-col items-center mx-4 shadow-2xl animate-slide-up"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image Container */}
                <div className="relative w-full max-h-[65vh] bg-slate-900 flex items-center justify-center overflow-hidden p-3 min-h-[300px]">
                  <img
                    src={imgUrl}
                    alt={activeAm.name}
                    className="max-h-[60vh] w-auto max-w-full object-contain rounded-2xl select-none shadow-md"
                  />
                </div>

                {/* Info & Action Footer */}
                <div className="w-full bg-[#FAF4E8] p-5 sm:p-6 border-t border-[#EADBB4] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8C6D23] bg-white border border-[#EADBB4] px-3 py-0.5 rounded-full inline-block">
                      {selectedCategoryData.category.name}
                    </span>
                    <h4 className="text-xl md:text-2xl font-extrabold text-[#1A150C] tracking-tight">
                      {activeAm.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedAmenityIndex(null);
                        openEnquiry(`${activeAm.name} (${selectedCategoryData.category.name})`);
                      }}
                      className="px-6 py-3 bg-[#1A150C] hover:bg-[#8C6D23] text-white font-extrabold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer border-none shadow-md hover:scale-105 active:scale-95"
                    >
                      Enquire About This ➔
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

