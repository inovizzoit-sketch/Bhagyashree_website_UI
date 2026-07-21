export type TemplateType = "EMAIL" | "WHATSAPP" | "SMS" | "NOTIFICATION";
export type TemplateStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export type EventType = 
  | "LEAD_CREATED"
  | "INQUIRY_SUBMITTED"
  | "SITE_VISIT_BOOKED"
  | "USER_REGISTERED"
  | "PROPERTY_ENQUIRY_CREATED"
  | "PAYMENT_RECEIVED"
  | "BOOKING_CONFIRMED"
  | "MANUAL_FOLLOWUP"
  | "NONE";

export interface TemplateCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: boolean;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  type: TemplateType;
  subject?: string;
  content: string;
  description?: string;
  status: boolean | TemplateStatus;
  isDefault: boolean;
  eventType?: EventType;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateDto {
  name: string;
  slug?: string;
  type: TemplateType;
  subject?: string;
  content: string;
  description?: string;
  status?: boolean | TemplateStatus;
  isDefault?: boolean;
  eventType?: EventType;
  categoryId?: string;
}

export interface UpdateTemplateDto {
  name?: string;
  slug?: string;
  type?: TemplateType;
  subject?: string;
  content?: string;
  description?: string;
  status?: boolean | TemplateStatus;
  isDefault?: boolean;
  eventType?: EventType;
  categoryId?: string;
}

export interface TemplatePreviewRequest {
  content: string;
  subject?: string;
  payload?: Record<string, string>;
}

export interface TemplatePreviewResponse {
  renderedSubject?: string;
  renderedContent: string;
}

export interface TemplateLog {
  id: string;
  templateId?: string;
  recipient: string;
  payload: string;
  status: string;
  sentAt: string;
  template?: {
    name: string;
  };
}
