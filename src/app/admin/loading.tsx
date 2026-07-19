"use client";

import React from "react";

export default function AdminLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f0f14] text-white font-sans">
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Indigo rotating spinner for admin */}
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/10 border-t-indigo-500 animate-spin" style={{ animationDuration: "1s" }} />
          <div className="absolute inset-2 rounded-full border border-white/5 border-b-indigo-500/30 animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
          
          <span className="text-xl font-bold text-indigo-400">N</span>
        </div>
        
        <div className="space-y-2 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8E90A2]">
            Loading Panel
          </p>
          <div className="flex justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
