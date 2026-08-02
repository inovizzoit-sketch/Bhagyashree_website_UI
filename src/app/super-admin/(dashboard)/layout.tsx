"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { superAdminLogout } from "@/modules/super-admin/services/auth.service";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/super-admin/dashboard",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    label: "Manage Admins",
    href: "/super-admin/admins",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0zm7 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("super_admin_token");
    if (!token) {
      router.push("/super-admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await superAdminLogout();
    } catch (err) {
      console.error("API logout error, clearing token locally anyway:", err);
    } finally {
      localStorage.removeItem("super_admin_token");
      router.push("/super-admin/login");
    }
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#0f0f14] text-slate-200 overflow-hidden font-sans relative">
      {/* Mobile Drawer Backdrop overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-[240px] bg-[#13131a] border-r border-[#1e1e2e] flex flex-col py-6 gap-2 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 pb-6 border-b border-[#1e1e2e]">
          <div className="flex items-center gap-2.5">
            <span className="w-[34px] h-[34px] rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-extrabold text-base text-white shrink-0">
              S
            </span>
            <span className="font-bold text-[15px] text-slate-100 tracking-wide">
              Nandeeka
            </span>
            <span className="text-[10px] font-semibold bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30 tracking-widest uppercase">
              SUPER
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white text-lg p-1 outline-none"
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-3 pt-4 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-purple-500/15 text-purple-200 border-l-2 border-purple-500"
                    : "text-slate-400 hover:bg-purple-500/10 hover:text-purple-200"
                }`}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[#1e1e2e]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline text-red-400 text-sm font-medium transition-all duration-150 hover:bg-red-400/10 cursor-pointer bg-transparent border-none text-left"
          >
            <span className="shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </span>
            <span>Logout Control</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[60px] bg-[#13131a] border-b border-[#1e1e2e] flex items-center justify-between px-4 sm:px-7 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 outline-none"
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="text-[15px] font-semibold text-slate-400 tracking-wide">
              Super Control Panel
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[13px] text-purple-400 no-underline font-medium transition-colors duration-150 hover:text-purple-300"
            >
              ↗ View Website
            </Link>

            <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[13px] font-bold text-white cursor-pointer">
              S
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#0a0a0f]">{children}</main>
      </div>
    </div>
  );
}
