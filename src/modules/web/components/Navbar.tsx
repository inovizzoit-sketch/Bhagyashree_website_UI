"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useEnquiry } from "@/shared/context/EnquiryContext";
import { useTheme } from "@/shared/context/ThemeContext";
import { API_BASE_URL } from "@/shared/lib/api-config";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { openEnquiry } = useEnquiry();
  const { theme } = useTheme();

  const [email, setEmail] = useState("bhagyashreeenterprises@gmail.com");
  const [phone, setPhone] = useState("+91 9198176509");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/footer`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (data?.settings) {
          if (data.settings.email) setEmail(data.settings.email);
          if (data.settings.phone) setPhone(data.settings.phone);
        }
      })
      .catch(() => {});
  }, []);

  const openDrawer = () => setIsOpen(!isOpen);

  const logoSrc = "/navbarlogo.png";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#1A150C]/95 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-2xl transition-all duration-300">
      {/* Top Header Contact Bar (Full Width Edge-to-Edge) - Smoothly hides on scroll */}
      <div className={`w-full bg-[#0D0A06]/90 border-[#D4AF37]/20 px-4 sm:px-8 text-xs text-slate-200 transition-all duration-300 overflow-hidden ${
        scrolled 
          ? "max-h-0 opacity-0 py-0 border-b-0 pointer-events-none" 
          : "max-h-12 opacity-100 py-1.5 border-b"
      }`}>
        <div className="w-full flex items-center justify-between flex-wrap gap-2">
          {/* Email and Phone Buttons -> Click opens Enquiry Modal */}
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
            <button
              onClick={() => openEnquiry()}
              className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-200 hover:text-[#D4AF37] transition-colors cursor-pointer group bg-transparent border-none p-0 outline-none"
              title="Click to Enquire Now"
            >
              <span className="text-[#D4AF37] group-hover:scale-110 transition-transform">✉</span>
              <span className="underline-offset-2 group-hover:underline font-medium">{email}</span>
            </button>

            <span className="hidden sm:inline text-white/20">|</span>

            <button
              onClick={() => openEnquiry()}
              className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-200 hover:text-[#D4AF37] transition-colors cursor-pointer group bg-transparent border-none p-0 outline-none"
              title="Click to Enquire Now"
            >
              <span className="text-[#D4AF37] group-hover:scale-110 transition-transform">📱</span>
              <span className="underline-offset-2 group-hover:underline font-medium">{phone}</span>
            </button>
          </div>

          {/* Top Bar Quick Action */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => openEnquiry("Book an Appointment")}
              className="flex items-center gap-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#997A15] hover:from-[#EADBB4] hover:to-[#D4AF37] text-[#1A150C] px-4 py-1.5 rounded-full transition-all duration-300 shadow-md shadow-[#D4AF37]/25 hover:shadow-lg hover:shadow-[#D4AF37]/40 hover:scale-105 active:scale-95 cursor-pointer border border-[#EADBB4]/60"
            >
             
              <span>Book an Appointment</span>
              <span className="text-[10px] font-bold">➔</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar (Full Width Edge-to-Edge) */}
      <div className="w-full flex h-16 sm:h-20 items-center justify-between px-4 sm:px-8 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center transition-opacity hover:opacity-90 shrink-0" id="headerLogo">
          <img src={logoSrc} alt="Bhagyashree Logo" className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain brightness-110" />
        </Link>

        {/* Navigation & CTA Controls */}
        <div className="flex items-center gap-2 lg:gap-6 xl:gap-8">
          {/* Desktop Links Menu */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2.5 xl:gap-4 font-sans">
            <Link 
              href="/" 
              className={`text-[9px] lg:text-xs xl:text-sm font-semibold uppercase tracking-widest transition-all duration-300 px-3 lg:px-4 py-2 rounded-full border ${
                pathname === "/" 
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40 font-extrabold shadow-sm" 
                  : "text-slate-200 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 border-transparent"
              }`}
            >
              Home
            </Link>
            <Link 
              href="/projects" 
              className={`text-[9px] lg:text-xs xl:text-sm font-semibold uppercase tracking-widest transition-all duration-300 px-3 lg:px-4 py-2 rounded-full border ${
                pathname === "/projects" 
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40 font-extrabold shadow-sm" 
                  : "text-slate-200 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 border-transparent"
              }`}
            >
              Projects
            </Link>
            <div className="relative group py-1">
              <button 
                className={`text-[9px] lg:text-xs xl:text-sm font-semibold uppercase tracking-widest transition-all duration-300 px-3 lg:px-4 py-2 rounded-full border flex items-center gap-1 cursor-pointer bg-transparent outline-none ${
                  pathname === "/about-us" || pathname === "/about-us/team"
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40 font-extrabold shadow-sm" 
                    : "text-slate-200 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 border-transparent"
                }`}
              >
                <span>About</span>
                <span className="text-[7px] text-[#D4AF37] transition-transform duration-300 group-hover:rotate-180">▼</span>
              </button>
              
              {/* Dropdown Options */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-2xl bg-[#1A150C]/98 backdrop-blur-md border border-[#D4AF37]/30 p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex flex-col gap-1">
                <Link
                  href="/about-us"
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors no-underline block ${
                    pathname === "/about-us"
                      ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                      : "text-slate-200 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                  }`}
                >
                  About Us
                </Link>
                <Link
                  href="/about-us/team"
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors no-underline block ${
                    pathname === "/about-us/team"
                      ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                      : "text-slate-200 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                  }`}
                >
                  Our Team
                </Link>
              </div>
            </div>
            <Link 
              href="/gallery" 
              className={`text-[9px] lg:text-xs xl:text-sm font-semibold uppercase tracking-widest transition-all duration-300 px-3 lg:px-4 py-2 rounded-full border ${
                pathname === "/gallery" 
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40 font-extrabold shadow-sm" 
                  : "text-slate-200 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 border-transparent"
              }`}
            >
              Gallery
            </Link>
            <div className="relative group py-1">
              <button 
                className={`text-[9px] lg:text-xs xl:text-sm font-semibold uppercase tracking-widest transition-all duration-300 px-3 lg:px-4 py-2 rounded-full border flex items-center gap-1 cursor-pointer bg-transparent outline-none ${
                  pathname === "/amenities" || pathname === "/blogs" || pathname === "/governance"
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40 font-extrabold shadow-sm" 
                    : "text-slate-200 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 border-transparent"
                }`}
              >
                <span>More</span>
                <span className="text-[7px] text-[#D4AF37] transition-transform duration-300 group-hover:rotate-180">▼</span>
              </button>
              
              {/* Dropdown Options */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-2xl bg-[#1A150C]/98 backdrop-blur-md border border-[#D4AF37]/30 p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex flex-col gap-1">
                <Link
                  href="/amenities"
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors no-underline block ${
                    pathname === "/amenities"
                      ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                      : "text-slate-200 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                  }`}
                >
                  Amenities
                </Link>
                <Link
                  href="/blogs"
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors no-underline block ${
                    pathname === "/blogs"
                      ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                      : "text-slate-200 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                  }`}
                >
                  Blogs
                </Link>
                <Link
                  href="/governance"
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors no-underline block ${
                    pathname === "/governance"
                      ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                      : "text-slate-200 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                  }`}
                >
                  Governance
                </Link>
              </div>
            </div>
          </nav>

          {/* Contact Us CTA */}
          <button
            className="hidden sm:inline-block bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#997A15] hover:from-[#EADBB4] hover:to-[#D4AF37] px-5 lg:px-7 py-2 md:py-2.5 text-[9px] lg:text-xs xl:text-sm font-extrabold uppercase tracking-widest text-[#1A150C] hover:text-[#1A150C] font-sans rounded-full shrink-0 shadow-lg shadow-[#D4AF37]/20 hover:scale-105 transition-all duration-300 cursor-pointer border-none min-h-[40px]"
            id="headerEnquireBtn"
            onClick={() => openEnquiry()}
          >
              Contact Us
          </button>

          {/* Hamburger Menu Button */}
          <button
            className="flex items-center justify-center w-8 h-8 hover:opacity-80 transition-opacity md:hidden cursor-pointer bg-transparent border-none"
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
        <div className="w-full bg-[#1A150C]/98 backdrop-blur-md border-t border-[#D4AF37]/30 shadow-2xl p-4 md:hidden overflow-hidden animate-slide-down max-h-[80vh] overflow-y-auto">
          {/* Mobile Top Contact Info */}
          <div className="pb-3 mb-3 border-b border-white/10 flex flex-col gap-2 text-xs">
            <button
              onClick={() => { setIsOpen(false); openEnquiry(); }}
              className="flex items-center gap-2 text-slate-200 hover:text-[#D4AF37] transition-colors text-left bg-transparent border-none p-0 outline-none"
            >
              <span className="text-[#D4AF37]">✉</span>
              <span className="truncate">{email}</span>
            </button>
            <button
              onClick={() => { setIsOpen(false); openEnquiry(); }}
              className="flex items-center gap-2 text-slate-200 hover:text-[#D4AF37] transition-colors text-left bg-transparent border-none p-0 outline-none"
            >
              <span className="text-[#D4AF37]">📱</span>
              <span>{phone}</span>
            </button>
          </div>

          <nav className="flex flex-col gap-1.5 font-sans">
            <Link 
              onClick={() => setIsOpen(false)} 
              href="/" 
              className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                pathname === "/" 
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40" 
                  : "text-slate-200 border-transparent hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
              }`}
            >
              <span>Home</span>
              {pathname === "/" && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
            </Link>
            
            <Link 
              onClick={() => setIsOpen(false)} 
              href="/projects" 
              className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                pathname === "/projects" 
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40" 
                  : "text-slate-200 border-transparent hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
              }`}
            >
              <span>Projects</span>
              {pathname === "/projects" && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
            </Link>

            <Link 
              onClick={() => setIsOpen(false)} 
              href="/about-us" 
              className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                pathname === "/about-us" 
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40" 
                  : "text-slate-200 border-transparent hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
              }`}
            >
              <span>About Us</span>
              {pathname === "/about-us" && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
            </Link>

            <Link 
              onClick={() => setIsOpen(false)} 
              href="/about-us/team" 
              className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                pathname === "/about-us/team" 
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40" 
                  : "text-slate-200 border-transparent hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
              }`}
            >
              <span>Our Team</span>
              {pathname === "/about-us/team" && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
            </Link>

            <Link 
              onClick={() => setIsOpen(false)} 
              href="/blogs" 
              className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                pathname === "/blogs" 
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40" 
                  : "text-slate-200 border-transparent hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
              }`}
            >
              <span>Blogs</span>
              {pathname === "/blogs" && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
            </Link>

            <Link 
              onClick={() => setIsOpen(false)} 
              href="/amenities" 
              className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                pathname === "/amenities" 
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40" 
                  : "text-slate-200 border-transparent hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
              }`}
            >
              <span>Amenities</span>
              {pathname === "/amenities" && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
            </Link>

            <Link 
              onClick={() => setIsOpen(false)} 
              href="/gallery" 
              className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                pathname === "/gallery" 
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40" 
                  : "text-slate-200 border-transparent hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
              }`}
            >
              <span>Gallery</span>
              {pathname === "/gallery" && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
            </Link>

            <Link 
              onClick={() => setIsOpen(false)} 
              href="/governance" 
              className={`px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between no-underline text-xs font-bold uppercase tracking-wider ${
                pathname === "/governance" 
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40" 
                  : "text-slate-200 border-transparent hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
              }`}
            >
              <span>Governance</span>
              {pathname === "/governance" && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
            </Link>

            <div className="pt-3 mt-2 border-t border-white/10">
              <button
                onClick={() => { setIsOpen(false); openEnquiry(); }}
                className="w-full text-center rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#997A15] py-3 text-xs font-extrabold uppercase tracking-widest text-[#1A150C] transition-all duration-300 cursor-pointer border-none shadow-md"
              >
                Enquire Now
              </button>
            </div>
          </nav>
        </div>
      )}

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
