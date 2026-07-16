"use client";

import { useEffect, useState } from "react";

// CountUp configuration data structure
interface StatItem {
  target: number;
  suffix: string;
  label: string;
  subLabel: string;
}

const statsData: StatItem[] = [
  { target: 13, suffix: " Mn", label: "sq. ft. of land", subLabel: "sold" },
  { target: 6500, suffix: "+", label: "land owners", subLabel: "worldwide" },
  { target: 25, suffix: " Mn", label: "sq. ft. under", subLabel: "development" },
  { target: 16, suffix: "", label: "locations across", subLabel: "India" },
];

export default function CounterSection() {
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
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
  }, []);

  return (
    <section className="w-full bg-transparent py-8 md:py-10 font-sans relative">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[500px] rounded-full bg-gold-solid/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center">
          {statsData.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative group">
              {/* Stat Value */}
              <div className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white font-extrabold tracking-tight">
                {counts[idx]}
                <span className="text-[#DDBD81]">{stat.suffix}</span>
              </div>
              {/* Stat Descriptions */}
              <div className="mt-3 flex flex-col text-xs md:text-sm text-[#8E90A2] font-semibold tracking-wider uppercase leading-snug">
                <span>{stat.label}</span>
                <span className="text-white/40">{stat.subLabel}</span>
              </div>

              {/* Vertical dotted divider separator line matching image style */}
              {idx < statsData.length - 1 && (
                <div className="hidden md:flex absolute right-[-8px] top-1/2 -translate-y-1/2 h-14 items-center justify-between flex-col">
                  {/* Decorative divider crosses at top and bottom */}
                  <span className="text-[9px] text-white/20 select-none">✦</span>
                  <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                  <span className="text-[9px] text-white/20 select-none">✦</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
