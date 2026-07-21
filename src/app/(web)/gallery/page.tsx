"use client";

import React, { useEffect, useState } from "react";
import SectionHeading from "@/shared/components/SectionHeading";
import { API_BASE_URL } from "@/shared/lib/api-config";

interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
}

interface GalleryItem {
  id: string;
  title?: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  altText?: string;
  description?: string;
  sortOrder: number;
  status: boolean;
  categoryId?: string;
  category?: GalleryCategory | string;
  createdAt: string;
}

export default function GalleryWebPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; title?: string; type: string } | null>(null);

  useEffect(() => {
    let active = true;

    // Fetch categories and active gallery items in parallel
    Promise.all([
      fetch(`${API_BASE_URL}/gallery/category?status=true`).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_BASE_URL}/gallery?status=true&limit=100`).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([catsData, itemsData]) => {
        if (active) {
          setCategories(Array.isArray(catsData) ? catsData : []);
          const rawItems = Array.isArray(itemsData) ? itemsData : itemsData?.items || [];
          setItems(rawItems);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load gallery");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Filter items based on active category tab
  const displayedItems =
    activeTab === "all"
      ? items
      : items.filter((item) => {
          if (typeof item.category === "object" && item.category?.id) {
            return item.category.id === activeTab;
          }
          return item.categoryId === activeTab || item.category === activeTab;
        });

  return (
    <div className="min-h-screen bg-background pb-32 overflow-hidden relative font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-gold-solid/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[35vh] right-[-200px] w-[500px] h-[500px] bg-gold-solid/2 rounded-full blur-[140px] pointer-events-none" />

      {/* Header section */}
      <div className="relative pt-28 pb-10 md:pt-36 md:pb-12 z-10">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center">
          <SectionHeading
            badge="Visual Showcase"
            plainText="Gallery &"
            highlightText="Lifestyle"
            align="center"
          />
          <p className="mx-auto max-w-2xl text-sm md:text-base text-text-gray-muted leading-relaxed font-light">
            An immersive glance into the state-of-the-art architectures, wellness setups, and elite clubhouses designed for modern comfort.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-2 border-gold-solid/25 border-t-gold-solid rounded-full animate-spin" />
            <p className="text-xs text-text-gray-muted uppercase tracking-widest font-semibold">Loading Gallery...</p>
          </div>
        ) : error && items.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-2xl border border-red-500/20 bg-red-500/5 text-center space-y-4">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-base font-bold text-white">Temporary Loading Error</h3>
            <p className="text-xs text-text-gray-muted font-light leading-relaxed">
              We encountered a connection check delay while fetching the gallery. Please try again later.
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-2xl border border-white/5 bg-[#0d153b]/20 text-center space-y-4">
            <span className="text-3xl">🖼</span>
            <h3 className="text-base font-bold text-white">Gallery Empty</h3>
            <p className="text-xs text-text-gray-muted font-light leading-relaxed">
              No gallery items have been published yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Category Selector Tabs */}
            {categories.length > 0 && (
              <div className="flex justify-center px-4">
                <div className="bg-[#0d153b]/40 border border-white/5 backdrop-blur-md rounded-2xl p-1.5 flex flex-wrap gap-1.5 justify-center max-w-4xl shadow-2xl">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95 ${
                      activeTab === "all"
                        ? "bg-gold-solid text-background shadow-lg shadow-gold-solid/15"
                        : "text-text-gray-muted hover:text-white hover:bg-white/5"
                    }`}
                  >
                    All Media
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95 ${
                        activeTab === cat.id
                          ? "bg-gold-solid text-background shadow-lg shadow-gold-solid/15"
                          : "text-text-gray-muted hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Immersive Gallery Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
              {displayedItems.map((item, idx) => {
                const categoryName = typeof item.category === "object" ? item.category?.name : item.category;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedMedia({
                        url: item.mediaUrl,
                        title: item.title,
                        type: item.mediaType,
                      });
                    }}
                    className={`group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#0d153b]/25 shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-gold-solid/5 cursor-pointer shrink-0 snap-start border border-white/5 hover:border-gold-solid/35 ${
                      idx % 2 === 1 ? "lg:translate-y-4" : ""
                    }`}
                  >
                    {item.mediaType === "VIDEO" ? (
                      <video
                        src={item.mediaUrl}
                        className="absolute inset-0 h-full w-full object-cover"
                        controls={false}
                        muted
                      />
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.altText || item.title || "Gallery Media"}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}

                    {/* Premium Dark Gradient Shading */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

                    {/* Info Tag Footer */}
                    <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold-solid block">
                        {categoryName || "Portfolio"}
                      </span>
                      <h4 className="text-xl font-bold text-white tracking-tight mt-1.5 leading-snug">
                        {item.title || "Untitled"}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-text-gray-muted font-light mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Popup Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-all cursor-pointer border-none"
            onClick={() => setSelectedMedia(null)}
          >
            ✕
          </button>
          <div
            className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.type === "VIDEO" ? (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-t-2xl"
              />
            ) : (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.title || "Gallery Preview"}
                className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-t-2xl"
              />
            )}
            {selectedMedia.title && (
              <div className="w-full bg-[#0d153b] p-4 text-center border-t border-white/10">
                <p className="text-white font-bold text-base">{selectedMedia.title}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
