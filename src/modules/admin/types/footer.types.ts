export interface FooterSettings {
  id: string;
  logoUrl?: string;
  bottomLogoUrl?: string;
  companyName: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  copyrightText?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FooterLink {
  id: string;
  title: string;
  url: string;
  openInNewTab: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFooterLinkDto {
  title: string;
  url: string;
  openInNewTab?: boolean;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateFooterLinkDto {
  title?: string;
  url?: string;
  openInNewTab?: boolean;
  sortOrder?: number;
  isActive?: boolean;
}

export interface FooterSocial {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFooterSocialDto {
  platform: string;
  url: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateFooterSocialDto {
  platform?: string;
  url?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}
