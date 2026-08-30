"use client";

// src/modules/web/components/Footer.tsx

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/shared/lib/api-config";
import { useTheme } from "@/shared/context/ThemeContext";

interface FooterSettings {
  logoUrl?: string;
  bottomLogoUrl?: string;
  companyName: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  copyrightText?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  isActive: boolean;
}

interface FooterLink {
  id: string;
  title: string;
  url: string;
  openInNewTab: boolean;
  sortOrder: number;
  isActive: boolean;
}

interface FooterSocial {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

// Fallback hardcoded data in case API fails or is loading
const defaultSettings: FooterSettings = {
  companyName: "BhagyaShree Real Estate",
  description: "Bhagya Shree Real Estate is a trusted real estate company based in Mirzapur, Varanasi — offering premium commercial and residential spaces built for modern living and business success. Discover transparent deals, prime locations, and a legacy of trust.",
  address: "Bathua Gandhi Ghat, Mirzapur, Uttar Pradesh 221108",
  phone: "+91 7007587406",
  email: "bhagyashreerealestate1@gmail.com",
  copyrightText: "Bhagya Shree Real Estate. All rights reserved.",
  privacyPolicyUrl: "",
  termsOfServiceUrl: "",
  isActive: true,
};

const defaultLinks: FooterLink[] = [
  { id: "1", title: "Home", url: "/", openInNewTab: false, sortOrder: 1, isActive: true },
  { id: "2", title: "Projects", url: "/projects", openInNewTab: false, sortOrder: 2, isActive: true },
  // { id: "3", title: "Decoding Land", url: "/decoding-land", openInNewTab: false, sortOrder: 3, isActive: true },
  { id: "4", title: "About Us", url: "/about-us", openInNewTab: false, sortOrder: 4, isActive: true },
  // { id: "5", title: "Governance", url: "/governance", openInNewTab: false, sortOrder: 5, isActive: true },
];

const defaultSocials: FooterSocial[] = [
  { id: "1", platform: "Facebook", url: "https://www.facebook.com/BhagyashreeEnterprisesPvtLtd", icon: "facebook", sortOrder: 1, isActive: true },
  { id: "2", platform: "Instagram", url: "https://www.instagram.com/bhagyashreeenterprisespvtltd_", icon: "instagram", sortOrder: 2, isActive: true },
  { id: "3", platform: "X", url: "https://x.com/bhagyashreeepvtltd", icon: "x", sortOrder: 3, isActive: true },
  { id: "4", platform: "LinkedIn", url: "https://www.linkedin.com/company/bhagyashree-enterprises-pvt-ltd", icon: "linkedin", sortOrder: 4, isActive: true },
  { id: "5", platform: "YouTube", url: "https://www.youtube.com/@BhagyashreeEnterprisesPvtLtd-b5z", icon: "youtube", sortOrder: 5, isActive: true },
];

export default function Footer() {
  const { theme } = useTheme();
  const [settings, setSettings] = useState<FooterSettings>(defaultSettings);
  const [links, setLinks] = useState<FooterLink[]>(defaultLinks);
  const [socials, setSocials] = useState<FooterSocial[]>(defaultSocials);

  useEffect(() => {
    let active = true;

    fetch(`${API_BASE_URL}/footer`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load footer");
        return r.json();
      })
      .then((data) => {
        if (active && data) {
          if (data.settings && data.settings.isActive !== false) {
            setSettings(data.settings);
          }
          if (Array.isArray(data.links) && data.links.length > 0) {
            setLinks(data.links);
          }
          if (Array.isArray(data.socials) && data.socials.length > 0) {
            setSocials(data.socials);
          }
        }
      })
      .catch((err) => {
        console.warn("Using default static footer config:", err.message);
      });

    return () => {
      active = false;
    };
  }, []);

