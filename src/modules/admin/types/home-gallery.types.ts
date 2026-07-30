export interface HomeGallery {
  id: string;
  title: string;
  tag: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HomeGalleryListResponse {
  items: HomeGallery[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
