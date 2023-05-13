export interface MetaInfo {
  title: string;
  description: string;
  menu?: string;
  emoji?: string[];
}

export interface PostFrontMatter {
  category?: string;
  title: string;
  publishedAt: string;
  updatedAt: string;
  description: string;
  tags: string[];
  ogImage: string;
  devOnly?: boolean;
}

export interface Post {
  frontMatter: PostFrontMatter;
  slug: string;
}

export interface Career {
  id: string;
  company: string;
  startYear: number;
  endYear?: number;
  description: string;
  content: string;
}
