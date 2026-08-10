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
    setLoading(false);

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
      "--background": colors.background || "#f7f4ec",
      "--foreground": colors.textPrimary || "#202a26",
      "--dark-primary": colors.secondary || "#174b3c",
      "--dark-secondary": colors.secondary || "#0b2b23",
      "--gold-solid": colors.primary || "#b58a3a",
      "--gold-hover": colors.accent || "#956f2c",
      "--gold-dark": colors.accent || "#765620",
      "--text-white": "#fffdf8",
      "--text-gray-light": "#e8eee9",
      "--text-gray-muted": colors.textMuted || "#66736d",
      "--border-color": colors.border || "#dcd5c5",
      "--border-muted": colors.border || "rgba(0, 0, 0, 0.08)",
      
      "--font-family-body": typography.bodyFont ? `"${typography.bodyFont}", sans-serif` : "var(--font-plus-jakarta), sans-serif",
      "--font-family-heading": typography.headingFont ? `"${typography.headingFont}", serif` : "var(--font-serif), serif",
      "--letter-spacing": typography.letterSpacing || "0em",
      "--line-height": typography.lineHeight || "1.6",
      "--base-font-size": typography.baseFontSize || "16px",
      
      "--radius-btn": components.btnRadius || layout.borderRadius || "0.5rem",
      "--radius-card": components.cardRadius || layout.cardRadius || "1rem",
      "--container-width": layout.containerWidth || "1280px",
      "--spacing-section": layout.sectionSpacing || "5rem",

      "--nav-bg": components.navBg || colors.secondary || "#0b2b23",
      "--nav-height": components.navHeight || "72px",
      "--nav-menu-color": components.navMenuColor || "#e8eee9",
      "--nav-active-color": components.navActiveColor || colors.primary || "#d1ad65",
      "--footer-bg": components.footerBg || colors.secondary || "#091f1a",
      "--footer-text": components.footerText || "#b9c6bf",
      "--footer-link": components.footerLink || colors.primary || "#d1ad65",
      "--card-bg": components.cardBg || colors.surface || "#fffdf8",
      "--card-border": components.cardBorder || colors.border || "#dcd5c5",
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
