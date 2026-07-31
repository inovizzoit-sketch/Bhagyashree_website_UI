export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  department: string | null;
  image: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
  instagram: string | null;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TeamResponse {
  items: TeamMember[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateTeamMemberDto {
  name: string;
  designation: string;
  department?: string;
  bio?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  slug?: string;
}

export interface UpdateTeamMemberDto extends Partial<CreateTeamMemberDto> {
  image?: string;
}
