import { API_BASE_URL } from "@/shared/lib/api-config";
import { HomeGallery, HomeGalleryListResponse } from "../types";

export async function getHomeGalleries(params: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortOrder?: "asc" | "desc";
} = {}): Promise<HomeGalleryListResponse> {
  const token = localStorage.getItem("admin_token");
  const query = new URLSearchParams();
  if (params.page !== undefined) query.append("page", String(params.page));
  if (params.limit !== undefined) query.append("limit", String(params.limit));
  if (params.search) query.append("search", params.search);
  if (params.isActive !== undefined) query.append("isActive", String(params.isActive));
  if (params.sortOrder) query.append("sortOrder", params.sortOrder);

  const response = await fetch(`${API_BASE_URL}/home-gallery?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load home gallery items");
  }

  return response.json();
}

export async function getHomeGalleryItem(id: string): Promise<HomeGallery> {
  const response = await fetch(`${API_BASE_URL}/home-gallery/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load home gallery item");
  }

  return response.json();
}

export async function createHomeGallery(formData: FormData): Promise<HomeGallery> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/home-gallery`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create home gallery item");
  }

  return response.json();
}

export async function updateHomeGallery(id: string, formData: FormData): Promise<HomeGallery> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/home-gallery/${id}`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update home gallery item");
  }

  return response.json();
}

export async function deleteHomeGallery(id: string): Promise<void> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/home-gallery/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete home gallery item");
  }
}

export async function getWebsiteHomeGallery(): Promise<HomeGallery[]> {
  const response = await fetch(`${API_BASE_URL}/website/home-gallery`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load website home gallery");
  }

  return response.json();
}
