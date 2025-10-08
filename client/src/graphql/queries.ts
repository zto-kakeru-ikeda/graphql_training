import gql from 'graphql-tag';

// ログイン
export const LOGIN = gql`
  mutation Login($username: String!, $email: String!) {
    login(username: $username, email: $email) {
      user {
        id
        username
        fullName
        email
        avatar
        bio
      }
      message
    }
  }
`;

// ユーザー一覧取得
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      fullName
      email
      bio
      avatar
      posts {
        id
        title
      }
    }
  }
`;

// 記事一覧取得
export const GET_POSTS = gql`
  query GetPosts($published: Boolean, $limit: Int, $offset: Int) {
    posts(published: $published, limit: $limit, offset: $offset) {
      id
      title
      content
      published
      viewCount
      likeCount
      dislikeCount
      createdAt
      author {
        id
        username
        fullName
        avatar
      }
      category {
        id
        name
        slug
      }
      tags {
        id
        name
        slug
      }
    }
  }
`;

// 記事詳細取得
export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      published
      viewCount
      likeCount
      dislikeCount
      createdAt
      updatedAt
      author {
        id
        username
        fullName
        avatar
        bio
      }
      category {
        id
        name
        slug
        description
      }
      tags {
        id
        name
        slug
      }
      comments {
        id
        content
        createdAt
        author {
          id
          username
          fullName
          avatar
        }
        replies {
          id
          content
          createdAt
          author {
            id
            username
            fullName
          }
        }
      }
    }
  }
`;

// 統計情報取得
export const GET_STATS = gql`
  query GetStats {
    stats {
      totalUsers
      totalPosts
      totalComments
      totalLikes
      totalDislikes
    }
  }
`;

// コメント作成
export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      createdAt
      author {
        id
        username
        fullName
      }
      post {
        id
        title
      }
    }
  }
`;

// いいね
export const LIKE_POST = gql`
  mutation LikePost($postId: ID!, $userId: ID!) {
    likePost(postId: $postId, userId: $userId) {
      id
      user {
        id
        username
      }
      post {
        id
        likeCount
      }
    }
  }
`;

// よくないね
export const DISLIKE_POST = gql`
  mutation DislikePost($postId: ID!, $userId: ID!) {
    dislikePost(postId: $postId, userId: $userId) {
      id
      user {
        id
        username
      }
      post {
        id
        dislikeCount
      }
    }
  }
`;

// いいね解除
export const UNLIKE_POST = gql`
  mutation UnlikePost($postId: ID!, $userId: ID!) {
    unlikePost(postId: $postId, userId: $userId)
  }
`;

// よくないね解除
export const UNDISLIKE_POST = gql`
  mutation UndislikePost($postId: ID!, $userId: ID!) {
    undislikePost(postId: $postId, userId: $userId)
  }
`;

// 閲覧数を増やす
export const INCREMENT_POST_VIEW = gql`
  mutation IncrementPostView($id: ID!) {
    incrementPostView(id: $id) {
      id
      viewCount
    }
  }
`;

// ユーザー作成
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      email
      fullName
      bio
      avatar
      createdAt
      updatedAt
    }
  }
`;

// ユーザー更新
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      username
      email
      fullName
      bio
      avatar
      updatedAt
    }
  }
`;
