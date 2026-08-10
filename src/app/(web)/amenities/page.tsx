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
  const [activeTab, setActiveTab] = useState<string>("all");
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

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-background pb-32 overflow-hidden relative font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-gold-solid/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[35vh] right-[-200px] w-[500px] h-[500px] bg-gold-solid/2 rounded-full blur-[140px] pointer-events-none" />

      {/* Header section */}
      <div className="relative pt-28 pb-6 md:pt-36 md:pb-8 z-10">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center">
          <SectionHeading
            badge="World-class standards"
            plainText={selectedCategoryData ? selectedCategoryData.category.name : "Premium Lifestyle"}
            highlightText={selectedCategoryData ? "Album" : "Amenities"}
            align="center"
            className="!mb-4"
          />
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-text-gray-muted leading-relaxed font-light">
            {selectedCategoryData 
              ? (selectedCategoryData.category.description || "Explore curated premium offerings in this category.") 
              : "Discover the structural perks, recreational facilities, and security configurations that set BHAGYASHREE ENTERPRISES apart."
            }
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-2 border-gold-solid/25 border-t-gold-solid rounded-full animate-spin" />
            <p className="text-xs text-text-gray-muted uppercase tracking-widest font-semibold">Loading Amenities...</p>
          </div>
        ) : error && amenities.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-2xl border border-red-500/20 bg-red-500/5 text-center space-y-4">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-base font-bold text-foreground">Temporary Loading Error</h3>
            <p className="text-xs text-text-gray-muted font-light leading-relaxed">
              We encountered a connection check delay. Click below to contact our customer helpline directly.
            </p>
            <button
              onClick={() => openEnquiry("Amenities Details")}
              className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Enquire Directly
            </button>
          </div>
        ) : amenities.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-2xl border border-card-border bg-card-bg text-center space-y-4">
            <span className="text-3xl">☘</span>
            <h3 className="text-base font-bold text-foreground">Amenities Catalog Empty</h3>
            <p className="text-xs text-text-gray-muted font-light leading-relaxed">
              No amenities have been published yet. Contact our desk to receive structural plans and catalogue files.
            </p>
            <button
              onClick={() => openEnquiry("Amenities Enquiry")}
              className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
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
                  className="group relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-card-bg shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-gold-solid/10 cursor-pointer border border-card-border hover:border-gold-solid/35 block"
                >
                  {/* Background Cover Image */}
                  <img
                    src={coverUrl}
                    alt={cat.category.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Dark Elegant Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-black/25 opacity-85 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

                  {/* Top Stats Tag */}
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md border border-card-border px-3 py-1 rounded-full pointer-events-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-solid">
                      {totalAmenities} {totalAmenities === 1 ? "Amenity" : "Amenities"}
                    </span>
                  </div>

                  {/* Info Tag Footer */}
                  <div className="absolute bottom-6 left-6 right-6 pointer-events-none transition-transform duration-300 group-hover:translate-y-[-2px]">
                    <h4 className="text-xl font-bold text-white tracking-tight leading-snug">
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
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-gold-solid hover:text-foreground bg-gold-solid/5 hover:bg-gold-solid/10 border border-gold-solid/25 transition-all cursor-pointer active:scale-95"
              >
                ← Back to Albums
              </button>
            </div>

            {/* Grid display of amenities belonging to this category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
              {selectedCategoryData?.list.map((am) => (
                <div
                  key={am.id}
                  className="group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-card-bg shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-gold-solid/5 cursor-pointer border border-card-border"
                  onClick={() => openEnquiry(`${am.name} (${selectedCategoryData.category.name})`)}
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
                    <div className="absolute inset-0 h-full w-full bg-slate-200/40 flex items-center justify-center">
                      <span className="text-3xl opacity-20">✽</span>
                    </div>
                  )}

                  {/* Dark shading */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Info Tag Footer */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-solid block">
                      {selectedCategoryData.category.name}
                    </span>
                    <h4 className="text-lg font-bold text-white tracking-tight mt-1.5 leading-snug">
                      {am.name}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

