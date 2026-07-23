import { API_BASE_URL } from "@/shared/lib/api-config";
import { Form, FormType } from "../types";

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || localStorage.getItem("admin_token")
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getForms(search?: string, type?: FormType): Promise<Form[]> {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (type) query.append("type", type);

  const response = await fetch(`${API_BASE_URL}/forms?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load forms");
  }

  return response.json();
}

export async function getFormById(id: string): Promise<Form> {
  const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load form details");
  }

  return response.json();
}

export async function getPublicFormBySlug(slug: string): Promise<Form> {
  const response = await fetch(`${API_BASE_URL}/forms/public/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Form not available");
  }

  return response.json();
}

export async function createForm(data: Partial<Form>): Promise<Form> {
  const response = await fetch(`${API_BASE_URL}/forms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create form");
  }

  return response.json();
}

export async function updateForm(id: string, data: Partial<Form>): Promise<Form> {
  const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update form");
  }

  return response.json();
}

export async function duplicateForm(id: string): Promise<Form> {
  const response = await fetch(`${API_BASE_URL}/forms/${id}/duplicate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to duplicate form");
  }

  return response.json();
}

export async function deleteForm(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete form");
  }
}

export async function submitPublicForm(
  slug: string,
  data: Record<string, any>,
  pageSource?: string
): Promise<{ message: string; submissionId: string; inquiryId: string }> {
  const response = await fetch(`${API_BASE_URL}/forms/${slug}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data, pageSource }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message?.[0] || errorData.message || "Failed to submit form");
  }

  return response.json();
}
