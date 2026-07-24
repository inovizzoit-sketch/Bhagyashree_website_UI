import { API_BASE_URL } from "@/shared/lib/api-config";
import {
  FooterSettings,
  FooterLink,
  FooterSocial,
  CreateFooterLinkDto,
  UpdateFooterLinkDto,
  CreateFooterSocialDto,
  UpdateFooterSocialDto,
} from "../types/footer.types";

// --- Helper to get headers ---
function getHeaders(contentType: string | null = "application/json") {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  return headers;
}

// --- Footer Settings ---

export async function getFooterSettings(): Promise<FooterSettings> {
  const response = await fetch(`${API_BASE_URL}/footer/settings`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load footer settings");
  }

  return response.json();
}

export async function updateFooterSettings(formData: FormData): Promise<FooterSettings> {
  const response = await fetch(`${API_BASE_URL}/footer`, {
    method: "PUT",
    headers: getHeaders(null), // null to let browser set boundary for multipart/form-data
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update footer settings");
  }

  return response.json();
}

// --- Footer Links ---

export async function getFooterLinks(): Promise<FooterLink[]> {
  const response = await fetch(`${API_BASE_URL}/footer/links`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load footer links");
  }

  return response.json();
}

export async function createFooterLink(dto: CreateFooterLinkDto): Promise<FooterLink> {
  const response = await fetch(`${API_BASE_URL}/footer/links`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create footer link");
  }

  return response.json();
}

export async function updateFooterLink(id: string, dto: UpdateFooterLinkDto): Promise<FooterLink> {
  const response = await fetch(`${API_BASE_URL}/footer/links/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update footer link");
  }

  return response.json();
}

export async function deleteFooterLink(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/footer/links/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete footer link");
  }
}

// --- Footer Socials ---

export async function getFooterSocials(): Promise<FooterSocial[]> {
  const response = await fetch(`${API_BASE_URL}/footer/socials`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load footer socials");
  }

  return response.json();
}

export async function createFooterSocial(dto: CreateFooterSocialDto): Promise<FooterSocial> {
  const response = await fetch(`${API_BASE_URL}/footer/socials`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create footer social");
  }

  return response.json();
}

export async function updateFooterSocial(id: string, dto: UpdateFooterSocialDto): Promise<FooterSocial> {
  const response = await fetch(`${API_BASE_URL}/footer/socials/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update footer social");
  }

  return response.json();
}

export async function deleteFooterSocial(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/footer/socials/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete footer social");
  }
}
