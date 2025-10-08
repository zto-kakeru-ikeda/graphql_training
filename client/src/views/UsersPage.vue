<template>
  <div class="users-page">
    <h1>👥 Users</h1>

    <!-- 新規ユーザー追加ボタン -->
    <div class="add-user-section">
      <button @click="toggleForm" class="btn-add">
        {{ showForm ? '❌ キャンセル' : '➕ 新規ユーザー追加' }}
      </button>
    </div>

    <!-- ユーザー作成フォーム -->
    <div v-if="showForm" class="user-form">
      <h2>新しいユーザーを作成</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">ユーザー名 *</label>
          <input 
            id="username" 
            v-model="formData.username" 
            type="text" 
            required 
            placeholder="例: johndoe"
          />
        </div>

        <div class="form-group">
          <label for="email">メールアドレス *</label>
          <input 
            id="email" 
            v-model="formData.email" 
            type="email" 
            required 
            placeholder="例: john@example.com"
          />
        </div>

        <div class="form-group">
          <label for="fullName">フルネーム *</label>
          <input 
            id="fullName" 
            v-model="formData.fullName" 
            type="text" 
            required 
            placeholder="例: John Doe"
          />
        </div>

        <div class="form-group">
          <label for="bio">自己紹介</label>
          <textarea 
            id="bio" 
            v-model="formData.bio" 
            rows="3" 
            placeholder="あなたについて教えてください"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="avatar">アバターURL</label>
          <input 
            id="avatar" 
            v-model="formData.avatar" 
            type="url" 
            placeholder="例: https://i.pravatar.cc/150?img=5"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="creating || !isFormValid">
            {{ creating ? '作成中...' : '✅ ユーザーを作成' }}
          </button>
        </div>

        <div v-if="createError" class="error-message">
          エラー: {{ createError.message }}
        </div>
      </form>
    </div>
    
    <div v-if="loading" class="loading">Loading users...</div>
    <div v-else-if="error" class="error">Error: {{ error.message }}</div>
    <div v-else-if="users.length > 0" class="users-grid">
      <div v-for="user in users" :key="user.id" class="user-card">
        <img :src="user.avatar || 'https://via.placeholder.com/100'" :alt="user.fullName" class="avatar" />
        <h3>{{ user.fullName }}</h3>
        <p class="username">@{{ user.username }}</p>
        <p class="email">{{ user.email }}</p>
        <p class="bio">{{ user.bio || 'No bio available' }}</p>
        <div class="posts-count">
          📝 {{ user.posts.length }} posts
        </div>
      </div>
    </div>

    <div class="back-link">
      <router-link to="/" class="btn">← Back to Home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsers } from '../composables/useUsers';

// ========================================
// ビジネスロジックはuseUsersコンポーザブルに委譲
// このコンポーネントはView責務のみ
// ========================================
const {
  // 一覧関連
  users,
  loading,
  error,
  
  // フォーム関連
  showForm,
  formData,
  toggleForm,
  isFormValid,
  
  // ミューテーション関連
  createUser,
  creating,
  createError,
} = useUsers();

/**
 * フォーム送信ハンドラ（View層の責務）
 */
const handleSubmit = async () => {
  const success = await createUser();
  if (success) {
    alert('✅ ユーザーが作成されました！');
  }
};
</script>

<style scoped>
.users-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

/* 新規追加ボタンセクション */
.add-user-section {
  text-align: center;
  margin-bottom: 2rem;
}

.btn-add {
  padding: 1rem 2rem;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.btn-add:hover {
  background: #229954;
  transform: translateY(-2px);
}

/* ユーザー作成フォーム */
.user-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 3rem;
}

.user-form h2 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ecf0f1;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  text-align: center;
  margin-top: 2rem;
}

.btn-submit {
  padding: 1rem 3rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-2px);
}

.btn-submit:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #ffebee;
  color: #c62828;
  border-radius: 6px;
  text-align: center;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.user-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid #3498db;
}

h3 {
  color: #2c3e50;
  margin: 0.5rem 0;
}

.username {
  color: #3498db;
  font-weight: 500;
  margin: 0.25rem 0;
}

.email {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.bio {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 1rem 0;
  min-height: 3rem;
}

.posts-count {
  background: #ecf0f1;
  padding: 0.5rem;
  border-radius: 6px;
  color: #2c3e50;
  font-weight: 500;
}

.back-link {
  text-align: center;
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 1rem 2rem;
  background: #95a5a6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background 0.3s;
}

.btn:hover {
  background: #7f8c8d;
}
</style>
