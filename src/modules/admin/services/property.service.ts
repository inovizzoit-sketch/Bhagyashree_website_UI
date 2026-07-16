import { API_BASE_URL } from "@/shared/lib/api-config";

export interface Property {
  id: string;
  projectId?: string;
  project?: {
    id: string;
    name: string;
  };
  title: string;
  propertyType?: string;
  unitNumber?: string;
  propertyImage?: string;
  areaSqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  price?: number;
  facing?: string;
  floorNumber?: number;
  status?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getProperties(projectId?: string): Promise<Property[]> {
  const token = localStorage.getItem("admin_token");
  const url = new URL(`${API_BASE_URL}/properties`);
  if (projectId) {
    url.searchParams.append("projectId", projectId);
  }
  
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load properties");
  }

  return response.json();
}

export async function createProperty(formData: FormData): Promise<Property> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/properties`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create property");
  }

  return response.json();
}

export async function updateProperty(id: string, formData: FormData): Promise<Property> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update property");
  }

  return response.json();
}

export async function deleteProperty(id: string): Promise<void> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete property");
  }
}
