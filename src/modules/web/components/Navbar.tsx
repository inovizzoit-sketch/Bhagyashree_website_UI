"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useEnquiry } from "@/shared/context/EnquiryContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { openEnquiry } = useEnquiry();

  const openDrawer = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-50 w-full" style={{ background: 'var(--background)' }}>
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
            <div className="relative group py-1">
              <button 
                className={`text-xs lg:text-sm font-semibold uppercase tracking-widest transition-all duration-300 relative py-1 flex items-center gap-1 cursor-pointer bg-transparent border-0 outline-none p-0 ${
                  pathname === "/about-us" || pathname === "/cmd" || pathname === "/about-us/team"
                    ? "text-[#DDBD81]" 
                    : "text-[#8E90A2] hover:text-white"
                }`}
              >
                <span>About</span>
                <span className="text-[8px] transition-transform duration-300 group-hover:rotate-180">▼</span>
              </button>
              
              {/* Dropdown Options */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-xl bg-[#0a113a]/95 backdrop-blur-md border border-white/10 p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex flex-col gap-1">
                <Link
                  href="/about-us"
                  className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors no-underline block ${
                    pathname === "/about-us"
                      ? "bg-gold-solid/10 text-[#DDBD81]"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  About Us
                </Link>
                <Link
                  href="/about-us/team"
                  className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors no-underline block ${
                    pathname === "/about-us/team"
                      ? "bg-gold-solid/10 text-[#DDBD81]"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Our Team
                </Link>
                <Link
                  href="/cmd"
                  className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors no-underline block ${
                    pathname === "/cmd"
                      ? "bg-gold-solid/10 text-[#DDBD81]"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  CMD Message
                </Link>
              </div>
            </div>
            <Link 
              href="/gallery" 
              className={`text-xs lg:text-sm font-semibold uppercase tracking-widest transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#DDBD81] after:transition-all after:duration-300 ${
                pathname === "/gallery" 
                  ? "text-[#DDBD81] after:w-full" 
                  : "text-[#8E90A2] hover:text-white after:w-0 hover:after:w-full"
              }`}
            >
              Gallery
            </Link>
          </nav>

          {/* Contact Us CTA (Border Button) */}
          <button
            className="hidden sm:inline-block rounded-full border border-white/20 bg-transparent px-6 lg:px-8 py-2 md:py-2.5 text-xs lg:text-sm font-semibold uppercase tracking-widest text-white transition-all hover:bg-white/10 hover:border-white font-sans"
            id="headerEnquireBtn"
            onClick={() => openEnquiry()}
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
            className="relative w-full max-w-md h-full border-l border-border-muted p-8 flex flex-col justify-between overflow-y-auto shadow-2xl font-sans"
            style={{ background: 'var(--background)', animation: 'sidebarSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
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
                <Link 
                  onClick={() => setIsOpen(false)} 
                  href="/" 
                  className={`border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer no-underline text-lg font-medium transition-all duration-300 ${
                    pathname === "/" 
                      ? "text-[#DDBD81]" 
                      : "text-white hover:text-[#DDBD81]"
                  }`}
                >
                  <span className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                    {pathname === "/" && <span className="w-1.5 h-1.5 rounded-full bg-[#DDBD81]" />}
                    Home
                  </span>
                </Link>
                
                <Link 
                  onClick={() => setIsOpen(false)} 
                  href="/projects" 
                  className={`border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer no-underline text-lg font-medium transition-all duration-300 ${
                    pathname === "/projects" 
                      ? "text-[#DDBD81]" 
                      : "text-white hover:text-[#DDBD81]"
                  }`}
                >
                  <span className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                    {pathname === "/projects" && <span className="w-1.5 h-1.5 rounded-full bg-[#DDBD81]" />}
                    Partner With Us
                  </span>
                  <span className={`text-sm transition-transform duration-300 group-hover:translate-x-1 ${pathname === "/projects" ? "text-[#DDBD81]" : "text-[#8E90A2]"}`}>→</span>
                </Link>

                <Link 
                  onClick={() => setIsOpen(false)} 
                  href="/decoding-land" 
                  className={`border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer no-underline text-lg font-medium transition-all duration-300 ${
                    pathname === "/decoding-land" 
                      ? "text-[#DDBD81]" 
                      : "text-white hover:text-[#DDBD81]"
                  }`}
                >
                  <span className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                    {pathname === "/decoding-land" && <span className="w-1.5 h-1.5 rounded-full bg-[#DDBD81]" />}
                    Decoding Land
                  </span>
                  <span className={`text-sm transition-transform duration-300 group-hover:translate-x-1 ${pathname === "/decoding-land" ? "text-[#DDBD81]" : "text-[#8E90A2]"}`}>→</span>
                </Link>

                <Link 
                  onClick={() => setIsOpen(false)} 
                  href="/about-us" 
                  className={`border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer no-underline text-lg font-medium transition-all duration-300 ${
                    pathname === "/about-us" 
                      ? "text-[#DDBD81]" 
                      : "text-white hover:text-[#DDBD81]"
                  }`}
                >
                  <span className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                    {pathname === "/about-us" && <span className="w-1.5 h-1.5 rounded-full bg-[#DDBD81]" />}
                    About Us
                  </span>
                  <span className={`text-sm transition-transform duration-300 group-hover:translate-x-1 ${pathname === "/about-us" ? "text-[#DDBD81]" : "text-[#8E90A2]"}`}>→</span>
                </Link>

                <Link 
                  onClick={() => setIsOpen(false)} 
                  href="/about-us/team" 
                  className={`border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer no-underline text-lg font-medium transition-all duration-300 ${
                    pathname === "/about-us/team" 
                      ? "text-[#DDBD81]" 
                      : "text-white hover:text-[#DDBD81]"
                  }`}
                >
                  <span className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                    {pathname === "/about-us/team" && <span className="w-1.5 h-1.5 rounded-full bg-[#DDBD81]" />}
                    Our Team
                  </span>
                  <span className={`text-sm transition-transform duration-300 group-hover:translate-x-1 ${pathname === "/about-us/team" ? "text-[#DDBD81]" : "text-[#8E90A2]"}`}>→</span>
                </Link>

                <Link 
                  onClick={() => setIsOpen(false)} 
                  href="/cmd" 
                  className={`border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer no-underline text-lg font-medium transition-all duration-300 ${
                    pathname === "/cmd" 
                      ? "text-[#DDBD81]" 
                      : "text-white hover:text-[#DDBD81]"
                  }`}
                >
                  <span className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                    {pathname === "/cmd" && <span className="w-1.5 h-1.5 rounded-full bg-[#DDBD81]" />}
                    CMD Message
                  </span>
                  <span className={`text-sm transition-transform duration-300 group-hover:translate-x-1 ${pathname === "/cmd" ? "text-[#DDBD81]" : "text-[#8E90A2]"}`}>→</span>
                </Link>

                <Link 
                  onClick={() => setIsOpen(false)} 
                  href="/blogs" 
                  className={`border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer no-underline text-lg font-medium transition-all duration-300 ${
                    pathname === "/blogs" 
                      ? "text-[#DDBD81]" 
                      : "text-white hover:text-[#DDBD81]"
                  }`}
                >
                  <span className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                    {pathname === "/blogs" && <span className="w-1.5 h-1.5 rounded-full bg-[#DDBD81]" />}
                    Blogs
                  </span>
                  <span className={`text-sm transition-transform duration-300 group-hover:translate-x-1 ${pathname === "/blogs" ? "text-[#DDBD81]" : "text-[#8E90A2]"}`}>→</span>
                </Link>

                <Link 
                  onClick={() => setIsOpen(false)} 
                  href="/amenities" 
                  className={`border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer no-underline text-lg font-medium transition-all duration-300 ${
                    pathname === "/amenities" 
                      ? "text-[#DDBD81]" 
                      : "text-white hover:text-[#DDBD81]"
                  }`}
                >
                  <span className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                    {pathname === "/amenities" && <span className="w-1.5 h-1.5 rounded-full bg-[#DDBD81]" />}
                    Amenities
                  </span>
                  <span className={`text-sm transition-transform duration-300 group-hover:translate-x-1 ${pathname === "/amenities" ? "text-[#DDBD81]" : "text-[#8E90A2]"}`}>→</span>
                </Link>

                <Link 
                  onClick={() => setIsOpen(false)} 
                  href="/gallery" 
                  className={`border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer no-underline text-lg font-medium transition-all duration-300 ${
                    pathname === "/gallery" 
                      ? "text-[#DDBD81]" 
                      : "text-white hover:text-[#DDBD81]"
                  }`}
                >
                  <span className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                    {pathname === "/gallery" && <span className="w-1.5 h-1.5 rounded-full bg-[#DDBD81]" />}
                    Gallery
                  </span>
                  <span className={`text-sm transition-transform duration-300 group-hover:translate-x-1 ${pathname === "/gallery" ? "text-[#DDBD81]" : "text-[#8E90A2]"}`}>→</span>
                </Link>

                <Link 
                  onClick={() => setIsOpen(false)} 
                  href="/governance" 
                  className={`border-b border-white/5 py-5 flex items-center justify-between group cursor-pointer no-underline text-lg font-medium transition-all duration-300 ${
                    pathname === "/governance" 
                      ? "text-[#DDBD81]" 
                      : "text-white hover:text-[#DDBD81]"
                  }`}
                >
                  <span className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                    {pathname === "/governance" && <span className="w-1.5 h-1.5 rounded-full bg-[#DDBD81]" />}
                    Governance
                  </span>
                  <span className={`text-sm transition-transform duration-300 group-hover:translate-x-1 ${pathname === "/governance" ? "text-[#DDBD81]" : "text-[#8E90A2]"}`}>→</span>
                </Link>
              </nav>
            </div>

            {/* Footer / Connect Details */}
            <div className="pt-8 flex flex-col gap-4">
              <button
                onClick={() => { setIsOpen(false); openEnquiry(); }}
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

