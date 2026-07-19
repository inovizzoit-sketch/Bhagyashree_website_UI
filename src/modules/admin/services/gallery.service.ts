import { API_BASE_URL } from "@/shared/lib/api-config";
import { GalleryItem } from "../types";

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const token = localStorage.getItem("admin_token");
  
  const response = await fetch(`${API_BASE_URL}/gallery`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load gallery items");
  }

  return response.json();
}

export async function createGalleryItem(formData: FormData): Promise<GalleryItem> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/gallery`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to upload gallery item");
  }

  return response.json();
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete gallery item");
  }
}
