"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Theme, ThemeColor, ThemeTypography, ThemeLayout, ThemeComponent } from "@/modules/admin/types";
import { API_BASE_URL } from "@/shared/lib/api-config";

interface ThemeContextProps {
  theme: Theme | null;
  loading: boolean;
  setPreviewTheme: (theme: Theme | null) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: null,
  loading: true,
  setPreviewTheme: () => {},
});

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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);

  // Load the active theme initially
  useEffect(() => {
    fetch(`${API_BASE_URL}/website/active-theme`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setTheme(data);
      })
      .catch((err) => {
        console.error("Failed to fetch active theme in provider:", err);
      })
      .finally(() => {
        setLoading(false);
      });

    // Listen for preview updates from parent window (for iframe previews)
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "THEME_PREVIEW_UPDATE") {
        setPreviewTheme(e.data.theme);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Compute currently active theme (preview overrides live theme)
  const currentTheme = previewTheme || theme;

  // Dynamically inject CSS variables into the root element on theme changes
  useEffect(() => {
    if (!currentTheme) return;

    const root = document.documentElement;
    const colors = (currentTheme.colors || {}) as ThemeColor;
    const typography = (currentTheme.typography || {}) as ThemeTypography;
    const layout = (currentTheme.layout || {}) as ThemeLayout;
    const components = (currentTheme.components || {}) as ThemeComponent;

    const vars: Record<string, string> = {
      "--background": colors.background || "#0B0F19",
      "--foreground": colors.textPrimary || "#FFFFFF",
      "--dark-primary": colors.secondary || "#0a146f",
      "--dark-secondary": colors.secondary || "#002244",
      "--gold-solid": colors.primary || "#DDBD81",
      "--gold-hover": colors.accent || "#C5A267",
      "--gold-dark": colors.accent || "#AC8336",
      "--text-white": colors.textPrimary || "#FFFFFF",
      "--text-gray-light": colors.textMuted || "#E4E4E7",
      "--text-gray-muted": colors.textMuted || "#8E90A2",
      "--border-color": colors.border || "#3F404D",
      "--border-muted": colors.border || "rgba(255, 255, 255, 0.1)",
      
      "--font-family-body": typography.bodyFont ? `"${typography.bodyFont}", sans-serif` : "var(--font-plus-jakarta), sans-serif",
      "--font-family-heading": typography.headingFont ? `"${typography.headingFont}", serif` : "var(--font-serif), serif",
      "--letter-spacing": typography.letterSpacing || "0em",
      "--line-height": typography.lineHeight || "1.6",
      "--base-font-size": typography.baseFontSize || "16px",
      
      "--radius-btn": components.btnRadius || layout.borderRadius || "0.5rem",
      "--radius-card": components.cardRadius || layout.cardRadius || "1rem",
      "--container-width": layout.containerWidth || "1280px",
      "--spacing-section": layout.sectionSpacing || "5rem",

      "--nav-bg": components.navBg || colors.background || "#020520",
      "--nav-height": components.navHeight || "72px",
      "--nav-menu-color": components.navMenuColor || colors.textMuted || "#8E90A2",
      "--nav-active-color": components.navActiveColor || colors.primary || "#DDBD81",
      "--footer-bg": components.footerBg || colors.surface || "#13131a",
      "--footer-text": components.footerText || colors.textMuted || "#8E90A2",
      "--footer-link": components.footerLink || colors.primary || "#DDBD81",
      "--card-bg": components.cardBg || colors.surface || "#13131a",
      "--card-border": components.cardBorder || colors.border || "#1e1e2e",
    };

    // Apply all variables dynamically
    Object.entries(vars).forEach(([key, val]) => {
      root.style.setProperty(key, sanitizeCSSValue(val));
    });
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, loading, setPreviewTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
