"use client";

import React from "react";
import SectionHeading from "@/shared/components/SectionHeading";

export default function CMDPage() {
  return (
    <div className="min-h-screen pb-32 overflow-hidden relative text-slate-300 font-sans">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-gold-solid/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20vh] -right-[200px] w-[600px] h-[600px] bg-gold-solid/3 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Section */}
      <div className="relative pt-28 pb-10 md:pt-36 z-10">
        <div className="mx-auto max-w-5xl px-6 md:px-8 text-center">
          <SectionHeading
            badge="Leadership Message"
            plainText="Message from the"
            highlightText="Chairman & Managing Director"
            align="center"
          />
        </div>
      </div>

      {/* Two Column Content Layout */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Styled Message Text */}
          <div className="lg:col-span-7 space-y-8">
            <h3 className="text-4xl sm:text-5xl font-serif text-gold-solid italic tracking-wide font-light">
              A promise...
            </h3>
            
            <div className="space-y-6 text-sm sm:text-base text-slate-200 leading-relaxed font-light">
              <p>
                When I imagined NandeekaPuram, I did not imagine a township. I imagined a
                family together in the evening, unhurried, at peace and I asked myself: have
                we built for that feeling? Every decision since has been an answer to that
                question. I give you my word, and I give you my name alongside it.
                NandeekaPuram is both an epitome and an assurance — of excellence, of
                serenity, and of a life lived with quiet distinction.
              </p>
              
              <p>
                At the heart of everything the Nandeeka Group builds is a belief we do not
                compromise on, that a space must serve the human being first, entirely, and
                without afterthought. NandeekaPuram has been planned and designed from the
                inside out: around the body that will walk its paths, the mind that will rest
                within its walls, and the life that will unfold, day after day, within its gates.
              </p>

              <p>
                Every corridor, every garden, every shared space has been considered not
                merely for how it looks: but for how it feels to live within it. Human comfort is
                not a feature here. It is the foundation.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-1">
              <h4 className="text-xl font-serif text-white tracking-wide font-semibold">
                Vivek Singh
              </h4>
              <p className="text-xs uppercase tracking-widest text-gold-solid font-mono font-bold">
                CMD, Nandeeka Group
              </p>
            </div>
          </div>

          {/* Right Column: Original designed Image */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute inset-0 bg-gold-solid/5 rounded-2xl blur-xl transition-all duration-500 group-hover:bg-gold-solid/10" />
            <div className="relative aspect-[9/10] rounded-2xl overflow-hidden border border-white/10 bg-[#050c38]/20 shadow-2xl transition-all duration-500 group-hover:border-gold-solid/35">
              <img
                src="/images/cmd.png"
                alt="A Promise by Vivek Singh, CMD Nandeeka Group"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
