import { API_BASE_URL } from "@/shared/lib/api-config";

export interface PopupItem {
  id: string;
  title: string;
  slug: string;
  popupType: string;
  heading?: string;
  subHeading?: string;
  description?: string;
  image?: string;
  videoUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  htmlContent?: string;
  triggerType: string;
  showAfterSeconds: number;
  frequency: string;
  priority: number;
  deviceType: string;
  targetType: string;
  targetPages: string[];
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
  closes: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    leads: number;
  };
}

export interface PopupLeadItem {
  id: string;
  popupId: string;
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  createdAt: string;
  popup?: {
    title: string;
  };
}

export interface PopupStats {
  totalPopups: number;
  activePopups: number;
  totalViews: number;
  totalLeads?: number;
  topPerforming: {
    id: string;
    title: string;
    ctr: number;
    clicks: number;
    impressions: number;
  } | null;
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPopupStats(): Promise<PopupStats> {
  const response = await fetch(`${API_BASE_URL}/popup/dashboard/stats`, {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    throw new Error("Failed to load popup analytics");
  }
  return response.json();
}

export async function getPopups(params: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  isActive?: boolean;
}): Promise<{ items: PopupItem[]; meta: { total: number; totalPages: number; page: number } }> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.search) query.append("search", params.search);
  if (params.type) query.append("type", params.type);
  if (params.isActive !== undefined) query.append("isActive", String(params.isActive));

  const response = await fetch(`${API_BASE_URL}/popup?${query.toString()}`, {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch popups");
  }
  return response.json();
}

export async function getPopupById(id: string): Promise<PopupItem> {
  const response = await fetch(`${API_BASE_URL}/popup/${id}`, {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch popup details");
  }
  return response.json();
}

export async function createPopup(formData: FormData): Promise<PopupItem> {
  const response = await fetch(`${API_BASE_URL}/popup`, {
    method: "POST",
    headers: { ...getAuthHeaders() },
    body: formData,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create popup");
  }
  return response.json();
}

export async function updatePopup(id: string, formData: FormData): Promise<PopupItem> {
  const response = await fetch(`${API_BASE_URL}/popup/${id}`, {
    method: "PATCH",
    headers: { ...getAuthHeaders() },
    body: formData,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update popup");
  }
  return response.json();
}

export async function deletePopup(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/popup/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    throw new Error("Failed to delete popup");
  }
}

export async function getLeads(params: {
  page?: number;
  limit?: number;
  search?: string;
  popupId?: string;
}): Promise<{ items: PopupLeadItem[]; meta: { total: number; totalPages: number; page: number } }> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.search) query.append("search", params.search);
  if (params.popupId) query.append("popupId", params.popupId);

  const response = await fetch(`${API_BASE_URL}/popup/leads?${query.toString()}`, {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch leads");
  }
  return response.json();
}
