"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SectionHeading from "@/shared/components/SectionHeading";
import { API_BASE_URL } from "@/shared/lib/api-config";

interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface GalleryItem {
  id: string;
  title?: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  altText?: string;
  description?: string;
}

export default function CategoryGalleryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<GalleryCategory | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const getMediaUrl = (url?: string) => {
    if (!url) return "/placeholder-gallery.jpg";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    const baseUrl = API_BASE_URL.replace("/api/v1", "");
    return `${baseUrl}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  };

  // Fetch category details
  useEffect(() => {
    if (!slug) return;

    if (slug === "general") {
      setCategory({
        id: "general",
        name: "General Showcase",
        slug: "general",
        description: "Featured project developments, layouts, and site highlights.",
      });
      return;
    }

    fetch(`${API_BASE_URL}/gallery/category?status=true`)
      .then((r) => (r.ok ? r.json() : []))
      .then((cats: GalleryCategory[]) => {
        const found = cats.find((c) => c.slug === slug);
        if (found) {
          setCategory(found);
        }
      })
      .catch((err) => {
        console.error("Failed to load category details:", err);
      });
  }, [slug]);

  // Fetch gallery items for the category with pagination
  useEffect(() => {
    if (!slug) return;

    setLoading(true);

    if (slug === "general" || category?.id === "general") {
      fetch(`${API_BASE_URL}/gallery?status=true&limit=200`)
        .then((r) => (r.ok ? r.json() : []))
        .then((data) => {
          const raw = Array.isArray(data) ? data : data.items || [];
          const unassigned = raw.filter((item: any) => !item.categoryId);
          const finalItems = unassigned.length > 0 ? unassigned : raw;
          setItems(finalItems);
          setTotalItems(finalItems.length);
          setTotalPages(1);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Failed to load gallery items");
          setLoading(false);
        });
      return;
    }

    if (!category?.id) return;

    fetch(`${API_BASE_URL}/gallery?status=true&categoryId=${category.id}&page=${page}&limit=${limit}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load images");
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
          setTotalItems(data.length);
          setTotalPages(1);
        } else {
          setItems(data.items || []);
          setTotalItems(data.meta?.total || 0);
          setTotalPages(data.meta?.totalPages || 1);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load gallery items");
        setLoading(false);
      });
  }, [category, slug, page, limit]);

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
  };

  const showPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
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
  }, [lightboxIndex, items]);

  const activeMedia = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <div className="min-h-screen pt-24 md:pt-32 bg-[#FBF8F2] pb-32 overflow-hidden relative font-sans text-slate-800 border-t border-[#EADBB4]/60">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[35vh] right-[-200px] w-[500px] h-[500px] bg-[#8C6D23]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation Row */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 pt-4 relative z-10">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#EADBB4] bg-white hover:bg-[#FAF4E8] text-[#8C6D23] hover:text-[#1A150C] text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-sm active:scale-95 cursor-pointer no-underline"
        >
          ← Back to Gallery Collections
        </Link>
      </div>

      {/* Header section */}
      <div className="relative pt-6 pb-10 md:pt-8 md:pb-12 z-10">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center">
          <SectionHeading
            badge="Collection"
            plainText="Visual"
            highlightText={category?.name || "Gallery"}
            align="center"
          />
          {category?.description && (
            <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal mt-4">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-2 border-[#D4AF37]/25 border-t-[#D4AF37] rounded-full animate-spin" />
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Loading Gallery...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto p-8 rounded-2xl border border-red-500/20 bg-red-500/5 text-center space-y-4">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-base font-bold text-[#1A150C]">Temporary Loading Error</h3>
            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              We encountered a connection check delay while fetching the gallery. Please try again later.
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-3xl border border-[#EADBB4] bg-white text-center space-y-4 shadow-sm">
            <span className="text-3xl text-[#D4AF37]">🖼</span>
            <h3 className="text-base font-extrabold text-[#1A150C]">No images available</h3>
            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              No gallery items have been published for this category yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => openLightbox(idx)}
                  className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-white shadow-md hover:shadow-2xl hover:shadow-[#D4AF37]/15 transition-all duration-500 cursor-pointer border border-[#EADBB4] hover:border-[#D4AF37]"
                >
                  {item.mediaType === "VIDEO" ? (
                    <video
                      src={getMediaUrl(item.mediaUrl)}
                      className="absolute inset-0 h-full w-full object-cover"
                      controls={false}
                      muted
                    />
                  ) : (
                    <img
                      src={getMediaUrl(item.mediaUrl)}
                      alt={item.altText || item.title || category?.name || "Gallery Image"}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-gallery.jpg";
                      }}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />

                  {/* Title overlay on hover */}
                  {item.title && !/^file_/i.test(item.title.trim()) && !/\.(png|jpe?g|webp|gif|svg)$/i.test(item.title.trim()) && (
                    <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <h4 className="text-base font-extrabold text-white tracking-tight leading-snug">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-[11px] text-slate-300 font-light mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 pt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-[#EADBB4] bg-white text-[#8C6D23] hover:bg-[#FAF4E8]"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                      page === p
                        ? "bg-[#1A150C] text-white border border-[#1A150C] shadow-md scale-105 font-extrabold"
                        : "text-[#8C6D23] hover:text-[#1A150C] hover:bg-[#FAF4E8] border border-[#EADBB4] bg-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-[#EADBB4] bg-white text-[#8C6D23] hover:bg-[#FAF4E8]"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox / Popup Modal */}
      {lightboxIndex !== null && activeMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-300 p-4 font-sans"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-[#D4AF37] text-[#1A150C] flex items-center justify-center text-xl transition-all cursor-pointer border border-[#EADBB4] z-50 hover:scale-105 active:scale-95 shadow-2xl font-bold"
            onClick={closeLightbox}
            title="Close (Esc)"
          >
            ✕
          </button>

          {/* Previous Button */}
          {items.length > 1 && (
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1A150C]/90 hover:bg-[#8C6D23] text-[#D4AF37] hover:text-white flex items-center justify-center text-xl font-extrabold transition-all cursor-pointer border border-[#D4AF37]/40 z-50 hover:scale-110 active:scale-95 shadow-2xl"
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
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1A150C]/90 hover:bg-[#8C6D23] text-[#D4AF37] hover:text-white flex items-center justify-center text-xl font-extrabold transition-all cursor-pointer border border-[#D4AF37]/40 z-50 hover:scale-110 active:scale-95 shadow-2xl"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              title="Next Image (→)"
            >
              ›
            </button>
          )}

          {/* ONLY THE MEDIA ITSELF */}
          <div
            className="relative max-h-[85vh] max-w-[90vw] flex items-center justify-center z-[50]"
            onClick={(e) => e.stopPropagation()}
          >
            {activeMedia.mediaType === "VIDEO" ? (
              <video
                src={getMediaUrl(activeMedia.mediaUrl)}
                className="max-h-[85vh] max-w-[90vw] w-auto h-auto object-contain rounded-2xl select-none shadow-2xl border border-[#EADBB4]/30"
                controls
                autoPlay
              />
            ) : (
              <img
                src={getMediaUrl(activeMedia.mediaUrl)}
                alt={activeMedia.title || "Gallery Item"}
                className="max-h-[85vh] max-w-[90vw] w-auto h-auto object-contain rounded-2xl select-none shadow-2xl border border-[#EADBB4]/30"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
