import { API_BASE_URL } from "@/shared/lib/api-config";
import { LoginCredentials, LoginResponse } from "@/modules/admin/types";

export async function superAdminLogin(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/super-admin/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to log in");
  }

  return response.json();
}

export async function superAdminLogout(): Promise<void> {
  const token = localStorage.getItem("super_admin_token");
  const response = await fetch(`${API_BASE_URL}/super-admin/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to log out");
  }
}
