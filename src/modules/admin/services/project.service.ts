import { API_BASE_URL } from "@/shared/lib/api-config";
import { Project } from "../types";

export async function getProjects(): Promise<Project[]> {
  const token = localStorage.getItem("admin_token");
  
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load projects");
  }

  return response.json();
}

export async function createProject(formData: FormData): Promise<Project> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      // NOTE: Do NOT set Content-Type header when sending FormData!
      // The browser will automatically set it to 'multipart/form-data' with the correct boundary.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create project");
  }

  return response.json();
}

export async function getProjectByIdOrSlug(idOrSlug: string): Promise<Project> {
  const token = localStorage.getItem("admin_token");
  
  const response = await fetch(`${API_BASE_URL}/projects/${idOrSlug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load project details");
  }

  return response.json();
}

export async function updateProject(id: string, formData: FormData): Promise<Project> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update project");
  }

  return response.json();
}

export async function deleteProject(id: string): Promise<void> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete project");
  }
}
