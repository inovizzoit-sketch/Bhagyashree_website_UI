"use client";

import React, { useEffect, useState } from "react";
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

  // Group amenities by category name
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

  // Filter amenities by active tab slug
  const displayedAmenities = activeTab === "all"
    ? amenities
    : amenities.filter(am => am.category?.slug === activeTab);

  return (
    <div className="min-h-screen bg-[#080d27] pb-32 overflow-hidden relative font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-gold-solid/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[35vh] right-[-200px] w-[500px] h-[500px] bg-gold-solid/2 rounded-full blur-[140px] pointer-events-none" />

      {/* Header section */}
      <div className="relative pt-28 pb-10 md:pt-36 md:pb-12 z-10">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-solid/5 border border-gold-solid/20 text-[10px] font-bold uppercase tracking-widest text-gold-solid">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-solid animate-pulse"></span>
            World-class standards
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Premium Lifestyle <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-solid via-gold-hover to-gold-dark">Amenities</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm md:text-base text-text-gray-muted leading-relaxed font-light">
            Discover the structural perks, recreational facilities, and security configurations that set Nandeeka developments apart.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-2 border-gold-solid/25 border-t-gold-solid rounded-full animate-spin" />
            <p className="text-xs text-text-gray-muted uppercase tracking-widest font-semibold">Loading amenities list...</p>
          </div>
        ) : error && amenities.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-2xl border border-red-500/20 bg-red-500/5 text-center space-y-4">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-base font-bold text-white">Temporary Loading Error</h3>
            <p className="text-xs text-text-gray-muted font-light leading-relaxed">
              We encountered a connection check delay. Click below to contact our customer helpline directly.
            </p>
            <button
              onClick={() => openEnquiry("Amenities Details")}
              className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Enquire Directly
            </button>
          </div>
        ) : amenities.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-2xl border border-white/5 bg-[#0d153b]/20 text-center space-y-4">
            <span className="text-3xl">☘</span>
            <h3 className="text-base font-bold text-white">Amenities Catalog Empty</h3>
            <p className="text-xs text-text-gray-muted font-light leading-relaxed">
              No amenities have been published yet. Contact our desk to receive structural plans and catalogue files.
            </p>
            <button
              onClick={() => openEnquiry("Amenities Enquiry")}
              className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Enquire Details
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Category Selector Tabs */}
            <div className="flex justify-center px-4">
              <div className="bg-[#0d153b]/40 border border-white/5 backdrop-blur-md rounded-2xl p-1.5 flex flex-wrap gap-1.5 justify-center max-w-4xl shadow-2xl">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95 ${
                    activeTab === "all"
                      ? "bg-gold-solid text-[#020520] shadow-lg shadow-gold-solid/15"
                      : "text-text-gray-muted hover:text-white hover:bg-white/5"
                  }`}
                >
                  All Features
                </button>
                {sortedCategories.map((cat) => (
                  <button
                    key={cat.category.id}
                    onClick={() => setActiveTab(cat.category.slug)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95 ${
                      activeTab === cat.category.slug
                        ? "bg-gold-solid text-[#020520] shadow-lg shadow-gold-solid/15"
                        : "text-text-gray-muted hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {cat.category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Immersive Gallery Card Horizontal Row (Line by Line) */}
            <div className="pt-6 animate-in fade-in slide-in-from-bottom duration-700">
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0">
                {displayedAmenities.map((am) => (
                  <div
                    key={am.id}
                    className="group relative w-[280px] sm:w-[320px] aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#0d153b]/25 shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-gold-solid/5 cursor-pointer shrink-0 snap-start"
                    onClick={() => openEnquiry(`${am.name} (${am.category?.name || "Amenity"})`)}
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
                      <div className="absolute inset-0 h-full w-full bg-[#0d153b]/40 flex items-center justify-center">
                        <span className="text-3xl opacity-20">✽</span>
                      </div>
                    )}
                    
                    {/* Premium Dark Gradient Shading matching the reference */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020520] via-[#020520]/20 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-300" />
                    
                    {/* Amenity Info Tag Footer matching reference spacing and style */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold-solid block">
                        {am.category?.name || "Premium Feature"}
                      </span>
                      <h4 className="text-xl font-bold text-white tracking-tight mt-1.5 leading-snug">
                        {am.name}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

