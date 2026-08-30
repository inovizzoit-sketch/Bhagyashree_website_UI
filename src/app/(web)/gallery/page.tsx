"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import SectionHeading from "@/shared/components/SectionHeading";
import { API_BASE_URL } from "@/shared/lib/api-config";

interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count?: {
    galleries: number;
  };
}

interface GalleryItem {
  id: string;
  title?: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  categoryId?: string;
  category?: GalleryCategory | string;
}

export default function GalleryWebPage() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    // Fetch categories and gallery items in parallel to determine cover images and counts
    Promise.all([
      fetch(`${API_BASE_URL}/gallery/category?status=true`).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_BASE_URL}/gallery?status=true&limit=200`).then((r) => (r.ok ? r.json() : [])),
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
          setError(err.message || "Failed to load gallery categories");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const getMediaUrl = (url?: string) => {
    if (!url) return "/placeholder-gallery.jpg";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    const baseUrl = API_BASE_URL.replace("/api/v1", "");
    return `${baseUrl}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  };

  // Compute display categories (including dynamic General Showcase for uncategorized items)
  const uncategorizedItems = items.filter(
    (item) => !item.categoryId && (!item.category || typeof item.category === "string" || item.category === null)
  );

  const displayCategories: GalleryCategory[] = [...categories];

  if (uncategorizedItems.length > 0 && !displayCategories.some((c) => c.slug === "general")) {
    displayCategories.push({
      id: "general",
      name: "General Showcase",
      slug: "general",
      description: "Featured project developments, layouts, and site highlights.",
      _count: { galleries: uncategorizedItems.length },
    });
  }

  return (
    <div className="min-h-screen bg-[#FBF8F2] pb-32 overflow-hidden relative font-sans text-slate-800 border-t border-[#EADBB4]/60">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[35vh] right-[-200px] w-[500px] h-[500px] bg-[#8C6D23]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header section */}
      <div className="relative pt-24 pb-6 md:pt-32 md:pb-8 z-10">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center">
          <SectionHeading
            badge="Visual Showcase"
            plainText="Gallery &"
            highlightText="Lifestyle"
            align="center"
            className="!mb-4"
          />
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
            Explore our curated collections of state-of-the-art architectures, wellness setups, and elite clubhouses designed for modern comfort.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-2 border-[#D4AF37]/25 border-t-[#D4AF37] rounded-full animate-spin" />
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Loading Categories...</p>
          </div>
        ) : error && displayCategories.length === 0 && items.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-2xl border border-red-500/20 bg-red-500/5 text-center space-y-4">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-base font-bold text-[#1A150C]">Temporary Loading Error</h3>
            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              We encountered a connection check delay while fetching the gallery. Please try again later.
            </p>
          </div>
        ) : displayCategories.length === 0 && items.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-3xl border border-[#EADBB4] bg-white text-center space-y-4 shadow-sm">
            <span className="text-3xl text-[#D4AF37]">🖼</span>
            <h3 className="text-base font-extrabold text-[#1A150C]">No Gallery Media Available</h3>
            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              No gallery items have been published yet. Check back soon.
            </p>
          </div>
        ) : displayCategories.length > 0 ? (
          /* ALBUM CATEGORIES GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
            {displayCategories.map((cat) => {
              // Find items matching this category
              const catItems = items.filter((item) => {
                if (cat.id === "general" || cat.slug === "general") {
                  return !item.categoryId && (!item.category || typeof item.category === "string" || item.category === null);
                }
                if (typeof item.category === "object" && item.category?.id) {
                  return item.category.id === cat.id;
                }
                return item.categoryId === cat.id || item.category === cat.id;
              });

              // Extract first image as cover image
              const coverImageItem = catItems.find((item) => item.mediaType === "IMAGE") || catItems[0];
              const coverImageUrl = coverImageItem?.mediaUrl ? getMediaUrl(coverImageItem.mediaUrl) : "/placeholder-gallery.jpg";
              const totalItems = cat._count?.galleries ?? catItems.length;

              return (
                <Link
                  key={cat.id}
                  href={`/gallery/${cat.slug}`}
                  className="group relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-white shadow-md hover:shadow-2xl hover:shadow-[#D4AF37]/15 transition-all duration-500 cursor-pointer border border-[#EADBB4] hover:border-[#D4AF37] block"
                >
                  {/* Background Cover Image */}
                  <img
                    src={coverImageUrl}
                    alt={cat.name}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-gallery.jpg";
                    }}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Dark Elegant Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />

                  {/* Top Stats Tag */}
                  <div className="absolute top-4 right-4 bg-[#1A150C]/80 backdrop-blur-md border border-[#D4AF37]/40 px-3.5 py-1 rounded-full pointer-events-none">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37]">
                      {totalItems} {totalItems === 1 ? "Item" : "Items"}
                    </span>
                  </div>

                  {/* Info Tag Footer */}
                  <div className="absolute bottom-6 left-6 right-6 pointer-events-none transition-transform duration-300 group-hover:translate-y-[-2px]">
                    <h4 className="text-xl font-extrabold text-white tracking-tight leading-snug">
                      {cat.name}
                    </h4>
                    {cat.description && (
                      <p className="text-xs text-slate-300 font-light mt-1.5 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* DIRECT GALLERY ITEMS GRID (Fallback if no Categories exist) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-white shadow-md hover:shadow-2xl hover:shadow-[#D4AF37]/15 transition-all duration-500 border border-[#EADBB4] hover:border-[#D4AF37]"
              >
                {item.mediaType === "VIDEO" ? (
                  <video src={getMediaUrl(item.mediaUrl)} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <img
                    src={getMediaUrl(item.mediaUrl)}
                    alt={item.title || "Gallery Item"}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-gallery.jpg";
                    }}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-80" />
                {item.title && !/^file_/i.test(item.title.trim()) && !/\.(png|jpe?g|webp|gif|svg)$/i.test(item.title.trim()) && (
                  <div className="absolute bottom-6 left-6 right-6">
                    <h4 className="text-base font-extrabold text-white leading-snug">{item.title}</h4>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
