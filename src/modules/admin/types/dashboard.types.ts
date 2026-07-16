export interface ProjectStats {
  total: number;
  active: number;
}

export interface RecentProperty {
  id: string;
  title: string;
  price?: number;
  location?: string;
  status?: string;
  createdAt?: string;
}

export interface PropertyStats {
  total: number;
  active: number;
  recent: RecentProperty[];
}

export interface DashboardResponse {
  projects: ProjectStats;
  properties: PropertyStats;
}
