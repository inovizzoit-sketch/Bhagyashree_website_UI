"use client";

import { useEffect, useState, useRef } from "react";
import DecorativeCircles from "./DecorativeCircles";

// CountUp configuration data structure
interface StatItem {
  target: number;
  suffix: string;
  label: string;
  subLabel: string;
}

const statsData: StatItem[] = [
  { target: 10, suffix: " Mn Sq Ft", label: "Land", subLabel: "" },
  { target: 450, suffix: "+", label: "Customers", subLabel: "" },
  { target: 20, suffix: " Mn Sq.Ft.", label: "Under", subLabel: "Development" },
  { target: 2, suffix: "", label: "Locations in", subLabel: "Greater Mirzapur" },
  { target: 1, suffix: "", label: "Location in", subLabel: "Prayagraj" },
];

export default function CounterSection() {
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // Animation duration in milliseconds
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Using easeOutQuad formula for clean decelerating speed
      const easeProgress = progress * (2 - progress);

      const nextCounts = statsData.map((stat) => {
        const currentCount = Math.round(stat.target * easeProgress);
        return currentCount > stat.target ? stat.target : currentCount;
      });

      setCounts(nextCounts);

      if (frame >= totalFrames) {
        clearInterval(timer);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="w-full bg-dark-secondary py-12 md:py-14 font-sans relative overflow-hidden">
      {/* Concentric rings design for footprint/counter section */}
      <DecorativeCircles
        theme="dark"
        circles={[
          { size: 500, right: "-100px", top: "-100px", opacity: 0.15, color: "border-gold-solid/25" },
          { size: 420, right: "-60px", top: "-60px", opacity: 0.12, color: "border-gold-solid/15" },
          { size: 340, right: "-20px", top: "-20px", opacity: 0.10, color: "border-gold-solid/10" },
          { size: 600, left: "-200px", bottom: "-200px", opacity: 0.10, color: "border-white/5" },
          { size: 520, left: "-160px", bottom: "-160px", opacity: 0.08, color: "border-white/5" }
        ]}
      />

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        <div className="mb-7 flex items-center gap-4 text-gold-solid text-xs font-bold uppercase tracking-[0.24em]"><span className="h-px w-12 bg-gold-solid" />Our footprint</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden">
          {statsData.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center relative group bg-dark-secondary/90 p-5 md:p-6 lg:p-7 hover:bg-dark-primary transition-colors w-full h-full min-h-[160px]">
              {/* Stat Value */}
              <div className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-semibold tracking-tight">
                {counts[idx]}
                <span className="text-gold-solid">{stat.suffix}</span>
              </div>
              {/* Stat Descriptions */}
              <div className="mt-4 flex flex-col text-xs md:text-sm text-text-on-dark-muted font-semibold tracking-wider uppercase leading-snug">
                <span>{stat.label}</span>
                <span className="text-text-gray-muted/60">
                  {stat.subLabel || <span className="invisible">&nbsp;</span>}
                </span>
              </div>

              {/* Vertical dotted divider separator line matching image style */}
              {false && idx < statsData.length - 1 && (
                <div className="hidden md:flex absolute right-[-8px] top-1/2 -translate-y-1/2 h-14 items-center justify-between flex-col">
                  {/* Decorative divider crosses at top and bottom */}
                  <span className="text-[9px] text-text-gray-muted/30 select-none">✦</span>
                  <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-border-muted to-transparent" />
                  <span className="text-[9px] text-text-gray-muted/30 select-none">✦</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
