# GraphQL Server with Apollo Server & SQLite

Node.js、TypeScript、Express.js、Apollo Server、SQLiteを使用したGraphQLサーバーのハンズオンプロジェクトです。

## 📋 概要

このプロジェクトは、ブログシステムを模したGraphQL APIサーバーです。以下の機能を持っています:

- **ユーザー管理**: ユーザーの作成、更新、削除、取得
- **記事管理**: 記事の作成、更新、削除、公開/非公開、検索
- **コメント**: 記事へのコメント投稿と返信機能
- **カテゴリとタグ**: 記事の分類管理
- **いいね機能**: 記事へのいいね/いいね解除
- **統計情報**: システム全体の統計データ取得

## 🗂️ データベース構造

- **Users** (10人のユーザー)
- **Posts** (20件の記事)
- **Comments** (34件のコメント、返信機能付き)
- **Categories** (10カテゴリ)
- **Tags** (12タグ)
- **Likes** (48いいね)
- **Post-Tag関連** (多対多)

## 🚀 セットアップと実行

### 1. 依存関係のインストール

```bash
cd server
npm install
```

### 2. データベースの初期化とシード

```bash
npm run seed
```

このコマンドで以下が実行されます:
- SQLiteデータベースファイル(`database.db`)の作成
- テーブルの作成
- 潤沢なテストデータの投入

### 3. 開発サーバーの起動

```bash
npm run dev
```

サーバーが起動すると、以下のURLでアクセスできます:
- **GraphQL Endpoint**: `http://localhost:4000/graphql`
- **Health Check**: `http://localhost:4000/health`

### 4. 本番用ビルド

```bash
npm run build
npm start
```

## 📖 GraphQLクエリの例

### ユーザー一覧の取得

```graphql
query {
  users {
    id
    username
    fullName
    email
    bio
    posts {
      id
      title
    }
  }
}
```

### 特定の記事を取得

```graphql
query {
  post(id: "1") {
    id
    title
    content
    published
    viewCount
    likeCount
    author {
      username
      fullName
    }
    category {
      name
    }
    tags {
      name
    }
    comments {
      id
      content
      author {
        username
      }
    }
  }
}
```

### 記事の検索

```graphql
query {
  searchPosts(query: "GraphQL") {
    id
    title
    content
    author {
      username
    }
  }
}
```

### 公開済み記事の取得（ページネーション）

```graphql
query {
  posts(published: true, limit: 10, offset: 0) {
    id
    title
    author {
      username
    }
    likeCount
    viewCount
  }
}
```

### カテゴリ別の記事取得

```graphql
query {
  postsByCategory(categoryId: "5") {
    id
    title
    category {
      name
      slug
    }
  }
}
```

### 統計情報の取得

```graphql
query {
  stats {
    totalUsers
    totalPosts
    totalComments
    totalLikes
  }
}
```

## 🔧 Mutationの例

### ユーザーの作成

```graphql
mutation {
  createUser(input: {
    username: "newuser"
    email: "newuser@example.com"
    fullName: "新規ユーザー"
    bio: "自己紹介文"
  }) {
    id
    username
    fullName
  }
}
```

### 記事の作成

```graphql
mutation {
  createPost(input: {
    title: "新しい記事"
    content: "記事の内容です。"
    published: true
    authorId: "1"
    categoryId: "5"
    tagIds: ["1", "2"]
  }) {
    id
    title
    author {
      username
    }
    tags {
      name
    }
  }
}
```

### コメントの作成

```graphql
mutation {
  createComment(input: {
    content: "素晴らしい記事ですね！"
    postId: "1"
    authorId: "2"
  }) {
    id
    content
    author {
      username
    }
    post {
      title
    }
  }
}
```

### 記事にいいねする

```graphql
mutation {
  likePost(postId: "1", userId: "3") {
    id
    user {
      username
    }
    post {
      title
      likeCount
    }
  }
}
```

### 記事の閲覧数を増やす

```graphql
mutation {
  incrementPostView(id: "1") {
    id
    title
    viewCount
  }
}
```

## 🏗️ プロジェクト構造

```
server/
├── src/
│   ├── database/
│   │   ├── connection.ts    # データベース接続とスキーマ初期化
│   │   └── seed.ts          # テストデータの投入スクリプト
│   ├── graphql/
│   │   ├── typeDefs.ts      # GraphQLスキーマ定義
│   │   └── resolvers.ts     # リゾルバー関数
│   ├── types/
│   │   └── models.ts        # TypeScript型定義
│   └── index.ts             # サーバーエントリーポイント
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 GraphQLの学習ポイント

### 1. **スキーマファースト設計**
`src/graphql/typeDefs.ts`でGraphQLスキーマを定義しています。型安全性が保証されます。

### 2. **リゾルバーパターン**
`src/graphql/resolvers.ts`で各フィールドのデータ取得ロジックを実装しています。

### 3. **ネストされたクエリ**
GraphQLの強力な機能である、ネストされたデータ取得を実装しています:

```graphql
query {
  post(id: "1") {
    title
    author {
      username
      posts {
        title
      }
    }
    comments {
      content
      author {
        username
      }
      replies {
        content
      }
    }
  }
}
```

### 4. **リレーション**
- **1対多**: User → Posts, Post → Comments
- **多対1**: Post → User (author), Post → Category
- **多対多**: Post ↔ Tags
- **自己参照**: Comment → Comment (親子関係)

### 5. **フィルタリングと検索**
- 公開/非公開のフィルタリング
- 全文検索
- カテゴリ/タグによる絞り込み
- ページネーション (limit/offset)

## 💡 学習のヒント

1. **Apollo Sandboxを使用**: ブラウザで `http://localhost:4000/graphql` にアクセスすると、インタラクティブなGraphQLエディタが使えます。

2. **スキーマを確認**: Sandboxの「Schema」タブで、利用可能なすべてのQuery、Mutation、Typeを確認できます。

3. **段階的にクエリを構築**: 最初はシンプルなクエリから始めて、徐々にネストを深くしていきましょう。

4. **N+1問題に注意**: 本プロジェクトでは簡易実装ですが、実際のプロダクションではDataLoaderの使用を検討してください。

## 📝 注意事項

- このプロジェクトは学習目的です
- 認証機能は実装されていません
- エラーハンドリングは最小限です
- 本番環境での使用には、追加のセキュリティ対策が必要です

## 🔗 関連リソース

- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Documentation](https://graphql.org/learn/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

Happy Learning! 🎉
