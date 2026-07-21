export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    galleries: number;
  };
}

export interface GalleryItem {
  id: string;
  title?: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  altText?: string;
  description?: string;
  sortOrder: number;
  status: boolean;
  categoryId?: string;
  category?: GalleryCategory;
  createdAt: string;
  updatedAt: string;
}
