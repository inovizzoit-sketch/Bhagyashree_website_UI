// src/app/(web)/layout.tsx

import type { Metadata } from "next";
import Navbar from "@/modules/web/components/Navbar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nandeeka — Timeless Luxury Spaces",
  description: "Official website of Nandeeka developments.",
};

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-dark-primary text-text-white antialiased">
      {/* Dynamic Header & Navigation */}
      <Navbar />

      {/* Main Content Layout */}
      <main className="flex-1">{children}</main>

      {/* Premium Footer */}
      {/* <footer className="border-t border-border-muted bg-violet-footer py-12">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-wider text-text-white">
              <span className="h-2.5 w-2.5 rounded-full bg-gold-solid" />
              NANDEEKA
            </Link>

            <nav className="flex flex-wrap items-center justify-center gap-6">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-semibold uppercase tracking-wider text-text-gray-muted hover:text-gold-solid transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <hr className="border-border-muted my-8" />

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row text-xs text-text-gray-muted">
            <p>© {new Date().getFullYear()} Nandeeka. All rights reserved.</p>
            <p className="flex gap-4">
              <span className="hover:text-gold-solid cursor-pointer">Privacy Policy</span>
              <span className="hover:text-gold-solid cursor-pointer">Terms of Service</span>
            </p>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
