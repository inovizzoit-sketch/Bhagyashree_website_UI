import { API_BASE_URL } from "@/shared/lib/api-config";

export interface AmenityCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAmenityCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
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

export async function getAmenityCategories(): Promise<AmenityCategory[]> {
  const res = await fetch(`${API_BASE_URL}/amenity-categories`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error("Failed to load amenity categories");
  }
  return res.json();
}

export async function createAmenityCategory(
  input: CreateAmenityCategoryInput
): Promise<AmenityCategory> {
  const res = await fetch(`${API_BASE_URL}/amenity-categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message?.[0] || errorData.message || "Failed to create category"
    );
  }
  return res.json();
}

export async function updateAmenityCategory(
  id: string,
  input: Partial<CreateAmenityCategoryInput>
): Promise<AmenityCategory> {
  const res = await fetch(`${API_BASE_URL}/amenity-categories/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message?.[0] || errorData.message || "Failed to update category"
    );
  }
  return res.json();
}

export async function deleteAmenityCategory(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/amenity-categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error("Failed to delete category");
  }
}
