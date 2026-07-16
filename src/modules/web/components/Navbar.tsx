"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Fallback handlers if EnquiryContext is not wrapped/present yet
  const openModal = () => alert("Enquiry modal triggered");
  const openDrawer = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#020520]">
      <div className="mx-auto flex max-w-7xl h-16 md:h-20 items-center justify-between px-6 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center transition-opacity hover:opacity-90" id="headerLogo">
          <img src="/logo.png" alt="Nandeeka Logo" className="h-8 sm:h-10 md:h-12 w-auto object-contain" />
        </Link>

        {/* Navigation & CTA Controls */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-10">
          {/* Desktop Links Menu */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10 font-sans">
            <Link 
              href="/" 
              className={`text-xs lg:text-sm font-semibold uppercase tracking-widest transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#DDBD81] after:transition-all after:duration-300 ${
                pathname === "/" 
                  ? "text-[#DDBD81] after:w-full" 
                  : "text-[#8E90A2] hover:text-white after:w-0 hover:after:w-full"
              }`}
            >
              Home
            </Link>
            <Link 
              href="/projects" 
              className={`text-xs lg:text-sm font-semibold uppercase tracking-widest transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#DDBD81] after:transition-all after:duration-300 ${
                pathname === "/projects" 
                  ? "text-[#DDBD81] after:w-full" 
                  : "text-[#8E90A2] hover:text-white after:w-0 hover:after:w-full"
              }`}
            >
              Projects
            </Link>
            <Link 
              href="/decoding-land" 
              className={`text-xs lg:text-sm font-semibold uppercase tracking-widest transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#DDBD81] after:transition-all after:duration-300 ${
                pathname === "/decoding-land" 
                  ? "text-[#DDBD81] after:w-full" 
                  : "text-[#8E90A2] hover:text-white after:w-0 hover:after:w-full"
              }`}
            >
              Decoding Land
            </Link>
            <Link 
              href="/about-us" 
              className={`text-xs lg:text-sm font-semibold uppercase tracking-widest transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#DDBD81] after:transition-all after:duration-300 ${
                pathname === "/about-us" 
                  ? "text-[#DDBD81] after:w-full" 
                  : "text-[#8E90A2] hover:text-white after:w-0 hover:after:w-full"
              }`}
            >
              About Us
            </Link>
          </nav>

          {/* Contact Us CTA (Border Button) */}
          <button
            className="hidden sm:inline-block rounded-full border border-white/20 bg-transparent px-6 lg:px-8 py-2 md:py-2.5 text-xs lg:text-sm font-semibold uppercase tracking-widest text-white transition-all hover:bg-white/10 hover:border-white font-sans"
            id="headerEnquireBtn"
            onClick={() => openModal()}
          >
            Contact Us
          </button>

          {/* Hamburger Menu Button */}
          <button
            className="flex items-center justify-center w-6 h-6 hover:opacity-80 transition-opacity"
            id="hamburgerOpen"
            onClick={openDrawer}
            aria-label="Toggle Menu"
          >
            <img src="/images/burgerMenu.svg" alt="Menu" className="w-6 h-6 object-contain brightness-0 invert" />
          </button>
        </div>
      </div>

      {/* Full-Screen Luxury Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-md" style={{ animation: 'backdropFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
          {/* Backdrop Click Closer */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          {/* Sidebar Panel */}
          <div 
            className="relative w-full max-w-md h-full bg-[#0d0d17] border-l border-border-muted p-8 flex flex-col justify-between overflow-y-auto shadow-2xl font-sans"
            style={{ animation: 'sidebarSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <div>
              {/* Header Close Button */}
              <div className="flex justify-end mb-10">
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-10 w-10 flex items-center justify-center text-[#8E90A2] hover:text-white transition-all hover:rotate-90 duration-300"
                  aria-label="Close menu"
                >
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Items (Matching Image Style) */}
              <nav className="flex flex-col">
                <div className="border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer">
                  <Link onClick={() => setIsOpen(false)} href="/" className="text-lg font-medium text-white group-hover:text-[#DDBD81] transition-all duration-300 group-hover:translate-x-2">
                    Home
                  </Link>
                </div>
                
                <div className="border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer">
                  <Link onClick={() => setIsOpen(false)} href="/projects" className="text-lg font-medium text-[#DDBD81] group-hover:text-white transition-all duration-300 group-hover:translate-x-2">
                    Partner With Us
                  </Link>
                  <span className="text-[#8E90A2] text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>

                <div className="border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer">
                  <Link onClick={() => setIsOpen(false)} href="/decoding-land" className="text-lg font-medium text-white group-hover:text-[#DDBD81] transition-all duration-300 group-hover:translate-x-2">
                    Decoding Land
                  </Link>
                  <span className="text-[#8E90A2] text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>

                <div className="border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer">
                  <Link onClick={() => setIsOpen(false)} href="/about-us" className="text-lg font-medium text-white group-hover:text-[#DDBD81] transition-all duration-300 group-hover:translate-x-2">
                    Sustainability & Impact
                  </Link>
                  <span className="text-[#8E90A2] text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>

                <div className="border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer">
                  <Link onClick={() => setIsOpen(false)} href="/decoding-land" className="text-lg font-medium text-white group-hover:text-[#DDBD81] transition-all duration-300 group-hover:translate-x-2">
                    Blogs
                  </Link>
                  <span className="text-[#8E90A2] text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>

                <div className="border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer">
                  <Link onClick={() => setIsOpen(false)} href="/projects" className="text-lg font-medium text-white group-hover:text-[#DDBD81] transition-all duration-300 group-hover:translate-x-2">
                    Amenities
                  </Link>
                  <span className="text-[#8E90A2] text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>

                <div className="border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer">
                  <Link onClick={() => setIsOpen(false)} href="/about-us" className="text-lg font-medium text-white group-hover:text-[#DDBD81] transition-all duration-300 group-hover:translate-x-2">
                    Governance
                  </Link>
                  <span className="text-[#8E90A2] text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </nav>
            </div>

            {/* Footer / Connect Details */}
            <div className="pt-8 flex flex-col gap-4">
              <button
                onClick={() => { setIsOpen(false); openModal(); }}
                className="w-full text-center rounded-full bg-gold-solid py-4 text-xs font-bold uppercase tracking-widest text-dark-primary hover:bg-gold-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes backdropFade {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(12px); }
        }
        @keyframes sidebarSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </header>
  );
}

