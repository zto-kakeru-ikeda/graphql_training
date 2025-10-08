<template>
  <div class="login-page">
    <div class="login-container">
      <h1>🔐 ログイン</h1>
      <p class="subtitle">ユーザー名とメールアドレスを入力してください</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">ユーザー名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="tanaka_taro"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">メールアドレス</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="tanaka@example.com"
            required
          />
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? 'ログイン中...' : 'ログイン' }}
        </button>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>

      <div class="demo-users">
        <h3>📝 デモユーザー</h3>
        <p class="hint">以下のユーザーでログインできます：</p>
        <div class="user-list">
          <div
            v-for="user in demoUsers"
            :key="user.username"
            class="user-card"
            @click="fillCredentials(user.username, user.email)"
          >
            <strong>{{ user.fullName }}</strong>
            <span>@{{ user.username }}</span>
            <span class="email">{{ user.email }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import { LOGIN } from '../graphql/queries';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { login: setAuthUser } = useAuth();

const username = ref('');
const email = ref('');
const errorMessage = ref('');

const { mutate: loginMutation, loading } = useMutation(LOGIN);

const demoUsers = [
  { username: 'tanaka_taro', email: 'tanaka@example.com', fullName: '田中太郎' },
  { username: 'suzuki_hanako', email: 'suzuki@example.com', fullName: '鈴木花子' },
  { username: 'sato_jiro', email: 'sato@example.com', fullName: '佐藤次郎' },
  { username: 'watanabe_yuki', email: 'watanabe@example.com', fullName: '渡辺由希' },
];

function fillCredentials(user: string, mail: string) {
  username.value = user;
  email.value = mail;
}

async function handleLogin() {
  errorMessage.value = '';

  try {
    const result = await loginMutation({
      username: username.value,
      email: email.value,
    });

    if (result?.data?.login) {
      setAuthUser(result.data.login.user);
      alert(result.data.login.message);
      router.push('/');
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'ログインに失敗しました';
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-container {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
}

h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-login {
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 1rem;
  background: #fee;
  color: #c00;
  border-radius: 8px;
  text-align: center;
}

.demo-users {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #ecf0f1;
}

.demo-users h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.hint {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-card {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-card:hover {
  background: #667eea;
  color: white;
  transform: translateX(5px);
}

.user-card strong {
  font-size: 1rem;
}

.user-card span {
  font-size: 0.9rem;
  opacity: 0.8;
}

.user-card .email {
  font-size: 0.85rem;
}
</style>
