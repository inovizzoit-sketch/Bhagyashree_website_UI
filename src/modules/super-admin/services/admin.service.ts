import { API_BASE_URL } from "@/shared/lib/api-config";

export interface AdminUser {
  id: string;
  username: string;
  createdAt: string;
  isActive?: boolean;
  permissions?: Record<string, string[]>;
}

function getHeaders() {
  const token = localStorage.getItem("super_admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getAdmins(): Promise<AdminUser[]> {
  const response = await fetch(`${API_BASE_URL}/super-admin/admins`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch admins");
  }

  return response.json();
}

export async function createAdmin(dto: any): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}/super-admin/admins`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create admin");
  }

  return response.json();
}

export async function updateAdmin(id: string, dto: any): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}/super-admin/admins/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update admin");
  }

  return response.json();
}

export async function deleteAdmin(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/super-admin/admins/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete admin");
  }
}
