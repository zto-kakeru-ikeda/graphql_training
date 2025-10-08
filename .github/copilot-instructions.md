# GraphQL Training Project - Copilot Instructions

## プロジェクト概要

このリポジトリは **GraphQLの学習と実験を目的としたトレーニングプロジェクト** です。
モノレポ構成で、GraphQLサーバーとクライアントの両方を含んでいます。

## プロジェクト構造

```
graphql_training/
├── server/          # GraphQL API サーバー (Node.js + TypeScript + Apollo Server + SQLite)
│   ├── src/
│   │   ├── database/    # データベース関連
│   │   ├── graphql/     # スキーマとリゾルバー
│   │   ├── types/       # TypeScript型定義
│   │   └── index.ts     # エントリーポイント
│   └── database.db      # SQLiteデータベースファイル
│
└── client/          # Webフロントエンド (Vue 3 + TypeScript + Apollo Client)
    ├── src/
    │   ├── views/       # ページコンポーネント
    │   ├── graphql/     # GraphQLクエリ定義
    │   ├── router/      # Vue Router設定
    │   └── apollo.ts    # Apollo Client設定
    └── ...
```

## プロジェクトの目的

### ✅ これは学習・実験用プロジェクトです
- GraphQLの機能を試すための**サンドボックス環境**
- 新しいクエリ、ミューテーション、リゾルバーの実装練習
- Vue 3 Composition API + Apollo Clientの学習
- データベース操作とGraphQLの統合理解

### ❌ これは本番環境向けではありません
- 認証・認可機能は実装されていない
- セキュリティ対策は最小限
- エラーハンドリングは基本的なもののみ
- パフォーマンス最適化（DataLoaderなど）は未実装

## 技術スタック

### Server (`/server`)
- **Runtime**: Node.js
- **Language**: TypeScript
- **GraphQL Server**: Apollo Server v4
- **Web Framework**: Express.js
- **Database**: SQLite (開発用軽量DB)
- **ORM**: なし（直接SQL実行）

### Client (`/client`)
- **Framework**: Vue 3
- **Language**: TypeScript
- **GraphQL Client**: Apollo Client
- **Routing**: Vue Router
- **Build Tool**: Vite

## データベース構造

SQLiteに以下のテーブルが存在：
- `users` - ユーザー情報
- `posts` - 記事
- `comments` - コメント（親子関係サポート）
- `categories` - カテゴリ
- `tags` - タグ
- `post_tags` - 記事とタグの中間テーブル
- `likes` - いいね

### テストデータ
- 10人のユーザー
- 20件の記事
- 34件のコメント（返信含む）
- 10カテゴリ
- 12タグ
- 53いいね

## コーディングガイドライン

### 1. サーバー側の開発 (`/server`)

#### GraphQLスキーマの拡張
```typescript
// src/graphql/typeDefs.ts にスキーマを追加
export const typeDefs = gql`
  type NewType {
    id: ID!
    field: String!
  }
  
  extend type Query {
    newQuery: [NewType!]!
  }
`;
```

#### リゾルバーの実装
```typescript
// src/graphql/resolvers.ts にリゾルバーを追加
export const resolvers = {
  Query: {
    newQuery: async () => {
      const db = getDatabase();
      return await db.all('SELECT * FROM table');
    },
  },
};
```

#### データベース操作
- SQLiteの直接操作を使用（ORMなし）
- `getDatabase()` でDB接続を取得
- シード処理は `npm run seed` で実行可能

### 2. クライアント側の開発 (`/client`)

#### GraphQLクエリの定義
```typescript
// src/graphql/queries.ts にクエリを追加
export const GET_SOMETHING = gql`
  query GetSomething {
    something {
      id
      field
    }
  }
`;
```

#### Vueコンポーネントでの使用
```vue
<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable';
import { GET_SOMETHING } from '../graphql/queries';

const { result, loading, error } = useQuery(GET_SOMETHING);
</script>
```

### 3. モノレポ運用

