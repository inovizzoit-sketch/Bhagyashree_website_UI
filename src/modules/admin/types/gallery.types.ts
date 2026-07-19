export interface GalleryItem {
  id: string;
  title?: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}
