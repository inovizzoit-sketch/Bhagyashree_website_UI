"use client";

import React, { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setIsScrollable(totalHeight > 200);
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    // Run initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const isAtTopHalf = scrollProgress < 50;

  const handleScrollAction = () => {
    if (isAtTopHalf) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Circumference for r=18: 2 * pi * 18 ≈ 113.1
  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      onClick={handleScrollAction}
      aria-label={isAtTopHalf ? "Scroll to bottom" : "Scroll to top"}
      className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-card-bg backdrop-blur-md border border-card-border flex items-center justify-center cursor-pointer z-50 shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:border-gold-solid/40 transition-all duration-300 group/scroll ${
        isScrollable
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-4 scale-90 pointer-events-none"
      }`}
    >
      {/* SVG Progress Circle */}
      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 40 40">
        {/* Progress circle track (faint) */}
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="transparent"
          className="stroke-border-color"
          strokeWidth="2"
        />
        {/* Active progress track */}
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="transparent"
          className="stroke-gold-solid transition-all duration-75"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Upward/Downward Rotating Arrow Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 16 16"
        className={`text-gold-solid transition-all duration-500 z-10 ${
          isAtTopHalf
            ? "rotate-180 group-hover/scroll:translate-y-1"
            : "rotate-0 group-hover/scroll:-translate-y-1"
        }`}
      >
        <path
          fillRule="evenodd"
          d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
        />
      </svg>
    </button>
  );
}
