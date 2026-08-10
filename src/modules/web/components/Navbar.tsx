"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useEnquiry } from "@/shared/context/EnquiryContext";
import { useTheme } from "@/shared/context/ThemeContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { openEnquiry } = useEnquiry();
  const { theme } = useTheme();

  const openDrawer = () => setIsOpen(!isOpen);

  const logoSrc = "/navbarlogo.png";

  return (
    <header className="absolute top-6 left-0 right-0 z-50 w-full bg-transparent h-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-full">
        <div className="flex h-full items-center justify-between px-3 md:px-6 py-2 rounded-full bg-dark-secondary/92 backdrop-blur-md border border-gold-solid/20 shadow-xl shadow-dark-secondary/20">
          {/* Logo */}
          <Link href="/" className="flex items-center transition-opacity hover:opacity-90 shrink-0" id="headerLogo">
            <img src={logoSrc} alt="Bhagyashree Logo" className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain" />
          </Link>

          {/* Navigation & CTA Controls */}
          <div className="flex items-center gap-2 lg:gap-6 xl:gap-10">
            {/* Desktop Links Menu */}
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 xl:gap-5 font-sans">
              <Link 
                href="/" 
                className={`text-[9px] lg:text-xs xl:text-sm font-semibold uppercase tracking-widest transition-all duration-300 px-2 lg:px-4 py-2 rounded-full border ${
                  pathname === "/" 
                    ? "bg-white/15 text-white border-white/20 font-bold" 
                    : "text-white/80 hover:text-white hover:bg-white/5 border-transparent"
                }`}
              >
                Home
              </Link>
              <Link 
                href="/projects" 
                className={`text-[9px] lg:text-xs xl:text-sm font-semibold uppercase tracking-widest transition-all duration-300 px-2 lg:px-4 py-2 rounded-full border ${
                  pathname === "/projects" 
                    ? "bg-white/15 text-white border-white/20 font-bold" 
                    : "text-white/80 hover:text-white hover:bg-white/5 border-transparent"
                }`}
              >
                Projects
              </Link>
              <div className="relative group py-1">
                <button 
                  className={`text-[9px] lg:text-xs xl:text-sm font-semibold uppercase tracking-widest transition-all duration-300 px-2 lg:px-4 py-2 rounded-full border flex items-center gap-1 cursor-pointer bg-transparent outline-none ${
                    pathname === "/about-us" || pathname === "/cmd" || pathname === "/about-us/team"
                      ? "bg-white/15 text-white border-white/20 font-bold" 
                      : "text-white/80 hover:text-white hover:bg-white/5 border-transparent"
                  }`}
                >
                  <span>About</span>
                  <span className="text-[7px] transition-transform duration-300 group-hover:rotate-180">▼</span>
                </button>
                
                {/* Dropdown Options */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-xl bg-dark-secondary/98 backdrop-blur-md border border-gold-solid/20 p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex flex-col gap-1">
                  <Link
                    href="/about-us"
                    className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors no-underline block ${
                      pathname === "/about-us"
                        ? "bg-white/15 text-white"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    About Us
                  </Link>
                  <Link
                    href="/about-us/team"
                    className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors no-underline block ${
                      pathname === "/about-us/team"
                        ? "bg-white/15 text-white"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Our Team
                  </Link>
                  <Link
                    href="/cmd"
                    className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors no-underline block ${
                      pathname === "/cmd"
                        ? "bg-white/15 text-white"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    CMD Message
                  </Link>
                </div>
              </div>
              <Link 
                href="/gallery" 
                className={`text-[9px] lg:text-xs xl:text-sm font-semibold uppercase tracking-widest transition-all duration-300 px-2 lg:px-4 py-2 rounded-full border ${
                  pathname === "/gallery" 
                    ? "bg-white/15 text-white border-white/20 font-bold" 
                    : "text-white/80 hover:text-white hover:bg-white/5 border-transparent"
                }`}
              >
                Gallery
              </Link>
              <div className="relative group py-1">
                <button 
                  className={`text-[9px] lg:text-xs xl:text-sm font-semibold uppercase tracking-widest transition-all duration-300 px-2 lg:px-4 py-2 rounded-full border flex items-center gap-1 cursor-pointer bg-transparent outline-none ${
                    pathname === "/amenities" || pathname === "/blogs" || pathname === "/governance"
                      ? "bg-white/15 text-white border-white/20 font-bold" 
                      : "text-white/80 hover:text-white hover:bg-white/5 border-transparent"
                  }`}
                >
                  <span>More</span>
                  <span className="text-[7px] transition-transform duration-300 group-hover:rotate-180">▼</span>
                </button>
                
                {/* Dropdown Options */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-xl bg-dark-secondary/98 backdrop-blur-md border border-gold-solid/20 p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex flex-col gap-1">
                  <Link
                    href="/amenities"
                    className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors no-underline block ${
                      pathname === "/amenities"
                        ? "bg-white/15 text-white"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Amenities
                  </Link>
                  <Link
                    href="/blogs"
                    className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors no-underline block ${
                      pathname === "/blogs"
                        ? "bg-white/15 text-white"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Blogs
                  </Link>
                  <Link
                    href="/governance"
                    className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors no-underline block ${
                      pathname === "/governance"
                        ? "bg-white/15 text-white"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Governance
                  </Link>
                </div>
              </div>
            </nav>

            {/* Contact Us CTA */}
            <button
              className="hidden sm:inline-block border border-gold-solid bg-gold-solid px-4 lg:px-8 py-2 md:py-2.5 text-[9px] lg:text-xs xl:text-sm font-bold uppercase tracking-widest text-dark-secondary transition-all hover:bg-gold-hover hover:border-gold-hover hover:text-white font-sans rounded-full shrink-0 shadow-md shadow-black/10"
              id="headerEnquireBtn"
              onClick={() => openEnquiry()}
            >
              Contact Us
            </button>

            {/* Hamburger Menu Button */}
            <button
              className="flex items-center justify-center w-6 h-6 hover:opacity-80 transition-opacity md:hidden"
              id="hamburgerOpen"
              onClick={openDrawer}
              aria-label="Toggle Menu"
            >
              <img src="/images/burgerMenu.svg" alt="Menu" className="w-6 h-6 object-contain invert" />
            </button>
          </div>
        </div>
        {/* Mobile Sub-Navbar Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-4 right-4 mt-3 z-50 rounded-2xl bg-dark-secondary/98 backdrop-blur-md border border-gold-solid/20 shadow-2xl p-4 md:hidden overflow-hidden animate-slide-down max-h-[80vh] overflow-y-auto">
            <nav className="flex flex-col gap-1.5 font-sans">
              <Link 
                onClick={() => setIsOpen(false)} 
                href="/" 
                className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                  pathname === "/" 
                    ? "bg-white/15 text-white border-white/20" 
                    : "text-white/80 border-transparent hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>Home</span>
                {pathname === "/" && <span className="w-1.5 h-1.5 rounded-full bg-gold-solid" />}
              </Link>
              
              <Link 
                onClick={() => setIsOpen(false)} 
                href="/projects" 
                className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                  pathname === "/projects" 
                    ? "bg-white/15 text-white border-white/20" 
                    : "text-white/80 border-transparent hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>Projects</span>
                {pathname === "/projects" && <span className="w-1.5 h-1.5 rounded-full bg-gold-solid" />}
              </Link>


              <Link 
                onClick={() => setIsOpen(false)} 
                href="/about-us" 
                className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                  pathname === "/about-us" 
                    ? "bg-white/15 text-white border-white/20" 
                    : "text-white/80 border-transparent hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>About Us</span>
                {pathname === "/about-us" && <span className="w-1.5 h-1.5 rounded-full bg-gold-solid" />}
              </Link>

              <Link 
                onClick={() => setIsOpen(false)} 
                href="/about-us/team" 
                className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                  pathname === "/about-us/team" 
                    ? "bg-white/15 text-white border-white/20" 
                    : "text-white/80 border-transparent hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>Our Team</span>
                {pathname === "/about-us/team" && <span className="w-1.5 h-1.5 rounded-full bg-gold-solid" />}
              </Link>

              <Link 
                onClick={() => setIsOpen(false)} 
                href="/cmd" 
                className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                  pathname === "/cmd" 
                    ? "bg-white/15 text-white border-white/20" 
                    : "text-white/80 border-transparent hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>CMD Message</span>
                {pathname === "/cmd" && <span className="w-1.5 h-1.5 rounded-full bg-gold-solid" />}
              </Link>

              <Link 
                onClick={() => setIsOpen(false)} 
                href="/blogs" 
                className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                  pathname === "/blogs" 
                    ? "bg-white/15 text-white border-white/20" 
                    : "text-white/80 border-transparent hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>Blogs</span>
                {pathname === "/blogs" && <span className="w-1.5 h-1.5 rounded-full bg-gold-solid" />}
              </Link>

              <Link 
                onClick={() => setIsOpen(false)} 
                href="/amenities" 
                className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                  pathname === "/amenities" 
                    ? "bg-white/15 text-white border-white/20" 
                    : "text-white/80 border-transparent hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>Amenities</span>
                {pathname === "/amenities" && <span className="w-1.5 h-1.5 rounded-full bg-gold-solid" />}
              </Link>

              <Link 
                onClick={() => setIsOpen(false)} 
                href="/gallery" 
                className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                  pathname === "/gallery" 
                    ? "bg-white/15 text-white border-white/20" 
                    : "text-white/80 border-transparent hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>Gallery</span>
                {pathname === "/gallery" && <span className="w-1.5 h-1.5 rounded-full bg-gold-solid" />}
              </Link>

              <Link 
                onClick={() => setIsOpen(false)} 
                href="/governance" 
                className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                  pathname === "/governance" 
                    ? "bg-white/15 text-white border-white/20" 
                    : "text-white/80 border-transparent hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>Governance</span>
                {pathname === "/governance" && <span className="w-1.5 h-1.5 rounded-full bg-gold-solid" />}
              </Link>

              <div className="pt-2 mt-2 border-t border-white/10">
                <button
                  onClick={() => { setIsOpen(false); openEnquiry(); }}
                  className="w-full text-center rounded-xl bg-gold-solid hover:bg-gold-hover py-3 text-xs font-extrabold uppercase tracking-widest text-dark-secondary hover:text-white transition-all duration-300"
                >
                  Enquire Now
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-1rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </header>
  );
}

