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
            Explore our curated collections of state-of-the-art architectures, wellness setups, and elite clubhouses designed for modern comfort.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-2 border-gold-solid/25 border-t-gold-solid rounded-full animate-spin" />
            <p className="text-xs text-text-gray-muted uppercase tracking-widest font-semibold">Loading Categories...</p>
          </div>
        ) : error && categories.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-2xl border border-red-500/20 bg-red-500/5 text-center space-y-4">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-base font-bold text-white">Temporary Loading Error</h3>
            <p className="text-xs text-text-gray-muted font-light leading-relaxed">
              We encountered a connection check delay while fetching the gallery. Please try again later.
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-2xl border border-white/5 bg-[#0d153b]/20 text-center space-y-4">
            <span className="text-3xl">🖼</span>
            <h3 className="text-base font-bold text-white">No Categories Available</h3>
            <p className="text-xs text-text-gray-muted font-light leading-relaxed">
              No gallery categories have been published yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
            {categories.map((cat) => {
              // Find items matching this category
              const catItems = items.filter((item) => {
                if (typeof item.category === "object" && item.category?.id) {
                  return item.category.id === cat.id;
                }
                return item.categoryId === cat.id || item.category === cat.id;
              });

              // Extract first image as cover image
              const coverImageItem = catItems.find((item) => item.mediaType === "IMAGE") || catItems[0];
              const coverImageUrl = coverImageItem?.mediaUrl || "/placeholder-gallery.jpg";
              const totalItems = cat._count?.galleries ?? catItems.length;

              return (
                <Link
                  key={cat.id}
                  href={`/gallery/${cat.slug}`}
                  className="group relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-[#0d153b]/25 shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-gold-solid/10 cursor-pointer border border-white/5 hover:border-gold-solid/35 block"
                >
                  {/* Background Cover Image */}
                  <img
                    src={coverImageUrl}
                    alt={cat.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Dark Elegant Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/25 opacity-85 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

                  {/* Top Stats Tag */}
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full pointer-events-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-solid">
                      {totalItems} {totalItems === 1 ? "Item" : "Items"}
                    </span>
                  </div>

                  {/* Info Tag Footer */}
                  <div className="absolute bottom-6 left-6 right-6 pointer-events-none transition-transform duration-300 group-hover:translate-y-[-2px]">
                    <h4 className="text-xl font-bold text-white tracking-tight leading-snug">
                      {cat.name}
                    </h4>
                    {cat.description && (
                      <p className="text-xs text-text-gray-muted font-light mt-1.5 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
