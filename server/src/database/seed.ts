import { initDatabase } from './connection';

async function seed() {
  const db = await initDatabase();

  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await db.exec(`
    DELETE FROM likes;
    DELETE FROM post_tags;
    DELETE FROM comments;
    DELETE FROM posts;
    DELETE FROM tags;
    DELETE FROM categories;
    DELETE FROM users;
  `);

  // Insert Users
  const users = [
    { username: 'tanaka_taro', email: 'tanaka@example.com', fullName: '田中太郎', bio: 'Webエンジニアです。GraphQLとTypeScriptが好きです。', avatar: 'https://i.pravatar.cc/150?img=1' },
    { username: 'suzuki_hanako', email: 'suzuki@example.com', fullName: '鈴木花子', bio: 'フロントエンド開発者。Reactとデザインシステムに興味があります。', avatar: 'https://i.pravatar.cc/150?img=2' },
    { username: 'sato_jiro', email: 'sato@example.com', fullName: '佐藤次郎', bio: 'バックエンドエンジニア。Node.jsとデータベース設計が得意です。', avatar: 'https://i.pravatar.cc/150?img=3' },
    { username: 'watanabe_yuki', email: 'watanabe@example.com', fullName: '渡辺由希', bio: 'フルスタックエンジニア。新しい技術を学ぶのが大好きです。', avatar: 'https://i.pravatar.cc/150?img=4' },
    { username: 'ito_kenji', email: 'ito@example.com', fullName: '伊藤健二', bio: 'DevOpsエンジニア。CI/CDとクラウドインフラに詳しいです。', avatar: 'https://i.pravatar.cc/150?img=5' },
    { username: 'yamamoto_ai', email: 'yamamoto@example.com', fullName: '山本愛', bio: 'データサイエンティスト。機械学習とPythonが専門です。', avatar: 'https://i.pravatar.cc/150?img=6' },
    { username: 'nakamura_ken', email: 'nakamura@example.com', fullName: '中村健', bio: 'モバイルアプリ開発者。React NativeとFlutterを使っています。', avatar: 'https://i.pravatar.cc/150?img=7' },
    { username: 'kobayashi_mei', email: 'kobayashi@example.com', fullName: '小林芽衣', bio: 'UIデザイナー兼フロントエンドエンジニア。', avatar: 'https://i.pravatar.cc/150?img=8' },
    { username: 'kato_takeshi', email: 'kato@example.com', fullName: '加藤武', bio: 'セキュリティエンジニア。安全なアプリケーション開発に情熱を注いでいます。', avatar: 'https://i.pravatar.cc/150?img=9' },
    { username: 'yoshida_rina', email: 'yoshida@example.com', fullName: '吉田里奈', bio: 'プロダクトマネージャー兼エンジニア。', avatar: 'https://i.pravatar.cc/150?img=10' },
  ];

  for (const user of users) {
    await db.run(
      'INSERT INTO users (username, email, fullName, bio, avatar) VALUES (?, ?, ?, ?, ?)',
      [user.username, user.email, user.fullName, user.bio, user.avatar]
    );
  }
  console.log(`✅ Inserted ${users.length} users`);

  // Insert Categories
  const categories = [
    { name: 'JavaScript', slug: 'javascript', description: 'JavaScript関連の記事' },
    { name: 'TypeScript', slug: 'typescript', description: 'TypeScript関連の記事' },
    { name: 'React', slug: 'react', description: 'React関連の記事' },
    { name: 'Node.js', slug: 'nodejs', description: 'Node.js関連の記事' },
    { name: 'GraphQL', slug: 'graphql', description: 'GraphQL関連の記事' },
    { name: 'Database', slug: 'database', description: 'データベース関連の記事' },
    { name: 'DevOps', slug: 'devops', description: 'DevOps関連の記事' },
    { name: 'Design', slug: 'design', description: 'デザイン関連の記事' },
    { name: 'Security', slug: 'security', description: 'セキュリティ関連の記事' },
    { name: 'AI/ML', slug: 'ai-ml', description: '人工知能と機械学習の記事' },
  ];

  for (const category of categories) {
    await db.run(
      'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
      [category.name, category.slug, category.description]
    );
  }
  console.log(`✅ Inserted ${categories.length} categories`);

  // Insert Tags
  const tags = [
    { name: 'チュートリアル', slug: 'tutorial' },
    { name: '初心者向け', slug: 'beginner' },
    { name: '上級者向け', slug: 'advanced' },
    { name: 'ベストプラクティス', slug: 'best-practices' },
    { name: 'パフォーマンス', slug: 'performance' },
    { name: 'テスト', slug: 'testing' },
    { name: 'デプロイ', slug: 'deployment' },
    { name: 'アーキテクチャ', slug: 'architecture' },
    { name: 'ツール', slug: 'tools' },
    { name: 'Tips', slug: 'tips' },
    { name: 'エラー解決', slug: 'troubleshooting' },
    { name: '実践', slug: 'hands-on' },
  ];

  for (const tag of tags) {
    await db.run(
      'INSERT INTO tags (name, slug) VALUES (?, ?)',
      [tag.name, tag.slug]
    );
  }
  console.log(`✅ Inserted ${tags.length} tags`);

  // Insert Posts
  const posts = [
    {
      title: 'GraphQLの基礎から実践まで',
      content: 'GraphQLは、APIのためのクエリ言語であり、既存のデータでクエリを実行するためのランタイムです。この記事では、GraphQLの基本概念から実際のプロジェクトでの活用方法まで、詳しく解説していきます。\n\nまず、GraphQLの最大の特徴は、クライアントが必要なデータを正確に指定できることです。REST APIと異なり、over-fetchingやunder-fetchingの問題を解決できます。',
      published: true,
      authorId: 1,
      categoryId: 5,
      viewCount: 1250,
    },
    {
      title: 'TypeScriptで型安全なコードを書く方法',
      content: 'TypeScriptは、JavaScriptに静的型付けを追加した言語です。大規模なプロジェクトでは、型安全性が非常に重要になります。\n\nこの記事では、TypeScriptの高度な型システムを活用して、より安全で保守性の高いコードを書く方法を紹介します。ジェネリクス、ユニオン型、交差型など、様々な型の使い方を実例とともに解説します。',
      published: true,
      authorId: 1,
      categoryId: 2,
      viewCount: 2100,
    },
    {
      title: 'Reactのパフォーマンス最適化テクニック',
      content: 'Reactアプリケーションのパフォーマンスを向上させるためのテクニックを紹介します。useMemo、useCallback、React.memoの使い分けから、コード分割、遅延読み込みまで、実践的な内容をカバーします。\n\n特に、不要な再レンダリングを防ぐ方法は、大規模なアプリケーションでは必須の知識です。',
      published: true,
      authorId: 2,
      categoryId: 3,
      viewCount: 1800,
    },
    {
      title: 'Node.jsでRESTful APIを構築する',
      content: 'Express.jsを使用して、本格的なRESTful APIを構築する方法を解説します。ルーティング、ミドルウェア、エラーハンドリング、認証など、実務で必要な要素を全て網羅します。\n\nまた、ベストプラクティスに従った設計パターンも紹介します。',
      published: true,
      authorId: 3,
      categoryId: 4,
      viewCount: 1500,
    },
    {
      title: 'SQLiteの基本操作とNode.jsでの活用',
      content: 'SQLiteは軽量で使いやすいデータベースです。この記事では、SQLiteの基本的な操作方法と、Node.jsプロジェクトでの活用方法を紹介します。\n\nファイルベースのデータベースなので、開発環境の構築が簡単です。小規模なプロジェクトやプロトタイプ開発に最適です。',
      published: true,
      authorId: 3,
      categoryId: 6,
      viewCount: 950,
    },
    {
      title: 'GraphQL vs REST API: どちらを選ぶべきか',
      content: 'GraphQLとREST APIの比較記事です。それぞれの長所と短所を詳しく解説し、プロジェクトの特性に応じてどちらを選ぶべきかのガイドラインを提供します。\n\n単純な比較ではなく、実際のユースケースを元に判断基準を示します。',
      published: true,
      authorId: 4,
      categoryId: 5,
      viewCount: 2300,
    },
    {
      title: 'DockerとKubernetesで始めるコンテナ開発',
      content: 'コンテナ技術は現代の開発において必須のスキルとなっています。Dockerの基礎から、Kubernetesを使った本番環境でのデプロイまで、ステップバイステップで解説します。\n\nDevOpsエンジニアを目指す方に最適な内容です。',
      published: true,
      authorId: 5,
      categoryId: 7,
      viewCount: 1700,
    },
    {
      title: 'UIデザインシステムの構築方法',
      content: 'デザインシステムは、一貫性のあるUIを構築するために不可欠です。この記事では、デザインシステムの設計から実装まで、実践的なアプローチを紹介します。\n\nStorybookを使ったコンポーネント管理や、デザイントークンの活用方法も解説します。',
      published: true,
      authorId: 8,
      categoryId: 8,
      viewCount: 1400,
    },
    {
      title: 'Webアプリケーションのセキュリティベストプラクティス',
      content: 'Webアプリケーションのセキュリティは非常に重要です。XSS、CSRF、SQLインジェクションなどの一般的な脆弱性と、その対策方法を詳しく解説します。\n\nOWASP Top 10を基に、実務で役立つセキュリティ対策を紹介します。',
      published: true,
      authorId: 9,
      categoryId: 9,
      viewCount: 1100,
    },
    {
      title: '機械学習モデルをWeb APIとして公開する方法',
      content: 'Pythonで作成した機械学習モデルを、FastAPIを使ってWeb APIとして公開する方法を解説します。モデルのデプロイから、スケーリング、監視まで、実践的な内容をカバーします。',
      published: true,
      authorId: 6,
      categoryId: 10,
      viewCount: 1600,
    },
    {
      title: 'React Nativeでクロスプラットフォームアプリ開発',
      content: 'React Nativeを使えば、一つのコードベースでiOSとAndroidアプリを開発できます。この記事では、React Nativeの基礎から、ネイティブモジュールの統合まで解説します。',
      published: true,
      authorId: 7,
      categoryId: 3,
      viewCount: 1350,
    },
    {
      title: 'Apollo Clientでクライアント状態管理',
      content: 'Apollo Clientは、GraphQLクライアントとして最も人気のあるライブラリです。サーバーからのデータ取得だけでなく、ローカル状態管理にも使えます。\n\nこの記事では、Apollo Clientの高度な機能を活用して、効率的な状態管理を実現する方法を紹介します。',
      published: true,
      authorId: 2,
      categoryId: 5,
      viewCount: 890,
    },
    {
      title: 'CI/CDパイプラインの構築実践ガイド',
      content: 'GitHub ActionsとAWS CodePipelineを使用したCI/CDパイプラインの構築方法を解説します。自動テスト、ビルド、デプロイまでの一連のフローを自動化します。',
      published: true,
      authorId: 5,
      categoryId: 7,
      viewCount: 1450,
    },
    {
      title: 'MongoDBとNode.jsで始めるNoSQLデータベース',
      content: 'MongoDBは、柔軟なスキーマを持つNoSQLデータベースです。Mongooseを使用したNode.jsアプリケーションでの活用方法を、実例を交えて解説します。',
      published: true,
      authorId: 3,
      categoryId: 6,
      viewCount: 1200,
    },
    {
      title: 'JavaScriptの最新機能ES2023まとめ',
      content: 'ES2023で追加された新機能を紹介します。Array.prototype.toSorted()、Array.prototype.findLast()などの便利なメソッドや、WeakMapの新機能などを実例とともに解説します。',
      published: true,
      authorId: 1,
      categoryId: 1,
      viewCount: 2500,
    },
    {
      title: 'Next.jsでSEO対応のWebサイトを作る',
      content: 'Next.jsを使用したSEO対応のWebサイト構築方法を解説します。SSR、SSG、ISRの使い分けから、メタタグの最適化まで、実践的な内容をカバーします。',
      published: false,
      authorId: 4,
      categoryId: 3,
      viewCount: 0,
    },
    {
      title: 'TypeScriptの高度な型テクニック',
      content: 'Conditional Types、Mapped Types、Template Literal Typesなど、TypeScriptの高度な型機能を活用したテクニックを紹介します。型レベルプログラミングの世界へようこそ。',
      published: true,
      authorId: 1,
      categoryId: 2,
      viewCount: 1750,
    },
    {
      title: 'GraphQLのN+1問題とDataLoaderによる解決',
      content: 'GraphQLでよく発生するN+1問題について、その原因と解決方法を詳しく解説します。DataLoaderを使った効率的なデータ取得の実装方法を紹介します。',
      published: true,
      authorId: 4,
      categoryId: 5,
      viewCount: 1650,
    },
    {
      title: 'Prismaで型安全なデータベース操作',
      content: 'Prismaは、次世代のTypeScript対応ORMです。型安全なデータベース操作、マイグレーション管理、優れた開発体験を提供します。実際のプロジェクトでの活用方法を解説します。',
      published: true,
      authorId: 3,
      categoryId: 6,
      viewCount: 1580,
    },
    {
      title: 'Reactのカスタムフックでロジックを再利用',
      content: 'カスタムフックは、Reactのロジックを再利用可能にする強力な機能です。実用的なカスタムフックの例を多数紹介し、設計のベストプラクティスを解説します。',
      published: true,
      authorId: 2,
      categoryId: 3,
      viewCount: 1920,
    },
  ];

  for (const post of posts) {
    await db.run(
      'INSERT INTO posts (title, content, published, authorId, categoryId, viewCount) VALUES (?, ?, ?, ?, ?, ?)',
      [post.title, post.content, post.published ? 1 : 0, post.authorId, post.categoryId, post.viewCount]
    );
  }
  console.log(`✅ Inserted ${posts.length} posts`);

  // Insert Post Tags (many-to-many relationship)
  const postTagRelations = [
    { postId: 1, tagId: 1 }, { postId: 1, tagId: 2 }, { postId: 1, tagId: 12 },
    { postId: 2, tagId: 4 }, { postId: 2, tagId: 3 },
    { postId: 3, tagId: 5 }, { postId: 3, tagId: 4 },
    { postId: 4, tagId: 1 }, { postId: 4, tagId: 2 },
    { postId: 5, tagId: 1 }, { postId: 5, tagId: 2 }, { postId: 5, tagId: 12 },
    { postId: 6, tagId: 4 }, { postId: 6, tagId: 8 },
    { postId: 7, tagId: 1 }, { postId: 7, tagId: 7 }, { postId: 7, tagId: 9 },
    { postId: 8, tagId: 4 }, { postId: 8, tagId: 9 },
    { postId: 9, tagId: 4 }, { postId: 9, tagId: 3 },
    { postId: 10, tagId: 1 }, { postId: 10, tagId: 3 }, { postId: 10, tagId: 12 },
    { postId: 11, tagId: 1 }, { postId: 11, tagId: 2 },
    { postId: 12, tagId: 4 }, { postId: 12, tagId: 3 },
    { postId: 13, tagId: 7 }, { postId: 13, tagId: 9 }, { postId: 13, tagId: 4 },
    { postId: 14, tagId: 1 }, { postId: 14, tagId: 2 },
    { postId: 15, tagId: 10 }, { postId: 15, tagId: 2 },
    { postId: 17, tagId: 3 }, { postId: 17, tagId: 4 },
    { postId: 18, tagId: 4 }, { postId: 18, tagId: 5 }, { postId: 18, tagId: 3 },
    { postId: 19, tagId: 4 }, { postId: 19, tagId: 9 },
    { postId: 20, tagId: 4 }, { postId: 20, tagId: 12 },
  ];

  for (const relation of postTagRelations) {
    await db.run(
      'INSERT INTO post_tags (postId, tagId) VALUES (?, ?)',
      [relation.postId, relation.tagId]
    );
  }
  console.log(`✅ Inserted ${postTagRelations.length} post-tag relations`);

  // Insert Comments
  const comments = [
    { content: 'とても分かりやすい記事でした！GraphQLを始めるのに最適です。', postId: 1, authorId: 2, parentId: null },
    { content: '実践的な内容が多くて助かります。', postId: 1, authorId: 3, parentId: null },
    { content: 'ありがとうございます！続編も期待しています。', postId: 1, authorId: 1, parentId: 1 },
    { content: 'TypeScriptの型システムは奥が深いですね。', postId: 2, authorId: 4, parentId: null },
    { content: '業務で活用できそうです。', postId: 2, authorId: 5, parentId: null },
    { content: 'パフォーマンス最適化は重要ですね！', postId: 3, authorId: 1, parentId: null },
    { content: 'useMemoとuseCallbackの使い分けが理解できました。', postId: 3, authorId: 7, parentId: null },
    { content: 'RESTful APIの設計パターンが参考になりました。', postId: 4, authorId: 2, parentId: null },
    { content: 'SQLiteは開発環境で本当に便利ですよね。', postId: 5, authorId: 6, parentId: null },
    { content: '私もプロトタイプでよく使っています。', postId: 5, authorId: 8, parentId: 9 },
    { content: 'GraphQLとRESTの比較、すごく分かりやすいです。', postId: 6, authorId: 3, parentId: null },
    { content: 'プロジェクトの選定に役立ちました。', postId: 6, authorId: 7, parentId: null },
    { content: 'Dockerは最初難しかったですが、この記事でだいぶ理解できました。', postId: 7, authorId: 9, parentId: null },
    { content: 'デザインシステムの構築は時間がかかりますが、長期的には価値がありますね。', postId: 8, authorId: 4, parentId: null },
    { content: 'Storybookの活用例が参考になりました。', postId: 8, authorId: 2, parentId: null },
    { content: 'セキュリティは常に意識しないといけないですね。', postId: 9, authorId: 1, parentId: null },
    { content: 'OWASP Top 10は定期的にチェックしています。', postId: 9, authorId: 5, parentId: null },
    { content: '機械学習モデルのデプロイ、興味深いです。', postId: 10, authorId: 3, parentId: null },
    { content: 'FastAPIは本当に使いやすいですよね。', postId: 10, authorId: 6, parentId: 18 },
    { content: 'React Nativeでアプリ開発してみたいです。', postId: 11, authorId: 8, parentId: null },
    { content: 'Apollo Clientの状態管理、もっと深く知りたいです。', postId: 12, authorId: 1, parentId: null },
    { content: 'CI/CDは開発効率を大きく向上させますね。', postId: 13, authorId: 4, parentId: null },
    { content: 'GitHub Actions使いやすいです。', postId: 13, authorId: 10, parentId: 22 },
    { content: 'MongoDBの柔軟性は魅力的ですね。', postId: 14, authorId: 2, parentId: null },
    { content: 'ES2023の新機能、知らないものがありました。', postId: 15, authorId: 5, parentId: null },
    { content: 'findLast()は便利そうです。', postId: 15, authorId: 7, parentId: 25 },
    { content: 'Next.jsのSEO対応、参考になりました。', postId: 16, authorId: 3, parentId: null },
    { content: 'TypeScriptの型テクニック、高度ですね。', postId: 17, authorId: 6, parentId: null },
    { content: 'Template Literal Typesは便利です。', postId: 17, authorId: 4, parentId: 28 },
    { content: 'N+1問題はよく遭遇します。DataLoader使ってみます。', postId: 18, authorId: 8, parentId: null },
    { content: 'Prismaは型安全性が素晴らしいですね。', postId: 19, authorId: 1, parentId: null },
    { content: '次のプロジェクトで使ってみたいです。', postId: 19, authorId: 9, parentId: 31 },
    { content: 'カスタムフックでコードがすっきりしました。', postId: 20, authorId: 5, parentId: null },
    { content: '再利用性が高まりますね。', postId: 20, authorId: 10, parentId: 33 },
  ];

  for (const comment of comments) {
    await db.run(
      'INSERT INTO comments (content, postId, authorId, parentId) VALUES (?, ?, ?, ?)',
      [comment.content, comment.postId, comment.authorId, comment.parentId]
    );
  }
  console.log(`✅ Inserted ${comments.length} comments`);

  // Insert Likes
  const likes = [
    { userId: 2, postId: 1 }, { userId: 3, postId: 1 }, { userId: 4, postId: 1 }, { userId: 5, postId: 1 },
    { userId: 1, postId: 2 }, { userId: 4, postId: 2 }, { userId: 5, postId: 2 }, { userId: 6, postId: 2 },
    { userId: 1, postId: 3 }, { userId: 3, postId: 3 }, { userId: 7, postId: 3 },
    { userId: 2, postId: 4 }, { userId: 5, postId: 4 }, { userId: 8, postId: 4 },
    { userId: 6, postId: 5 }, { userId: 8, postId: 5 },
    { userId: 3, postId: 6 }, { userId: 7, postId: 6 }, { userId: 9, postId: 6 }, { userId: 10, postId: 6 },
    { userId: 1, postId: 7 }, { userId: 9, postId: 7 },
    { userId: 2, postId: 8 }, { userId: 4, postId: 8 }, { userId: 10, postId: 8 },
    { userId: 1, postId: 9 }, { userId: 5, postId: 9 },
    { userId: 3, postId: 10 }, { userId: 6, postId: 10 }, { userId: 7, postId: 10 },
    { userId: 8, postId: 11 }, { userId: 2, postId: 11 },
    { userId: 1, postId: 12 }, { userId: 9, postId: 12 },
    { userId: 4, postId: 13 }, { userId: 10, postId: 13 }, { userId: 6, postId: 13 },
    { userId: 2, postId: 14 }, { userId: 7, postId: 14 },
    { userId: 5, postId: 15 }, { userId: 7, postId: 15 }, { userId: 8, postId: 15 }, { userId: 9, postId: 15 },
    { userId: 6, postId: 17 }, { userId: 4, postId: 17 },
    { userId: 8, postId: 18 }, { userId: 3, postId: 18 }, { userId: 10, postId: 18 },
    { userId: 1, postId: 19 }, { userId: 9, postId: 19 },
    { userId: 5, postId: 20 }, { userId: 10, postId: 20 }, { userId: 2, postId: 20 },
  ];

  for (const like of likes) {
    await db.run(
      'INSERT INTO likes (userId, postId) VALUES (?, ?)',
      [like.userId, like.postId]
    );
  }
  console.log(`✅ Inserted ${likes.length} likes`);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\nSummary:');
  console.log(`- ${users.length} users`);
  console.log(`- ${categories.length} categories`);
  console.log(`- ${tags.length} tags`);
  console.log(`- ${posts.length} posts`);
  console.log(`- ${comments.length} comments`);
  console.log(`- ${likes.length} likes`);
}

seed().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
