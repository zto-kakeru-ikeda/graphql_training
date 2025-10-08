import gql from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    fullName: String!
    bio: String
    avatar: String
    posts: [Post!]!
    comments: [Comment!]!
    likes: [Like!]!
    dislikes: [Dislike!]!
    createdAt: String!
    updatedAt: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    author: User!
    category: Category
    tags: [Tag!]!
    comments: [Comment!]!
    likes: [Like!]!
    likeCount: Int!
    dislikes: [Dislike!]!
    dislikeCount: Int!
    viewCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Comment {
    id: ID!
    content: String!
    post: Post!
    author: User!
    parent: Comment
    replies: [Comment!]!
    createdAt: String!
    updatedAt: String!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    posts: [Post!]!
    createdAt: String!
  }

  type Tag {
    id: ID!
    name: String!
    slug: String!
    posts: [Post!]!
    createdAt: String!
  }

  type Like {
    id: ID!
    user: User!
    post: Post!
    createdAt: String!
  }

  type Dislike {
    id: ID!
    user: User!
    post: Post!
    createdAt: String!
  }

  type AuthPayload {
    user: User!
    message: String!
  }

  type Query {
    # User queries
    users: [User!]!
    user(id: ID!): User
    userByUsername(username: String!): User

    # Post queries
    posts(published: Boolean, limit: Int, offset: Int): [Post!]!
    post(id: ID!): Post
    postsByAuthor(authorId: ID!): [Post!]!
    postsByCategory(categoryId: ID!): [Post!]!
    postsByTag(tagId: ID!): [Post!]!
    searchPosts(query: String!): [Post!]!

    # Comment queries
    comments: [Comment!]!
    comment(id: ID!): Comment
    commentsByPost(postId: ID!): [Comment!]!

    # Category queries
    categories: [Category!]!
    category(id: ID!): Category
    categoryBySlug(slug: String!): Category

    # Tag queries
    tags: [Tag!]!
    tag(id: ID!): Tag
    tagBySlug(slug: String!): Tag

    # Statistics
    stats: Stats!
  }

  type Stats {
    totalUsers: Int!
    totalPosts: Int!
    totalComments: Int!
    totalLikes: Int!
    totalDislikes: Int!
  }

  type Mutation {
    # Authentication
    login(username: String!, email: String!): AuthPayload!

    # User mutations
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!

    # Post mutations
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): Boolean!
    publishPost(id: ID!): Post!
    unpublishPost(id: ID!): Post!
    incrementPostView(id: ID!): Post!

    # Comment mutations
    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: ID!, input: UpdateCommentInput!): Comment!
    deleteComment(id: ID!): Boolean!

    # Like mutations
    likePost(postId: ID!, userId: ID!): Like!
    unlikePost(postId: ID!, userId: ID!): Boolean!

    # Dislike mutations
    dislikePost(postId: ID!, userId: ID!): Dislike!
    undislikePost(postId: ID!, userId: ID!): Boolean!

    # Category mutations
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!

    # Tag mutations
    createTag(input: CreateTagInput!): Tag!
    addTagToPost(postId: ID!, tagId: ID!): Post!
    removeTagFromPost(postId: ID!, tagId: ID!): Post!
  }

  input CreateUserInput {
    username: String!
    email: String!
    fullName: String!
    bio: String
    avatar: String
  }

  input UpdateUserInput {
    username: String
    email: String
    fullName: String
    bio: String
    avatar: String
  }

  input CreatePostInput {
    title: String!
    content: String!
    published: Boolean
    authorId: ID!
    categoryId: ID
    tagIds: [ID!]
  }

  input UpdatePostInput {
    title: String
    content: String
    published: Boolean
    categoryId: ID
  }

  input CreateCommentInput {
    content: String!
    postId: ID!
    authorId: ID!
    parentId: ID
  }

  input UpdateCommentInput {
    content: String!
  }

  input CreateCategoryInput {
    name: String!
    slug: String!
    description: String
  }

  input UpdateCategoryInput {
    name: String
    slug: String
    description: String
  }

  input CreateTagInput {
    name: String!
    slug: String!
  }
`;
