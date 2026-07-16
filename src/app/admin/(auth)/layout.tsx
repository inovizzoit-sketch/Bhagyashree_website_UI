// src/app/admin/(auth)/layout.tsx
// Full-screen layout for auth pages (login, forgot-password, etc.)
// No sidebar or topbar — independent from AdminLayout.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Nandeeka CMS",
  description: "Sign in to the Nandeeka CMS admin panel",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0f14] font-sans p-4 sm:p-6 md:p-8">
      {children}
    </div>
  );
}
