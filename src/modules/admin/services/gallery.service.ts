import { API_BASE_URL } from "@/shared/lib/api-config";
import { GalleryItem, GalleryCategory } from "../types";

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ----------------------------------------------------
// CATEGORY API SERVICES
// ----------------------------------------------------

export async function getGalleryCategories(status?: boolean): Promise<GalleryCategory[]> {
  const query = status !== undefined ? `?status=${status}` : "";
  const response = await fetch(`${API_BASE_URL}/gallery/category${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load gallery categories");
  }

  return response.json();
}

export async function createGalleryCategory(data: Partial<GalleryCategory>): Promise<GalleryCategory> {
  const response = await fetch(`${API_BASE_URL}/gallery/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create category");
  }

  return response.json();
}

export async function updateGalleryCategory(id: string, data: Partial<GalleryCategory>): Promise<GalleryCategory> {
  const response = await fetch(`${API_BASE_URL}/gallery/category/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update category");
  }

  return response.json();
}

export async function deleteGalleryCategory(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/gallery/category/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete category");
  }
}

// ----------------------------------------------------
// GALLERY ITEM API SERVICES
// ----------------------------------------------------

export async function getGalleryItems(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: boolean;
  mediaType?: string;
}): Promise<{ items: GalleryItem[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);
  if (params?.categoryId) query.append("categoryId", params.categoryId);
  if (params?.status !== undefined) query.append("status", String(params.status));
  if (params?.mediaType) query.append("mediaType", params.mediaType);

  const response = await fetch(`${API_BASE_URL}/gallery?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load gallery items");
  }

  const data = await response.json();
  // Handle array response or paginated object response
  if (Array.isArray(data)) {
    return {
      items: data,
      meta: { total: data.length, page: 1, limit: data.length || 20, totalPages: 1 },
    };
  }
  return data;
}

export async function getGalleryItemById(id: string): Promise<GalleryItem> {
  const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch gallery item details");
  }

  return response.json();
}

export async function createGalleryItem(formData: FormData): Promise<GalleryItem> {
  const response = await fetch(`${API_BASE_URL}/gallery`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to upload gallery item");
  }

  return response.json();
}

export async function uploadMultipleGalleryItems(formData: FormData): Promise<GalleryItem[]> {
  const response = await fetch(`${API_BASE_URL}/gallery/upload`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to upload images");
  }

  return response.json();
}

export async function updateGalleryItem(id: string, formData: FormData): Promise<GalleryItem> {
  const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update gallery item");
  }

  return response.json();
}

export async function toggleGalleryItemStatus(id: string, status?: boolean): Promise<GalleryItem> {
  const response = await fetch(`${API_BASE_URL}/gallery/change-status/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to change status");
  }

  return response.json();
}

export async function reorderGalleryItems(items: { id: string; sortOrder: number }[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/gallery/reorder`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to reorder gallery items");
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete gallery item");
  }
}
