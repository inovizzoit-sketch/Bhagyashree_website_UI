"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { adminLogout } from "@/modules/admin/services/auth.service";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "⊞" },
  { label: "Projects", href: "/admin/projects", icon: "◈" },
  { label: "Properties", href: "/admin/properties", icon: "⌂" },
  { label: "Amenity Categories", href: "/admin/amenity-categories", icon: "✿" },
  { label: "Amenities", href: "/admin/amenities", icon: "☘" },
  { label: "Blogs", href: "/admin/blogs", icon: "✍" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "★" },
  { label: "Gallery", href: "/admin/gallery", icon: "🖼" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await adminLogout();
    } catch (err) {
      console.error("API logout error, clearing token locally anyway:", err);
    } finally {
      localStorage.removeItem("admin_token");
      router.push("/admin/login");
    }
  }

  return (
    <div className="flex h-screen bg-[#0f0f14] text-slate-200 overflow-hidden font-sans">
      {/* ── Sidebar ── */}
      <aside className="w-[220px] min-w-[220px] bg-[#13131a] border-r border-[#1e1e2e] flex flex-col py-6 gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 pb-6 border-b border-[#1e1e2e]">
          <span className="w-[34px] h-[34px] rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-extrabold text-base text-white shrink-0">
            N
          </span>
          <span className="font-bold text-[15px] text-slate-100 tracking-wide">
            Nandeeka
          </span>
          <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30 tracking-widest uppercase">
            CMS
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-3 pt-4 flex-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-sm font-medium transition-all duration-150 ${isActive
                    ? "bg-indigo-500/15 text-indigo-200"
                    : "text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-200"
                  }`}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[#1e1e2e] mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-red-400 text-sm font-medium transition-all duration-150 hover:bg-red-400/10 cursor-pointer bg-transparent border-none text-left"
          >
            <span>⎋</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[60px] bg-[#13131a] border-b border-[#1e1e2e] flex items-center justify-between px-7 shrink-0">
          <div className="text-[15px] font-semibold text-slate-400 tracking-wide">
            Admin Panel
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[13px] text-indigo-400 no-underline font-medium transition-colors duration-150 hover:text-indigo-300"
            >
              ↗ View Site
            </Link>
            <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[13px] font-bold text-white cursor-pointer">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
