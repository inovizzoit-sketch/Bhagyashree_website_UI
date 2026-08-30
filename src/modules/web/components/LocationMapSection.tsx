"use client";

import React from "react";

export default function LocationMapSection() {
  return (
    <section className="w-full relative overflow-hidden font-sans bg-[#0a0a14]">
      {/* Section Header */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 pt-10 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 rounded-full mb-2">
            Find Us
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Our Office Location
          </h2>
          <p className="text-sm text-[#8E90A2] mt-1">
            Visit us at our registered office in Mirzapur, Uttar Pradesh.
          </p>
        </div>

        {/* Call & WhatsApp Button */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="tel:7007587406"
            className="flex items-center gap-2 bg-[#1A150C] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#1A150C] border border-[#D4AF37]/50 hover:border-[#D4AF37] px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z"/>
            </svg>
            Call
          </a>
          <a
            href="https://wa.me/917007587406"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
            </svg>
            WhatsApp
          </a>
          <span className="text-[#D4AF37] font-bold text-sm hidden sm:block">
            7007587406
          </span>
        </div>
      </div>

      {/* Map Embed */}
      <div className="w-full h-[260px] sm:h-[300px] md:h-[340px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3612.29640440573!2d82.55893497537951!3d25.12566807775705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjXCsDA3JzMyLjQiTiA4MsKwMzMnNDEuNCJF!5e0!3m2!1sen!2sin!4v1788077248741!5m2!1sen!2sin"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Bhagyashree Real Estate Office Location - Mirzapur"
        />
      </div>
    </section>
  );
}
