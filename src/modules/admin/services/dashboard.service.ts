import { API_BASE_URL } from "@/shared/lib/api-config";
import { DashboardResponse } from "../types";

export async function getDashboardData(): Promise<DashboardResponse> {
  const token = localStorage.getItem("admin_token");
  
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load dashboard data");
  }

  return response.json();
}
