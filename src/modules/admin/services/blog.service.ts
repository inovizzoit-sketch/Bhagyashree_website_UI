import { API_BASE_URL } from "@/shared/lib/api-config";
import { Blog } from "../types";

export async function getBlogs(): Promise<Blog[]> {
  const token = localStorage.getItem("admin_token");
  
  const response = await fetch(`${API_BASE_URL}/blog`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load blogs");
  }

  return response.json();
}

export async function createBlog(formData: FormData): Promise<Blog> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/blog`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create blog");
  }

  return response.json();
}

export async function updateBlog(id: string, formData: FormData): Promise<Blog> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update blog");
  }

  return response.json();
}

export async function deleteBlog(id: string): Promise<void> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete blog");
  }
}
