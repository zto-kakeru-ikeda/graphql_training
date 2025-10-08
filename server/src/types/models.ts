export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
  categoryId: number | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
}

export interface PostTag {
  postId: number;
  tagId: number;
}

export interface Like {
  id: number;
  userId: number;
  postId: number;
  createdAt: string;
}
