"use client";

import React from "react";
import SectionHeading from "@/shared/components/SectionHeading";

interface GalleryItem {
  imageSrc: string;
  alt: string;
  tag: string;
  title: string;
  translateY?: boolean;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    imageSrc: "/images/clubhouse.png",
    alt: "Nandeeka Puram",
    tag: "Clubhouse",
    title: "Nandeeka Puram",
  },
  {
    imageSrc: "/images/wellness.png",
    alt: "Wellness center",
    tag: "Health & Spa",
    title: "Wellness center",
    translateY: true,
  },
  {
    imageSrc: "/images/lord_shiva_temple.png",
    alt: "Lord Shiva Temple",
    tag: "Spiritual",
    title: "Lord Shiva Temple",
  },
  {
    imageSrc: "/images/sports_cluster.png",
    alt: "Sports Cluster",
    tag: "Sports",
    title: "Sports Cluster",
    translateY: true,
  },
  {
    imageSrc: "/images/open_gymnasium.png",
    alt: "Open gymnasium",
    tag: "Fitness",
    title: "Open gymnasium",
  },
  {
    imageSrc: "/images/ev_charging_station.png",
    alt: "Ev charging station",
    tag: "Utility",
    title: "Ev charging station",
    translateY: true,
  },
];

export default function GallerySection() {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const intervalId = setInterval(() => {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScrollLeft - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(intervalId);
  }, []);

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

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-square w-[260px] sm:w-[320px] shrink-0 overflow-hidden rounded-2xl border border-border-muted snap-start"
            >
              <img
                src={item.imageSrc}
                alt={item.alt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DDBD81]">
                  {item.tag}
                </span>
                <h4 className="text-lg font-bold text-white mt-1">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
