import { API_BASE_URL } from "@/shared/lib/api-config";
import { Theme, ThemesResponse, CreateThemeDto, UpdateThemeDto } from "../types";

function getHeaders() {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getThemes(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
} = {}): Promise<ThemesResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.search) query.append("search", params.search);
  if (params.status) query.append("status", params.status);
  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.sortOrder) query.append("sortOrder", params.sortOrder);

  const response = await fetch(`${API_BASE_URL}/themes?${query.toString()}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load themes");
  }

  return response.json();
}

export async function getThemeById(id: string): Promise<Theme> {
  const response = await fetch(`${API_BASE_URL}/themes/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load theme details");
  }

  return response.json();
}

export async function createTheme(dto: CreateThemeDto): Promise<Theme> {
  const response = await fetch(`${API_BASE_URL}/themes`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create theme");
  }

  return response.json();
}

export async function updateTheme(id: string, dto: UpdateThemeDto): Promise<Theme> {
  const response = await fetch(`${API_BASE_URL}/themes/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update theme");
  }

  return response.json();
}

export async function deleteTheme(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/themes/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete theme");
  }
}

export async function duplicateTheme(id: string): Promise<Theme> {
  const response = await fetch(`${API_BASE_URL}/themes/${id}/duplicate`, {
    method: "POST",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to duplicate theme");
  }

  return response.json();
}

export async function publishTheme(id: string): Promise<Theme> {
  const response = await fetch(`${API_BASE_URL}/themes/${id}/publish`, {
    method: "POST",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to publish theme");
  }

  return response.json();
}

export async function archiveTheme(id: string): Promise<Theme> {
  const response = await fetch(`${API_BASE_URL}/themes/${id}/archive`, {
    method: "POST",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to archive theme");
  }

  return response.json();
}

export async function exportTheme(id: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/themes/${id}/export`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to export theme");
  }

  return response.json();
}

export async function importTheme(data: any): Promise<Theme> {
  const response = await fetch(`${API_BASE_URL}/themes/import`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to import theme");
  }

  return response.json();
}

export async function uploadThemeBranding(id: string, formData: FormData): Promise<Theme> {
  const token = localStorage.getItem("admin_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/themes/${id}/branding`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to upload branding files");
  }

  return response.json();
}
