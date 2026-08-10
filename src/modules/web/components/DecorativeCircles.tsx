"use client";

import React from "react";

export interface CircleConfig {
  size: number;
  mobileScale?: number; // e.g. 0.6 to scale down on mobile
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  opacity?: number;
  color?: string; // Tailwind border color class, e.g., 'border-gold-solid/15'
  className?: string; // Custom positioning tailwind classes
}

interface DecorativeCirclesProps {
  circles: CircleConfig[];
  containerClassName?: string;
  theme?: "light" | "dark";
}

export default function DecorativeCircles({
  circles,
  containerClassName = "",
  theme = "dark",
}: DecorativeCirclesProps) {
  // Default themes: dark sections use light/gold, light sections use deep primary/gold
  const defaultColor = theme === "dark" ? "border-gold-solid/15" : "border-dark-primary/10";

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${containerClassName}`}>
      {circles.map((circle, idx) => {
        const sizeStyle = {
          width: circle.size,
          height: circle.size,
          top: circle.top,
          bottom: circle.bottom,
          left: circle.left,
          right: circle.right,
          opacity: circle.opacity ?? 0.1,
        };

        const colorClass = circle.color || defaultColor;
        const mobileScaleClass = circle.mobileScale
          ? `scale-[${circle.mobileScale}] sm:scale-100`
          : "scale-[0.6] sm:scale-100";

        return (
          <div
            key={idx}
            style={sizeStyle}
            className={`absolute rounded-full border pointer-events-none transition-all duration-700 origin-center ${mobileScaleClass} ${colorClass} ${circle.className || ""}`}
          />
        );
      })}
    </div>
  );
}
