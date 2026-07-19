"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#010314] text-white font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gold-solid/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Brand logo container */}
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Outer golden rotating border */}
          <div className="absolute inset-0 rounded-full border-2 border-gold-solid/10 border-t-gold-solid animate-spin" style={{ animationDuration: "1s" }} />
          {/* Inner counter-rotating border */}
          <div className="absolute inset-2 rounded-full border border-white/5 border-b-gold-solid/35 animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
          
          {/* Logo mark */}
          <span className="text-xl font-serif font-bold text-gold-solid tracking-wider">N</span>
        </div>
        
        {/* Loading indicators */}
        <div className="space-y-2 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8E90A2]">
            Loading Space
          </p>
          <div className="flex justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-solid animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-gold-solid animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-gold-solid animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
