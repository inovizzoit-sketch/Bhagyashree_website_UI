import type { Metadata } from "next";
import Navbar from "@/modules/web/components/Navbar";
import AnnouncementPopup from "@/modules/web/components/AnnouncementPopup";
import Footer from "@/modules/web/components/Footer";
import ScrollToTop from "@/modules/web/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Nandeeka — Timeless Luxury Spaces",
  description: "Official website of NANDEEKA ENTERPRISES.",
};

function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "NANDEEKA ENTERPRISES",
    "url": "https://www.nandeekaenterprises.com",
    "logo": "https://www.nandeekaenterprises.com/logo.png",
    "description": "NANDEEKA ENTERPRISES offers VDA STANDARDS approved plotted land layouts in Greater Varanasi with clear titles and complete infrastructure.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Varanasi",
      "addressRegion": "Uttar Pradesh",
      "addressCountry": "IN"
    },
    "areaServed": "Greater Varanasi",
    "telephone": "+91-XXXXXXXXXX",
    "sameAs": [
      "https://www.instagram.com/nandeekaenterprises",
      "https://www.facebook.com/nandeekaenterprises"
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

export default async function WebLayout({ children }: { children: React.ReactNode }) {
  const theme = await fetch(`${API_BASE_URL}/website/active-theme`, {
    cache: "no-store",
  })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);

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
        // layout / components
        "--radius-btn": theme.components?.btnRadius || theme.layout?.borderRadius || "0.5rem",
        "--radius-card": theme.components?.cardRadius || theme.layout?.cardRadius || "1rem",
      }
    : {};

  const googleFontsUrl = theme ? getGoogleFontsUrl(theme.typography?.headingFont, theme.typography?.bodyFont) : null;

  return (
    <div
      className="flex min-h-screen flex-col text-text-white antialiased"
      style={{
        background: "var(--background)",
        ...cssVars,
      } as React.CSSProperties}
    >
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
