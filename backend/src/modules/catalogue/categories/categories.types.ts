export interface CategorySummaryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  productCount: number;
}

export interface CategoryDetailDTO extends CategorySummaryDTO {
  parentId: string | null;
  children: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
  }[];
}

