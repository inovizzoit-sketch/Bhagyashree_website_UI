// src/app/(web)/layout.tsx

import type { Metadata } from "next";
import Navbar from "@/modules/web/components/Navbar";
import AnnouncementPopup from "@/modules/web/components/AnnouncementPopup";
import Footer from "@/modules/web/components/Footer";

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

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col text-text-white antialiased" style={{ background: 'var(--background)' }}>
      <OrganizationSchema />
      {/* Dynamic Header & Navigation */}
      <Navbar />

      {/* Scroll Triggered Announcement Popup */}
      <AnnouncementPopup />

      {/* Main Content Layout */}
      <main className="flex-1">{children}</main>

      {/* Premium Footer */}
      <Footer />
    </div>
  );
}
