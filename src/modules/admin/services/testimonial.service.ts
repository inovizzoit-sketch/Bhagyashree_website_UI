import { API_BASE_URL } from "@/shared/lib/api-config";
import { Testimonial } from "../types";

export async function getTestimonials(): Promise<Testimonial[]> {
  const token = localStorage.getItem("admin_token");
  
  const response = await fetch(`${API_BASE_URL}/testimonials`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load testimonials");
  }

  return response.json();
}

export async function createTestimonial(formData: FormData): Promise<Testimonial> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/testimonials`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create testimonial");
  }

  return response.json();
}

export async function updateTestimonial(id: string, formData: FormData): Promise<Testimonial> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update testimonial");
  }

  return response.json();
}

export async function deleteTestimonial(id: string): Promise<void> {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete testimonial");
  }
}
