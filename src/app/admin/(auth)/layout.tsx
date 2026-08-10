"use client";

import { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin_theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  return (
    <div className={`min-h-screen w-full flex items-center justify-center bg-background font-sans p-4 sm:p-6 md:p-8 ${
      theme === "light" ? "admin-theme-light" : "admin-theme-dark"
    }`}>
      {children}
    </div>
  );
}
