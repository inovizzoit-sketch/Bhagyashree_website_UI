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
    <section ref={sectionRef} className="w-full bg-[#FAF4E8] py-10 md:py-12 font-sans relative overflow-hidden border-y border-[#EADBB4]">
      {/* Concentric rings design for footprint/counter section */}
      <DecorativeCircles
        theme="light"
        circles={[
          { size: 500, right: "-100px", top: "-100px", opacity: 0.08, color: "border-[#8C6D23]/20" },
          { size: 600, left: "-200px", bottom: "-200px", opacity: 0.06, color: "border-[#8C6D23]/15" }
        ]}
      />

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        <div className="mb-5 flex items-center gap-4 text-[#8C6D23] text-xs font-extrabold uppercase tracking-[0.24em]">
          <span className="h-px w-12 bg-[#8C6D23]" />
          Our Footprint
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {statsData.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center text-center relative group bg-white border border-[#EADBB4] hover:border-[#D4AF37] rounded-3xl p-6 shadow-md hover:shadow-xl hover:shadow-[#D4AF37]/15 transition-all duration-300 w-full h-full min-h-[160px]"
            >
              {/* Stat Value */}
              <div className="text-3xl sm:text-4xl lg:text-5xl font-sans text-[#1A150C] font-extrabold tracking-tight">
                {counts[idx]}
                <span className="text-[#D4AF37] font-bold">{stat.suffix}</span>
              </div>
              {/* Stat Descriptions */}
              <div className="mt-4 flex flex-col text-xs md:text-sm text-slate-700 font-bold tracking-wider uppercase leading-snug">
                <span className="text-[#8C6D23]">{stat.label}</span>
                <span className="text-slate-500 font-normal">
                  {stat.subLabel || <span className="invisible">&nbsp;</span>}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
