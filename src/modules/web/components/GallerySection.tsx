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
    alt: "Elite Clubhouse",
    tag: "Amenity",
    title: "Elite Clubhouse",
  },
  {
    imageSrc: "/images/wellness.png",
    alt: "Wellness Center",
    tag: "Health",
    title: "Wellness Center",
    translateY: true,
  },
  {
    imageSrc: "/images/spiritual_club.png",
    alt: "Spiritual Lounge",
    tag: "Recreation",
    title: "Spiritual Lounge",
  },
  {
    imageSrc: "/images/amenity_saryu.png",
    alt: "Sarayu Deck",
    tag: "Nature",
    title: "Sarayu Deck",
    translateY: true,
  },
];

export default function GallerySection() {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={`group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-muted ${
                item.translateY ? "lg:translate-y-4" : ""
              }`}
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
