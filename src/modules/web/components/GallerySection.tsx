"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import SectionHeading from "@/shared/components/SectionHeading";
import { getWebsiteHomeGallery } from "@/modules/admin/services/home-gallery.service";
import { HomeGallery } from "@/modules/admin/types";
import { API_BASE_URL } from "@/shared/lib/api-config";

export default function GallerySection() {
  const [items, setItems] = useState<HomeGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getWebsiteHomeGallery();
        setItems(data);
      } catch (err: unknown) {
        console.error("Failed to load website home gallery:", err);
        setError("Unable to load showcase gallery.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || items.length === 0) return;

    const intervalId = setInterval(() => {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScrollLeft - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(intervalId);
  }, [items]);

  return (
    <section className="w-full bg-[#0d153b]/10 py-16 md:py-24 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <SectionHeading 
          badge="Visual Experience" 
          plainText="Gallery &" 
          highlightText="Lifestyle" 
          align="center"
          className="max-w-2xl"
        />
        <p className="mt-[-2rem] text-sm text-[#8E90A2] text-center max-w-2xl mx-auto mb-16">
          A glance into the state-of-the-art architectures, wellness setups, and elite clubhouses designed for modern comfort.
        </p>

        {loading ? (
          /* Loading Skeletons */
          <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory no-scrollbar scroll-smooth">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="relative aspect-square w-[260px] sm:w-[320px] shrink-0 overflow-hidden rounded-2xl border border-border-muted bg-[#13131a] animate-pulse flex flex-col justify-end p-6 space-y-3"
              >
                <div className="h-3 w-1/4 bg-[#DDBD81]/25 rounded" />
                <div className="h-5 w-3/4 bg-slate-700/40 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error Fallback State */
          <div className="text-center py-8">
            <p className="text-sm text-red-400 font-medium">⚠️ {error}</p>
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-8">
            <p className="text-sm text-text-gray-muted font-light">No gallery images available.</p>
          </div>
        ) : (
          /* Main Gallery scroll view */
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory no-scrollbar scroll-smooth"
          >
            {items.map((item, idx) => {
              const imageUrl = item.image.startsWith("http")
                ? item.image
                : `${API_BASE_URL.replace("/api/v1", "")}${item.image}`;

              return (
                <div
                  key={item.id}
                  className="group relative aspect-square w-[260px] sm:w-[320px] shrink-0 overflow-hidden rounded-2xl border border-border-muted snap-start"
                >
                  <Image
                    src={imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 260px, 320px"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 z-10" />
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#DDBD81]">
                      {item.tag}
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1">{item.title}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
