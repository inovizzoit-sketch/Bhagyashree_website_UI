import { API_BASE_URL } from "@/shared/lib/api-config";

export interface SuperAdminStats {
  overview: {
    totalAdmins: number;
    totalProjects: number;
    totalProperties: number;
    totalBlogs: number;
  };
}

export async function getSuperAdminDashboardStats(): Promise<SuperAdminStats> {
  const token = localStorage.getItem("super_admin_token");
  const response = await fetch(`${API_BASE_URL}/super-admin/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch stats");
  }

  return response.json();
}
