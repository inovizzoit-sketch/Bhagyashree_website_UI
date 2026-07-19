import { API_BASE_URL } from "@/shared/lib/api-config";
import { Announcement } from "../types";

export async function getAnnouncements(): Promise<Announcement[]> {
  const token = localStorage.getItem("admin_token");
  
  const response = await fetch(`${API_BASE_URL}/announcements`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load announcements");
  }

  return response.json();
}

export async function createAnnouncement(formData: FormData): Promise<Announcement> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/announcements`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create announcement");
  }

  return response.json();
}

export async function updateAnnouncement(id: string, formData: FormData): Promise<Announcement> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update announcement");
  }

  return response.json();
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete announcement");
  }
}
