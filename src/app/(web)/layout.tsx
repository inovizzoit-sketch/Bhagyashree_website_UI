import type { Metadata } from "next";
import Navbar from "@/modules/web/components/Navbar";
import AnnouncementPopup from "@/modules/web/components/AnnouncementPopup";
import Footer from "@/modules/web/components/Footer";
import ScrollToTop from "@/modules/web/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Bhagyashree — Timeless Luxury Spaces",
  description: "Official website of BHAGYASHREE ENTERPRISES.",
};

function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "BHAGYASHREE ENTERPRISES",
    "url": "https://www.bhagyashreeenterprises.com",
    "logo": "https://www.bhagyashreeenterprises.com/logo.png",
    "description": "BHAGYASHREE ENTERPRISES offers premium plotted land layouts in Mirzapur with clear titles and complete infrastructure.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Varanasi",
      "addressRegion": "Uttar Pradesh",
      "addressCountry": "IN"
    },
    "areaServed": "Mirzapur",
    "telephone": "+91-XXXXXXXXXX",
    "sameAs": [
      "https://www.instagram.com/bhagyashreeenterprises",
      "https://www.facebook.com/bhagyashreeenterprises"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

import { API_BASE_URL } from "@/shared/lib/api-config";

function getGoogleFontsUrl(headingFont?: string, bodyFont?: string) {
  const families: string[] = [];
  if (headingFont) families.push(`family=${headingFont.replace(/\s+/g, "+")}:wght@300;400;500;600;700`);
  if (bodyFont && bodyFont !== headingFont) families.push(`family=${bodyFont.replace(/\s+/g, "+")}:wght@300;400;500;600;700`);
  if (families.length === 0) return null;
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

function sanitizeCSSValue(val: string): string {
  if (!val) return "";
  let clean = String(val).trim();
  if (
    (clean.startsWith("linear-gradient(") || clean.startsWith("radial-gradient(")) &&
    !clean.endsWith(")")
  ) {
    return clean + ")";
  }
  return clean;
}

export default async function WebLayout({ children }: { children: React.ReactNode }) {
  const theme: any = null;

  const cssVars = theme
    ? {
        "--background":
          theme.colors?.background === "#020520" || !theme.colors?.background
            ? "linear-gradient(90deg, rgba(7, 32, 61, 1) 0%, rgb(6, 6, 51) 100%)"
            : theme.colors.background,
        "--foreground": theme.colors?.textPrimary || "#FFFFFF",
        "--dark-primary": theme.colors?.secondary || "#0a146f",
        "--dark-secondary": theme.colors?.secondary || "#002244",
        "--gold-solid": theme.colors?.primary || "#DDBD81",
        "--gold-hover": theme.colors?.accent || "#C5A267",
        "--gold-dark": theme.colors?.accent || "#AC8336",
        "--text-white": theme.colors?.textPrimary || "#FFFFFF",
        "--text-gray-light": theme.colors?.textMuted || "#E4E4E7",
        "--text-gray-muted": theme.colors?.textMuted || "#8E90A2",
        "--border-color": theme.colors?.border || "#3F404D",
        "--border-muted": theme.colors?.border || "rgba(255, 255, 255, 0.1)",
        // typography
        "--font-family-body": theme.typography?.bodyFont ? `"${theme.typography.bodyFont}", sans-serif` : "var(--font-plus-jakarta), sans-serif",
        "--font-family-heading": theme.typography?.headingFont ? `"${theme.typography.headingFont}", serif` : "var(--font-serif), serif",
        "--letter-spacing": theme.typography?.letterSpacing || "0em",
        "--line-height": theme.typography?.lineHeight || "1.6",
        "--base-font-size": theme.typography?.baseFontSize || "16px",
        // layout / components
        "--radius-btn": theme.components?.btnRadius || theme.layout?.borderRadius || "0.5rem",
        "--radius-card": theme.components?.cardRadius || theme.layout?.cardRadius || "1rem",
        "--container-width": theme.layout?.containerWidth || "1280px",
        "--spacing-section": theme.layout?.sectionSpacing || "5rem",
        // specific component settings
        "--nav-bg": theme.components?.navBg || theme.colors?.background || "#020520",
        "--nav-height": theme.components?.navHeight || "72px",
        "--nav-menu-color": theme.components?.navMenuColor || theme.colors?.textMuted || "#8E90A2",
        "--nav-active-color": theme.components?.navActiveColor || theme.colors?.primary || "#DDBD81",
        "--footer-bg": theme.components?.footerBg || theme.colors?.surface || "#13131a",
        "--footer-text": theme.components?.footerText || theme.colors?.textMuted || "#8E90A2",
        "--footer-link": theme.components?.footerLink || theme.colors?.primary || "#DDBD81",
        "--card-bg": theme.components?.cardBg || theme.colors?.surface || "#13131a",
        "--card-border": theme.components?.cardBorder || theme.colors?.border || "#1e1e2e",
      }
    : {};

  const googleFontsUrl = theme ? getGoogleFontsUrl(theme.typography?.headingFont, theme.typography?.bodyFont) : null;
  const styleBlock = theme
    ? `
      :root {
        ${Object.entries(cssVars)
          .map(([key, val]) => `${key}: ${sanitizeCSSValue(val)};`)
          .join("\n")}
      }
    `
    : "";

  return (
    <div
      className="public-site flex min-h-screen flex-col text-foreground antialiased"
      style={{
        background: "var(--background)",
      } as React.CSSProperties}
    >
      {styleBlock && (
        <style id="theme-ssr-variables" dangerouslySetInnerHTML={{ __html: styleBlock }} />
      )}
      {googleFontsUrl && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href={googleFontsUrl} />
        </>
      )}
      <OrganizationSchema />
      {/* Dynamic Header & Navigation */}
      <Navbar />

      {/* Scroll Triggered Announcement Popup */}
      <AnnouncementPopup />

      {/* Main Content Layout */}
      <main className="flex-1">{children}</main>

      {/* Scroll to Top Button on Every Page */}
      <ScrollToTop />

      {/* Premium Footer */}
      <Footer />
    </div>
  );
}
