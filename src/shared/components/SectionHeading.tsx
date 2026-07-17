"use client";

import React from "react";

interface SectionHeadingProps {
  badge?: string;
  plainText: string;
  highlightText: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  badge,
  plainText,
  highlightText,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-3xl mb-12 lg:mb-16 ${alignClass} ${className} animate-in fade-in slide-in-from-bottom duration-700`}>
      {badge && (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-solid/5 border border-gold-solid/20 text-[10px] font-bold uppercase tracking-widest text-gold-solid mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-light tracking-tight leading-tight">
        {plainText}{" "}
        <span className="bg-gradient-to-r from-gold-solid via-gold-hover to-gold-dark bg-clip-text text-transparent font-medium italic block sm:inline">
          {highlightText}
        </span>
      </h2>
    </div>
  );
}
