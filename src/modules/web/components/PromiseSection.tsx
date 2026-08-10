"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/shared/components/SectionHeading";
import DecorativeCircles from "./DecorativeCircles";

// Slide promise object structure
interface SlickCard {
  title: string;
  description: string;
}

const slickCards: SlickCard[] = [
  {
    title: "Clean Titles",
    description: "Say goodbye to legal confusion, hidden claims, and endless paperwork drama.",
  },
  {
    title: "Prime Locations",
    description: "No more guesswork, misleading advice, or location-related surprises.",
  },
  {
    title: "Options for Everyone",
    description: "Whether you’re starting small or thinking big, every investor deserves access to the right opportunities.",
  },
  {
    title: "Expert Support",
    description: "No back-and-forth, no unclear answers, expert guidance that keeps you stress-free.",
  },
  {
    title: "Transparent Pricing",
    description: "No hidden charges, administration fees, or surprise costs. What you see is what you pay.",
  },
  {
    title: "Secure Transactions",
    description: "Every payment, document transfer, and agreement is processed with absolute security and transparency.",
  },
];

export default function PromiseSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll loop effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slickCards.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slickCards.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slickCards.length) % slickCards.length);
  };

  return (
    <section className="w-full bg-surface py-14 sm:py-16 lg:py-20 relative overflow-x-clip font-sans">
      <DecorativeCircles
        theme="light"
        circles={[
          { size: 550, right: "-15%", top: "10%", opacity: 0.08, className: "lg:right-[-100px] lg:top-[5%]" }
        ]}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-solid/40 to-transparent" />
      <div className="absolute -left-36 top-20 h-80 w-80 rounded-full bg-gold-solid/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              badge="Our Commitment"
              plainText="Land Buying,"
              highlightText="Simplified"
              className="!mb-5"
            />
            <p className="max-w-md border-l-2 border-gold-solid pl-5 text-sm sm:text-base leading-7 text-text-gray-muted">
              Because owning land should feel easy, not overwhelming.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous promise"
                className="grid h-11 w-11 place-items-center rounded-full border border-dark-secondary/15 text-dark-secondary transition-all hover:border-dark-secondary hover:bg-dark-secondary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-solid"
              >
                <span aria-hidden="true">←</span>
              </button>
              <span className="min-w-14 text-center text-xs font-bold tracking-widest text-text-gray-muted">
                {String(activeIndex + 1).padStart(2, "0")} / {String(slickCards.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next promise"
                className="grid h-11 w-11 place-items-center rounded-full bg-dark-secondary text-white transition-all hover:-translate-y-0.5 hover:bg-dark-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-solid"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr] min-w-0">
            <article className="relative min-h-[330px] overflow-hidden rounded-[2rem] bg-dark-secondary p-7 sm:p-9 text-white shadow-xl shadow-dark-secondary/15 flex flex-col justify-between">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-gold-solid/20" />
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/10" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold-solid/30 bg-gold-solid/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-solid">
                  <span>★</span> Premium guarantee
                </span>
              </div>
              <div className="relative mt-16">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-text-on-dark-muted">We promise</span>
                <h3 className="mt-3 text-3xl sm:text-4xl font-serif leading-tight text-white">
                  {slickCards[activeIndex].title}
                </h3>
                <p className="mt-4 max-w-lg text-sm sm:text-base leading-7 text-text-on-dark-muted">
                  {slickCards[activeIndex].description}
                </p>
              </div>
            </article>

            <div className="grid gap-2" role="tablist" aria-label="Our promises">
              {slickCards.map((card, idx) => (
                <button
                  key={card.title}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`group flex min-w-0 items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-solid ${
                    activeIndex === idx
                      ? "border-gold-solid/45 bg-[#f0eadc] shadow-sm"
                      : "border-card-border bg-background hover:border-gold-solid/35 hover:bg-surface-muted/50"
                  }`}
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-extrabold ${activeIndex === idx ? "bg-gold-solid text-dark-secondary" : "bg-surface-muted text-text-gray-muted group-hover:text-dark-primary"}`}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className={`truncate text-sm font-bold ${activeIndex === idx ? "text-dark-secondary" : "text-foreground"}`}>
                    {card.title}
                  </span>
                  <span className={`ml-auto text-sm transition-transform group-hover:translate-x-0.5 ${activeIndex === idx ? "text-gold-dark" : "text-text-gray-muted/50"}`}>→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
