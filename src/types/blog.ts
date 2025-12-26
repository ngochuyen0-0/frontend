// types/blog.ts
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  published_date: string;
  featured_image?: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'published';
  slug: string;
  view_count: number;
  reading_time: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  post_count: number;
}