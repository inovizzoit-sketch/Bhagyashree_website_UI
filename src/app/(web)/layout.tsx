// src/app/(web)/layout.tsx

import type { Metadata } from "next";
import Navbar from "@/modules/web/components/Navbar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nandeeka — Timeless Luxury Spaces",
  description: "Official website of Nandeeka developments.",
};



export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-dark-primary text-text-white antialiased">
      {/* Dynamic Header & Navigation */}
      <Navbar />

      {/* Main Content Layout */}
      <main className="flex-1">{children}</main>

      {/* Premium Footer */}
      <footer className="border-t border-white/5 bg-[#010314] py-16 text-[13px] md:text-sm text-text-gray-muted mt-auto z-10 relative">
        <div className="mx-auto max-w-7xl px-6 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
              <img src="/logo.png" alt="Nandeeka Logo" className="h-8 md:h-10 w-auto object-contain" />
            </Link>
            <p className="text-[13px] md:text-sm text-text-gray-muted leading-relaxed font-light max-w-md">
              Nandeeka Enterprises is a trusted real estate company based in Rohania, Varanasi — offering premium commercial and residential spaces built for modern living and business success. Discover transparent deals, prime locations, and a legacy of trust.
            </p>

            {/* Social Links Row */}
            <div className="flex items-center gap-3 pt-2">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/NandeekaEnterprisesPvtLtd"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-8 h-8 rounded-full border border-[#1877F2]/30 bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 hover:border-[#1877F2] flex items-center justify-center transition-all duration-500 hover:-translate-y-1 hover:scale-105 active:scale-95 shadow-md shadow-[#1877F2]/5"
                title="Facebook"
              >
                <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-[360deg]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/nandeekaenterprisespvtltd_"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-8 h-8 rounded-full border border-[#E1306C]/30 bg-[#E1306C]/10 text-[#E1306C] hover:bg-[#E1306C]/20 hover:border-[#E1306C] flex items-center justify-center transition-all duration-500 hover:-translate-y-1 hover:scale-105 active:scale-95 shadow-md shadow-[#E1306C]/5"
                title="Instagram"
              >
                <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-[360deg]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com/nandeekaepvtltd"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-8 h-8 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white flex items-center justify-center transition-all duration-500 hover:-translate-y-1 hover:scale-105 active:scale-95 shadow-md"
                title="X (Twitter)"
              >
                <svg className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-[360deg]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/nandeeka-enterprises-pvt-ltd"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-8 h-8 rounded-full border border-[#0A66C2]/30 bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 hover:border-[#0A66C2] flex items-center justify-center transition-all duration-500 hover:-translate-y-1 hover:scale-105 active:scale-95 shadow-md shadow-[#0A66C2]/5"
                title="LinkedIn"
              >
                <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-[360deg]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@NandeekaEnterprisesPvtLtd-b5z"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-8 h-8 rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 text-[#FF0000] hover:bg-[#FF0000]/20 hover:border-[#FF0000] flex items-center justify-center transition-all duration-500 hover:-translate-y-1 hover:scale-105 active:scale-95 shadow-md shadow-[#FF0000]/5"
                title="YouTube"
              >
                <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-[360deg]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-2 space-y-3.5">
            <span className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-widest block font-mono">Quick Links</span>
            <nav className="flex flex-col gap-2 font-light">
              <Link href="/" className="hover:text-gold-solid transition-colors">Home</Link>
              <Link href="/projects" className="hover:text-gold-solid transition-colors">Projects</Link>
              <Link href="/decoding-land" className="hover:text-gold-solid transition-colors">Decoding Land</Link>
              <Link href="/about-us" className="hover:text-gold-solid transition-colors">About Us</Link>
              <Link href="/governance" className="hover:text-gold-solid transition-colors">Governance</Link>
            </nav>
          </div>

          {/* Column 3: Contacts */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-widest block font-mono">Contact Details</span>
            <div className="space-y-3 font-light">
              <div className="flex items-start gap-2.5">
                <span className="text-gold-solid mt-0.5">📍</span>
                <span className="leading-relaxed">
                  2nd Floor, Survey No, 36 & 38, Rohaniya - DLW Road, Mauza, Gobindpur, Varanasi, Uttar Pradesh 221108
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-gold-solid">📞</span>
                <a href="tel:+919519662111" className="hover:text-gold-solid transition-colors">+91 95196 62111</a>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-gold-solid">✉️</span>
                <a href="mailto:info@nandeekaenterprises.com" className="hover:text-gold-solid transition-colors">info@nandeekaenterprises.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-8 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-[13px]">
          <p>© {new Date().getFullYear()} Nandeeka Enterprises. All rights reserved.</p>
          <p className="flex gap-6 font-light">
            <span className="hover:text-gold-solid cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gold-solid cursor-pointer transition-colors">Terms of Service</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
