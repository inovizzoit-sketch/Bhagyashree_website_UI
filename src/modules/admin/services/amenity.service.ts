import { API_BASE_URL } from "@/shared/lib/api-config";
import { AmenityCategory } from "./amenity-category.service";

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
  isActive: boolean;
  categoryId?: string;
  category?: AmenityCategory;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAmenityInput {
  name: string;
  icon?: string;
  isActive?: boolean;
  categoryId?: string;
}

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

export async function getAmenities(): Promise<Amenity[]> {
  const res = await fetch(`${API_BASE_URL}/amenities`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error("Failed to load amenities");
  }
  return res.json();
}

export async function createAmenity(formData: FormData): Promise<Amenity> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const res = await fetch(`${API_BASE_URL}/amenities`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message?.[0] || errorData.message || "Failed to create amenity"
    );
  }
  return res.json();
}

export async function updateAmenity(
  id: string,
  formData: FormData
): Promise<Amenity> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const res = await fetch(`${API_BASE_URL}/amenities/${id}`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message?.[0] || errorData.message || "Failed to update amenity"
    );
  }
  return res.json();
}

export async function deleteAmenity(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/amenities/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error("Failed to delete amenity");
  }
}
