// src/app/(web)/layout.tsx

import type { Metadata } from "next";
import Navbar from "@/modules/web/components/Navbar";
import AnnouncementPopup from "@/modules/web/components/AnnouncementPopup";
import Footer from "@/modules/web/components/Footer";

export const metadata: Metadata = {
  title: "Nandeeka — Timeless Luxury Spaces",
  description: "Official website of Nandeeka developments.",
};



export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col text-text-white antialiased" style={{ background: 'var(--background)' }}>
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
