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

  // Fetch category details
  useEffect(() => {
    if (!slug) return;

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
    if (!category?.id) {
      // If we don't have ID yet, wait until category details are loaded
      return;
    }

    setLoading(true);
    const idToUse = category.id;

    fetch(`${API_BASE_URL}/gallery?status=true&categoryId=${idToUse}&page=${page}&limit=${limit}`)
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
  }, [category, page, limit]);

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
    <div className="min-h-screen bg-background pb-32 overflow-hidden relative font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-gold-solid/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[35vh] right-[-200px] w-[500px] h-[500px] bg-gold-solid/2 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation Row */}
      {/* <div className="mx-auto max-w-7xl px-6 md:px-8 pt-28 md:pt-36 relative z-10">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-[#0d153b]/40 hover:bg-gold-solid hover:border-gold-solid text-white hover:text-background text-[11px] font-bold uppercase tracking-wider transition-all duration-300 shadow-xl group hover:shadow-gold-solid/10 hover:scale-105 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Gallery
        </Link>
      </div> */}

      {/* Header section */}
      <div className="relative pt-6 pb-10 md:pt-8 md:pb-12 z-10">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center">
          <div className="flex justify-center mb-6">
            {/* <div className="w-12 h-12 rounded-full border border-gold-solid/20 bg-gold-solid/5 flex items-center justify-center text-gold-solid shadow-lg shadow-gold-solid/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 animate-pulse"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                />
              </svg>
            </div> */}
          </div>
          <SectionHeading
            badge="Collection"
            plainText=""
            highlightText={category?.name || "Gallery"}
            align="center"
          />
          {category?.description && (
            <p className="mx-auto max-w-2xl text-sm md:text-base text-text-gray-muted leading-relaxed font-light mt-4">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-2 border-gold-solid/25 border-t-gold-solid rounded-full animate-spin" />
            <p className="text-xs text-text-gray-muted uppercase tracking-widest font-semibold">Loading Gallery...</p>
          </div>
        ) : error ? (
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
            <h3 className="text-base font-bold text-white">No images available</h3>
            <p className="text-xs text-text-gray-muted font-light leading-relaxed">
              No gallery items have been published for this category yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Responsive Responsive Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => openLightbox(idx)}
                  className="group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#0d153b]/25 shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-gold-solid/5 cursor-pointer border border-white/5 hover:border-gold-solid/35"
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
                      alt={item.altText || item.title || category?.name || "Gallery Image"}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

                  {/* Title overlay on hover */}
                  <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <h4 className="text-base font-bold text-white tracking-tight leading-snug">
                      {item.title || "View Image"}
                    </h4>
                    {item.description && (
                      <p className="text-[11px] text-text-gray-muted font-light mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 pt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-white/5 bg-[#0d153b]/40 text-text-gray-muted hover:text-white hover:bg-white/5"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                      page === p
                        ? "bg-gold-solid text-background shadow-lg shadow-gold-solid/15 font-extrabold"
                        : "text-text-gray-muted hover:text-white hover:bg-white/5 border border-white/5 bg-[#0d153b]/40"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-white/5 bg-[#0d153b]/40 text-text-gray-muted hover:text-white hover:bg-white/5"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-300"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center text-xl transition-all cursor-pointer border border-white/10 z-50 hover:scale-105 active:scale-95"
            onClick={closeLightbox}
          >
            ✕
          </button>

          {/* Previous Button */}
          <button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center text-xl transition-all cursor-pointer border border-white/10 z-50 hover:scale-105 active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
          >
            ‹
          </button>

          {/* Next Button */}
          <button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center text-xl transition-all cursor-pointer border border-white/10 z-50 hover:scale-105 active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
          >
            ›
          </button>

          {/* Media Content */}
          <div
            className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 flex flex-col items-center mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {activeMedia.mediaType === "VIDEO" ? (
              <video
                src={activeMedia.mediaUrl}
                controls
                autoPlay
                className="w-auto h-auto max-w-full max-h-[75vh] object-contain rounded-t-2xl"
              />
            ) : (
              <img
                src={activeMedia.mediaUrl}
                alt={activeMedia.altText || activeMedia.title || "Gallery Preview"}
                className="w-auto h-auto max-w-full max-h-[75vh] object-contain rounded-t-2xl select-none"
              />
            )}

            {/* Info Footer */}
            <div className="w-full bg-[#0d153b]/90 backdrop-blur-md p-5 text-center border-t border-white/10">
              <p className="text-white font-bold text-base leading-snug">
                {activeMedia.title || `${category?.name || "Gallery"} Item`}
              </p>
              {activeMedia.description && (
                <p className="text-xs text-text-gray-muted font-light mt-1.5 max-w-2xl mx-auto leading-relaxed">
                  {activeMedia.description}
                </p>
              )}
              <span className="text-[10px] text-gold-solid font-semibold tracking-widest uppercase block mt-2">
                {lightboxIndex + 1} / {items.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
