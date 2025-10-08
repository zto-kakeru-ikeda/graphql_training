import { getDatabase } from '../database/connection';
import type { User, Post, Comment, Category, Tag, Like } from '../types/models';

export const resolvers = {
  Query: {
    // User queries
    users: async (): Promise<User[]> => {
      const db = getDatabase();
      return await db.all('SELECT * FROM users');
    },

    user: async (_: unknown, { id }: { id: number }): Promise<User | undefined> => {
      const db = getDatabase();
      return await db.get('SELECT * FROM users WHERE id = ?', id);
    },

    userByUsername: async (_: unknown, { username }: { username: string }): Promise<User | undefined> => {
      const db = getDatabase();
      return await db.get('SELECT * FROM users WHERE username = ?', username);
    },

    // Post queries
    posts: async (_: unknown, { published, limit = 50, offset = 0 }: { published?: boolean; limit?: number; offset?: number }): Promise<Post[]> => {
      const db = getDatabase();
      let query = 'SELECT * FROM posts';
      const params: any[] = [];

      if (published !== undefined) {
        query += ' WHERE published = ?';
        params.push(published ? 1 : 0);
      }

      query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      return await db.all(query, ...params);
    },

    post: async (_: unknown, { id }: { id: number }): Promise<Post | undefined> => {
      const db = getDatabase();
      return await db.get('SELECT * FROM posts WHERE id = ?', id);
    },

    postsByAuthor: async (_: unknown, { authorId }: { authorId: number }): Promise<Post[]> => {
      const db = getDatabase();
      return await db.all('SELECT * FROM posts WHERE authorId = ? ORDER BY createdAt DESC', authorId);
    },

    postsByCategory: async (_: unknown, { categoryId }: { categoryId: number }): Promise<Post[]> => {
      const db = getDatabase();
      return await db.all('SELECT * FROM posts WHERE categoryId = ? ORDER BY createdAt DESC', categoryId);
    },

    postsByTag: async (_: unknown, { tagId }: { tagId: number }): Promise<Post[]> => {
      const db = getDatabase();
      return await db.all(
        `SELECT p.* FROM posts p
         INNER JOIN post_tags pt ON p.id = pt.postId
         WHERE pt.tagId = ?
         ORDER BY p.createdAt DESC`,
        tagId
      );
    },

    searchPosts: async (_: unknown, { query }: { query: string }): Promise<Post[]> => {
      const db = getDatabase();
      const searchTerm = `%${query}%`;
      return await db.all(
        'SELECT * FROM posts WHERE (title LIKE ? OR content LIKE ?) AND published = 1 ORDER BY createdAt DESC',
        searchTerm,
        searchTerm
      );
    },

    // Comment queries
    comments: async (): Promise<Comment[]> => {
      const db = getDatabase();
      return await db.all('SELECT * FROM comments ORDER BY createdAt DESC');
    },

    comment: async (_: unknown, { id }: { id: number }): Promise<Comment | undefined> => {
      const db = getDatabase();
      return await db.get('SELECT * FROM comments WHERE id = ?', id);
    },

    commentsByPost: async (_: unknown, { postId }: { postId: number }): Promise<Comment[]> => {
      const db = getDatabase();
      return await db.all('SELECT * FROM comments WHERE postId = ? ORDER BY createdAt ASC', postId);
    },

    // Category queries
    categories: async (): Promise<Category[]> => {
      const db = getDatabase();
      return await db.all('SELECT * FROM categories ORDER BY name ASC');
    },

    category: async (_: unknown, { id }: { id: number }): Promise<Category | undefined> => {
      const db = getDatabase();
      return await db.get('SELECT * FROM categories WHERE id = ?', id);
    },

    categoryBySlug: async (_: unknown, { slug }: { slug: string }): Promise<Category | undefined> => {
      const db = getDatabase();
      return await db.get('SELECT * FROM categories WHERE slug = ?', slug);
    },

    // Tag queries
    tags: async (): Promise<Tag[]> => {
      const db = getDatabase();
      return await db.all('SELECT * FROM tags ORDER BY name ASC');
    },

    tag: async (_: unknown, { id }: { id: number }): Promise<Tag | undefined> => {
      const db = getDatabase();
      return await db.get('SELECT * FROM tags WHERE id = ?', id);
    },

    tagBySlug: async (_: unknown, { slug }: { slug: string }): Promise<Tag | undefined> => {
      const db = getDatabase();
      return await db.get('SELECT * FROM tags WHERE slug = ?', slug);
    },

    // Statistics
    stats: async () => {
      const db = getDatabase();
      const [users, posts, comments, likes] = await Promise.all([
        db.get('SELECT COUNT(*) as count FROM users'),
        db.get('SELECT COUNT(*) as count FROM posts'),
        db.get('SELECT COUNT(*) as count FROM comments'),
        db.get('SELECT COUNT(*) as count FROM likes'),
      ]);

      return {
        totalUsers: users.count,
        totalPosts: posts.count,
        totalComments: comments.count,
        totalLikes: likes.count,
      };
    },
  },

  User: {
    posts: async (user: User): Promise<Post[]> => {
      const db = getDatabase();
      return await db.all('SELECT * FROM posts WHERE authorId = ?', user.id);
    },

    comments: async (user: User): Promise<Comment[]> => {
      const db = getDatabase();
      return await db.all('SELECT * FROM comments WHERE authorId = ?', user.id);
    },

    likes: async (user: User): Promise<Like[]> => {
      const db = getDatabase();
      return await db.all('SELECT * FROM likes WHERE userId = ?', user.id);
    },
  },

  Post: {
    author: async (post: Post): Promise<User | undefined> => {
      const db = getDatabase();
      return await db.get('SELECT * FROM users WHERE id = ?', post.authorId);
    },

    category: async (post: Post): Promise<Category | undefined> => {
      if (!post.categoryId) return undefined;
      const db = getDatabase();
      return await db.get('SELECT * FROM categories WHERE id = ?', post.categoryId);
    },

    tags: async (post: Post): Promise<Tag[]> => {
      const db = getDatabase();
      return await db.all(
        `SELECT t.* FROM tags t
         INNER JOIN post_tags pt ON t.id = pt.tagId
         WHERE pt.postId = ?`,
        post.id
      );
    },

    comments: async (post: Post): Promise<Comment[]> => {
      const db = getDatabase();
      return await db.all('SELECT * FROM comments WHERE postId = ?', post.id);
    },

    likes: async (post: Post): Promise<Like[]> => {
      const db = getDatabase();
      return await db.all('SELECT * FROM likes WHERE postId = ?', post.id);
    },

    likeCount: async (post: Post): Promise<number> => {
      const db = getDatabase();
      const result = await db.get('SELECT COUNT(*) as count FROM likes WHERE postId = ?', post.id);
      return result.count;
    },
  },

  Comment: {
    post: async (comment: Comment): Promise<Post | undefined> => {
      const db = getDatabase();
      return await db.get('SELECT * FROM posts WHERE id = ?', comment.postId);
    },

    author: async (comment: Comment): Promise<User | undefined> => {
      const db = getDatabase();
      return await db.get('SELECT * FROM users WHERE id = ?', comment.authorId);
    },

    parent: async (comment: Comment): Promise<Comment | undefined> => {
      if (!comment.parentId) return undefined;
      const db = getDatabase();
      return await db.get('SELECT * FROM comments WHERE id = ?', comment.parentId);
    },

    replies: async (comment: Comment): Promise<Comment[]> => {
      const db = getDatabase();
      return await db.all('SELECT * FROM comments WHERE parentId = ?', comment.id);
    },
  },

  Category: {
    posts: async (category: Category): Promise<Post[]> => {
      const db = getDatabase();
      return await db.all('SELECT * FROM posts WHERE categoryId = ?', category.id);
    },
  },

  Tag: {
    posts: async (tag: Tag): Promise<Post[]> => {
      const db = getDatabase();
      return await db.all(
        `SELECT p.* FROM posts p
         INNER JOIN post_tags pt ON p.id = pt.postId
         WHERE pt.tagId = ?`,
        tag.id
      );
    },
  },

  Like: {
    user: async (like: Like): Promise<User | undefined> => {
      const db = getDatabase();
      return await db.get('SELECT * FROM users WHERE id = ?', like.userId);
    },

    post: async (like: Like): Promise<Post | undefined> => {
      const db = getDatabase();
      return await db.get('SELECT * FROM posts WHERE id = ?', like.postId);
    },
  },

  Mutation: {
    // User mutations
    createUser: async (_: unknown, { input }: { input: any }): Promise<User> => {
      const db = getDatabase();
      const result = await db.run(
        'INSERT INTO users (username, email, fullName, bio, avatar) VALUES (?, ?, ?, ?, ?)',
        [input.username, input.email, input.fullName, input.bio || null, input.avatar || null]
      );
      return (await db.get('SELECT * FROM users WHERE id = ?', result.lastID))!;
    },

    updateUser: async (_: unknown, { id, input }: { id: number; input: any }): Promise<User> => {
      const db = getDatabase();
      const updates: string[] = [];
      const values: any[] = [];

      if (input.username !== undefined) {
        updates.push('username = ?');
        values.push(input.username);
      }
      if (input.email !== undefined) {
        updates.push('email = ?');
        values.push(input.email);
      }
      if (input.fullName !== undefined) {
        updates.push('fullName = ?');
        values.push(input.fullName);
      }
      if (input.bio !== undefined) {
        updates.push('bio = ?');
        values.push(input.bio);
      }
      if (input.avatar !== undefined) {
        updates.push('avatar = ?');
        values.push(input.avatar);
      }

      updates.push('updatedAt = CURRENT_TIMESTAMP');
      values.push(id);

      await db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
      return (await db.get('SELECT * FROM users WHERE id = ?', id))!;
    },

    deleteUser: async (_: unknown, { id }: { id: number }): Promise<boolean> => {
      const db = getDatabase();
      await db.run('DELETE FROM users WHERE id = ?', id);
      return true;
    },

    // Post mutations
    createPost: async (_: unknown, { input }: { input: any }): Promise<Post> => {
      const db = getDatabase();
      const result = await db.run(
        'INSERT INTO posts (title, content, published, authorId, categoryId) VALUES (?, ?, ?, ?, ?)',
        [input.title, input.content, input.published ? 1 : 0, input.authorId, input.categoryId || null]
      );

      const postId = result.lastID!;

      // Add tags if provided
      if (input.tagIds && input.tagIds.length > 0) {
        for (const tagId of input.tagIds) {
          await db.run('INSERT INTO post_tags (postId, tagId) VALUES (?, ?)', [postId, tagId]);
        }
      }

      return (await db.get('SELECT * FROM posts WHERE id = ?', postId))!;
    },

    updatePost: async (_: unknown, { id, input }: { id: number; input: any }): Promise<Post> => {
      const db = getDatabase();
      const updates: string[] = [];
      const values: any[] = [];

      if (input.title !== undefined) {
        updates.push('title = ?');
        values.push(input.title);
      }
      if (input.content !== undefined) {
        updates.push('content = ?');
        values.push(input.content);
      }
      if (input.published !== undefined) {
        updates.push('published = ?');
        values.push(input.published ? 1 : 0);
      }
      if (input.categoryId !== undefined) {
        updates.push('categoryId = ?');
        values.push(input.categoryId);
      }

      updates.push('updatedAt = CURRENT_TIMESTAMP');
      values.push(id);

      await db.run(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`, values);
      return (await db.get('SELECT * FROM posts WHERE id = ?', id))!;
    },

    deletePost: async (_: unknown, { id }: { id: number }): Promise<boolean> => {
      const db = getDatabase();
      await db.run('DELETE FROM posts WHERE id = ?', id);
      return true;
    },

    publishPost: async (_: unknown, { id }: { id: number }): Promise<Post> => {
      const db = getDatabase();
      await db.run('UPDATE posts SET published = 1, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', id);
      return (await db.get('SELECT * FROM posts WHERE id = ?', id))!;
    },

    unpublishPost: async (_: unknown, { id }: { id: number }): Promise<Post> => {
      const db = getDatabase();
      await db.run('UPDATE posts SET published = 0, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', id);
      return (await db.get('SELECT * FROM posts WHERE id = ?', id))!;
    },

    incrementPostView: async (_: unknown, { id }: { id: number }): Promise<Post> => {
      const db = getDatabase();
      await db.run('UPDATE posts SET viewCount = viewCount + 1 WHERE id = ?', id);
      return (await db.get('SELECT * FROM posts WHERE id = ?', id))!;
    },

    // Comment mutations
    createComment: async (_: unknown, { input }: { input: any }): Promise<Comment> => {
      const db = getDatabase();
      const result = await db.run(
        'INSERT INTO comments (content, postId, authorId, parentId) VALUES (?, ?, ?, ?)',
        [input.content, input.postId, input.authorId, input.parentId || null]
      );
      return (await db.get('SELECT * FROM comments WHERE id = ?', result.lastID))!;
    },

    updateComment: async (_: unknown, { id, input }: { id: number; input: any }): Promise<Comment> => {
      const db = getDatabase();
      await db.run(
        'UPDATE comments SET content = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [input.content, id]
      );
      return (await db.get('SELECT * FROM comments WHERE id = ?', id))!;
    },

    deleteComment: async (_: unknown, { id }: { id: number }): Promise<boolean> => {
      const db = getDatabase();
      await db.run('DELETE FROM comments WHERE id = ?', id);
      return true;
    },

    // Like mutations
    likePost: async (_: unknown, { postId, userId }: { postId: number; userId: number }): Promise<Like> => {
      const db = getDatabase();
      const result = await db.run('INSERT INTO likes (userId, postId) VALUES (?, ?)', [userId, postId]);
      return (await db.get('SELECT * FROM likes WHERE id = ?', result.lastID))!;
    },

    unlikePost: async (_: unknown, { postId, userId }: { postId: number; userId: number }): Promise<boolean> => {
      const db = getDatabase();
      await db.run('DELETE FROM likes WHERE userId = ? AND postId = ?', [userId, postId]);
      return true;
    },

    // Category mutations
    createCategory: async (_: unknown, { input }: { input: any }): Promise<Category> => {
      const db = getDatabase();
      const result = await db.run(
        'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
        [input.name, input.slug, input.description || null]
      );
      return (await db.get('SELECT * FROM categories WHERE id = ?', result.lastID))!;
    },

    updateCategory: async (_: unknown, { id, input }: { id: number; input: any }): Promise<Category> => {
      const db = getDatabase();
      const updates: string[] = [];
      const values: any[] = [];

      if (input.name !== undefined) {
        updates.push('name = ?');
        values.push(input.name);
      }
      if (input.slug !== undefined) {
        updates.push('slug = ?');
        values.push(input.slug);
      }
      if (input.description !== undefined) {
        updates.push('description = ?');
        values.push(input.description);
      }

      values.push(id);

      await db.run(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`, values);
      return (await db.get('SELECT * FROM categories WHERE id = ?', id))!;
    },

    deleteCategory: async (_: unknown, { id }: { id: number }): Promise<boolean> => {
      const db = getDatabase();
      await db.run('DELETE FROM categories WHERE id = ?', id);
      return true;
    },

    // Tag mutations
    createTag: async (_: unknown, { input }: { input: any }): Promise<Tag> => {
      const db = getDatabase();
      const result = await db.run('INSERT INTO tags (name, slug) VALUES (?, ?)', [input.name, input.slug]);
      return (await db.get('SELECT * FROM tags WHERE id = ?', result.lastID))!;
    },

    addTagToPost: async (_: unknown, { postId, tagId }: { postId: number; tagId: number }): Promise<Post> => {
      const db = getDatabase();
      await db.run('INSERT INTO post_tags (postId, tagId) VALUES (?, ?)', [postId, tagId]);
      return (await db.get('SELECT * FROM posts WHERE id = ?', postId))!;
    },

    removeTagFromPost: async (_: unknown, { postId, tagId }: { postId: number; tagId: number }): Promise<Post> => {
      const db = getDatabase();
      await db.run('DELETE FROM post_tags WHERE postId = ? AND tagId = ?', [postId, tagId]);
      return (await db.get('SELECT * FROM posts WHERE id = ?', postId))!;
    },
  },
};
