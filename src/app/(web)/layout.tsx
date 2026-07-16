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
      <footer className="border-t border-white/5 bg-[#010314] py-16 text-xs md:text-sm text-text-gray-muted mt-auto z-10 relative">
        <div className="mx-auto max-w-7xl px-6 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 text-base font-extrabold tracking-wider text-white uppercase">
              <span className="h-2.5 w-2.5 rounded-full bg-gold-solid animate-pulse" />
              NANDEEKA ENTERPRISES
            </Link>
            <p className="text-xs text-text-gray-muted leading-relaxed font-light max-w-md">
              Nandeeka Enterprises is a trusted real estate company based in Rohania, Varanasi — offering premium commercial and residential spaces built for modern living and business success. Discover transparent deals, prime locations, and a legacy of trust.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest block font-mono">Quick Links</span>
            <nav className="flex flex-col gap-2 font-light">
              <Link href="/" className="hover:text-gold-solid transition-colors">Home</Link>
              <Link href="/projects" className="hover:text-gold-solid transition-colors">Developments</Link>
              <Link href="/decoding-land" className="hover:text-gold-solid transition-colors">Decoding Land</Link>
              <Link href="/about-us" className="hover:text-gold-solid transition-colors">About Us</Link>
            </nav>
          </div>

          {/* Column 3: Contacts */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest block font-mono">Contact Details</span>
            <div className="space-y-3 text-xs font-light">
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

        <div className="mx-auto max-w-7xl px-6 md:px-8 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
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
