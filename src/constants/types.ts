export interface MetaInfo {
  title: string;
  description: string;
  menu?: string;
  emoji?: string[];
}

export interface FrontMatter {
  title: string;
  publishedAt: string;
  updatedAt: string;
  description: string;
  tags: string[];
}

export interface Post {
  frontMatter: FrontMatter;
  slug: string;
}