#### 両サーバーの起動
```bash
# Terminal 1: GraphQLサーバー
cd server && npm run dev

# Terminal 2: Vueクライアント
cd client && npm run dev
```

#### ポート設定
- **Server**: `http://localhost:4000/graphql`
- **Client**: `http://localhost:5173/`

### 4. 新機能追加のワークフロー

1. **サーバー側**:
   - スキーマ定義を追加 (`typeDefs.ts`)
   - リゾルバーを実装 (`resolvers.ts`)
   - 必要に応じてデータベースマイグレーション

2. **クライアント側**:
   - GraphQLクエリを定義 (`queries.ts`)
   - Vueコンポーネントを作成/更新 (`views/`)
   - ルーティングを追加（必要な場合）

3. **テスト**:
   - Apollo Sandbox (`http://localhost:4000/graphql`) でクエリをテスト
   - ブラウザでUIを確認

## 学習に適した実装例

### ✅ 試すべきこと
- ネストされたクエリの作成
- フィルタリング・ソート・ページネーション
- ミューテーションの実装
- リレーション（1対多、多対多）の理解
- N+1問題の発生と解決（DataLoader導入）
- エラーハンドリングの改善
- カスタムスカラー型の追加
- Subscriptionの実装（リアルタイム更新）

### ✅ 追加できる機能
- ユーザー認証（JWT）
- 記事の作成・編集・削除UI
- コメント投稿機能
- 検索機能の強化
- ファイルアップロード
- 統計ダッシュボード
- フォロー機能

## コード補完時の注意点

### 型安全性
- すべてのコードはTypeScriptで記述
- GraphQLのスキーマと型定義の整合性を保つ
- `any` 型の使用は最小限に

### データベース操作
- 基本的にはSQLiteの `db.all()`, `db.get()`, `db.run()` を使用
- プリペアドステートメントを使用してSQLインジェクション対策
- トランザクションが必要な場合は適切に実装

### GraphQLのベストプラクティス
- クエリ名は動詞+名詞（例: `getUsers`, `createPost`）
- ミューテーション名は動詞+名詞（例: `createUser`, `updatePost`）
- フィールド名はキャメルケース
- スキーマの変更は後方互換性を考慮（学習環境なので破壊的変更もOK）

## よくある実装パターン

### パターン1: 新しいエンティティの追加
1. データベーステーブルを作成（`connection.ts`）
2. TypeScript型定義を追加（`types/models.ts`）
3. GraphQLスキーマを定義（`typeDefs.ts`）
4. リゾルバーを実装（`resolvers.ts`）
5. シードデータを追加（`seed.ts`）
6. クライアント側のクエリを追加
7. UIコンポーネントを作成

### パターン2: リレーションの追加
1. 中間テーブルの作成（多対多の場合）
2. リゾルバーでJOINクエリを実装
3. ネストされたクエリで取得可能に

### パターン3: フィルタリング機能の追加
1. スキーマに引数を追加
2. リゾルバーでWHERE句を動的に構築
3. クライアント側で引数を渡す

## セットアップコマンド

```bash
# サーバーのセットアップ
cd server
npm install
npm run seed  # テストデータ投入
npm run dev   # 開発サーバー起動

# クライアントのセットアップ
cd client
npm install
npm run dev   # 開発サーバー起動
```

## トラブルシューティング

### ポートが使用中の場合
```bash
# プロセスを確認
lsof -ti:4000  # サーバー
lsof -ti:5173  # クライアント

# プロセスを終了
kill -9 <PID>
```

### データベースをリセット
```bash
cd server
rm database.db
npm run seed
```

### CORSエラーの場合
サーバー側で既にCORS設定済み。問題がある場合は `src/index.ts` を確認。

## まとめ

このプロジェクトは **実験と学習のためのサンドボックス** です。
- 自由に機能を追加・変更してOK
- エラーが出ても気にせず試行錯誤
- GraphQLの様々な機能を試す
- コードの品質よりも学習を優先

**積極的に壊して、直して、学びましょう！** 🚀
