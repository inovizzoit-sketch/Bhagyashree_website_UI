export type ThemeStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export interface ThemeColor {
  id: string;
  themeId: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemeTypography {
  id: string;
  themeId: string;
  headingFont: string;
  bodyFont: string;
  buttonFont: string;
  baseFontSize: string;
  lineHeight: string;
  letterSpacing: string;
}

export interface ThemeLayout {
  id: string;
  themeId: string;
  containerWidth: string;
  borderRadius: string;
  cardRadius: string;
  buttonRadius: string;
  shadowStyle: string;
  sectionSpacing: string;
}

export interface ThemeBranding {
  id: string;
  themeId: string;
  logo: string | null;
  darkLogo: string | null;
  favicon: string | null;
  loadingLogo: string | null;
}

export interface ThemeComponent {
  id: string;
  themeId: string;
  btnBg: string;
  btnText: string;
  btnBorder: string;
  btnHover: string;
  btnRadius: string;
  navBg: string;
  navHeight: string;
  navMenuColor: string;
  navActiveColor: string;
  navSticky: boolean;
  footerBg: string;
  footerText: string;
  footerLink: string;
  cardBg: string;
  cardBorder: string;
  cardRadius: string;
  darkModeEnabled: boolean;
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  previewImage: string | null;
  version: string;
  status: ThemeStatus;
  isDefault: boolean;
  notes: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  colors?: ThemeColor;
  typography?: ThemeTypography;
  layout?: ThemeLayout;
  branding?: ThemeBranding;
  components?: ThemeComponent;
}

export interface ThemesResponse {
  items: Theme[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateThemeDto {
  name: string;
  slug?: string;
  description?: string;
  notes?: string;
}

export interface UpdateThemeDto {
  name?: string;
  slug?: string;
  description?: string;
  notes?: string;
  colors?: Partial<Omit<ThemeColor, "id" | "themeId">>;
  typography?: Partial<Omit<ThemeTypography, "id" | "themeId">>;
  layout?: Partial<Omit<ThemeLayout, "id" | "themeId">>;
  branding?: Partial<Omit<ThemeBranding, "id" | "themeId">>;
  components?: Partial<Omit<ThemeComponent, "id" | "themeId">>;
}
