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
    <div className={`max-w-3xl mb-6 sm:mb-8 ${alignClass} ${className} animate-in fade-in slide-in-from-bottom duration-700`}>
      {badge && (
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF4E8] border border-[#EADBB4] text-[10px] font-extrabold uppercase tracking-widest text-[#8C6D23] mb-3 shadow-sm">
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-sans text-foreground font-bold tracking-tight leading-tight">
        {plainText}{" "}
        <span className="bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#8C6D23] bg-clip-text text-transparent font-extrabold not-italic block sm:inline">
          {highlightText}
        </span>
      </h2>
    </div>
  );
}