  const getSocialConfig = (platform: string, iconKey?: string) => {
    const key = (iconKey || platform || "").toLowerCase();

    if (key.includes("facebook")) {
      return {
        title: "Facebook",
        borderColor: "border-[#1877F2]/30",
        bgColor: "bg-[#1877F2]/10 hover:bg-[#1877F2]/20 hover:border-[#1877F2]",
        textColor: "text-[#1877F2]",
        shadowColor: "shadow-[#1877F2]/5",
        svg: (
          <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-[360deg]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
          </svg>
        )
      };
    }

    if (key.includes("instagram")) {
      return {
        title: "Instagram",
        borderColor: "border-[#E1306C]/30",
        bgColor: "bg-[#E1306C]/10 hover:bg-[#E1306C]/20 hover:border-[#E1306C]",
        textColor: "text-[#E1306C]",
        shadowColor: "shadow-[#E1306C]/5",
        svg: (
          <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-[360deg]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        )
      };
    }

    if (key.includes("twitter") || key === "x") {
      return {
        title: "X (Twitter)",
        borderColor: "border-slate-300 dark:border-white/20",
        bgColor: "bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 hover:border-slate-400 dark:hover:border-white",
        textColor: "text-slate-800 dark:text-white",
        shadowColor: "",
        svg: (
          <svg className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-[360deg]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        )
      };
    }

    if (key.includes("linkedin")) {
      return {
        title: "LinkedIn",
        borderColor: "border-[#0A66C2]/30",
        bgColor: "bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]",
        textColor: "text-[#0A66C2]",
        shadowColor: "shadow-[#0A66C2]/5",
        svg: (
          <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-[360deg]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        )
      };
    }

    if (key.includes("youtube")) {
      return {
        title: "YouTube",
        borderColor: "border-[#FF0000]/30",
        bgColor: "bg-[#FF0000]/10 hover:bg-[#FF0000]/20 hover:border-[#FF0000]",
        textColor: "text-[#FF0000]",
        shadowColor: "shadow-[#FF0000]/5",
        svg: (
          <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-[360deg]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        )
      };
    }

    return {
      title: platform,
      borderColor: "border-slate-300 dark:border-white/20",
      bgColor: "bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 hover:border-slate-400 dark:hover:border-white",
      textColor: "text-slate-800 dark:text-white",
      shadowColor: "",
      svg: (
        <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-[360deg]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    };
  };

  const formatUrl = (url: string) => {
    if (!url) return "/";
    const trimmed = url.trim();

    // Check if it's already a full protocol URL or local path
    if (
      trimmed.startsWith("/") ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("mailto:") ||
      trimmed.startsWith("tel:")
    ) {
      return trimmed;
    }

    // Check if it looks like an external host (e.g. google.com, localhost:3000)
    if (trimmed.includes(".") || trimmed.includes("localhost:") || trimmed === "localhost") {
      return `http://${trimmed}`;
    }

    // Default to relative local path
    return `/${trimmed}`;
  };

  return (
    <footer
      className="bg-[#1A150C] border-t border-[#D4AF37]/30 py-14 md:py-16 text-[13px] md:text-sm text-slate-300 mt-auto z-10 relative font-sans"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8 grid grid-cols-1 md:grid-cols-9 gap-8 lg:gap-10">
        {/* Column 1: Brand Info */}
        <div className="md:col-span-4 space-y-4">
          <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
            <img
              src="/logo.png"
              alt={`${settings.companyName} Logo`}
              className="h-12 md:h-14 w-auto object-contain brightness-110"
            />
          </Link>
          {settings.description && (
            <p className="text-[12px] md:text-xs text-slate-300 leading-relaxed font-light">
              {settings.description}
            </p>
          )}

          {/* Social Links Row */}
          {socials.length > 0 && (
            <div className="flex items-center gap-2.5 pt-1">
              {socials.map((social) => {
                const config = getSocialConfig(social.platform, social.icon);
                return (
                  <a
                    key={social.id}
                    href={formatUrl(social.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-8 h-8 rounded-full border border-[#D4AF37]/40 bg-[#2C2208] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A150C] flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 shadow-md shadow-black/40"
                    title={config.title}
                  >
                    {config.svg}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Column 2: Navigation Links */}
        <div className="md:col-span-2 space-y-3.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest block text-[#D4AF37]">Quick Links</span>
          <nav className="flex flex-col gap-2 font-light text-xs">
            {links.map((link) => {
              const formattedUrl = formatUrl(link.url);
              const isExternal = formattedUrl.startsWith("http://") || formattedUrl.startsWith("https://");

              if (isExternal) {
                return (
                  <a
                    key={link.id}
                    href={formattedUrl}
                    target={link.openInNewTab ? "_blank" : undefined}
                    rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                    className="text-slate-300 hover:text-[#D4AF37] transition-colors"
                  >
                    {link.title}
                  </a>
                );
              }

              return (
                <Link
                  key={link.id}
                  href={formattedUrl}
                  target={link.openInNewTab ? "_blank" : undefined}
                  rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                  className="text-slate-300 hover:text-[#D4AF37] transition-colors"
                >
                  {link.title}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Column 3: Contacts */}
        <div className="md:col-span-3 space-y-3.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest block text-[#D4AF37]">Contact Details</span>
          <div className="space-y-2.5 font-light text-xs">
            {settings.address && (
              <div className="flex items-start gap-2">
                <span className="text-[#D4AF37] mt-0.5">📍</span>
                <span className="leading-relaxed text-slate-300">
                  {settings.address}
                </span>
              </div>
            )}
            {settings.phone && (
              <div className="flex items-center gap-2">
                <span className="text-[#D4AF37]">📞</span>
                <a href={`tel:${settings.phone.split(',')[0].replace(/\s+/g, "")}`} className="text-slate-300 hover:text-[#D4AF37] transition-colors">
                  {settings.phone}
                </a>
              </div>
            )}
            {settings.email && (
              <div className="flex items-center gap-2">
                <span className="text-[#D4AF37]">✉️</span>
                <a href={`mailto:${settings.email}`} className="text-slate-300 hover:text-[#D4AF37] transition-colors">
                  {settings.email}
                </a>
              </div>
            )}
          </div>
        </div>


      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>© {new Date().getFullYear()} {settings.companyName || "Bhagya Shree Real Estate"}. All rights reserved.</p>
      </div>
    </footer>
  );
}
