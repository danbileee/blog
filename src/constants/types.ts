export interface MetaInfo {
  title: string;
  description: string;
  menu?: string;
  emoji?: string[];
}

export interface PostFrontMatter {
  title: string;
  publishedAt: string;
  updatedAt: string;
  description: string;
  tags: string[];
  devOnly?: boolean;
}

export interface Post {
  frontMatter: PostFrontMatter;
  slug: string;
}

export interface Career {
  company: string;
  period: string;
  description: string;
  techStacks: string[];
  careerIds: string[];
  logoSize: {
    width: number;
    height: number;
  };
}

export interface CareerFrontMatter {
  title: string;
  link: string;
  demo?: {
    title: string;
    link: string;
  };
  description: string;
  tags: string[];
}

export interface AboutMe {
  keyword: string;
  description: string;
}
