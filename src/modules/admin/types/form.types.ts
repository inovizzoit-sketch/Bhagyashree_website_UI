export type FormType =
  | "CONTACT"
  | "LEAD_INQUIRY"
  | "SITE_VISIT"
  | "FEEDBACK"
  | "CUSTOM";

export type FieldType =
  | "TEXT"
  | "TEXTAREA"
  | "EMAIL"
  | "PHONE"
  | "NUMBER"
  | "SELECT"
  | "MULTI_SELECT"
  | "RADIO"
  | "CHECKBOX"
  | "DATE"
  | "TIME"
  | "FILE"
  | "URL"
  | "HIDDEN"
  | "RATING";

export type InquiryStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "CONTACTED"
  | "QUALIFIED"
  | "CLOSED"
  | "SPAM";

export interface FormFieldItem {
  id?: string;
  label: string;
  name: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  helpText?: string;
  options?: string[];
  sortOrder?: number;
}

export interface Form {
  id: string;
  name: string;
  slug: string;
  type: FormType;
  description?: string;
  submitButtonText: string;
  isActive: boolean;
  fields?: FormFieldItem[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    submissions: number;
    inquiries: number;
  };
}

export interface InquiryNote {
  id: string;
  inquiryId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  formId?: string;
  submissionId?: string;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  status: InquiryStatus;
  isStarred: boolean;
  isArchived: boolean;
  assignedTo?: string;
  pageSource?: string;
  payload?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  form?: {
    id: string;
    name: string;
    type: FormType;
    fields?: FormFieldItem[];
  };
  notes?: InquiryNote[];
}
