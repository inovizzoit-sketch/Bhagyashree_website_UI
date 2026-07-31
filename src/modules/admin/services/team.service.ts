import { API_BASE_URL } from "@/shared/lib/api-config";
import { TeamMember, TeamResponse } from "../types";

function getHeaders() {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getTeamMembers(params: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
} = {}): Promise<TeamResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.search) query.append("search", params.search);
  if (params.isActive !== undefined) query.append("isActive", String(params.isActive));

  const response = await fetch(`${API_BASE_URL}/team-members?${query.toString()}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load team members");
  }

  return response.json();
}

export async function getTeamMemberById(id: string): Promise<TeamMember> {
  const response = await fetch(`${API_BASE_URL}/team-members/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load team member details");
  }

  return response.json();
}

export async function createTeamMember(formData: FormData): Promise<TeamMember> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/team-members`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create team member");
  }

  return response.json();
}

export async function updateTeamMember(id: string, formData: FormData): Promise<TeamMember> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/team-members/${id}`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update team member");
  }

  return response.json();
}

export async function deleteTeamMember(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/team-members/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete team member");
  }
}

export async function reorderTeamMembers(ids: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/team-members/reorder`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ ids }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to reorder team members");
  }
}

export async function bulkDeleteTeamMembers(ids: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/team-members/bulk-delete`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ ids }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete selected team members");
  }
}

export async function bulkUpdateStatus(ids: string[], isActive: boolean): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/team-members/bulk-status`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ ids, isActive }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update status for selected team members");
  }
}
