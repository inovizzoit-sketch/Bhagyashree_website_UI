export interface Announcement {
  id: string;
  title: string;
  content: string;
  link?: string;
  imageUrl?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}
