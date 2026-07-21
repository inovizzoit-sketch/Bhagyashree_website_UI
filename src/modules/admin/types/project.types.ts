export type ProjectType = "APARTMENT" | "VILLA" | "PLOT" | "COMMERCIAL";
export type ProjectStatus = "ONGOING" | "COMPLETED" | "UPCOMING";

export interface Project {
  id: string;
  name: string;
  slug: string;
  projectType: ProjectType;
  projectStatus: ProjectStatus;
  shortDescription: string;
  description: string;
  location: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  startingPrice: number;
  pricePerSqft: number;
  isFeatured: boolean;
  isActive: boolean;
  thumbnailUrl?: string;
  thumbnailImage?: string;
  brochureUrl?: string;
  brochureFile?: string;
  properties?: ProjectProperty[];
  amenities?: {
    id: string;
    name: string;
    icon?: string;
    category?: { id: string; name: string };
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectProperty {
  id: string;
  title: string;
  type?: string;
  status?: string;
}

export interface CreateProjectInput {
  name: string;
  slug: string;
  projectType: ProjectType;
  projectStatus: ProjectStatus;
  shortDescription: string;
  description: string;
  location: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  startingPrice: number;
  pricePerSqft: number;
  isFeatured: boolean;
  isActive: boolean;
  thumbnailImage?: File;
  brochureFile?: File;
}
