import { API_BASE_URL } from "@/shared/lib/api-config";
import { Inquiry, InquiryNote, InquiryStatus } from "../types";

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || localStorage.getItem("admin_token")
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getInquiries(params?: {
  folder?: "inbox" | "starred" | "assigned" | "spam" | "trash";
  status?: InquiryStatus;
  formId?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: Inquiry[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
  const query = new URLSearchParams();
  if (params?.folder) query.append("folder", params.folder);
  if (params?.status) query.append("status", params.status);
  if (params?.formId) query.append("formId", params.formId);
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  const response = await fetch(`${API_BASE_URL}/inquiries?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load inquiries");
  }

  return response.json();
}

export async function getInquiryById(id: string): Promise<Inquiry> {
  const response = await fetch(`${API_BASE_URL}/inquiries/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load inquiry details");
  }

  return response.json();
}

export async function updateInquiry(
  id: string,
  data: {
    status?: InquiryStatus;
    isStarred?: boolean;
    isArchived?: boolean;
    assignedTo?: string;
  }
): Promise<Inquiry> {
  const response = await fetch(`${API_BASE_URL}/inquiries/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update inquiry");
  }

  return response.json();
}

export async function addInquiryNote(id: string, content: string): Promise<InquiryNote> {
  const response = await fetch(`${API_BASE_URL}/inquiries/${id}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add note");
  }

  return response.json();
}

export async function deleteInquiry(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/inquiries/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete inquiry");
  }
}

export async function getInquiryStats(): Promise<{
  totalInquiries: number;
  newToday: number;
  unreadCount: number;
  starredCount: number;
  spamCount: number;
  totalForms: number;
}> {
  const response = await fetch(`${API_BASE_URL}/inquiries/stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load inquiry stats");
  }

  return response.json();
}
