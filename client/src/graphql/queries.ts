import gql from 'graphql-tag';

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

// 閲覧数を増やす
export const INCREMENT_POST_VIEW = gql`
  mutation IncrementPostView($id: ID!) {
    incrementPostView(id: $id) {
      id
      viewCount
    }
  }
`;
